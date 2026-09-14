import Link from "next/link";
import { BookOpen, Route } from "lucide-react";

export function PanelFormacionNav({ activo }: { activo: "cursos" | "rutas" }) {
  const opciones = [
    { href: "/panel/cursos", texto: "Cursos y microcursos", icono: BookOpen, id: "cursos" },
    { href: "/panel/rutas", texto: "Rutas de aprendizaje", icono: Route, id: "rutas" },
  ] as const;

  return (
    <nav aria-label="Gestión académica" className="mt-7 flex flex-wrap gap-2 border-b border-borde pb-3">
      {opciones.map(({ href, texto, icono: Icono, id }) => (
        <Link
          key={id}
          href={href}
          aria-current={activo === id ? "page" : undefined}
          className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${activo === id ? "bg-rojo-tenue text-rojo-acento" : "text-texto-suave hover:bg-superficie hover:text-texto"}`}
        >
          <Icono size={16} aria-hidden="true" />
          {texto}
        </Link>
      ))}
    </nav>
  );
}
