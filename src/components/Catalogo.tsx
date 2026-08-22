import { ChevronDown } from "lucide-react";
import type { ReactNode } from "react";
import { Icono, type IconoNombre } from "./Iconos";

/**
 * Catálogo de lo que todavía no está abierto. Es informativo: las fichas no
 * son interactivas porque no hay nada que abrir. Los cursos que ya tienen
 * material se muestran aparte, y esos sí llevan enlace.
 *
 * Todo aquí es HTML nativo (`details`/`summary`), así que el componente no
 * necesita ejecutarse en el cliente.
 */
export function AreaCatalogo({
  nombre,
  descripcion,
  total,
  children,
}: {
  nombre: string;
  descripcion: string;
  total: number;
  children: ReactNode;
}) {
  return (
    <details open className="group/area">
      <summary className="flex cursor-pointer list-none items-start gap-2.5 border-b border-borde pb-3 marker:content-none">
        <ChevronDown
          size={20}
          aria-hidden="true"
          className="mt-0.5 shrink-0 text-texto-tenue transition-transform group-open/area:rotate-180"
        />
        <span className="flex-1">
          <span className="flex items-baseline gap-2">
            <span className="text-lg font-semibold">{nombre}</span>
            <span className="text-[11px] text-texto-tenue">
              {total} curso{total === 1 ? "" : "s"}
            </span>
          </span>
          <span className="mt-0.5 block text-sm text-texto-suave">{descripcion}</span>
        </span>
      </summary>
      <div className="pt-4">{children}</div>
    </details>
  );
}

// Cada nivel lleva su variante oscura: los tonos 50/700 de Tailwind solo
// funcionan sobre fondo claro.
const COLOR_NIVEL: Record<string, string> = {
  INTRODUCCIÓN:
    "bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:ring-emerald-900",
  INTERMEDIO:
    "bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:ring-amber-900",
  AVANZADO: "bg-rojo-tenue text-rojo-acento ring-rojo-acento/25",
  HARDMODE:
    "bg-zinc-900 text-white ring-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 dark:ring-zinc-100",
};

/** Ficha de curso del catálogo. Cuadrada, sin acción: todavía no hay fecha. */
export function FichaCurso({
  nombre,
  nivel,
  horas,
  express,
  icono,
}: {
  nombre: string;
  nivel: string;
  horas: number;
  express?: boolean;
  icono?: IconoNombre;
}) {
  return (
    <div className="flex aspect-square w-full flex-col rounded-xl border border-borde bg-fondo p-3">
      <div className="flex items-start justify-between gap-3">
        {/* Sin icono genérico: si el curso no es sobre un producto, va vacío. */}
        {icono ? (
          <Icono nombre={icono} className="size-6 shrink-0 text-texto-tenue" />
        ) : (
          <span aria-hidden="true" />
        )}
        <span
          className={`shrink-0 rounded-full px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide ring-1 ring-inset ${
            COLOR_NIVEL[nivel] ?? "bg-superficie text-texto-suave ring-borde"
          }`}
        >
          {nivel}
        </span>
      </div>

      <h4 className="mt-auto line-clamp-3 text-[0.8125rem] font-medium leading-snug text-texto">
        {nombre}
      </h4>

      <div className="mt-2.5 border-t border-borde pt-2 text-[11px] text-texto-tenue">
        {horas} h{express && " · exprés"}
      </div>
    </div>
  );
}
