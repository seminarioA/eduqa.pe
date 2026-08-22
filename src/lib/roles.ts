import type { Perfil } from "@/lib/matriculas";

/** Roles con acceso a la sección de recursos internos. */
export const ROLES_INTERNOS = [
  "profesor",
  "gestor",
  "desarrollador",
  "agente",
  "admin",
] as const;

export const NOMBRE_ROL: Record<string, string> = {
  alumno: "Alumno",
  profesor: "Profesor",
  gestor: "Gestor",
  desarrollador: "Desarrollador",
  agente: "Agente de IA",
  admin: "Administrador",
};

/**
 * Si el perfil pertenece al equipo.
 *
 * Se conserva `es_admin` además del rol porque las cuentas anteriores a la
 * introducción de roles lo tienen puesto, y quitarles el acceso al migrar
 * habría sido un efecto que nadie pidió.
 */
export function esInterno(perfil: Perfil | null): boolean {
  if (!perfil) return false;
  return perfil.es_admin || (ROLES_INTERNOS as readonly string[]).includes(perfil.rol);
}

/** Quien puede emitir claves de API y publicar cursos por ella. */
export function puedeIntegrar(perfil: Perfil | null): boolean {
  if (!perfil) return false;
  return (
    perfil.es_admin ||
    ["desarrollador", "agente", "gestor", "admin"].includes(perfil.rol)
  );
}
