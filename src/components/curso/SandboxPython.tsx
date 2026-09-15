"use client";

import { useId, useMemo, useState, useSyncExternalStore } from "react";
import { Download, Play, RotateCcw, TriangleAlert } from "lucide-react";
import {
  ejecutarPython,
  estadoPython,
  suscribirsePython,
} from "@/lib/pyodide";
import {
  BORRADOR_INICIAL_PYTHON,
  crearAlmacenBorradorPython,
  leerBorradorPython,
  PROGRAMA_INICIAL_PYTHON,
} from "@/lib/borrador-python";

const boton =
  "inline-flex items-center justify-center gap-2 rounded-lg border border-borde-fuerte bg-fondo px-3 py-2 text-sm font-medium text-texto-suave transition-colors hover:border-rojo-acento hover:text-rojo-acento disabled:cursor-wait disabled:opacity-50";

type Resultado = { salida: string; error: boolean } | null;

export function SandboxPython() {
  const id = useId();
  const almacen = useMemo(() => crearAlmacenBorradorPython(), []);
  const texto = useSyncExternalStore(
    almacen.suscribir,
    almacen.leer,
    () => BORRADOR_INICIAL_PYTHON,
  );
  const borrador = useMemo(() => leerBorradorPython(texto), [texto]);
  const preparacion = useSyncExternalStore(
    suscribirsePython,
    estadoPython,
    () => "sin-empezar" as const,
  );
  const [ejecutando, setEjecutando] = useState(false);
  const [resultado, setResultado] = useState<Resultado>(null);
  const [guardado, setGuardado] = useState(true);

  function cambiar(codigo: string) {
    setGuardado(almacen.guardar({ codigo }));
  }

  async function ejecutar() {
    if (ejecutando) return;
    setEjecutando(true);
    setResultado(null);
    const respuesta = await ejecutarPython(borrador.codigo, { aislado: true });
    setResultado(respuesta);
    setEjecutando(false);
  }

  function descargar() {
    const url = URL.createObjectURL(
      new Blob([borrador.codigo], { type: "text/x-python;charset=utf-8" }),
    );
    const enlace = document.createElement("a");
    enlace.href = url;
    enlace.download = "sandbox.py";
    document.body.appendChild(enlace);
    enlace.click();
    enlace.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  return (
    <div data-sandbox-python>
      <div className="overflow-hidden rounded-xl border border-borde bg-superficie">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-borde p-4">
          <div>
            <h2 className="text-sm font-semibold">Tu programa</h2>
            <p className="mt-1 text-xs text-texto-tenue">
              El borrador se guarda únicamente en este navegador.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={descargar} className={boton}>
              <Download size={15} aria-hidden="true" />
              Descargar .py
            </button>
            <button
              type="button"
              onClick={ejecutar}
              disabled={ejecutando}
              className="inline-flex items-center gap-2 rounded-lg bg-rojo px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-rojo-hover disabled:cursor-wait disabled:opacity-60"
            >
              <Play
                size={15}
                aria-hidden="true"
                className={ejecutando ? "animate-pulse" : ""}
              />
              {ejecutando
                ? preparacion === "listo"
                  ? "Ejecutando…"
                  : "Cargando Python…"
                : "Ejecutar"}
            </button>
          </div>
        </div>

        <div className="grid min-w-0 gap-5 p-4 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
          <div className="min-w-0">
            <label
              htmlFor={`${id}-codigo`}
              className="mb-2 block text-xs font-medium text-texto-suave"
            >
              Código Python
            </label>
            <textarea
              id={`${id}-codigo`}
              value={borrador.codigo}
              onChange={(evento) => cambiar(evento.target.value)}
              disabled={ejecutando}
              maxLength={50_000}
              rows={20}
              spellCheck={false}
              autoCapitalize="off"
              autoCorrect="off"
              className="min-h-96 w-full resize-y whitespace-pre rounded-lg border border-borde-fuerte bg-fondo p-4 font-mono text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-rojo-acento disabled:opacity-60"
            />
            <button
              type="button"
              disabled={ejecutando}
              onClick={() => {
                cambiar(PROGRAMA_INICIAL_PYTHON);
                setResultado(null);
              }}
              className="mt-2 inline-flex items-center gap-1.5 text-xs text-texto-suave transition-colors hover:text-rojo-acento disabled:opacity-50"
            >
              <RotateCcw size={13} aria-hidden="true" />
              Restaurar ejemplo inicial
            </button>
          </div>

          <div className="min-w-0">
            <h2 className="mb-2 text-xs font-medium text-texto-suave">Salida</h2>
            <div
              role="status"
              aria-live="polite"
              data-salida-sandbox-python
              className="min-h-64 rounded-lg border border-borde bg-fondo p-4"
            >
              {ejecutando ? (
                <p className="text-sm text-texto-suave">
                  {preparacion === "listo"
                    ? "Ejecutando el programa…"
                    : "Preparando Python en el navegador…"}
                </p>
              ) : resultado ? (
                <>
                  <p
                    className={`mb-3 flex items-center gap-1.5 text-xs font-semibold ${
                      resultado.error ? "text-rojo-acento" : "text-exito"
                    }`}
                  >
                    {resultado.error && (
                      <TriangleAlert size={13} aria-hidden="true" />
                    )}
                    {resultado.error
                      ? "No se completó la ejecución"
                      : "Ejecución completada"}
                  </p>
                  <pre className="max-h-[32rem] overflow-auto whitespace-pre-wrap break-words font-mono text-sm leading-relaxed">
                    {resultado.salida ||
                      "El programa terminó sin imprimir salida."}
                  </pre>
                </>
              ) : (
                <p className="text-sm leading-relaxed text-texto-tenue">
                  La salida real de Python aparecerá aquí. El código se ejecuta
                  en esta pestaña mediante WebAssembly.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {!guardado && (
        <p role="alert" className="mt-3 text-sm text-rojo-acento">
          No pudimos guardar el borrador. Descarga el archivo para conservarlo.
        </p>
      )}
    </div>
  );
}
