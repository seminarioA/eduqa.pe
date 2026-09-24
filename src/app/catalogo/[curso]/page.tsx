import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, BookOpen, Clock, LockKeyhole } from "lucide-react";
import { obtenerCatalogoPublico } from "@/lib/catalogo-publico";
import { esCursoIndexable, SITE_URL, urlAbsoluta } from "@/lib/seo";
import { LIMITE_PLAN_GRATIS } from "@/lib/matriculas";
import { Icono } from "@/components/Iconos";
import { Migas } from "@/components/Migas";

async function cursoPorSlug(slug: string) {
  return (await obtenerCatalogoPublico()).find((curso) => curso.slug === slug);
}

export async function generateMetadata({
  params,
}: PageProps<"/catalogo/[curso]">): Promise<Metadata> {
  const { curso: slug } = await params;
  const curso = await cursoPorSlug(slug);
  if (!curso) {
    return {
      title: "Curso no encontrado — EDUQA.PE",
      robots: { index: false, follow: true },
    };
  }

  const indexable = esCursoIndexable(curso);
  return {
    title: `${curso.titulo} — EDUQA.PE`,
    description: curso.resumen,
    alternates: { canonical: `/catalogo/${curso.slug}` },
    robots: { index: indexable, follow: true },
    openGraph: {
      title: curso.titulo,
      description: curso.resumen,
      type: "website",
      url: `/catalogo/${curso.slug}`,
    },
  };
}

function formatoLegible(formato: string | undefined) {
  if (formato === "microcurso") return "Microcurso";
  if (formato === "pildora") return "Píldora";
  return "Curso";
}

export default async function CursoPublicoPage({
  params,
}: PageProps<"/catalogo/[curso]">) {
  const { curso: slug } = await params;
  const catalogo = await obtenerCatalogoPublico();
  const curso = catalogo.find((item) => item.slug === slug);
  if (!curso) notFound();

  const urlCurso = urlAbsoluta(`/catalogo/${curso.slug}`);
  const primera = curso.lecciones[0];
  const relacionados = catalogo
    .filter(
      (item) =>
        item.slug !== curso.slug &&
        esCursoIndexable(item) &&
        item.area === curso.area,
    )
    .slice(0, 3);

  const courseJsonLd = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: curso.titulo,
    description: curso.resumen,
    url: urlCurso,
    educationalLevel: curso.nivel,
    timeRequired: `PT${curso.horas}H`,
    provider: {
      "@type": "Organization",
      name: "EDUQA.PE",
      url: SITE_URL,
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Inicio",
        item: urlAbsoluta("/"),
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Catálogo",
        item: urlAbsoluta("/catalogo"),
      },
      {
        "@type": "ListItem",
        position: 3,
        name: curso.titulo,
        item: urlCurso,
      },
    ],
  };

  return (
    <main className="mx-auto w-full max-w-4xl px-6 py-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([courseJsonLd, breadcrumbJsonLd]).replace(/</g, "\\u003c"),
        }}
      />

      <Migas
        items={[
          { texto: "Catálogo", href: "/catalogo" },
          { texto: curso.titulo },
        ]}
      />

      <header className="grid gap-8 border-b border-borde pb-10 sm:grid-cols-[1fr_auto] sm:items-start">
        <div>
          <p className="text-sm font-semibold text-rojo-acento">
            {curso.area} · {formatoLegible(curso.formato)}
          </p>
          <h1 className="mt-2 text-3xl font-semibold leading-tight tracking-tight sm:text-5xl">
            {curso.titulo}
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-texto-suave">
            {curso.resumen}
          </p>

          <dl className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-sm">
            <div>
              <dt className="text-xs uppercase tracking-wide text-texto-tenue">Nivel</dt>
              <dd className="mt-0.5 font-medium">{curso.nivel}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-texto-tenue">Duración</dt>
              <dd className="mt-0.5 flex items-center gap-1.5 font-medium">
                <Clock size={14} aria-hidden="true" />
                {curso.horas} horas
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-texto-tenue">Temario</dt>
              <dd className="mt-0.5 flex items-center gap-1.5 font-medium">
                <BookOpen size={14} aria-hidden="true" />
                {curso.lecciones.length} sesiones
              </dd>
            </div>
          </dl>
        </div>

        <div className="flex size-24 items-center justify-center rounded-3xl border border-borde bg-superficie">
          <Icono nombre={curso.icono} className="size-14 text-rojo-acento" />
        </div>
      </header>

      <section className="mt-10" aria-labelledby="temario">
        <h2 id="temario" className="text-2xl font-semibold tracking-tight">
          Temario
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-texto-suave">
          Los títulos de las sesiones son públicos para que puedas decidir si el curso
          encaja contigo antes de matricularte.
        </p>

        <ol className="mt-5 divide-y divide-borde rounded-2xl border border-borde">
          {curso.lecciones.map((leccion) => (
            <li key={leccion.slug} className="flex items-start gap-4 px-5 py-4">
              <span className="mt-0.5 font-mono text-xs text-texto-tenue">
                {String(leccion.numero).padStart(2, "0")}
              </span>
              <div className="min-w-0 flex-1">
                <h3 className="font-medium">{leccion.titulo}</h3>
              </div>
              {!curso.accesoLibre && (
                <LockKeyhole
                  size={15}
                  className="mt-0.5 shrink-0 text-texto-tenue"
                  aria-label="Contenido disponible dentro del curso"
                />
              )}
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-10 rounded-2xl border border-rojo-acento/30 bg-superficie p-6">
        <h2 className="text-xl font-semibold">
          {curso.accesoLibre ? "Puedes empezar a leerlo ahora" : "Empieza con una cuenta gratuita"}
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-texto-suave">
          {curso.accesoLibre
            ? "El material de este curso es abierto. Si además creas una cuenta, EDUQA.PE puede guardar tu avance."
            : `Puedes mantener hasta ${LIMITE_PLAN_GRATIS} cursos matriculados gratis a la vez. La compra individual de este curso es S/${curso.precio.toFixed(2)} cuando necesites un cupo adicional.`}
        </p>

        <div className="mt-5 flex flex-wrap gap-3">
          {curso.accesoLibre && primera ? (
            <Link
              href={`/cursos/${curso.slug}/${primera.slug}`}
              className="inline-flex items-center gap-2 rounded-lg bg-rojo px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-rojo-hover"
            >
              Leer primera sesión
              <ArrowRight size={15} aria-hidden="true" />
            </Link>
          ) : (
            <Link
              href="/registro"
              className="inline-flex items-center gap-2 rounded-lg bg-rojo px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-rojo-hover"
            >
              Crear cuenta gratis
              <ArrowRight size={15} aria-hidden="true" />
            </Link>
          )}
          <Link
            href="/acceder?volverA=/cursos"
            className="inline-flex items-center rounded-lg border border-borde px-5 py-3 text-sm font-semibold transition-colors hover:border-rojo-acento"
          >
            Ya tengo cuenta
          </Link>
        </div>
      </section>

      {relacionados.length > 0 && (
        <section className="mt-12 border-t border-borde pt-10" aria-labelledby="relacionados">
          <h2 id="relacionados" className="text-xl font-semibold tracking-tight">
            Más cursos de {curso.area}
          </h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {relacionados.map((relacionado) => (
              <Link
                key={relacionado.slug}
                href={`/catalogo/${relacionado.slug}`}
                className="rounded-xl border border-borde p-4 transition-colors hover:border-rojo-acento"
              >
                <p className="text-xs font-medium text-rojo-acento">{relacionado.nivel}</p>
                <h3 className="mt-1 font-semibold">{relacionado.titulo}</h3>
                <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-texto-suave">
                  {relacionado.resumen}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
