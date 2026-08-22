import "server-only";

import { cache } from "react";
import { clienteServidor } from "@/lib/supabase/servidor";

/**
 * Matrículas por curso.
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
 * Los cursos con más matrículas, siempre que exista un orden real.
 *
 * Con todos los cursos empatados no hay nada que ordenar, y presentar cuatro
 * empatados como «los más populares» sería inventar un ranking. En ese caso
 * devuelve una lista vacía y la sección no se dibuja.
 */
export function ordenarPorPopularidad<T extends { slug: string }>(
  cursos: T[],
  cuentas: Map<string, number>,
  cuantos = 3,
): T[] {
  const conMatriculas = cursos
    .map((c) => ({ curso: c, n: cuentas.get(c.slug) ?? 0 }))
    .filter((x) => x.n > 0)
    .sort((a, b) => b.n - a.n);

  if (conMatriculas.length < 2) return [];
  // Si el primero no supera al último, están todos empatados.
  if (conMatriculas[0].n === conMatriculas[conMatriculas.length - 1].n) return [];

  return conMatriculas.slice(0, cuantos).map((x) => x.curso);
}
