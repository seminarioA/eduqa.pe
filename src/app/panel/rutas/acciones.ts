"use server";

import { perfilActual } from "@/lib/matriculas";
import {
  crearRutaBD,
  actualizarRutaBD,
  eliminarRutaBD,
  asignarCursoARutaBD,
} from "@/lib/rutas-bd";

async function exigirAdmin() {
  const perfil = await perfilActual();
  if (!perfil?.es_admin) {
    throw new Error("No tienes permisos de administrador para realizar esta acción.");
  }
}

export async function accionCrearRuta(formData: FormData) {
  await exigirAdmin();

  const slug = String(formData.get("slug") ?? "").trim();
  const nombre = String(formData.get("nombre") ?? "").trim();
  const descripcion = String(formData.get("descripcion") ?? "").trim();
  const orden = Number(formData.get("orden") ?? 0);

  if (!slug || !nombre) {
    throw new Error("El slug y el nombre de la ruta son obligatorios.");
  }

  await crearRutaBD({
    slug,
    nombre,
    descripcion: descripcion || null,
    orden,
  });
}

export async function accionActualizarRuta(formData: FormData) {
  await exigirAdmin();

  const slug = String(formData.get("slug") ?? "").trim();
  const nombre = String(formData.get("nombre") ?? "").trim();
  const descripcion = String(formData.get("descripcion") ?? "").trim();
  const orden = Number(formData.get("orden") ?? 0);

  if (!slug || !nombre) {
    throw new Error("El slug y el nombre de la ruta son obligatorios.");
  }

  await actualizarRutaBD(slug, {
    nombre,
    descripcion: descripcion || null,
    orden,
  });
}

export async function accionEliminarRuta(slug: string) {
  await exigirAdmin();
  if (!slug) throw new Error("Slug inválido.");
  await eliminarRutaBD(slug);
}

export async function accionAsignarCursoARuta(formData: FormData) {
  await exigirAdmin();

  const cursoSlug = String(formData.get("cursoSlug") ?? "").trim();
  const rutaSlug = String(formData.get("rutaSlug") ?? "").trim() || null;
  const posicion = Number(formData.get("posicion") ?? 1);
  const requisitosRaw = String(formData.get("requisitos") ?? "").trim();
  const requisitos = requisitosRaw
    ? requisitosRaw
        .split(",")
        .map((r) => r.trim())
        .filter(Boolean)
    : [];

  if (!cursoSlug) throw new Error("Debes indicar un curso.");

  await asignarCursoARutaBD({
    cursoSlug,
    rutaSlug,
    posicion,
    requisitos,
  });
}
