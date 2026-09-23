import "server-only";

import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { construirCurso } from "@/lib/curso-markdown";
import type { Curso } from "@/lib/curso-tipos";

/**
 * Utilidades exclusivamente editoriales/de prueba para leer paquetes Markdown
 * que todavía están en el árbol de trabajo.
 *
 * La aplicación desplegada no importa este módulo y nunca lo usa como fallback.
 * La fuente de cursos en runtime es Supabase.
 */
const RAIZ = join(process.cwd(), "src", "content");

export function cargarCurso(carpeta: string, raiz = RAIZ): Curso {
  const dir = join(raiz, carpeta);
  const archivos = new Map(
    readdirSync(dir)
      .filter((f) => f.endsWith(".md"))
      .map((f) => [f, readFileSync(join(dir, f), "utf8")] as const),
  );
  return construirCurso(carpeta, archivos);
}

export function cargarCursosLocales(raiz = RAIZ): Curso[] {
  return readdirSync(raiz, { withFileTypes: true })
    .filter((entrada) => entrada.isDirectory() && existsSync(join(raiz, entrada.name, "curso.md")))
    .map((entrada) => entrada.name)
    .sort()
    .map((carpeta) => cargarCurso(carpeta, raiz));
}
