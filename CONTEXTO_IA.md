# 🧠 MEMORIA DE CONTEXTO EDUQA.PE (COMPARTIDA / REDIS)

Documento vivo y máquina de estado para sincronizar cualquier instancia de IA o cambio de proveedor (Claude, Gemini, OpenAI, DeepSeek, Antigravity) sin pérdida de contexto.

---

## 📌 1. Identidad y Propósito del Proyecto
- **Proyecto:** EDUQA.PE (`https://eduqa-pe.vercel.app` / `seminarioA/eduqa.pe`).
- **Naturaleza:** Plataforma educativa de ingeniería, IA, Big Data, Bioinformática y Matemáticas para Perú y LATAM.
- **Stack Tecnológico:**
  - **Framework:** Next.js 16 (App Router, Server Components, Server Actions).
  - **Lenguaje:** TypeScript 5, React 19.
  - **Estilos:** Tailwind CSS 4, Lucide Icons, React Icons.
  - **Base de Datos & Auth:** Supabase (`@supabase/ssr`, PostgreSQL, RLS, sesiones con cookies).
  - **Cursos en Markdown:** `src/content/[slug]/` con frontmatter YAML, bloques de teoría, código, diagramas de Venn, ejecuciones interactivas.
  - **Pasarela & Pagos:** Yape / Plin / Tarjetas (en soles PEN `S/`).
  - **Despliegue:** Vercel CI/CD enlazado a `seminarioA/eduqa.pe` (rama `main`).

---

## 🚀 2. Estado Actual de la Arquitectura & Nuevos Módulos (Septiembre 2026)

### A. Clasificación de Formatos & Microcurso de Transformers
- **Tipos de Contenido (`FormatoCurso`):** `"curso"` | `"microcurso"` | `"pildora"`.
- **Transformers:** `src/content/transformers-atencionales/curso.md` reclasificado como **Microcurso** (`formato: microcurso`) con badge visual de atención en catálogo y panel.

### B. Módulo de Blog Sincronizado con Medium
- **Lector RSS en Servidor:** `src/lib/blog-medium.ts` lee de `https://medium.com/feed/@seminarioA` con fallback a artículos técnicos de respaldo y revalidación de caché (`next: { revalidate: 3600, tags: ["medium-blog"] }`).
- **Rutas Públicas:**
  - `/blog`: Catálogo con artículo destacado, pills de filtros por categoría y grid responsivo.
  - `/blog/[slug]`: Lector completo con enlace canónico a Medium y banner de conversión hacia cursos de EDUQA.PE.
- **Gestión Admin:** `/panel/blog` con estado de sincronización y botón para purgar caché instantáneamente (`revalidateTag("medium-blog")`).

### C. Panel de Gestión Modular (`/panel`)
- **Hub Central:** `/panel/page.tsx` separado en vista de Alumno (avance) y Hub de Gestión de Administrador.
- **Subsecciones Especializadas:**
  1. `/panel/cursos`: Publicación de cursos Markdown, fijación de precios PEN, visibilidad.
  2. `/panel/rutas`: Gestión integral de Rutas de Aprendizaje (`rutas`), reordenamiento y asignación de prerrequisitos.
  3. `/panel/blog`: Monitor de sincronización con Medium.
  4. `/panel/avisos`: Anuncios y banners globales.
  5. `/panel/reportes`: Incidencias y feedback técnico.
  6. `/panel/marca`: Personalización gráfica y logos SVG.

---

## 🔄 3. Comandos de Memoria & Respaldo

Para restaurar o volcar el contexto completo en una sola orden:

```bash
# 1. Volcar estado actual a Redis / JSON local:
npm run memoria:guardar

# 2. Generar el prompt de arranque para pegar en cualquier IA nueva:
npm run memoria:prompt

# 3. Descargar el estado desde Redis a local:
npm run memoria:recuperar
```
