import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import ts from 'typescript';

const require = createRequire(import.meta.url);
const { ensureServerEntryExports } = require('next/dist/build/webpack/loaders/next-flight-loader/action-validate');

function cargar(archivo) {
  const codigo = ts.transpileModule(fs.readFileSync(archivo, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  const modulo = { exports: {} };
  const importar = (nombre) => {
    if (nombre === 'next/cache') return { revalidatePath() {} };
    if (nombre === '@/lib/supabase/servidor') {
      return { clienteServidor() { throw new Error('La validación no debe consultar la base.'); } };
    }
    if (nombre.startsWith('.')) return cargar(path.resolve(path.dirname(archivo), `${nombre}.ts`));
    return require(nombre);
  };
  new Function('require', 'module', 'exports', codigo)(importar, modulo, modulo.exports);
  return modulo.exports;
}

for (const [archivo, accion] of [
  ['src/app/panel/acciones.ts', 'guardarCurso'],
  ['src/app/panel/reportes/acciones.ts', 'cambiarEstadoReporte'],
]) {
  const acciones = cargar(path.resolve(archivo));
  // Es el validador que Next ejecuta al recibir el POST. Build y tsc no
  // detectaban la lista exportada que provocaba E352 en producción.
  assert.doesNotThrow(() => ensureServerEntryExports(Object.values(acciones)), archivo);
  const resultado = await acciones[accion](null, new FormData());
  assert.equal(resultado.ok, false);
  assert.equal(typeof resultado.error, 'string');
}

console.log('Acciones de cursos y reportes: módulos válidos en Next y errores de formulario recuperables.');
