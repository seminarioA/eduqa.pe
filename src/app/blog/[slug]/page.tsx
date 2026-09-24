import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  Calendar,
  Clock,
  ExternalLink,
  GraduationCap,
  Tag,
  ArrowLeft,
  BookOpen,
} from "lucide-react";
import { buscarArticuloBlog, obtenerArticulosBlog } from "@/lib/blog-medium";
import { Migas } from "@/components/Migas";
import { ProgresoLectura } from "@/components/blog/ProgresoLectura";

export async function generateStaticParams() {
  const articulos = await obtenerArticulosBlog();
  return articulos.map((articulo) => ({ slug: articulo.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const articulo = await buscarArticuloBlog(slug);
  if (!articulo) return { title: "Artículo no encontrado — EDUQA.PE" };

  return {
    title: `${articulo.titulo} — Blog EDUQA.PE`,
    description: articulo.resumen,
    alternates: { canonical: `/blog/${articulo.slug}` },
    openGraph: {
      title: articulo.titulo,
      description: articulo.resumen,
      type: "article",
      publishedTime: articulo.fechaIso,
      authors: [articulo.autor],
      url: `/blog/${articulo.slug}`,
      images: articulo.portada ? [{ url: articulo.portada }] : [],
    },
  };
}

export default async function ArticuloPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const articulo = await buscarArticuloBlog(slug);

  if (!articulo) {
    notFound();
  }

  return (
    <>
      <ProgresoLectura />
      <article className="mx-auto w-full max-w-4xl px-6 py-14 lg:pl-64 xl:pl-32 2xl:pl-6">
        <div className="flex items-center justify-between gap-4">
          <Migas
            items={[
              { texto: "Blog", href: "/blog" },
              {
                texto:
                  articulo.titulo.length > 35
                    ? articulo.titulo.slice(0, 35) + "..."
                    : articulo.titulo,
              },
            ]}
          />
          <Link
            href="/blog"
            className="flex shrink-0 items-center gap-1.5 text-xs font-medium text-texto-tenue transition-colors hover:text-rojo-acento"
          >
            <ArrowLeft size={13} />
            <span>Volver al blog</span>
          </Link>
        </div>

        <header className="mt-8 border-b border-borde pb-8">
          <div className="flex flex-wrap items-center gap-2">
            {articulo.categorias.map((categoria) => (
              <span
                key={categoria}
                className="inline-flex items-center gap-1 rounded-full bg-rojo-tenue px-3 py-1 text-xs font-semibold text-rojo-acento"
              >
                <Tag size={11} />
                {categoria}
              </span>
            ))}
          </div>

          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-texto sm:text-4xl lg:text-5xl lg:leading-tight">
            {articulo.titulo}
          </h1>

          <p className="mt-5 max-w-3xl text-base leading-relaxed text-texto-suave sm:text-lg">
            {articulo.resumen}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-texto-tenue">
            <div className="flex items-center gap-2">
              <span className="flex size-7 items-center justify-center rounded-full bg-rojo-tenue text-xs font-bold text-rojo-acento">
                E
              </span>
              <span className="font-semibold text-texto">{articulo.autor}</span>
            </div>
            <span>·</span>
            <span className="flex items-center gap-1.5">
              <Calendar size={13} aria-hidden="true" />
              <time dateTime={articulo.fechaIso}>{articulo.fecha}</time>
            </span>
            <span>·</span>
            <span className="flex items-center gap-1.5">
              <Clock size={13} aria-hidden="true" />
              {articulo.minutosLectura} min de lectura
            </span>
          </div>
        </header>

        {articulo.portada && (
          <div className="mt-8 overflow-hidden rounded-3xl border border-borde bg-fondo shadow-sm">
            <img
              src={articulo.portada}
              alt={articulo.titulo}
              className="aspect-video w-full object-cover"
            />
          </div>
        )}

        <div
          className="prose prose-lg dark:prose-invert mt-10 max-w-none prose-headings:scroll-mt-24 prose-headings:font-semibold prose-headings:tracking-tight prose-p:leading-8 prose-li:leading-7 prose-a:text-rojo-acento prose-pre:rounded-2xl prose-pre:border prose-pre:border-borde prose-img:rounded-2xl"
          dangerouslySetInnerHTML={{ __html: articulo.contenido }}
        />

        <section
          className="mt-14 rounded-3xl border border-rojo-acento/30 bg-gradient-to-br from-superficie via-rojo-tenue/20 to-fondo p-8 text-center"
          aria-label="Aprende más en EDUQA.PE"
        >
          <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-rojo-tenue text-rojo-acento">
            <GraduationCap size={24} />
          </div>
          <h3 className="mt-4 text-xl font-bold tracking-tight text-texto">
            Convierte la lectura en práctica
          </h3>
          <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-texto-suave">
            En EDUQA.PE puedes continuar con cursos y ejercicios interactivos
            directamente desde el navegador.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/catalogo"
              className="inline-flex items-center gap-2 rounded-xl bg-rojo px-5 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-rojo-hover"
            >
              <BookOpen size={14} />
              Explorar catálogo de cursos
            </Link>
            {articulo.enlaceMedium && (
              <a
                href={articulo.enlaceMedium}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-xl border border-borde bg-superficie px-4 py-2.5 text-xs font-semibold text-texto-suave transition-colors hover:border-rojo-acento hover:text-texto"
              >
                <span>Ver en Medium</span>
                <ExternalLink size={13} />
              </a>
            )}
          </div>
        </section>
      </article>
    </>
  );
}
