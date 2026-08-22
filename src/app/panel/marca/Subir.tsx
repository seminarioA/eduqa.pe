"use client";

import { useActionState, useRef, useState } from "react";
import { AlertCircle, Check, Loader2, Upload } from "lucide-react";
import { guardarMarca, type EstadoMarca } from "./acciones";
import { Boton } from "@/components/ui";

/**
 * Subida del SVG de una ranura de la marca.
 *
 * Es un formulario pequeño y autónomo a propósito, como `Borrar` en avisos:
 * la tarjeta que lo contiene decide dónde va, este solo guarda.
 */
export function Subir({ clave }: { clave: string }) {
  const [estado, accion, subiendo] = useActionState<EstadoMarca | null, FormData>(
    guardarMarca,
    null,
  );
  const [elegido, setElegido] = useState(false);
  const entrada = useRef<HTMLInputElement>(null);

  // Al guardarse, la clave cambia y el formulario se remonta: la elección
  // queda limpia sin efectos ni estados que sincronizar.
  const limpio = estado?.ok ? "guardado" : "pendiente";

  return (
    <form
      key={limpio}
      action={accion}
      className="flex flex-wrap items-center gap-3"
    >
      <input type="hidden" name="clave" value={clave} />
      <input
        ref={entrada}
        type="file"
        name="svg"
        accept=".svg,image/svg+xml"
        className="hidden"
        onChange={(e) => setElegido(Boolean(e.target.files?.[0]))}
      />
      <Boton
        type="button"
        variante="secundario"
        onClick={() => entrada.current?.click()}
        className="px-4 py-2 text-xs"
      >
        Elegir SVG…
      </Boton>
      <Boton type="submit" disabled={subiendo || !elegido} className="px-4 py-2 text-xs">
        {subiendo && <Loader2 size={14} className="animate-spin" aria-hidden="true" />}
        <Upload size={14} aria-hidden="true" />
        {subiendo ? "Guardando…" : "Guardar"}
      </Boton>

      {estado && !estado.ok && (
        <p
          role="alert"
          className="flex items-start gap-2 rounded-lg border border-rojo-acento/30 bg-rojo-tenue px-3 py-2.5 text-sm text-rojo-acento"
        >
          <AlertCircle size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
          {estado.error}
        </p>
      )}

      {estado?.ok && (
        <p className="flex items-center gap-2 rounded-lg border border-borde bg-fondo px-3 py-2.5 text-sm text-texto-suave">
          <Check size={16} className="text-exito" aria-hidden="true" />
          Guardado. Ya se ve en toda la aplicación.
        </p>
      )}
    </form>
  );
}
