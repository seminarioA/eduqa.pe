import { cache } from "react";
import { clienteServidor } from "@/lib/supabase/servidor";
import { registrarError } from "@/lib/registro";

/**
 * Ranuras de la marca que se pueden personalizar.
 *
 * Cada una es un punto de la interfaz donde hoy va la llama:
 * sidebar (barra lateral), cabecera (logo sobre las migas), favicon
 * (pestaña del navegador) y cierre (pantalla de sesión completada).
 */
export const RANURAS_MARCA = [
  "sidebar",
  "cabecera",
  "favicon",
  "cierre",
] as const;

export type RanuraMarca = (typeof RANURAS_MARCA)[number];

export const ETIQUETAS_RANURA: Record<RanuraMarca, string> = {
  sidebar: "Llama de la barra lateral",
  cabecera: "Llama sobre las migas de pan",
  favicon: "Favicon (pestaña del navegador)",
  cierre: "Llama de curso completado",
};

/** Límite prudente para un SVG vectorial: si pesa más, algo va mal. */
export const PESO_MAXIMO_SVG = 200 * 1024;

export type MarcaActual = Partial<Record<RanuraMarca, string>>;

/**
 * SVGs vigentes por ranura.
 *
 * Se lee con la sesión de quien navega y RLS deja leer a cualquiera: la marca
 * se ve con o sin cuenta. `cache` deduplica dentro del mismo request, porque
 * la cabecera, la barra lateral y el favicon pueden pedirla a la vez.
 */
export const marcaActual = cache(async (): Promise<MarcaActual> => {
  const supabase = await clienteServidor();
  const { data, error } = await supabase
    .from("marca_recursos")
    .select("clave, svg");

  if (error) {
    registrarError("marca.leer", error);
    return {};
  }

  const marca: MarcaActual = {};
  for (const fila of data ?? []) {
    if (RANURAS_MARCA.includes(fila.clave)) {
      marca[fila.clave as RanuraMarca] = fila.svg;
    }
  }
  return marca;
});

/**
 * Validación mínima antes de guardar un SVG.
 *
 * No hay analizador completo: basta con exigir la etiqueta raíz y rechazar
 * lo que pueda ejecutar código al inyectarse. Quien sube es administrador,
 * pero la marca se pinta en el navegador de todos y un archivo descuidado
 * no debe convertirse en una puerta.
 */
export function validarSvg(texto: string): string | null {
  const limpio = texto.trim();
  if (!/<svg[\s>]/i.test(limpio)) {
    return "El archivo no parece un SVG.";
  }
  if (/<script/i.test(limpio)) {
    return "El SVG no puede contener scripts.";
  }
  if (/javascript:/i.test(limpio)) {
    return "El SVG contiene enlaces javascript:, que están prohibidos.";
  }
  if (/\son\w+\s*=/i.test(limpio)) {
    return "El SVG tiene manejadores de eventos (on…); quítalos y vuelve a intentar.";
  }
  return null;
}
