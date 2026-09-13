import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import {
  BookOpen,
  Bug,
  GraduationCap,
  Megaphone,
  Newspaper,
  Route,
  Sparkles,
  Stamp,
  Users,
} from "lucide-react";
import { usuarioActual, usuarioEsAdmin } from "@/lib/supabase/servidor";
import { obtenerCursos } from "@/lib/catalogo-cursos";
import { precios } from "@/lib/precios";
import { totalEstudiantes } from "@/lib/matriculas";
import { Icono } from "@/components/Iconos";
import { Migas } from "@/components/Migas";

export const metadata: Metadata = {
  title: "Panel de Gestión — EDUQA.PE",
  robots: { index: false, follow: false },
};

export default async function PanelPrincipalPage() {
  const usuario = await usuarioActual();
  if (!usuario) redirect("/acceder?volverA=/panel");

  const esAdmin = await usuarioEsAdmin();
  const [catalogo, tarifas, alumnosTotal] = await Promise.all([
    obtenerCursos(),
    precios(),
    totalEstudiantes(),
  ]);

  const cursosPublicados = catalogo.filter((c) => tarifas.has(c.slug));

  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-14 lg:pl-64 xl:pl-32 2xl:pl-6">
      <Migas items={[{ texto: "Panel de Control" }]} />

      <header className="mt-6 border-b border-borde pb-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-rojo-acento">
              {esAdmin ? "Administración & Gestión" : "Mi Portal de Aprendizaje"}
            </span>
            <h1 className="mt-1 text-3xl font-bold tracking-tight text-texto">
              {esAdmin ? "Panel de Gestión General" : "Mis Cursos & Formación"}
            </h1>
            <p className="mt-1 text-sm text-texto-suave">
              {esAdmin
                ? "Administra los cursos, rutas de aprendizaje, blog en Medium, marca y avisos globales."
                : "Accede a tus cursos activos, certificaciones y materiales."}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/cursos"
              className="inline-flex items-center gap-1.5 rounded-xl border border-borde bg-superficie px-4 py-2 text-xs font-semibold text-texto-suave transition-colors hover:border-rojo-acento hover:text-texto"
            >
              <GraduationCap size={15} />
              Ver Catálogo
            </Link>
          </div>
        </div>
      </header>

      {/* Métricas clave */}
      <section className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3" aria-label="Métricas">
        <div className="rounded-2xl border border-borde bg-superficie p-5">
          <div className="flex items-center gap-2 text-xs font-medium text-texto-tenue">
            <BookOpen size={14} className="text-rojo-acento" />
            Cursos Disponibles
          </div>
          <p className="mt-2 text-2xl font-bold text-texto">{cursosPublicados.length}</p>
          <span className="mt-1 inline-block text-[11px] text-texto-tenue">
            {catalogo.length} registrados en Markdown
          </span>
        </div>

        <div className="rounded-2xl border border-borde bg-superficie p-5">
          <div className="flex items-center gap-2 text-xs font-medium text-texto-tenue">
            <Users size={14} className="text-rojo-acento" />
            Estudiantes Registrados
          </div>
          <p className="mt-2 text-2xl font-bold text-texto">{alumnosTotal}</p>
          <span className="mt-1 inline-block text-[11px] text-texto-tenue">
            En toda la plataforma
          </span>
        </div>

        <div className="rounded-2xl border border-borde bg-superficie p-5">
          <div className="flex items-center gap-2 text-xs font-medium text-texto-tenue">
            <Sparkles size={14} className="text-rojo-acento" />
            Nuevos Formatos
          </div>
          <p className="mt-2 text-sm font-semibold text-texto">Cursos & Microcursos</p>
          <span className="mt-1 inline-block text-[11px] text-texto-tenue">
            Píldoras de alta intensidad técnica
          </span>
        </div>
      </section>

      {/* Módulos de Gestión para Administradores */}
      {esAdmin && (
        <section className="mt-12" aria-label="Módulos de administración">
          <div className="mb-6">
            <h2 className="text-xl font-bold tracking-tight text-texto">
              Módulos de Gestión
            </h2>
            <p className="mt-1 text-sm text-texto-suave">
              Selecciona el área que deseas administrar. Cada módulo cuenta con su propio panel y herramientas dedicadas.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* 1. Gestión de Cursos */}
            <Link
              href="/panel/cursos"
              className="group flex flex-col justify-between rounded-2xl border border-borde bg-superficie p-6 transition-all duration-200 hover:-translate-y-1 hover:border-rojo-acento hover:shadow-lg"
            >
              <div>
                <div className="flex size-11 items-center justify-center rounded-xl bg-rojo-tenue text-rojo-acento transition-colors group-hover:bg-rojo group-hover:text-white">
                  <GraduationCap size={22} />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-texto group-hover:text-rojo-acento">
                  Gestión de Cursos
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-texto-suave">
                  Publicar o despublicar cursos Markdown, fijar precios en Soles (PEN) y gestionar la visibilidad.
                </p>
              </div>
              <div className="mt-6 flex items-center text-xs font-semibold text-rojo-acento">
                <span>Administrar cursos →</span>
              </div>
            </Link>

            {/* 2. Rutas de Aprendizaje */}
            <Link
              href="/panel/rutas"
              className="group flex flex-col justify-between rounded-2xl border border-borde bg-superficie p-6 transition-all duration-200 hover:-translate-y-1 hover:border-rojo-acento hover:shadow-lg"
            >
              <div>
                <div className="flex size-11 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500 transition-colors group-hover:bg-blue-600 group-hover:text-white">
                  <Route size={22} />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-texto group-hover:text-rojo-acento">
                  Rutas de Aprendizaje
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-texto-suave">
                  Crear y editar rutas formativas paso a paso, asignar secuencias de cursos y configurar prerrequisitos.
                </p>
              </div>
              <div className="mt-6 flex items-center text-xs font-semibold text-rojo-acento">
                <span>Administrar rutas →</span>
              </div>
            </Link>

            {/* 3. Blog Sincronizado con Medium */}
            <Link
              href="/panel/blog"
              className="group flex flex-col justify-between rounded-2xl border border-borde bg-superficie p-6 transition-all duration-200 hover:-translate-y-1 hover:border-rojo-acento hover:shadow-lg"
            >
              <div>
                <div className="flex size-11 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500 transition-colors group-hover:bg-amber-600 group-hover:text-white">
                  <Newspaper size={22} />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-texto group-hover:text-rojo-acento">
                  Blog en Medium
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-texto-suave">
                  Monitorear sincronización del feed RSS de Medium a nombre de la empresa y forzar recarga de caché.
                </p>
              </div>
              <div className="mt-6 flex items-center text-xs font-semibold text-rojo-acento">
                <span>Gestionar blog →</span>
              </div>
            </Link>

            {/* 4. Avisos Globales */}
            <Link
              href="/panel/avisos"
              className="group flex flex-col justify-between rounded-2xl border border-borde bg-superficie p-6 transition-all duration-200 hover:-translate-y-1 hover:border-rojo-acento hover:shadow-lg"
            >
              <div>
                <div className="flex size-11 items-center justify-center rounded-xl bg-purple-500/10 text-purple-500 transition-colors group-hover:bg-purple-600 group-hover:text-white">
                  <Megaphone size={22} />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-texto group-hover:text-rojo-acento">
                  Avisos & Comunicados
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-texto-suave">
                  Publicar banners informativos y alertas globales visibles para los alumnos en el catálogo.
                </p>
              </div>
              <div className="mt-6 flex items-center text-xs font-semibold text-rojo-acento">
                <span>Gestionar avisos →</span>
              </div>
            </Link>

            {/* 5. Reportes de Errores */}
            <Link
              href="/panel/reportes"
              className="group flex flex-col justify-between rounded-2xl border border-borde bg-superficie p-6 transition-all duration-200 hover:-translate-y-1 hover:border-rojo-acento hover:shadow-lg"
            >
              <div>
                <div className="flex size-11 items-center justify-center rounded-xl bg-rose-500/10 text-rose-500 transition-colors group-hover:bg-rose-600 group-hover:text-white">
                  <Bug size={22} />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-texto group-hover:text-rojo-acento">
                  Reportes & Feedback
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-texto-suave">
                  Revisar incidencias reportadas por los estudiantes durante la ejecución interactiva de código.
                </p>
              </div>
              <div className="mt-6 flex items-center text-xs font-semibold text-rojo-acento">
                <span>Revisar reportes →</span>
              </div>
            </Link>

            {/* 6. Identidad & Marca */}
            <Link
              href="/panel/marca"
              className="group flex flex-col justify-between rounded-2xl border border-borde bg-superficie p-6 transition-all duration-200 hover:-translate-y-1 hover:border-rojo-acento hover:shadow-lg"
            >
              <div>
                <div className="flex size-11 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500 transition-colors group-hover:bg-emerald-600 group-hover:text-white">
                  <Stamp size={22} />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-texto group-hover:text-rojo-acento">
                  Identidad Visual
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-texto-suave">
                  Personalizar el logotipo SVG oficial, colores de marca y aspecto en la barra lateral.
                </p>
              </div>
              <div className="mt-6 flex items-center text-xs font-semibold text-rojo-acento">
                <span>Ajustar marca →</span>
              </div>
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
