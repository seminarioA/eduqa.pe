import { redirect } from "next/navigation";
import type { Metadata } from "next";
import {
  BookOpen,
  ExternalLink,
  Globe,
  Newspaper,
  RefreshCw,
  Rss,
  Sparkles,
} from "lucide-react";
import { usuarioEsAdmin } from "@/lib/supabase/servidor";
import { Migas } from "@/components/Migas";
import { obtenerArticulosMedium } from "@/lib/blog-medium";
import { BotonSincronizar } from "./BotonSincronizar";

export const metadata: Metadata = {
  title: "Gestión de Blog — Panel EDUQA.PE",
  robots: { index: false, follow: false },
};

export default async function PanelBlogPage() {
  const esAdmin = await usuarioEsAdmin();
  if (!esAdmin) redirect("/cursos");

  const articulos = await obtenerArticulosMedium();

  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-14 lg:pl-64 xl:pl-32 2xl:pl-6">
      <Migas
        items={[
          { texto: "Panel", href: "/panel" },
          { texto: "Blog Medium" },
        ]}
      />

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-b border-borde pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-rojo-acento">
            <Newspaper size={14} />
            Sincronización de Contenido
          </div>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-texto">
            Blog Sincronizado con Medium
          </h1>
          <p className="mt-1 text-sm text-texto-suave">
            Monitorea los artículos publicados en Medium que se distribuyen automáticamente bajo el
            nombre de la empresa.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <BotonSincronizar />
          <a
            href="https://medium.com/@seminarioA"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-xl border border-borde bg-superficie px-3.5 py-2 text-xs font-semibold text-texto-suave transition-colors hover:border-rojo-acento hover:text-texto"
          >
            <span>Canal Medium</span>
            <ExternalLink size={13} />
          </a>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-borde bg-superficie p-5">
          <div className="flex items-center gap-2 text-xs font-medium text-texto-tenue">
            <Rss size={14} className="text-rojo-acento" />
            Fuente Feed RSS
          </div>
          <p className="mt-2 text-sm font-semibold text-texto">@seminarioA</p>
          <span className="mt-1 inline-block text-[11px] text-texto-tenue">
            Revalidación automática cada 1h
          </span>
        </div>

        <div className="rounded-2xl border border-borde bg-superficie p-5">
          <div className="flex items-center gap-2 text-xs font-medium text-texto-tenue">
            <BookOpen size={14} className="text-rojo-acento" />
            Artículos Activos
          </div>
          <p className="mt-2 text-2xl font-bold text-texto">{articulos.length}</p>
          <span className="mt-1 inline-block text-[11px] text-texto-tenue">
            Disponibles en /blog
          </span>
        </div>

        <div className="rounded-2xl border border-borde bg-superficie p-5">
          <div className="flex items-center gap-2 text-xs font-medium text-texto-tenue">
            <Globe size={14} className="text-rojo-acento" />
            Conversión a Cursos
          </div>
          <p className="mt-2 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
            Activa con CTA
          </p>
          <span className="mt-1 inline-block text-[11px] text-texto-tenue">
            Banners automáticos al final
          </span>
        </div>
      </div>

      {/* Lista de artículos sincronizados */}
      <section className="mt-10">
        <h2 className="text-lg font-semibold tracking-tight text-texto">
          Artículos en catálogo sincronizado
        </h2>
        <div className="mt-4 divide-y divide-borde rounded-2xl border border-borde bg-superficie">
          {articulos.map((art) => (
            <div
              key={art.guid}
              className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-texto-tenue">{art.fecha}</span>
                  <span>·</span>
                  <span className="text-xs text-texto-tenue">
                    {art.minutosLectura} min lectura
                  </span>
                </div>
                <h3 className="mt-1 text-base font-semibold text-texto hover:text-rojo-acento">
                  <a href={`/blog/${art.slug}`}>{art.titulo}</a>
                </h3>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {art.categorias.map((c) => (
                    <span
                      key={c}
                      className="rounded bg-fondo px-2 py-0.5 text-[10px] font-medium text-texto-suave ring-1 ring-borde"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                <a
                  href={`/blog/${art.slug}`}
                  className="rounded-lg border border-borde px-3 py-1.5 text-xs font-medium text-texto transition-colors hover:border-rojo-acento"
                >
                  Ver en sitio
                </a>
                <a
                  href={art.enlaceMedium}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg bg-fondo p-1.5 text-texto-tenue hover:text-texto"
                  aria-label="Abrir en Medium"
                >
                  <ExternalLink size={15} />
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
