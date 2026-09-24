/**
 * Carga de Pyodide, compartida por toda la lección.
 *
 * Pyodide es CPython compilado a WebAssembly. Lo mantiene el equipo de
 * Pyodide dentro de la organización de Python, sigue las versiones del
 * intérprete y es lo que hay debajo de JupyterLite y PyScript.
 *
 * El código corre en la máquina de quien lee, dentro del entorno aislado del
 * navegador: no hay servidor de por medio y nada de lo que se ejecute puede
 * tocar la plataforma.
 */

// Versión fijada a propósito, no "latest": una actualización del CDN no debe
// cambiar el comportamiento de una lección sin que nadie lo haya revisado.
const VERSION = "314.0.3";
const CDN = `https://cdn.jsdelivr.net/pyodide/v${VERSION}/full/`;

export type Pyodide = {
  loadPackage: (nombre: string) => Promise<void>;
  runPython: (codigo: string) => unknown;
  runPythonAsync: (
    codigo: string,
    opciones?: { globals?: unknown },
  ) => Promise<unknown>;
  setStdout: (opciones: { batched: (texto: string) => void }) => void;
  setStderr: (opciones: { batched: (texto: string) => void }) => void;
};

/*
 * Una sola instancia por pestaña. Se guarda la promesa y no el resultado para
 * que dos pulsaciones seguidas no arranquen dos descargas: el intérprete pesa
 * decenas de megabytes y solo baja cuando alguien lo pide por primera vez.
 */
let cargando: Promise<Pyodide> | null = null;

export function pyodideCargado() {
  return cargando !== null;
}

/*
 * Estado de preparación, observable desde los componentes.
 *
 * El intérprete y sus paquetes se traen al abrir la sesión, no al pulsar
 * "Ejecutar": así, cuando alguien llega al primer bloque, ya está listo. Los
 * componentes se suscriben para saber si todavía se está preparando.
 */
export type EstadoPython = "sin-empezar" | "preparando" | "listo" | "error";

let estado: EstadoPython = "sin-empezar";
const oyentes = new Set<() => void>();

function cambiarEstado(nuevo: EstadoPython) {
  estado = nuevo;
  oyentes.forEach((avisar) => avisar());
}

export function estadoPython() {
  return estado;
}

export function suscribirsePython(avisar: () => void) {
  oyentes.add(avisar);
  return () => {
    oyentes.delete(avisar);
  };
}

/**
 * Deja el intérprete y los paquetes del curso listos para usar.
 *
 * Es idempotente: llamarla dos veces no descarga nada dos veces, porque tanto
 * la carga de Pyodide como la instalación de paquetes ya se guardan.
 */
export async function prepararPython(paquetes: string[] = []) {
  if (estado === "preparando" || estado === "listo") return;
  cambiarEstado("preparando");

  try {
    const py = await obtenerPyodide();
    if (paquetes.length > 0) await instalarPaquetes(py, paquetes);
    cambiarEstado("listo");
  } catch (e) {
    console.error("[prepararPython]", e);
    cambiarEstado("error");
  }
}

export function obtenerPyodide(): Promise<Pyodide> {
  if (!cargando) {
    cargando = (async () => {
      // `webpackIgnore` evita que el empaquetador intente resolver la URL en
      // tiempo de compilación: el módulo vive en el CDN, no en el proyecto.
      const { loadPyodide } = await import(
        /* webpackIgnore: true */ `${CDN}pyodide.mjs`
      );
      return loadPyodide({ indexURL: CDN }) as Promise<Pyodide>;
    })();
  }
  return cargando;
}

/*
 * Paquetes de PyPI ya instalados en esta pestaña, para no repetir la descarga
 * en cada ejecución.
 */
const instalados = new Set<string>();

/**
 * Instala paquetes de PyPI con micropip.
 *
 * Solo sirve para paquetes de Python puro, que es lo que micropip resuelve
 * desde PyPI. Los que traen extensiones en C tendrían que venir compilados
 * para WebAssembly y esos se cargan con `loadPackage`, no desde aquí.
 */
async function instalarPaquetes(py: Pyodide, paquetes: string[]) {
  const faltan = paquetes.filter((p) => !instalados.has(p));
  if (faltan.length === 0) return;

  await py.loadPackage("micropip");
  await py.runPythonAsync(
    `import micropip\nawait micropip.install(${JSON.stringify(faltan)})`,
  );
  faltan.forEach((p) => instalados.add(p));
}

/*
 * Preludios ya aplicados en esta pestaña.
 *
 * Un curso puede necesitar unas líneas de preparación —abrir una conexión,
 * importar un módulo— que sus bloques dan por hechas. Se ejecutan una sola
 * vez: repetirlas antes de cada bloque reiniciaría el estado y rompería la
 * continuidad entre un fragmento y el siguiente, que es justo lo que un curso
 * secuencial necesita conservar.
 */
const preparados = new Set<string>();

export function preludioAplicado(preludio?: string) {
  return !preludio || preparados.has(preludio);
}

export type Ejecucion = { salida: string; error: boolean };

/*
 * Cola de ejecución.
 *
 * Hay un solo intérprete por pestaña y su stdout es global: si dos fragmentos
 * corren a la vez, el segundo redirige la salida mientras el primero sigue
 * escribiendo y los resultados se mezclan. Encadenar las llamadas cuesta una
 * espera y evita ese cruce por completo.
 */
let cola: Promise<unknown> = Promise.resolve();

/**
 * Ejecuta un fragmento y devuelve lo que haya escrito en stdout y stderr.
 *
 * El intérprete es el mismo para toda la página, así que lo que un fragmento
 * define sigue disponible para el siguiente, igual que en un cuaderno.
 */
/**
 * Quita del traceback los marcos internos de Pyodide.
 *
 * El intérprete envuelve el código en su propio cargador, así que un error
 * trivial aparece detrás de cinco líneas de `/lib/python314.zip/_pyodide/`
 * que no dicen nada de lo que escribió quien está aprendiendo. Se conserva
 * la cabecera, los marcos del propio código y el mensaje final.
 */
function limpiarTraceback(traza: string) {
  const lineas = traza.split("\n");
  const limpias: string[] = [];

  for (let i = 0; i < lineas.length; i++) {
    const l = lineas[i];
    // Un marco ocupa dos líneas: la del archivo y la del código. Al descartar
    // la primera hay que descartar también la que la acompaña.
    if (/File "[^"]*(_pyodide|pyodide)[^"]*"/.test(l)) {
      while (i + 1 < lineas.length && /^\s{4,}/.test(lineas[i + 1])) i++;
      continue;
    }
    limpias.push(l);
  }

  const texto = limpias.join("\n").trim();
  // Si al filtrar no quedó ningún marco propio, el encabezado sobra: el
  // mensaje de error solo se explica mejor sin él.
  return texto.replace(/^Traceback \(most recent call last\):\n(?!\s)/, "");
}

export async function ejecutarPython(
  codigo: string,
  {
    aislado = false,
    paquetes = [],
    preludio,
    preludioUnaVez,
  }: {
    aislado?: boolean;
    paquetes?: string[];
    /** Se ejecuta antes del código, siempre. Para ejercicios aislados. */
    preludio?: string;
    /** Se ejecuta una sola vez por pestaña. Para bloques encadenados. */
    preludioUnaVez?: string;
  } = {},
): Promise<Ejecucion> {
  const anterior = cola;
  let liberar!: () => void;
  cola = new Promise<void>((r) => (liberar = r));
  await anterior;

  const lineas: string[] = [];
  const recoger = (texto: string) => lineas.push(texto);

  try {
    const py = await obtenerPyodide();
    if (paquetes.length > 0) await instalarPaquetes(py, paquetes);

    // Se redirige después de instalar: micropip escribe en stdout el nombre de
    // cada paquete que descarga y ese ruido no es salida del ejercicio.
    py.setStdout({ batched: recoger });
    py.setStderr({ batched: recoger });

    // Un ejercicio arranca con la mesa limpia: lo que definió el ejercicio
    // anterior no debe resolverle el siguiente. Un diccionario vacío como
    // espacio de nombres basta, porque Python le añade `__builtins__` solo.
    const globales = aislado ? py.runPython("{}") : undefined;
    const opciones = globales ? { globals: globales } : undefined;

    // El preludio corre en el mismo espacio de nombres que el ejercicio, así
    // que lo que deja preparado queda a mano. Su salida no cuenta: se
    // descarta antes de evaluar la respuesta.
    if (preludio) {
      await py.runPythonAsync(preludio, opciones);
      lineas.length = 0;
    }

    if (preludioUnaVez && !preparados.has(preludioUnaVez)) {
      await py.runPythonAsync(preludioUnaVez, opciones);
      preparados.add(preludioUnaVez);
      lineas.length = 0;
    }

    const resultado = await py.runPythonAsync(codigo, opciones);

    // La última expresión se imprime, como en el intérprete interactivo.
    // `None` no: es lo que devuelve todo lo que no devuelve nada.
    if (resultado !== undefined && resultado !== null) recoger(String(resultado));

    return { salida: lineas.join("\n"), error: false };
  } catch (e) {
    // El traceback de Python llega como mensaje de la excepción de JavaScript.
    const traza = limpiarTraceback((e as Error).message);
    return { salida: [...lineas, traza].join("\n"), error: true };
  } finally {
    liberar();
  }
}


/**
 * Ejecuta un archivo dentro de un proyecto local de varios archivos.
 *
 * Los archivos se materializan temporalmente en el filesystem virtual de
 * Pyodide, por lo que imports entre archivos y lecturas relativas funcionan
 * como en un proyecto pequeño de escritorio. El directorio de trabajo se
 * restaura siempre al terminar.
 */
export async function ejecutarProyectoPython(
  archivos: Array<{ nombre: string; codigo: string }>,
  activo: string,
): Promise<Ejecucion> {
  const serializado = JSON.stringify(
    JSON.stringify(
      archivos.map(({ nombre, codigo }) => ({
        nombre,
        codigo,
      })),
    ),
  );
  const nombreActivo = JSON.stringify(activo);

  const programa = `
import json as _json_eduqa
import os as _os_eduqa
import pathlib as _pathlib_eduqa
import runpy as _runpy_eduqa
import shutil as _shutil_eduqa
import sys as _sys_eduqa

_archivos_eduqa = _json_eduqa.loads(${serializado})
_activo_eduqa = ${nombreActivo}
_base_eduqa = _pathlib_eduqa.Path("/tmp/eduqa_python_sandbox")
_base_eduqa.mkdir(parents=True, exist_ok=True)

for _entrada_eduqa in list(_base_eduqa.iterdir()):
    if _entrada_eduqa.is_dir():
        _shutil_eduqa.rmtree(_entrada_eduqa)
    else:
        _entrada_eduqa.unlink()

for _archivo_eduqa in _archivos_eduqa:
    (_base_eduqa / _archivo_eduqa["nombre"]).write_text(
        _archivo_eduqa["codigo"],
        encoding="utf-8",
    )

_cwd_eduqa = _os_eduqa.getcwd()
_ruta_eduqa = str(_base_eduqa)
try:
    _os_eduqa.chdir(_base_eduqa)
    _sys_eduqa.path.insert(0, _ruta_eduqa)
    _runpy_eduqa.run_path(_activo_eduqa, run_name="__main__")
finally:
    _os_eduqa.chdir(_cwd_eduqa)
    if _sys_eduqa.path and _sys_eduqa.path[0] == _ruta_eduqa:
        _sys_eduqa.path.pop(0)

_resultado_eduqa = None
`;

  return ejecutarPython(programa, { aislado: true });
}
