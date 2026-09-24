"use client";

import {
  type KeyboardEvent,
  type UIEvent,
  useId,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";
import {
  Download,
  FileCode2,
  Files,
  Play,
  RotateCcw,
  Search,
  Terminal,
  TriangleAlert,
} from "lucide-react";
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
  "inline-flex items-center justify-center gap-2 rounded-md border border-borde-fuerte bg-fondo px-3 py-1.5 text-xs font-medium text-texto-suave transition-colors hover:border-rojo-acento hover:text-rojo-acento disabled:cursor-wait disabled:opacity-50";

type Resultado = { salida: string; error: boolean } | null;

function posicionCursor(codigo: string, indice: number) {
  const antes = codigo.slice(0, indice);
  const lineas = antes.split("\n");
  return {
    linea: lineas.length,
    columna: (lineas.at(-1)?.length ?? 0) + 1,
  };
}

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
  const [scrollEditor, setScrollEditor] = useState(0);
  const [cursor, setCursor] = useState({ linea: 1, columna: 1 });

  const lineas = useMemo(
    () => Array.from({ length: borrador.codigo.split("\n").length }, (_, i) => i + 1),
    [borrador.codigo],
  );

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

  function manejarTecla(evento: KeyboardEvent<HTMLTextAreaElement>) {
    if ((evento.ctrlKey || evento.metaKey) && evento.key === "Enter") {
      evento.preventDefault();
      void ejecutar();
      return;
    }

    if (evento.key !== "Tab") return;

    evento.preventDefault();
    const editor = evento.currentTarget;
    const inicio = editor.selectionStart;
    const fin = editor.selectionEnd;
    const siguiente =
      borrador.codigo.slice(0, inicio) +
      "    " +
      borrador.codigo.slice(fin);

    cambiar(siguiente);
    requestAnimationFrame(() => {
      editor.selectionStart = inicio + 4;
      editor.selectionEnd = inicio + 4;
      setCursor(posicionCursor(siguiente, inicio + 4));
    });
  }

  function sincronizarScroll(evento: UIEvent<HTMLTextAreaElement>) {
    setScrollEditor(evento.currentTarget.scrollTop);
  }

  return (
    <div data-sandbox-python>
      <div className="overflow-hidden rounded-xl border border-borde bg-superficie shadow-sm">
        <div className="flex min-h-11 items-center justify-between gap-3 border-b border-borde bg-fondo px-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="hidden items-center gap-1.5 sm:flex" aria-hidden="true">
              <span className="size-2.5 rounded-full bg-rojo-acento/80" />
              <span className="size-2.5 rounded-full bg-texto-tenue/50" />
              <span className="size-2.5 rounded-full bg-texto-tenue/30" />
            </div>
            <p className="truncate font-mono text-xs text-texto-suave">
              sandbox.py <span className="text-texto-tenue">— eduqa.pe</span>
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <button type="button" onClick={descargar} className={boton}>
              <Download size={14} aria-hidden="true" />
              <span className="hidden sm:inline">Descargar .py</span>
            </button>
            <button
              type="button"
              onClick={ejecutar}
              disabled={ejecutando}
              aria-keyshortcuts="Control+Enter"
              className="inline-flex items-center gap-2 rounded-md bg-rojo px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-rojo-hover disabled:cursor-wait disabled:opacity-60"
            >
              <Play
                size={14}
                aria-hidden="true"
                className={ejecutando ? "animate-pulse" : ""}
              />
              {ejecutando
                ? preparacion === "listo"
                  ? "Ejecutando…"
                  : "Cargando Python…"
                : "Ejecutar"}
              <kbd className="hidden rounded border border-white/20 px-1.5 py-0.5 font-mono text-[10px] font-normal text-white/75 lg:inline">
                Ctrl+Enter
              </kbd>
            </button>
          </div>
        </div>

        <div className="grid min-h-[36rem] min-w-0 grid-cols-[2.75rem_minmax(0,1fr)] lg:grid-cols-[2.75rem_11rem_minmax(0,1fr)]">
          <aside
            className="flex flex-col items-center gap-1 border-r border-borde bg-fondo py-2"
            aria-label="Barra de actividad del editor"
          >
            <button
              type="button"
              className="grid size-9 place-items-center border-l-2 border-rojo-acento text-texto"
              aria-label="Explorador"
              title="Explorador"
            >
              <Files size={19} aria-hidden="true" />
            </button>
            <button
              type="button"
              className="grid size-9 place-items-center border-l-2 border-transparent text-texto-tenue transition-colors hover:text-texto"
              aria-label="Buscar"
              title="Buscar"
            >
              <Search size={18} aria-hidden="true" />
            </button>
            <button
              type="button"
              className="grid size-9 place-items-center border-l-2 border-transparent text-texto-tenue transition-colors hover:text-texto"
              aria-label="Terminal"
              title="Terminal"
            >
              <Terminal size={18} aria-hidden="true" />
            </button>
          </aside>

          <aside className="hidden min-w-0 border-r border-borde bg-superficie lg:block">
            <div className="flex h-9 items-center px-3 text-[10px] font-semibold uppercase tracking-wider text-texto-suave">
              Explorador
            </div>
            <div className="border-t border-borde py-1">
              <p className="px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-texto-tenue">
                Sandbox
              </p>
              <div className="flex items-center gap-2 bg-rojo-tenue px-3 py-1.5 text-xs text-texto">
                <FileCode2 size={14} className="shrink-0 text-rojo-acento" aria-hidden="true" />
                <span className="truncate">sandbox.py</span>
              </div>
            </div>
          </aside>

          <section className="flex min-w-0 flex-col bg-fondo">
            <div className="flex h-9 items-end border-b border-borde bg-superficie">
              <div className="flex h-full min-w-36 items-center gap-2 border-r border-borde border-t-2 border-t-rojo-acento bg-fondo px-3 text-xs">
                <FileCode2 size={13} className="text-rojo-acento" aria-hidden="true" />
                <span>sandbox.py</span>
              </div>
            </div>

            <div className="relative min-h-0 flex-1 overflow-hidden">
              <label htmlFor={\`\${id}-codigo\`} className="sr-only">
                Código Python
              </label>

              <div
                className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 overflow-hidden border-r border-borde bg-superficie/60 pt-4 text-right font-mono text-xs leading-6 text-texto-tenue"
                aria-hidden="true"
              >
                <div
                  className="pr-3"
                  style={{ transform: \`translateY(-\${scrollEditor}px)\` }}
                >
                  {lineas.map((linea) => (
                    <div key={linea}>{linea}</div>
                  ))}
                </div>
              </div>

              <textarea
                id={\`\${id}-codigo\`}
                value={borrador.codigo}
                onChange={(evento) => {
                  cambiar(evento.target.value);
                  setCursor(posicionCursor(evento.target.value, evento.target.selectionStart));
                }}
                onSelect={(evento) =>
                  setCursor(
                    posicionCursor(
                      evento.currentTarget.value,
                      evento.currentTarget.selectionStart,
                    ),
                  )
                }
                onScroll={sincronizarScroll}
                onKeyDown={manejarTecla}
                disabled={ejecutando}
                maxLength={50_000}
                spellCheck={false}
                autoCapitalize="off"
                autoCorrect="off"
                className="absolute inset-0 h-full min-h-[21rem] w-full resize-none overflow-auto whitespace-pre bg-transparent py-4 pl-16 pr-4 font-mono text-sm leading-6 text-texto caret-rojo-acento outline-none selection:bg-rojo-tenue disabled:opacity-60"
              />
            </div>

            <div className="border-t border-borde bg-superficie">
              <div className="flex h-9 items-center justify-between border-b border-borde px-3">
                <div className="flex h-full items-center gap-5">
                  <span className="flex h-full items-center border-b-2 border-rojo-acento text-[11px] font-semibold uppercase tracking-wide text-texto">
                    Terminal
                  </span>
                  <span className="text-[11px] uppercase tracking-wide text-texto-tenue">
                    Salida
                  </span>
                </div>
                <button
                  type="button"
                  disabled={ejecutando}
                  onClick={() => {
                    cambiar(PROGRAMA_INICIAL_PYTHON);
                    setResultado(null);
                    setCursor({ linea: 1, columna: 1 });
                  }}
                  className="inline-flex items-center gap-1.5 text-xs text-texto-suave transition-colors hover:text-rojo-acento disabled:opacity-50"
                >
                  <RotateCcw size={13} aria-hidden="true" />
                  Restaurar ejemplo
                </button>
              </div>

              <div
                role="status"
                aria-live="polite"
                data-salida-sandbox-python
                className="h-40 overflow-auto p-3 font-mono text-xs leading-5"
              >
                <p className="text-texto-tenue">
                  <span className="text-rojo-acento">$</span> python sandbox.py
                </p>

                {ejecutando ? (
                  <p className="mt-1 text-texto-suave">
                    {preparacion === "listo"
                      ? "Ejecutando el programa…"
                      : "Preparando Python en el navegador…"}
                  </p>
                ) : resultado ? (
                  <div className="mt-1">
                    {resultado.error && (
                      <p className="mb-1 flex items-center gap-1.5 text-rojo-acento">
                        <TriangleAlert size={13} aria-hidden="true" />
                        No se completó la ejecución
                      </p>
                    )}
                    <pre
                      className={
                        resultado.error
                          ? "whitespace-pre-wrap break-words text-rojo-acento"
                          : "whitespace-pre-wrap break-words text-texto"
                      }
                    >
                      {resultado.salida || "El programa terminó sin imprimir salida."}
                    </pre>
                  </div>
                ) : (
                  <p className="mt-1 text-texto-tenue">
                    Ejecuta el archivo para ver aquí la salida real de Python.
                  </p>
                )}
              </div>
            </div>

            <div className="flex min-h-6 flex-wrap items-center justify-between gap-x-4 gap-y-1 bg-rojo px-3 py-1 font-mono text-[10px] text-white">
              <div className="flex items-center gap-3">
                <span>Python 3 · WebAssembly</span>
                <span className="hidden sm:inline">
                  {guardado ? "Borrador guardado localmente" : "Sin guardar"}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span>Ln {cursor.linea}, Col {cursor.columna}</span>
                <span className="hidden sm:inline">Spaces: 4</span>
                <span className="hidden sm:inline">UTF-8</span>
                <span>LF</span>
              </div>
            </div>
          </section>
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
