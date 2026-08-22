"use client";

import { useState } from "react";
import { CornerDownRight, Play, RotateCcw, TriangleAlert } from "lucide-react";
import { useSyncExternalStore } from "react";
import {
  ejecutarPython,
  estadoPython,
  preludioAplicado,
  suscribirsePython,
} from "@/lib/pyodide";

/**
 * Salida del fragmento, calculada ejecutándolo en el navegador.
 *
 * Sustituye a la salida escrita en el temario: en un bloque ejecutable, tener
 * las dos —la prometida y la real— es decir dos veces lo mismo y quita la
 * razón de pulsar el botón.
 */
type Estado = "inicial" | "cargando" | "ejecutando" | "listo" | "error";

export function Consola({
  codigo,
  paquetes,
  preludio,
}: {
  codigo: string;
  /** Paquetes de PyPI que el curso necesita para ejecutar su código. */
  paquetes?: string[];
  /**
   * Preparación del curso. Se aplica una sola vez por pestaña, para que
   * quien entre directamente a una sesión avanzada encuentre listo lo que
   * los bloques dan por hecho.
   */
  preludio?: string;
}) {
  const [estado, setEstado] = useState<Estado>("inicial");
  const [salida, setSalida] = useState("");

  // Mientras el curso se prepara, el botón lo dice en lugar de fingir que
  // está listo y dejar al lector esperando sin explicación.
  const preparacion = useSyncExternalStore(
    suscribirsePython,
    estadoPython,
    () => "sin-empezar" as const,
  );

  const ejecutar = async () => {
    setSalida("");
    // La primera vez hay que bajar el intérprete; a partir de ahí es inmediato,
    // y el aviso de espera solo tiene sentido en ese primer caso.
    setEstado(
      preparacion === "listo" && preludioAplicado(preludio)
        ? "ejecutando"
        : "cargando",
    );

    const { salida: texto, error } = await ejecutarPython(codigo, {
      paquetes,
      preludioUnaVez: preludio,
    });
    setSalida(texto);
    setEstado(error ? "error" : "listo");
  };

  const ocupado = estado === "cargando" || estado === "ejecutando";

  return (
    <div className="border-t border-borde bg-superficie">
      <div className="flex items-center justify-between gap-3 px-4 py-2">
        {/* El encabezado nombra lo que hay debajo. Antes el fallo se
            distinguía solo porque el texto salía rojo, y eso desaparece en
            monocromo y tampoco lo ve quien no distingue el rojo. */}
        <span
          className={`flex items-center gap-1.5 text-[11px] uppercase tracking-wide ${
            estado === "error" ? "text-rojo-acento" : "text-texto-tenue"
          }`}
        >
          {estado === "error" ? (
            <TriangleAlert size={12} aria-hidden="true" />
          ) : (
            <CornerDownRight size={12} aria-hidden="true" />
          )}
          {estado === "error" ? "Error" : "Salida"}
        </span>

        <span className="flex items-center gap-2">
          {salida && !ocupado && (
            <button
              type="button"
              onClick={() => {
                setSalida("");
                setEstado("inicial");
              }}
              className="flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-texto-tenue transition-colors hover:text-rojo-acento"
            >
              <RotateCcw size={12} aria-hidden="true" />
              Limpiar
            </button>
          )}
          <button
            type="button"
            onClick={ejecutar}
            disabled={ocupado}
            className="flex items-center gap-1.5 rounded-md border border-borde-fuerte bg-fondo px-2.5 py-1 text-xs font-medium text-texto-suave transition-colors hover:border-rojo-acento hover:text-rojo-acento disabled:cursor-wait disabled:opacity-60"
          >
            <Play size={12} aria-hidden="true" className={ocupado ? "animate-pulse" : ""} />
            {estado === "cargando"
              ? "Cargando el curso…"
              : estado === "ejecutando"
                ? "Ejecutando…"
                : "Ejecutar"}
          </button>
        </span>
      </div>

      {salida && (
        <pre
          aria-live="polite"
          className={`overflow-x-auto px-4 pb-3.5 font-mono text-[0.78rem] leading-relaxed ${
            estado === "error" ? "text-rojo-acento" : "text-texto-suave"
          }`}
        >
          {salida}
        </pre>
      )}

      {estado === "listo" && !salida && (
        <p className="px-4 pb-3.5 font-mono text-[0.78rem] text-texto-tenue">
          Sin salida.
        </p>
      )}
    </div>
  );
}
