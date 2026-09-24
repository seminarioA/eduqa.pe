import Link from "next/link";
import { ChevronRight, House } from "lucide-react";

export type Miga = { texto: string; href?: string };

/**
 * Migas de pan. El último elemento nunca es enlace y lleva aria-current,
 * porque es la página en la que ya estás.
 */
export function Migas({ items }: { items: Miga[] }) {
  return (
    <nav aria-label="Ruta de navegación" className="mb-6">
      <ol className="flex flex-wrap items-center gap-1 text-sm text-texto-tenue">
        <li
          className="miga-stagger flex items-center gap-1"
          style={{ animationDelay: "0ms" }}
        >
          <Link
            href="/"
            aria-label="Inicio"
            className="rounded p-0.5 transition-colors hover:text-rojo-acento"
          >
            <House size={14} aria-hidden="true" />
          </Link>
        </li>

        {items.map((m, i) => {
          const ultimo = i === items.length - 1;
          return (
            <li
              key={`${m.texto}-${i}`}
              className="miga-stagger flex items-center gap-1"
              style={{ animationDelay: `${(i + 1) * 65}ms` }}
            >
              <ChevronRight size={13} aria-hidden="true" className="shrink-0 opacity-60" />
              {m.href && !ultimo ? (
                <Link href={m.href} className="transition-colors hover:text-rojo-acento">
                  {m.texto}
                </Link>
              ) : (
                <span aria-current={ultimo ? "page" : undefined} className="text-texto">
                  {m.texto}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
