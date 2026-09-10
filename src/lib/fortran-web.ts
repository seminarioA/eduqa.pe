export type FaseFortran = 'cargando' | 'compilando' | 'ejecutando';
export type ResultadoFortran = { salida: string; error: boolean };
export type EstadoFortran = 'sin-empezar' | 'cargando' | 'listo' | 'error';

type Motor = { worker: Worker; listo: Promise<ResultadoFortran | null>; destruir: () => void };
let reserva: Motor | null = null;
let estado: EstadoFortran = 'sin-empezar';
let ejecucionesActivas = 0;
let lectores = 0;
let salidaDelCurso: ReturnType<typeof setTimeout> | undefined;
const oyentes = new Set<() => void>();

function cambiarEstado(valor: EstadoFortran) {
  estado = valor;
  oyentes.forEach(avisar => avisar());
}

export const estadoFortran = () => estado;
export function suscribirseFortran(avisar: () => void) {
  oyentes.add(avisar);
  return () => { oyentes.delete(avisar); };
}

function crearMotor(): Motor {
  const worker = new Worker('/fortran/worker.js?v=2');
  let resolver: (error: ResultadoFortran | null) => void;
  const listo = new Promise<ResultadoFortran | null>(resolve => { resolver = resolve; });
  const reloj = setTimeout(() => finalizar({ salida: 'Se alcanzó el tiempo límite al cargar Fortran.', error: true }), 180000);
  let terminado = false;
  function finalizar(error: ResultadoFortran | null) {
    if (terminado) return;
    terminado = true;
    clearTimeout(reloj);
    if (error) worker.terminate();
    resolver(error);
  }
  worker.onmessage = ({ data }) => {
    if (data.tipo === 'listo') finalizar(null);
    else if (data.tipo === 'resultado') finalizar(data);
  };
  worker.onerror = () => finalizar({ salida: 'No se pudo cargar Fortran. Comprueba tu conexión e inténtalo de nuevo.', error: true });
  worker.postMessage({ tipo: 'preparar' });
  return {
    worker,
    listo,
    destruir() {
      finalizar({ salida: 'Ejecución cancelada.', error: true });
      worker.terminate();
    },
  };
}

/** Descarga e inicializa un compilador que todavía no ha ejecutado código. */
export async function prepararFortran(): Promise<boolean> {
  if (reserva) return (await reserva.listo) === null;
  cambiarEstado('cargando');
  let motor: Motor;
  try { motor = crearMotor(); }
  catch { cambiarEstado('error'); return false; }
  reserva = motor;
  const error = await motor.listo;
  if (reserva === motor) {
    if (error) reserva = null;
    cambiarEstado(error ? 'error' : 'listo');
  }
  return !error;
}

/** Una reserva por página, compartida entre lecciones y sandbox al navegar. */
export function mantenerFortranPreparado() {
  lectores++;
  clearTimeout(salidaDelCurso);
  void prepararFortran();
  return () => {
    lectores--;
    salidaDelCurso = setTimeout(() => {
      if (lectores !== 0) return;
      reserva?.destruir();
      reserva = null;
      cambiarEstado('sin-empezar');
    }, 0);
  };
}

/** Cada intento consume un compilador limpio y lo destruye al terminar. */
export function ejecutarFortran(
  codigo: string,
  opciones: { signal?: AbortSignal; alCambiarFase?: (fase: FaseFortran) => void; entrada?: string; archivos?: Record<string, string> } = {},
): Promise<ResultadoFortran> {
  return new Promise((resolve) => {
    if (opciones.signal?.aborted) { resolve({ salida: 'Ejecución cancelada.', error: true }); return; }
    if (ejecucionesActivas >= 2) { resolve({ salida: 'Espera a que termine una de las ejecuciones abiertas.', error: true }); return; }
    let motor: Motor;
    try { motor = reserva ?? crearMotor(); reserva = null; }
    catch { resolve({ salida: 'No se pudo iniciar el compilador web.', error: true }); return; }
    ejecucionesActivas++;
    let terminado = false;
    let preparado = false;
    let reloj: ReturnType<typeof setTimeout>;
    const finalizar = (resultado: ResultadoFortran) => {
      if (terminado) return;
      terminado = true;
      ejecucionesActivas--;
      clearTimeout(reloj);
      motor.destruir();
      opciones.signal?.removeEventListener('abort', cancelar);
      resolve(resultado);
      if (lectores > 0 && ejecucionesActivas === 0 && preparado) void prepararFortran();
    };
    const cancelar = () => finalizar({ salida: 'Ejecución cancelada.', error: true });
    opciones.signal?.addEventListener('abort', cancelar, { once: true });
    opciones.alCambiarFase?.('cargando');
    void motor.listo.then(error => {
      if (terminado) return;
      if (error) { cambiarEstado('error'); finalizar(error); return; }
      preparado = true;
      cambiarEstado('listo');
      motor.worker.onmessage = ({ data }) => {
        if (data.tipo === 'fase') opciones.alCambiarFase?.(data.fase);
        else if (data.tipo === 'resultado') finalizar({ salida: data.salida, error: data.error });
      };
      motor.worker.onerror = () => finalizar({ salida: 'No se pudo ejecutar Fortran. Revisa el programa e inténtalo de nuevo.', error: true });
      reloj = setTimeout(() => finalizar({ salida: 'Se alcanzó el tiempo límite. Revisa el programa e inténtalo de nuevo.', error: true }), 10000);
      motor.worker.postMessage({ tipo: 'ejecutar', codigo, entrada: opciones.entrada, archivos: opciones.archivos });
    });
  });
}
