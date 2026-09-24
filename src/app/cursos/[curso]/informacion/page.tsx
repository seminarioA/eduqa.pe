import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import {
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileText,
  Info,
  ListTree,
  Route,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { buscarCurso } from "@/lib/catalogo-cursos";
import { informacionEditorialCurso } from "@/lib/info-curso";
import { esAccesoLibre } from "@/lib/precios";
import { estaMatriculado, perfilActual } from "@/lib/matriculas";
import { usuarioActual } from "@/lib/supabase/servidor";
import { rutaDeCadaCurso } from "@/lib/rutas";
import {
  BarraLateral,
  type HerramientaCurso,
} from "@/components/curso/BarraLateral";
import { Migas } from "@/components/Migas";
import { SelectorTema } from "@/components/Tema";

export const dynamic = "force-dynamic";

function fecha(valor: string | null) {
  if (!valor) return "No registrada";
  return new Intl.DateTimeFormat("es-PE", {
    dateStyle: "long",
    timeZone: "America/Lima",
  }).format(new Date(valor));
}

function estadoLegible(estado: string) {
  if (estado === "publico") return "Público";
  if (estado === "privado") return "Privado";
  if (estado === "archivado") return "Archivado";
  if (estado === "borrador") return "Borrador";
  return estado;
}

function formatoLegible(formato: string | undefined) {
  if (formato === "microcurso") return "Microcurso";
  if (formato === "pildora") return "Píldora";
  return "Curso";
}

function Dato({ etiqueta, valor }: { etiqueta: string; valor: string }) {
  return (
    <div className="rounded-xl border border-borde bg-superficie p-4">
      <dt className="text-[11px] font-semibold uppercase tracking-wider text-texto-tenue">
        {etiqueta}
      </dt>
      <dd className="mt-1.5 text-sm font-medium leading-relaxed text-texto">{valor}</dd>
    </div>
  );
}

export async function generateMetadata({
  params,
}: PageProps<"/cursos/[curso]/informacion">): Promise<Metadata> {
  const { curso: slug } = await params;
  const curso = await buscarCurso(slug);
  if (!curso) return { title: "Curso no encontrado — EDUQA.PE" };
  return {
    title: `Información del curso — ${curso.titulo}`,
    description: `Ficha académica y trazabilidad editorial de ${curso.titulo}.`,
    robots: { index: false, follow: false },
  };
}

export default async function InformacionCursoPage({
  params,
}: PageProps<"/cursos/[curso]/informacion">) {
  const { curso: cursoSlug } = await params;
  const curso = await buscarCurso(cursoSlug);
  if (!curso) notFound();

  const [info, libre, usuario] = await Promise.all([
    informacionEditorialCurso(cursoSlug),
    esAccesoLibre(cursoSlug),
    usuarioActual(),
  ]);
  if (!info) notFound();

  if (!libre) {
    if (!usuario) {
      redirect(`/acceder?volverA=/cursos/${cursoSlug}/informacion`);
    }

    const perfil = await perfilActual();
    if (!perfil?.es_admin && !(await estaMatriculado(cursoSlug))) {
      redirect(`/cursos?matricularse=${cursoSlug}`);
    }
  }

  const ruta = (await rutaDeCadaCurso()).get(cursoSlug);
  const herramientas: HerramientaCurso[] =
    curso.icono === "fortran" && ruta
      ? [
          {
            href: `/rutas/${ruta.ruta}/sandbox`,
            etiqueta: "Sandbox de Fortran",
            tipo: "sandbox",
          },
        ]
      : cursoSlug === "python"
        ? [
            {
              href: "/cursos/python/sandbox",
              etiqueta: "Sandbox de Python",
              tipo: "sandbox",
            },
            {
              href: "/cursos/python/quiz",
              etiqueta: "Quiz de Python",
              tipo: "quiz",
            },
          ]
        : [];

  const requisitos =
    info.requisitos.length > 0 ? info.requisitos.join(", ") : "Sin prerrequisitos";

  return (
    <div className="flex min-h-dvh">
      <BarraLateral
        curso={curso}
        codigo={info.codigo}
        inicio={usuario ? "/cursos" : "/"}
        herramientas={herramientas}
        informacionActiva
      />

      <main className="min-w-0 flex-1">
        <article className="mx-auto w-full max-w-4xl px-6 py-12 lg:px-10">
          <Migas
            items={[
              { texto: "Cursos", href: usuario ? "/cursos" : "/" },
              {
                texto: curso.titulo,
                href: `/cursos/${curso.slug}/${curso.lecciones[0].slug}`,
              },
              { texto: "Información del curso" },
            ]}
          />

          <header className="border-b border-borde pb-8">
            <div className="flex items-start justify-between gap-4">
              <p className="font-mono text-sm text-rojo-acento">Ficha del curso</p>
              <SelectorTema />
            </div>
            <h1 className="mt-2 text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
              Información del curso
            </h1>
            <p className="mt-3 max-w-3xl text-base leading-relaxed text-texto-suave">
              {curso.titulo}
            </p>

            <div className="mt-5 flex gap-3 rounded-xl border border-borde bg-superficie p-4">
              <Info size={18} className="mt-0.5 shrink-0 text-rojo-acento" aria-hidden="true" />
              <div>
                <p className="text-sm font-medium">Sección informativa y opcional</p>
                <p className="mt-1 text-xs leading-relaxed text-texto-suave">
                  Consultarla no registra una sesión vista, no suma progreso y no es
                  necesaria para completar el curso.
                </p>
              </div>
            </div>
          </header>

          <section className="mt-10" aria-labelledby="ficha-academica">
            <div className="flex items-center gap-2">
              <FileText size={19} className="text-rojo-acento" aria-hidden="true" />
              <h2 id="ficha-academica" className="text-xl font-semibold tracking-tight">
                Ficha académica
              </h2>
            </div>

            <p className="mt-3 text-sm leading-relaxed text-texto-suave">
              {curso.resumen}
            </p>

            <dl className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <Dato etiqueta="Título" valor={curso.titulo} />
              <Dato etiqueta="Código editorial" valor={info.codigo ?? "Sin código"} />
              <Dato etiqueta="Revisión" valor={String(info.revision)} />
              <Dato etiqueta="Área" valor={curso.area} />
              <Dato etiqueta="Nivel" valor={curso.nivel} />
              <Dato etiqueta="Formato" valor={formatoLegible(curso.formato)} />
              <Dato etiqueta="Duración" valor={`${curso.horas} horas`} />
              <Dato
                etiqueta="Sesiones"
                valor={`${curso.lecciones.length} ${curso.lecciones.length === 1 ? "sesión" : "sesiones"}`}
              />
              <Dato etiqueta="Estado" valor={estadoLegible(info.estado)} />
              <Dato
                etiqueta="Acceso"
                valor={info.acceso_libre ? "Acceso libre" : "Requiere matrícula"}
              />
              <Dato
                etiqueta="Precio individual"
                valor={info.acceso_libre ? "Acceso libre" : `S/ ${info.precio.toFixed(2)}`}
              />
              <Dato etiqueta="Ruta de aprendizaje" valor={ruta?.nombre ?? "Sin ruta asignada"} />
              <Dato
                etiqueta="Posición en la ruta"
                valor={info.posicion === null ? "No aplica" : String(info.posicion)}
              />
              <Dato etiqueta="Prerrequisitos" valor={requisitos} />
            </dl>
          </section>

          <section className="mt-12 border-t border-borde pt-10" aria-labelledby="trazabilidad">
            <div className="flex items-center gap-2">
              <ShieldCheck size={19} className="text-rojo-acento" aria-hidden="true" />
              <h2 id="trazabilidad" className="text-xl font-semibold tracking-tight">
                Trazabilidad editorial
              </h2>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-borde p-5">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <UserRound size={16} className="text-rojo-acento" aria-hidden="true" />
                  Creación
                </div>
                <p className="mt-3 text-sm">
                  <span className="text-texto-suave">Creado por:</span>{" "}
                  {info.creado_por_nombre ?? "No registrado"}
                </p>
                <p className="mt-1 text-sm">
                  <span className="text-texto-suave">Fecha:</span> {fecha(info.creado_en)}
                </p>
              </div>

              <div className="rounded-xl border border-borde p-5">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <CheckCircle2 size={16} className="text-rojo-acento" aria-hidden="true" />
                  Aprobación
                </div>
                <p className="mt-3 text-sm">
                  <span className="text-texto-suave">Aprobado por:</span>{" "}
                  {info.aprobado_por_nombre ?? "No registrado"}
                </p>
                <p className="mt-1 text-sm">
                  <span className="text-texto-suave">Fecha:</span> {fecha(info.aprobado_en)}
                </p>
              </div>

              <div className="rounded-xl border border-borde p-5">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <CalendarDays size={16} className="text-rojo-acento" aria-hidden="true" />
                  Publicación
                </div>
                <p className="mt-3 text-sm">
                  <span className="text-texto-suave">Fecha:</span> {fecha(info.publicado_en)}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-texto-tenue">
                  Se registra la primera vez que el curso pasa a estado público.
                </p>
              </div>

              <div className="rounded-xl border border-borde p-5">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <Clock3 size={16} className="text-rojo-acento" aria-hidden="true" />
                  Última actualización
                </div>
                <p className="mt-3 text-sm">{fecha(info.actualizado_en)}</p>
                <p className="mt-1 text-xs leading-relaxed text-texto-tenue">
                  Corresponde a la última modificación registrada de la ficha del curso.
                </p>
              </div>
            </div>
          </section>

          <section className="mt-12 border-t border-borde pt-10" aria-labelledby="temario">
            <div className="flex items-center gap-2">
              <BookOpen size={19} className="text-rojo-acento" aria-hidden="true" />
              <h2 id="temario" className="text-xl font-semibold tracking-tight">
                Temario
              </h2>
            </div>

            <ol className="mt-5 divide-y divide-borde rounded-2xl border border-borde">
              {curso.lecciones.map((leccion) => (
                <li key={leccion.slug} className="flex items-start gap-4 px-5 py-4">
                  <span className="mt-0.5 font-mono text-xs text-texto-tenue">
                    {String(leccion.numero).padStart(2, "0")}
                  </span>
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/cursos/${curso.slug}/${leccion.slug}`}
                      className="font-medium transition-colors hover:text-rojo-acento"
                    >
                      {leccion.titulo}
                    </Link>
                    <p className="mt-1 text-xs text-texto-tenue">
                      {leccion.secciones.length}{" "}
                      {leccion.secciones.length === 1 ? "apartado" : "apartados"} en el índice
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section
            className="mt-12 border-t border-borde pt-10"
            aria-labelledby="indice-contenido"
          >
            <div className="flex items-center gap-2">
              <ListTree size={19} className="text-rojo-acento" aria-hidden="true" />
              <h2 id="indice-contenido" className="text-xl font-semibold tracking-tight">
                Índice de contenido
              </h2>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-texto-suave">
              Índice navegable de las sesiones y sus apartados. Abrir un enlace te lleva
              al punto exacto del contenido.
            </p>

            <div className="mt-5 space-y-4">
              {curso.lecciones.map((leccion) => (
                <div key={leccion.slug} className="rounded-2xl border border-borde p-5">
                  <Link
                    href={`/cursos/${curso.slug}/${leccion.slug}`}
                    className="flex items-center gap-2 font-semibold transition-colors hover:text-rojo-acento"
                  >
                    <span className="font-mono text-xs text-texto-tenue">
                      {String(leccion.numero).padStart(2, "0")}
                    </span>
                    {leccion.titulo}
                  </Link>

                  {leccion.secciones.length === 0 ? (
                    <p className="mt-3 text-xs text-texto-tenue">
                      Esta sesión no declara apartados adicionales.
                    </p>
                  ) : (
                    <ul className="mt-3 space-y-1 border-l border-borde pl-3">
                      {leccion.secciones.map((seccion) => (
                        <li
                          key={seccion.id}
                          className={
                            seccion.nivel === 1
                              ? ""
                              : seccion.nivel === 2
                                ? "pl-4"
                                : "pl-8"
                          }
                        >
                          <Link
                            href={`/cursos/${curso.slug}/${leccion.slug}#${seccion.id}`}
                            className="block rounded px-2 py-1 text-sm text-texto-suave transition-colors hover:bg-superficie hover:text-rojo-acento"
                          >
                            {seccion.titulo}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>

          {ruta && (
            <section className="mt-12 border-t border-borde pt-10">
              <div className="flex items-center gap-2">
                <Route size={19} className="text-rojo-acento" aria-hidden="true" />
                <h2 className="text-xl font-semibold tracking-tight">Ruta de aprendizaje</h2>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-texto-suave">
                Este curso ocupa la posición {ruta.posicion} de {ruta.de} en{" "}
                <span className="font-medium text-texto">{ruta.nombre}</span>.
              </p>
            </section>
          )}
        </article>
      </main>
    </div>
  );
}
