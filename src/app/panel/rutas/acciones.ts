"use server";

import { revalidatePath } from "next/cache";
import { usuarioEsAdmin } from "@/lib/supabase/servidor";
import {
  crearRutaBD,
  actualizarRutaBD,
  eliminarRutaBD,
  asignarCursoARutaBD,
} from "@/lib/rutas-bd";

export type EstadoAccionRuta = {
  ok: boolean;
  error?: string;
};

export async function crearRutaAction(
  _previo: EstadoAccionRuta | null,
  formData: FormData,
): Promise<EstadoAccionRuta> {
  const esAdmin = await usuarioEsAdmin();
  if (!esAdmin) return { ok: false, error: "No autorizado." };

  const slug = String(formData.get("slug") ?? "").trim();
  const nombre = String(formData.get("nombre") ?? "").trim();
  const descripcion = String(formData.get("descripcion") ?? "").trim();
  const orden = Number(formData.get("orden") ?? 0);

  if (!slug || !nombre) {
    return { ok: false, error: "El slug y el nombre son obligatorios." };
  }

  try {
    await crearRutaBD({ slug, nombre, descripcion, orden });
    revalidatePath("/panel/rutas");
    revalidatePath("/rutas");
    revalidatePath("/cursos");
    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Error al crear la ruta.",
    };
  }
}

export async function eliminarRutaAction(
  _previo: EstadoAccionRuta | null,
  formData: FormData,
): Promise<EstadoAccionRuta> {
  const esAdmin = await usuarioEsAdmin();
  if (!esAdmin) return { ok: false, error: "No autorizado." };

  const slug = String(formData.get("slug") ?? "").trim();
  if (!slug) return { ok: false, error: "Slug no especificado." };

  try {
    await eliminarRutaBD(slug);
    revalidatePath("/panel/rutas");
    revalidatePath("/rutas");
    revalidatePath("/cursos");
    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Error al eliminar la ruta.",
    };
  }
}

export async function asignarCursoAction(datos: {
  cursoSlug: string;
  rutaSlug: string | null;
  posicion: number;
  requisitos?: string[];
}): Promise<EstadoAccionRuta> {
  const esAdmin = await usuarioEsAdmin();
  if (!esAdmin) return { ok: false, error: "No autorizado." };

  try {
    await asignarCursoARutaBD(datos);
    revalidatePath("/panel/rutas");
    revalidatePath("/rutas");
    revalidatePath("/cursos");
    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Error al asignar curso.",
    };
  }
}
