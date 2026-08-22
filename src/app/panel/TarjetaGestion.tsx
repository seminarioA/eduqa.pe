"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  BookOpen,
  Check,
  Clock,
  Globe,
  Loader2,
  Pencil,
  X,
} from "lucide-react";
import { guardarCurso, type EstadoGuardado } from "./acciones";
import { Icono, type IconoNombre } from "@/components/Iconos";
import { Boton, Campo, claseInput, claseInputBase } from "@/components/ui";

export type CursoGestion = {
  slug: string;
  titulo: string;
  resumen: string;
  estado: string;
  precio: number;
  accesoLibre: boolean;
  sesiones: number;
  horas: number;
  primeraLeccion: string;
  icono?: IconoNombre;
};

const COLOR_ESTADO: Record<string, string> = {
  borrador:
    "bg-superficie text-texto-tenue ring-borde-fuerte",
  privado:
    "bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:ring-amber-900",
  publico:
    "bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:ring-emerald-900",
};

const ETIQUETA_ESTADO: Record<string, string> = {
  borrador: "Borrador",
  privado: "Privado",
  publico: "Público",
};

export function TarjetaGestion({ curso }: { curso: CursoGestion }) {
  // Los campos arrancan bloqueados: editar es una decisión, no un accidente.
  const [editando, setEditando] = useState(false);
  const [estado, accion, guardando] = useActionState<EstadoGuardado | null, FormData>(
    guardarCurso,
    null,
  );

  if (!editando) {
    return (
      <div className="flex aspect-square flex-col rounded-xl border border-borde bg-fondo p-5">
        <div className="flex items-start justify-between gap-3">
          {curso.icono ? (
            <Icono nombre={curso.icono} className="size-12 shrink-0 text-texto-tenue" />
          ) : (
            <span aria-hidden="true" />
          )}
          <span
            className={`shrink-0 rounded-full px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide ring-1 ring-inset ${
              COLOR_ESTADO[curso.estado] ?? COLOR_ESTADO.borrador
            }`}
          >
            {ETIQUETA_ESTADO[curso.estado] ?? curso.estado}
          </span>
        </div>

        {curso.accesoLibre && (
          <p className="mt-2 flex items-center gap-1 text-[10px] font-medium uppercase tracking-wide text-rojo-acento">
            <Globe size={11} aria-hidden="true" />
            Acceso libre
          </p>
        )}

        <h3 className="mt-4 text-base font-semibold leading-snug">{curso.titulo}</h3>
        <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-texto-suave">
          {curso.resumen}
        </p>

        <div className="mt-3 flex items-center justify-between border-t border-borde pt-2.5 text-xs text-texto-tenue">
          <span className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <BookOpen size={13} aria-hidden="true" />
              {curso.sesiones}
            </span>
            <span className="flex items-center gap-1">
              <Clock size={13} aria-hidden="true" />
              {curso.horas} h
            </span>
          </span>
          <span className="font-medium text-texto">S/{curso.precio.toFixed(2)}</span>
        </div>

        <div className="mt-3 flex gap-2">
          <button
            type="button"
            onClick={() => setEditando(true)}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-borde-fuerte px-3 py-2 text-xs font-medium text-texto-suave transition-colors hover:border-rojo-acento hover:text-rojo-acento"
          >
            <Pencil size={13} aria-hidden="true" />
            Editar
          </button>
          <Link
            href={`/cursos/${curso.slug}/${curso.primeraLeccion}`}
            className="flex items-center justify-center rounded-lg border border-borde-fuerte px-3 py-2 text-xs font-medium text-texto-suave transition-colors hover:border-rojo-acento hover:text-rojo-acento"
          >
            Ver
          </Link>
        </div>

        {estado?.ok && (
          <p className="mt-2 flex items-center gap-1 text-[11px] text-exito">
            <Check size={12} aria-hidden="true" />
            Guardado
          </p>
        )}
      </div>
    );
  }

  return (
    <form
      action={accion}
      className="flex aspect-square flex-col overflow-y-auto rounded-xl border-2 border-rojo-acento bg-fondo p-5"
    >
      <input type="hidden" name="curso" value={curso.slug} />

      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wide text-rojo-acento">
          Editando
        </span>
        <button
          type="button"
          onClick={() => setEditando(false)}
          aria-label="Cancelar"
          className="rounded p-1 text-texto-tenue transition-colors hover:text-rojo-acento"
        >
          <X size={16} aria-hidden="true" />
        </button>
      </div>

      <div className="space-y-3">
        <Campo etiqueta="Título">
          <input name="titulo" defaultValue={curso.titulo} required className={claseInput} />
        </Campo>

        <Campo etiqueta="Resumen">
          <textarea
            name="resumen"
            defaultValue={curso.resumen}
            required
            rows={3}
            className={`${claseInputBase} w-full resize-none`}
          />
        </Campo>

        <div className="grid grid-cols-2 gap-3">
          <Campo etiqueta="Estado">
            <select name="estado" defaultValue={curso.estado} className={claseInput}>
              <option value="borrador">Borrador</option>
              <option value="privado">Privado</option>
              <option value="publico">Público</option>
            </select>
          </Campo>

          <Campo etiqueta="Precio">
            <input
              name="precio"
              type="number"
              min={0}
              step="0.10"
              defaultValue={curso.precio}
              className={claseInput}
            />
          </Campo>
        </div>

        {/* Solo surte efecto si el curso es público: las políticas de lectura
            no le muestran a un anónimo ninguna fila que no lo sea. */}
        <label className="flex items-start gap-2 text-xs leading-snug text-texto-suave">
          <input
            type="checkbox"
            name="acceso_libre"
            defaultChecked={curso.accesoLibre}
            className="mt-0.5 size-3.5 shrink-0 accent-rojo"
          />
          <span>
            Acceso libre: cualquiera lee el material sin cuenta ni matrícula.
            Requiere que el curso esté público.
          </span>
        </label>
      </div>

      {estado && !estado.ok && (
        <p
          role="alert"
          className="mt-3 flex items-start gap-1.5 text-[11px] leading-snug text-rojo-acento"
        >
          <AlertCircle size={13} className="mt-0.5 shrink-0" aria-hidden="true" />
          {estado.error}
        </p>
      )}

      <Boton type="submit" disabled={guardando} className="mt-4 w-full py-2 text-xs">
        {guardando && <Loader2 size={14} className="animate-spin" aria-hidden="true" />}
        {guardando ? "Guardando…" : "Guardar cambios"}
      </Boton>
    </form>
  );
}
