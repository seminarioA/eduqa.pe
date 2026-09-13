import Link from "next/link";
import { Clock, Calendar, ArrowUpRight } from "lucide-react";
import type { ArticuloBlog } from "@/lib/blog-medium";

export function BlogCard({ articulo }: { articulo: ArticuloBlog }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-borde bg-superficie transition-all duration-300 hover:-translate-y-1 hover:border-rojo-acento hover:shadow-lg">
      {articulo.portada ? (
        <div className="relative aspect-video w-full overflow-hidden bg-fondo">
          <img
            src={articulo.portada}
            alt={articulo.titulo}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
            {articulo.categorias.slice(0, 2).map((cat) => (
              <span
                key={cat}
                className="rounded-full bg-fondo/90 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-texto backdrop-blur-sm ring-1 ring-borde"
              >
                {cat}
              </span>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex aspect-video w-full items-center justify-center bg-gradient-to-br from-superficie via-borde/20 to-fondo p-6">
          <span className="text-xs font-semibold uppercase tracking-widest text-rojo-acento">
            {articulo.categorias[0] ?? "EDUQA.PE"}
          </span>
        </div>
      )}

      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center gap-3 text-xs text-texto-tenue">
          <span className="flex items-center gap-1">
            <Calendar size={13} aria-hidden="true" />
            <time dateTime={articulo.fechaIso}>{articulo.fecha}</time>
          </span>
          <span>·</span>
          <span className="flex items-center gap-1">
            <Clock size={13} aria-hidden="true" />
            {articulo.minutosLectura} min de lectura
          </span>
        </div>

        <h2 className="mt-3 text-lg font-semibold leading-snug tracking-tight text-texto transition-colors group-hover:text-rojo-acento">
          <Link href={`/blog/${articulo.slug}`} className="focus:outline-none">
            {articulo.titulo}
          </Link>
        </h2>

        <p className="mt-2.5 line-clamp-3 text-sm leading-relaxed text-texto-suave">
          {articulo.resumen}
        </p>

        <div className="mt-auto flex items-center justify-between border-t border-borde pt-4">
          <div className="flex items-center gap-2">
            <span className="flex size-6 items-center justify-center rounded-full bg-rojo-tenue text-[11px] font-bold text-rojo-acento">
              E
            </span>
            <span className="text-xs font-medium text-texto-suave">{articulo.autor}</span>
          </div>

          <Link
            href={`/blog/${articulo.slug}`}
            className="flex items-center gap-1 text-xs font-medium text-rojo-acento transition-transform group-hover:translate-x-0.5"
            aria-label={`Leer artículo: ${articulo.titulo}`}
          >
            Leer artículo
            <ArrowUpRight size={14} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  );
}
