"use client";

import { useActionState, useSyncExternalStore } from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, Check, Clock, Loader2, Lock, Sparkles } from "lucide-react";
import { matricularse, type EstadoMatricula } from "./acciones";
import { Icono, type IconoNombre } from "@/components/Iconos";
import { Boton } from "@/components/ui";
import { Estrellas } from "@/components/Estrellas";
import {
  modoAdminActivo,
  suscribirseModoAdmin,
} from "@/lib/modo-admin";
import type { FormatoCurso } from "@/lib/curso-tipos";

export type DatosCurso = {
  slug: string;
  codigo: string;
  titulo: string;
  resumen: string;
  nivel: string;
  horas: number;
  sesiones: number;
  /** Sesiones marcadas como completadas por el usuario. */
  vistas: number;
  primeraLeccion: string;
  formato?: FormatoCurso;
  icono?: IconoNombre;
  matriculado: boolean;
  completado: boolean;
  precio: number;
  /** Nota media y número de votos. Ausente mientras nadie haya valorado. */
  valoracion?: { promedio: number; total: number };
};

export function TarjetaCursoMatricula({
  curso,
  alTope,
  esAdmin = false,
}: {
  curso: DatosCurso;
  alTope: boolean;
  esAdmin?: boolean;
}) {
  const [estado, accion, enviando] = useActionState<EstadoMatricula | null, FormData>(
    matricularse,
    null,
  );

  const revisando = useSyncExternalStore(
    suscribirseModoAdmin,
    modoAdminActivo,
    () => false,
  );

  // En modo administrador el curso se abre sin comprarlo ni matricularse. El
  // permiso lo concede el servidor por `es_admin`; aquí solo se deja de
  // ofrecer una compra que para esta cuenta no tiene sentido.
  const comoAdmin = esAdmin && revisando;
  const bloqueado = !comoAdmin && !curso.matriculado && alTope;
  const esMicro = curso.formato === "microcurso" || curso.formato === "pildora";

  const cabecera = (
    <>
      <div className="flex items-start justify-between gap-3">
        <Icono
          nombre={curso.icono}
          className="size-14 shrink-0 text-texto-tenue transition-colors group-hover:text-rojo-acento"
        />
        <div className="flex shrink-0 flex-col items-end gap-1.5">
          <div className="flex items-center gap-1.5">
            {esMicro && (
              <span className="inline-flex items-center gap-1 rounded-full bg-rojo-tenue px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-rojo-acento ring-1 ring-inset ring-rojo-acento/30">
                <Sparkles size={10} />
                Microcurso
              </span>
            )}
            <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-emerald-700 ring-1 ring-inset ring-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:ring-emerald-900">
              {curso.nivel}
            </span>
          </div>
          {curso.completado && (
            <span className="flex items-center gap-1 rounded-full bg-superficie px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-texto-tenue ring-1 ring-inset ring-borde">
              <Check size={9} aria-hidden="true" />
              Completado
            </span>
          )}
        </div>
      </div>

      <h2 className="mt-2 text-base font-semibold leading-snug group-hover:text-rojo-acento">
        {curso.titulo}
      </h2>
      <p className="mt-2 line-clamp-4 flex-1 text-sm leading-relaxed text-texto-suave">
        {curso.resumen}
      </p>

      {/* La barra solo tiene sentido cuando hay algo que medir: si no estás
          inscrito, no hay progreso del que hablar. */}
      {curso.matriculado && (
        <div className="mt-3">
          <div className="flex items-center justify-between text-[11px] text-texto-tenue">
            <span>
              {curso.vistas} de {curso.sesiones} sesiones
            </span>
            <span className="font-medium text-texto-suave">
              {Math.round((curso.vistas / curso.sesiones) * 100)}%
            </span>
          </div>
          <div
            role="progressbar"
            aria-valuenow={curso.vistas}
            aria-valuemin={0}
            aria-valuemax={curso.sesiones}
            aria-label={`Avance de ${curso.titulo}`}
            className="mt-1 h-1.5 overflow-hidden rounded-full bg-borde"
          >
            <div
              className="h-full rounded-full bg-rojo transition-[width] duration-300"
              style={{ width: `${(curso.vistas / curso.sesiones) * 100}%` }}
            />
          </div>
        </div>
      )}
    </>
  );

  const pie = (
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
      {curso.valoracion && (
        <Estrellas
          promedio={curso.valoracion.promedio}
          total={curso.valoracion.total}
        />
      )}
    </div>
  );

  // Matriculado, o administrador revisando: la tarjeta entera es un enlace.
  if (curso.matriculado || comoAdmin) {
    return (
      <Link
        href={`/cursos/${curso.slug}/${curso.primeraLeccion}`}
        className="group flex aspect-square flex-col rounded-xl border border-borde bg-fondo p-5 transition-all hover:-translate-y-0.5 hover:border-rojo-acento hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rojo-acento"
      >
        {cabecera}
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
          {comoAdmin && !curso.matriculado ? (
            <span className="font-medium text-rojo-acento">Revisión</span>
          ) : (
            <ArrowRight
              size={14}
              aria-hidden="true"
              className="opacity-0 transition-opacity group-hover:opacity-100"
            />
          )}
        </div>
      </Link>
    );
  }

  // Sin matricular: la acción de compra queda fuera de la ficha para no
  // mezclar el contenido académico con la acción comercial.
  return (
    <div className="flex flex-col">
      <div className="group flex aspect-square flex-col rounded-xl border border-borde bg-fondo p-5">
        {cabecera}
        {pie}

        {!bloqueado && (
          <form action={accion} className="mt-3">
            <input type="hidden" name="curso" value={curso.slug} />
            <Boton
              type="submit"
              disabled={enviando}
              className="w-full py-2 text-xs"
            >
              {enviando && <Loader2 size={14} className="animate-spin" aria-hidden="true" />}
              {enviando ? "Matriculando…" : "Matricularme gratis"}
            </Boton>
          </form>
        )}

        {!bloqueado && estado && !estado.ok && (
          <p role="alert" className="mt-2 text-[11px] leading-snug text-rojo-acento">
            {estado.error}
          </p>
        )}
      </div>

      {bloqueado && (
        <Link
          href={`/pagar/${curso.slug}`}
          className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-lg bg-rojo px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-rojo-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rojo-acento"
        >
          <Lock size={13} aria-hidden="true" />
          Comprar por S/{curso.precio.toFixed(2)}
        </Link>
      )}
    </div>
  );
}
