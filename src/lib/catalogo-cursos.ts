import "server-only";

import { cache } from "react";
import { construirCurso } from "@/lib/curso-markdown";
import { cursos as cursosDelRepositorio } from "@/lib/cursos";
import type { Curso } from "@/lib/curso-tipos";
import { clienteServidor } from "@/lib/supabase/servidor";

/**
 * Catálogo completo: los cursos del repositorio más los que viven en la base.
 *
 * Un curso escrito en Markdown dentro del repositorio obliga a desplegar para
 * publicarlo. Los que están en `curso_contenido` no: se leen en cada petición,
 * así que publicar uno nuevo es escribir filas.
 *
 * Los del repositorio se conservan porque son los que ya están vendidos y
 * funcionando. Si un slug aparece en los dos sitios manda el de la base, que es
 * el que se puede corregir sin tocar código.
 *
 * Se lee con las credenciales de quien pregunta, así que las políticas de
 * `curso_contenido` deciden qué sesiones llegan. Lo que no llega, no se pinta:
 * la barrera no depende de que la página se acuerde de comprobar.
 */
export const obtenerCursos = cache(async (): Promise<Curso[]> => {
  const desdeLaBase = await cursosDeLaBase();
  const porSlug = new Map<string, Curso>();
  for (const c of cursosDelRepositorio) porSlug.set(c.slug, c);
  for (const c of desdeLaBase) porSlug.set(c.slug, c);
  return [...porSlug.values()];
});

async function cursosDeLaBase(): Promise<Curso[]> {
  const supabase = await clienteServidor();

  const [{ data: archivos }, { data: indices }] = await Promise.all([
    supabase.from("curso_contenido").select("curso_slug, archivo, contenido"),
    supabase.from("curso_sesiones").select("curso_slug, numero, titulo, slug"),
  ]);

  if (!archivos?.length) return [];

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
    try {
      cursos.push(construirCurso(slug, mapa, indicePorCurso.get(slug) ?? []));
    } catch (e) {
      // Un curso mal escrito en la base no puede tumbar el catálogo entero:
      // se queda fuera y se deja constancia en el registro del servidor.
      console.error(`No se pudo construir el curso «${slug}»:`, (e as Error).message);
    }
  }
  return cursos;
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
