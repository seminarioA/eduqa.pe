export type FaseFortran = 'cargando' | 'compilando' | 'ejecutando';
export type ResultadoFortran = { salida: string; error: boolean };
let ejecucionesActivas = 0;

/** Cada ejecución usa memoria y compilador nuevos; cancelar destruye ambos. */
export function ejecutarFortran(
  codigo: string,
  opciones: { signal?: AbortSignal; alCambiarFase?: (fase: FaseFortran) => void; entrada?: string; archivos?: Record<string, string> } = {},
): Promise<ResultadoFortran> {
  return new Promise((resolve) => {
    if (ejecucionesActivas >= 2) { resolve({ salida: 'Espera a que termine una de las ejecuciones abiertas.', error: true }); return; }
    let worker: Worker;
    try { worker = new Worker('/fortran/worker.js'); }
    catch { resolve({ salida: 'No se pudo iniciar el compilador web.', error: true }); return; }
    ejecucionesActivas++;
    let terminado = false;
    let reloj: ReturnType<typeof setTimeout>;
    const finalizar = (resultado: ResultadoFortran) => {
      if (terminado) return;
      terminado = true;
      ejecucionesActivas--;
      clearTimeout(reloj);
      worker.terminate();
      opciones.signal?.removeEventListener('abort', cancelar);
      resolve(resultado);
    };
    const cancelar = () => finalizar({ salida: 'Ejecución cancelada.', error: true });
    const limitarTiempo = (ms: number) => {
      clearTimeout(reloj);
      reloj = setTimeout(() => finalizar({ salida: 'Se alcanzó el tiempo límite. Revisa el programa e inténtalo de nuevo.', error: true }), ms);
    };
    worker.onmessage = ({ data }) => {
      if (data.tipo === 'fase') {
        opciones.alCambiarFase?.(data.fase);
        limitarTiempo(data.fase === 'ejecutando' ? 10000 : 180000);
      } else if (data.tipo === 'resultado') finalizar({ salida: data.salida, error: data.error });
    };
    worker.onerror = () => finalizar({ salida: 'No se pudo cargar o ejecutar Fortran. Comprueba tu conexión y vuelve a intentarlo.', error: true });
    opciones.signal?.addEventListener('abort', cancelar, { once: true });
    if (opciones.signal?.aborted) { cancelar(); return; }
    limitarTiempo(180000);
    worker.postMessage({ codigo, entrada: opciones.entrada, archivos: opciones.archivos });
  });
}
