"use client";

import { useActionState } from "react";
import Link from "next/link";
import {
  DollarSign,
  Eye,
  EyeOff,
  GraduationCap,
  Loader2,
  Sparkles,
} from "lucide-react";
import { Icono, type IconoNombre } from "@/components/Iconos";
import { Boton } from "@/components/ui";
import { publicarCurso, despublicarCurso, type EstadoAccion } from "./cursos/acciones";
import type { FormatoCurso } from "@/lib/curso-tipos";

export type DatosGestion = {
  slug: string;
  titulo: string;
  resumen: string;
  area: string;
  nivel: string;
  horas: number;
  sesiones: number;
  formato?: FormatoCurso;
  icono?: IconoNombre;
  publicado: boolean;
  precio: number;
};

export function TarjetaGestion({ curso }: { curso: DatosGestion }) {
  const [estadoPublicar, accionPublicar, publicando] = useActionState<
    EstadoAccion | null,
    FormData
  >(publicarCurso, null);

  const [estadoDespublicar, accionDespublicar, despublicando] = useActionState<
    EstadoAccion | null,
    FormData
  >(despublicarCurso, null);

  const pendiente = publicando || despublicando;
  const esMicro = curso.formato === "microcurso" || curso.formato === "pildora";

  return (
    <div className="flex flex-col justify-between rounded-2xl border border-borde bg-superficie p-6 shadow-sm">
      <div>
        <div className="flex items-start justify-between gap-3">
          <Icono
            nombre={curso.icono}
            className="size-12 shrink-0 text-texto-tenue"
          />
          <div className="flex flex-col items-end gap-1.5">
            <div className="flex items-center gap-1.5">
              {esMicro && (
                <span className="inline-flex items-center gap-1 rounded-full bg-rojo-tenue px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-rojo-acento ring-1 ring-inset ring-rojo-acento/30">
                  <Sparkles size={10} />
                  Microcurso
                </span>
              )}
              <span
                className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                  curso.publicado
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                    : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                }`}
              >
                {curso.publicado ? "Publicado" : "Borrador Markdown"}
              </span>
            </div>
            <span className="text-xs text-texto-tenue">{curso.area}</span>
          </div>
        </div>

        <h3 className="mt-4 text-lg font-semibold leading-snug text-texto">
          {curso.titulo}
        </h3>
        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-texto-suave">
          {curso.resumen}
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-texto-tenue">
          <span>{curso.sesiones} sesiones</span>
          <span>·</span>
          <span>{curso.horas} horas</span>
          <span>·</span>
          <span className="font-semibold text-texto">
            {curso.publicado ? `S/ ${curso.precio.toFixed(2)}` : "Sin precio"}
          </span>
        </div>
      </div>

      <div className="mt-6 border-t border-borde pt-4">
        {curso.publicado ? (
          <div className="flex items-center justify-between gap-2">
            <Link
              href={`/cursos/${curso.slug}`}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-texto-suave hover:text-rojo-acento"
            >
              <Eye size={14} />
              Ver en catálogo
            </Link>

            <form action={accionDespublicar}>
              <input type="hidden" name="slug" value={curso.slug} />
              <Boton
                type="submit"
                variante="secundario"
                disabled={pendiente}
                className="py-1.5 text-xs"
              >
                {despublicando ? (
                  <Loader2 size={13} className="animate-spin" />
                ) : (
                  <EyeOff size={13} />
                )}
                Despublicar
              </Boton>
            </form>
          </div>
        ) : (
          <form action={accionPublicar} className="flex flex-col gap-3">
            <input type="hidden" name="slug" value={curso.slug} />
            <div className="flex items-center gap-2">
              <label htmlFor={`precio-${curso.slug}`} className="text-xs text-texto-tenue">
                Precio (PEN S/):
              </label>
              <div className="relative flex-1">
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-texto-tenue">
                  S/
                </span>
                <input
                  id={`precio-${curso.slug}`}
                  type="number"
                  name="precio"
                  step="0.01"
                  min="0"
                  defaultValue="49.00"
                  required
                  className="w-full rounded-lg border border-borde bg-fondo py-1.5 pl-8 pr-3 text-xs text-texto focus:border-rojo-acento focus:outline-none"
                />
              </div>
            </div>

            <Boton
              type="submit"
              disabled={pendiente}
              className="w-full py-1.5 text-xs"
            >
              {publicando && <Loader2 size={13} className="animate-spin" />}
              Publicar en Catálogo
            </Boton>
          </form>
        )}

        {estadoPublicar && !estadoPublicar.ok && (
          <p className="mt-2 text-[11px] text-rojo-acento">{estadoPublicar.error}</p>
        )}
        {estadoDespublicar && !estadoDespublicar.ok && (
          <p className="mt-2 text-[11px] text-rojo-acento">{estadoDespublicar.error}</p>
        )}
      </div>
    </div>
  );
}
