"use client";

import { useEffect, useMemo, useState } from "react";

const CARACTERES = "ABCDEFGHIJKLMNOPQRSTUVWXYZÁÉÍÓÚÑ0123456789";
const INTERVALO_MS = 45;
const DURACION_MS = 1450;

type TituloSplitFlapProps = {
  texto: string;
  className?: string;
};

type EstadoAnimacion = {
  texto: string;
  resueltas: number;
  animando: boolean;
};

function contarCaracteresAnimables(texto: string) {
  return Array.from(texto).filter((caracter) => !/\s/.test(caracter)).length;
}

function generarFotograma(texto: string, resueltas: number) {
  let posicion = 0;

  return Array.from(texto)
    .map((caracter) => {
      if (/\s/.test(caracter)) {
        return caracter;
      }

      const indice = posicion;
      posicion += 1;

      if (indice < resueltas) {
        return caracter;
      }

      return CARACTERES[Math.floor(Math.random() * CARACTERES.length)];
    })
    .join("");
}

export function TituloSplitFlap({
  texto,
  className = "",
}: TituloSplitFlapProps) {
  const totalCaracteres = useMemo(
    () => contarCaracteresAnimables(texto),
    [texto],
  );

  const [estado, setEstado] = useState<EstadoAnimacion>({
    texto,
    resueltas: totalCaracteres,
    animando: false,
  });

  useEffect(() => {
    const reducirMovimiento = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );

    if (reducirMovimiento.matches || totalCaracteres === 0) {
      setEstado({
        texto,
        resueltas: totalCaracteres,
        animando: false,
      });
      return;
    }

    let fotograma = 0;
    const totalFotogramas = Math.max(
      1,
      Math.round(DURACION_MS / INTERVALO_MS),
    );

    setEstado({
      texto: generarFotograma(texto, 0),
      resueltas: 0,
      animando: true,
    });

    const intervalo = window.setInterval(() => {
      fotograma += 1;
      const progreso = Math.min(fotograma / totalFotogramas, 1);
      const resueltas = Math.min(
        totalCaracteres,
        Math.floor(totalCaracteres * progreso),
      );

      if (progreso >= 1) {
        window.clearInterval(intervalo);
        setEstado({
          texto,
          resueltas: totalCaracteres,
          animando: false,
        });
        return;
      }

      setEstado({
        texto: generarFotograma(texto, resueltas),
        resueltas,
        animando: true,
      });
    }, INTERVALO_MS);

    return () => window.clearInterval(intervalo);
  }, [texto, totalCaracteres]);

  let posicionAnimable = 0;

  return (
    <h1 aria-label={texto} className={className}>
      <span aria-hidden="true">
        {estado.texto.split(/(\s+)/).map((segmento, indiceSegmento) => {
          if (/^\s+$/.test(segmento)) {
            return <span key={`espacio-${indiceSegmento}`}>{segmento}</span>;
          }

          return (
            <span
              key={`palabra-${indiceSegmento}`}
              className="inline-block whitespace-nowrap"
            >
              {Array.from(segmento).map((caracter, indiceCaracter) => {
                const posicion = posicionAnimable;
                posicionAnimable += 1;

                const pendiente =
                  estado.animando && posicion >= estado.resueltas;

                return (
                  <span
                    key={`${indiceSegmento}-${indiceCaracter}`}
                    className={
                      pendiente
                        ? "relative inline-block overflow-hidden rounded-[0.08em] bg-black/25 px-[0.02em] shadow-[inset_0_0.035em_0_rgba(255,255,255,0.18),inset_0_-0.035em_0_rgba(0,0,0,0.35)] transition-transform duration-75 [transform:perspective(5em)_rotateX(-10deg)]"
                        : undefined
                    }
                  >
                    {caracter}
                    {pendiente ? (
                      <span
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-x-0 top-1/2 h-px bg-white/15"
                      />
                    ) : null}
                  </span>
                );
              })}
            </span>
          );
        })}
      </span>
    </h1>
  );
}
