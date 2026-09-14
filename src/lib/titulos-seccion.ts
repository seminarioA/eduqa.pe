import "server-only";

import { cache } from "react";
import { clienteServidor } from "@/lib/supabase/servidor";

/**
 * Claves de los títulos de sección que el administrador puede editar.
 * Coinciden con los id ARIA del catálogo de cursos.
 */
export const TITULOS_SECCION = [
  "catalogo-populares",
  "catalogo-rutas",
  "catalogo-todos",
  "cursos-titulo-pagina",
] as const;

export type ClaveTitulo = (typeof TITULOS_SECCION)[number];

export const TITULOS_DEFECTO: Record<ClaveTitulo, string> = {
  "catalogo-populares": "Más elegidos",
  "catalogo-rutas": "Rutas populares",
  "catalogo-todos": "Todos los cursos",
  "cursos-titulo-pagina": "Cursos & Microcursos",
};

/**
 * Lee los títulos personalizados de la tabla `configuracion`.
 * Devuelve los valores por defecto para las claves que no estén guardadas.
 * El resultado está cacheado por request.
 */
export const titulosSeccion = cache(async (): Promise<Record<ClaveTitulo, string>> => {
  try {
    const supabase = await clienteServidor();
    const { data } = await supabase
      .from("configuracion")
      .select("clave, valor")
      .in("clave", TITULOS_SECCION as unknown as string[]);

    const resultado = { ...TITULOS_DEFECTO };
    for (const fila of data ?? []) {
      if (fila.clave in resultado) {
        resultado[fila.clave as ClaveTitulo] = fila.valor;
      }
    }
    return resultado;
  } catch {
    return { ...TITULOS_DEFECTO };
  }
});
