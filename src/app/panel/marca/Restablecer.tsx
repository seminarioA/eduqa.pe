"use client";

import { useActionState } from "react";
import { Loader2, RotateCcw } from "lucide-react";
import { restablecerMarca, type EstadoMarca } from "./acciones";

/**
 * Vuelve la ranura a la llama original.
 *
 * Solo se muestra cuando la ranura tiene un SVG propio: restablecer algo que
 * ya está original confundiría más de lo que ayuda. Sigue el patrón de
 * `Borrar` en avisos: formulario mínimo con error en línea.
 */
export function Restablecer({ clave }: { clave: string }) {
  const [estado, accion, restaurando] = useActionState<EstadoMarca | null, FormData>(
    restablecerMarca,
    null,
  );

  return (
    <form action={accion} className="flex items-center gap-2">
      <input type="hidden" name="clave" value={clave} />
      <button
        type="submit"
        disabled={restaurando}
        className="flex items-center gap-1.5 text-xs text-texto-suave transition-colors hover:text-rojo-acento disabled:opacity-50"
      >
        {restaurando ? (
          <Loader2 size={12} className="animate-spin" aria-hidden="true" />
        ) : (
          <RotateCcw size={12} aria-hidden="true" />
        )}
        Volver a la llama original
      </button>
      {estado && !estado.ok && (
        <span role="alert" className="text-xs text-rojo-acento">
          {estado.error}
        </span>
      )}
    </form>
  );
}
