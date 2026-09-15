"use client";

import { useCallback, useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { ArrowLeft, ArrowRight, BookOpen, Download, ExternalLink, Presentation } from "lucide-react";
import type { PDFDocumentProxy } from "pdfjs-dist";

export function VistaDiapositivas({
  archivo,
  titulo,
  lectura,
}: {
  archivo: string;
  titulo: string;
  lectura: ReactNode;
}) {
  const [modo, setModo] = useState<"lectura" | "pdf">("lectura");
  const [documento, setDocumento] = useState<PDFDocumentProxy | null>(null);
  const [pagina, setPagina] = useState(1);
  const [paginaEscrita, setPaginaEscrita] = useState("1");
  const [error, setError] = useState(false);
  const dialogo = useRef<HTMLDialogElement>(null);
  const lienzo = useRef<HTMLCanvasElement>(null);

  // showModal deja inerte el resto de la página, incluido el índice del curso.
  useEffect(() => {
    if (modo !== "pdf") return;
    const modal = dialogo.current;
    modal?.showModal();
    return () => {
      if (modal?.open) modal.close();
    };
  }, [modo]);

  useEffect(() => {
    if (modo !== "pdf") return;
    let cancelado = false;
    let tarea: ReturnType<typeof import("pdfjs-dist").getDocument> | undefined;
    void (async () => {
      try {
        const pdfjs = await import("pdfjs-dist");
        pdfjs.GlobalWorkerOptions.workerSrc = "/vendor/pdfjs/pdf.worker.min.mjs";
        const carga = pdfjs.getDocument({ url: archivo });
        tarea = carga;
        const pdf = await carga.promise;
        if (cancelado) {
          await carga.destroy();
          return;
        }
        setDocumento(pdf);
        setError(false);
      } catch {
        if (!cancelado) setError(true);
      }
    })();
    return () => {
      cancelado = true;
      setDocumento(null);
      void tarea?.destroy();
    };
  }, [archivo, modo]);

  useEffect(() => {
    if (modo !== "pdf" || !documento || !lienzo.current) return;
    let cancelado = false;
    let tarea: { cancel: () => void; promise: Promise<unknown> } | undefined;
    void (async () => {
      try {
        const hoja = await documento.getPage(pagina);
        if (cancelado || !lienzo.current) return;
        const canvas = lienzo.current;
        const escala = Math.min(window.devicePixelRatio || 1, 2);
        const viewport = hoja.getViewport({ scale: escala });
        canvas.width = Math.ceil(viewport.width);
        canvas.height = Math.ceil(viewport.height);
        const contexto = canvas.getContext("2d");
        if (!contexto) throw new Error("Canvas no disponible");
        tarea = hoja.render({ canvas, canvasContext: contexto, viewport });
        await tarea.promise;
      } catch (fallo) {
        if (!cancelado && !(fallo instanceof Error && fallo.name === "RenderingCancelledException")) setError(true);
      }
    })();
    return () => {
      cancelado = true;
      tarea?.cancel();
    };
  }, [documento, modo, pagina]);

  const cambiarPagina = useCallback((siguiente: number) => {
    if (!documento || siguiente < 1 || siguiente > documento.numPages) return;
    setPagina(siguiente);
    setPaginaEscrita(String(siguiente));
  }, [documento]);

  useEffect(() => {
    if (modo !== "pdf" || !documento) return;
    const navegar = (evento: KeyboardEvent) => {
      const objetivo = evento.target as HTMLElement | null;
      if (
        objetivo?.matches("input, textarea, select, [contenteditable='true']")
      ) return;

      if (evento.key === "ArrowLeft") {
        evento.preventDefault();
        cambiarPagina(pagina - 1);
      } else if (evento.key === "ArrowRight") {
        evento.preventDefault();
        cambiarPagina(pagina + 1);
      }
    };
    window.addEventListener("keydown", navegar);
    return () => window.removeEventListener("keydown", navegar);
  }, [cambiarPagina, documento, modo, pagina]);

  function irAPagina(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    cambiarPagina(Number(paginaEscrita));
  }

  return (
    <section aria-label="Contenido de la sesión">
      <div className="mb-5 flex justify-end">
        <button
          type="button"
          onClick={() => setModo("pdf")}
          className="inline-flex items-center gap-2 rounded-lg border border-borde px-3 py-2 text-sm font-medium text-texto-suave transition-colors hover:bg-superficie hover:text-texto"
        >
          <Presentation size={16} aria-hidden="true" />
          Ver presentación
        </button>
      </div>

      <div>{lectura}</div>

      {modo === "pdf" && (
        <dialog
          ref={dialogo}
          aria-label={`Presentación: ${titulo}`}
          onClose={() => setModo("lectura")}
          className="fixed inset-0 m-0 h-dvh w-dvw max-h-none max-w-none overflow-hidden border-0 bg-fondo p-0 text-texto backdrop:bg-black/70"
        >
          <div className="flex h-full min-h-0 flex-col">
            <header className="flex shrink-0 items-center justify-between gap-4 border-b border-borde px-4 py-3 sm:px-6">
              <h2 className="min-w-0 truncate text-sm font-medium sm:text-base">{titulo}</h2>
              <button
                type="button"
                onClick={() => setModo("lectura")}
                className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-borde px-3 py-2 text-sm font-medium text-texto-suave transition-colors hover:bg-superficie hover:text-texto"
              >
                <BookOpen size={16} aria-hidden="true" />
                Volver a lectura
              </button>
            </header>

            <div className="relative flex min-h-0 flex-1 items-center justify-center bg-superficie p-3 sm:p-6" aria-live="polite">
              {error ? (
                <p className="px-6 text-center text-sm text-texto-suave">
                  No se pudo mostrar la presentación. Puedes abrir o descargar el PDF.
                </p>
              ) : !documento ? (
                <p className="text-sm text-texto-suave">Cargando presentación…</p>
              ) : null}
              <canvas
                ref={lienzo}
                aria-label={`Página ${pagina} de ${documento?.numPages ?? 0} de ${titulo}`}
                className={`h-full w-full object-contain ${documento && !error ? "block" : "hidden"}`}
              />
            </div>

            <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-t border-borde px-4 py-3 text-sm sm:px-6">
              <div className="flex items-center gap-2">
                <button type="button" aria-label="Página anterior" disabled={!documento || pagina === 1} onClick={() => cambiarPagina(pagina - 1)} className="rounded-md p-1.5 text-texto-suave hover:bg-superficie disabled:opacity-40">
                  <ArrowLeft size={17} aria-hidden="true" />
                </button>
                <form onSubmit={irAPagina} className="flex items-center gap-2 text-texto-suave">
                  <input
                    type="number"
                    aria-label="Número de página"
                    min={1}
                    max={documento?.numPages}
                    step={1}
                    required
                    disabled={!documento}
                    value={paginaEscrita}
                    onChange={(evento) => setPaginaEscrita(evento.target.value)}
                    className="w-16 rounded-md border border-borde bg-fondo px-2 py-1.5 text-center tabular-nums text-texto focus:border-rojo-acento focus:outline-2 focus:outline-rojo-acento"
                  />
                  <span className="tabular-nums">/ {documento?.numPages ?? "…"}</span>
                  <button type="submit" disabled={!documento} className="rounded-md px-2 py-1.5 font-medium hover:bg-superficie disabled:opacity-40">Ir</button>
                </form>
                <button type="button" aria-label="Página siguiente" disabled={!documento || pagina === documento.numPages} onClick={() => cambiarPagina(pagina + 1)} className="rounded-md p-1.5 text-texto-suave hover:bg-superficie disabled:opacity-40">
                  <ArrowRight size={17} aria-hidden="true" />
                </button>
              </div>
              <div className="flex items-center gap-4 text-texto-suave">
                <a href={archivo} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 font-medium hover:text-texto"><ExternalLink size={15} aria-hidden="true" /> Abrir PDF</a>
                <a href={archivo} download className="inline-flex items-center gap-1.5 font-medium hover:text-texto"><Download size={15} aria-hidden="true" /> Descargar</a>
              </div>
            </div>
          </div>
        </dialog>
      )}
    </section>
  );
}
