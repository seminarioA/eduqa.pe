"use server";

import { revalidatePath } from "next/cache";
import { clienteServidor, usuarioActual } from "@/lib/supabase/servidor";
import { generarClave } from "@/lib/claves-api";

export type EstadoClave = { ok: boolean; error?: string; clave?: string };

/**
 * Emite una clave nueva.
 *
 * Devuelve la clave completa una única vez. A partir de aquí solo queda su
 * resumen, así que ni esta función ni ninguna otra puede volver a mostrarla.
 */
export async function crearClave(
  _prev: EstadoClave | null,
  formData: FormData,
): Promise<EstadoClave> {
  const usuario = await usuarioActual();
  if (!usuario) return { ok: false, error: "Entra a tu cuenta primero." };

  const nombre = String(formData.get("nombre") ?? "").trim();
  if (nombre.length < 3) return { ok: false, error: "Ponle un nombre que la identifique." };

  const { clave, resumen, prefijo } = generarClave();
  const supabase = await clienteServidor();

  const { error } = await supabase
    .from("claves_api")
    .insert({ usuario_id: usuario.id, nombre, prefijo, resumen });

  if (error) {
    // El caso normal es que el rol no autorice: la política lo rechaza y su
    // mensaje no sirve para enseñárselo a nadie.
    return { ok: false, error: "Tu rol no permite emitir claves." };
  }

  revalidatePath("/recursos/api");
  return { ok: true, clave };
}

export async function revocarClave(formData: FormData) {
  const usuario = await usuarioActual();
  if (!usuario) return;

  const id = String(formData.get("id") ?? "");
  const supabase = await clienteServidor();
  await supabase
    .from("claves_api")
    .update({ revocada_en: new Date().toISOString() })
    .eq("id", id)
    .eq("usuario_id", usuario.id);

  revalidatePath("/recursos/api");
}
