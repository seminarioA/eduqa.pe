"use client";

import { useState, useSyncExternalStore } from "react";
import * as Collapsible from "@radix-ui/react-collapsible";
import { Check, ChevronDown, Lightbulb, Play, X } from "lucide-react";
import { ejecutarPython, estadoPython, suscribirsePython } from "@/lib/pyodide";
import { HUECO, type Ejercicio } from "@/content/python-ejercicios";

/**
 * Ejercicios de completado, opcionales y plegados de entrada.
 *
 * Van cerrados porque no son parte del temario: quien solo quiere leer la
 * sesión no debería tener que desplazarse por diez ejercicios para llegar al
 * final.
 *
 * La corrección compara la salida que produce Python, no el texto que escribió
 * el alumno. Así vale cualquier expresión que dé el resultado correcto y no
 * una única forma de escribirla, que es lo que pasaría comparando cadenas.
 */
export function Ejercicios({ ejercicios }: { ejercicios: Ejercicio[] }) {
  const [resueltos, setResueltos] = useState<Set<string>>(new Set());

  return (
    <Collapsible.Root className="group/ej mt-14 rounded-xl border border-borde bg-superficie">
      <Collapsible.Trigger asChild>
        <button
          type="button"
          className="flex w-full items-center gap-3 px-5 py-4 text-left"
        >
          <ChevronDown
            size={18}
            aria-hidden="true"
            className="shrink-0 text-texto-tenue transition-transform group-data-[state=closed]/ej:-rotate-90"
          />
          <span className="flex-1">
            <span className="block font-medium">Ejercicios de completado</span>
            <span className="mt-0.5 block text-sm text-texto-suave">
              Opcionales. Rellena el hueco y comprueba el resultado en tu propio
              navegador.
            </span>
          </span>
          <span className="shrink-0 text-xs text-texto-tenue">
            {resueltos.size} de {ejercicios.length}
          </span>
        </button>
      </Collapsible.Trigger>

      <Collapsible.Content className="animar-colapsable overflow-hidden">
        <ol className="space-y-4 border-t border-borde px-5 py-5">
          {ejercicios.map((e, i) => (
            <Tarjeta
              key={e.id}
              numero={i + 1}
              ejercicio={e}
              onResuelto={() => setResueltos((p) => new Set(p).add(e.id))}
            />
          ))}
        </ol>
      </Collapsible.Content>
    </Collapsible.Root>
  );
}

type Resultado = { acierto: boolean; salida: string } | null;

function Tarjeta({
  numero,
  ejercicio,
  onResuelto,
}: {
  numero: number;
  ejercicio: Ejercicio;
  onResuelto: () => void;
}) {
  const [respuesta, setRespuesta] = useState("");
  const [resultado, setResultado] = useState<Resultado>(null);
  const [comprobando, setComprobando] = useState(false);
  const [pista, setPista] = useState(false);

  const [antes, despues] = ejercicio.plantilla.split(HUECO);
  const preparacion = useSyncExternalStore(
    suscribirsePython,
    estadoPython,
    () => "sin-empezar" as const,
  );

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
      { aislado: true },
    );
    setComprobando(false);

    const acierto = !error && salida.trim() === ejercicio.esperado.trim();
    setResultado({ acierto, salida });
    if (acierto) onResuelto();
  };

  return (
    <li className="rounded-lg border border-borde bg-fondo p-4">
      <p className="text-sm leading-relaxed">
        <span className="mr-1.5 font-mono text-xs text-texto-tenue">
          {String(numero).padStart(2, "0")}
        </span>
        {ejercicio.enunciado}
      </p>

      {/* El hueco es un campo dentro del propio código, no un formulario
          aparte: se ve exactamente dónde va lo que se escribe. */}
      <pre className="mt-3 overflow-x-auto whitespace-pre-wrap rounded-md bg-superficie p-3 font-mono text-[0.8125rem] leading-relaxed">
        {antes}
        <input
          value={respuesta}
          onChange={(ev) => setRespuesta(ev.target.value)}
          onKeyDown={(ev) => {
            if (ev.key === "Enter") {
              ev.preventDefault();
              comprobar();
            }
          }}
          aria-label={`Completa el ejercicio ${numero}`}
          spellCheck={false}
          autoCapitalize="off"
          autoComplete="off"
          size={Math.max(respuesta.length + 1, 5)}
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
          <Play size={12} aria-hidden="true" className={comprobando ? "animate-pulse" : ""} />
          {comprobando
            ? preparacion === "listo"
              ? "Comprobando…"
              : "Cargando el curso…"
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

      {/* Al fallar se enseña lo que salió y lo que se esperaba: sin eso, el
          error solo dice que está mal y no dónde. */}
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
    </li>
  );
}
