import "server-only";

import { cache } from "react";
import { clienteServidor } from "@/lib/supabase/servidor";

export type RequisitoVisible = {
  tipo: "curso" | "ruta" | "referencia";
  slug: string;
  nombre: string;
};

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
  requisitos: RequisitoVisible[];
  creado_en: string | null;
  creado_por_nombre: string | null;
  aprobado_en: string | null;
  aprobado_por_nombre: string | null;
  publicado_en: string | null;
  actualizado_en: string;
};

function nombreDeReferencia(slug: string) {
  return slug
    .replace(/[-_]+/g, " ")
    .replace(/\b\p{L}/gu, (letra) => letra.toUpperCase());
}

/**
 * Resuelve los prerrequisitos a nombres legibles.
 *
 * La relación normalizada `curso_requisitos` tiene prioridad. El arreglo
 * legacy `cursos.requisitos` se conserva como fallback y puede apuntar a un
 * curso o a una ruta por slug.
 */
async function requisitosVisibles(
  cursoId: string,
  requisitosLegacy: string[],
): Promise<RequisitoVisible[]> {
  const supabase = await clienteServidor();

  const { data: relaciones, error: errorRelaciones } = await supabase
    .from("curso_requisitos")
    .select("requisito_curso_id, orden")
    .eq("curso_id", cursoId)
    .order("orden", { ascending: true });

  if (errorRelaciones) {
    throw new Error(
      `No se pudieron leer los prerrequisitos normalizados: ${errorRelaciones.message}`,
    );
  }

  const visibles: RequisitoVisible[] = [];
  const idsNormalizados = (relaciones ?? []).map(
    (relacion) => relacion.requisito_curso_id,
  );

  if (idsNormalizados.length > 0) {
    const { data: cursosRequisito, error: errorCursos } = await supabase
      .from("cursos")
      .select("id, slug, titulo")
      .in("id", idsNormalizados);

    if (errorCursos) {
      throw new Error(
        `No se pudieron resolver los cursos prerrequisito: ${errorCursos.message}`,
      );
    }

    const porId = new Map(
      (cursosRequisito ?? []).map((curso) => [curso.id, curso]),
    );

    for (const relacion of relaciones ?? []) {
      const curso = porId.get(relacion.requisito_curso_id);
      if (!curso) continue;
      visibles.push({
        tipo: "curso",
        slug: curso.slug,
        nombre: curso.titulo,
      });
    }
  }

  const slugsIncluidos = new Set(visibles.map((requisito) => requisito.slug));
  const pendientes = requisitosLegacy.filter(
    (slug) => slug && !slugsIncluidos.has(slug),
  );

  if (pendientes.length === 0) return visibles;

  const [cursosResultado, rutasResultado] = await Promise.all([
    supabase.from("cursos").select("slug, titulo").in("slug", pendientes),
    supabase.from("rutas").select("slug, nombre").in("slug", pendientes),
  ]);

  if (cursosResultado.error) {
    throw new Error(
      `No se pudieron resolver los prerrequisitos legacy de curso: ${cursosResultado.error.message}`,
    );
  }
  if (rutasResultado.error) {
    throw new Error(
      `No se pudieron resolver los prerrequisitos legacy de ruta: ${rutasResultado.error.message}`,
    );
  }

  const cursosPorSlug = new Map(
    (cursosResultado.data ?? []).map((curso) => [curso.slug, curso.titulo]),
  );
  const rutasPorSlug = new Map(
    (rutasResultado.data ?? []).map((ruta) => [ruta.slug, ruta.nombre]),
  );

  for (const slug of pendientes) {
    const curso = cursosPorSlug.get(slug);
    if (curso) {
      visibles.push({ tipo: "curso", slug, nombre: curso });
      continue;
    }

    const ruta = rutasPorSlug.get(slug);
    if (ruta) {
      visibles.push({ tipo: "ruta", slug, nombre: ruta });
      continue;
    }

    visibles.push({
      tipo: "referencia",
      slug,
      nombre: nombreDeReferencia(slug),
    });
  }

  return visibles;
}

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
        "id, slug, codigo, revision, titulo, resumen, precio, estado, acceso_libre, ruta, posicion, requisitos, creado_en, creado_por_nombre, aprobado_en, aprobado_por_nombre, publicado_en, actualizado_en",
      )
      .eq("slug", slug)
      .maybeSingle();

    if (error) {
      throw new Error(
        `No se pudo leer la información editorial del curso: ${error.message}`,
      );
    }
    if (!data) return null;

    const legacy = (data.requisitos ?? []).filter(
      (requisito): requisito is string =>
        typeof requisito === "string" && requisito.length > 0,
    );
    const requisitos = await requisitosVisibles(data.id, legacy);

    return {
      slug: data.slug,
      codigo: data.codigo,
      revision: Number(data.revision),
      titulo: data.titulo,
      resumen: data.resumen,
      precio: Number(data.precio),
      estado: data.estado,
      acceso_libre: data.acceso_libre,
      ruta: data.ruta,
      posicion: data.posicion === null ? null : Number(data.posicion),
      requisitos,
      creado_en: data.creado_en,
      creado_por_nombre: data.creado_por_nombre,
      aprobado_en: data.aprobado_en,
      aprobado_por_nombre: data.aprobado_por_nombre,
      publicado_en: data.publicado_en,
      actualizado_en: data.actualizado_en,
    };
  },
);
