import { buscarCurso } from "@/lib/catalogo-cursos";
import { informacionEditorialCurso } from "@/lib/info-curso";
import { marcaActual } from "@/lib/marca";
import { estaMatriculado, perfilActual } from "@/lib/matriculas";
import { generarPdfInformacionCurso } from "@/lib/pdf-informacion-curso";
import { esAccesoLibre } from "@/lib/precios";
import { rutaDeCadaCurso } from "@/lib/rutas";
import { usuarioActual } from "@/lib/supabase/servidor";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function fecha(valor: string | null) {
  if (!valor) return "No registrada";
  return new Intl.DateTimeFormat("es-PE", {
    dateStyle: "long",
    timeZone: "America/Lima",
  }).format(new Date(valor));
}

function estadoLegible(estado: string) {
  if (estado === "publico") return "Público";
  if (estado === "privado") return "Privado";
  if (estado === "archivado") return "Archivado";
  if (estado === "borrador") return "Borrador";
  return estado;
}

function formatoLegible(formato: string | undefined) {
  if (formato === "microcurso") return "Microcurso";
  if (formato === "pildora") return "Píldora";
  return "Curso";
}

async function svgDeMarca(request: Request) {
  const marca = await marcaActual();
  const personalizado = marca.cabecera ?? marca.sidebar ?? marca.cierre;
  if (personalizado) return personalizado;

  try {
    const respuesta = await fetch(new URL("/llama.svg", request.url), {
      cache: "force-cache",
    });
    if (respuesta.ok) return await respuesta.text();
  } catch {
    // El PDF sigue siendo válido aunque falle el fallback visual.
  }

  return null;
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ curso: string }> },
) {
  const { curso: cursoSlug } = await params;
  const [curso, info, libre, usuario] = await Promise.all([
    buscarCurso(cursoSlug),
    informacionEditorialCurso(cursoSlug),
    esAccesoLibre(cursoSlug),
    usuarioActual(),
  ]);

  if (!curso || !info) {
    return new Response("Curso no encontrado", { status: 404 });
  }

  if (!libre) {
    if (!usuario) {
      return new Response("Autenticación requerida", { status: 401 });
    }

    const perfil = await perfilActual();
    if (!perfil?.es_admin && !(await estaMatriculado(cursoSlug))) {
      return new Response("Matrícula requerida", { status: 403 });
    }
  }

  const [ruta, logoSvg] = await Promise.all([
    rutaDeCadaCurso().then((rutas) => rutas.get(cursoSlug)),
    svgDeMarca(request),
  ]);

  const requisitos =
    info.requisitos.length > 0
      ? info.requisitos.map((requisito) => requisito.nombre).join(" · ")
      : "Sin prerrequisitos";

  const pdf = await generarPdfInformacionCurso({
    titulo: curso.titulo,
    resumen: curso.resumen,
    logoSvg,
    ficha: [
      { etiqueta: "Título", valor: curso.titulo },
      { etiqueta: "Código editorial", valor: info.codigo ?? "Sin código" },
      { etiqueta: "Revisión", valor: String(info.revision) },
      { etiqueta: "Área", valor: curso.area },
      { etiqueta: "Nivel", valor: curso.nivel },
      { etiqueta: "Formato", valor: formatoLegible(curso.formato) },
      { etiqueta: "Duración", valor: `${curso.horas} horas` },
      {
        etiqueta: "Sesiones",
        valor: `${curso.lecciones.length} ${curso.lecciones.length === 1 ? "sesión" : "sesiones"}`,
      },
      { etiqueta: "Estado", valor: estadoLegible(info.estado) },
      {
        etiqueta: "Acceso",
        valor: info.acceso_libre ? "Acceso libre" : "Requiere matrícula",
      },
      {
        etiqueta: "Precio individual",
        valor: info.acceso_libre
          ? "Acceso libre"
          : `S/ ${info.precio.toFixed(2)}`,
      },
      {
        etiqueta: "Ruta de aprendizaje",
        valor: ruta?.nombre ?? "Sin ruta asignada",
      },
      {
        etiqueta: "Posición en la ruta",
        valor: info.posicion === null ? "No aplica" : String(info.posicion),
      },
      { etiqueta: "Prerrequisitos", valor: requisitos },
    ],
    trazabilidad: [
      {
        etiqueta: "Creación",
        valor: `Creado por: ${info.creado_por_nombre ?? "No registrado"} · Fecha: ${fecha(info.creado_en)}`,
      },
      {
        etiqueta: "Aprobación",
        valor: `Aprobado por: ${info.aprobado_por_nombre ?? "No registrado"} · Fecha: ${fecha(info.aprobado_en)}`,
      },
      {
        etiqueta: "Publicación",
        valor: `Fecha: ${fecha(info.publicado_en)}`,
      },
      {
        etiqueta: "Actualización",
        valor: `Fecha: ${fecha(info.actualizado_en)}`,
      },
    ],
    lecciones: curso.lecciones.map((leccion) => ({
      numero: leccion.numero,
      titulo: leccion.titulo,
      secciones: leccion.secciones.map((seccion) => ({
        titulo: seccion.titulo,
      })),
    })),
    ruta: ruta
      ? `Este curso ocupa la posición ${ruta.posicion} de ${ruta.de} en ${ruta.nombre}.`
      : null,
  });

  const cuerpo = pdf.buffer.slice(
    pdf.byteOffset,
    pdf.byteOffset + pdf.byteLength,
  ) as ArrayBuffer;

  return new Response(cuerpo, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${curso.slug}-informacion.pdf"`,
      "Cache-Control": "private, no-store",
    },
  });
}
