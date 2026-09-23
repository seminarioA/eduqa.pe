"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { clienteServidor, usuarioActual } from "@/lib/supabase/servidor";

export async function votarPropuesta(formData: FormData) {
  const usuario = await usuarioActual();
  if (!usuario) redirect("/acceder?volverA=/proximos-cursos");

  const propuestaId = String(formData.get("propuestaId") ?? "").trim();
  if (!propuestaId) {
    redirect("/proximos-cursos?estado=propuesta-invalida");
  }

  const supabase = await clienteServidor();
  const { error } = await supabase.rpc("votar_propuesta_curso", {
    p_propuesta_id: propuestaId,
  });

  if (error) {
    if (error.message.includes("Ya votaste por este curso")) {
      redirect("/proximos-cursos?estado=ya-votaste");
    }
    if (error.message.includes("Ya usaste tu voto de hoy")) {
      redirect("/proximos-cursos?estado=voto-diario-usado");
    }
    if (error.message.includes("no está recibiendo votos")) {
      redirect("/proximos-cursos?estado=votacion-cerrada");
    }
    redirect("/proximos-cursos?estado=error");
  }

  revalidatePath("/proximos-cursos");
  revalidatePath("/panel/proximos-cursos");
  redirect("/proximos-cursos?estado=voto-registrado");
}
