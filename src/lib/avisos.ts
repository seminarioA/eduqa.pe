import { clienteServidor, usuarioActual } from "@/lib/supabase/servidor";

/**
 * Tablero de avisos: lo que administración quiere que todo alumno lea.
 *
 * No es mensajería. Va en una sola dirección y dice lo mismo a todos, así que
 * ni hay destinatarios ni hay respuestas.
 */
export type Aviso = {
  id: string;
  titulo: string;
  cuerpo: string;
  fijado: boolean;
  publicado: boolean;
  vigente_hasta: string | null;
  creado_en: string;
};

/**
 * Avisos que puede ver quien pregunta.
 *
 * El filtro de publicado y caducidad lo aplica RLS, no esta consulta: si
 * dependiera de que aquí alguien recuerde añadir la condición, bastaría una
 * consulta nueva escrita con prisa para enseñar un borrador.
 */
export async function avisosVisibles(): Promise<Aviso[]> {
  const usuario = await usuarioActual();
  if (!usuario) return [];

  const supabase = await clienteServidor();
  const { data } = await supabase
    .from("avisos")
    .select("id, titulo, cuerpo, fijado, publicado, vigente_hasta, creado_en")
    .order("fijado", { ascending: false })
    .order("creado_en", { ascending: false })
    .limit(30);

  return (data ?? []) as Aviso[];
}
