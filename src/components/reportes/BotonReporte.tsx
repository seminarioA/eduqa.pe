"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { AlertCircle, Bug, Check, ImagePlus, Loader2, X } from "lucide-react";
import { crearReporte, type EstadoReporte } from "./acciones";
import { Boton } from "@/components/ui";

/**
 * Botón flotante para reportar un fallo, con la tarjeta encima de la página.
 *
 * No es una ruta ni una pestaña a propósito: quien encuentra un error lo
 * encuentra mientras usa algo, y mandarlo a otra página le hace perder el
 * sitio y el contexto justo cuando más importa. La tarjeta se abre sobre lo
 * que estaba mirando y al cerrarla sigue donde estaba.
 */
export function BotonReporte({ esAdmin }: { esAdmin: boolean }) {
  const [abierto, setAbierto] = useState(false);

  // Escape cierra: es lo que espera cualquiera de una capa flotante.
  useEffect(() => {
    if (!abierto) return;
    const alPulsar = (e: KeyboardEvent) => {
      if (e.key === "Escape") setAbierto(false);
    };
    window.addEventListener("keydown", alPulsar);
    return () => window.removeEventListener("keydown", alPulsar);
  }, [abierto]);

  return (
    <>
      <button
        type="button"
        onClick={() => setAbierto(true)}
        aria-label="Reportar un error"
        title="Reportar un error"
        className="fixed bottom-5 right-5 z-40 flex size-12 items-center justify-center rounded-full border border-borde bg-fondo text-texto-tenue shadow-lg transition-colors hover:border-rojo-acento hover:text-rojo-acento"
      >
        <Bug size={19} aria-hidden="true" />
      </button>

      {abierto && <Tarjeta esAdmin={esAdmin} onCerrar={() => setAbierto(false)} />}
    </>
  );
}

function Tarjeta({ esAdmin, onCerrar }: { esAdmin: boolean; onCerrar: () => void }) {
  const [estado, accion, enviando] = useActionState<EstadoReporte | null, FormData>(
    crearReporte,
    null,
  );
  const [archivos, setArchivos] = useState<File[]>([]);
  const [encima, setEncima] = useState(false);
  const [ctx, setCtx] = useState({ ruta: "", navegador: "" });
  const entradaRef = useRef<HTMLInputElement>(null);
  const textoRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    textoRef.current?.focus();
    setCtx({
      ruta: window.location.pathname + window.location.hash,
      navegador: `${navigator.userAgent} · ${window.innerWidth}x${window.innerHeight}`,
    });
  }, []);

  // El input de archivos solo acepta un FileList, no un array: se reconstruye
  // con DataTransfer para que el envío incluya lo pegado y lo arrastrado.
  useEffect(() => {
    if (!entradaRef.current) return;
    const dt = new DataTransfer();
    archivos.forEach((a) => dt.items.add(a));
    entradaRef.current.files = dt.files;
  }, [archivos]);

  const agregar = (nuevos: FileList | File[] | null) => {
    if (!nuevos) return;
    const lista = Array.from(nuevos);
    if (lista.length > 0) setArchivos((p) => [...p, ...lista]);
  };

  if (estado?.ok) {
    return (
      <Capa onCerrar={onCerrar}>
        <div className="p-8 text-center">
          <Check size={34} className="mx-auto text-exito" aria-hidden="true" />
          <p className="mt-4 font-medium">Gracias, ya lo tenemos anotado.</p>
          <p className="mt-1.5 text-sm text-texto-suave">
            {esAdmin
              ? "Aparece en la bandeja de reportes."
              : "Lo revisamos y lo arreglamos."}
          </p>
          <Boton variante="secundario" onClick={onCerrar} className="mt-6">
            Cerrar
          </Boton>
        </div>
      </Capa>
    );
  }

  return (
    <Capa onCerrar={onCerrar}>
      <form
        action={accion}
        onPaste={(e) => agregar(e.clipboardData.files)}
        onDragOver={(e) => {
          e.preventDefault();
          setEncima(true);
        }}
        onDragLeave={() => setEncima(false)}
        onDrop={(e) => {
          e.preventDefault();
          setEncima(false);
          agregar(e.dataTransfer.files);
        }}
        className="p-5"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="flex items-center gap-2 font-semibold">
              <Bug size={17} className="text-rojo-acento" aria-hidden="true" />
              Reportar un error
            </h2>
            <p className="mt-1 text-xs text-texto-tenue">
              Guardamos solo la página y el navegador, para poder reproducirlo.
            </p>
          </div>
          <button
            type="button"
            onClick={onCerrar}
            aria-label="Cerrar"
            className="shrink-0 rounded p-1 text-texto-tenue transition-colors hover:text-rojo-acento"
          >
            <X size={17} aria-hidden="true" />
          </button>
        </div>

        <input type="hidden" name="ruta" value={ctx.ruta} />
        <input type="hidden" name="navegador" value={ctx.navegador} />
        <input
          ref={entradaRef}
          type="file"
          name="adjuntos"
          multiple
          accept="image/*,.txt,.json,.pdf"
          onChange={(e) => agregar(e.target.files)}
          className="sr-only"
          tabIndex={-1}
        />

        <textarea
          ref={textoRef}
          name="descripcion"
          required
          minLength={10}
          maxLength={4000}
          rows={6}
          placeholder={
            esAdmin
              ? "Qué falla, dónde y cómo se reproduce."
              : "Cuéntanos qué estabas haciendo y qué salió mal."
          }
          className={`mt-4 w-full resize-y rounded-lg border bg-fondo px-3 py-2.5 text-sm text-texto placeholder:text-texto-tenue focus:outline-none focus:ring-1 focus:ring-rojo-acento ${
            encima ? "border-rojo-acento" : "border-borde-fuerte focus:border-rojo-acento"
          }`}
        />

        <p className="mt-2 flex items-center gap-1.5 text-xs text-texto-tenue">
          <ImagePlus size={13} className="shrink-0" aria-hidden="true" />
          {encima
            ? "Suelta los archivos aquí"
            : "Pega una captura con Cmd+V o arrástrala sobre la tarjeta"}
        </p>

        {archivos.length > 0 && (
          <ul className="mt-3 space-y-1.5">
            {archivos.map((a, i) => (
              <li
                key={`${a.name}-${i}`}
                className="flex items-center gap-2 rounded-lg border border-borde bg-superficie px-3 py-1.5 text-xs"
              >
                <span className="truncate">{a.name || "captura.png"}</span>
                <span className="shrink-0 text-texto-tenue">
                  {(a.size / 1024).toFixed(0)} KB
                </span>
                <button
                  type="button"
                  onClick={() => setArchivos((p) => p.filter((_, j) => j !== i))}
                  aria-label={`Quitar ${a.name || "el archivo"}`}
                  className="ml-auto shrink-0 rounded p-0.5 text-texto-tenue transition-colors hover:text-rojo-acento"
                >
                  <X size={13} aria-hidden="true" />
                </button>
              </li>
            ))}
          </ul>
        )}

        {estado && !estado.ok && (
          <p
            role="alert"
            className="mt-3 flex items-start gap-2 rounded-lg border border-rojo-acento/30 bg-rojo-tenue px-3 py-2 text-xs text-rojo-acento"
          >
            <AlertCircle size={14} className="mt-px shrink-0" aria-hidden="true" />
            {estado.error}
          </p>
        )}

        <div className="mt-5 flex justify-end gap-2">
          <Boton
            type="button"
            variante="secundario"
            onClick={onCerrar}
            className="px-4 py-2 text-xs"
          >
            Cancelar
          </Boton>
          <Boton type="submit" disabled={enviando} className="px-4 py-2 text-xs">
            {enviando && (
              <Loader2 size={14} className="animate-spin" aria-hidden="true" />
            )}
            {enviando ? "Enviando…" : "Enviar"}
          </Boton>
        </div>
      </form>
    </Capa>
  );
}

/** Fondo oscurecido y contenedor centrado de la tarjeta. */
function Capa({
  children,
  onCerrar,
}: {
  children: React.ReactNode;
  onCerrar: () => void;
}) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Reportar un error"
      className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center"
    >
      {/* El clic fuera cierra, pero el fondo no recibe foco: el diálogo es
          quien lo tiene. */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onCerrar}
        aria-hidden="true"
      />
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-borde bg-superficie shadow-2xl">
        {children}
      </div>
    </div>
  );
}
