"use server";

import { revalidatePath, revalidateTag } from "next/cache";

export async function sincronizarBlogAction() {
  try {
    revalidateTag("medium-blog", "max-age=0" as unknown as undefined);
  } catch {
    // Si la versión de next revalidateTag sólo acepta 1 argumento
    try {
      revalidateTag("medium-blog");
    } catch {}
  }
  revalidatePath("/blog");
  revalidatePath("/panel/blog");
  return { ok: true };
}
