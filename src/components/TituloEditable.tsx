"use client";

import { useRef, useState, useTransition, type KeyboardEvent } from "react";
import { Pencil, Check, X, Loader2 } from "lucide-react";
import { guardarTituloSeccion } from "@/app/cursos/acciones-titulos";
import type { ClaveTitulo } from "@/lib/titulos-seccion";

/**
 * Muestra un título de sección y, si el usuario es admin,
 * permite editarlo con un clic o teclado.
 *
 * Al confirmar llama al server action y muestra feedback en línea.
 * Si falla, restaura el valor anterior.
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

  if (!esAdmin) {
    return <span className={className}>{texto}</span>;
  }

  if (editando) {
    return (
      <span className="inline-flex items-center gap-1.5">
        <input
          ref={inputRef}
          value={borrador}
          onChange={(e) => setBorrador(e.target.value)}
          onKeyDown={onKey}
          disabled={pending}
          maxLength={120}
          className="rounded border border-rojo-acento bg-fondo px-2 py-0.5 text-[inherit] font-[inherit] text-texto focus:outline-none focus:ring-1 focus:ring-rojo-acento disabled:opacity-60"
          aria-label="Editar título de sección"
        />
        {pending ? (
          <Loader2 size={16} className="animate-spin text-texto-tenue" aria-label="Guardando" />
        ) : (
          <>
            <button
              type="button"
              onClick={confirmar}
              title="Confirmar (Enter)"
              className="rounded p-0.5 text-emerald-600 hover:bg-emerald-100 dark:hover:bg-emerald-900/30"
            >
              <Check size={16} />
            </button>
            <button
              type="button"
              onClick={cancelar}
              title="Cancelar (Esc)"
              className="rounded p-0.5 text-texto-tenue hover:bg-superficie"
            >
              <X size={16} />
            </button>
          </>
        )}
        {error && (
          <span className="ml-1 text-xs text-red-500" role="alert">
            {error}
          </span>
        )}
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={iniciarEdicion}
      title="Clic para editar este título (solo admin)"
      className={`group/titulo inline-flex items-center gap-1.5 rounded hover:bg-superficie/60 ${className ?? ""}`}
    >
      {texto}
      {ok ? (
        <Check size={14} className="text-emerald-500" aria-label="Guardado" />
      ) : (
        <Pencil
          size={14}
          aria-hidden="true"
          className="opacity-0 text-rojo-acento transition-opacity group-hover/titulo:opacity-100"
        />
      )}
    </button>
  );
}
