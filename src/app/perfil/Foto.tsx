"use client";

import { useActionState, useRef, useState } from "react";
import { Camera } from "lucide-react";
import { guardarFoto, type EstadoFoto } from "./acciones";

/** Subida de la foto de perfil, con vista previa antes de enviar. */
export function Foto({ actual, nombre }: { actual?: string | null; nombre?: string | null }) {
  const [estado, accion, enviando] = useActionState<EstadoFoto | null, FormData>(
    guardarFoto,
    null,
  );
  const [vista, setVista] = useState<string | null>(null);
  const entrada = useRef<HTMLInputElement>(null);

  const iniciales = (nombre ?? "?")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");

  return (
    <form action={accion} className="flex items-center gap-4">
      <button
        type="button"
        onClick={() => entrada.current?.click()}
        className="group relative size-20 shrink-0 overflow-hidden rounded-full border border-borde bg-superficie"
        aria-label="Cambiar la foto"
      >
        {vista || actual ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={vista ?? actual!} alt="" className="size-full object-cover" />
        ) : (
          <span className="flex size-full items-center justify-center text-xl font-semibold text-texto-tenue">
            {iniciales}
          </span>
        )}
        <span className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
          <Camera size={20} className="text-white" aria-hidden="true" />
        </span>
      </button>

      <input
        ref={entrada}
        type="file"
        name="foto"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          setVista(f ? URL.createObjectURL(f) : null);
        }}
      />

      <div className="min-w-0">
        <p className="text-sm font-medium text-texto">Foto de perfil</p>
        <p className="mt-0.5 text-xs text-texto-suave">
          Opcional. JPG, PNG, WEBP o GIF, hasta 2 MB.
        </p>
        <div className="mt-2 flex items-center gap-3">
          <button
            type="submit"
            disabled={enviando || !vista}
            // Secundario a propósito: en la misma tarjeta hay dos acciones y solo
            // una es la principal. Dos botones rojos seguidos no dicen cuál
            // guarda qué.
            className="rounded-lg border border-borde-fuerte bg-fondo px-4 py-2 text-xs font-medium text-texto transition-colors hover:border-rojo-acento hover:text-rojo-acento disabled:cursor-not-allowed disabled:opacity-40"
          >
            {enviando ? "Guardando…" : "Guardar foto"}
          </button>
          {estado && (
            <span
              role="status"
              className={`text-xs ${estado.ok ? "text-exito" : "text-rojo-acento"}`}
            >
              {estado.ok ? "Guardada." : estado.error}
            </span>
          )}
        </div>
      </div>
    </form>
  );
}
