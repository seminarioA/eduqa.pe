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

/** Snapshot estable para hidratar y conservar el borrador del sandbox. */
export function crearAlmacenBorradorPython() {
  const clave = "eduqa:python:sandbox:v1";
  let memoria = BORRADOR_INICIAL_PYTHON;
  let sinAlmacenamiento = false;
  const oyentes = new Set<() => void>();

  return {
    leer() {
      if (!sinAlmacenamiento) {
        try {
          memoria = localStorage.getItem(clave) ?? memoria;
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
          memoria = evento.newValue ?? BORRADOR_INICIAL_PYTHON;
          avisar();
        }
      };
      window.addEventListener("storage", externo);
      return () => {
        oyentes.delete(avisar);
        window.removeEventListener("storage", externo);
      };
    },
    guardar(borrador: BorradorPython) {
      memoria = JSON.stringify(borrador);
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
