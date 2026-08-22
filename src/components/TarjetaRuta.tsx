import Link from "next/link";
import { Check, Clock, Lock, Route } from "lucide-react";
import { Icono, type IconoNombre } from "./Iconos";

export type CursoEnRuta = {
  slug: string;
  titulo: string;
  requisitos: string[];
  acceso_libre: boolean;
  horas: number;
  icono?: IconoNombre;
};

export type DatosRuta = {
  slug: string;
  nombre: string;
  descripcion: string | null;
  cursos: CursoEnRuta[];
};

/**
 * Una ruta de aprendizaje, con el mismo molde que una tarjeta de curso.
 *
 * Comparten forma porque son lo mismo desde la barra: algo que se abre y se
 * avanza. Lo que cambia es la escala, y eso lo dicen el distintivo y los
 * iconos, no una maquetación aparte que obligue a aprender dos lenguajes.
 *
 * Lleva al primer curso que falte, no siempre al primero: quien va por la
 * mitad quiere continuar, no volver a empezar.
 */
export function TarjetaRuta({
  ruta,
  completados,
  matriculados,
}: {
  ruta: DatosRuta;
  completados: Set<string>;
  matriculados: Set<string>;
}) {
  const hechos = ruta.cursos.filter((c) => completados.has(c.slug)).length;
  const horas = ruta.cursos.reduce((n, c) => n + c.horas, 0);
  // Las herramientas de la ruta, sin repetir: tres cursos de Python no son
  // tres logos de Python, es uno.
  const iconos = [...new Set(ruta.cursos.map((c) => c.icono).filter(Boolean))] as IconoNombre[];

  return (
    <Link
      href={`/rutas/${ruta.slug}`}
      className="group flex aspect-square flex-col rounded-xl border border-borde bg-fondo p-5 transition-all hover:-translate-y-0.5 hover:border-rojo-acento hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rojo-acento"
    >
      <div className="flex items-start justify-between gap-3">
        <span className="flex items-center">
          {iconos.map((nombre, i) => (
            <span
              key={nombre}
              className={`flex size-11 shrink-0 items-center justify-center rounded-full border border-borde bg-fondo ${
                i > 0 ? "-ml-3.5" : ""
              }`}
            >
              <Icono
                nombre={nombre}
                className="size-6 text-texto-tenue transition-colors group-hover:text-rojo-acento"
              />
            </span>
          ))}
        </span>
        <span className="shrink-0 rounded-full bg-superficie px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-texto-suave ring-1 ring-inset ring-borde">
          Ruta
        </span>
      </div>

      <h3 className="mt-4 text-base font-semibold leading-snug group-hover:text-rojo-acento">
        {ruta.nombre}
      </h3>

      <ol className="mt-2.5 flex-1 space-y-0.5 overflow-hidden">
        {ruta.cursos.map((curso, i) => {
          const hecho = completados.has(curso.slug);
          const falta = curso.requisitos.some((r) => !completados.has(r));
          const dePago = !curso.acceso_libre && !matriculados.has(curso.slug);
          return (
            <li key={curso.slug} className="flex items-center gap-1.5 text-[11px] leading-snug">
              <span className="shrink-0 font-mono text-[10px] text-texto-tenue">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span
                className={`truncate ${
                  hecho ? "text-texto-tenue line-through" : "text-texto-suave"
                }`}
              >
                {curso.titulo}
              </span>
              {hecho ? (
                <Check size={11} className="shrink-0 text-exito" aria-hidden="true" />
              ) : falta ? (
                <Lock size={10} className="shrink-0 text-texto-tenue" aria-hidden="true" />
              ) : null}
              {!hecho && dePago && (
                <span className="shrink-0 text-[9px] text-texto-tenue">de pago</span>
              )}
            </li>
          );
        })}
      </ol>

      {/* Solo se mide lo empezado: una barra a cero no informa, decora. */}
      {hechos > 0 && (
        <div className="mt-2">
          <div className="flex items-center justify-between text-[11px] text-texto-tenue">
            <span>
              {hechos} de {ruta.cursos.length} cursos
            </span>
            <span className="font-medium text-texto-suave">
              {Math.round((hechos / ruta.cursos.length) * 100)}%
            </span>
          </div>
          <div
            role="progressbar"
            aria-valuenow={hechos}
            aria-valuemin={0}
            aria-valuemax={ruta.cursos.length}
            aria-label={`Avance de ${ruta.nombre}`}
            className="mt-1 h-1.5 overflow-hidden rounded-full bg-borde"
          >
            <div
              className="h-full rounded-full bg-rojo transition-[width] duration-300"
              style={{ width: `${(hechos / ruta.cursos.length) * 100}%` }}
            />
          </div>
        </div>
      )}

      <div className="mt-3 flex items-center justify-between border-t border-borde pt-2.5 text-xs text-texto-tenue">
        <span className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <Route size={13} aria-hidden="true" />
            {ruta.cursos.length}
          </span>
          <span className="flex items-center gap-1">
            <Clock size={13} aria-hidden="true" />
            {horas} h
          </span>
        </span>
        <span className="font-medium text-texto-suave group-hover:text-rojo-acento">
          Ver la ruta
        </span>
      </div>
    </Link>
  );
}
