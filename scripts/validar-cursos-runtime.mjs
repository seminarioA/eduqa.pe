import assert from "node:assert/strict";
import fs from "node:fs";

function leer(ruta) {
  return fs.readFileSync(ruta, "utf8");
}

const catalogo = leer("src/lib/catalogo-cursos.ts");
assert.match(catalogo, /from\("cursos"\)\.select\("slug"\)/, "El catálogo debe registrar los slugs administrados por Supabase.");
assert.match(catalogo, /from\("curso_contenido"\)/, "El contenido debe leerse desde Supabase en runtime.");
assert.match(catalogo, /from\("curso_sesiones"\)/, "El índice de sesiones debe leerse desde Supabase en runtime.");
assert.match(catalogo, /if \(!desdeLaBase\.registrados\.has\(curso\.slug\)\)/, "Un slug registrado en Supabase no debe reaparecer desde el respaldo local.");

const rutasDinamicas = [
  "src/app/cursos/page.tsx",
  "src/app/cursos/[curso]/[leccion]/page.tsx",
  "src/app/rutas/[ruta]/page.tsx",
  "src/app/pagar/[curso]/page.tsx",
  "src/app/panel/cursos/page.tsx",
];

for (const ruta of rutasDinamicas) {
  const fuente = leer(ruta);
  assert.match(
    fuente,
    /export const dynamic = "force-dynamic";/,
    `${ruta} debe resolverse en cada petición y no quedar congelada en el build.`,
  );
  assert.doesNotMatch(
    fuente,
    /export\\s+(?:async\\s+)?function\\s+generateStaticParams\\b/,
    `${ruta} no debe enumerar cursos o sesiones durante el build.`,
  );
}

const acciones = leer("src/app/panel/cursos/acciones.ts");
for (const tabla of ["cursos", "curso_contenido", "curso_sesiones"]) {
  assert.match(acciones, new RegExp(`from\\("${tabla}"\\)`), `La publicación debe escribir ${tabla}.`);
}
assert.match(acciones, /revalidarCursoPublicado\(slug/, "La publicación debe invalidar las vistas después de escribir en Supabase.");
assert.match(acciones, /Ya está en línea, sin desplegar\./, "El flujo debe confirmar que el curso queda disponible sin un nuevo deploy.");

console.log("Publicación dinámica de cursos validada: Supabase manda y las rutas no dependen del build.");
