import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const rutasFortran = [
  /^src\/content\/fortran-[^/]+\//,
  /^src\/lib\/(?:fortran-|borrador-fortran|curso-markdown\.ts$|curso-tipos\.ts$|catalogo(?:-cursos)?\.ts$|iconos-curso\.ts$)/,
  /^src\/components\/curso\/(?!BarraLateral\.tsx$)/,
  /^src\/components\/Iconos\.tsx$/,
  /^src\/app\/cursos\/\[curso\]\/\[leccion\]\//,
  /^src\/app\/rutas\/\[ruta\]\/sandbox\//,
  /^public\/(?:fortran|vendor\/xlfortran)\//,
  /^examples\/fortran\//,
  /^scripts\/(?:verificar-fortran(?:-web)?\.mjs|verificar-proyecto-fortran\.py|fortran-respuestas\.json|generar-publicacion-fortran\.mjs)$/,
  /^package(?:-lock)?\.json$/,
  /^next\.config\./,
];

export function requierePruebasFortran(rutas) {
  return rutas.some((ruta) => rutasFortran.some((patron) => patron.test(ruta)));
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const rutas = readFileSync(0, 'utf8').split(/\r?\n/).filter(Boolean);
  process.stdout.write(`fortran=${requierePruebasFortran(rutas)}\n`);
}
