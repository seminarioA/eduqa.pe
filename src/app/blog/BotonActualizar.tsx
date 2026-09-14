"use client";

import { useState, useTransition } from "react";
import { RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { actualizarArticulosMedium } from "./acciones";

export function BotonActualizar() {
  const [pendiente, iniciar] = useTransition();
  const [mensaje, setMensaje] = useState("");
  const router = useRouter();

  return (
    <div className="flex flex-col items-start gap-1 sm:items-end">
      <button
        type="button"
        disabled={pendiente}
        onClick={() => {
          setMensaje("");
          iniciar(async () => {
            try {
              const cantidad = await actualizarArticulosMedium();
              router.refresh();
              setMensaje(cantidad > 0 ? `${cantidad} artículos disponibles` : "No hay artículos disponibles en el feed configurado");
            } catch (error) {
              setMensaje(error instanceof Error ? error.message : "No se pudo actualizar el blog");
            }
          });
        }}
        className="inline-flex items-center gap-2 rounded-lg border border-borde bg-fondo px-3 py-2 text-sm font-medium text-texto-suave transition-colors hover:border-texto-tenue hover:text-texto disabled:cursor-wait disabled:opacity-50"
      >
        <RefreshCw size={15} className={pendiente ? "animate-spin" : ""} aria-hidden="true" />
        {pendiente ? "Actualizando…" : "Actualizar artículos"}
      </button>
      <span role="status" className="min-h-4 text-xs text-texto-tenue">{mensaje}</span>
    </div>
  );
}
