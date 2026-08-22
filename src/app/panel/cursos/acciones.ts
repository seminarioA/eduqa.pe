"use server";

import { revalidatePath } from "next/cache";
import { parse as parseYaml } from "yaml";
import { clienteServidor, usuarioActual } from "@/lib/supabase/servidor";
import { construirCurso } from "@/lib/curso-markdown";

export type EstadoPublicacion = { ok: boolean; error?: string; detalle?: string };

/** Devuelve el frontmatter de un archivo Markdown, o {} si no lo lleva. */
function frontmatter(texto: string): Record<string, unknown> {
  const limpio = texto.replace(/^﻿/, "");
  if (!limpio.startsWith("---")) return {};
  const cierre = limpio.indexOf("\n---", 3);
  if (cierre === -1) return {};
  return (parseYaml(limpio.slice(3, cierre)) ?? {}) as Record<string, unknown>;
}

/**
 * Publica o actualiza un curso guardando su Markdown en la base.
 *
 * A partir de aquí la aplicación lo sirve leyéndolo de la base, así que
 * corregir una errata o añadir una sesión no obliga a desplegar.
 *
 * Quién puede hacerlo lo deciden las políticas de `curso_contenido` y
 * `curso_sesiones`, que exigen `es_admin`. Aquí solo se valida la forma: que
 * los archivos sean los que se esperan y que el temario se pueda construir.
 */
export async function publicarCurso(
  _prev: EstadoPublicacion | null,
  formData: FormData,
): Promise<EstadoPublicacion> {
  const usuario = await usuarioActual();
  if (!usuario) return { ok: false, error: "Entra a tu cuenta primero." };

  const subidos = formData.getAll("archivos").filter((f): f is File => f instanceof File);
  if (subidos.length === 0) return { ok: false, error: "No llegó ningún archivo." };

  const archivos = new Map<string, string>();
  for (const f of subidos) {
    if (!f.name.endsWith(".md")) {
      return { ok: false, error: `«${f.name}» no es un archivo .md.` };
    }
    archivos.set(f.name, await f.text());
  }

  if (!archivos.has("curso.md")) {
    return { ok: false, error: "Falta curso.md, que es la ficha del curso." };
  }
  if (archivos.size < 2) {
    return { ok: false, error: "Un curso necesita al menos una sesión además de la ficha." };
  }

  const ficha = frontmatter(archivos.get("curso.md")!);
  const slug = String(ficha.slug ?? "").trim();
  if (!slug) return { ok: false, error: "La ficha no declara un slug." };

  // Se construye antes de guardar. Si el temario está mal escrito, el error
  // se ve aquí y no cuando un alumno abra la página.
  let curso;
  try {
    curso = construirCurso(slug, archivos);
  } catch (e) {
    return { ok: false, error: `El curso no se pudo leer: ${(e as Error).message}` };
  }

  const supabase = await clienteServidor();

  // El curso tiene que existir en `cursos`: es lo que gobierna precio, estado
  // y acceso, y las dos tablas de contenido apuntan a él.
  const { data: existe } = await supabase.from("cursos").select("slug").eq("slug", slug).maybeSingle();
  if (!existe) {
    const { error } = await supabase.from("cursos").insert({
      slug,
      titulo: curso.titulo,
      resumen: curso.resumen,
      precio: 20,
      estado: "borrador",
      acceso_libre: false,
      orden: 99,
    });
    if (error) return { ok: false, error: `No se pudo dar de alta el curso: ${error.message}` };
  }

  // Se reemplaza entero: si una sesión se quitó del envío, tiene que
  // desaparecer también aquí y no quedarse como un resto invisible.
  await supabase.from("curso_contenido").delete().eq("curso_slug", slug);
  await supabase.from("curso_sesiones").delete().eq("curso_slug", slug);

  const { error: eContenido } = await supabase.from("curso_contenido").insert(
    [...archivos.entries()].map(([archivo, contenido]) => ({
      curso_slug: slug,
      archivo,
      contenido,
    })),
  );
  if (eContenido) return { ok: false, error: `No se pudo guardar el material: ${eContenido.message}` };

  // El índice se deriva del mismo Markdown, así que no puede quedarse
  // desfasado respecto al contenido.
  const indice = [...archivos.entries()]
    .filter(([archivo]) => archivo !== "curso.md")
    .map(([archivo, texto]) => {
      const f = frontmatter(texto);
      const numero = Number(f.numero);
      return {
        curso_slug: slug,
        archivo,
        numero,
        titulo: String(f.titulo ?? ""),
        slug: String(f.slug ?? `sesion-${numero}`),
      };
    });

  const { error: eIndice } = await supabase.from("curso_sesiones").insert(indice);
  if (eIndice) return { ok: false, error: `No se pudo guardar el temario: ${eIndice.message}` };

  revalidatePath("/cursos");
  revalidatePath("/panel/cursos");
  revalidatePath(`/cursos/${slug}`, "layout");

  return {
    ok: true,
    detalle: `«${curso.titulo}»: ${curso.lecciones.length} sesiones guardadas. Ya está en línea, sin desplegar.`,
  };
}

/**
 * Crea un curso vacío y lo deja listo para escribir.
 *
 * Nace en borrador y con una sesión de ejemplo dentro: un curso sin ninguna
 * sesión no se puede abrir, y una pantalla que da error nada más crear algo
 * es peor que una que enseña por dónde se empieza.
 *
 * Quien lo crea queda como su autor, cosa que hace un disparador de la base:
 * si dependiera de esta función, un curso creado por otro camino se quedaría
 * sin responsable.
 */
export async function crearCurso(
  _prev: EstadoPublicacion | null,
  formData: FormData,
): Promise<EstadoPublicacion> {
  const usuario = await usuarioActual();
  if (!usuario) return { ok: false, error: "Entra a tu cuenta primero." };

  const titulo = String(formData.get("titulo") ?? "").trim();
  const area = String(formData.get("area") ?? "").trim();
  const nivel = String(formData.get("nivel") ?? "INTRODUCCIÓN").trim();
  const horas = Number(formData.get("horas") ?? 16);
  const precio = Number(formData.get("precio") ?? 20);

  if (titulo.length < 4) return { ok: false, error: "El título es muy corto." };
  if (!area) return { ok: false, error: "Elige un área." };
  if (!Number.isFinite(horas) || horas <= 0) return { ok: false, error: "Las horas no son válidas." };
  if (!Number.isFinite(precio) || precio < 0) return { ok: false, error: "El precio no es válido." };

  // El slug sale del título: sin tildes, en minúsculas y con guiones.
  const slug = titulo
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  if (!slug) return { ok: false, error: "Con ese título no sale una dirección válida." };

  const supabase = await clienteServidor();

  const { data: ocupado } = await supabase
    .from("cursos")
    .select("slug")
    .eq("slug", slug)
    .maybeSingle();
  if (ocupado) return { ok: false, error: `Ya existe un curso en /${slug}.` };

  const { error: eCurso } = await supabase.from("cursos").insert({
    slug,
    titulo,
    resumen: "",
    precio,
    estado: "borrador",
    acceso_libre: false,
    orden: 99,
  });
  if (eCurso) return { ok: false, error: `No se pudo crear: ${eCurso.message}` };

  const fichaMd = [
    "---",
    `slug: ${slug}`,
    `titulo: ${JSON.stringify(titulo)}`,
    'resumen: "Escribe aquí de qué va el curso y para quién es."',
    `area: ${JSON.stringify(area)}`,
    `nivel: ${JSON.stringify(nivel)}`,
    `horas: ${horas}`,
    "---",
    "",
  ].join("\n");

  const sesionMd = [
    "---",
    "numero: 1",
    'titulo: "Primera sesión"',
    "---",
    "",
    "# Empieza por aquí",
    "",
    "Sustituye este texto. Cada encabezado abre una sección del temario y",
    "aparece en el índice lateral.",
    "",
    "```python",
    'print("hola")',
    "```",
    "",
  ].join("\n");

  const { error: eContenido } = await supabase.from("curso_contenido").insert([
    { curso_slug: slug, archivo: "curso.md", contenido: fichaMd },
    { curso_slug: slug, archivo: "sesion-1.md", contenido: sesionMd },
  ]);
  if (eContenido) return { ok: false, error: `No se pudo guardar el esqueleto: ${eContenido.message}` };

  const { error: eIndice } = await supabase.from("curso_sesiones").insert({
    curso_slug: slug,
    archivo: "sesion-1.md",
    numero: 1,
    titulo: "Primera sesión",
    slug: "sesion-1",
  });
  if (eIndice) return { ok: false, error: `No se pudo guardar el temario: ${eIndice.message}` };

  revalidatePath("/panel/cursos");
  revalidatePath("/cursos");

  return {
    ok: true,
    detalle: `Creado en borrador como /${slug}, con una sesión de ejemplo. Edítalo y vuelve a subirlo cuando esté.`,
  };
}
