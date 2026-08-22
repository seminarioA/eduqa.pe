"use client";

// react-icons usa contexto interno, así que no puede renderizarse en Server Components.
// Todo lo que dibuje un logo de marca vive detrás de este archivo.

import type { ComponentType } from "react";
import { FaLinkedin } from "react-icons/fa6";
import {
  SiDocker,
  SiFastapi,
  SiGithub,
  SiGithubactions,
  SiGooglegemini,
  SiHuggingface,
  SiInstagram,
  SiLinux,
  SiMedium,
  SiN8N,
  SiNotebooklm,
  SiOpencv,
  SiOrcid,
  SiPandas,
  SiPostgresql,
  SiPython,
  SiPytorch,
  SiRedis,
  SiResearchgate,
  SiScikitlearn,
  SiSqlite,
  SiSubstack,
  SiSupabase,
  SiTiktok,
  SiX,
  SiYoutube,
} from "react-icons/si";
// Regla: solo logos reales de productos. Prohibido el glifo genérico —
// si un curso no es sobre un producto concreto, va SIN icono.
export type IconoNombre =
  | "docker"
  | "fastapi"
  | "githubactions"
  | "gemini"
  | "huggingface"
  | "pandas"
  | "postgresql"
  | "python"
  | "pytorch"
  | "scikitlearn"
  | "opencv"
  | "linux"
  | "n8n"
  | "notebooklm"
  | "redis"
  | "sqlite"
  | "supabase";

const MAPA: Record<IconoNombre, ComponentType<{ className?: string }>> = {
  docker: SiDocker,
  fastapi: SiFastapi,
  githubactions: SiGithubactions,
  gemini: SiGooglegemini,
  huggingface: SiHuggingface,
  pandas: SiPandas,
  postgresql: SiPostgresql,
  python: SiPython,
  pytorch: SiPytorch,
  scikitlearn: SiScikitlearn,
  opencv: SiOpencv,
  linux: SiLinux,
  n8n: SiN8N,
  notebooklm: SiNotebooklm,
  redis: SiRedis,
  sqlite: SiSqlite,
  supabase: SiSupabase,
};

export function Icono({
  nombre,
  className,
}: {
  nombre: IconoNombre;
  className?: string;
}) {
  const C = MAPA[nombre];
  return <C className={className} aria-hidden="true" />;
}

export function IconoLinkedin({ className }: { className?: string }) {
  return <FaLinkedin className={className} aria-hidden="true" />;
}

/** Redes del perfil. Para añadir una, basta con sumar la clave y su componente. */
export type RedNombre =
  | "linkedin"
  | "github"
  | "instagram"
  | "x"
  | "youtube"
  | "tiktok"
  | "substack"
  | "medium"
  | "researchgate"
  | "orcid";

const REDES: Record<RedNombre, ComponentType<{ className?: string }>> = {
  linkedin: FaLinkedin,
  github: SiGithub,
  instagram: SiInstagram,
  x: SiX,
  youtube: SiYoutube,
  tiktok: SiTiktok,
  substack: SiSubstack,
  medium: SiMedium,
  researchgate: SiResearchgate,
  orcid: SiOrcid,
};

export function IconoRed({
  nombre,
  className,
}: {
  nombre: RedNombre;
  className?: string;
}) {
  const C = REDES[nombre];
  return <C className={className} aria-hidden="true" />;
}

/** Tecnologías que aparecen en las clases. Edita esta lista a gusto. */
export const stack: { nombre: string; icono: IconoNombre }[] = [
  { nombre: "Python", icono: "python" },
  { nombre: "PyTorch", icono: "pytorch" },
  { nombre: "OpenCV", icono: "opencv" },
  { nombre: "scikit-learn", icono: "scikitlearn" },
  { nombre: "pandas", icono: "pandas" },
  { nombre: "FastAPI", icono: "fastapi" },
  { nombre: "PostgreSQL", icono: "postgresql" },
  { nombre: "Supabase", icono: "supabase" },
  { nombre: "Docker", icono: "docker" },
  { nombre: "GitHub Actions", icono: "githubactions" },
  { nombre: "Linux", icono: "linux" },
  { nombre: "n8n", icono: "n8n" },
];

export function Stack() {
  return (
    <ul className="grid grid-cols-3 gap-x-4 gap-y-6 sm:grid-cols-4 md:grid-cols-6">
      {stack.map((t) => (
        <li key={t.nombre} className="flex flex-col items-center gap-2 text-center">
          <Icono nombre={t.icono} className="size-8 text-texto-suave" />
          <span className="text-xs leading-tight text-texto-tenue">{t.nombre}</span>
        </li>
      ))}
    </ul>
  );
}
