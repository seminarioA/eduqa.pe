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
  Newspaper,
  PanelLeftClose,
  PanelLeftOpen,
  Receipt,
  Route,
  Settings,
  Stamp,
  UserRoundPlus,
} from "lucide-react";
import { useSyncExternalStore, type ComponentType } from "react";
import { MarcaInline } from "@/components/LlamaMarca";
import { SelectorTemaCompacto } from "@/components/Tema";
import { CLAVE_BARRA_LATERAL } from "@/lib/barra-lateral";

type Enlace = {
  href: string;
  etiqueta: string;
  Icono: ComponentType<{ size?: number; className?: string }>;
};

const EVENTO_BARRA = "eduqa:barra-lateral";

function suscribirBarra(avisar: () => void) {
  window.addEventListener(EVENTO_BARRA, avisar);
  const sincronizarOtraPestana = (evento: StorageEvent) => {
    if (evento.key !== CLAVE_BARRA_LATERAL) return;
    document.documentElement.dataset.sidebar =
      evento.newValue === "collapsed" ? "collapsed" : "expanded";
    avisar();
  };
  window.addEventListener("storage", sincronizarOtraPestana);
  return () => {
    window.removeEventListener(EVENTO_BARRA, avisar);
    window.removeEventListener("storage", sincronizarOtraPestana);
  };
}

function barraColapsada() {
  return document.documentElement.dataset.sidebar === "collapsed";
}

function barraExpandidaEnServidor() {
  return false;
}

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
  const colapsada = useSyncExternalStore(
    suscribirBarra,
    barraColapsada,
    barraExpandidaEnServidor,
  );

  const alternarBarra = () => {
    const siguiente = colapsada ? "expanded" : "collapsed";
    document.documentElement.dataset.sidebar = siguiente;
    try {
      window.localStorage.setItem(CLAVE_BARRA_LATERAL, siguiente);
    } catch {
      // La barra sigue funcionando si el navegador bloquea el almacenamiento.
    }
    window.dispatchEvent(new Event(EVENTO_BARRA));
  };

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
   * Enlaces principales organizados por áreas de uso:
   * Alumnos y navegación pública disponen de Cursos, Blog, Calendario y Compras.
   * Administradores cuentan con submenús dedicados de gestión (Cursos, Rutas, Blog).
   */
  const enlaces: Enlace[] = autenticado
    ? [
        { href: "/cursos", etiqueta: "Cursos", Icono: GraduationCap },
        { href: "/blog", etiqueta: "Blog", Icono: Newspaper },
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
              { href: "/panel/cursos", etiqueta: "Gestión Cursos", Icono: GraduationCap },
              { href: "/panel/rutas", etiqueta: "Gestión Rutas", Icono: Route },
              { href: "/panel/blog", etiqueta: "Blog Medium", Icono: Newspaper },
              { href: "/panel/avisos", etiqueta: "Avisos", Icono: Megaphone },
              { href: "/panel/reportes", etiqueta: "Reportes", Icono: Bug },
              { href: "/panel/marca", etiqueta: "Marca", Icono: Stamp },
            ]
          : []),
      ]
    : [
        { href: "/acceder", etiqueta: "Entrar", Icono: LogIn },
        { href: "/registro", etiqueta: "Crear cuenta", Icono: UserRoundPlus },
        { href: "/blog", etiqueta: "Blog", Icono: Newspaper },
      ];

  return (
    <nav
      id="barra-lateral"
      aria-label="Navegación principal"
      className="fixed inset-y-0 left-0 z-30 hidden w-60 flex-col border-r border-borde bg-fondo px-3 py-4 lg:flex"
    >
      <div className="sidebar-cabecera flex items-center gap-1">
        <Link
          href={inicio}
          aria-label={autenticado ? "Ir a cursos" : "Ir al inicio"}
          title={autenticado ? "Cursos" : "Inicio"}
          className="sidebar-marca flex min-w-0 flex-1 items-center gap-2.5 rounded-xl px-2 py-1.5 transition-colors hover:bg-superficie"
        >
          <MarcaInline svg={marcaSidebar} className="h-8 w-auto shrink-0 text-rojo-acento" />
          <span className="sidebar-etiqueta whitespace-nowrap text-lg font-bold tracking-tight">
            EDUQA<span className="text-rojo-acento">.PE</span>
          </span>
        </Link>
        <button
          type="button"
          onClick={alternarBarra}
          aria-label={colapsada ? "Expandir barra lateral" : "Colapsar barra lateral"}
          title={colapsada ? "Expandir (o)" : "Colapsar (o)"}
          className="sidebar-toggle rounded-lg p-1.5 text-texto-tenue transition-colors hover:bg-superficie hover:text-texto focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rojo-acento"
        >
          {colapsada ? (
            <PanelLeftOpen size={16} aria-hidden="true" />
          ) : (
            <PanelLeftClose size={16} aria-hidden="true" />
          )}
        </button>
      </div>

      <div className="mt-6 flex flex-1 flex-col gap-1">
        {enlaces.map(({ href, etiqueta, Icono }) => {
          const activo = ruta === href || (href !== "/cursos" && href !== "/" && ruta.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              title={etiqueta}
              aria-label={etiqueta}
              className={`sidebar-enlace flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                activo
                  ? "bg-superficie text-texto shadow-sm ring-1 ring-borde"
                  : "text-texto-suave hover:bg-superficie/60 hover:text-texto"
              }`}
            >
              <Icono size={18} className={`shrink-0 ${activo ? "text-rojo-acento" : ""}`} />
              <span className="sidebar-etiqueta truncate">{etiqueta}</span>
            </Link>
          );
        })}
      </div>

      <div className="sidebar-pie mt-auto flex flex-col gap-2 border-t border-borde pt-3">
        <div className="sidebar-tema flex items-center justify-between px-2">
          <span className="sidebar-etiqueta text-xs text-texto-tenue">Tema</span>
          <SelectorTemaCompacto />
        </div>
        {autenticado && (
          <button
            type="button"
            onClick={onSalir}
            title="Cerrar sesión"
            aria-label="Cerrar sesión"
            className="sidebar-enlace flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-texto-suave transition-colors hover:bg-superficie hover:text-rojo-acento"
          >
            <LogOut size={16} className="shrink-0" />
            <span className="sidebar-etiqueta truncate">Cerrar sesión</span>
          </button>
        )}
      </div>
    </nav>
  );
}
