import "server-only";

import { cache } from "react";
import { clienteServidor } from "@/lib/supabase/servidor";

export type InformacionEditorialCurso = {
  slug: string;
  codigo: string | null;
  revision: number;
  titulo: string;
  resumen: string | null;
  precio: number;
  estado: string;
  acceso_libre: boolean;
  ruta: string | null;
  posicion: number | null;
  requisitos: string[];
  creado_en: string | null;
  creado_por_nombre: string | null;
  aprobado_en: string | null;
  aprobado_por_nombre: string | null;
  publicado_en: string | null;
  actualizado_en: string;
};

/**
 * Metadatos editoriales que acompañan al contenido académico.
 *
 * Los nombres de autor y aprobador son instantáneas guardadas en `cursos`.
 * No se abre la tabla `perfiles` a otros alumnos solo para pintar créditos.
 */
export const informacionEditorialCurso = cache(
  async (slug: string): Promise<InformacionEditorialCurso | null> => {
    const supabase = await clienteServidor();
    const { data, error } = await supabase
      .from("cursos")
      .select(
        "slug, codigo, revision, titulo, resumen, precio, estado, acceso_libre, ruta, posicion, requisitos, creado_en, creado_por_nombre, aprobado_en, aprobado_por_nombre, publicado_en, actualizado_en",
      )
      .eq("slug", slug)
      .maybeSingle();

    if (error) {
      throw new Error(
        `No se pudo leer la información editorial del curso: ${error.message}`,
      );
    }
    if (!data) return null;

    return {
      ...data,
      revision: Number(data.revision),
      precio: Number(data.precio),
      posicion: data.posicion === null ? null : Number(data.posicion),
      requisitos: data.requisitos ?? [],
    };
  },
);
