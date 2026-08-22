/**
 * Registro estructurado del servidor.
 *
 * En Server Actions la respuesta al cliente es un mensaje genérico: sin esto,
 * un fallo (RLS incluido, que no lanza error sino que ignora filas) sería
 * invisible. La salida va a los Runtime Logs del despliegue, donde cada línea
 * se puede buscar y filtrar por contexto.
 */
type Nivel = "error" | "aviso";

function escribir(nivel: Nivel, contexto: string, detalle?: unknown) {
  const linea = JSON.stringify({
    nivel,
    contexto,
    detalle:
      detalle instanceof Error
        ? { mensaje: detalle.message, codigo: ("code" in detalle && detalle.code) || null }
        : detalle ?? null,
    cuando: new Date().toISOString(),
  });

  if (nivel === "error") {
    console.error(linea);
  } else {
    console.warn(linea);
  }
}

export function registrarError(contexto: string, detalle?: unknown) {
  escribir("error", contexto, detalle);
}

export function registrarAviso(contexto: string, detalle?: unknown) {
  escribir("aviso", contexto, detalle);
}
