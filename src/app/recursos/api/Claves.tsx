"use client";

import { useActionState, useState } from "react";
import { Copy, KeyRound, ShieldAlert } from "lucide-react";
import { crearClave, type EstadoClave } from "./acciones";

/**
 * Emisión de claves de API.
 *
 * La clave se muestra una única vez, en cuanto se emite. No hay forma de
 * volver a consultarla porque lo que se guarda es su resumen, y ese es el
 * motivo por el que el aviso ocupa tanto sitio en la pantalla.
 */
export function ClavesApi() {
  const [estado, accion, emitiendo] = useActionState<EstadoClave | null, FormData>(
    crearClave,
    null,
  );
  const [copiada, setCopiada] = useState(false);

  return (
    <section className="rounded-xl border border-borde bg-superficie p-5">
      <h2 className="flex items-center gap-2 text-sm font-semibold text-texto">
        <KeyRound size={15} className="text-texto-tenue" aria-hidden="true" />
        Tus claves
      </h2>

      {estado?.ok && estado.clave ? (
        <div className="mt-4 rounded-lg border border-rojo-acento bg-fondo p-4">
          <p className="flex items-center gap-2 text-sm font-medium text-rojo-acento">
            <ShieldAlert size={15} aria-hidden="true" />
            Cópiala ahora: no se vuelve a mostrar
          </p>
          <div className="mt-3 flex items-center gap-2">
            <code className="min-w-0 flex-1 truncate rounded-md bg-superficie px-3 py-2 font-mono text-xs text-texto">
              {estado.clave}
            </code>
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(estado.clave!);
                setCopiada(true);
              }}
              className="flex shrink-0 items-center gap-1.5 rounded-md border border-borde-fuerte px-3 py-2 text-xs font-medium transition-colors hover:border-rojo-acento hover:text-rojo-acento"
            >
              <Copy size={13} aria-hidden="true" />
              {copiada ? "Copiada" : "Copiar"}
            </button>
          </div>
          <p className="mt-3 text-xs leading-relaxed text-texto-suave">
            Guárdala en el gestor de secretos de tu proceso, nunca en el
            repositorio. Si se pierde, revócala y emite otra.
          </p>
        </div>
      ) : (
        <form action={accion} className="mt-4 flex flex-wrap items-end gap-3">
          <label className="min-w-48 flex-1 text-xs font-medium text-texto-suave">
            Para qué es
            <input
              name="nombre"
              required
              minLength={3}
              placeholder="Publicación desde CI"
              className="mt-1 w-full rounded-lg border border-borde bg-fondo px-3 py-2 text-sm text-texto outline-none focus:border-rojo-acento"
            />
          </label>
          <button
            type="submit"
            disabled={emitiendo}
            className="rounded-lg bg-rojo px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-rojo-hover disabled:opacity-50"
          >
            {emitiendo ? "Emitiendo…" : "Emitir clave"}
          </button>
          {estado && !estado.ok && (
            <span role="status" className="text-xs text-rojo-acento">
              {estado.error}
            </span>
          )}
        </form>
      )}
    </section>
  );
}
