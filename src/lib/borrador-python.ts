export const PROGRAMA_INICIAL_PYTHON = `ventas = [1200, 850, 1400, 990]

total = sum(ventas)
promedio = total / len(ventas)

print(f"Total: {total}")
print(f"Promedio: {promedio:.2f}")
`;

export const BORRADOR_INICIAL_PYTHON = JSON.stringify({
  codigo: PROGRAMA_INICIAL_PYTHON,
});

export type BorradorPython = { codigo: string };

export function leerBorradorPython(texto: string): BorradorPython {
  try {
    const dato = JSON.parse(texto);
    if (typeof dato?.codigo !== "string" || dato.codigo.length > 50_000) {
      throw new Error("Borrador inválido");
    }
    return { codigo: dato.codigo };
  } catch {
    return { codigo: PROGRAMA_INICIAL_PYTHON };
  }
}

export type ArchivoProyectoPython = {
  id: string;
  nombre: string;
  codigo: string;
};

export type ProyectoPython = {
  archivos: ArchivoProyectoPython[];
  activoId: string | null;
};

const ARCHIVO_INICIAL_ID = "sandbox-inicial";

export const PROYECTO_INICIAL_PYTHON = JSON.stringify({
  archivos: [
    {
      id: ARCHIVO_INICIAL_ID,
      nombre: "sandbox.py",
      codigo: PROGRAMA_INICIAL_PYTHON,
    },
  ],
  activoId: ARCHIVO_INICIAL_ID,
} satisfies ProyectoPython);

function nombreValido(nombre: unknown): nombre is string {
  return (
    typeof nombre === "string" &&
    nombre.length > 0 &&
    nombre.length <= 80 &&
    nombre !== "." &&
    nombre !== ".." &&
    !/[\\/]/.test(nombre)
  );
}

export function leerProyectoPython(texto: string): ProyectoPython {
  try {
    const dato = JSON.parse(texto);
    if (!Array.isArray(dato?.archivos) || dato.archivos.length > 50) {
      throw new Error("Proyecto inválido");
    }

    const archivos: ArchivoProyectoPython[] = dato.archivos.map(
      (archivo: unknown) => {
        if (
          typeof archivo !== "object" ||
          archivo === null ||
          typeof (archivo as ArchivoProyectoPython).id !== "string" ||
          (archivo as ArchivoProyectoPython).id.length === 0 ||
          (archivo as ArchivoProyectoPython).id.length > 120 ||
          !nombreValido((archivo as ArchivoProyectoPython).nombre) ||
          typeof (archivo as ArchivoProyectoPython).codigo !== "string" ||
          (archivo as ArchivoProyectoPython).codigo.length > 50_000
        ) {
          throw new Error("Archivo inválido");
        }

        const valido = archivo as ArchivoProyectoPython;
        return {
          id: valido.id,
          nombre: valido.nombre,
          codigo: valido.codigo,
        };
      },
    );

    const ids = new Set(archivos.map((archivo) => archivo.id));
    const nombres = new Set(archivos.map((archivo) => archivo.nombre));
    if (ids.size !== archivos.length || nombres.size !== archivos.length) {
      throw new Error("Proyecto con archivos duplicados");
    }

    const activoId =
      typeof dato.activoId === "string" && ids.has(dato.activoId)
        ? dato.activoId
        : (archivos[0]?.id ?? null);

    return { archivos, activoId };
  } catch {
    return JSON.parse(PROYECTO_INICIAL_PYTHON) as ProyectoPython;
  }
}

/** Snapshot estable para hidratar y conservar el proyecto local del sandbox. */
export function crearAlmacenProyectoPython() {
  const clave = "eduqa:python:sandbox:v2";
  const claveAnterior = "eduqa:python:sandbox:v1";
  let memoria = PROYECTO_INICIAL_PYTHON;
  let sinAlmacenamiento = false;
  const oyentes = new Set<() => void>();

  return {
    leer() {
      if (!sinAlmacenamiento) {
        try {
          const actual = localStorage.getItem(clave);
          if (actual) {
            memoria = actual;
          } else {
            const anterior = localStorage.getItem(claveAnterior);
            if (anterior) {
              const borrador = leerBorradorPython(anterior);
              memoria = JSON.stringify({
                archivos: [
                  {
                    id: ARCHIVO_INICIAL_ID,
                    nombre: "sandbox.py",
                    codigo: borrador.codigo,
                  },
                ],
                activoId: ARCHIVO_INICIAL_ID,
              } satisfies ProyectoPython);
              localStorage.setItem(clave, memoria);
            }
          }
        } catch {
          sinAlmacenamiento = true;
        }
      }
      return memoria;
    },
    suscribir(avisar: () => void) {
      oyentes.add(avisar);
      const externo = (evento: StorageEvent) => {
        if (evento.key === clave) {
          memoria = evento.newValue ?? PROYECTO_INICIAL_PYTHON;
          avisar();
        }
      };
      window.addEventListener("storage", externo);
      return () => {
        oyentes.delete(avisar);
        window.removeEventListener("storage", externo);
      };
    },
    guardar(proyecto: ProyectoPython) {
      memoria = JSON.stringify(proyecto);
      try {
        localStorage.setItem(clave, memoria);
        sinAlmacenamiento = false;
      } catch {
        sinAlmacenamiento = true;
      }
      oyentes.forEach((avisar) => avisar());
      return !sinAlmacenamiento;
    },
  };
}
