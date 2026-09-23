import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const cache = new Map();
function cargar(archivo) {
  if (cache.has(archivo)) return cache.get(archivo);
  const codigo = ts.transpileModule(fs.readFileSync(archivo, 'utf8'), { compilerOptions: {module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop:true} }).outputText;
  const modulo = {exports:{}};
  cache.set(archivo, modulo.exports);
  const importar = (nombre) => {
    if(nombre === 'server-only') return {};
    if(nombre.startsWith('@/')) {
      const base = path.join(process.cwd(), 'src', nombre.slice(2));
      return cargar(base + (fs.existsSync(base+'.ts') ? '.ts' : '.tsx'));
    }
    return require(nombre);
  };
  new Function('require','module','exports',codigo)(importar,modulo,modulo.exports);
  cache.set(archivo, modulo.exports);
  return modulo.exports;
}
const {ICONOS_CURSO, resolverIconoCurso, esIconoCurso} = cargar(path.resolve('src/lib/iconos-curso.ts'));
const {Icono} = cargar(path.resolve('src/components/Iconos.tsx'));
for(const nombre of ICONOS_CURSO) {
  const html=renderToStaticMarkup(React.createElement(Icono,{nombre}));
  assert.match(html, /<svg/);
  assert.match(html, /<(path|circle|rect|line|polyline)/);
}
assert.equal(resolverIconoCurso('fortran-fundamentos','Lenguajes'), 'fortran');
assert.equal(resolverIconoCurso('fortran-calculo-cientifico','Lenguajes','desconocido'), 'fortran');
assert.equal(resolverIconoCurso('curso-antiguo','Matemáticas'), 'matematicas');
assert.equal(resolverIconoCurso('curso-antiguo','Otra'), 'libro');
assert.equal(esIconoCurso(undefined),false);
assert.equal(esIconoCurso('inexistente'),false);
assert.equal(esIconoCurso('soa'),true);
assert.equal(resolverIconoCurso('arquitectura-soa-avanzada','Backend'), 'soa');
assert.match(renderToStaticMarkup(React.createElement(Icono,{nombre:'soa'})), /<svg/);
assert.match(renderToStaticMarkup(React.createElement(Icono,{})), /<svg/);
const {cargarCurso} = cargar(path.resolve('src/lib/curso-markdown-local.ts'));
const {construirCurso} = cargar(path.resolve('src/lib/curso-markdown.ts'));
const curso = cargarCurso('fortran-fundamentos');
assert.equal(curso.titulo,'Introducción a Fortran');
assert.equal(curso.icono,'fortran');
assert.equal(curso.lecciones.length,4);
assert.ok(curso.lecciones.every(l => l.bloques.some(b => b.tipo === 'codigo')));
const ficha = fs.readFileSync('src/content/fortran-fundamentos/curso.md','utf8').replace('icono: fortran\n','');
const antiguo=construirCurso('fortran-fundamentos',new Map([['curso.md',ficha]]),[{numero:1,titulo:'Sesión protegida',slug:'sesion-1'}]);
assert.equal(antiguo.icono,'fortran');
console.log(`${ICONOS_CURSO.length} iconos renderizados; ficha antigua, icono Fortran y cuatro sesiones validados.`);
export { cargar };
