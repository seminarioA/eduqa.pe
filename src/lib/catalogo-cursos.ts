import "server-only";

import { cache } from "react";
import { construirCurso } from "@/lib/curso-markdown";
import type { Curso } from "@/lib/curso-tipos";
import { clienteServidor } from "@/lib/supabase/servidor";

/**
 * Catálogo de runtime.
 *
 * Supabase es la única fuente de verdad. La aplicación no descubre cursos en
 * `src/content`, no conserva un catálogo alternativo y no hace fallback si la
 * base falla. Publicar, editar, archivar o retirar un curso consiste únicamente
 * en modificar sus filas en Supabase.
 *
 * Los Markdown siguen siendo el formato editorial que se sube al panel/API,
 * pero una vez publicados se leen desde `curso_contenido`.
 */
export const obtenerCursos = cache(async (): Promise<Curso[]> => {
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

  const error = errorFichas ?? errorArchivos ?? errorIndices;
  if (error) {
    // Fallar aquí es deliberado: volver a contenido empaquetado ocultaría una
    // caída o una mala configuración de Supabase y podría revivir cursos
    // archivados. La base es la única autoridad.
    throw new Error(`No se pudo leer el catálogo de cursos desde Supabase: ${error.message}`);
  }

  const registrados = new Set((fichas ?? []).map((fila) => fila.slug));
  if (!archivos?.length) return [];

  const porCurso = new Map<string, Map<string, string>>();
  for (const fila of archivos) {
    if (!registrados.has(fila.curso_slug)) continue;
    const mapa = porCurso.get(fila.curso_slug) ?? new Map<string, string>();
    mapa.set(fila.archivo, fila.contenido);
    porCurso.set(fila.curso_slug, mapa);
  }

  const indicePorCurso = new Map<string, { numero: number; titulo: string; slug: string }[]>();
  for (const fila of indices ?? []) {
    if (!registrados.has(fila.curso_slug)) continue;
    const lista = indicePorCurso.get(fila.curso_slug) ?? [];
    lista.push({ numero: fila.numero, titulo: fila.titulo, slug: fila.slug });
    indicePorCurso.set(fila.curso_slug, lista);
  }

  const cursos: Curso[] = [];
  for (const slug of registrados) {
    const mapa = porCurso.get(slug);
    if (!mapa?.has("curso.md")) {
      console.error(`El curso «${slug}» está registrado en Supabase pero no tiene curso.md visible.`);
      continue;
    }

    try {
      cursos.push(construirCurso(slug, mapa, indicePorCurso.get(slug) ?? []));
    } catch (e) {
      // Un curso inválido no debe tumbar el resto del catálogo, pero tampoco
      // puede sustituirse por una copia local.
      console.error(`No se pudo construir el curso «${slug}» desde Supabase:`, (e as Error).message);
    }
  }

  return cursos;
});

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
