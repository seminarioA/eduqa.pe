import Link from "next/link";
import { Llama } from "@/components/Llama";
import { MenuPerfil } from "@/components/MenuPerfil";

/**
 * Cabecera de las páginas internas.
 *
 * Existe para que las cinco secciones no repitan el mismo bloque con
 * variaciones: cuando había una copia por página, cambiar el destino del logo
 * obligaba a tocarlas todas y alguna se quedaba atrás.
 */
export function CabeceraApp({
  nombre,
  correo,
  foto,
  onSalir,
}: {
  nombre?: string;
  correo?: string | null;
  foto?: string | null;
  /** Sin esto no se dibuja el menú: no tiene sentido ofrecer salir sin acción. */
  onSalir?: () => void;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <Link href="/cursos" className="flex items-center gap-3">
      <Llama className="h-12 w-auto shrink-0 text-rojo-acento" />
      <span className="flex flex-col leading-tight">
        {nombre && (
          <span className="text-sm text-texto-suave">
            Bienvenido, <span className="font-medium text-texto">{nombre}</span>
          </span>
        )}
        <span className="text-base font-bold uppercase tracking-[0.2em] text-rojo-acento">
          EDUQA.PE
        </span>
      </span>
      </Link>

      {onSalir && (
        <MenuPerfil nombre={nombre} correo={correo} foto={foto} onSalir={onSalir} />
      )}
    </div>
  );
}
