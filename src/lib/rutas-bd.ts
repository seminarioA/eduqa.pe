import "server-only";

import { clienteServidor } from "@/lib/supabase/servidor";
import { revalidatePath } from "next/cache";

export type FilaRuta = {
  slug: string;
  nombre: string;
  descripcion: string | null;
  orden: number;
};

export async function listarTodasLasRutas(): Promise<FilaRuta[]> {
  const supabase = await clienteServidor();
  const { data, error } = await supabase
    .from("rutas")
    .select("slug, nombre, descripcion, orden")
    .order("orden", { ascending: true });

  if (error) {
    console.error("Error al listar rutas:", error.message);
    return [];
  }
  return data ?? [];
}

export async function crearRutaBD(datos: {
  slug: string;
  nombre: string;
  descripcion?: string | null;
  orden?: number;
}) {
  const supabase = await clienteServidor();
  const { data, error } = await supabase
    .from("rutas")
    .insert({
      slug: datos.slug.trim().toLowerCase(),
      nombre: datos.nombre.trim(),
      descripcion: datos.descripcion?.trim() || null,
      orden: datos.orden ?? 0,
    })
    .select()
    .single();

  if (error) throw new Error(`No se pudo crear la ruta: ${error.message}`);
  revalidatePath("/rutas");
  revalidatePath("/panel/rutas");
  revalidatePath("/cursos");
  return data;
}

export async function actualizarRutaBD(
  slugOriginal: string,
  datos: {
    nombre?: string;
    descripcion?: string | null;
    orden?: number;
  },
) {
  const supabase = await clienteServidor();
  const { data, error } = await supabase
    .from("rutas")
    .update({
      ...(datos.nombre ? { nombre: datos.nombre.trim() } : {}),
      ...(datos.descripcion !== undefined ? { descripcion: datos.descripcion?.trim() || null } : {}),
      ...(datos.orden !== undefined ? { orden: datos.orden } : {}),
    })
    .eq("slug", slugOriginal)
    .select()
    .single();

  if (error) throw new Error(`No se pudo actualizar la ruta: ${error.message}`);
  revalidatePath("/rutas");
  revalidatePath("/panel/rutas");
  revalidatePath("/cursos");
  return data;
}

export async function eliminarRutaBD(slug: string) {
  const supabase = await clienteServidor();
  const { error } = await supabase.from("rutas").delete().eq("slug", slug);

  if (error) throw new Error(`No se pudo eliminar la ruta: ${error.message}`);
  revalidatePath("/rutas");
  revalidatePath("/panel/rutas");
  revalidatePath("/cursos");
}

export async function asignarCursoARutaBD(datos: {
  cursoSlug: string;
  rutaSlug: string | null;
  posicion: number;
  requisitos?: string[];
}) {
  const supabase = await clienteServidor();
  const { error } = await supabase
    .from("cursos")
    .update({
      ruta: datos.rutaSlug,
      posicion: datos.posicion,
      requisitos: datos.requisitos ?? [],
    })
    .eq("slug", datos.cursoSlug);

  if (error) throw new Error(`No se pudo asignar el curso a la ruta: ${error.message}`);
  revalidatePath("/rutas");
  revalidatePath("/panel/rutas");
  revalidatePath("/cursos");
}
