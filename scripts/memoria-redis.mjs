#!/usr/bin/env node

/**
 * Script CLI de sincronización de memoria compartida para EDUQA.PE
 * Permite guardar, recuperar o generar el prompt de arranque de contexto
 * conectándose a Redis / Upstash (si REDIS_URL o UPSTASH_REDIS_REST_URL están definidos)
 * o usando almacenamiento de respaldo local seguro en memoria-contexto.json.
 *
 * Uso:
 *   node scripts/memoria-redis.mjs --guardar
 *   node scripts/memoria-redis.mjs --recuperar
 *   node scripts/memoria-redis.mjs --prompt
 */

import { writeFileSync, readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const ARCHIVO_MEMORIA_LOCAL = join(process.cwd(), "memoria-contexto.json");
const CLAVE_REDIS = "eduqa:contexto_ia:v2";

const SNAPSHOT_ACTUAL = {
  timestamp: new Date().toISOString(),
  version: "2.1.0",
  proyecto: {
    nombre: "EDUQA.PE",
    url_produccion: "https://eduqa-pe.vercel.app",
    repo: "seminarioA/eduqa.pe",
    descripcion:
      "Plataforma educativa de ingeniería, IA, Big Data, Bioinformática y Matemáticas para LATAM con ejercicios interactivos y certificaciones verificables.",
  },
  arquitectura: {
    framework: "Next.js 16 (App Router, Server Components & Actions)",
    lenguajes: ["TypeScript 5", "React 19"],
    estilos: ["Tailwind CSS 4", "Lucide Icons", "React Icons"],
    baseDatos: "Supabase PostgreSQL con RLS y políticas de acceso",
    autenticacion: "@supabase/ssr con sesiones seguras en cookies",
  },
  modulos_recientes: [
    {
      nombre: "Clasificación de Formatos & Microcursos",
      descripcion:
        "Soporte para cursos regulares, microcursos intensivos y píldoras técnicas. Reclasificación de transformers-atencionales.",
      archivos_clave: [
        "src/lib/curso-tipos.ts",
        "src/lib/curso-markdown.ts",
        "src/content/transformers-atencionales/curso.md",
        "src/app/cursos/TarjetaCursoMatricula.tsx",
      ],
    },
    {
      nombre: "Blog Sincronizado con Medium",
      descripcion:
        "Lector RSS sin artículos ficticios, revalidación bajo demanda, catálogo público (/blog), lector (/blog/[slug]) y panel admin (/panel/blog).",
      archivos_clave: [
        "src/lib/blog-medium.ts",
        "src/components/BlogCard.tsx",
        "src/app/blog/page.tsx",
        "src/app/blog/[slug]/page.tsx",
        "src/app/panel/blog/page.tsx",
      ],
    },
    {
      nombre: "Panel de Gestión Modular & Rutas de Aprendizaje",
      descripcion:
        "Separación del panel en hub administrativo y gestión individual de Cursos (/panel/cursos), Rutas (/panel/rutas) y Blog (/panel/blog).",
      archivos_clave: [
        "src/lib/rutas-bd.ts",
        "src/app/panel/page.tsx",
        "src/app/panel/TarjetaGestion.tsx",
        "src/app/panel/cursos/page.tsx",
        "src/app/panel/rutas/page.tsx",
        "src/app/panel/rutas/FormularioRuta.tsx",
      ],
    },
  ],
  formatos_cursos: {
    tipos: ["curso", "microcurso", "pildora"],
    microcurso_destacado: {
      slug: "transformers-atencionales",
      titulo: "Microcurso: Transformers y Mecanismos de Atención",
      horas: 40,
    },
  },
  blog: {
    origen: "Medium RSS Feed",
    canal: "https://medium.com/@seminarioA",
    estrategia_cache: "next: { revalidate: 3600, tags: ['medium-blog'] }",
    rutas: ["/blog", "/blog/[slug]", "/panel/blog"],
  },
  comandos_utiles: {
    desarrollo: "npm run dev",
    compilacion: "npm run build",
    chequeo_tipos: "npm run typecheck",
    guardar_memoria: "npm run memoria:guardar",
    recuperar_memoria: "npm run memoria:recuperar",
    prompt_ia: "npm run memoria:prompt",
  },
};

function generarPrompt(snapshot = SNAPSHOT_ACTUAL) {
  return `
================================================================================
🚀 PROMPT DE RESTAURACIÓN DE CONTEXTO EDUQA.PE (COPIAR Y PEGAR EN NUEVA IA)
================================================================================

Adquiere contexto del repositorio **${snapshot.proyecto.repo}** y sitio oficial **${snapshot.proyecto.url_produccion}**:

1. **Arquitectura y Stack:**
   - Framework: ${snapshot.arquitectura.framework}
   - Frontend: ${snapshot.arquitectura.lenguajes.join(", ")}, ${snapshot.arquitectura.estilos.join(", ")}
   - DB & Auth: ${snapshot.arquitectura.baseDatos} (${snapshot.arquitectura.autenticacion})

2. **Nuevos Módulos y Cambios Clave Implementados:**
   - **Formatos:** Soporte para \`"curso" | "microcurso" | "pildora"\`. El curso \`transformers-atencionales\` ahora es un Microcurso de 40h de alta intensidad.
   - **Blog Medium:** Sección pública en \`/blog\` y \`/blog/[slug]\` con lector RSS de \`${snapshot.blog.canal}\`, revalidación bajo demanda y conversión a cursos.
   - **Panel Modular:** \`/panel\` modularizado en Gestión de Cursos (\`/panel/cursos\`), Gestión de Rutas (\`/panel/rutas\`), Blog (\`/panel/blog\`), Avisos (\`/panel/avisos\`), Reportes (\`/panel/reportes\`) y Marca (\`/panel/marca\`).
   - **Rutas de Aprendizaje:** Sistema interactivo de secuencias de cursos con prerrequisitos en Supabase (\`rutas\`).

3. **Instrucción:** Continúa con el desarrollo y mantenimiento del código siguiendo estas directrices arquitectónicas.
================================================================================
`.trim();
}

async function guardarEnRedis(datos) {
  const upstashUrl = process.env.UPSTASH_REDIS_REST_URL;
  const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (upstashUrl && upstashToken) {
    try {
      const res = await fetch(`${upstashUrl}/set/${CLAVE_REDIS}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${upstashToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(datos),
      });
      if (res.ok) {
        console.log("✅ Contexto guardado exitosamente en Upstash Redis remoto.");
        return true;
      }
    } catch (e) {
      console.warn("⚠️ No se pudo conectar a Upstash Redis:", e.message);
    }
  }
  return false;
}

async function recuperarDeRedis() {
  const upstashUrl = process.env.UPSTASH_REDIS_REST_URL;
  const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (upstashUrl && upstashToken) {
    try {
      const res = await fetch(`${upstashUrl}/get/${CLAVE_REDIS}`, {
        headers: { Authorization: `Bearer ${upstashToken}` },
      });
      if (res.ok) {
        const json = await res.json();
        if (json.result) {
          const parsed = typeof json.result === "string" ? JSON.parse(json.result) : json.result;
          console.log("✅ Contexto recuperado exitosamente desde Upstash Redis.");
          return parsed;
        }
      }
    } catch (e) {
      console.warn("⚠️ No se pudo recuperar de Upstash Redis:", e.message);
    }
  }
  return null;
}

async function main() {
  const args = process.argv.slice(2);
  const comando = args[0] || "--prompt";

  if (comando === "--guardar") {
    writeFileSync(ARCHIVO_MEMORIA_LOCAL, JSON.stringify(SNAPSHOT_ACTUAL, null, 2), "utf8");
    console.log(`💾 Contexto respaldado localmente en ${ARCHIVO_MEMORIA_LOCAL}`);
    await guardarEnRedis(SNAPSHOT_ACTUAL);
  } else if (comando === "--recuperar") {
    let datos = await recuperarDeRedis();
    if (!datos && existsSync(ARCHIVO_MEMORIA_LOCAL)) {
      datos = JSON.parse(readFileSync(ARCHIVO_MEMORIA_LOCAL, "utf8"));
      console.log(`📂 Contexto cargado desde archivo local ${ARCHIVO_MEMORIA_LOCAL}`);
    }
    if (datos) {
      console.log(JSON.stringify(datos, null, 2));
    } else {
      console.error("❌ No se encontró ningún contexto en Redis ni localmente.");
    }
  } else if (comando === "--prompt") {
    console.log(generarPrompt(SNAPSHOT_ACTUAL));
  } else {
    console.log("Uso: node scripts/memoria-redis.mjs [--guardar | --recuperar | --prompt]");
  }
}

main().catch(console.error);
