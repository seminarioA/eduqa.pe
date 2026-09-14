"use server";

import { revalidatePath, updateTag } from "next/cache";
import { perfilActual } from "@/lib/matriculas";
import { obtenerArticulosMedium } from "@/lib/blog-medium";

export async function actualizarArticulosMedium() {
  const perfil = await perfilActual();
  if (!perfil?.es_admin) {
    throw new Error("No tienes permisos para actualizar el blog.");
  }

  updateTag("medium-blog");
  revalidatePath("/blog");
  return (await obtenerArticulosMedium()).length;
}
