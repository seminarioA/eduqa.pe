"use client";

import { useSyncExternalStore } from "react";
import { LockKeyhole } from "lucide-react";
import { modoAdminActivo, suscribirseModoAdmin } from "@/lib/modo-admin";

/**
 * Aviso de que se agotaron los cursos gratuitos.
 *
 * En modo administrador no se muestra: quien mantiene el catálogo no tiene
 * ese tope, así que anunciárselo sería informar de una barrera que para él no
 * existe.
 */
export function AvisoTope({
  limite,
  esAdmin,
}: {
  /** Nulo en el plan sin tope, donde este aviso no se muestra. */
  limite: number | null;
  esAdmin: boolean;
}) {
  const revisando = useSyncExternalStore(
    suscribirseModoAdmin,
    modoAdminActivo,
    () => false,
  );

  if (limite === null) return null;
  if (esAdmin && revisando) return null;

  return (
    <p className="mt-5 flex items-start gap-2 rounded-lg border border-borde bg-superficie px-4 py-3 text-sm text-texto-suave">
      <LockKeyhole
        size={15}
        className="mt-0.5 shrink-0 text-rojo-acento"
        aria-hidden="true"
      />
      Ya tienes tus {limite} cursos gratis en uso. Para abrir uno más, ese curso
      se compra aparte.
    </p>
  );
}
