"use client";

import { useRef, useState, useTransition, type KeyboardEvent } from "react";
import { CheckCircle2, XCircle, Loader2, PencilLine } from "lucide-react";
import { guardarTituloSeccion } from "@/app/cursos/acciones-titulos";
import type { ClaveTitulo } from "@/lib/titulos-seccion";

/**
 * Título editable en modo admin.
 * - Usuarios normales: solo texto.
 * - Admin: badge "editar" siempre visible. Clic abre input inline.
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
    if (!nuevo || nuevo === texto) { cancelar(); return; }
    startTransition(async () => {
      const res = await guardarTituloSeccion(clave, nuevo);
      if (res.ok) {
        setTexto(nuevo);
        setOk(true);
        setEditando(false);
        setTimeout(() => setOk(false), 2500);
      } else {
        setError(res.error ?? "Error desconocido");
      }
    });
  }

  function onKey(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") confirmar();
    if (e.key === "Escape") cancelar();
  }

  if (!esAdmin) return <span className={className}>{texto}</span>;

  if (editando) {
    return (
      <span className="inline-flex flex-wrap items-center gap-2">
        <input
          ref={inputRef}
          value={borrador}
          onChange={(e) => setBorrador(e.target.value)}
          onKeyDown={onKey}
          disabled={pending}
          maxLength={120}
          autoFocus
          className="rounded border border-rojo-acento bg-fondo px-2 py-0.5 text-[inherit] font-[inherit] text-texto focus:outline-none focus:ring-2 focus:ring-rojo-acento disabled:opacity-60"
          aria-label="Editar título de sección"
        />
        {pending ? (
          <Loader2 size={18} className="animate-spin text-texto-tenue" />
        ) : (
          <span className="inline-flex items-center gap-1">
            <button
              type="button"
              onClick={confirmar}
              title="Guardar (Enter)"
              className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-2.5 py-1 text-xs font-semibold text-white shadow-sm hover:bg-emerald-700 transition-colors"
            >
              <CheckCircle2 size={14} />
              Guardar
            </button>
            <button
              type="button"
              onClick={cancelar}
              title="Cancelar (Esc)"
              className="inline-flex items-center gap-1 rounded-lg border border-borde bg-superficie px-2.5 py-1 text-xs font-medium text-texto-suave hover:text-texto transition-colors"
            >
              <XCircle size={14} />
              Cancelar
            </button>
          </span>
        )}
        {error && (
          <span className="text-xs text-red-500" role="alert">{error}</span>
        )}
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center gap-2 ${className ?? ""}`}>
      <span>{texto}</span>
      {ok ? (
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
          <CheckCircle2 size={12} />
          Guardado
        </span>
      ) : (
        <button
          type="button"
          onClick={iniciarEdicion}
          className="inline-flex items-center gap-1 rounded border border-dashed border-rojo-acento/60 bg-rojo-tenue/20 px-1.5 py-0.5 text-[11px] font-medium text-rojo-acento hover:border-rojo-acento hover:bg-rojo-tenue/40 transition-colors"
          title="Editar título"
        >
          <PencilLine size={10} />
          editar
        </button>
      )}
    </span>
  );
}
