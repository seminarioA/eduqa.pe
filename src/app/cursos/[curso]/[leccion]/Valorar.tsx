"use client";

import { useActionState, useState } from "react";
import { Star } from "lucide-react";
import { valorarCurso, type EstadoValoracion } from "./acciones";

const ETIQUETAS = ["", "No me sirvió", "Regular", "Bien", "Muy bien", "Excelente"];

/**
 * Valoración del curso, al terminar la última sesión.
 *
 * Va aquí y no en el catálogo porque valorar algo que aún no se ha leído no
 * informa de nada. Se puede cambiar después: guardar corrige la nota anterior
 * en lugar de añadir otra.
 */
export function Valorar({
  curso,
  inicial,
}: {
  curso: string;
  inicial: number | null;
}) {
  const [estado, accion, enviando] = useActionState<EstadoValoracion | null, FormData>(
    valorarCurso,
    null,
  );
  const [encima, setEncima] = useState(0);

  const guardadas = estado?.ok ? estado.estrellas! : (inicial ?? 0);
  const mostradas = encima || guardadas;

  return (
    <section className="mt-12 rounded-xl border border-borde bg-superficie px-5 py-4">
      <h2 className="text-sm font-semibold text-texto">
        {guardadas ? "Tu valoración" : "¿Qué te pareció el curso?"}
      </h2>

      <form action={accion} className="mt-3 flex flex-wrap items-center gap-3">
        <input type="hidden" name="curso" value={curso} />
        <div
          role="radiogroup"
          aria-label="Estrellas"
          className="flex items-center gap-0.5"
          onMouseLeave={() => setEncima(0)}
        >
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="submit"
              name="estrellas"
              value={n}
              role="radio"
              aria-checked={guardadas === n}
              aria-label={`${n} ${n === 1 ? "estrella" : "estrellas"}: ${ETIQUETAS[n]}`}
              disabled={enviando}
              onMouseEnter={() => setEncima(n)}
              onFocus={() => setEncima(n)}
              className="rounded p-1 transition-transform hover:scale-110 disabled:cursor-wait"
            >
              <Star
                size={22}
                className={
                  n <= mostradas
                    ? "fill-current text-rojo-acento"
                    : "text-borde-fuerte"
                }
                aria-hidden="true"
              />
            </button>
          ))}
        </div>

        <span aria-live="polite" className="text-xs text-texto-suave">
          {enviando
            ? "Guardando…"
            : estado && !estado.ok
              ? <span className="text-rojo-acento">{estado.error}</span>
              : mostradas
                ? ETIQUETAS[mostradas]
                : "Solo tú ves lo que votaste."}
        </span>
      </form>

      {guardadas > 0 && !enviando && (
        <p className="mt-2 text-xs text-texto-tenue">
          Puedes cambiarla cuando quieras: pulsa otra estrella.
        </p>
      )}
    </section>
  );
}
