"use client";

import { useState, useTransition } from "react";
import {
  FolderPlus,
  Trash2,
  Edit2,
  Save,
  Route,
  Sparkles,
  Loader2,
  Check,
  AlertCircle,
} from "lucide-react";
import { Boton } from "@/components/ui";
import {
  crearRutaAction,
  eliminarRutaAction,
  asignarCursoAction,
  type EstadoAccionRuta,
} from "./acciones";
import type { FilaRuta } from "@/lib/rutas-bd";

type CursoInfo = {
  slug: string;
  titulo: string;
  area: string;
  horas: number;
  formato?: string;
};

export function FormularioRuta({
  rutasIniciales,
  cursosDisponibles,
}: {
  rutasIniciales: FilaRuta[];
  cursosDisponibles: CursoInfo[];
}) {
  const [rutas, setRutas] = useState<FilaRuta[]>(rutasIniciales);
  const [rutaSeleccionada, setRutaSeleccionada] = useState<string | null>(
    rutasIniciales[0]?.slug ?? null,
  );
  const [nuevaRutaSlug, setNuevaRutaSlug] = useState("");
  const [nuevaRutaNombre, setNuevaRutaNombre] = useState("");
  const [nuevaRutaDesc, setNuevaRutaDesc] = useState("");
  const [nuevoOrden, setNuevoOrden] = useState(0);

  const [cursoAAsignar, setCursoAAsignar] = useState(cursosDisponibles[0]?.slug ?? "");
  const [posicionCurso, setPosicionCurso] = useState(1);
  const [requisito, setRequisito] = useState("");

  const [pendiente, startTransition] = useTransition();
  const [mensaje, setMensaje] = useState<{ tipo: "exito" | "error"; texto: string } | null>(
    null,
  );

  const handleCrearRuta = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevaRutaSlug.trim() || !nuevaRutaNombre.trim()) {
      setMensaje({ tipo: "error", texto: "Ingresa el slug y nombre de la ruta." });
      return;
    }

    startTransition(async () => {
      const fd = new FormData();
      fd.append("slug", nuevaRutaSlug);
      fd.append("nombre", nuevaRutaNombre);
      fd.append("descripcion", nuevaRutaDesc);
      fd.append("orden", String(nuevoOrden));

      const res = await crearRutaAction(null, fd);
      if (res.ok) {
        setRutas((prev) => [
          ...prev,
          {
            slug: nuevaRutaSlug.trim().toLowerCase(),
            nombre: nuevaRutaNombre.trim(),
            descripcion: nuevaRutaDesc.trim() || null,
            orden: nuevoOrden,
          },
        ]);
        setNuevaRutaSlug("");
        setNuevaRutaNombre("");
        setNuevaRutaDesc("");
        setMensaje({ tipo: "exito", texto: "¡Ruta de aprendizaje creada con éxito!" });
      } else {
        setMensaje({ tipo: "error", texto: res.error ?? "Error al crear la ruta." });
      }
    });
  };

  const handleEliminarRuta = (slug: string) => {
    if (!confirm(`¿Seguro que deseas eliminar la ruta «${slug}»?`)) return;

    startTransition(async () => {
      const fd = new FormData();
      fd.append("slug", slug);
      const res = await eliminarRutaAction(null, fd);
      if (res.ok) {
        setRutas((prev) => prev.filter((r) => r.slug !== slug));
        if (rutaSeleccionada === slug) {
          setRutaSeleccionada(rutas.find((r) => r.slug !== slug)?.slug ?? null);
        }
        setMensaje({ tipo: "exito", texto: "Ruta eliminada correctamente." });
      } else {
        setMensaje({ tipo: "error", texto: res.error ?? "Error al eliminar la ruta." });
      }
    });
  };

  const handleAsignarCurso = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rutaSeleccionada || !cursoAAsignar) return;

    startTransition(async () => {
      const res = await asignarCursoAction({
        cursoSlug: cursoAAsignar,
        rutaSlug: rutaSeleccionada,
        posicion: posicionCurso,
        requisitos: requisito ? [requisito] : [],
      });

      if (res.ok) {
        setMensaje({
          tipo: "exito",
          texto: `Curso «${cursoAAsignar}» asignado a la ruta «${rutaSeleccionada}» (Posición ${posicionCurso}).`,
        });
      } else {
        setMensaje({ tipo: "error", texto: res.error ?? "Error al asignar curso." });
      }
    });
  };

  return (
    <div className="flex flex-col gap-8">
      {mensaje && (
        <div
          role="alert"
          className={`flex items-center gap-2.5 rounded-xl border p-4 text-xs font-medium ${
            mensaje.tipo === "exito"
              ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
              : "border-rojo-acento/20 bg-rojo-tenue text-rojo-acento"
          }`}
        >
          {mensaje.tipo === "exito" ? <Check size={16} /> : <AlertCircle size={16} />}
          <span>{mensaje.texto}</span>
          <button
            type="button"
            onClick={() => setMensaje(null)}
            className="ml-auto text-xs opacity-60 hover:opacity-100"
          >
            ✕
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Columna Izquierda: Formulario Crear Ruta & Lista de Rutas */}
        <div className="flex flex-col gap-6 lg:col-span-6">
          <div className="rounded-2xl border border-borde bg-superficie p-6 shadow-sm">
            <div className="flex items-center gap-2 text-sm font-semibold text-texto">
              <FolderPlus size={16} className="text-rojo-acento" />
              Nueva Ruta de Aprendizaje
            </div>
            <p className="mt-1 text-xs text-texto-suave">
              Define una nueva especialización o itinerario curricular.
            </p>

            <form onSubmit={handleCrearRuta} className="mt-4 flex flex-col gap-4">
              <div>
                <label className="block text-xs font-medium text-texto-suave">
                  Slug (Identificador URL)
                </label>
                <input
                  type="text"
                  placeholder="ej. especializacion-ia-generativa"
                  value={nuevaRutaSlug}
                  onChange={(e) => setNuevaRutaSlug(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-borde bg-fondo px-3.5 py-2 text-xs text-texto focus:border-rojo-acento focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-texto-suave">
                  Nombre de la Ruta
                </label>
                <input
                  type="text"
                  placeholder="ej. Especialización en Inteligencia Artificial y LLMs"
                  value={nuevaRutaNombre}
                  onChange={(e) => setNuevaRutaNombre(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-borde bg-fondo px-3.5 py-2 text-xs text-texto focus:border-rojo-acento focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-texto-suave">
                  Descripción Pedagógica
                </label>
                <textarea
                  placeholder="Describe los objetivos, perfil de egreso y habilidades adquiridas..."
                  value={nuevaRutaDesc}
                  onChange={(e) => setNuevaRutaDesc(e.target.value)}
                  rows={3}
                  className="mt-1 w-full rounded-xl border border-borde bg-fondo px-3.5 py-2 text-xs text-texto focus:border-rojo-acento focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-4">
                <div className="w-24">
                  <label className="block text-xs font-medium text-texto-suave">
                    Orden
                  </label>
                  <input
                    type="number"
                    value={nuevoOrden}
                    onChange={(e) => setNuevoOrden(Number(e.target.value))}
                    className="mt-1 w-full rounded-xl border border-borde bg-fondo px-3 py-2 text-xs text-texto focus:border-rojo-acento focus:outline-none"
                  />
                </div>

                <div className="mt-auto flex-1">
                  <Boton
                    type="submit"
                    disabled={pendiente}
                    className="w-full py-2 text-xs"
                  >
                    {pendiente ? (
                      <Loader2 size={13} className="animate-spin" />
                    ) : (
                      <FolderPlus size={13} />
                    )}
                    Guardar Ruta
                  </Boton>
                </div>
              </div>
            </form>
          </div>

          {/* Rutas Registradas */}
          <div className="rounded-2xl border border-borde bg-superficie p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-texto">
              Rutas Activas ({rutas.length})
            </h3>
            <p className="mt-0.5 text-xs text-texto-suave">
              Selecciona una ruta para asignarle cursos o editar su composición.
            </p>

            <div className="mt-4 flex flex-col gap-2.5">
              {rutas.map((r) => {
                const seleccionada = rutaSeleccionada === r.slug;
                return (
                  <div
                    key={r.slug}
                    onClick={() => setRutaSeleccionada(r.slug)}
                    className={`flex cursor-pointer items-center justify-between rounded-xl border p-3.5 transition-all ${
                      seleccionada
                        ? "border-rojo-acento bg-rojo-tenue/20 shadow-sm"
                        : "border-borde bg-fondo hover:border-borde-fuerte"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Route
                        size={16}
                        className={seleccionada ? "text-rojo-acento" : "text-texto-tenue"}
                      />
                      <div>
                        <span className="block text-xs font-semibold text-texto">
                          {r.nombre}
                        </span>
                        <span className="block text-[11px] text-texto-tenue">
                          /{r.slug} · Orden: {r.orden}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEliminarRuta(r.slug);
                      }}
                      className="rounded-lg p-1.5 text-texto-tenue transition-colors hover:bg-rojo-tenue hover:text-rojo-acento"
                      title="Eliminar ruta"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Columna Derecha: Asignación de Cursos a la Ruta Seleccionada */}
        <div className="flex flex-col gap-6 lg:col-span-6">
          <div className="rounded-2xl border border-borde bg-superficie p-6 shadow-sm">
            <div className="flex items-center gap-2 text-sm font-semibold text-texto">
              <Sparkles size={16} className="text-rojo-acento" />
              Asignar Curso a Ruta
            </div>
            <p className="mt-1 text-xs text-texto-suave">
              {rutaSeleccionada
                ? `Organizando la ruta: ${rutaSeleccionada}`
                : "Selecciona una ruta a la izquierda para comenzar a vincular cursos."}
            </p>

            {rutaSeleccionada && (
              <form onSubmit={handleAsignarCurso} className="mt-4 flex flex-col gap-4">
                <div>
                  <label className="block text-xs font-medium text-texto-suave">
                    Seleccionar Curso / Microcurso
                  </label>
                  <select
                    value={cursoAAsignar}
                    onChange={(e) => setCursoAAsignar(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-borde bg-fondo px-3.5 py-2 text-xs text-texto focus:border-rojo-acento focus:outline-none"
                  >
                    {cursosDisponibles.map((c) => (
                      <option key={c.slug} value={c.slug}>
                        {c.titulo} ({c.horas}h · {c.area})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-texto-suave">
                      Posición en Secuencia
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={posicionCurso}
                      onChange={(e) => setPosicionCurso(Number(e.target.value))}
                      className="mt-1 w-full rounded-xl border border-borde bg-fondo px-3 py-2 text-xs text-texto focus:border-rojo-acento focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-texto-suave">
                      Prerrequisito (Slug previo)
                    </label>
                    <input
                      type="text"
                      placeholder="Opcional (ej. python)"
                      value={requisito}
                      onChange={(e) => setRequisito(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-borde bg-fondo px-3 py-2 text-xs text-texto focus:border-rojo-acento focus:outline-none"
                    />
                  </div>
                </div>

                <div className="mt-2">
                  <Boton
                    type="submit"
                    disabled={pendiente}
                    className="w-full py-2 text-xs"
                  >
                    {pendiente ? (
                      <Loader2 size={13} className="animate-spin" />
                    ) : (
                      <Save size={13} />
                    )}
                    Vincular a la Ruta
                  </Boton>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
