"use client";

import { useState, useTransition } from "react";
import { Plus, Route, Check, Trash2, ArrowUpDown } from "lucide-react";
import {
  accionCrearRuta,
  accionEliminarRuta,
  accionAsignarCursoARuta,
} from "./acciones";

type CursoBasico = {
  slug: string;
  titulo: string;
  ruta?: string | null;
  posicion?: number;
  requisitos?: string[];
};

type RutaBasica = {
  slug: string;
  nombre: string;
  descripcion: string | null;
  orden: number;
  cursos: {
    slug: string;
    titulo: string;
    posicion: number;
    requisitos: string[];
  }[];
};

export function GestionRutasForm({
  rutas,
  cursos,
}: {
  rutas: RutaBasica[];
  cursos: CursoBasico[];
}) {
  const [abiertoNuevaRuta, setAbiertoNuevaRuta] = useState(false);
  const [abiertoAsignar, setAbiertoAsignar] = useState(false);
  const [rutaSeleccionada, setRutaSeleccionada] = useState<string>(
    rutas[0]?.slug ?? "",
  );

  const [isPending, startTransition] = useTransition();
  const [mensaje, setMensaje] = useState<string | null>(null);

  const handleCrearRuta = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setMensaje(null);
    startTransition(async () => {
      try {
        await accionCrearRuta(fd);
        setMensaje("Ruta creada con éxito");
        setAbiertoNuevaRuta(false);
      } catch (err) {
        setMensaje((err as Error).message);
      }
    });
  };

  const handleEliminarRuta = (slug: string) => {
    if (!confirm(`¿Eliminar la ruta "${slug}"?`)) return;
    setMensaje(null);
    startTransition(async () => {
      try {
        await accionEliminarRuta(slug);
        setMensaje("Ruta eliminada");
      } catch (err) {
        setMensaje((err as Error).message);
      }
    });
  };

  const handleAsignarCurso = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setMensaje(null);
    startTransition(async () => {
      try {
        await accionAsignarCursoARuta(fd);
        setMensaje("Curso asignado correctamente");
        setAbiertoAsignar(false);
      } catch (err) {
        setMensaje((err as Error).message);
      }
    });
  };

  return (
    <div className="space-y-6">
      {mensaje && (
        <div className="rounded-xl border border-borde bg-superficie p-3 text-xs font-medium text-texto">
          {mensaje}
        </div>
      )}

      {/* Botones de acción rápida */}
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => setAbiertoNuevaRuta(!abiertoNuevaRuta)}
          className="inline-flex items-center gap-1.5 rounded-xl bg-rojo px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-rojo-hover"
        >
          <Plus size={14} />
          Nueva ruta
        </button>

        <button
          type="button"
          onClick={() => setAbiertoAsignar(!abiertoAsignar)}
          className="inline-flex items-center gap-1.5 rounded-xl border border-borde bg-superficie px-3.5 py-2 text-xs font-semibold text-texto transition-colors hover:border-rojo-acento hover:text-rojo-acento"
        >
          <ArrowUpDown size={14} />
          Asignar curso a ruta
        </button>
      </div>

      {/* Modal / Panel colapsable de Crear Ruta */}
      {abiertoNuevaRuta && (
        <form
          onSubmit={handleCrearRuta}
          className="rounded-2xl border border-borde bg-superficie p-5 space-y-3"
        >
          <h3 className="text-xs font-semibold uppercase tracking-wider text-rojo-acento">
            Crear Nueva Ruta de Aprendizaje
          </h3>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-medium text-texto-suave">Slug (Identificador URL)</label>
              <input
                name="slug"
                placeholder="ej. ingenieria-ia"
                required
                className="mt-1 w-full rounded-lg border border-borde bg-fondo px-3 py-1.5 text-xs text-texto focus:border-rojo-acento focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-texto-suave">Nombre de la Ruta</label>
              <input
                name="nombre"
                placeholder="ej. Especialista en IA y Deep Learning"
                required
                className="mt-1 w-full rounded-lg border border-borde bg-fondo px-3 py-1.5 text-xs text-texto focus:border-rojo-acento focus:outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-texto-suave">Descripción Pedagógica</label>
            <textarea
              name="descripcion"
              rows={2}
              placeholder="Objetivos formativos de esta especialización..."
              className="mt-1 w-full rounded-lg border border-borde bg-fondo px-3 py-1.5 text-xs text-texto focus:border-rojo-acento focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-texto-suave">Orden de aparición</label>
            <input
              type="number"
              name="orden"
              defaultValue={rutas.length + 1}
              className="mt-1 w-24 rounded-lg border border-borde bg-fondo px-3 py-1.5 text-xs text-texto focus:border-rojo-acento focus:outline-none"
            />
          </div>
          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              disabled={isPending}
              className="rounded-lg bg-rojo px-3 py-1.5 text-xs font-semibold text-white hover:bg-rojo-hover disabled:opacity-50"
            >
              {isPending ? "Guardando..." : "Crear ruta"}
            </button>
            <button
              type="button"
              onClick={() => setAbiertoNuevaRuta(false)}
              className="rounded-lg border border-borde px-3 py-1.5 text-xs font-medium text-texto-suave hover:text-texto"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}

      {/* Formulario Asignar Curso */}
      {abiertoAsignar && (
        <form
          onSubmit={handleAsignarCurso}
          className="rounded-2xl border border-borde bg-superficie p-5 space-y-3"
        >
          <h3 className="text-xs font-semibold uppercase tracking-wider text-rojo-acento">
            Asignar Curso y Configurar Prerrequisitos
          </h3>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-medium text-texto-suave">Selecciona la Ruta</label>
              <select
                name="rutaSlug"
                value={rutaSeleccionada}
                onChange={(e) => setRutaSeleccionada(e.target.value)}
                className="mt-1 w-full rounded-lg border border-borde bg-fondo px-3 py-1.5 text-xs text-texto focus:border-rojo-acento focus:outline-none"
              >
                {rutas.map((r) => (
                  <option key={r.slug} value={r.slug}>
                    {r.nombre} ({r.slug})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-texto-suave">Selecciona el Curso</label>
              <select
                name="cursoSlug"
                className="mt-1 w-full rounded-lg border border-borde bg-fondo px-3 py-1.5 text-xs text-texto focus:border-rojo-acento focus:outline-none"
              >
                {cursos.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.titulo} ({c.slug})
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-medium text-texto-suave">Posición / Orden en la Ruta</label>
              <input
                type="number"
                name="posicion"
                defaultValue={1}
                min={1}
                className="mt-1 w-full rounded-lg border border-borde bg-fondo px-3 py-1.5 text-xs text-texto focus:border-rojo-acento focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-texto-suave">
                Prerrequisitos (separados por coma)
              </label>
              <input
                name="requisitos"
                placeholder="ej. python-basico, estadistica"
                className="mt-1 w-full rounded-lg border border-borde bg-fondo px-3 py-1.5 text-xs text-texto focus:border-rojo-acento focus:outline-none"
              />
            </div>
          </div>
          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              disabled={isPending}
              className="rounded-lg bg-rojo px-3 py-1.5 text-xs font-semibold text-white hover:bg-rojo-hover disabled:opacity-50"
            >
              {isPending ? "Asignando..." : "Guardar asignación"}
            </button>
            <button
              type="button"
              onClick={() => setAbiertoAsignar(false)}
              className="rounded-lg border border-borde px-3 py-1.5 text-xs font-medium text-texto-suave hover:text-texto"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}

      {/* Lista de Rutas Actuales y sus cursos */}
      <div className="space-y-4">
        {rutas.map((r) => (
          <div
            key={r.slug}
            className="rounded-2xl border border-borde bg-superficie p-5"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <Route size={16} className="text-rojo-acento" />
                  <h3 className="text-base font-semibold text-texto">{r.nombre}</h3>
                  <span className="font-mono text-xs text-texto-tenue">/{r.slug}</span>
                </div>
                {r.descripcion && (
                  <p className="mt-1 text-xs text-texto-suave">{r.descripcion}</p>
                )}
              </div>

              <button
                type="button"
                onClick={() => handleEliminarRuta(r.slug)}
                className="rounded-lg p-1.5 text-texto-tenue transition-colors hover:bg-fondo hover:text-rojo-acento"
                title="Eliminar ruta"
              >
                <Trash2 size={15} />
              </button>
            </div>

            <div className="mt-4 border-t border-borde pt-3">
              <h4 className="text-[11px] font-semibold uppercase tracking-wider text-texto-tenue">
                Cursos en esta ruta ({r.cursos.length})
              </h4>

              {r.cursos.length === 0 ? (
                <p className="mt-2 text-xs italic text-texto-tenue">
                  No hay cursos asignados aún a esta ruta.
                </p>
              ) : (
                <ul className="mt-2 divide-y divide-borde rounded-xl border border-borde bg-fondo">
                  {r.cursos
                    .slice()
                    .sort((a, b) => a.posicion - b.posicion)
                    .map((c) => (
                      <li
                        key={c.slug}
                        className="flex items-center justify-between px-3 py-2 text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <span className="flex size-5 items-center justify-center rounded-full bg-superficie font-mono text-[10px] font-bold text-rojo-acento ring-1 ring-borde">
                            {c.posicion}
                          </span>
                          <span className="font-medium text-texto">{c.titulo}</span>
                          <span className="font-mono text-[10px] text-texto-tenue">
                            ({c.slug})
                          </span>
                        </div>

                        {c.requisitos.length > 0 && (
                          <span className="text-[10px] text-texto-tenue">
                            Req: {c.requisitos.join(", ")}
                          </span>
                        )}
                      </li>
                    ))}
                </ul>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
