import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { parse } from 'yaml';
import { cargar } from './validar-iconos-cursos.mjs';
const { cargarCursosLocales } = cargar(path.resolve('src/lib/curso-markdown.ts'));
const temporal = fs.mkdtempSync(path.join(os.tmpdir(), 'eduqa-descubrimiento-'));
try {
  fs.mkdirSync(path.join(temporal, 'recursos'));
  fs.writeFileSync(path.join(temporal, 'FORMATO.md'), '# Documentación');
  assert.deepEqual(cargarCursosLocales(temporal), []);
  const carpeta = path.join(temporal, 'curso-nuevo');
  fs.mkdirSync(carpeta);
  fs.writeFileSync(path.join(carpeta, 'curso.md'), '---\nslug: curso-nuevo\ntitulo: Curso nuevo\narea: Lenguajes\nicono: fortran\nhoras: 4\n---\n');
  fs.writeFileSync(path.join(carpeta, 'sesion-1.md'), '---\nnumero: 1\ntitulo: Primera sesión\n---\n\n# Contenido\n\nContenido nuevo.\n');
  const descubiertos = cargarCursosLocales(temporal);
  assert.equal(descubiertos.length, 1);
  assert.equal(descubiertos[0].slug, 'curso-nuevo');
  assert.equal(descubiertos[0].lecciones[0].titulo, 'Primera sesión');
} finally {
  fs.rmSync(temporal, { recursive: true, force: true });
}
const ruta = [
  ['fortran-fundamentos', 'Introducción a Fortran', 41],
  ['fortran-calculo-cientifico', 'Fortran intermedio', 49],
  ['fortran-avanzado', 'Fortran avanzado', 8],
  ['fortran-ingenieria-software', 'Fortran aplicado a la ingeniería de software', 5],
];
const cursos = cargarCursosLocales();
assert.equal(new Set(cursos.map(c => c.slug)).size, cursos.length, 'Slugs duplicados');
for (const [i, [slug, titulo, programas]] of ruta.entries()) {
  const curso = cursos.find(c => c.slug === slug);
  assert.ok(curso, slug);
  assert.equal(curso.titulo, titulo);
  assert.equal(curso.icono, 'fortran');
  assert.deepEqual(curso.lecciones.map(l => l.numero), [1,2,3,4]);
  const bloques = curso.lecciones.flatMap(l => l.bloques);
  assert.equal(bloques.filter(b => b.tipo === 'codigo' && b.lenguaje === 'fortran').length, programas);
  assert.equal(curso.lecciones.flatMap(l => Object.values(l.ejercicios ?? {})).filter(e => e.lenguaje === 'fortran').length, 4);
  const ficha = parse(fs.readFileSync(path.join('src/content',slug,'curso.md'),'utf8').split('---')[1]);
  assert.equal(ficha.ruta.posicion, i + 1);
  assert.deepEqual(ficha.ruta.requisitos, i ? [ruta[i-1][0]] : []);
  for (const sesion of curso.lecciones) {
    assert.ok(sesion.bloques.some(b => b.tipo === 'teoria' && b.contenido.includes('# Cierre')) || sesion.secciones.some(s => s.titulo === 'Cierre'), slug+' sin cierre');
  }
}
console.log(`Detección automática verificada con una carpeta nueva; ${cursos.length} cursos locales y 16 sesiones Fortran válidos.`);
