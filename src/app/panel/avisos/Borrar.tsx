"use client";

import { useActionState } from "react";
import { Loader2, Trash2 } from "lucide-react";
import { borrarAviso, type EstadoAviso } from "./acciones";

export function Borrar({ id }: { id: string }) {
  const [estado, accion, borrando] = useActionState<EstadoAviso | null, FormData>(
    borrarAviso,
    null,
  );

  return (
    <form action={accion} className="flex items-center gap-2">
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        disabled={borrando}
        aria-label="Borrar el aviso"
        className="rounded p-1 text-texto-tenue transition-colors hover:text-rojo-acento disabled:opacity-50"
      >
        {borrando ? (
          <Loader2 size={14} className="animate-spin" aria-hidden="true" />
        ) : (
          <Trash2 size={14} aria-hidden="true" />
        )}
      </button>
      {estado && !estado.ok && (
        <span role="alert" className="text-xs text-rojo-acento">
          {estado.error}
        </span>
      )}
    </form>
  );
}
