import { clienteServidor } from "@/lib/supabase/servidor";

export type PrecioCurso = {
  slug: string;
  titulo: string;
  resumen: string | null;
  precio: number;
  estado: "borrador" | "privado" | "publico";
  /** El material se lee sin cuenta y sin matrícula. */
  acceso_libre: boolean;
};

/**
 * Los precios viven en la base, no en el código, para que un administrador
 * los cambie sin desplegar. La tabla es de lectura pública porque el precio
 * hay que mostrarlo antes de iniciar sesión.
 */
export async function precios(): Promise<Map<string, PrecioCurso>> {
  const supabase = await clienteServidor();
  const { data } = await supabase
    .from("cursos")
    .select("slug, titulo, resumen, precio, estado, acceso_libre")
    .order("orden");

  const mapa = new Map<string, PrecioCurso>();
  for (const c of (data ?? []) as PrecioCurso[]) {
    mapa.set(c.slug, { ...c, precio: Number(c.precio) });
  }
  return mapa;
}

/**
 * Si un curso es de acceso libre, su material se lee sin sesión.
 *
 * La respuesta sale de la base leída con las credenciales de quien pregunta,
 * así que hereda las políticas de `cursos`: a un anónimo solo se le muestran
 * las filas públicas. Un curso en borrador o privado devuelve `false` aunque
 * tenga la marca puesta, que es justo lo que se quiere.
 */
export async function esAccesoLibre(slug: string): Promise<boolean> {
  const supabase = await clienteServidor();
  const { data } = await supabase
    .from("cursos")
    .select("acceso_libre, estado")
    .eq("slug", slug)
    .maybeSingle();

  return data?.acceso_libre === true && data?.estado === "publico";
}

export async function precioDe(slug: string): Promise<number | null> {
  const supabase = await clienteServidor();
  const { data } = await supabase
    .from("cursos")
    .select("precio")
    .eq("slug", slug)
    .maybeSingle();

  return data ? Number(data.precio) : null;
}
