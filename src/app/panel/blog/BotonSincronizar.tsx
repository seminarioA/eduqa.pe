"use client";

import { useState, useTransition } from "react";
import { RefreshCw, Check } from "lucide-react";
import { sincronizarBlogAction } from "./acciones";

export function BotonSincronizar() {
  const [pendiente, startTransition] = useTransition();
  const [hecho, setHecho] = useState(false);

  const sincronizar = () => {
    startTransition(async () => {
      await sincronizarBlogAction();
      setHecho(true);
      setTimeout(() => setHecho(false), 3000);
    });
  };

  return (
    <button
      type="button"
      onClick={sincronizar}
      disabled={pendiente}
      className="inline-flex items-center gap-1.5 rounded-xl bg-rojo px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-rojo-hover disabled:opacity-50"
    >
      <RefreshCw
        size={13}
        className={pendiente ? "animate-spin" : hecho ? "text-emerald-300" : ""}
      />
      {pendiente ? "Sincronizando..." : hecho ? "¡Sincronizado!" : "Forzar Sincronización"}
    </button>
  );
}
