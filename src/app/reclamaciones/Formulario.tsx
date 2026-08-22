"use client";

import { useActionState, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { presentarReclamacion, type EstadoReclamacion } from "./acciones";

const campo =
  "mt-1 w-full rounded-lg border border-borde bg-fondo px-3 py-2 text-sm text-texto outline-none focus:border-rojo-acento";
const etiqueta = "block text-xs font-medium text-texto-suave";

export function FormularioReclamacion() {
  const [estado, accion, enviando] = useActionState<EstadoReclamacion | null, FormData>(
    presentarReclamacion,
    null,
  );
  const [esMenor, setEsMenor] = useState(false);

  if (estado?.ok) {
    return (
      <div className="rounded-xl border border-borde bg-superficie p-6 text-center">
        <CheckCircle2 size={40} className="mx-auto text-exito" aria-hidden="true" />
        <h2 className="mt-3 text-lg font-semibold text-texto">
          Hoja N.º {estado.correlativo} registrada
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-texto-suave">
          Guarda ese número. Te llegará una copia al correo que indicaste y una
          respuesta dentro del plazo que fija la ley.
        </p>
      </div>
    );
  }

  return (
    <form action={accion} className="space-y-6">
      <fieldset className="rounded-xl border border-borde bg-superficie p-5">
        <legend className="px-2 text-xs font-semibold uppercase tracking-wide text-texto-tenue">
          1. Quién reclama
        </legend>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className={`${etiqueta} sm:col-span-2`}>
            Nombre completo
            <input name="nombre" required className={campo} />
          </label>
          <label className={etiqueta}>
            Tipo de documento
            <select name="documento_tipo" defaultValue="DNI" className={campo}>
              <option>DNI</option>
              <option>CE</option>
              <option>PASAPORTE</option>
              <option>RUC</option>
            </select>
          </label>
          <label className={etiqueta}>
            Número
            <input name="documento" required className={campo} />
          </label>
          <label className={etiqueta}>
            Correo
            <input name="email" type="email" required className={campo} />
          </label>
          <label className={etiqueta}>
            Teléfono
            <input name="telefono" className={campo} />
          </label>
          <label className={`${etiqueta} sm:col-span-2`}>
            Domicilio
            <input name="domicilio" className={campo} />
          </label>

          <label className="sm:col-span-2 flex items-center gap-2 text-xs text-texto-suave">
            <input
              type="checkbox"
              name="es_menor"
              checked={esMenor}
              onChange={(e) => setEsMenor(e.target.checked)}
              className="size-4 accent-rojo"
            />
            El consumidor es menor de edad
          </label>
          {esMenor && (
            <label className={`${etiqueta} sm:col-span-2`}>
              Nombre del padre, madre o apoderado
              <input name="apoderado" required className={campo} />
            </label>
          )}
        </div>
      </fieldset>

      <fieldset className="rounded-xl border border-borde bg-superficie p-5">
        <legend className="px-2 text-xs font-semibold uppercase tracking-wide text-texto-tenue">
          2. Qué contrataste
        </legend>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className={etiqueta}>
            Tipo
            <select name="tipo_bien" defaultValue="servicio" className={campo}>
              <option value="servicio">Servicio</option>
              <option value="producto">Producto</option>
            </select>
          </label>
          <label className={etiqueta}>
            Monto pagado en soles
            <input name="monto" type="number" min={0} step="0.01" className={campo} />
          </label>
          <label className={`${etiqueta} sm:col-span-2`}>
            Curso o servicio
            <input
              name="descripcion_bien"
              required
              placeholder="Introducción a Polars"
              className={campo}
            />
          </label>
        </div>
      </fieldset>

      <fieldset className="rounded-xl border border-borde bg-superficie p-5">
        <legend className="px-2 text-xs font-semibold uppercase tracking-wide text-texto-tenue">
          3. Qué ocurrió
        </legend>

        <div className="flex flex-wrap gap-4">
          {[
            ["reclamo", "Reclamo", "Disconformidad con el curso o el servicio."],
            ["queja", "Queja", "Malestar con la atención recibida."],
          ].map(([valor, titulo, ayuda]) => (
            <label
              key={valor}
              className="flex flex-1 cursor-pointer items-start gap-2 rounded-lg border border-borde bg-fondo p-3 text-xs"
            >
              <input
                type="radio"
                name="tipo"
                value={valor}
                required
                className="mt-0.5 size-4 accent-rojo"
              />
              <span>
                <span className="block font-medium text-texto">{titulo}</span>
                <span className="text-texto-tenue">{ayuda}</span>
              </span>
            </label>
          ))}
        </div>

        <label className={`${etiqueta} mt-3 block`}>
          Detalle
          <textarea name="detalle" required rows={5} maxLength={4000} className={campo} />
        </label>
        <label className={`${etiqueta} mt-3 block`}>
          Qué esperas que se haga
          <textarea name="pedido" required rows={3} maxLength={2000} className={campo} />
        </label>
      </fieldset>

      <div className="flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={enviando}
          className="rounded-lg bg-rojo px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-rojo-hover disabled:opacity-50"
        >
          {enviando ? "Registrando…" : "Registrar la hoja"}
        </button>
        {estado && !estado.ok && (
          <span role="status" className="text-sm text-rojo-acento">
            {estado.error}
          </span>
        )}
      </div>
    </form>
  );
}
