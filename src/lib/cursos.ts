/**
 * Registro de cursos publicados.
 *
 * Los tipos y las utilidades viven en `curso-tipos.ts` y se reexportan desde
 * aquí, para que el resto de la aplicación siga importando de un solo sitio.
 */
export * from "@/lib/curso-tipos";

import leccionesDataEng from "@/content/data-engineering.json";
import { leccionesPython } from "@/content/python";
import { leccionesSqlite } from "@/content/sqlite";
import { leccionesRedis, PRELUDIO_REDIS } from "@/content/redis";
import { leccionesBio } from "@/content/bioingenieria";
import { cargarCurso } from "@/lib/curso-markdown";
import type { Curso, Leccion } from "@/lib/curso-tipos";
import type { IconoNombre } from "@/components/Iconos";

export const cursos: Curso[] = [
  {
    slug: "python",
    icono: "python",
    titulo: "Introducción a Python",
    area: "Lenguajes",
    resumen:
      "Los fundamentos del lenguaje, un concepto por vez. Cada ejemplo enlaza a la documentación oficial de Python.",
    nivel: "INTRODUCCIÓN",
    horas: 16,
    lecciones: leccionesPython,
  },
  {
    slug: "sqlite",
    icono: "sqlite",
    titulo: "Introducción a SQLite con Python",
    area: "Bases de Datos",
    resumen:
      "El motor, el lenguaje SQL y el módulo sqlite3 de la biblioteca estándar. Cita la documentación de Python y la de sqlite.org.",
    nivel: "INTRODUCCIÓN",
    horas: 16,
    lecciones: leccionesSqlite,
  },
  // El contenido y la ficha viven en src/content/ia-generativa/*.md.
  cargarCurso("ia-generativa"),
  cargarCurso("farmacologia"),
  // El contenido vive en src/content/polars/*.md.
  cargarCurso("polars"),
  // El contenido vive en src/content/algebra/*.md.
  cargarCurso("algebra"),
  // El contenido vive en src/content/conjuntos/*.md.
  cargarCurso("conjuntos"),
  // El contenido vive en src/content/vectorial/*.md.
  cargarCurso("vectorial"),
  // El contenido vive en src/content/docker/*.md.
  cargarCurso("docker"),
  // El contenido vive en src/content/docker-intermedio/*.md.
  cargarCurso("docker-intermedio"),
  {
    slug: "python-bioingenieria",
    icono: "python",
    titulo: "Introducción a Python aplicado a la bioingeniería",
    resumen:
      "Python desde cero con datos del cuerpo: constantes vitales, series de medidas y señales biomédicas. Termina detectando latidos en un electrocardiograma.",
    area: "Bioingeniería",
    nivel: "INTRODUCCIÓN",
    horas: 16,
    lecciones: leccionesBio,
  },
  {
    slug: "redis",
    icono: "redis",
    titulo: "Introducción a Redis con Python",
    resumen:
      "Claves, listas, hashes, conjuntos y caché, con el cliente oficial redis-py. Cada punto trae su ejercicio ejecutable.",
    area: "Bases de Datos",
    nivel: "INTRODUCCIÓN",
    horas: 16,
    // El código corre contra fakeredis, que implementa la misma interfaz de
    // redis-py en memoria: no hace falta servidor y lo que se escribe vale
    // sin cambios contra un Redis de verdad.
    paquetes: ["fakeredis"],
    preludio: PRELUDIO_REDIS,
    lecciones: leccionesRedis,
  },
  {
    slug: "data-engineering",
    titulo: "Introducción a la Ingeniería de Datos",
    area: "Ingeniería de Datos",
    resumen:
      "De variables de Python a un pipeline ETL completo con SQL y KPIs. Cuatro sesiones, todo el código ejecutable.",
    nivel: "INTRODUCCIÓN",
    horas: 16,
    icono: "pandas",
    lecciones: leccionesDataEng as Leccion[],
  },
];

export function buscarCurso(slug: string) {
  return cursos.find((c) => c.slug === slug);
}

export function buscarLeccion(cursoSlug: string, leccionSlug: string) {
  const curso = buscarCurso(cursoSlug);
  if (!curso) return null;
  const i = curso.lecciones.findIndex((l) => l.slug === leccionSlug);
  if (i === -1) return null;
  return {
    curso,
    leccion: curso.lecciones[i],
    anterior: i > 0 ? curso.lecciones[i - 1] : null,
    siguiente: i < curso.lecciones.length - 1 ? curso.lecciones[i + 1] : null,
  };
}
