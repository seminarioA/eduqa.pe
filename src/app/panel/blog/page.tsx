import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { ArrowUpRight, BookOpen, Clock, Globe } from "lucide-react";
import { usuarioActual } from "@/lib/supabase/servidor";
import { perfilActual } from "@/lib/matriculas";
import { obtenerArticulosMedium } from "@/lib/blog-medium";
import { Migas } from "@/components/Migas";
import { BotonSincronizar } from "./BotonSincronizar";

export const metadata: Metadata = {
  title: "Sincronización Blog Medium — EDUQA.PE",
  robots: { index: false, follow: false },
};

export default async function PanelBlogPage() {
  const usuario = await usuarioActual();
  if (!usuario) redirect("/acceder?volverA=/panel/blog");

  const perfil = await perfilActual();
  if (!perfil?.es_admin) redirect("/cursos");

  const articulos = await obtenerArticulosMedium();

  const feedUrl =
    process.env.MEDIUM_FEED_URL ||
    (process.env.NEXT_PUBLIC_MEDIUM_USERNAME
      ? `https://medium.com/feed/@${process.env.NEXT_PUBLIC_MEDIUM_USERNAME.replace(/^@/, "")}`
      : "https://medium.com/feed/@seminarioA");

  return (
    <main className="mx-auto w-full max-w-4xl px-6 py-10 lg:pl-64 xl:pl-32 2xl:pl-6">
      <Migas
        items={[
          { texto: "Panel", href: "/panel" },
          { texto: "Blog & Medium" },
        ]}
      />

      <div className="mt-4 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-texto">
            Sincronización con Medium
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-texto-suave">
            Los artículos publicados a nombre de la empresa en Medium se sincronizan automáticamente cada hora mediante su feed RSS y se sirven optimizados en la sección <code>/blog</code> de la plataforma.
          </p>
        </div>

        <BotonSincronizar />
      </div>

      <section className="mt-8 rounded-2xl border border-borde bg-superficie p-6">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-texto-tenue">
          Estado del Canal de Sincronización
        </h2>

        <dl className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-xs uppercase tracking-wide text-texto-tenue">Feed RSS Configurado</dt>
            <dd className="mt-1 flex items-center gap-1.5 font-mono text-xs text-rojo-acento">
              <Globe size={13} />
              <a href={feedUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">
                {feedUrl}
              </a>
            </dd>
          </div>

          <div>
            <dt className="text-xs uppercase tracking-wide text-texto-tenue">Artículos en Caché</dt>
            <dd className="mt-1 text-sm font-semibold text-texto">
              {articulos.length} artículos sincronizados
            </dd>
          </div>
        </dl>
      </section>

      <section className="mt-10">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-texto-tenue">
          Artículos Disponibles en la Plataforma ({articulos.length})
        </h2>

        <div className="mt-3 divide-y divide-borde rounded-2xl border border-borde bg-superficie">
          {articulos.map((art) => (
            <div
              key={art.guid}
              className="flex flex-col justify-between gap-3 p-4 sm:flex-row sm:items-center"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="rounded-md bg-fondo px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-texto-tenue ring-1 ring-borde">
                    {art.categorias[0] ?? "Artículo"}
                  </span>
                  <span className="text-xs text-texto-tenue">· {art.fecha}</span>
                </div>
                <h3 className="mt-1 truncate text-sm font-medium text-texto">
                  {art.titulo}
                </h3>
                <p className="mt-0.5 font-mono text-[11px] text-texto-tenue">
                  /blog/{art.slug}
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-3">
                <span className="flex items-center gap-1 text-xs text-texto-tenue">
                  <Clock size={12} />
                  {art.minutosLectura} min
                </span>

                <a
                  href={art.enlaceMedium}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 rounded-lg border border-borde bg-fondo px-2.5 py-1 text-xs font-medium text-texto-suave transition-colors hover:border-rojo-acento hover:text-rojo-acento"
                >
                  <BookOpen size={12} />
                  Medium
                  <ArrowUpRight size={11} />
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
