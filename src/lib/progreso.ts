import { clienteServidor, usuarioActual } from "@/lib/supabase/servidor";

/**
 * Progreso por lección. Vive en la base y no en el navegador porque el avance
 * de un curso tiene que sobrevivir a cambiar de dispositivo o de sesión.
 */
export type Progreso = { curso_slug: string; leccion_slug: string };

export async function miProgreso(): Promise<Progreso[]> {
  const usuario = await usuarioActual();
  if (!usuario) return [];

  const supabase = await clienteServidor();
  const { data } = await supabase.from("progreso").select("curso_slug, leccion_slug");
  return (data ?? []) as Progreso[];
}

/** Lecciones vistas de un curso, indexadas para consultar en O(1). */
export async function vistasDe(cursoSlug: string): Promise<Set<string>> {
  const usuario = await usuarioActual();
  if (!usuario) return new Set();

  const supabase = await clienteServidor();
  const { data } = await supabase
    .from("progreso")
    .select("leccion_slug")
    .eq("curso_slug", cursoSlug);

  return new Set((data ?? []).map((f) => f.leccion_slug as string));
}

/** Cuántas lecciones vistas hay por curso, para pintar la barra en el listado. */
export function contarPorCurso(progreso: Progreso[]): Map<string, number> {
  const conteo = new Map<string, number>();
  for (const p of progreso) {
    conteo.set(p.curso_slug, (conteo.get(p.curso_slug) ?? 0) + 1);
  }
  return conteo;
}
