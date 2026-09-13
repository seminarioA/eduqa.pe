import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import { ArrowRight, Check, Clock, FlaskConical, Lock, Play, Route as RouteIcon } from "lucide-react";
import { usuarioActual } from "@/lib/supabase/servidor";
import { perfilActual, misMatriculas } from "@/lib/matriculas";
import { miProgreso, contarPorCurso } from "@/lib/progreso";
import { obtenerCursos } from "@/lib/catalogo-cursos";
import { rutas } from "@/lib/rutas";
import { cerrarSesion } from "@/app/acceder/acciones";
import { CabeceraApp } from "@/components/CabeceraApp";
import { Migas } from "@/components/Migas";
import { Icono } from "@/components/Iconos";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ ruta: string }>;
}): Promise<Metadata> {
  const { ruta: slug } = await params;
  const itinerarios = await rutas();
  const ruta = itinerarios.find((r) => r.slug === slug);
  return {
    title: ruta ? `${ruta.nombre} — EDUQA.PE` : "Ruta — EDUQA.PE",
    robots: { index: false, follow: false },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ ruta: string }>;
}) {
  const { ruta: slug } = await params;
  const usuario = await usuarioActual();
  if (!usuario) redirect(`/acceder?volverA=/rutas/${slug}`);

  const [perfil, matriculas, progreso, catalogo] = await Promise.all([
    perfilActual(),
    misMatriculas(),
    miProgreso(),
    obtenerCursos(),
  ]);

  const itinerarios = await rutas();
  const ruta = itinerarios.find((r) => r.slug === slug);
  if (!ruta) notFound();

  const cursosPorSlug = new Map(catalogo.map((c) => [c.slug, c]));
  const porCurso = new Map(matriculas.map((m) => [m.curso_slug, m]));
  const vistasPorCurso = contarPorCurso(progreso);

  const cursos = ruta.cursos.flatMap((c) => {
    const curso = cursosPorSlug.get(c.slug);
    if (!curso) return [];
    const m = porCurso.get(c.slug);
    const sesiones = curso.lecciones.length;
    const vistas = vistasPorCurso.get(c.slug) ?? 0;
    const completada = m?.estado === "completada" || (sesiones > 0 && vistas >= sesiones);
    const activa = m?.estado === "activa";
    return [
      {
        slug: c.slug,
        titulo: c.titulo,
        horas: curso.horas,
        sesiones,
        vistas,
        completada,
        activa,
        requisitos: c.requisitos,
        icono: curso.icono,
        primeraLeccion: curso.lecciones[0]?.slug ?? "introduccion",
      },
    ];
  });

  const completados = new Set(cursos.filter((c) => c.completada).map((c) => c.slug));

  return (
    <div className="mx-auto w-full max-w-4xl px-6 py-14 lg:pl-64 xl:pl-32 2xl:pl-6">
      <CabeceraApp
        acciones={
          <form action={cerrarSesion}>
            <button
              type="submit"
              className="text-xs text-texto-tenue hover:text-texto"
            >
              Salir
            </button>
          </form>
        }
      >
        <Migas
          items={[
            { texto: "Cursos", href: "/cursos" },
            { texto: ruta.nombre },
          ]}
        />
        <div className="mt-2 flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-rojo-tenue text-rojo-acento">
            <RouteIcon size={20} />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-texto">
              {ruta.nombre}
            </h1>
            <p className="text-xs text-texto-suave">
              Ruta estructurada · {cursos.length} cursos ordenados por prerrequisitos
            </p>
          </div>
        </div>
        {ruta.descripcion && (
          <p className="mt-3 text-sm leading-relaxed text-texto-suave">
            {ruta.descripcion}
          </p>
        )}
      </CabeceraApp>

      <ol className="mt-10 space-y-4">
        {cursos.map((c, idx) => {
          const desbloqueado = c.requisitos.every((r) => completados.has(r));
          const enlace = `/cursos/${c.slug}/${c.primeraLeccion}`;

          return (
            <li
              key={c.slug}
              className={`flex items-center justify-between gap-4 rounded-2xl border p-5 transition-all ${
                c.completada
                  ? "border-emerald-500/30 bg-superficie/60"
                  : c.activa
                    ? "border-rojo-acento/50 bg-superficie shadow-sm"
                    : desbloqueado
                      ? "border-borde bg-superficie"
                      : "border-borde/40 bg-superficie/30 opacity-60"
              }`}
            >
              <div className="flex items-center gap-4 min-w-0 flex-1">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-fondo font-mono text-xs font-bold text-texto-tenue ring-1 ring-borde">
                  {idx + 1}
                </span>

                <Icono nombre={c.icono} className="size-8 shrink-0 text-texto-tenue" />

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="truncate text-base font-semibold text-texto">
                      {c.titulo}
                    </h3>
                    {c.completada && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                        <Check size={11} /> Completado
                      </span>
                    )}
                  </div>

                  <div className="mt-1 flex items-center gap-3 text-xs text-texto-tenue">
                    <span>{c.horas} horas</span>
                    <span>·</span>
                    <span>{c.sesiones} sesiones</span>
                    {c.vistas > 0 && !c.completada && (
                      <>
                        <span>·</span>
                        <span className="text-rojo-acento">
                          {c.vistas} de {c.sesiones} vistas
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="shrink-0">
                {c.completada || c.activa ? (
                  <Link
                    href={enlace}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-rojo px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-rojo-hover"
                  >
                    <Play size={13} />
                    {c.completada ? "Repasar" : "Continuar"}
                  </Link>
                ) : desbloqueado ? (
                  <Link
                    href={`/cursos`}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-borde bg-fondo px-3.5 py-2 text-xs font-semibold text-texto transition-colors hover:border-rojo-acento hover:text-rojo-acento"
                  >
                    Matricularme
                    <ArrowRight size={13} />
                  </Link>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs text-texto-tenue">
                    <Lock size={13} />
                    Bloqueado
                  </span>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
