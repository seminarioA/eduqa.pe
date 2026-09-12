"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Library,
  CalendarDays,
  BadgeCheck,
  Bug,
  GraduationCap,
  LayoutDashboard,
  LogIn,
  LogOut,
  Megaphone,
  Receipt,
  Settings,
  Stamp,
  UserRoundPlus,
} from "lucide-react";
import type { ComponentType } from "react";
import { MarcaInline } from "@/components/LlamaMarca";
import { SelectorTemaCompacto } from "@/components/Tema";

type Enlace = {
  href: string;
  etiqueta: string;
  Icono: ComponentType<{ size?: number; className?: string }>;
};

/**
 * Barra lateral rectangular, pegada al borde de la aplicación.
 *
 * Va expandida, con la etiqueta al lado de cada icono. Un icono solo obliga a
 * adivinar o a esperar un rótulo emergente, y en una barra de cinco destinos
 * ese coste no compensa el ancho que se ahorra.
 */
export function Isla({
  autenticado,
  esAdmin,
  esInterno = false,
  marcaSidebar = null,
  onSalir,
}: {
  autenticado: boolean;
  esAdmin: boolean;
  /** Profesores, gestores, desarrolladores y agentes, además de administradores. */
  esInterno?: boolean;
  /** SVG personalizado de la marca para la barra lateral; null usa la llama original. */
  marcaSidebar?: string | null;
  onSalir: () => void;
}) {
  const ruta = usePathname();

  /*
   * Para quien ya entró, el inicio es la lista de cursos. La portada es una
   * página comercial: no pinta nada en la navegación de alguien que ya es
   * alumno, así que ni el logo ni el icono de casa llevan allí.
   */
  const inicio = autenticado ? "/cursos" : "/";

  // La portada tiene su propia cabecera y no necesita esta barra.
  if (ruta === "/") return null;

  // Dentro de una lección manda el índice del curso.
  if (/^\/cursos\/[^/]+\/[^/]+/.test(ruta)) return null;

  /*
   * No hay entrada de "Inicio": para un alumno el inicio son sus cursos, y
   * dos etiquetas para el mismo destino solo hacen dudar de si llevan a
   * sitios distintos.
   */
  const enlaces: Enlace[] = autenticado
    ? [
        { href: "/cursos", etiqueta: "Cursos", Icono: GraduationCap },
        { href: "/calendario", etiqueta: "Calendario", Icono: CalendarDays },
        { href: "/compras", etiqueta: "Mis compras", Icono: Receipt },
        {
          href: "/certificaciones",
          etiqueta: "Mis certificaciones",
          Icono: BadgeCheck,
        },
        { href: "/ajustes", etiqueta: "Ajustes", Icono: Settings },
        ...(esInterno
          ? [{ href: "/recursos", etiqueta: "Recursos", Icono: Library }]
          : []),
        ...(esAdmin
          ? [
              { href: "/panel", etiqueta: "Panel", Icono: LayoutDashboard },
              { href: "/panel/avisos", etiqueta: "Avisos", Icono: Megaphone },
              { href: "/panel/reportes", etiqueta: "Reportes", Icono: Bug },
              { href: "/panel/marca", etiqueta: "Marca", Icono: Stamp },
            ]
          : []),
      ]
    : [
        { href: "/acceder", etiqueta: "Entrar", Icono: LogIn },
        { href: "/registro", etiqueta: "Crear cuenta", Icono: UserRoundPlus },
      ];

  return (
    <nav
      aria-label="Navegación principal"
      className="fixed inset-y-0 left-0 z-30 hidden w-60 flex-col border-r border-borde bg-fondo px-3 py-4 lg:flex"
    >
      <Link
        href={inicio}
        className="flex items-center gap-2.5 rounded-xl px-2 py-1.5 transition-colors hover:bg-superficie"
      >
        <MarcaInline svg={marcaSidebar} className="h-8 w-auto text-rojo-acento" />
        <span className="text-sm font-bold uppercase tracking-[0.18em] text-rojo-acento">
          EDUQA.PE
        </span>
      </Link>

      <span className="my-2 h-px w-full bg-borde" aria-hidden="true" />

      {/* El grupo de enlaces crece y, si algún día no cupieran, se desplaza
          solo él: la marca y el pie se quedan fijos donde están. */}
      <ul className="flex flex-1 flex-col gap-0.5 overflow-y-auto">
        {enlaces.map(({ href, etiqueta, Icono }) => {
          // Solo se marca el destino exacto: estando en /panel/reportes, la
          // entrada de /panel no debe aparecer también como activa.
          const activo = ruta === href;
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={activo ? "page" : undefined}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${
                  activo
                    ? "bg-rojo-tenue font-medium text-rojo-acento"
                    : "text-texto-suave hover:bg-superficie hover:text-rojo-acento"
                }`}
              >
                <Icono size={17} className="shrink-0" />
                {etiqueta}
              </Link>
            </li>
          );
        })}
      </ul>

      <span className="mt-2 h-px w-full bg-borde" aria-hidden="true" />

      <div className="mt-2 flex items-center justify-between gap-2 px-1">
        <SelectorTemaCompacto />

        {autenticado && (
          <form action={onSalir}>
            <button
              type="submit"
              className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-texto-suave transition-colors hover:bg-superficie hover:text-rojo-acento"
            >
              <LogOut size={16} aria-hidden="true" />
              Salir
            </button>
          </form>
        )}
      </div>
    </nav>
  );
}
