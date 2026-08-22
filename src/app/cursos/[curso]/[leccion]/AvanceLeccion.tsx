"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { marcarVista } from "./acciones";
import { MarcaInline } from "@/components/LlamaMarca";
import { Boton } from "@/components/ui";

/**
 * Marca la sesión como completada cuando el lector llega al final.
 *
 * El disparador es un centinela colocado justo antes de la navegación entre
 * sesiones: si aparece en pantalla, es que se recorrió todo el contenido. No
 * hay botón porque marcar el avance no es una decisión del alumno, es una
 * consecuencia de haber leído.
 *
 * Al marcarse por primera vez se celebra a pantalla completa. La celebración
 * solo aparece en ese momento: quien vuelve a una sesión que ya tenía hecha
 * no debería tropezar otra vez con la misma capa.
 */
export function AvanceLeccion({
  curso,
  leccion,
  vista,
  tituloLeccion,
  siguiente,
  volverA,
  marcaCierre = null,
}: {
  curso: string;
  leccion: string;
  vista: boolean;
  tituloLeccion: string;
  /** Sesión siguiente del curso, si queda alguna. */
  siguiente?: { slug: string; titulo: string };
  /** Destino cuando el curso se ha terminado. */
  volverA: string;
  /** SVG personalizado de la marca para el cierre; null usa la llama original. */
  marcaCierre?: string | null;
}) {
  const [celebrando, setCelebrando] = useState(false);
  const centinela = useRef<HTMLDivElement>(null);
  // Evita una segunda escritura si el centinela vuelve a entrar en pantalla
  // al desplazarse hacia arriba y hacia abajo otra vez.
  const yaPedido = useRef(vista);

  useEffect(() => {
    const nodo = centinela.current;
    if (!nodo || yaPedido.current) return;

    const observador = new IntersectionObserver(
      async ([entrada]) => {
        if (!entrada.isIntersecting || yaPedido.current) return;
        yaPedido.current = true;
        observador.disconnect();

        const resultado = await marcarVista(curso, leccion);
        // Si falló, no se celebra nada y se reintentará en la próxima visita:
        // insistir aquí solo repetiría el error.
        if (resultado.ok) setCelebrando(true);
      },
      { rootMargin: "0px 0px -80px 0px" },
    );

    observador.observe(nodo);
    return () => observador.disconnect();
  }, [curso, leccion]);

  return (
    <>
      <div ref={centinela} className="mt-12 border-t border-borde pt-6" />
      {celebrando && (
        <Celebracion
          tituloLeccion={tituloLeccion}
          siguiente={siguiente}
          curso={curso}
          volverA={volverA}
          marcaCierre={marcaCierre}
          onCerrar={() => setCelebrando(false)}
        />
      )}
    </>
  );
}

function Celebracion({
  tituloLeccion,
  siguiente,
  curso,
  volverA,
  marcaCierre = null,
  onCerrar,
}: {
  tituloLeccion: string;
  siguiente?: { slug: string; titulo: string };
  curso: string;
  volverA: string;
  /** SVG personalizado de la marca para el cierre; null usa la llama original. */
  marcaCierre?: string | null;
  onCerrar: () => void;
}) {
  // El foco entra en la capa para que quien navegue con teclado no se quede
  // detrás, y Escape la cierra.
  const cierreRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    cierreRef.current?.focus();
    const alPulsar = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCerrar();
    };
    window.addEventListener("keydown", alPulsar);
    return () => window.removeEventListener("keydown", alPulsar);
  }, [onCerrar]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Sesión completada"
      className="animar-velo fixed inset-0 z-50 flex items-center justify-center bg-fondo/95 px-6 backdrop-blur-sm"
    >
      <div className="flex flex-col items-center text-center">
        {/* La marca en el centro, con dos anillos saliendo de ella. El
            desfase entre los dos hace que se lean como una onda y no como
            un parpadeo. */}
        <div className="relative flex size-32 items-center justify-center">
          <span
            aria-hidden="true"
            className="animar-anillo absolute inset-0 rounded-full border-2 border-rojo"
          />
          <span
            aria-hidden="true"
            style={{ animationDelay: "0.45s" }}
            className="animar-anillo absolute inset-0 rounded-full border-2 border-rojo"
          />
          <MarcaInline svg={marcaCierre} className="animar-marca relative h-24 w-auto text-rojo" />
        </div>

        <p
          style={{ animationDelay: "0.25s" }}
          className="animar-texto mt-8 flex items-center gap-2 text-sm font-medium uppercase tracking-[0.2em] text-exito"
        >
          <Check size={16} aria-hidden="true" />
          Sesión completada
        </p>

        <h2
          style={{ animationDelay: "0.35s" }}
          className="animar-texto mt-3 max-w-lg text-3xl font-semibold leading-tight tracking-tight sm:text-4xl"
        >
          {tituloLeccion}
        </h2>

        <p
          style={{ animationDelay: "0.45s" }}
          className="animar-texto mt-3 max-w-sm leading-relaxed text-texto-suave"
        >
          {siguiente
            ? "Tu avance queda guardado. Cuando quieras, sigues por donde toca."
            : "Terminaste el curso entero. Tu avance queda guardado."}
        </p>

        <div
          style={{ animationDelay: "0.55s" }}
          className="animar-texto mt-8 flex flex-wrap items-center justify-center gap-3"
        >
          {siguiente ? (
            <Link href={`/cursos/${curso}/${siguiente.slug}`}>
              <Boton>
                Seguir con {siguiente.titulo}
                <ArrowRight size={16} aria-hidden="true" />
              </Boton>
            </Link>
          ) : (
            <Link href={volverA}>
              <Boton>
                Volver a mis cursos
                <ArrowRight size={16} aria-hidden="true" />
              </Boton>
            </Link>
          )}

          <button
            ref={cierreRef}
            type="button"
            onClick={onCerrar}
            className="rounded-lg border border-borde-fuerte px-5 py-3 text-sm font-medium text-texto-suave transition-colors hover:border-rojo-acento hover:text-rojo-acento"
          >
            Quedarme aquí
          </button>
        </div>
      </div>
    </div>
  );
}
