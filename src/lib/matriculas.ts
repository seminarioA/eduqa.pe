import { clienteServidor, usuarioActual } from "@/lib/supabase/servidor";

export const LIMITE_PLAN_GRATIS = 2;

export type Perfil = {
  id: string;
  nombre: string | null;
  telefono: string | null;
  plan: "gratis" | "pago";
  plan_hasta: string | null;
  es_admin: boolean;
  foto: string | null;
  rol: "alumno" | "profesor" | "gestor" | "desarrollador" | "agente" | "admin";
};

export type Matricula = {
  id: string;
  curso_slug: string;
  estado: "activa" | "completada" | "cancelada";
  creada_en: string;
};

/** Perfil del usuario en sesión, o null si no ha iniciado sesión. */
export async function perfilActual(): Promise<Perfil | null> {
  const usuario = await usuarioActual();
  if (!usuario) return null;

  const supabase = await clienteServidor();
  const { data } = await supabase
    .from("perfiles")
    .select("id, nombre, telefono, plan, plan_hasta, es_admin, foto, rol")
    .eq("id", usuario.id)
    .single();

  return (data as Perfil) ?? null;
}

export async function misMatriculas(): Promise<Matricula[]> {
  const usuario = await usuarioActual();
  if (!usuario) return [];

  const supabase = await clienteServidor();
  const { data } = await supabase
    .from("matriculas")
    .select("id, curso_slug, estado, creada_en")
    .eq("usuario_id", usuario.id)
    .order("creada_en", { ascending: false });

  return (data as Matricula[]) ?? [];
}

/**
 * Comprueba si el usuario en sesión puede abrir un curso.
 * La consulta va con la sesión del usuario, de modo que RLS la respalda:
 * aunque alguien alterara este código, la base seguiría negando el acceso.
 */
export async function estaMatriculado(cursoSlug: string) {
  const usuario = await usuarioActual();
  if (!usuario) return false;

  const supabase = await clienteServidor();
  const { data } = await supabase
    .from("matriculas")
    .select("id")
    .eq("usuario_id", usuario.id)
    .eq("curso_slug", cursoSlug)
    .in("estado", ["activa", "completada"])
    .maybeSingle();

  return Boolean(data);
}

/** Cuántos cursos activos tiene y cuántos le quedan según su plan. */
export function resumenPlan(perfil: Perfil | null, matriculas: Matricula[]) {
  const activas = matriculas.filter((m) => m.estado === "activa").length;
  const ilimitado = perfil?.plan === "pago";
  return {
    activas,
    ilimitado,
    limite: ilimitado ? null : LIMITE_PLAN_GRATIS,
    disponibles: ilimitado ? null : Math.max(0, LIMITE_PLAN_GRATIS - activas),
    alTope: !ilimitado && activas >= LIMITE_PLAN_GRATIS,
  };
}
