"use client";

import { useSyncExternalStore } from "react";
import { Eye, EyeOff } from "lucide-react";
import {
  alternarModoAdmin,
  modoAdminActivo,
  suscribirseModoAdmin,
} from "@/lib/modo-admin";

/**
 * Conmuta entre ver la plataforma como administrador o como la ve un alumno.
 *
 * En modo administrador desaparecen los botones de comprar y el aviso del tope
 * de cursos gratis, porque para quien mantiene el catálogo esas barreras solo
 * estorban. Apagarlo devuelve la vista del alumno, que es la única forma
 * fiable de revisar cómo se ve de verdad lo que uno publica.
 */
export function BotonModoAdmin() {
  const activo = useSyncExternalStore(
    suscribirseModoAdmin,
    modoAdminActivo,
    () => false,
  );

  return (
    <button
      type="button"
      onClick={alternarModoAdmin}
      aria-pressed={activo}
      title={
        activo
          ? "Estás viendo como administrador. Pulsa para ver como un alumno."
          : "Estás viendo como un alumno. Pulsa para ver como administrador."
      }
      className={`fixed bottom-20 right-5 z-40 flex size-12 items-center justify-center rounded-full border shadow-lg transition-colors ${
        activo
          ? "border-rojo bg-rojo text-white"
          : "border-borde bg-fondo text-texto-tenue hover:border-rojo-acento hover:text-rojo-acento"
      }`}
    >
      {activo ? (
        <Eye size={19} aria-hidden="true" />
      ) : (
        <EyeOff size={19} aria-hidden="true" />
      )}
      <span className="sr-only">
        {activo ? "Ver como un alumno" : "Ver como administrador"}
      </span>
    </button>
  );
}
