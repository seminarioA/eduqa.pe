<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Cómo se escriben los cursos

Un curso es Markdown, no código. Vive en `src/content/<curso>/` y se publica
con una sola línea en `src/lib/cursos.ts`.

- `src/content/FORMATO-CURSO.md` — el formato: qué va en la ficha, cómo se
  marcan código, salidas, notas, citas y ejercicios.
- `LINEAMIENTOS.md` — cómo se redacta: registro, estructura y verificación.
  Ninguna salida de código se escribe a mano, se obtiene ejecutándola.

Los cursos antiguos (`python.ts`, `sqlite.ts`, `redis.ts`, `bioingenieria.ts`)
todavía están en TypeScript. Al tocarlos, conviene pasarlos a Markdown.
