"use client";

import { useActionState, useRef } from "react";
import { Loader2 } from "lucide-react";
import {
  cambiarEstadoReporte,
  type EstadoReporte,
} from "./acciones";
import { ESTADOS_REPORTE } from "./estados";
import { Selector } from "@/components/Selector";

const ETIQUETAS: Record<string, string> = {
  abierto: "Abierto",
  en_curso: "En curso",
  resuelto: "Resuelto",
  descartado: "Descartado",
};

/** Cambia el estado de un reporte sin abrir otra pantalla. */
export function CambiarEstado({ id, estado }: { id: string; estado: string }) {
  const [resultado, accion, guardando] = useActionState<EstadoReporte | null, FormData>(
    cambiarEstadoReporte,
    null,
  );
  const formRef = useRef<HTMLFormElement>(null);
  const campoRef = useRef<HTMLInputElement>(null);

  return (
    <form ref={formRef} action={accion} className="flex items-center gap-2">
      <input type="hidden" name="id" value={id} />
      <input ref={campoRef} type="hidden" name="estado" defaultValue={estado} />

      <Selector
        etiqueta="Estado del reporte"
        valor={estado}
        onCambio={(v) => {
          // El Selector de Radix no es un campo de formulario nativo: se
          // copia su valor al input oculto antes de enviar.
          if (campoRef.current) campoRef.current.value = v;
          formRef.current?.requestSubmit();
        }}
        opciones={ESTADOS_REPORTE.map((e) => ({ valor: e, etiqueta: ETIQUETAS[e] }))}
        talla="compacta"
        className="text-xs"
      />

      {guardando && (
        <Loader2 size={14} className="animate-spin text-texto-tenue" aria-hidden="true" />
      )}
      {resultado && !resultado.ok && (
        <span role="alert" className="text-xs text-rojo-acento">
          {resultado.error}
        </span>
      )}
    </form>
  );
}
