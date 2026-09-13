import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  BookOpen,
  Check,
  ChevronRight,
  Clock,
  GraduationCap,
  Lock,
  Route as RutaIcono,
  Sparkles,
} from "lucide-react";
import { rutas } from "@/lib/rutas";
import { obtenerCursos } from "@/lib/catalogo-cursos";
import { precios } from "@/lib/precios";
import { misMatriculas, usuarioActual } from "@/lib/matriculas";
import { Icono } from "@/components/Iconos";
import { Migas } from "@/components/Migas";

export async function generateStaticParams() {
  const todas = await rutas();
  return todas.map((r) => ({ ruta: r.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ ruta: string }>;
}): Promise<Metadata> {
  const { ruta: rutaSlug } = await params;
  const lista = await rutas();
  const encontrada = lista.find((r) => r.slug === rutaSlug);
  if (!encontrada) return { title: "Ruta no encontrada — EDUQA.PE" };

  return {
    title: `Ruta: ${encontrada.nombre} — EDUQA.PE`,
    description:
      encontrada.descripcion ||
      `Especialización y secuencia de aprendizaje estructurada en EDUQA.PE.`,
  };
}

export default async function RutaDetallePage({
  params,
}: {
  params: Promise<{ ruta: string }>;
}) {
  const { ruta: rutaSlug } = await params;
  const [todasLasRutas, catalogo, tarifas, matriculas, usuario] = await Promise.all([
    rutas(),
    obtenerCursos(),
    precios(),
    misMatriculas(),
    usuarioActual(),
  ]);

  const ruta = todasLasRutas.find((r) => r.slug === rutaSlug);
  if (!ruta) notFound();

  const cursosPorSlug = new Map(catalogo.map((c) => [c.slug, c]));
  const matriculasPorSlug = new Map(matriculas.map((m) => [m.curso_slug, m]));

  const cursosConDetalle = ruta.cursos.map((c, index) => {
    const info = cursosPorSlug.get(c.slug);
    const matricula = matriculasPorSlug.get(c.slug);
    const tarifa = tarifas.get(c.slug);

    return {
      slug: c.slug,
      titulo: c.titulo || info?.titulo || c.slug,
      resumen: info?.resumen || "",
      horas: info?.horas || 0,
      sesiones: info?.lecciones.length || 0,
      icono: info?.icono,
      area: info?.area,
      nivel: info?.nivel,
      formato: info?.formato,
      precio: tarifa?.precio || 0,
      matriculado: matricula?.estado === "activa" || matricula?.estado === "completada",
      completado: matricula?.estado === "completada",
      posicion: index + 1,
      requisitos: c.requisitos || [],
    };
  });

  const horasTotales = cursosConDetalle.reduce((acc, c) => acc + c.horas, 0);

  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-14 lg:pl-64 xl:pl-32 2xl:pl-6">
      <Migas
        items={[
          { texto: "Cursos", href: "/cursos" },
          { texto: `Ruta: ${ruta.nombre}` },
        ]}
      />

      <header className="mt-6 border-b border-borde pb-8">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-borde bg-superficie px-3 py-1 text-xs font-semibold text-rojo-acento">
          <RutaIcono size={13} />
          Ruta de Especialización
        </div>

        <h1 className="mt-3 text-3xl font-bold tracking-tight text-texto sm:text-4xl">
          {ruta.nombre}
        </h1>

        {ruta.descripcion && (
          <p className="mt-3 max-w-3xl text-base leading-relaxed text-texto-suave">
            {ruta.descripcion}
          </p>
        )}

        <div className="mt-6 flex flex-wrap items-center gap-5 text-xs text-texto-tenue">
          <span className="flex items-center gap-1.5">
            <BookOpen size={14} className="text-rojo-acento" />
            <strong className="text-texto">{cursosConDetalle.length}</strong> Cursos
          </span>
          <span>·</span>
          <span className="flex items-center gap-1.5">
            <Clock size={14} className="text-rojo-acento" />
            <strong className="text-texto">{horasTotales}</strong> Horas lectivas
          </span>
        </div>
      </header>

      {/* Secuencia de la Ruta */}
      <section className="mt-10" aria-label="Cursos en esta ruta">
        <h2 className="text-xl font-bold tracking-tight text-texto">
          Secuencia Pedagógica Recomendada
        </h2>
        <p className="mt-1 text-xs text-texto-suave">
          Sigue el orden diseñado para garantizar que dominas las bases antes de avanzar a los módulos avanzados.
        </p>

        <div className="mt-8 flex flex-col gap-4">
          {cursosConDetalle.map((c, i) => (
            <div
              key={c.slug}
              className="group relative flex flex-col gap-4 rounded-2xl border border-borde bg-superficie p-6 transition-all hover:border-rojo-acento hover:shadow-md sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-start gap-4">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-fondo text-xs font-bold text-rojo-acento ring-1 ring-borde">
                  {i + 1}
                </span>

                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    {c.icono && <Icono nombre={c.icono} className="size-5 text-texto-tenue" />}
                    <h3 className="text-base font-semibold text-texto group-hover:text-rojo-acento">
                      <Link href={`/cursos/${c.slug}`}>{c.titulo}</Link>
                    </h3>
                    {c.formato === "microcurso" && (
                      <span className="rounded-full bg-rojo-tenue px-2 py-0.5 text-[9px] font-bold uppercase text-rojo-acento">
                        Microcurso
                      </span>
                    )}
                  </div>

                  {c.resumen && (
                    <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-texto-suave">
                      {c.resumen}
                    </p>
                  )}

                  <div className="mt-3 flex flex-wrap items-center gap-3 text-[11px] text-texto-tenue">
                    <span>{c.sesiones} sesiones</span>
                    <span>·</span>
                    <span>{c.horas} horas</span>
                    {c.requisitos.length > 0 && (
                      <>
                        <span>·</span>
                        <span className="text-amber-600 dark:text-amber-400">
                          Requiere: {c.requisitos.join(", ")}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 self-end sm:self-center">
                {c.completado ? (
                  <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    <Check size={13} />
                    Completado
                  </span>
                ) : c.matriculado ? (
                  <Link
                    href={`/cursos/${c.slug}`}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-superficie px-4 py-2 text-xs font-semibold text-texto ring-1 ring-borde hover:bg-fondo"
                  >
                    Continuar
                    <ChevronRight size={13} />
                  </Link>
                ) : (
                  <Link
                    href={`/cursos/${c.slug}`}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-rojo px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-rojo-hover"
                  >
                    Ver curso
                    <ChevronRight size={13} />
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
