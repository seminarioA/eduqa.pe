import assert from 'node:assert/strict';
import test from 'node:test';
import { requierePruebasFortran } from './alcance-ci.mjs';

test('un cambio visual de las barras no ejecuta la batería Fortran', () => {
  assert.equal(requierePruebasFortran([
    'src/components/Isla.tsx',
    'src/components/MarcaTextoLateral.tsx',
    'src/components/curso/BarraLateral.tsx',
    'scripts/verificar-marca-sidebar.mjs',
  ]), false);
});

test('los cursos, el runtime, los ejercicios y las dependencias sí la ejecutan', () => {
  for (const ruta of [
    'src/content/fortran-fundamentos/sesion-1.md',
    'src/lib/fortran-web.ts',
    'src/components/curso/EjercicioPunto.tsx',
    'src/app/rutas/[ruta]/sandbox/page.tsx',
    'public/vendor/xlfortran/xlfortran.wasm',
    'scripts/verificar-fortran-web.mjs',
    'package.json',
    'package-lock.json',
  ]) {
    assert.equal(requierePruebasFortran([ruta]), true, ruta);
  }
});
