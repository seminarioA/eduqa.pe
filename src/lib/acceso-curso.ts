import "server-only";

import { redirect } from "next/navigation";
import { estaMatriculado, perfilActual } from "@/lib/matriculas";
import { esAccesoLibre } from "@/lib/precios";
import { usuarioActual } from "@/lib/supabase/servidor";

/** Aplica a una herramienta la misma barrera de acceso que a una lección. */
export async function autorizarAccesoCurso(curso: string, volverA: string) {
  const [libre, usuario] = await Promise.all([
    esAccesoLibre(curso),
    usuarioActual(),
  ]);

  if (!libre) {
    if (!usuario) redirect(`/acceder?volverA=${encodeURIComponent(volverA)}`);

    const perfil = await perfilActual();
    if (!perfil?.es_admin && !(await estaMatriculado(curso))) {
      redirect(`/cursos?matricularse=${curso}`);
    }
  }

  return { libre, usuario };
}
