"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
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
  const [error, setError] = useState(false);
  const lienzo = useRef<HTMLCanvasElement>(null);

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

  return (
    <section aria-label="Contenido de la sesión">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-medium text-texto-suave">
          {modo === "lectura" ? "Modo lectura" : "Presentación PDF"}
        </p>
        <button
          type="button"
          onClick={() => setModo(modo === "lectura" ? "pdf" : "lectura")}
          className="inline-flex items-center gap-2 rounded-lg border border-borde px-3 py-2 text-sm font-medium text-texto-suave transition-colors hover:bg-superficie hover:text-texto"
        >
          {modo === "lectura" ? <Presentation size={16} aria-hidden="true" /> : <BookOpen size={16} aria-hidden="true" />}
          {modo === "lectura" ? "Ver presentación PDF" : "Volver a lectura"}
        </button>
      </div>

      {modo === "lectura" ? (
        <div>{lectura}</div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-borde bg-superficie">
          <div className="relative aspect-[16/9] w-full bg-white" aria-live="polite">
            {error ? (
              <p className="absolute inset-0 flex items-center justify-center px-6 text-center text-sm text-texto-suave">
                No se pudo mostrar la presentación. Puedes abrir o descargar el PDF.
              </p>
            ) : !documento ? (
              <p className="absolute inset-0 flex items-center justify-center text-sm text-texto-suave">Cargando presentación…</p>
            ) : null}
            <canvas
              ref={lienzo}
              aria-label={`Página ${pagina} de ${documento?.numPages ?? 0} de ${titulo}`}
              className={`h-full w-full object-contain ${documento && !error ? "block" : "hidden"}`}
            />
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-borde px-4 py-3 text-sm">
            <div className="flex items-center gap-2">
              <button type="button" aria-label="Página anterior" disabled={!documento || pagina === 1} onClick={() => setPagina(pagina - 1)} className="rounded-md p-1.5 text-texto-suave hover:bg-fondo disabled:opacity-40"><ArrowLeft size={17} aria-hidden="true" /></button>
              <span className="min-w-16 text-center text-texto-suave">{pagina} / {documento?.numPages ?? "…"}</span>
              <button type="button" aria-label="Página siguiente" disabled={!documento || pagina === documento.numPages} onClick={() => setPagina(pagina + 1)} className="rounded-md p-1.5 text-texto-suave hover:bg-fondo disabled:opacity-40"><ArrowRight size={17} aria-hidden="true" /></button>
            </div>
            <div className="flex items-center gap-4">
              <a href={archivo} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 font-medium text-texto-suave hover:text-texto"><ExternalLink size={15} aria-hidden="true" /> Abrir PDF</a>
              <a href={archivo} download className="inline-flex items-center gap-1.5 font-medium text-texto-suave hover:text-texto"><Download size={15} aria-hidden="true" /> Descargar</a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
