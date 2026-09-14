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
} from "lucide-react";
import { usuarioActual } from "@/lib/supabase/servidor";
import { Migas } from "@/components/Migas";
import { obtenerCursos } from "@/lib/catalogo-cursos";
import { misMatriculas, perfilActual } from "@/lib/matriculas";

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

      {/* Ficha de usuario */}
      <section className="mt-8 rounded-2xl border border-borde bg-superficie p-6">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-texto-tenue">
          Datos de la cuenta
        </h2>

        <dl className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-xs uppercase tracking-wide text-texto-tenue">Nombre</dt>
            <dd className="mt-0.5 text-sm font-medium text-texto">
              {perfil?.nombre ?? (
                <span className="italic text-texto-tenue">Sin especificar</span>
              )}
            </dd>
          </div>

          <div>
            <dt className="text-xs uppercase tracking-wide text-texto-tenue">Correo</dt>
            <dd className="mt-0.5 truncate font-medium">{usuario.email}</dd>
          </div>

          <div>
            <dt className="text-xs uppercase tracking-wide text-texto-tenue">Rol</dt>
            <dd className="mt-0.5 text-sm font-medium text-texto">
              {perfil?.es_admin ? "Administrador" : "Alumno"}
            </dd>
          </div>

          {alta && (
            <div>
              <dt className="text-xs uppercase tracking-wide text-texto-tenue">Miembro desde</dt>
              <dd className="mt-0.5 text-sm text-texto-suave">{alta}</dd>
            </div>
          )}
        </dl>

        <div className="mt-6 flex gap-3 border-t border-borde pt-4">
          <Link
            href="/ajustes"
            className="rounded-lg border border-borde bg-fondo px-3 py-1.5 text-xs font-medium text-texto transition-colors hover:border-rojo-acento hover:text-rojo-acento"
          >
            Editar perfil
          </Link>
        </div>
      </section>

      {/* Mis cursos: lo que ve cualquier usuario */}
      <section className="mt-10">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-texto-tenue">
            Mis Cursos Activos ({matriculas.length})
          </h2>
          <Link
            href="/cursos"
            className="text-xs font-medium text-rojo-acento hover:underline"
          >
            Ver catálogo completo →
          </Link>
        </div>

        {matriculas.length === 0 ? (
          <div className="mt-3 rounded-2xl border border-dashed border-borde p-8 text-center">
            <p className="text-sm text-texto-suave">
              Aún no te has matriculado en ningún curso.
            </p>
            <Link
              href="/cursos"
              className="mt-3 inline-block rounded-xl bg-rojo px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-rojo-hover"
            >
              Explorar cursos disponibles
            </Link>
          </div>
        ) : (
          <div className="mt-3 divide-y divide-borde rounded-2xl border border-borde bg-superficie">
            {matriculas.map((m) => {
              const info = cursosPorSlug.get(m.curso_slug);
              return (
                <div
                  key={m.curso_slug}
                  className="flex flex-col justify-between gap-3 p-4 sm:flex-row sm:items-center"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-texto-tenue">
                        {info?.area ?? "Curso"}
                      </span>
                      {info?.formato === "microcurso" && (
                        <span className="rounded bg-rojo-tenue px-1.5 py-0.5 text-[9px] font-bold text-rojo-acento">
                          Microcurso
                        </span>
                      )}
                    </div>
                    <h3 className="mt-1 truncate text-sm font-semibold text-texto">
                      {info?.titulo ?? m.curso_slug}
                    </h3>
                  </div>

                  <div className="flex items-center gap-3">
                    <Link
                      href={`/cursos/${m.curso_slug}`}
                      className="inline-flex items-center gap-1 rounded-lg border border-borde bg-fondo px-3 py-1.5 text-xs font-medium text-texto transition-colors hover:border-rojo-acento"
                    >
                      Continuar
                      <ArrowUpRight size={13} />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
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
