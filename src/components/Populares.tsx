import Link from "next/link";
import { ArrowRight, Flame, Lock, Users } from "lucide-react";
import { Icono, type IconoNombre } from "./Iconos";

export type CursoPopular = {
  slug: string;
  codigo: string;
  titulo: string;
  resumen: string;
  primeraLeccion: string;
  matriculas: number;
  matriculado: boolean;
  precio: number;
  icono?: IconoNombre;
};

/**
 * Tarjeta de un curso popular, para el inicio de la rejilla del catálogo.
 *
 * Sigue la forma de las demás tarjetas de curso; lo que la distingue es la
 * insignia con la llama y el número real de matrículas. Una persona se
 * cuenta una sola vez por curso.
 */
export function TarjetaPopular({
  curso,
  alTope,
}: {
  curso: CursoPopular;
  alTope: boolean;
}) {
  const bloqueado = !curso.matriculado && alTope;

  const contenido = (
    <>
      <div className="flex items-start justify-between gap-3">
        <Icono
          nombre={curso.icono}
          className="size-14 shrink-0 text-texto-tenue transition-colors group-hover:text-rojo-acento"
        />
        <span className="flex shrink-0 items-center gap-1 rounded-full bg-rojo-tenue px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-rojo-acento ring-1 ring-inset ring-rojo-acento/30">
          <Flame size={9} aria-hidden="true" />
          {curso.matriculas}
        </span>
      </div>

      <p className="mt-3 font-mono text-[10px] tracking-wider text-texto-tenue">
        {curso.codigo}
      </p>

      <h2 className="mt-2 text-base font-semibold leading-snug group-hover:text-rojo-acento">
        {curso.titulo}
      </h2>
      <p className="mt-2 line-clamp-4 flex-1 text-sm leading-relaxed text-texto-suave">
        {curso.resumen}
      </p>
    </>
  );

  if (bloqueado) {
    return (
      <div className="group relative flex aspect-square flex-col overflow-hidden rounded-xl border border-borde bg-fondo transition-all hover:-translate-y-0.5 hover:border-rojo-acento hover:shadow-md">
        <Link
          href={`/cursos/${curso.slug}/${curso.primeraLeccion}`}
          className="flex min-h-0 flex-1 flex-col p-5 pb-12 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-rojo-acento"
        >
          {contenido}
        </Link>

        <div className="absolute bottom-0 left-0 flex h-9 w-1/2 items-center justify-start border-t border-borde px-5 text-[11px] leading-none text-texto-tenue">
          <span className="flex items-center gap-1.5 whitespace-nowrap">
            <Users size={13} className="shrink-0" aria-hidden="true" />
            {curso.matriculas} {curso.matriculas === 1 ? "matrícula" : "matrículas"}
          </span>
        </div>

        <Link
          href={`/pagar/${curso.slug}`}
          aria-label={`Comprar ${curso.titulo} por S/${curso.precio.toFixed(2)}`}
          className="absolute bottom-0 right-0 flex h-9 w-1/2 items-center justify-center gap-1.5 overflow-hidden whitespace-nowrap rounded-tl-xl border-l border-t border-borde bg-rojo px-3 text-[11px] font-semibold leading-none text-white transition-colors hover:bg-rojo-hover focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-white"
        >
          <Lock size={13} className="shrink-0" aria-hidden="true" />
          <span className="whitespace-nowrap">S/{curso.precio.toFixed(2)}</span>
        </Link>
      </div>
    );
  }

  return (
    <Link
      href={`/cursos/${curso.slug}/${curso.primeraLeccion}`}
      className="group flex aspect-square flex-col rounded-xl border border-borde bg-fondo p-5 transition-all hover:-translate-y-0.5 hover:border-rojo-acento hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rojo-acento"
    >
      {contenido}

      <div className="mt-3 flex items-center justify-between border-t border-borde pt-2.5 text-xs text-texto-tenue">
        <span className="flex items-center gap-1.5">
          <Users size={13} aria-hidden="true" />
          {curso.matriculas} {curso.matriculas === 1 ? "matrícula" : "matrículas"}
        </span>
        <ArrowRight
          size={14}
          aria-hidden="true"
          className="opacity-0 transition-opacity group-hover:opacity-100"
        />
      </div>
    </Link>
  );
}
