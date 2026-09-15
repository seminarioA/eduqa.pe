"use client";

import { useEffect, useState } from "react";
import {
  Circle,
  Diamond,
  RotateCcw,
  Square,
  Triangle,
} from "lucide-react";
import {
  preguntasQuizPython,
  type PreguntaQuizPython,
} from "@/content/python-quiz";

const FORMAS = [Triangle, Diamond, Circle, Square] as const;

function TarjetaRespuesta({
  pregunta,
  indice,
  seleccion,
  onElegir,
}: {
  pregunta: PreguntaQuizPython;
  indice: number;
  seleccion: number | null;
  onElegir: (indice: number) => void;
}) {
  const Icono = FORMAS[indice];
  const respondida = seleccion !== null;
  const correcta = indice === pregunta.correcta;
  const elegida = indice === seleccion;
  const resultado = respondida
    ? correcta
      ? "Correcta"
      : elegida
        ? "Tu elección"
        : undefined
    : undefined;

  return (
    <button
      type="button"
      disabled={respondida}
      onClick={() => onElegir(indice)}
      aria-label={`${indice + 1}. ${pregunta.opciones[indice]}${resultado ? `. ${resultado}` : ""}`}
      className={`group relative flex min-h-28 items-center rounded-xl border-2 bg-fondo p-4 text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rojo-acento focus-visible:ring-offset-2 disabled:cursor-default ${
        respondida
          ? correcta
            ? "border-texto bg-superficie"
            : elegida
              ? "border-rojo-acento bg-rojo-tenue"
              : "border-borde opacity-55"
          : "border-borde-fuerte hover:border-rojo-acento hover:bg-rojo-tenue"
      }`}
    >
      <span className="flex w-full items-center gap-4">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-rojo-tenue text-rojo-acento">
          <Icono size={19} strokeWidth={1.7} aria-hidden="true" />
        </span>
        <span className="flex-1 text-sm font-medium leading-relaxed sm:text-base">
          {pregunta.opciones[indice]}
        </span>
        {resultado && (
          <span
            className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
              correcta
                ? "bg-texto text-fondo"
                : "bg-rojo text-white"
            }`}
          >
            {resultado}
          </span>
        )}
      </span>
    </button>
  );
}

export function QuizPython() {
  const [indice, setIndice] = useState(0);
  const [seleccion, setSeleccion] = useState<number | null>(null);
  const [aciertos, setAciertos] = useState(0);
  const [terminado, setTerminado] = useState(false);
  const pregunta = preguntasQuizPython[indice];

  function elegir(opcion: number) {
    if (seleccion !== null) return;
    setSeleccion(opcion);
    if (opcion === pregunta.correcta) setAciertos((valor) => valor + 1);
  }

  function continuar() {
    if (seleccion === null) return;
    if (indice === preguntasQuizPython.length - 1) {
      setTerminado(true);
      return;
    }
    setIndice((valor) => valor + 1);
    setSeleccion(null);
  }

  function reiniciar() {
    setIndice(0);
    setSeleccion(null);
    setAciertos(0);
    setTerminado(false);
  }

  useEffect(() => {
    function avanzarConEnter(evento: KeyboardEvent) {
      if (evento.key !== "Enter" || seleccion === null || terminado) return;
      evento.preventDefault();
      if (indice === preguntasQuizPython.length - 1) {
        setTerminado(true);
      } else {
        setIndice((valor) => valor + 1);
        setSeleccion(null);
      }
    }
    window.addEventListener("keydown", avanzarConEnter);
    return () => window.removeEventListener("keydown", avanzarConEnter);
  }, [indice, seleccion, terminado]);

  if (terminado) {
    const porcentaje = Math.round(
      (aciertos / preguntasQuizPython.length) * 100,
    );
    return (
      <section
        data-quiz-python-completado
        className="rounded-2xl border border-borde bg-superficie px-6 py-12 text-center sm:px-10"
      >
        <p className="font-mono text-sm text-rojo-acento">Quiz completado</p>
        <h2 className="mt-3 text-4xl font-semibold tracking-tight">
          {aciertos} de {preguntasQuizPython.length}
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-texto-suave">
          Obtuviste {porcentaje} %. El resultado sirve para decidir qué sesión
          conviene repasar antes de continuar.
        </p>
        <button
          type="button"
          onClick={reiniciar}
          className="mt-7 inline-flex items-center gap-2 rounded-lg bg-rojo px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-rojo-hover"
        >
          <RotateCcw size={16} aria-hidden="true" />
          Repetir el quiz
        </button>
      </section>
    );
  }

  const acerto = seleccion === pregunta.correcta;

  return (
    <section data-quiz-python aria-labelledby="pregunta-quiz-python">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="font-mono text-xs text-rojo-acento">
            Sesión {String(pregunta.sesion).padStart(2, "0")} · {pregunta.tema}
          </p>
          <p className="mt-1 text-sm text-texto-suave">
            Pregunta {indice + 1} de {preguntasQuizPython.length}
          </p>
        </div>
        <p className="text-sm font-medium" aria-live="polite">
          {aciertos} {aciertos === 1 ? "acierto" : "aciertos"}
        </p>
      </div>

      <div
        className="mt-3 h-2 overflow-hidden rounded-full bg-borde"
        role="progressbar"
        aria-label="Progreso del quiz"
        aria-valuemin={1}
        aria-valuemax={preguntasQuizPython.length}
        aria-valuenow={indice + 1}
      >
        <div
          className="h-full rounded-full bg-rojo transition-[width]"
          style={{ width: `${((indice + 1) / preguntasQuizPython.length) * 100}%` }}
        />
      </div>

      <h2
        id="pregunta-quiz-python"
        className="mt-8 text-2xl font-semibold leading-tight tracking-tight sm:text-3xl"
      >
        {pregunta.pregunta}
      </h2>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {pregunta.opciones.map((_, opcion) => (
          <TarjetaRespuesta
            key={opcion}
            pregunta={pregunta}
            indice={opcion}
            seleccion={seleccion}
            onElegir={elegir}
          />
        ))}
      </div>

      {seleccion !== null && (
        <div
          role="status"
          aria-live="polite"
          className={`mt-6 rounded-xl border p-6 text-center ${
            acerto
              ? "border-borde-fuerte bg-superficie"
              : "border-rojo-acento/40 bg-rojo-tenue"
          }`}
        >
          <p
            className={`text-lg font-semibold ${
              acerto ? "text-texto" : "text-rojo-acento"
            }`}
          >
            {acerto ? "Bien." : "Aún no."}
          </p>
          <p className="mx-auto mt-2 max-w-2xl text-sm leading-relaxed text-texto-suave">
            {pregunta.explicacion}
          </p>
          <button
            type="button"
            onClick={continuar}
            aria-keyshortcuts="Enter"
            className="mt-5 inline-flex items-center justify-center rounded-lg bg-rojo px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-rojo-hover"
          >
            {indice === preguntasQuizPython.length - 1
              ? "Ver resultado"
              : "Siguiente pregunta"}
          </button>
          <p className="mt-2 text-xs text-texto-tenue">
            También puedes continuar con Enter.
          </p>
        </div>
      )}
    </section>
  );
}
