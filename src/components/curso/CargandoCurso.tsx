"use client";

import { useEffect, useSyncExternalStore } from "react";
import {
  estadoPython,
  prepararPython,
  suscribirsePython,
} from "@/lib/pyodide";
import { Llama } from "@/components/Llama";

/**
 * Prepara el intérprete al abrir la sesión, sin que nadie lo pida.
 *
 * Antes se descargaba al pulsar "Ejecutar" por primera vez, y eso dejaba al
 * lector esperando justo en el momento en que quería ver algo pasar. Ahora
 * arranca al entrar: para cuando llega al primer bloque, suele estar listo.
 *
 * No se muestra progreso a propósito. Cuántos megabytes pesa el intérprete es
 * un detalle de implementación que al alumno no le dice nada; lo único que
 * necesita saber es que el curso todavía se está preparando.
 */
export function CargandoCurso({ paquetes }: { paquetes?: string[] }) {
  const estado = useSyncExternalStore(
    suscribirsePython,
    estadoPython,
    // En el servidor no hay intérprete que preparar.
    () => "sin-empezar" as const,
  );

  useEffect(() => {
    prepararPython(paquetes);
  }, [paquetes]);

  if (estado === "listo" || estado === "sin-empezar") return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="animar-velo fixed left-1/2 top-4 z-40 flex -translate-x-1/2 items-center gap-2.5 rounded-full border border-borde bg-superficie/95 py-2 pl-3 pr-4 shadow-lg backdrop-blur"
    >
      {estado === "error" ? (
        <>
          <Llama className="h-6 w-auto text-texto-tenue" />
          <span className="text-sm text-texto-suave">
            No pudimos preparar el curso. Recarga la página.
          </span>
        </>
      ) : (
        <>
          {/* La marca latiendo, en vez de un disco girando: dice lo mismo y se
              parece a algo. */}
          <Llama className="animar-latido h-6 w-auto text-rojo-acento" />
          <span className="text-sm text-texto-suave">Cargando el curso…</span>
        </>
      )}
    </div>
  );
}
