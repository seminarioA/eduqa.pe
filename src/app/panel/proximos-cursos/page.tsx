import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { BarChart3, Plus, Save, Vote } from "lucide-react";
import { Icono } from "@/components/Iconos";
import { Migas } from "@/components/Migas";
import { claseInput, claseInputBase } from "@/components/ui";
import { ICONOS_CURSO } from "@/lib/iconos-curso";
import { perfilActual } from "@/lib/matriculas";
import {
  ESTADOS_PROPUESTA,
  ETIQUETA_ESTADO,
  propuestasInternas,
} from "@/lib/proximos-cursos";
import { esInterno } from "@/lib/roles";
import { usuarioActual } from "@/lib/supabase/servidor";
import { actualizarPropuesta, crearPropuesta } from "./acciones";

export const metadata: Metadata = {
  title: "Gestión de próximos cursos — EDUQA.PE",
  robots: { index: false, follow: false },
};

const NIVELES = ["INTRODUCCIÓN", "INTERMEDIO", "AVANZADO"] as const;

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ estado?: string }>;
}) {
  const usuario = await usuarioActual();
  if (!usuario) redirect("/acceder?volverA=/panel/proximos-cursos");

  const perfil = await perfilActual();
  if (!esInterno(perfil)) redirect("/proximos-cursos");

  const [propuestas, parametros] = await Promise.all([
    propuestasInternas(),
    searchParams,
  ]);

  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-10 lg:pl-64 xl:pl-32 2xl:pl-6">
      <Migas
        items={[
          { texto: "Próximos cursos", href: "/proximos-cursos" },
          { texto: "Gestión" },
        ]}
      />

      <header className="mt-4 border-b border-borde pb-6">
        <div className="inline-flex items-center gap-2 rounded-full bg-rojo-tenue px-3 py-1 text-xs font-semibold uppercase tracking-wider text-rojo-acento">
          <Vote size={14} aria-hidden="true" />
          Gestión interna
        </div>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-texto">
          Propuestas de próximos cursos
        </h1>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-texto-suave">
          Aquí solo se define la ficha preliminar: título, subtítulo, precio,
          icono, nivel y área. La prioridad pública depende exclusivamente de
          los votos; la prioridad interna es un indicador editorial y no altera
          el ranking.
        </p>

        {parametros.estado && (
          <p className="mt-4 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-500">
            {parametros.estado === "creada"
              ? "Propuesta creada."
              : "Propuesta actualizada."}
          </p>
        )}
      </header>

      <section className="mt-8 rounded-2xl border border-borde bg-superficie p-6">
        <div className="flex items-center gap-2">
          <Plus size={17} className="text-rojo-acento" aria-hidden="true" />
          <h2 className="text-sm font-semibold uppercase tracking-wider text-texto">
            Nueva propuesta
          </h2>
        </div>

        <form action={crearPropuesta} className="mt-5 grid gap-4 sm:grid-cols-2">
          <label className="sm:col-span-2">
            <span className="mb-1.5 block text-sm font-medium text-texto">Título</span>
            <input name="titulo" required maxLength={140} className={claseInput} />
          </label>

          <label className="sm:col-span-2">
            <span className="mb-1.5 block text-sm font-medium text-texto">Subtítulo</span>
            <textarea
              name="subtitulo"
              maxLength={240}
              rows={2}
              className={claseInput}
              placeholder="Qué aprenderá o por qué existe esta propuesta."
            />
          </label>

          <label>
            <span className="mb-1.5 block text-sm font-medium text-texto">Área</span>
            <input
              name="area"
              required
              className={claseInput}
              placeholder="Ej. Lenguajes"
            />
          </label>

          <label>
            <span className="mb-1.5 block text-sm font-medium text-texto">Nivel</span>
            <select name="nivel" defaultValue="INTRODUCCIÓN" className={claseInput}>
              {NIVELES.map((nivel) => (
                <option key={nivel} value={nivel}>
                  {nivel}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span className="mb-1.5 block text-sm font-medium text-texto">Icono</span>
            <select name="icono" defaultValue="libro" className={claseInput}>
              {ICONOS_CURSO.map((icono) => (
                <option key={icono} value={icono}>
                  {icono}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span className="mb-1.5 block text-sm font-medium text-texto">Precio estimado</span>
            <input
              name="precio"
              type="number"
              min="0"
              step="0.01"
              defaultValue="20"
              className={claseInput}
            />
          </label>

          <label>
            <span className="mb-1.5 block text-sm font-medium text-texto">Estado</span>
            <select name="estado" defaultValue="borrador" className={claseInput}>
              {ESTADOS_PROPUESTA.map((estado) => (
                <option key={estado} value={estado}>
                  {ETIQUETA_ESTADO[estado]}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span className="mb-1.5 block text-sm font-medium text-texto">
              Prioridad interna
            </span>
            <input
              name="prioridadInterna"
              type="number"
              min="0"
              max="100"
              step="1"
              defaultValue="0"
              className={claseInput}
            />
          </label>

          <label className="sm:col-span-2">
            <span className="mb-1.5 block text-sm font-medium text-texto">
              Slug del curso publicado
            </span>
            <input
              name="cursoSlug"
              className={claseInput}
              placeholder="Opcional; se completa cuando exista el curso real."
            />
          </label>

          <div className="sm:col-span-2">
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-lg bg-rojo px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-rojo-hover"
            >
              <Plus size={16} aria-hidden="true" />
              Crear propuesta
            </button>
          </div>
        </form>
      </section>

      <section className="mt-10">
        <div className="flex items-center gap-2">
          <BarChart3 size={17} className="text-rojo-acento" aria-hidden="true" />
          <h2 className="text-sm font-semibold uppercase tracking-wider text-texto">
            Backlog ({propuestas.length})
          </h2>
        </div>

        {propuestas.length === 0 ? (
          <div className="mt-4 rounded-2xl border border-dashed border-borde p-8 text-center text-sm text-texto-suave">
            Todavía no hay propuestas.
          </div>
        ) : (
          <div className="mt-4 space-y-4">
            {propuestas.map((propuesta) => (
              <form
                key={propuesta.id}
                action={actualizarPropuesta}
                className="rounded-2xl border border-borde bg-superficie p-5"
              >
                <input type="hidden" name="id" value={propuesta.id} />

                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-borde bg-fondo">
                      <Icono
                        nombre={propuesta.icono}
                        className="size-6 text-texto-suave"
                      />
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-base font-semibold text-texto">
                        {propuesta.titulo}
                      </p>
                      <p className="mt-0.5 text-xs text-texto-tenue">
                        {propuesta.votos} {propuesta.votos === 1 ? "voto" : "votos"} ·
                        prioridad interna {propuesta.prioridadInterna}/100
                      </p>
                    </div>
                  </div>

                  <span className="rounded-full border border-borde bg-fondo px-2.5 py-1 text-xs font-medium text-texto-suave">
                    {ETIQUETA_ESTADO[propuesta.estado]}
                  </span>
                </div>

                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <label className="sm:col-span-2">
                    <span className="mb-1 block text-xs font-medium text-texto-suave">
                      Título
                    </span>
                    <input
                      name="titulo"
                      required
                      maxLength={140}
                      defaultValue={propuesta.titulo}
                      className={claseInput}
                    />
                  </label>

                  <label className="sm:col-span-2">
                    <span className="mb-1 block text-xs font-medium text-texto-suave">
                      Subtítulo
                    </span>
                    <textarea
                      name="subtitulo"
                      maxLength={240}
                      rows={2}
                      defaultValue={propuesta.subtitulo}
                      className={claseInput}
                    />
                  </label>

                  <label>
                    <span className="mb-1 block text-xs font-medium text-texto-suave">
                      Área
                    </span>
                    <input
                      name="area"
                      required
                      defaultValue={propuesta.area}
                      className={claseInput}
                    />
                  </label>

                  <label>
                    <span className="mb-1 block text-xs font-medium text-texto-suave">
                      Nivel
                    </span>
                    <select
                      name="nivel"
                      defaultValue={propuesta.nivel}
                      className={claseInput}
                    >
                      {NIVELES.map((nivel) => (
                        <option key={nivel} value={nivel}>
                          {nivel}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label>
                    <span className="mb-1 block text-xs font-medium text-texto-suave">
                      Icono
                    </span>
                    <select
                      name="icono"
                      defaultValue={propuesta.icono}
                      className={claseInput}
                    >
                      {ICONOS_CURSO.map((icono) => (
                        <option key={icono} value={icono}>
                          {icono}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label>
                    <span className="mb-1 block text-xs font-medium text-texto-suave">
                      Precio estimado
                    </span>
                    <input
                      name="precio"
                      type="number"
                      min="0"
                      step="0.01"
                      defaultValue={propuesta.precio}
                      className={claseInput}
                    />
                  </label>

                  <label>
                    <span className="mb-1 block text-xs font-medium text-texto-suave">
                      Estado
                    </span>
                    <select
                      name="estado"
                      defaultValue={propuesta.estado}
                      className={claseInput}
                    >
                      {ESTADOS_PROPUESTA.map((estado) => (
                        <option key={estado} value={estado}>
                          {ETIQUETA_ESTADO[estado]}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label>
                    <span className="mb-1 block text-xs font-medium text-texto-suave">
                      Prioridad interna
                    </span>
                    <input
                      name="prioridadInterna"
                      type="number"
                      min="0"
                      max="100"
                      step="1"
                      defaultValue={propuesta.prioridadInterna}
                      className={claseInput}
                    />
                  </label>

                  <label className="sm:col-span-2">
                    <span className="mb-1 block text-xs font-medium text-texto-suave">
                      Slug del curso publicado
                    </span>
                    <input
                      name="cursoSlug"
                      defaultValue={propuesta.cursoSlug ?? ""}
                      className={claseInputBase + " w-full font-mono"}
                    />
                  </label>
                </div>

                <div className="mt-5 flex items-center justify-end border-t border-borde pt-4">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 rounded-lg bg-rojo px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-rojo-hover"
                  >
                    <Save size={15} aria-hidden="true" />
                    Guardar
                  </button>
                </div>
              </form>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
