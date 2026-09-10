"use server";

import { revalidatePath } from "next/cache";
import { clienteServidor } from "@/lib/supabase/servidor";
import { ESTADOS_REPORTE, type EstadoDeReporte } from "./estados";

export type EstadoReporte = { ok: boolean; error?: string };

/**
 * Triaje de un reporte. Quién puede hacerlo lo decide RLS: la política de
 * actualización de `reportes` exige `es_admin`.
 */
export async function cambiarEstadoReporte(
  _prev: EstadoReporte | null,
  formData: FormData,
): Promise<EstadoReporte> {
  const id = String(formData.get("id") ?? "");
  const estado = String(formData.get("estado") ?? "");

  if (!ESTADOS_REPORTE.includes(estado as EstadoDeReporte))
    return { ok: false, error: "Estado no válido." };

  const supabase = await clienteServidor();
  const { error, count } = await supabase
    .from("reportes")
    .update(
      {
        estado,
        resuelto_en: estado === "resuelto" ? new Date().toISOString() : null,
      },
      { count: "exact" },
    )
    .eq("id", id);

  if (error) {
    console.error("[cambiarEstadoReporte]", error);
    return { ok: false, error: "No pudimos guardar el cambio." };
  }
  // RLS no lanza error cuando deniega: simplemente no afecta ninguna fila.
  if (count === 0) return { ok: false, error: "No tienes permiso." };

  revalidatePath("/panel/reportes");
  return { ok: true };
}
