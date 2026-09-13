"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { perfilActual } from "@/lib/matriculas";

export async function refrescarSincronizacionMedium() {
  const perfil = await perfilActual();
  if (!perfil?.es_admin) {
    throw new Error("No tienes permisos para re-sincronizar el blog.");
  }

  revalidateTag("medium-blog");
  revalidatePath("/blog");
  revalidatePath("/panel/blog");
}
