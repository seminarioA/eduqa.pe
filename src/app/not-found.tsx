import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import { LlamaFrontal } from "@/components/LlamaFrontal";

export const metadata: Metadata = {
  title: "Página no encontrada — EDUQA.PE",
  robots: { index: false, follow: false },
};

/**
 * Pantalla para una dirección que no existe.
 *
 * No enlaza a «volver atrás»: quien llega aquí suele venir de un enlace roto,
 * y retroceder lo devolvería al mismo sitio. El único destino es el inicio.
 */
export default function NoEncontrada() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center px-6 py-16 text-center">
      <LlamaFrontal className="h-56 w-auto text-texto-tenue sm:h-72" />

      <p className="mt-10 font-mono text-xs uppercase tracking-[0.3em] text-texto-tenue">
        Error 404
      </p>

      <h1 className="mt-3 text-3xl font-semibold tracking-tight text-texto sm:text-4xl">
        Ups, no pudimos encontrar esta página
      </h1>

      <p className="mt-3 max-w-md text-sm leading-relaxed text-texto-suave">
        Estamos trabajando para solucionarlo. Si llegaste desde un enlace de la
        plataforma, cuéntanoslo con el botón de reportar y lo revisamos.
      </p>

      <Link
        href="/"
        className="mt-8 inline-flex items-center gap-2 rounded-lg bg-rojo px-6 py-3 text-sm font-semibold text-sobre-rojo transition-colors hover:bg-rojo-hover"
      >
        <ArrowLeft size={16} aria-hidden="true" />
        Ir al inicio
      </Link>
    </main>
  );
}
