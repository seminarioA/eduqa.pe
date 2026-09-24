"use server";

import { revalidatePath } from "next/cache";
import { clienteServidor, usuarioActual } from "@/lib/supabase/servidor";
import { CODIGOS_PAIS } from "@/lib/paises";

export type EstadoPerfil = { ok: boolean; error?: string };

/**
 * Guarda el nombre completo del usuario.
 *
 * No es un dato cosmético: es el nombre que se imprime en el certificado.
 * Por eso se pide completo y no se deriva del correo, que suele ser un alias.
 */
/**
 * El teléfono es opcional y se guarda en formato internacional. La validación
 * es deliberadamente laxa: los formatos varían por país y rechazar un número
 * válido por exceso de celo es peor que guardar uno raro.
 */
const RE_TELEFONO = /^\+?[\d\s()-]{6,20}$/;

export async function guardarNombre(
  _prev: EstadoPerfil | null,
  formData: FormData,
): Promise<EstadoPerfil> {
  const nombre = String(formData.get("nombre") ?? "").trim().replace(/\s+/g, " ");
  const telefono = String(formData.get("telefono") ?? "").trim();
  const pais = String(formData.get("pais") ?? "").trim().toUpperCase();

  if (nombre.length < 3)
    return { ok: false, error: "Escribe tu nombre completo." };
  if (!nombre.includes(" "))
    return { ok: false, error: "Incluye al menos un apellido." };
  if (nombre.length > 80)
    return { ok: false, error: "Ese nombre es demasiado largo." };
  if (telefono && !RE_TELEFONO.test(telefono))
    return { ok: false, error: "Ese número no parece válido." };
  if (pais && !CODIGOS_PAIS.has(pais))
    return { ok: false, error: "Selecciona un país válido." };

  const usuario = await usuarioActual();
  if (!usuario) return { ok: false, error: "Inicia sesión primero." };

  const supabase = await clienteServidor();
  const { error } = await supabase
    .from("perfiles")
    // Vacío se guarda como null, no como cadena vacía: el teléfono es
    // opcional y "sin dato" no es lo mismo que "dato en blanco".
    .update({ nombre, telefono: telefono || null, pais: pais || null })
    .eq("id", usuario.id);

  if (error) {
    console.error("[guardarNombre]", error);
    return { ok: false, error: "No pudimos guardar tus datos." };
  }

  revalidatePath("/cursos");
  revalidatePath("/perfil");
  revalidatePath("/ajustes");
  revalidatePath("/panel");
  return { ok: true };
}

export type EstadoFoto = { ok: boolean; error?: string };

/**
 * Guarda la foto de perfil.
 *
 * El archivo va a una carpeta con el identificador de quien sube, que es lo
 * que exigen las políticas del bucket: así nadie puede pisar el avatar de
 * otro. El nombre lleva la marca de tiempo para que el navegador no siga
 * mostrando la anterior desde su caché.
 */
export async function guardarFoto(
  _prev: EstadoFoto | null,
  formData: FormData,
): Promise<EstadoFoto> {
  const usuario = await usuarioActual();
  if (!usuario) return { ok: false, error: "Entra a tu cuenta primero." };

  const archivo = formData.get("foto");
  if (!(archivo instanceof File) || archivo.size === 0) {
    return { ok: false, error: "Elige una imagen." };
  }
  if (archivo.size > 2 * 1024 * 1024) {
    return { ok: false, error: "La imagen pesa más de 2 MB." };
  }
  if (!["image/jpeg", "image/png", "image/webp", "image/gif"].includes(archivo.type)) {
    return { ok: false, error: "Tiene que ser una imagen JPG, PNG, WEBP o GIF." };
  }

  const supabase = await clienteServidor();
  const extension = archivo.name.split(".").pop()?.toLowerCase() || "jpg";
  const ruta = `${usuario.id}/${Date.now()}.${extension}`;

  const { error: eSubida } = await supabase.storage
    .from("avatares")
    .upload(ruta, archivo, { contentType: archivo.type });
  if (eSubida) return { ok: false, error: "No se pudo subir la imagen." };

  const { data } = supabase.storage.from("avatares").getPublicUrl(ruta);
  const { error } = await supabase
    .from("perfiles")
    .update({ foto: data.publicUrl })
    .eq("id", usuario.id);
  if (error) return { ok: false, error: "La imagen subió pero no se pudo guardar." };

  revalidatePath("/perfil");
  revalidatePath("/cursos");
  return { ok: true };
}
