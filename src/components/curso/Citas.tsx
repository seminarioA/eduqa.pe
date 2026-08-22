import { BookMarked } from "lucide-react";
import type { Doc } from "@/lib/cursos";

/** Enlaces a la documentación oficial que respalda un bloque. */
export function Citas({ docs }: { docs?: Doc[] }) {
  if (!docs?.length) return null;

  return (
    <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1.5">
      <span className="flex items-center gap-1 text-[11px] uppercase tracking-wide text-texto-tenue">
        <BookMarked size={12} aria-hidden="true" />
        Documentación
      </span>
      {docs.map((d) => (
        <a
          key={d.url}
          href={d.url}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-md border border-borde bg-superficie px-2 py-0.5 text-[11px] font-medium text-texto-suave transition-colors hover:border-rojo-acento hover:text-rojo-acento"
        >
          {d.titulo}
        </a>
      ))}
    </div>
  );
}
