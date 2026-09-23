import "server-only";

import { cache } from "react";
import { construirCurso } from "@/lib/curso-markdown";
import { cursos as cursosDelRepositorio } from "@/lib/cursos";
import type { Curso } from "@/lib/curso-tipos";
import { clienteServidor } from "@/lib/supabase/servidor";

type CatalogoBase = {
  cursos: Curso[];
  /** Slugs que existen en `cursos`, aunque su contenido no sea visible para esta sesión. */
  registrados: Set<string>;
};

/**
 * Catálogo de runtime.
 *
 * Supabase es la fuente de verdad para cualquier slug que exista en `cursos`.
 * El contenido empaquetado en el repositorio queda únicamente como respaldo de
 * cursos legacy que todavía no tengan una fila en la base. De esta manera:
 *
 * - publicar un curso nuevo consiste en escribir `cursos`,
 *   `curso_contenido` y `curso_sesiones`;
 * - editar contenido en Supabase se refleja en la siguiente petición;
 * - un curso registrado en la base nunca reaparece desde una copia local vieja
 *   si RLS oculta su contenido, se archiva o se retira.
 *
 * Si la consulta a Supabase falla por completo se conserva el catálogo local
 * como degradación controlada para no inutilizar los cursos legacy.
 */
export const obtenerCursos = cache(async (): Promise<Curso[]> => {
  const desdeLaBase = await cursosDeLaBase();
  if (!desdeLaBase) return cursosDelRepositorio;

  const porSlug = new Map<string, Curso>();

  // Solo entran respaldos que aún no están administrados por la base.
  for (const curso of cursosDelRepositorio) {
    if (!desdeLaBase.registrados.has(curso.slug)) {
      porSlug.set(curso.slug, curso);
    }
  }

  // Para todo slug administrado por Supabase manda su contenido de runtime.
  for (const curso of desdeLaBase.cursos) {
    porSlug.set(curso.slug, curso);
  }

  return [...porSlug.values()];
});

async function cursosDeLaBase(): Promise<CatalogoBase | null> {
  const supabase = await clienteServidor();

  const [
    { data: fichas, error: errorFichas },
    { data: archivos, error: errorArchivos },
    { data: indices, error: errorIndices },
  ] = await Promise.all([
    supabase.from("cursos").select("slug"),
    supabase.from("curso_contenido").select("curso_slug, archivo, contenido"),
    supabase.from("curso_sesiones").select("curso_slug, numero, titulo, slug"),
  ]);

  if (errorFichas || errorArchivos || errorIndices) {
    console.error("No se pudo leer el catálogo de cursos desde Supabase:", {
      fichas: errorFichas?.message,
      contenido: errorArchivos?.message,
      sesiones: errorIndices?.message,
    });
    return null;
  }

  const registrados = new Set((fichas ?? []).map((fila) => fila.slug));
  if (!archivos?.length) return { cursos: [], registrados };

  const porCurso = new Map<string, Map<string, string>>();
  for (const fila of archivos) {
    const mapa = porCurso.get(fila.curso_slug) ?? new Map<string, string>();
    mapa.set(fila.archivo, fila.contenido);
    porCurso.set(fila.curso_slug, mapa);
  }

  const indicePorCurso = new Map<string, { numero: number; titulo: string; slug: string }[]>();
  for (const fila of indices ?? []) {
    const lista = indicePorCurso.get(fila.curso_slug) ?? [];
    lista.push({ numero: fila.numero, titulo: fila.titulo, slug: fila.slug });
    indicePorCurso.set(fila.curso_slug, lista);
  }

  const cursos: Curso[] = [];
  for (const [slug, mapa] of porCurso) {
    // Una fila de contenido huérfana no debe crear un curso fuera del catálogo.
    if (!registrados.has(slug)) continue;

    try {
      cursos.push(construirCurso(slug, mapa, indicePorCurso.get(slug) ?? []));
    } catch (e) {
      // Un curso mal escrito queda fuera, pero no hace caer los demás.
      console.error(`No se pudo construir el curso «${slug}» desde Supabase:`, (e as Error).message);
    }
  }

  return { cursos, registrados };
}

export const buscarCurso = cache(async (slug: string) =>
  (await obtenerCursos()).find((c) => c.slug === slug),
);

export const buscarLeccion = cache(async (cursoSlug: string, leccionSlug: string) => {
  const curso = await buscarCurso(cursoSlug);
  if (!curso) return undefined;
  const i = curso.lecciones.findIndex((l) => l.slug === leccionSlug);
  if (i === -1) return undefined;
  return {
    curso,
    leccion: curso.lecciones[i],
    anterior: i > 0 ? curso.lecciones[i - 1] : undefined,
    siguiente: i < curso.lecciones.length - 1 ? curso.lecciones[i + 1] : undefined,
  };
});
