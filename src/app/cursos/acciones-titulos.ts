"use server";

import { revalidatePath } from "next/cache";
import { clienteServidor } from "@/lib/supabase/servidor";
import { perfilActual } from "@/lib/matriculas";
import { TITULOS_SECCION, type ClaveTitulo } from "@/lib/titulos-seccion";

/**
 * Guarda el nuevo título de una sección del catálogo.
 * Solo admins pueden usar esta acción.
 */
export async function guardarTituloSeccion(
  clave: ClaveTitulo,
  valor: string,
): Promise<{ ok: boolean; error?: string }> {
  const perfil = await perfilActual();
  if (!perfil?.es_admin) {
    return { ok: false, error: "Sin permisos de administrador." };
  }

  const limpio = valor.trim().slice(0, 120);
  if (!limpio) {
    return { ok: false, error: "El título no puede estar vacío." };
  }

  if (!(TITULOS_SECCION as readonly string[]).includes(clave)) {
    return { ok: false, error: "Clave de sección no reconocida." };
  }

  try {
    const supabase = await clienteServidor();
    const { error } = await supabase
      .from("configuracion")
      .upsert({ clave, valor: limpio }, { onConflict: "clave" });

    if (error) {
      return { ok: false, error: error.message };
    }

    revalidatePath("/cursos");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: String(e) };
  }
}
