"use client";

import { useActionState } from "react";
import { AlertCircle, Check, Loader2 } from "lucide-react";
import { guardarNombre, type EstadoPerfil } from "./acciones";
import { Boton, Campo, claseInput } from "@/components/ui";

export function Formulario({
  nombre,
  telefono,
}: {
  nombre: string;
  telefono: string;
}) {
  const [estado, accion, guardando] = useActionState<EstadoPerfil | null, FormData>(
    guardarNombre,
    null,
  );

  return (
    <form action={accion} className="space-y-4">
      <Campo
        etiqueta="Nombre completo"
        ayuda="Es el nombre que se imprime en tus constancias."
      >
        <input
          name="nombre"
          required
          minLength={3}
          maxLength={80}
          defaultValue={nombre}
          autoComplete="name"
          placeholder="Ana Lucía Quispe Rojas"
          className={claseInput}
        />
      </Campo>

      <Campo etiqueta="Teléfono">
        <input
          name="telefono"
          type="tel"
          maxLength={20}
          defaultValue={telefono}
          autoComplete="tel"
          placeholder="+51 987 654 321"
          className={claseInput}
        />
      </Campo>

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
        <p className="flex items-center gap-2 rounded-lg border border-borde bg-superficie px-3 py-2.5 text-sm text-texto-suave">
          <Check size={16} className="text-exito" aria-hidden="true" />
          Guardado.
        </p>
      )}

      <Boton type="submit" disabled={guardando}>
        {guardando && <Loader2 size={16} className="animate-spin" aria-hidden="true" />}
        {guardando ? "Guardando…" : "Guardar"}
      </Boton>
    </form>
  );
}
