import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import {
  BookOpen,
  Bug,
  Megaphone,
  Newspaper,
  Stamp,
  ArrowUpRight,
  Sparkles,
  CalendarDays,
  Mail,
  ShieldCheck,
} from "lucide-react";
import { usuarioActual } from "@/lib/supabase/servidor";
import { Migas } from "@/components/Migas";
import { obtenerCursos } from "@/lib/catalogo-cursos";
import { misMatriculas, perfilActual } from "@/lib/matriculas";
import { Llama } from "@/components/Llama";
import { Icono } from "@/components/Iconos";

export const metadata: Metadata = {
  title: "Panel — EDUQA.PE",
  robots: { index: false, follow: false },
};

export default async function Page() {
  const usuario = await usuarioActual();
  if (!usuario) redirect("/acceder?volverA=/panel");

  const [perfil, matriculas] = await Promise.all([
    perfilActual(),
    misMatriculas(),
  ]);

  const alta = usuario.created_at
    ? new Date(usuario.created_at).toLocaleDateString("es-PE", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  const catalogo = await obtenerCursos();
  const cursosPorSlug = new Map(catalogo.map((c) => [c.slug, c]));
  const nombre = perfil?.nombre?.trim() || usuario.email?.split("@")[0] || "Usuario";
  const rol = perfil?.es_admin ? "Administrador" : "Alumno";
  const inicial = nombre.charAt(0).toUpperCase();

  return (
    <main className="mx-auto w-full max-w-4xl px-6 py-10 lg:pl-64 xl:pl-32 2xl:pl-6">
      <Migas items={[{ texto: "Panel" }]} />

      <header className="mt-4 flex flex-col justify-between gap-4 border-b border-borde pb-6 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-texto">
            Panel de Usuario
          </h1>
          <p className="mt-1 text-sm text-texto-suave">
            Información de tu cuenta, cursos activos y accesos directos.
          </p>
        </div>
      </header>

      {/* Identidad y cursos activos */}
      <section className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.35fr)] lg:items-stretch">
        {/* Photocheck de usuario */}
        <article className="relative overflow-hidden rounded-2xl border border-rojo bg-rojo text-white">
          <div className="flex h-full flex-col p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white">
                  EDUQA.PE
                </p>
                <h2 className="mt-1 text-xs font-semibold uppercase tracking-wider text-white/75">
                  Datos de la cuenta
                </h2>
              </div>

              <Llama className="h-10 w-auto text-white" />
            </div>

            <div className="mt-6 flex flex-col items-center text-center">
              <div className="flex size-20 items-center justify-center overflow-hidden rounded-2xl border border-white/30 bg-white/10 text-3xl font-bold text-white shadow-sm">
                {perfil?.foto ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={perfil.foto}
                    alt={`Foto de ${nombre}`}
                    className="size-full object-cover"
                  />
                ) : (
                  inicial
                )}
              </div>

              <h3 className="mt-4 max-w-full truncate text-lg font-bold text-white">
                {nombre}
              </h3>
              <span className="mt-1.5 inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-white/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
                <ShieldCheck size={12} className="text-white" />
                {rol}
              </span>
            </div>

            <dl className="mt-6 space-y-3 border-t border-white/20 pt-5">
              <div className="flex items-start gap-3">
                <Mail size={15} className="mt-0.5 shrink-0 text-white/70" />
                <div className="min-w-0">
                  <dt className="text-[10px] uppercase tracking-wide text-white/65">
                    Correo
                  </dt>
                  <dd className="mt-0.5 truncate text-xs font-medium text-white">
                    {usuario.email}
                  </dd>
                </div>
              </div>

              {alta && (
                <div className="flex items-start gap-3">
                  <CalendarDays size={15} className="mt-0.5 shrink-0 text-white/70" />
                  <div>
                    <dt className="text-[10px] uppercase tracking-wide text-white/65">
                      Miembro desde
                    </dt>
                    <dd className="mt-0.5 text-xs font-medium text-white">
                      {alta}
                    </dd>
                  </div>
                </div>
              )}
            </dl>

            <div className="mt-auto pt-6">
              <Link
                href="/ajustes"
                className="inline-flex w-full items-center justify-center rounded-lg border border-white/25 bg-white/10 px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-white/20"
              >
                Editar perfil
              </Link>
            </div>
          </div>
        </article>

        {/* Cursos activos */}
        <article className="rounded-2xl border border-borde bg-superficie p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-lg bg-rojo-tenue text-rojo-acento">
                <BookOpen size={18} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-semibold text-texto">Cursos activos</h2>
                  <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-fondo px-1.5 py-0.5 text-[10px] font-semibold text-texto-suave">
                    {matriculas.length}
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-texto-tenue">
                  Continúa donde lo dejaste.
                </p>
              </div>
            </div>

            <Link
              href="/cursos"
              className="text-xs font-medium text-rojo-acento hover:underline"
            >
              Ver catálogo →
            </Link>
          </div>

          {matriculas.length === 0 ? (
            <div className="mt-6 rounded-xl border border-dashed border-borde p-8 text-center">
              <div className="mx-auto flex size-10 items-center justify-center rounded-xl bg-fondo text-texto-tenue">
                <BookOpen size={18} />
              </div>
              <p className="mt-3 text-sm text-texto-suave">
                Aún no te has matriculado en ningún curso.
              </p>
              <Link
                href="/cursos"
                className="mt-4 inline-flex rounded-lg bg-rojo px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-rojo-hover"
              >
                Explorar cursos
              </Link>
            </div>
          ) : (
            <div className="mt-6 space-y-3">
              {matriculas.map((m) => {
                const info = cursosPorSlug.get(m.curso_slug);
                return (
                  <div
                    key={m.curso_slug}
                    className="group flex items-center gap-3 rounded-xl border border-borde bg-fondo p-3 transition-colors hover:border-rojo-acento/60"
                  >
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-borde bg-superficie text-rojo-acento transition-colors group-hover:border-rojo-acento/40">
                      <Icono nombre={info?.icono} className="size-5" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="truncate text-[10px] uppercase tracking-wide text-texto-tenue">
                          {info?.area ?? "Curso"}
                        </span>
                        {info?.formato === "microcurso" && (
                          <span className="shrink-0 rounded bg-rojo-tenue px-1.5 py-0.5 text-[9px] font-bold text-rojo-acento">
                            Microcurso
                          </span>
                        )}
                      </div>
                      <h3 className="mt-0.5 truncate text-sm font-semibold text-texto">
                        {info?.titulo ?? m.curso_slug}
                      </h3>
                    </div>

                    <Link
                      href={`/cursos/${m.curso_slug}`}
                      aria-label={`Continuar ${info?.titulo ?? m.curso_slug}`}
                      className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-borde bg-superficie px-3 py-1.5 text-xs font-medium text-texto transition-colors hover:border-rojo-acento hover:text-rojo-acento"
                    >
                      <span className="hidden sm:inline">Continuar</span>
                      <ArrowUpRight size={13} />
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </article>
      </section>

      {/* Panel de administración modular */}
      {perfil?.es_admin && (
        <section className="mt-12 border-t border-borde pt-10" aria-label="Administración">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-rojo-acento" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-texto">
              Panel de Administración y Gestión
            </h2>
          </div>
          <p className="mt-1 text-xs text-texto-suave">
            Herramientas exclusivas para administradores de EDUQA.PE.
          </p>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {/* Gestión académica: cursos, microcursos y rutas */}
            <Link
              href="/panel/cursos"
              className="group flex flex-col justify-between rounded-2xl border border-borde bg-superficie p-5 transition-all hover:border-rojo-acento hover:shadow-sm"
            >
              <div>
                <div className="flex size-9 items-center justify-center rounded-lg bg-rojo-tenue text-rojo-acento">
                  <BookOpen size={18} />
                </div>
                <h3 className="mt-3 text-sm font-semibold text-texto group-hover:text-rojo-acento">
                  Gestión académica
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-texto-suave">
                  Cursos, microcursos y rutas de aprendizaje.
                </p>
              </div>
              <span className="mt-4 text-[11px] font-semibold text-rojo-acento">Entrar →</span>
            </Link>

            {/* El mismo blog muestra la publicación y su gestión. */}
            <Link
              href="/blog#gestion-medium"
              className="group flex flex-col justify-between rounded-2xl border border-borde bg-superficie p-5 transition-all hover:border-rojo-acento hover:shadow-sm"
            >
              <div>
                <div className="flex size-9 items-center justify-center rounded-lg bg-amber-500/10 text-amber-500">
                  <Newspaper size={18} />
                </div>
                <h3 className="mt-3 text-sm font-semibold text-texto group-hover:text-rojo-acento">
                  Blog
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-texto-suave">
                  Artículos y publicación desde Medium.
                </p>
              </div>
              <span className="mt-4 text-[11px] font-semibold text-rojo-acento">Entrar →</span>
            </Link>

            {/* 4. Avisos */}
            <Link
              href="/panel/avisos"
              className="group flex flex-col justify-between rounded-2xl border border-borde bg-superficie p-5 transition-all hover:border-rojo-acento hover:shadow-sm"
            >
              <div>
                <div className="flex size-9 items-center justify-center rounded-lg bg-purple-500/10 text-purple-500">
                  <Megaphone size={18} />
                </div>
                <h3 className="mt-3 text-sm font-semibold text-texto group-hover:text-rojo-acento">
                  Avisos Globales
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-texto-suave">
                  Banners y comunicados en catálogo.
                </p>
              </div>
              <span className="mt-4 text-[11px] font-semibold text-rojo-acento">Entrar →</span>
            </Link>

            {/* 5. Reportes */}
            <Link
              href="/panel/reportes"
              className="group flex flex-col justify-between rounded-2xl border border-borde bg-superficie p-5 transition-all hover:border-rojo-acento hover:shadow-sm"
            >
              <div>
                <div className="flex size-9 items-center justify-center rounded-lg bg-rose-500/10 text-rose-500">
                  <Bug size={18} />
                </div>
                <h3 className="mt-3 text-sm font-semibold text-texto group-hover:text-rojo-acento">
                  Reportes & Errores
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-texto-suave">
                  Incidencias reportadas por alumnos.
                </p>
              </div>
              <span className="mt-4 text-[11px] font-semibold text-rojo-acento">Entrar →</span>
            </Link>

            {/* 6. Marca */}
            <Link
              href="/panel/marca"
              className="group flex flex-col justify-between rounded-2xl border border-borde bg-superficie p-5 transition-all hover:border-rojo-acento hover:shadow-sm"
            >
              <div>
                <div className="flex size-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500">
                  <Stamp size={18} />
                </div>
                <h3 className="mt-3 text-sm font-semibold text-texto group-hover:text-rojo-acento">
                  Identidad Visual
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-texto-suave">
                  Logotipo SVG y personalización.
                </p>
              </div>
              <span className="mt-4 text-[11px] font-semibold text-rojo-acento">Entrar →</span>
            </Link>
          </div>
        </section>
      )}
    </main>
  );
}
