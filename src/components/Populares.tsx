import Link from "next/link";
import { ArrowRight, Flame, Users } from "lucide-react";
import { Icono, type IconoNombre } from "./Iconos";

export type CursoPopular = {
  slug: string;
  codigo: string;
  titulo: string;
  resumen: string;
  primeraLeccion: string;
  matriculas: number;
  icono?: IconoNombre;
};

/**
 * Tarjeta de un curso popular, para el inicio de la rejilla del catálogo.
 *
 * Sigue la forma de las demás tarjetas de curso; lo que la distingue es la
 * insignia con la llama y el número real de personas que compraron o se
 * matricularon. Una persona se cuenta una sola vez por curso.
 */
export function TarjetaPopular({ curso }: { curso: CursoPopular }) {
  return (
    <Link
      href={`/cursos/${curso.slug}/${curso.primeraLeccion}`}
      className="group flex aspect-square flex-col rounded-xl border border-borde bg-fondo p-5 transition-all hover:-translate-y-0.5 hover:border-rojo-acento hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rojo-acento"
    >
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

      <div className="mt-3 flex items-center justify-between border-t border-borde pt-2.5 text-xs text-texto-tenue">
        <span className="flex items-center gap-1.5">
          <Users size={13} aria-hidden="true" />
          {curso.matriculas} {curso.matriculas === 1 ? "compra o inscripción" : "compras o inscripciones"}
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
