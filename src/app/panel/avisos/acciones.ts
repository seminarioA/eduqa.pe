"use server";

import { revalidatePath } from "next/cache";
import { clienteServidor, usuarioActual } from "@/lib/supabase/servidor";

export type EstadoAviso = { ok: boolean; error?: string };

/**
 * Publica un aviso en el tablero.
 *
 * Quién puede hacerlo lo decide RLS: la política de `avisos` exige `es_admin`
 * y además que el autor sea quien firma. Aquí solo se valida la forma.
 */
export async function crearAviso(
  _prev: EstadoAviso | null,
  formData: FormData,
): Promise<EstadoAviso> {
  const titulo = String(formData.get("titulo") ?? "").trim();
  const cuerpo = String(formData.get("cuerpo") ?? "").trim();
  const vigenteHasta = String(formData.get("vigente_hasta") ?? "").trim();
  const fijado = formData.get("fijado") !== null;
  const publicado = formData.get("publicado") !== null;

  if (titulo.length < 4) return { ok: false, error: "El título es muy corto." };
  if (cuerpo.length < 10) return { ok: false, error: "El aviso es muy corto." };
  if (titulo.length > 120) return { ok: false, error: "El título es muy largo." };

  const usuario = await usuarioActual();
  if (!usuario) return { ok: false, error: "Entra a tu cuenta primero." };

  const supabase = await clienteServidor();
  const { error } = await supabase.from("avisos").insert({
    autor_id: usuario.id,
    titulo,
    cuerpo,
    fijado,
    publicado,
    // Vacío se guarda como null: "sin fecha de caducidad" no es lo mismo que
    // una fecha en blanco, y la política filtra por null.
    vigente_hasta: vigenteHasta || null,
  });

  if (error) {
    console.error("[crearAviso]", error);
    return { ok: false, error: "No pudimos publicar el aviso." };
  }

  revalidatePath("/cursos");
  revalidatePath("/panel/avisos");
  return { ok: true };
}

/** Quita un aviso del tablero. */
export async function borrarAviso(
  _prev: EstadoAviso | null,
  formData: FormData,
): Promise<EstadoAviso> {
  const id = String(formData.get("id") ?? "");

  const supabase = await clienteServidor();
  const { error, count } = await supabase
    .from("avisos")
    .delete({ count: "exact" })
    .eq("id", id);

  if (error) {
    console.error("[borrarAviso]", error);
    return { ok: false, error: "No pudimos borrar el aviso." };
  }
  // RLS no lanza error cuando deniega: simplemente no afecta ninguna fila.
  if (count === 0) return { ok: false, error: "No tienes permiso." };

  revalidatePath("/cursos");
  revalidatePath("/panel/avisos");
  return { ok: true };
}
