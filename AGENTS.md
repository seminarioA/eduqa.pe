<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Cómo se escriben los cursos

Un curso es Markdown, no código. Se publica desde `/panel/cursos` en Supabase,
sin modificar TypeScript ni volver a desplegar. Las carpetas con `curso.md`
en `src/content/<curso>/` se descubren automáticamente como respaldo local;
los cambios en ese respaldo sí requieren un despliegue.

- `src/content/FORMATO-CURSO.md` — el formato: qué va en la ficha, cómo se
  marcan código, salidas, notas, citas y ejercicios.
- `LINEAMIENTOS.md` — cómo se redacta: registro, estructura y verificación.
  Ninguna salida de código se escribe a mano, se obtiene ejecutándola.

Los cursos antiguos (`python.ts`, `sqlite.ts`, `redis.ts`, `bioingenieria.ts`)
todavía están en TypeScript. Al tocarlos, conviene pasarlos a Markdown.

# Calidad y verificación obligatoria

- Entregar un archivo o completar una implementación no equivale a terminar la tarea.
- Toda modificación debe pasar por un bucle de comprobación: ejecutar o renderizar,
  inspeccionar el resultado real, detectar fallos, corregirlos y volver a comprobar.
- La verificación debe cubrir todos los criterios solicitados y el comportamiento visible,
  no solo sintaxis, compilación o una respuesta exitosa de una herramienta.
- No se permiten atajos, resultados plausibles sin ejecutar, datos inventados ni afirmar
  que algo funciona sin evidencia obtenida de la salida real.
- En interfaces y artefactos visuales, comprobar el render final en el tamaño de uso,
  incluyendo desbordamientos, legibilidad, alineación, jerarquía y recursos gráficos.
- No crear SVG artesanales escritos o dibujados directamente por el asistente. Usar
  recursos auténticos o herramientas especializadas de diseño y generación.
- Si la primera comprobación revela un defecto, la tarea continúa hasta corregirlo y
  verificar nuevamente el resultado completo.

# Iconos de cursos

- Todos los cursos deben mostrar un icono, por instrucción del usuario.
- Fortran usa su logotipo oficial mediante `SiFortran` de `react-icons`.
- Las materias sin logotipo usan un símbolo de Lucide. Nunca se deja el espacio vacío.
- Una publicación nueva requiere `icono` válido; las fichas antiguas se normalizan
  con `resolverIconoCurso` para conservar su visibilidad.
