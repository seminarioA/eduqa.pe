"use client";

import { useEffect, useRef, useState } from "react";
import { Megaphone, Pin, X } from "lucide-react";
import type { Aviso } from "@/lib/avisos";

const CLAVE_VISTO = "eduqa:avisos-visto";

/**
 * Tablero de avisos, desplegable desde la cabecera.
 *
 * El punto rojo aparece cuando hay algún aviso posterior a la última vez que
 * se abrió el tablero. Esa marca vive en el navegador y no en la base: saber
 * quién leyó qué exigiría una fila por alumno y por aviso, y para un tablón
 * de anuncios eso es contabilidad de más.
 */
export function Tablero({ avisos }: { avisos: Aviso[] }) {
  const [abierto, setAbierto] = useState(false);
  const [sinLeer, setSinLeer] = useState(0);
  const contenedor = useRef<HTMLDivElement>(null);

  const masReciente = avisos.reduce(
    (max, a) => Math.max(max, new Date(a.creado_en).getTime()),
    0,
  );

  useEffect(() => {
    // localStorage solo existe en el cliente, y el primer render es del
    // servidor: leerlo en un efecto evita el desajuste de hidratación.
    const visto = Number(window.localStorage.getItem(CLAVE_VISTO) ?? 0);
    setSinLeer(avisos.filter((a) => new Date(a.creado_en).getTime() > visto).length);
  }, [avisos]);

  useEffect(() => {
    if (!abierto) return;

    const fuera = (e: MouseEvent) => {
      if (!contenedor.current?.contains(e.target as Node)) setAbierto(false);
    };
    const escape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setAbierto(false);
    };
    window.addEventListener("mousedown", fuera);
    window.addEventListener("keydown", escape);
    return () => {
      window.removeEventListener("mousedown", fuera);
      window.removeEventListener("keydown", escape);
    };
  }, [abierto]);

  const alternar = () => {
    if (!abierto && masReciente > 0) {
      window.localStorage.setItem(CLAVE_VISTO, String(masReciente));
      setSinLeer(0);
    }
    setAbierto((v) => !v);
  };

  return (
    <div ref={contenedor} className="relative">
      <button
        type="button"
        onClick={alternar}
        aria-expanded={abierto}
        aria-haspopup="dialog"
        className="flex items-center gap-2 text-sm text-texto-suave transition-colors hover:text-rojo-acento"
      >
        <span className="relative">
          <Megaphone size={17} aria-hidden="true" />
          {sinLeer > 0 && (
            <span
              aria-hidden="true"
              className="absolute -right-1 -top-0.5 size-2 rounded-full bg-rojo ring-2 ring-fondo"
            />
          )}
        </span>
        {/* Entre lg y xl el panel lateral deja poco ancho y la fila superior
            de /cursos envolvía. Se acorta la etiqueta en vez de partir la
            fila; el rótulo completo sigue en la cabecera del desplegable. */}
        <span className="whitespace-nowrap xl:hidden">Avisos</span>
        <span className="hidden whitespace-nowrap xl:inline">Tablero de avisos</span>
        {sinLeer > 0 && (
          <span className="sr-only">
            {sinLeer} {sinLeer === 1 ? "aviso nuevo" : "avisos nuevos"}
          </span>
        )}
      </button>

      {abierto && (
        <div
          role="dialog"
          aria-label="Tablero de avisos"
          className="absolute right-0 top-full z-40 mt-3 w-[min(24rem,calc(100vw-2rem))] overflow-hidden rounded-xl border border-borde bg-fondo shadow-xl"
        >
          <div className="flex items-center justify-between gap-3 border-b border-borde px-4 py-2.5">
            <span className="text-sm font-medium">Tablero de avisos</span>
            <button
              type="button"
              onClick={() => setAbierto(false)}
              aria-label="Cerrar"
              className="rounded p-0.5 text-texto-tenue transition-colors hover:text-rojo-acento"
            >
              <X size={15} aria-hidden="true" />
            </button>
          </div>

          {avisos.length === 0 ? (
            <p className="px-4 py-8 text-center text-sm text-texto-suave">
              No hay avisos por ahora.
            </p>
          ) : (
            <ul className="max-h-96 divide-y divide-borde overflow-y-auto">
              {avisos.map((a) => (
                <li key={a.id} className="px-4 py-3">
                  <p className="flex items-start gap-1.5 text-sm font-medium">
                    {a.fijado && (
                      <Pin
                        size={13}
                        className="mt-1 shrink-0 text-rojo-acento"
                        aria-label="Fijado"
                      />
                    )}
                    {a.titulo}
                    {!a.publicado && (
                      <span className="ml-auto shrink-0 rounded-full bg-superficie px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-texto-tenue">
                        Borrador
                      </span>
                    )}
                  </p>
                  <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed text-texto-suave">
                    {a.cuerpo}
                  </p>
                  <p className="mt-1.5 text-xs text-texto-tenue">
                    {new Date(a.creado_en).toLocaleDateString("es-PE", {
                      day: "numeric",
                      month: "long",
                    })}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
