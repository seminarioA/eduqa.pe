import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, Clock } from "lucide-react";
import { obtenerCatalogoPublico } from "@/lib/catalogo-publico";
import { esCursoIndexable, urlAbsoluta } from "@/lib/seo";
import { LIMITE_PLAN_GRATIS } from "@/lib/matriculas";
import { Icono } from "@/components/Iconos";
import { Migas } from "@/components/Migas";

export const metadata: Metadata = {
  title: "Cursos de tecnología en español — EDUQA.PE",
  description:
    "Explora cursos y microcursos de programación, datos, inteligencia artificial, ingeniería y otras áreas técnicas en EDUQA.PE.",
  alternates: { canonical: "/catalogo" },
  openGraph: {
    title: "Cursos de tecnología en español — EDUQA.PE",
    description:
      "Cursos y microcursos técnicos con temario público, duración y nivel antes de registrarte.",
    type: "website",
    url: "/catalogo",
  },
};

function etiquetaFormato(formato: string | undefined) {
  if (formato === "microcurso") return "Microcurso";
  if (formato === "pildora") return "Píldora";
  return "Curso";
}

export default async function CatalogoPublicoPage() {
  const cursos = (await obtenerCatalogoPublico()).filter(esCursoIndexable);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Catálogo de cursos de EDUQA.PE",
    itemListElement: cursos.map((curso, indice) => ({
      "@type": "ListItem",
      position: indice + 1,
      name: curso.titulo,
      url: urlAbsoluta(`/catalogo/${curso.slug}`),
    })),
  };

  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <Migas items={[{ texto: "Catálogo" }]} />

      <header className="max-w-3xl">
        <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-rojo-acento">
          Catálogo público
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
          Cursos y microcursos de tecnología
        </h1>
        <p className="mt-4 text-base leading-relaxed text-texto-suave">
          Revisa el temario, nivel y duración antes de crear una cuenta. Cada curso
          tiene una página pública propia y el material protegido sigue dentro del LMS.
        </p>
      </header>

      {cursos.length === 0 ? (
        <p className="mt-10 rounded-xl border border-borde bg-superficie px-5 py-8 text-sm text-texto-suave">
          No hay cursos públicos con una ficha completa en este momento.
        </p>
      ) : (
        <section className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3" aria-label="Cursos disponibles">
          {cursos.map((curso) => (
            <article
              key={curso.slug}
              className="flex flex-col rounded-2xl border border-borde bg-fondo p-5"
            >
              <div className="flex items-start justify-between gap-4">
                <Icono nombre={curso.icono} className="size-12 text-texto-tenue" />
                <span className="rounded-full bg-superficie px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-texto-suave ring-1 ring-inset ring-borde">
                  {curso.nivel}
                </span>
              </div>

              <p className="mt-4 text-xs font-medium text-rojo-acento">
                {curso.area} · {etiquetaFormato(curso.formato)}
              </p>
              <h2 className="mt-1 text-lg font-semibold leading-snug">
                <Link
                  href={`/catalogo/${curso.slug}`}
                  className="transition-colors hover:text-rojo-acento"
                >
                  {curso.titulo}
                </Link>
              </h2>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-texto-suave">
                {curso.resumen}
              </p>

              <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 border-t border-borde pt-4 text-xs text-texto-tenue">
                <span className="flex items-center gap-1.5">
                  <BookOpen size={13} aria-hidden="true" />
                  {curso.lecciones.length} sesiones
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock size={13} aria-hidden="true" />
                  {curso.horas} h
                </span>
              </div>

              <Link
                href={`/catalogo/${curso.slug}`}
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-rojo-acento hover:underline"
              >
                Ver temario
                <ArrowRight size={14} aria-hidden="true" />
              </Link>
            </article>
          ))}
        </section>
      )}

      <aside className="mt-10 rounded-2xl border border-borde bg-superficie p-6">
        <p className="font-medium">Puedes empezar sin pagar una suscripción.</p>
        <p className="mt-2 text-sm leading-relaxed text-texto-suave">
          La cuenta gratuita permite mantener hasta {LIMITE_PLAN_GRATIS} cursos
          matriculados a la vez. Cuando quieras, crea tu cuenta y continúa desde el LMS.
        </p>
        <Link
          href="/registro"
          className="mt-4 inline-flex items-center gap-2 rounded-lg bg-rojo px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-rojo-hover"
        >
          Crear cuenta gratis
          <ArrowRight size={15} aria-hidden="true" />
        </Link>
      </aside>
    </main>
  );
}
