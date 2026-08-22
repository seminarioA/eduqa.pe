"use server";

import { revalidatePath } from "next/cache";
import { clienteServidor, usuarioActual } from "@/lib/supabase/servidor";
import { perfilActual } from "@/lib/matriculas";

export type EstadoReporte = { ok: boolean; error?: string };

const MAX_ADJUNTO = 5 * 1024 * 1024;
const TIPOS_PERMITIDOS = [
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/gif",
  "text/plain",
  "application/json",
  "application/pdf",
];

/**
 * Registra un reporte de error.
 *
 * Lo puede enviar cualquiera con sesión: si un alumno tropieza con un fallo,
 * es quien mejor puede describirlo. El `origen` no viene del formulario sino
 * del perfil de quien envía, porque un cliente puede mandar lo que quiera y
 * de ahí depende cómo se prioriza después.
 *
 * Los adjuntos van a un bucket privado, en una carpeta por usuario: una
 * captura de pantalla puede tener datos de otra persona a la vista.
 */
export async function crearReporte(
  _prev: EstadoReporte | null,
  formData: FormData,
): Promise<EstadoReporte> {
  const descripcion = String(formData.get("descripcion") ?? "").trim();
  const ruta = String(formData.get("ruta") ?? "").trim() || null;
  const navegador = String(formData.get("navegador") ?? "").trim() || null;

  if (descripcion.length < 10)
    return { ok: false, error: "Cuéntanos un poco más de lo que pasó." };
  if (descripcion.length > 4000)
    return { ok: false, error: "El texto es demasiado largo." };

  const usuario = await usuarioActual();
  if (!usuario) return { ok: false, error: "Entra a tu cuenta primero." };

  const perfil = await perfilActual();
  const supabase = await clienteServidor();

  const archivos = formData
    .getAll("adjuntos")
    .filter((a): a is File => a instanceof File && a.size > 0);

  const rutas: string[] = [];
  for (const archivo of archivos) {
    if (archivo.size > MAX_ADJUNTO)
      return { ok: false, error: "Cada archivo debe pesar menos de 5 MB." };
    if (!TIPOS_PERMITIDOS.includes(archivo.type))
      return { ok: false, error: "Solo admitimos imágenes, PDF o texto." };

    // El nombre original se descarta: puede traer caracteres que rompan la
    // ruta o chocar con otro archivo. Solo se conserva la extensión. La
    // carpeta lleva el id del usuario porque la política de Storage exige
    // que el primer tramo de la ruta coincida con quien sube.
    const extension = archivo.name.split(".").pop()?.toLowerCase() ?? "png";
    const destino = `${usuario.id}/${crypto.randomUUID()}.${extension}`;

    const { error } = await supabase.storage
      .from("reportes")
      .upload(destino, archivo, { contentType: archivo.type });

    if (error) {
      console.error("[crearReporte:subir]", error);
      return { ok: false, error: "No pudimos subir uno de los archivos." };
    }
    rutas.push(destino);
  }

  // El título no se pide: se toma la primera línea del cuerpo para que la
  // bandeja se pueda ojear sin abrir cada reporte.
  const titulo = descripcion.split("\n")[0].slice(0, 110);

  const { error } = await supabase.from("reportes").insert({
    autor_id: usuario.id,
    titulo,
    descripcion,
    ruta,
    navegador,
    adjuntos: rutas,
    origen: perfil?.es_admin ? "admin" : "alumno",
  });

  if (error) {
    console.error("[crearReporte]", error);
    return { ok: false, error: "No pudimos enviar el reporte." };
  }

  revalidatePath("/panel/reportes");
  return { ok: true };
}
