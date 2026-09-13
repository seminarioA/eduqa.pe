"use client";

import { useState, useTransition } from "react";
import { RefreshCw, CheckCircle2 } from "lucide-react";
import { refrescarSincronizacionMedium } from "./acciones";

export function BotonSincronizar() {
  const [isPending, startTransition] = useTransition();
  const [exito, setExito] = useState(false);

  const handleClick = () => {
    setExito(false);
    startTransition(async () => {
      try {
        await refrescarSincronizacionMedium();
        setExito(true);
        setTimeout(() => setExito(false), 3500);
      } catch (err) {
        alert((err as Error).message);
      }
    });
  };

  return (
    <div className="flex items-center gap-3">
      {exito && (
        <span className="inline-flex items-center gap-1.5 text-xs text-exito">
          <CheckCircle2 size={14} /> Sincronizado con éxito
        </span>
      )}
      <button
        type="button"
        onClick={handleClick}
        disabled={isPending}
        className="inline-flex items-center gap-2 rounded-xl bg-rojo px-4 py-2 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-rojo-hover disabled:opacity-50"
      >
        <RefreshCw size={14} className={isPending ? "animate-spin" : ""} />
        {isPending ? "Sincronizando..." : "Forzar sincronización ahora"}
      </button>
    </div>
  );
}
