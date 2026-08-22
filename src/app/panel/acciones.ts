"use server";

import { revalidatePath } from "next/cache";
import { clienteServidor } from "@/lib/supabase/servidor";

export type EstadoGuardado = { ok: boolean; error?: string };

export const ESTADOS = ["borrador", "privado", "publico"] as const;
export type EstadoCurso = (typeof ESTADOS)[number];

/**
 * Guarda los campos editables de un curso.
 *
 * Quién puede hacerlo lo decide RLS, no esta función: la política exige
 * `es_admin`. Aquí solo se valida la forma de los datos.
 */
export async function guardarCurso(
  _prev: EstadoGuardado | null,
  formData: FormData,
): Promise<EstadoGuardado> {
  const slug = String(formData.get("curso") ?? "");
  const titulo = String(formData.get("titulo") ?? "").trim();
  const resumen = String(formData.get("resumen") ?? "").trim();
  const estado = String(formData.get("estado") ?? "");
  const precio = Number(formData.get("precio"));
  // Una casilla desmarcada no viaja en el formulario: ausencia es falso.
  const accesoLibre = formData.get("acceso_libre") !== null;

  if (titulo.length < 3) return { ok: false, error: "El título es muy corto." };
  if (resumen.length < 10) return { ok: false, error: "El resumen es muy corto." };
  if (!ESTADOS.includes(estado as EstadoCurso))
    return { ok: false, error: "Estado no válido." };
  if (!Number.isFinite(precio) || precio < 0)
    return { ok: false, error: "El precio debe ser un número no negativo." };

  const supabase = await clienteServidor();
  const { error, count } = await supabase
    .from("cursos")
    .update(
      {
        titulo,
        resumen,
        estado,
        precio,
        acceso_libre: accesoLibre,
        publicado: estado === "publico",
        actualizado_en: new Date().toISOString(),
      },
      { count: "exact" },
    )
    .eq("slug", slug);

  if (error) {
    console.error("[guardarCurso]", error);
    return { ok: false, error: "No pudimos guardar los cambios." };
  }
  // RLS no lanza error cuando deniega: simplemente no afecta ninguna fila.
  if (count === 0) return { ok: false, error: "No tienes permiso para editar cursos." };

  revalidatePath("/cursos");
  revalidatePath("/panel");
  return { ok: true };
}
