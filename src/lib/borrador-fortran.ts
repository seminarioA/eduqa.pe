export type BorradorFortran = { codigo: string; entrada: string; archivos: Record<string, string> };
export const PROGRAMA_INICIAL = "program sandbox\n  implicit none\n  print *, 'Hola, Fortran'\nend program sandbox\n";
export const BORRADOR_INICIAL = JSON.stringify({ codigo: PROGRAMA_INICIAL, entrada: '', archivos: {} });
export const nombreArchivoValido = (nombre: string) => /^[a-zA-Z0-9_][a-zA-Z0-9_.-]{0,79}$/.test(nombre);

export function leerBorrador(texto: string): BorradorFortran {
  try {
    const dato = JSON.parse(texto);
    if (typeof dato?.codigo !== 'string' || dato.codigo.length > 50000 || typeof dato.entrada !== 'string' || dato.entrada.length > 50000) throw new Error('Borrador inválido');
    const archivos = Object.fromEntries(Object.entries(dato.archivos ?? {}).filter(([nombre, valor]) => nombreArchivoValido(nombre) && typeof valor === 'string' && valor.length <= 50000).slice(0, 5));
    return { codigo: dato.codigo, entrada: dato.entrada, archivos: archivos as Record<string, string> };
  } catch {
    return { codigo: PROGRAMA_INICIAL, entrada: '', archivos: {} };
  }
}

/** Snapshot de texto estable para hidratar y conservar el borrador por ruta. */
export function crearAlmacenBorrador(ruta: string) {
  const clave = `eduqa:fortran:sandbox:v1:${ruta}`;
  let memoria = BORRADOR_INICIAL;
  let sinAlmacenamiento = false;
  const oyentes = new Set<() => void>();
  return {
    leer() {
      if (!sinAlmacenamiento) {
        try { memoria = localStorage.getItem(clave) ?? memoria; }
        catch { sinAlmacenamiento = true; }
      }
      return memoria;
    },
    suscribir(avisar: () => void) {
      oyentes.add(avisar);
      const externo = (evento: StorageEvent) => { if (evento.key === clave) { memoria = evento.newValue ?? BORRADOR_INICIAL; avisar(); } };
      window.addEventListener('storage', externo);
      return () => { oyentes.delete(avisar); window.removeEventListener('storage', externo); };
    },
    guardar(borrador: BorradorFortran) {
      memoria = JSON.stringify(borrador);
      try { localStorage.setItem(clave, memoria); sinAlmacenamiento = false; }
      catch { sinAlmacenamiento = true; }
      oyentes.forEach(avisar => avisar());
      return !sinAlmacenamiento;
    },
  };
}
