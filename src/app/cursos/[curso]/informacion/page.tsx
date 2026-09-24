import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import {
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Download,
  FileText,
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
    <div className="flex min-w-0 items-baseline justify-between gap-4 border-b border-borde py-3 text-sm">
      <dt className="shrink-0 text-texto-suave">{etiqueta}</dt>
      <dd className="min-w-0 text-right font-medium leading-relaxed text-texto">{valor}</dd>
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
    info.requisitos.length > 0
      ? info.requisitos.map((requisito) => requisito.nombre).join(" · ")
      : "Sin prerrequisitos";

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
              <div className="flex items-center gap-2">
                <a
                  href={`/api/v1/cursos/${curso.slug}/informacion/pdf`}
                  className="inline-flex items-center gap-2 rounded-lg border border-borde px-3 py-2 text-xs font-medium text-texto-suave transition-colors hover:bg-superficie hover:text-rojo-acento focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rojo-acento"
                >
                  <Download size={15} aria-hidden="true" />
                  Descargar PDF
                </a>
                <SelectorTema />
              </div>
            </div>
            <h1 className="mt-2 text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
              Información del curso
            </h1>
            <p className="mt-3 max-w-3xl text-base leading-relaxed text-texto-suave">
              {curso.titulo}
            </p>

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

            <dl className="mt-5 border-y border-borde">
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

            <dl className="mt-5 divide-y divide-borde border-y border-borde">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 py-3 text-sm">
                <dt className="flex w-36 shrink-0 items-center gap-2 font-semibold">
                  <UserRound size={15} className="text-rojo-acento" aria-hidden="true" />
                  Creación
                </dt>
                <dd className="text-texto-suave">
                  Creado por:{" "}
                  <span className="font-medium text-texto">
                    {info.creado_por_nombre ?? "No registrado"}
                  </span>
                  <span className="mx-2 text-texto-tenue">·</span>
                  Fecha: <span className="font-medium text-texto">{fecha(info.creado_en)}</span>
                </dd>
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 py-3 text-sm">
                <dt className="flex w-36 shrink-0 items-center gap-2 font-semibold">
                  <CheckCircle2 size={15} className="text-rojo-acento" aria-hidden="true" />
                  Aprobación
                </dt>
                <dd className="text-texto-suave">
                  Aprobado por:{" "}
                  <span className="font-medium text-texto">
                    {info.aprobado_por_nombre ?? "No registrado"}
                  </span>
                  <span className="mx-2 text-texto-tenue">·</span>
                  Fecha: <span className="font-medium text-texto">{fecha(info.aprobado_en)}</span>
                </dd>
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 py-3 text-sm">
                <dt className="flex w-36 shrink-0 items-center gap-2 font-semibold">
                  <CalendarDays size={15} className="text-rojo-acento" aria-hidden="true" />
                  Publicación
                </dt>
                <dd className="text-texto-suave">
                  Fecha:{" "}
                  <span className="font-medium text-texto">{fecha(info.publicado_en)}</span>
                </dd>
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 py-3 text-sm">
                <dt className="flex w-36 shrink-0 items-center gap-2 font-semibold">
                  <Clock3 size={15} className="text-rojo-acento" aria-hidden="true" />
                  Actualización
                </dt>
                <dd className="text-texto-suave">
                  Fecha:{" "}
                  <span className="font-medium text-texto">{fecha(info.actualizado_en)}</span>
                </dd>
              </div>
            </dl>
          </section>

          <section
            className="mt-12 border-t border-borde pt-10"
            aria-labelledby="temario-indice"
          >
            <div className="flex items-center gap-2">
              <ListTree size={19} className="text-rojo-acento" aria-hidden="true" />
              <h2 id="temario-indice" className="text-xl font-semibold tracking-tight">
                Temario e índice de contenido
              </h2>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-texto-suave">
              Cada sesión se puede expandir o compactar. Los apartados enlazan al punto
              exacto del contenido.
            </p>

            <div className="mt-5 overflow-hidden rounded-2xl border border-borde">
              {curso.lecciones.map((leccion) => (
                <details
                  key={leccion.slug}
                  className="group border-b border-borde last:border-b-0"
                >
                  <summary className="flex cursor-pointer list-none items-center gap-3 px-5 py-4 transition-colors hover:bg-superficie [&::-webkit-details-marker]:hidden">
                    <span className="shrink-0 font-mono text-xs text-texto-tenue">
                      {String(leccion.numero).padStart(2, "0")}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-semibold">{leccion.titulo}</span>
                      <span className="mt-0.5 block text-xs font-normal text-texto-tenue">
                        {leccion.secciones.length}{" "}
                        {leccion.secciones.length === 1 ? "apartado" : "apartados"}
                      </span>
                    </span>
                    <ChevronRight
                      size={16}
                      className="shrink-0 text-texto-tenue transition-transform group-open:rotate-90"
                      aria-hidden="true"
                    />
                  </summary>

                  <div className="border-t border-borde px-5 pb-5 pt-3">
                    <Link
                      href={`/cursos/${curso.slug}/${leccion.slug}`}
                      className="inline-flex rounded px-2 py-1 text-sm font-medium text-rojo-acento transition-colors hover:bg-rojo-tenue"
                    >
                      Abrir sesión completa
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
                </details>
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
