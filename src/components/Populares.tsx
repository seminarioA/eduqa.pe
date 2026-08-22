import Link from "next/link";
import { Flame, Users } from "lucide-react";
import { Icono, type IconoNombre } from "./Iconos";

export type CursoPopular = {
  slug: string;
  titulo: string;
  resumen: string;
  primeraLeccion: string;
  matriculas: number;
  icono?: IconoNombre;
};

/**
 * Los cursos con más matrículas.
 *
 * Muestra el número real junto a cada uno en lugar de un puesto: «12 inscritos»
 * se puede comprobar, «el más popular» no dice cuánto ni respecto a qué.
 */
export function Populares({ cursos }: { cursos: CursoPopular[] }) {
  if (cursos.length === 0) return null;

  return (
    <section className="mt-14">
      <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-texto-tenue">
        <Flame size={14} aria-hidden="true" />
        Cursos populares
      </h2>
      <p className="mt-1.5 text-sm text-texto-suave">
        Los que más alumnos han abierto hasta ahora.
      </p>

      <ul className="mt-4 divide-y divide-borde rounded-xl border border-borde">
        {cursos.map((c, i) => (
          <li key={c.slug}>
            <Link
              href={`/cursos/${c.slug}/${c.primeraLeccion}`}
              className="group flex items-center gap-4 px-4 py-3.5 transition-colors hover:bg-superficie"
            >
              <span className="w-5 shrink-0 text-center font-mono text-xs text-texto-tenue">
                {i + 1}
              </span>
              {c.icono ? (
                <Icono
                  nombre={c.icono}
                  className="size-8 shrink-0 text-texto-tenue transition-colors group-hover:text-rojo-acento"
                />
              ) : (
                <span className="size-8 shrink-0" aria-hidden="true" />
              )}
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium group-hover:text-rojo-acento">
                  {c.titulo}
                </span>
                <span className="mt-0.5 block truncate text-xs text-texto-tenue">
                  {c.resumen}
                </span>
              </span>
              <span className="flex shrink-0 items-center gap-1.5 text-xs text-texto-suave">
                <Users size={13} aria-hidden="true" />
                {c.matriculas}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
