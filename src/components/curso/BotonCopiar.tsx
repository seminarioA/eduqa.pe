"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

export function BotonCopiar({ texto }: { texto: string }) {
  const [copiado, setCopiado] = useState(false);

  async function copiar() {
    try {
      await navigator.clipboard.writeText(texto);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    } catch {
      setCopiado(false);
    }
  }

  return (
    <button
      type="button"
      onClick={copiar}
      aria-label={copiado ? "Código copiado" : "Copiar código"}
      className="flex items-center gap-1.5 rounded-md border border-borde-fuerte bg-fondo px-2 py-1 text-xs font-medium text-texto-suave transition-colors hover:border-rojo-acento hover:text-rojo-acento"
    >
      {copiado ? (
        <>
          <Check size={13} className="text-exito" aria-hidden="true" />
          Copiado
        </>
      ) : (
        <>
          <Copy size={13} aria-hidden="true" />
          Copiar
        </>
      )}
    </button>
  );
}
