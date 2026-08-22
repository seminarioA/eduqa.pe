"use client";

import { useId } from "react";
import type { RegionVenn } from "@/lib/curso-tipos";

/** Qué se está mostrando, en palabras. Va al lector de pantalla y al título. */
const DESCRIPCION: Record<RegionVenn, (a: string, b: string) => string> = {
  interseccion: (a, b) => `lo que está a la vez en ${a} y en ${b}`,
  izquierda: (a) => `todo ${a}`,
  derecha: (_a, b) => `todo ${b}`,
  union: (a, b) => `todo ${a} junto con todo ${b}`,
  "solo-izquierda": (a, b) => `lo que está en ${a} y no en ${b}`,
  "solo-derecha": (a, b) => `lo que está en ${b} y no en ${a}`,
  "diferencia-simetrica": (a, b) => `lo que está en ${a} o en ${b}, pero no en ambos`,
  "complemento-interseccion": (a, b) => `todo menos lo que está a la vez en ${a} y en ${b}`,
  "complemento-union": (a, b) => `todo lo que no está ni en ${a} ni en ${b}`,
  ninguna: (a, b) => `${a} y ${b}, sin resaltar nada`,
};

/**
 * Diagrama de Venn de dos conjuntos.
 *
 * Los colores salen de los tokens del tema, así que el diagrama sigue al modo
 * claro, al oscuro y al monocromático sin tener una variante por cada uno.
 *
 * El relleno se compone con máscaras y no con formas recortadas a mano: así
 * «lo que está en A pero no en B» es literalmente el círculo A menos el
 * círculo B, y no un trazado aproximado que se desalinea al cambiar el tamaño.
 */
export function Venn({
  izquierda,
  derecha,
  resalta,
  pie,
}: {
  izquierda: string;
  derecha: string;
  resalta: RegionVenn;
  pie?: string;
}) {
  const id = useId().replace(/:/g, "");
  const A = { cx: 98, cy: 78, r: 58 };
  const B = { cx: 158, cy: 78, r: 58 };
  const soloA = `m${id}-a`;
  const soloB = `m${id}-b`;
  const dentroDeA = `m${id}-i`;
  const fueraInterseccion = `m${id}-ci`;
  const fueraUnion = `m${id}-cu`;

  // Un complemento solo significa algo si se ve respecto de qué. El marco es
  // el conjunto universal: sin él, «todo lo que no está en a» no tiene borde
  // y el relleno se leería como un fondo.
  const complementa = resalta === "complemento-interseccion" || resalta === "complemento-union";
  const U = { x: 12, y: 10, ancho: 232, alto: 132 };

  const relleno = "fill-rojo";
  const descripcion = DESCRIPCION[resalta](izquierda, derecha);

  return (
    <figure className="my-6">
      <svg
        viewBox="0 0 256 168"
        role="img"
        aria-label={`Diagrama de conjuntos: ${descripcion}`}
        className="mx-auto w-full max-w-md"
      >
        <defs>
          <mask id={soloA}>
            <rect width="256" height="168" fill="black" />
            <circle cx={A.cx} cy={A.cy} r={A.r} fill="white" />
            <circle cx={B.cx} cy={B.cy} r={B.r} fill="black" />
          </mask>
          <mask id={soloB}>
            <rect width="256" height="168" fill="black" />
            <circle cx={B.cx} cy={B.cy} r={B.r} fill="white" />
            <circle cx={A.cx} cy={A.cy} r={A.r} fill="black" />
          </mask>
          <mask id={dentroDeA}>
            <rect width="256" height="168" fill="black" />
            <circle cx={A.cx} cy={A.cy} r={A.r} fill="white" />
          </mask>
          <mask id={fueraInterseccion}>
            <rect width="256" height="168" fill="white" />
            <circle cx={B.cx} cy={B.cy} r={B.r} mask={`url(#${dentroDeA})`} fill="black" />
          </mask>
          <mask id={fueraUnion}>
            <rect width="256" height="168" fill="white" />
            <circle cx={A.cx} cy={A.cy} r={A.r} fill="black" />
            <circle cx={B.cx} cy={B.cy} r={B.r} fill="black" />
          </mask>
        </defs>

        {complementa && (
          <rect
            x={U.x}
            y={U.y}
            width={U.ancho}
            height={U.alto}
            rx="4"
            mask={`url(#${resalta === "complemento-union" ? fueraUnion : fueraInterseccion})`}
            className={relleno}
          />
        )}

        {(resalta === "izquierda" || resalta === "union") && (
          <circle cx={A.cx} cy={A.cy} r={A.r} className={relleno} />
        )}
        {(resalta === "derecha" || resalta === "union") && (
          <circle cx={B.cx} cy={B.cy} r={B.r} className={relleno} />
        )}
        {(resalta === "solo-izquierda" || resalta === "diferencia-simetrica") && (
          <circle cx={A.cx} cy={A.cy} r={A.r} mask={`url(#${soloA})`} className={relleno} />
        )}
        {(resalta === "solo-derecha" || resalta === "diferencia-simetrica") && (
          <circle cx={B.cx} cy={B.cy} r={B.r} mask={`url(#${soloB})`} className={relleno} />
        )}
        {resalta === "interseccion" && (
          <circle cx={B.cx} cy={B.cy} r={B.r} mask={`url(#${dentroDeA})`} className={relleno} />
        )}

        {complementa && (
          <rect
            x={U.x}
            y={U.y}
            width={U.ancho}
            height={U.alto}
            rx="4"
            fill="none"
            strokeWidth="1.5"
            className="stroke-borde-fuerte"
          />
        )}

        {/* Los bordes van encima del relleno para que sigan leyéndose. */}
        <circle
          cx={A.cx}
          cy={A.cy}
          r={A.r}
          fill="none"
          strokeWidth="1.5"
          className="stroke-borde-fuerte"
        />
        <circle
          cx={B.cx}
          cy={B.cy}
          r={B.r}
          fill="none"
          strokeWidth="1.5"
          className="stroke-borde-fuerte"
        />

        <text x={A.cx - 34} y={158} textAnchor="middle" className="fill-texto-suave text-[13px]">
          {izquierda}
        </text>
        <text x={B.cx + 34} y={158} textAnchor="middle" className="fill-texto-suave text-[13px]">
          {derecha}
        </text>
      </svg>

      {pie && (
        <figcaption className="mt-2 text-center text-xs leading-relaxed text-texto-suave">
          {pie}
        </figcaption>
      )}
    </figure>
  );
}
