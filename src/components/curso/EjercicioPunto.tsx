"use client";

import { useState, useSyncExternalStore } from "react";
import * as Collapsible from "@radix-ui/react-collapsible";
import { Check, ChevronDown, Lightbulb, Play, X } from "lucide-react";
import { ejecutarPython, estadoPython, suscribirsePython } from "@/lib/pyodide";
import type { Ejercicio } from "@/lib/cursos";

const HUECO = "___";

/**
 * Ejercicio de completado al pie de un punto de la sesión.
 *
 * Va plegado: el ejercicio es opcional y quien está leyendo de corrido no
 * debería tropezar con un formulario entre un apartado y el siguiente.
 *
 * La corrección compara la salida que produce el intérprete, no el texto
 * escrito, así que vale cualquier expresión que dé el resultado correcto y no
 * una única forma de escribirla.
 */
export function EjercicioPunto({
  ejercicio,
  paquetes,
  preludio,
}: {
  ejercicio: Ejercicio;
  paquetes?: string[];
  preludio?: string;
}) {
  const [respuesta, setRespuesta] = useState("");
  const [resultado, setResultado] = useState<{
    acierto: boolean;
    salida: string;
  } | null>(null);
  const [comprobando, setComprobando] = useState(false);
  const [pista, setPista] = useState(false);

  const [antes, despues] = ejercicio.plantilla.split(HUECO);

  const comprobar = async () => {
    if (!respuesta.trim()) return;
    setComprobando(true);
    setResultado(null);

    const { salida, error } = await ejecutarPython(
      // La respuesta se inserta con una función y no como cadena: en el
      // texto de reemplazo de replace(), `$$` significa un `$` literal y
      // `$&` el trozo encontrado, así que una respuesta con `$` se
      // deformaba antes de llegar al intérprete.
      ejercicio.plantilla.replace(HUECO, () => respuesta),
      // Aislado: lo que definió un ejercicio no debe resolverle el siguiente.
      { aislado: true, paquetes, preludio },
    );

    setComprobando(false);
    setResultado({
      acierto: !error && salida.trim() === ejercicio.esperado.trim(),
      salida,
    });
  };

  const preparacion = useSyncExternalStore(
    suscribirsePython,
    estadoPython,
    () => "sin-empezar" as const,
  );
  const preparando = comprobando && preparacion !== "listo";

  return (
    <Collapsible.Root className="group/ejp my-6 rounded-lg border border-borde bg-superficie">
      <Collapsible.Trigger asChild>
        <button
          type="button"
          className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm transition-colors hover:text-rojo-acento"
        >
          <ChevronDown
            size={15}
            aria-hidden="true"
            className="shrink-0 text-texto-tenue transition-transform group-data-[state=closed]/ejp:-rotate-90"
          />
          <span className="font-medium">Ejercicio</span>
          <span className="text-xs text-texto-tenue">opcional</span>
          {resultado?.acierto && (
            <Check size={14} className="ml-auto text-exito" aria-hidden="true" />
          )}
        </button>
      </Collapsible.Trigger>

      <Collapsible.Content className="animar-colapsable overflow-hidden">
        <div className="border-t border-borde px-4 py-4">
          <p className="text-sm leading-relaxed text-texto-suave">
            {ejercicio.enunciado}
          </p>

          {/* El hueco es un campo dentro del propio código: se ve exactamente
              dónde va lo que se escribe. */}
          <pre className="mt-3 overflow-x-auto whitespace-pre-wrap rounded-md bg-fondo p-3 font-mono text-[0.8125rem] leading-relaxed">
            {antes}
            <input
              value={respuesta}
              onChange={(e) => setRespuesta(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  comprobar();
                }
              }}
              aria-label="Completa el hueco"
              spellCheck={false}
              autoCapitalize="off"
              autoComplete="off"
              size={Math.max(respuesta.length + 1, 6)}
              // La barra lleva el rojo de marca, el mismo en los dos temas. Lo
              // que se escribe va en el color normal del código: a 13 px, el
              // rojo de marca sobre fondo oscuro se queda en 3.3:1 y no se lee.
              className="mx-0.5 inline-block border-b-2 border-rojo bg-transparent px-1 text-center font-mono text-[0.8125rem] text-texto focus:outline-none focus:border-b-[3px]"
            />
            {despues}
          </pre>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={comprobar}
              disabled={comprobando || !respuesta.trim()}
              className="flex items-center gap-1.5 rounded-md border border-borde-fuerte bg-fondo px-2.5 py-1 text-xs font-medium text-texto-suave transition-colors hover:border-rojo-acento hover:text-rojo-acento disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Play
                size={12}
                aria-hidden="true"
                className={comprobando ? "animate-pulse" : ""}
              />
              {preparando
                ? "Cargando el curso…"
                : comprobando
                  ? "Comprobando…"
                  : "Comprobar"}
            </button>

            <button
              type="button"
              onClick={() => setPista((v) => !v)}
              aria-expanded={pista}
              className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium text-texto-tenue transition-colors hover:text-rojo-acento"
            >
              <Lightbulb size={12} aria-hidden="true" />
              {pista ? "Ocultar la pista" : "Ver una pista"}
            </button>

            {resultado && (
              <span
                role="status"
                className={`flex items-center gap-1.5 text-xs font-medium ${
                  resultado.acierto ? "text-exito" : "text-rojo-acento"
                }`}
              >
                {resultado.acierto ? (
                  <>
                    <Check size={13} aria-hidden="true" />
                    Correcto
                  </>
                ) : (
                  <>
                    <X size={13} aria-hidden="true" />
                    Todavía no
                  </>
                )}
              </span>
            )}
          </div>

          {pista && (
            <p className="mt-2.5 text-xs leading-relaxed text-texto-suave">
              {ejercicio.pista}
            </p>
          )}

          {/* Al fallar se enseña qué salió y qué se esperaba: sin eso, el aviso
              solo dice que está mal y no dónde. */}
          {resultado && !resultado.acierto && (
            <dl className="mt-2.5 space-y-1 font-mono text-[0.72rem] leading-relaxed">
              <div className="flex gap-2">
                <dt className="shrink-0 text-texto-tenue">Salió</dt>
                <dd className="whitespace-pre-wrap text-texto-suave">
                  {resultado.salida || "nada"}
                </dd>
              </div>
              <div className="flex gap-2">
                <dt className="shrink-0 text-texto-tenue">Se esperaba</dt>
                <dd className="whitespace-pre-wrap text-texto-suave">
                  {ejercicio.esperado}
                </dd>
              </div>
            </dl>
          )}
        </div>
      </Collapsible.Content>
    </Collapsible.Root>
  );
}
