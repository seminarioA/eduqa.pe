"use client";

import { useRef, useState, useTransition, type KeyboardEvent } from "react";
import { Pencil, Check, X, Loader2 } from "lucide-react";
import { guardarTituloSeccion } from "@/app/cursos/acciones-titulos";
import type { ClaveTitulo } from "@/lib/titulos-seccion";

/**
 * Muestra un título de sección y, si el usuario es admin,
 * permite editarlo con un clic. El modo admin muestra siempre
 * un badge de edición visible (no depende de hover).
 */
export function TituloEditable({
  clave,
  valorInicial,
  esAdmin = false,
  className,
}: {
  clave: ClaveTitulo;
  valorInicial: string;
  esAdmin?: boolean;
  className?: string;
}) {
  const [texto, setTexto] = useState(valorInicial);
  const [editando, setEditando] = useState(false);
  const [borrador, setBorrador] = useState(valorInicial);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState(false);
  const [pending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  function iniciarEdicion() {
    setBorrador(texto);
    setError(null);
    setOk(false);
    setEditando(true);
    setTimeout(() => inputRef.current?.select(), 0);
  }

  function cancelar() {
    setEditando(false);
    setError(null);
  }

  function confirmar() {
    const nuevo = borrador.trim();
    if (!nuevo || nuevo === texto) {
      cancelar();
      return;
    }
    startTransition(async () => {
      const res = await guardarTituloSeccion(clave, nuevo);
      if (res.ok) {
        setTexto(nuevo);
        setOk(true);
        setEditando(false);
        setTimeout(() => setOk(false), 2000);
      } else {
        setError(res.error ?? "Error desconocido");
      }
    });
  }

  function onKey(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") confirmar();
    if (e.key === "Escape") cancelar();
  }

  // Usuarios normales: solo texto
  if (!esAdmin) {
    return <span className={className}>{texto}</span>;
  }

  // Modo edición activo
  if (editando) {
    return (
      <span className="inline-flex flex-wrap items-center gap-1.5">
        <input
          ref={inputRef}
          value={borrador}
          onChange={(e) => setBorrador(e.target.value)}
          onKeyDown={onKey}
          disabled={pending}
          maxLength={120}
          className="rounded border border-rojo-acento bg-fondo px-2 py-0.5 text-[inherit] font-[inherit] text-texto focus:outline-none focus:ring-1 focus:ring-rojo-acento disabled:opacity-60"
          aria-label="Editar título de sección"
          autoFocus
        />
        {pending ? (
          <Loader2 size={16} className="animate-spin text-texto-tenue" aria-label="Guardando" />
        ) : (
          <>
            <button
              type="button"
              onClick={confirmar}
              title="Confirmar (Enter)"
              className="inline-flex items-center gap-1 rounded bg-emerald-600 px-2 py-0.5 text-xs font-medium text-white hover:bg-emerald-700"
            >
              <Check size={13} /> Guardar
            </button>
            <button
              type="button"
              onClick={cancelar}
              title="Cancelar (Esc)"
              className="inline-flex items-center gap-1 rounded border border-borde bg-superficie px-2 py-0.5 text-xs font-medium text-texto-suave hover:text-texto"
            >
              <X size={13} /> Cancelar
            </button>
          </>
        )}
        {error && (
          <span className="text-xs text-red-500" role="alert">
            {error}
          </span>
        )}
      </span>
    );
  }

  // Admin: texto + badge de editar siempre visible
  return (
    <span className={`inline-flex items-center gap-2 ${className ?? ""}`}>
      <span>{texto}</span>
      {ok ? (
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
          <Check size={11} /> Guardado
        </span>
      ) : (
        <button
          type="button"
          onClick={iniciarEdicion}
          className="inline-flex items-center gap-1 rounded border border-dashed border-rojo-acento/50 bg-rojo-tenue/30 px-1.5 py-0.5 text-[11px] font-medium text-rojo-acento hover:border-rojo-acento hover:bg-rojo-tenue transition-colors"
          title="Editar título de esta sección"
        >
          <Pencil size={10} />
          editar
        </button>
      )}
    </span>
  );
}
