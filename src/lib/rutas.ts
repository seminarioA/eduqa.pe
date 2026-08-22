import "server-only";

import { cache } from "react";
import { clienteServidor } from "@/lib/supabase/servidor";

export type CursoDeRuta = {
  slug: string;
  titulo: string;
  posicion: number;
  requisitos: string[];
  acceso_libre: boolean;
};

export type Ruta = {
  slug: string;
  nombre: string;
  descripcion: string | null;
  cursos: CursoDeRuta[];
};

/**
 * Rutas de aprendizaje con sus cursos en orden.
 *
 * Una ruta dice qué conviene hacer antes de qué. Sin esto el catálogo es una
 * lista y cada quien adivina por dónde empezar, que es justo lo que hace que
 * alguien compre el curso avanzado y lo abandone en la primera sesión.
 *
 * Solo salen los cursos publicados, porque las políticas de `cursos` filtran
 * los borradores para quien no es administrador.
 */
export const rutas = cache(async (): Promise<Ruta[]> => {
  const supabase = await clienteServidor();

  const [{ data: definidas }, { data: cursos }] = await Promise.all([
    supabase.from("rutas").select("slug, nombre, descripcion, orden").order("orden"),
    supabase
      .from("cursos")
      .select("slug, titulo, ruta, posicion, requisitos, acceso_libre")
      .not("ruta", "is", null)
      .order("posicion"),
  ]);

  return (definidas ?? []).map((r) => ({
    slug: r.slug,
    nombre: r.nombre,
    descripcion: r.descripcion,
    cursos: (cursos ?? [])
      .filter((c) => c.ruta === r.slug)
      .map((c) => ({
        slug: c.slug,
        titulo: c.titulo,
        posicion: c.posicion ?? 0,
        requisitos: c.requisitos ?? [],
        acceso_libre: c.acceso_libre,
      })),
  }));
});

/** A qué ruta pertenece cada curso, y en qué puesto. */
export const rutaDeCadaCurso = cache(async () => {
  const mapa = new Map<string, { ruta: string; nombre: string; posicion: number; de: number }>();
  for (const r of await rutas()) {
    for (const c of r.cursos) {
      mapa.set(c.slug, {
        ruta: r.slug,
        nombre: r.nombre,
        posicion: c.posicion,
        de: r.cursos.length,
      });
    }
  }
  return mapa;
});
