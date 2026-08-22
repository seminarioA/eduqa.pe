"use server";

import { revalidatePath } from "next/cache";
import { clienteServidor, usuarioActual } from "@/lib/supabase/servidor";
import { registrarError } from "@/lib/registro";
import {
  PESO_MAXIMO_SVG,
  RANURAS_MARCA,
  validarSvg,
  type RanuraMarca,
} from "@/lib/marca";

export type EstadoMarca = { ok: boolean; error?: string };

function esRanura(valor: string): valor is RanuraMarca {
  return RANURAS_MARCA.includes(valor as RanuraMarca);
}

/** La marca se pinta en toda la app: al cambiarla hay que refrescarlo todo. */
function revalidarTodo() {
  revalidatePath("/", "layout");
}

/**
 * Guarda el SVG personalizado de una ranura de la marca.
 *
 * Quién puede hacerlo lo decide RLS: la política exige es_admin. Aquí solo
 * se valida la forma del archivo y su contenido.
 */
export async function guardarMarca(
  _prev: EstadoMarca | null,
  formData: FormData,
): Promise<EstadoMarca> {
  const clave = String(formData.get("clave") ?? "");
  if (!esRanura(clave)) return { ok: false, error: "Ranura desconocida." };

  const archivo = formData.get("svg");
  if (!(archivo instanceof File) || archivo.size === 0) {
    return { ok: false, error: "Elige un archivo SVG." };
  }
  if (archivo.size > PESO_MAXIMO_SVG) {
    return { ok: false, error: "El SVG pesa más de 200 KB." };
  }

  const texto = await archivo.text();
  const problema = validarSvg(texto);
  if (problema) return { ok: false, error: problema };

  const usuario = await usuarioActual();
  if (!usuario) return { ok: false, error: "Entra a tu cuenta primero." };

  const supabase = await clienteServidor();
  const { error } = await supabase.from("marca_recursos").upsert({
    clave,
    svg: texto,
  });

  if (error) {
    registrarError("marca.guardar", error);
    return { ok: false, error: "No pudimos guardar el SVG. ¿Eres administrador?" };
  }

  revalidarTodo();
  return { ok: true };
}

/**
 * Quita el SVG personalizado de una ranura: esa parte de la interfaz vuelve a
 * mostrar la llama original.
 */
export async function restablecerMarca(
  _prev: EstadoMarca | null,
  formData: FormData,
): Promise<EstadoMarca> {
  const clave = String(formData.get("clave") ?? "");
  if (!esRanura(clave)) return { ok: false, error: "Ranura desconocida." };

  const usuario = await usuarioActual();
  if (!usuario) return { ok: false, error: "Entra a tu cuenta primero." };

  const supabase = await clienteServidor();
  const { error } = await supabase
    .from("marca_recursos")
    .delete()
    .eq("clave", clave);

  if (error) {
    registrarError("marca.restablecer", error);
    return { ok: false, error: "No pudimos restablecer la llama original." };
  }

  revalidarTodo();
  return { ok: true };
}
