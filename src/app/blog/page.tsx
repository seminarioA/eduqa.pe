import Link from "next/link";
import type { Metadata } from "next";
import { BookOpen, ExternalLink, Newspaper, Tag } from "lucide-react";
import {
  obtenerArticulosBlog,
  obtenerArticulosMedium,
  obtenerCategoriasBlog,
} from "@/lib/blog-medium";
import { BlogCard } from "@/components/BlogCard";
import { Migas } from "@/components/Migas";
import { perfilActual } from "@/lib/matriculas";
import { GestionMedium } from "@/components/blog/GestionMedium";

export const metadata: Metadata = {
  title: "Blog Técnico — EDUQA.PE",
  description:
    "Artículos técnicos de EDUQA.PE y publicaciones sincronizadas desde Medium.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "Blog Técnico — EDUQA.PE",
    description:
      "Artículos técnicos de EDUQA.PE y publicaciones sincronizadas desde Medium.",
    type: "website",
    url: "/blog",
  },
};

export const revalidate = 3600;

export default async function BlogPage({ searchParams }: PageProps<"/blog">) {
  const [articulos, articulosMedium, categorias, perfil, consulta] =
    await Promise.all([
      obtenerArticulosBlog(),
      obtenerArticulosMedium(),
      obtenerCategoriasBlog(),
      perfilActual(),
      searchParams,
    ]);

  const tema =
    typeof consulta.tema === "string" && categorias.includes(consulta.tema)
      ? consulta.tema
      : "";
  const filtrados = tema
    ? articulos.filter((articulo) => articulo.categorias.includes(tema))
    : articulos;
  const destacado = filtrados[0];
  const lista = filtrados.slice(1);

  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-14 lg:pl-64 xl:pl-32 2xl:pl-6">
      <div className="flex items-center justify-between">
        <Migas items={[{ texto: "Blog Técnico" }]} />
        {destacado?.enlaceMedium && (
          <a
            href={destacado.enlaceMedium}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs font-medium text-texto-tenue transition-colors hover:text-rojo-acento"
          >
            <span>Ver en Medium</span>
            <ExternalLink size={13} aria-hidden="true" />
          </a>
        )}
      </div>

      <header className="mt-8">
        <h1 className="text-3xl font-bold tracking-tight text-texto sm:text-4xl">
          Blog
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-texto-suave">
          Ingeniería de software, inteligencia artificial y aprendizaje técnico,
          con artículos propios y publicaciones del canal Medium de EDUQA.PE.
        </p>
      </header>

      {perfil?.es_admin && <GestionMedium articulos={articulosMedium.length} />}

      {categorias.length > 0 && (
        <form
          action="/blog"
          method="get"
          className="mt-8 flex flex-wrap items-center gap-3 border-y border-borde py-4"
        >
          <label
            htmlFor="tema-blog"
            className="flex items-center gap-1.5 text-sm font-medium text-texto-suave"
          >
            <Tag size={15} aria-hidden="true" /> Tema
          </label>
          <select
            id="tema-blog"
            name="tema"
            defaultValue={tema}
            className="max-w-full rounded-lg border border-borde bg-fondo px-3 py-2 text-sm text-texto focus:border-rojo-acento focus:outline-2 focus:outline-rojo-acento"
          >
            <option value="">Todos los temas</option>
            {categorias.map((categoria) => (
              <option key={categoria} value={categoria}>
                {categoria}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="rounded-lg border border-borde px-3 py-2 text-sm font-medium text-texto transition-colors hover:bg-superficie"
          >
            Filtrar
          </button>
          {tema && (
            <Link
              href="/blog"
              className="text-sm text-texto-suave hover:text-rojo-acento"
            >
              Limpiar
            </Link>
          )}
        </form>
      )}

      {destacado && (
        <section className="mt-10" aria-label="Artículo destacado">
          <div className="overflow-hidden rounded-3xl border border-borde bg-superficie shadow-sm transition-all hover:border-rojo-acento">
            <div className="grid grid-cols-1 md:grid-cols-12">
              {destacado.portada && (
                <div className="relative aspect-video w-full overflow-hidden bg-fondo md:col-span-7 md:aspect-auto">
                  <img
                    src={destacado.portada}
                    alt={destacado.titulo}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute left-4 top-4 rounded-full bg-rojo px-3 py-1 text-xs font-bold text-white shadow-md">
                    Destacado
                  </div>
                </div>
              )}
              <div
                className={`flex flex-col justify-center p-8 ${
                  destacado.portada ? "md:col-span-5" : "md:col-span-12"
                }`}
              >
                <div className="flex flex-wrap gap-2">
                  {destacado.categorias.slice(0, 3).map((categoria) => (
                    <span
                      key={categoria}
                      className="rounded-full bg-rojo-tenue px-2.5 py-0.5 text-[11px] font-semibold text-rojo-acento"
                    >
                      {categoria}
                    </span>
                  ))}
                </div>

                <h2 className="mt-4 text-2xl font-bold leading-tight tracking-tight text-texto">
                  <Link
                    href={`/blog/${destacado.slug}`}
                    className="transition-colors hover:text-rojo-acento"
                  >
                    {destacado.titulo}
                  </Link>
                </h2>

                <p className="mt-3 line-clamp-4 text-sm leading-relaxed text-texto-suave">
                  {destacado.resumen}
                </p>

                <div className="mt-6 flex items-center justify-between border-t border-borde pt-4 text-xs text-texto-tenue">
                  <span>{destacado.fecha}</span>
                  <span>{destacado.minutosLectura} min de lectura</span>
                </div>

                <Link
                  href={`/blog/${destacado.slug}`}
                  className="mt-4 inline-flex items-center justify-center gap-2 rounded-xl bg-rojo px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-rojo-hover"
                >
                  <BookOpen size={14} />
                  Leer artículo completo
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="mt-12" aria-label="Todos los artículos">
        <h2 className="text-xl font-semibold tracking-tight text-texto">
          Artículos recientes
        </h2>
        {lista.length > 0 ? (
          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
            {lista.map((articulo) => (
              <BlogCard key={articulo.guid} articulo={articulo} />
            ))}
          </div>
        ) : !destacado ? (
          <div className="mt-6 rounded-2xl border border-dashed border-borde p-12 text-center">
            <Newspaper size={32} className="mx-auto text-texto-tenue" />
            <p className="mt-3 text-sm text-texto-suave">
              No hay artículos disponibles en este momento.
            </p>
          </div>
        ) : null}
      </section>
    </div>
  );
}
