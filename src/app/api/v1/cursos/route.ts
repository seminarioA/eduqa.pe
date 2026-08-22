import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { construirCurso } from "@/lib/curso-markdown";
import { PREFIJO, resumir } from "@/lib/claves-api";

/**
 * Publica o actualiza un curso.
 *
 * Recibe los archivos Markdown del curso, los valida construyendo el temario y
 * los guarda. Es la misma operación que hace el panel, expuesta para que un
 * proceso externo —o un agente— pueda publicar sin abrir el navegador.
 *
 * La autenticación va por clave en la cabecera `Authorization`. La clave no se
 * guarda: se compara su resumen contra el de `claves_api`.
 */

type Cuerpo = { slug?: string; archivos?: Record<string, string> };

const error = (estado: number, mensaje: string, detalle?: unknown) =>
  NextResponse.json({ ok: false, error: mensaje, detalle }, { status: estado });

export async function POST(peticion: Request) {
  const cabecera = peticion.headers.get("authorization") ?? "";
  const clave = cabecera.startsWith("Bearer ") ? cabecera.slice(7).trim() : "";
  if (!clave.startsWith(PREFIJO)) {
    return error(401, "Falta la cabecera Authorization con una clave válida.");
  }

  // El cliente se crea con la clave publicable; la autorización de escritura
  // la concede la política de `claves_api`, no esta comprobación.
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  );

  const { data: registro } = await supabase
    .rpc("autorizar_clave_api", { p_resumen: resumir(clave) })
    .single<{ usuario_id: string }>();

  if (!registro) return error(401, "Clave desconocida o revocada.");

  let cuerpo: Cuerpo;
  try {
    cuerpo = (await peticion.json()) as Cuerpo;
  } catch {
    return error(400, "El cuerpo debe ser JSON.");
  }

  const archivos = cuerpo.archivos ?? {};
  const nombres = Object.keys(archivos);
  if (nombres.length === 0) return error(400, "No llegó ningún archivo.");
  if (!nombres.includes("curso.md")) {
    return error(400, "Falta curso.md, que es la ficha del curso.");
  }
  if (nombres.length < 2) {
    return error(400, "Un curso necesita al menos una sesión además de la ficha.");
  }
  for (const nombre of nombres) {
    if (!nombre.endsWith(".md")) return error(400, `«${nombre}» no es un archivo .md.`);
    if (nombre.includes("/")) return error(400, `«${nombre}» no puede llevar rutas.`);
  }

  const mapa = new Map(Object.entries(archivos));

  // Se construye antes de guardar: un temario mal escrito se rechaza aquí y no
  // cuando un alumno abra la página.
  let curso;
  try {
    curso = construirCurso(cuerpo.slug ?? "curso", mapa);
  } catch (e) {
    return error(422, "El curso no se pudo leer.", (e as Error).message);
  }

  const slug = (cuerpo.slug ?? curso.slug).trim();
  if (!/^[a-z0-9-]+$/.test(slug)) {
    return error(400, "El slug solo admite minúsculas, números y guiones.");
  }

  const { error: eGuardado } = await supabase.rpc("publicar_curso_por_api", {
    p_resumen: resumir(clave),
    p_slug: slug,
    p_titulo: curso.titulo,
    p_resumen_curso: curso.resumen,
    p_archivos: archivos,
    p_sesiones: curso.lecciones.map((l) => ({
      archivo: [...mapa.keys()].find(
        (n) => n !== "curso.md" && n.includes(l.slug.replace(/[^a-z0-9-]/g, "")),
      ) ?? `${l.slug}.md`,
      numero: l.numero,
      titulo: l.titulo,
      slug: l.slug,
    })),
  });

  if (eGuardado) return error(500, "No se pudo guardar el curso.", eGuardado.message);

  return NextResponse.json({
    ok: true,
    slug,
    titulo: curso.titulo,
    sesiones: curso.lecciones.map((l) => ({ numero: l.numero, slug: l.slug, titulo: l.titulo })),
    bloques: curso.lecciones.reduce((n, l) => n + l.bloques.length, 0),
    estado: "borrador",
    mensaje: "Guardado. Se publica desde el panel cuando esté revisado.",
  });
}
