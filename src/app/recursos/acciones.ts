"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { perfilActual } from "@/lib/matriculas";
import { clienteServidor, usuarioActual } from "@/lib/supabase/servidor";
import { esSlugRecurso } from "@/lib/recursos";

async function validar(formData: FormData) {
  const [usuario, perfil] = await Promise.all([usuarioActual(), perfilActual()]);
  if (!usuario || !(perfil?.es_admin || perfil?.rol === "admin")) {
    throw new Error("Solo un administrador puede modificar recursos.");
  }
  const slug = String(formData.get("recurso") ?? "");
  if (!esSlugRecurso(slug)) throw new Error("Recurso no válido.");
  return slug;
}

export async function guardarItem(formData: FormData) {
  const slug = await validar(formData);
  const titulo = String(formData.get("titulo") ?? "").trim();
  const contenido = String(formData.get("contenido") ?? "").trim();
  const posicion = Number(formData.get("posicion") ?? 0);
  const id = String(formData.get("id") ?? "");
  if (titulo.length < 3 || titulo.length > 160 || contenido.length < 3 || contenido.length > 20000 ||
      !Number.isSafeInteger(posicion) || posicion < 0 || posicion > 100000) {
    redirect(`/recursos/${slug}?estado=datos-invalidos`);
  }
  const supabase = await clienteServidor();
  const valores = { titulo, contenido, posicion };
  const resultado = id
    ? await supabase.from("recurso_items").update(valores).eq("id", id).eq("recurso_slug", slug).select("id").single()
    : await supabase.from("recurso_items").insert({ ...valores, recurso_slug: slug }).select("id").single();
  if (resultado.error) redirect(`/recursos/${slug}?estado=error`);
  revalidatePath("/recursos");
  revalidatePath(`/recursos/${slug}`);
  redirect(`/recursos/${slug}?estado=guardado`);
}

export async function eliminarItem(formData: FormData) {
  const slug = await validar(formData);
  const id = String(formData.get("id") ?? "");
  if (!/^[0-9a-f-]{36}$/i.test(id)) redirect(`/recursos/${slug}?estado=error`);
  const supabase = await clienteServidor();
  const { data, error } = await supabase.from("recurso_items").delete()
    .eq("id", id).eq("recurso_slug", slug).select("id").single();
  if (error || !data) redirect(`/recursos/${slug}?estado=error`);
  revalidatePath("/recursos");
  revalidatePath(`/recursos/${slug}`);
  redirect(`/recursos/${slug}?estado=eliminado`);
}
