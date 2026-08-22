"use client";

import { useActionState, useEffect, useRef } from "react";
import { AlertCircle, Check, Loader2 } from "lucide-react";
import { crearAviso, type EstadoAviso } from "./acciones";
import { Boton, Campo, claseInput, claseInputBase } from "@/components/ui";

export function Formulario() {
  const [estado, accion, enviando] = useActionState<EstadoAviso | null, FormData>(
    crearAviso,
    null,
  );
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (estado?.ok) formRef.current?.reset();
  }, [estado?.ok]);

  return (
    <form
      ref={formRef}
      action={accion}
      className="space-y-4 rounded-xl border border-borde bg-superficie p-5"
    >
      <Campo etiqueta="Título">
        <input
          name="titulo"
          required
          minLength={4}
          maxLength={120}
          placeholder="La sesión 2 de Python se dicta el sábado 15"
          className={claseInput}
        />
      </Campo>

      <Campo etiqueta="Aviso">
        <textarea
          name="cuerpo"
          required
          minLength={10}
          rows={4}
          placeholder={"A las 10:00 por Google Meet. El enlace llega por correo una hora antes."}
          className={`${claseInputBase} w-full resize-y`}
        />
      </Campo>

      <Campo
        etiqueta="Vigente hasta"
        ayuda="Opcional. Pasada esa fecha el aviso deja de mostrarse."
      >
        <input name="vigente_hasta" type="date" className={claseInput} />
      </Campo>

      <div className="flex flex-wrap gap-x-6 gap-y-2">
        <label className="flex items-center gap-2 text-sm text-texto-suave">
          <input
            type="checkbox"
            name="publicado"
            defaultChecked
            className="size-3.5 accent-rojo"
          />
          Publicado
        </label>
        <label className="flex items-center gap-2 text-sm text-texto-suave">
          <input type="checkbox" name="fijado" className="size-3.5 accent-rojo" />
          Fijar arriba
        </label>
      </div>

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
          Publicado en el tablero.
        </p>
      )}

      <Boton type="submit" disabled={enviando}>
        {enviando && <Loader2 size={16} className="animate-spin" aria-hidden="true" />}
        {enviando ? "Publicando…" : "Publicar aviso"}
      </Boton>
    </form>
  );
}
