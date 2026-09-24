"use client";

import {
  type FormEvent,
  type KeyboardEvent,
  type MouseEvent,
  type UIEvent,
  useEffect,
  useId,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";
import {
  Copy,
  Download,
  FileCode2,
  FilePlus2,
  Files,
  MoreHorizontal,
  Pencil,
  Play,
  Search,
  Terminal,
  Trash2,
  TriangleAlert,
} from "lucide-react";
import {
  ejecutarProyectoPython,
  estadoPython,
  suscribirsePython,
} from "@/lib/pyodide";
import {
  crearAlmacenProyectoPython,
  leerProyectoPython,
  PROYECTO_INICIAL_PYTHON,
  type ArchivoProyectoPython,
  type ProyectoPython,
} from "@/lib/borrador-python";

const boton =
  "inline-flex items-center justify-center gap-2 rounded-md border border-borde-fuerte bg-fondo px-3 py-1.5 text-xs font-medium text-texto-suave transition-colors hover:border-rojo-acento hover:text-rojo-acento disabled:cursor-not-allowed disabled:opacity-50";

type Resultado = { salida: string; error: boolean } | null;
type Edicion =
  | { modo: "crear" }
  | { modo: "renombrar"; id: string }
  | null;
type MenuArchivo = { id: string; x: number; y: number } | null;

function posicionCursor(codigo: string, indice: number) {
  const antes = codigo.slice(0, indice);
  const lineas = antes.split("\n");
  return {
    linea: lineas.length,
    columna: (lineas.at(-1)?.length ?? 0) + 1,
  };
}

function validarNombre(
  nombre: string,
  archivos: ArchivoProyectoPython[],
  ignorarId?: string,
) {
  const limpio = nombre.trim();
  if (!limpio) return "Escribe un nombre de archivo.";
  if (limpio.length > 80) return "El nombre no puede superar 80 caracteres.";
  if (limpio === "." || limpio === ".." || /[\\/]/.test(limpio)) {
    return "Usa un nombre simple, sin rutas ni barras.";
  }
  if (
    archivos.some(
      (archivo) => archivo.id !== ignorarId && archivo.nombre === limpio,
    )
  ) {
    return "Ya existe un archivo con ese nombre.";
  }
  return null;
}

function nombreNuevo(archivos: ArchivoProyectoPython[]) {
  const ocupados = new Set(archivos.map((archivo) => archivo.nombre));
  if (!ocupados.has("nuevo_archivo.py")) return "nuevo_archivo.py";
  let numero = 2;
  while (ocupados.has(`nuevo_archivo_${numero}.py`)) numero++;
  return `nuevo_archivo_${numero}.py`;
}

function nombreDuplicado(
  nombre: string,
  archivos: ArchivoProyectoPython[],
) {
  const punto = nombre.lastIndexOf(".");
  const base = punto > 0 ? nombre.slice(0, punto) : nombre;
  const extension = punto > 0 ? nombre.slice(punto) : "";
  const ocupados = new Set(archivos.map((archivo) => archivo.nombre));

  let candidato = `${base} copia${extension}`;
  let numero = 2;
  while (ocupados.has(candidato)) {
    candidato = `${base} copia ${numero}${extension}`;
    numero++;
  }
  return candidato;
}

function nuevoId() {
  return globalThis.crypto?.randomUUID?.() ??
    `archivo-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function SandboxPython() {
  const id = useId();
  const almacen = useMemo(() => crearAlmacenProyectoPython(), []);
  const texto = useSyncExternalStore(
    almacen.suscribir,
    almacen.leer,
    () => PROYECTO_INICIAL_PYTHON,
  );
  const proyecto = useMemo(() => leerProyectoPython(texto), [texto]);
  const activo = useMemo(
    () =>
      proyecto.archivos.find((archivo) => archivo.id === proyecto.activoId) ??
      null,
    [proyecto],
  );
  const preparacion = useSyncExternalStore(
    suscribirsePython,
    estadoPython,
    () => "sin-empezar" as const,
  );

  const [ejecutando, setEjecutando] = useState(false);
  const [resultado, setResultado] = useState<Resultado>(null);
  const [guardado, setGuardado] = useState(true);
  const [scrollEditor, setScrollEditor] = useState(0);
  const [cursor, setCursor] = useState({ linea: 1, columna: 1 });
  const [edicion, setEdicion] = useState<Edicion>(null);
  const [nombreEdicion, setNombreEdicion] = useState("");
  const [menuArchivo, setMenuArchivo] = useState<MenuArchivo>(null);
  const [mensaje, setMensaje] = useState<string | null>(null);

  const lineas = useMemo(
    () =>
      Array.from(
        { length: (activo?.codigo ?? "").split("\n").length },
        (_, indice) => indice + 1,
      ),
    [activo?.codigo],
  );

  useEffect(() => {
    if (!menuArchivo) return;

    const cerrar = () => setMenuArchivo(null);
    const tecla = (evento: globalThis.KeyboardEvent) => {
      if (evento.key === "Escape") cerrar();
    };

    window.addEventListener("pointerdown", cerrar);
    window.addEventListener("keydown", tecla);
    return () => {
      window.removeEventListener("pointerdown", cerrar);
      window.removeEventListener("keydown", tecla);
    };
  }, [menuArchivo]);

  function guardarProyecto(siguiente: ProyectoPython) {
    setGuardado(almacen.guardar(siguiente));
  }

  function cambiarCodigo(codigo: string) {
    if (!activo) return;
    guardarProyecto({
      ...proyecto,
      archivos: proyecto.archivos.map((archivo) =>
        archivo.id === activo.id ? { ...archivo, codigo } : archivo,
      ),
    });
  }

  function seleccionarArchivo(archivoId: string) {
    if (archivoId === proyecto.activoId) return;
    guardarProyecto({ ...proyecto, activoId: archivoId });
    setResultado(null);
    setScrollEditor(0);
    setCursor({ linea: 1, columna: 1 });
    setMensaje(null);
  }

  async function ejecutar() {
    if (
      ejecutando ||
      !activo ||
      !activo.nombre.toLowerCase().endsWith(".py")
    ) {
      return;
    }

    setEjecutando(true);
    setResultado(null);
    const respuesta = await ejecutarProyectoPython(
      proyecto.archivos.map(({ nombre, codigo }) => ({ nombre, codigo })),
      activo.nombre,
    );
    setResultado(respuesta);
    setEjecutando(false);
  }

  function descargarArchivo(archivo: ArchivoProyectoPython) {
    const url = URL.createObjectURL(
      new Blob([archivo.codigo], { type: "text/plain;charset=utf-8" }),
    );
    const enlace = document.createElement("a");
    enlace.href = url;
    enlace.download = archivo.nombre;
    document.body.appendChild(enlace);
    enlace.click();
    enlace.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function iniciarCrear() {
    if (proyecto.archivos.length >= 50) {
      setMensaje("El sandbox admite hasta 50 archivos.");
      return;
    }
    setNombreEdicion(nombreNuevo(proyecto.archivos));
    setEdicion({ modo: "crear" });
    setMenuArchivo(null);
    setMensaje(null);
  }

  function iniciarRenombrar(archivo: ArchivoProyectoPython) {
    setNombreEdicion(archivo.nombre);
    setEdicion({ modo: "renombrar", id: archivo.id });
    setMenuArchivo(null);
    setMensaje(null);
  }

  function confirmarEdicion(evento?: FormEvent) {
    evento?.preventDefault();
    const ignorarId = edicion?.modo === "renombrar" ? edicion.id : undefined;
    const error = validarNombre(nombreEdicion, proyecto.archivos, ignorarId);
    if (error) {
      setMensaje(error);
      return;
    }

    const nombre = nombreEdicion.trim();

    if (edicion?.modo === "crear") {
      const archivo: ArchivoProyectoPython = {
        id: nuevoId(),
        nombre,
        codigo: "",
      };
      guardarProyecto({
        archivos: [...proyecto.archivos, archivo],
        activoId: archivo.id,
      });
      setResultado(null);
      setCursor({ linea: 1, columna: 1 });
    } else if (edicion?.modo === "renombrar") {
      guardarProyecto({
        ...proyecto,
        archivos: proyecto.archivos.map((archivo) =>
          archivo.id === edicion.id ? { ...archivo, nombre } : archivo,
        ),
      });
    }

    setEdicion(null);
    setNombreEdicion("");
    setMensaje(null);
  }

  function duplicarArchivo(archivo: ArchivoProyectoPython) {
    if (proyecto.archivos.length >= 50) {
      setMensaje("El sandbox admite hasta 50 archivos.");
      return;
    }

    const copia: ArchivoProyectoPython = {
      ...archivo,
      id: nuevoId(),
      nombre: nombreDuplicado(archivo.nombre, proyecto.archivos),
    };
    guardarProyecto({
      archivos: [...proyecto.archivos, copia],
      activoId: copia.id,
    });
    setResultado(null);
    setMenuArchivo(null);
  }

  function eliminarArchivo(archivo: ArchivoProyectoPython) {
    if (
      !window.confirm(
        `¿Eliminar "${archivo.nombre}"? Esta acción elimina su contenido guardado localmente.`,
      )
    ) {
      return;
    }

    const indice = proyecto.archivos.findIndex(
      (actual) => actual.id === archivo.id,
    );
    const restantes = proyecto.archivos.filter(
      (actual) => actual.id !== archivo.id,
    );
    const siguienteActivo =
      proyecto.activoId === archivo.id
        ? (restantes[Math.min(indice, restantes.length - 1)]?.id ?? null)
        : proyecto.activoId;

    guardarProyecto({
      archivos: restantes,
      activoId: siguienteActivo,
    });
    setResultado(null);
    setMenuArchivo(null);
    setCursor({ linea: 1, columna: 1 });
  }

  function abrirMenu(
    evento: MouseEvent,
    archivo: ArchivoProyectoPython,
  ) {
    evento.preventDefault();
    evento.stopPropagation();
    setMenuArchivo({
      id: archivo.id,
      x: Math.min(evento.clientX, window.innerWidth - 190),
      y: Math.min(evento.clientY, window.innerHeight - 190),
    });
  }

  function manejarTecla(evento: KeyboardEvent<HTMLTextAreaElement>) {
    if ((evento.ctrlKey || evento.metaKey) && evento.key === "Enter") {
      evento.preventDefault();
      void ejecutar();
      return;
    }

    if (evento.key !== "Tab") return;

    evento.preventDefault();
    const editor = evento.currentTarget;
    const inicio = editor.selectionStart;
    const fin = editor.selectionEnd;
    const codigo = activo?.codigo ?? "";
    const siguiente =
      codigo.slice(0, inicio) + "    " + codigo.slice(fin);

    cambiarCodigo(siguiente);
    requestAnimationFrame(() => {
      editor.selectionStart = inicio + 4;
      editor.selectionEnd = inicio + 4;
      setCursor(posicionCursor(siguiente, inicio + 4));
    });
  }

  function sincronizarScroll(evento: UIEvent<HTMLTextAreaElement>) {
    setScrollEditor(evento.currentTarget.scrollTop);
  }

  const archivoMenu = menuArchivo
    ? proyecto.archivos.find((archivo) => archivo.id === menuArchivo.id) ?? null
    : null;
  const ejecutable = Boolean(
    activo?.nombre.toLowerCase().endsWith(".py"),
  );

  return (
    <div data-sandbox-python>
      <div className="overflow-hidden rounded-xl border border-borde bg-superficie shadow-sm">
        <div className="flex min-h-11 items-center justify-between gap-3 border-b border-borde bg-fondo px-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="hidden items-center gap-1.5 sm:flex" aria-hidden="true">
              <span className="size-2.5 rounded-full bg-rojo-acento/80" />
              <span className="size-2.5 rounded-full bg-texto-tenue/50" />
              <span className="size-2.5 rounded-full bg-texto-tenue/30" />
            </div>
            <p className="truncate font-mono text-xs text-texto-suave">
              {activo?.nombre ?? "Sin archivo"}{" "}
              <span className="text-texto-tenue">— eduqa.pe</span>
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={() => activo && descargarArchivo(activo)}
              disabled={!activo}
              className={boton}
            >
              <Download size={14} aria-hidden="true" />
              <span className="hidden sm:inline">Descargar</span>
            </button>
            <button
              type="button"
              onClick={ejecutar}
              disabled={ejecutando || !ejecutable}
              title={
                activo && !ejecutable
                  ? "Solo los archivos .py se pueden ejecutar."
                  : undefined
              }
              aria-keyshortcuts="Control+Enter"
              className="inline-flex items-center gap-2 rounded-md bg-rojo px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-rojo-hover disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Play
                size={14}
                aria-hidden="true"
                className={ejecutando ? "animate-pulse" : ""}
              />
              {ejecutando
                ? preparacion === "listo"
                  ? "Ejecutando…"
                  : "Cargando Python…"
                : "Ejecutar"}
              <kbd className="hidden rounded border border-white/20 px-1.5 py-0.5 font-mono text-[10px] font-normal text-white/75 lg:inline">
                Ctrl+Enter
              </kbd>
            </button>
          </div>
        </div>

        <div className="grid min-h-[36rem] min-w-0 grid-cols-[2.75rem_minmax(0,1fr)] lg:grid-cols-[2.75rem_12rem_minmax(0,1fr)]">
          <aside
            className="flex flex-col items-center gap-1 border-r border-borde bg-fondo py-2"
            aria-label="Barra de actividad del editor"
          >
            <button
              type="button"
              className="grid size-9 place-items-center border-l-2 border-rojo-acento text-texto"
              aria-label="Explorador"
              title="Explorador"
            >
              <Files size={19} aria-hidden="true" />
            </button>
            <button
              type="button"
              className="grid size-9 place-items-center border-l-2 border-transparent text-texto-tenue transition-colors hover:text-texto"
              aria-label="Buscar"
              title="Buscar"
            >
              <Search size={18} aria-hidden="true" />
            </button>
            <button
              type="button"
              className="grid size-9 place-items-center border-l-2 border-transparent text-texto-tenue transition-colors hover:text-texto"
              aria-label="Terminal"
              title="Terminal"
            >
              <Terminal size={18} aria-hidden="true" />
            </button>
          </aside>

          <aside className="hidden min-w-0 border-r border-borde bg-superficie lg:block">
            <div className="flex h-9 items-center justify-between px-3">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-texto-suave">
                Explorador
              </span>
              <button
                type="button"
                onClick={iniciarCrear}
                className="grid size-6 place-items-center rounded text-texto-tenue transition-colors hover:bg-fondo hover:text-texto"
                aria-label="Nuevo archivo"
                title="Nuevo archivo"
              >
                <FilePlus2 size={15} aria-hidden="true" />
              </button>
            </div>

            <div className="border-t border-borde py-1">
              <div className="flex items-center justify-between px-3 py-1">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-texto-tenue">
                  Sandbox
                </p>
                <span className="font-mono text-[9px] text-texto-tenue">
                  {proyecto.archivos.length}
                </span>
              </div>

              <div className="min-h-8">
                {proyecto.archivos.map((archivo) =>
                  edicion?.modo === "renombrar" && edicion.id === archivo.id ? (
                    <form
                      key={archivo.id}
                      onSubmit={confirmarEdicion}
                      className="px-2 py-0.5"
                    >
                      <input
                        autoFocus
                        value={nombreEdicion}
                        onChange={(evento) => setNombreEdicion(evento.target.value)}
                        onBlur={() => confirmarEdicion()}
                        onKeyDown={(evento) => {
                          if (evento.key === "Escape") {
                            setEdicion(null);
                            setMensaje(null);
                          }
                        }}
                        className="h-7 w-full rounded-sm border border-rojo-acento bg-fondo px-2 font-mono text-xs text-texto outline-none"
                        aria-label="Renombrar archivo"
                      />
                    </form>
                  ) : (
                    <div
                      key={archivo.id}
                      className={`group flex cursor-default items-center gap-1 px-2 py-1 text-xs ${
                        archivo.id === proyecto.activoId
                          ? "bg-rojo-tenue text-texto"
                          : "text-texto-suave hover:bg-fondo"
                      }`}
                      onClick={() => seleccionarArchivo(archivo.id)}
                      onDoubleClick={() => iniciarRenombrar(archivo)}
                      onContextMenu={(evento) => abrirMenu(evento, archivo)}
                    >
                      <FileCode2
                        size={14}
                        className="shrink-0 text-rojo-acento"
                        aria-hidden="true"
                      />
                      <span className="min-w-0 flex-1 truncate font-mono">
                        {archivo.nombre}
                      </span>
                      <button
                        type="button"
                        onClick={(evento) => abrirMenu(evento, archivo)}
                        className="grid size-6 shrink-0 place-items-center rounded opacity-0 transition-opacity hover:bg-superficie group-hover:opacity-100 focus:opacity-100"
                        aria-label={`Opciones de ${archivo.nombre}`}
                        title="Más acciones"
                      >
                        <MoreHorizontal size={14} aria-hidden="true" />
                      </button>
                    </div>
                  ),
                )}

                {edicion?.modo === "crear" && (
                  <form onSubmit={confirmarEdicion} className="px-2 py-0.5">
                    <div className="flex items-center gap-1">
                      <FileCode2
                        size={14}
                        className="shrink-0 text-rojo-acento"
                        aria-hidden="true"
                      />
                      <input
                        autoFocus
                        value={nombreEdicion}
                        onChange={(evento) => setNombreEdicion(evento.target.value)}
                        onBlur={() => confirmarEdicion()}
                        onKeyDown={(evento) => {
                          if (evento.key === "Escape") {
                            setEdicion(null);
                            setMensaje(null);
                          }
                        }}
                        className="h-7 min-w-0 flex-1 rounded-sm border border-rojo-acento bg-fondo px-2 font-mono text-xs text-texto outline-none"
                        aria-label="Nombre del nuevo archivo"
                      />
                    </div>
                  </form>
                )}

                {proyecto.archivos.length === 0 && edicion?.modo !== "crear" && (
                  <button
                    type="button"
                    onClick={iniciarCrear}
                    className="mx-3 mt-2 text-left text-xs text-texto-tenue hover:text-rojo-acento"
                  >
                    + Crear archivo
                  </button>
                )}
              </div>
            </div>
          </aside>

          <section className="flex min-w-0 flex-col bg-fondo">
            <div className="flex h-9 items-end border-b border-borde bg-superficie">
              {activo ? (
                <div className="flex h-full min-w-36 max-w-60 items-center gap-2 border-r border-borde border-t-2 border-t-rojo-acento bg-fondo px-3 text-xs">
                  <FileCode2 size={13} className="shrink-0 text-rojo-acento" aria-hidden="true" />
                  <span className="truncate font-mono">{activo.nombre}</span>
                </div>
              ) : (
                <span className="px-3 pb-2 text-xs text-texto-tenue">
                  Sin archivo abierto
                </span>
              )}
            </div>

            <div className="relative min-h-0 flex-1 overflow-hidden">
              {activo ? (
                <>
                  <label htmlFor={`${id}-codigo`} className="sr-only">
                    Contenido de {activo.nombre}
                  </label>

                  <div
                    className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 overflow-hidden border-r border-borde bg-superficie/60 pt-4 text-right font-mono text-xs leading-6 text-texto-tenue"
                    aria-hidden="true"
                  >
                    <div
                      className="pr-3"
                      style={{ transform: `translateY(-${scrollEditor}px)` }}
                    >
                      {lineas.map((linea) => (
                        <div key={linea}>{linea}</div>
                      ))}
                    </div>
                  </div>

                  <textarea
                    id={`${id}-codigo`}
                    value={activo.codigo}
                    onChange={(evento) => {
                      cambiarCodigo(evento.target.value);
                      setCursor(
                        posicionCursor(
                          evento.target.value,
                          evento.target.selectionStart,
                        ),
                      );
                    }}
                    onSelect={(evento) =>
                      setCursor(
                        posicionCursor(
                          evento.currentTarget.value,
                          evento.currentTarget.selectionStart,
                        ),
                      )
                    }
                    onScroll={sincronizarScroll}
                    onKeyDown={manejarTecla}
                    disabled={ejecutando}
                    maxLength={50_000}
                    spellCheck={false}
                    autoCapitalize="off"
                    autoCorrect="off"
                    className="absolute inset-0 h-full min-h-[21rem] w-full resize-none overflow-auto whitespace-pre bg-transparent py-4 pl-16 pr-4 font-mono text-sm leading-6 text-texto caret-rojo-acento outline-none selection:bg-rojo-tenue disabled:opacity-60"
                  />
                </>
              ) : (
                <div className="grid h-full min-h-[21rem] place-items-center p-8 text-center">
                  <div>
                    <FilePlus2
                      size={28}
                      className="mx-auto mb-3 text-texto-tenue"
                      aria-hidden="true"
                    />
                    <p className="text-sm font-medium">No hay archivos en el sandbox</p>
                    <button
                      type="button"
                      onClick={iniciarCrear}
                      className="mt-2 text-xs text-rojo-acento hover:underline"
                    >
                      Crear un archivo
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="border-t border-borde bg-superficie">
              <div className="flex h-9 items-center border-b border-borde px-3">
                <div className="flex h-full items-center gap-5">
                  <span className="flex h-full items-center border-b-2 border-rojo-acento text-[11px] font-semibold uppercase tracking-wide text-texto">
                    Terminal
                  </span>
                  <span className="text-[11px] uppercase tracking-wide text-texto-tenue">
                    Salida
                  </span>
                </div>
              </div>

              <div
                role="status"
                aria-live="polite"
                data-salida-sandbox-python
                className="h-40 overflow-auto p-3 font-mono text-xs leading-5"
              >
                <p className="text-texto-tenue">
                  <span className="text-rojo-acento">$</span>{" "}
                  {activo?.nombre.toLowerCase().endsWith(".py")
                    ? `python ${activo.nombre}`
                    : "python"}
                </p>

                {ejecutando ? (
                  <p className="mt-1 text-texto-suave">
                    {preparacion === "listo"
                      ? "Ejecutando el programa…"
                      : "Preparando Python en el navegador…"}
                  </p>
                ) : resultado ? (
                  <div className="mt-1">
                    {resultado.error && (
                      <p className="mb-1 flex items-center gap-1.5 text-rojo-acento">
                        <TriangleAlert size={13} aria-hidden="true" />
                        No se completó la ejecución
                      </p>
                    )}
                    <pre
                      className={
                        resultado.error
                          ? "whitespace-pre-wrap break-words text-rojo-acento"
                          : "whitespace-pre-wrap break-words text-texto"
                      }
                    >
                      {resultado.salida || "El programa terminó sin imprimir salida."}
                    </pre>
                  </div>
                ) : (
                  <p className="mt-1 text-texto-tenue">
                    {activo
                      ? ejecutable
                        ? "Ejecuta el archivo para ver aquí la salida real de Python."
                        : "Este archivo se guarda en el proyecto, pero solo los .py se ejecutan."
                      : "Crea o abre un archivo .py para comenzar."}
                  </p>
                )}
              </div>
            </div>

            <div className="flex min-h-6 flex-wrap items-center justify-between gap-x-4 gap-y-1 bg-rojo px-3 py-1 font-mono text-[10px] text-white">
              <div className="flex items-center gap-3">
                <span>Python 3 · WebAssembly</span>
                <span className="hidden sm:inline">
                  {guardado ? "Proyecto guardado localmente" : "Sin guardar"}
                </span>
              </div>
              <div className="flex items-center gap-3">
                {activo && <span>Ln {cursor.linea}, Col {cursor.columna}</span>}
                <span className="hidden sm:inline">Spaces: 4</span>
                <span className="hidden sm:inline">UTF-8</span>
                <span>LF</span>
              </div>
            </div>
          </section>
        </div>
      </div>

      {archivoMenu && menuArchivo && (
        <div
          role="menu"
          className="fixed z-50 w-44 overflow-hidden rounded-md border border-borde bg-fondo py-1 text-xs text-texto shadow-xl"
          style={{ left: menuArchivo.x, top: menuArchivo.y }}
          onPointerDown={(evento) => evento.stopPropagation()}
        >
          <button
            type="button"
            role="menuitem"
            onClick={() => iniciarRenombrar(archivoMenu)}
            className="flex w-full items-center gap-2 px-3 py-2 text-left hover:bg-superficie"
          >
            <Pencil size={13} aria-hidden="true" />
            Renombrar
          </button>
          <button
            type="button"
            role="menuitem"
            onClick={() => duplicarArchivo(archivoMenu)}
            className="flex w-full items-center gap-2 px-3 py-2 text-left hover:bg-superficie"
          >
            <Copy size={13} aria-hidden="true" />
            Duplicar
          </button>
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              descargarArchivo(archivoMenu);
              setMenuArchivo(null);
            }}
            className="flex w-full items-center gap-2 px-3 py-2 text-left hover:bg-superficie"
          >
            <Download size={13} aria-hidden="true" />
            Descargar
          </button>
          <div className="my-1 border-t border-borde" />
          <button
            type="button"
            role="menuitem"
            onClick={() => eliminarArchivo(archivoMenu)}
            className="flex w-full items-center gap-2 px-3 py-2 text-left text-rojo-acento hover:bg-rojo-tenue"
          >
            <Trash2 size={13} aria-hidden="true" />
            Eliminar
          </button>
        </div>
      )}

      {mensaje && (
        <p role="alert" className="mt-3 text-sm text-rojo-acento">
          {mensaje}
        </p>
      )}

      {!guardado && (
        <p role="alert" className="mt-3 text-sm text-rojo-acento">
          No pudimos guardar el proyecto. Descarga los archivos que quieras conservar.
        </p>
      )}
    </div>
  );
}
