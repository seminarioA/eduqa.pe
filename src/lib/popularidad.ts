import "server-only";

import { cache } from "react";
import { clienteServidor } from "@/lib/supabase/servidor";

/**
 * Matrículas únicas por curso.
 *
 * Sale de una vista que solo expone el recuento: quién se matriculó en qué no
 * se puede consultar desde aquí.
 */
export const popularidad = cache(async (): Promise<Map<string, number>> => {
  const supabase = await clienteServidor();
  const { data } = await supabase.from("v_popularidad").select("curso_slug, matriculas");
  return new Map((data ?? []).map((f) => [f.curso_slug, f.matriculas]));
});

/**
 * Ante un empate se conserva el orden del catálogo. El número mostrado en
 * cada tarjeta es el recuento real, incluso cuando dos cursos comparten puesto.
 */
export function ordenarPorPopularidad<T extends { slug: string }>(
  cursos: T[],
  cuentas: Map<string, number>,
  cuantos = 3,
): T[] {
  if (cuentas.size === 0) return [];
  return cursos
    .map((curso, posicion) => ({ curso, posicion, n: cuentas.get(curso.slug) ?? 0 }))
    .sort((a, b) => b.n - a.n || a.posicion - b.posicion)
    .slice(0, cuantos)
    .map((x) => x.curso);
}

/** Una ruta recibe la suma de matrículas de sus cursos visibles. */
export function ordenarRutasPorPopularidad<T extends { cursos: { slug: string }[] }>(
  rutas: T[],
  cuentas: Map<string, number>,
  cuantos = 3,
): T[] {
  if (cuentas.size === 0) return [];
  return rutas
    .filter((ruta) => ruta.cursos.length > 0)
    .map((ruta, posicion) => ({
      ruta,
      posicion,
      n: ruta.cursos.reduce((total, curso) => total + (cuentas.get(curso.slug) ?? 0), 0),
    }))
    .sort((a, b) => b.n - a.n || a.posicion - b.posicion)
    .slice(0, cuantos)
    .map((x) => x.ruta);
}
