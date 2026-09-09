import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";

const carpeta = process.argv.find((arg) => arg.startsWith("--curso="))?.split("=")[1] ?? "fortran-fundamentos";
assert.match(carpeta, /^fortran-[a-z-]+$/);
const actualizar = process.argv.includes("--actualizar-salidas");
const compilador = process.env.FC ?? "gfortran";
assert.equal(spawnSync(compilador, ["--version"]).status, 0, "Se necesita GNU Fortran");
const temporal = mkdtempSync(join(tmpdir(), "eduqa-fortran-ejecucion-"));
const directorio = join(process.cwd(), "src/content", carpeta);
const patron = /```fortran !sin-consola\n([\s\S]*?)\n```(?:\n\n```salida\n([\s\S]*?)\n```)?/g;
const resultados = [];
let negativos = 0;

function ejecutar(codigo, cwd, entrada = "") {
  writeFileSync(join(cwd, "programa.f90"), codigo);
  const compilacion = spawnSync(compilador, ["-std=f2018", "-Wall", "-Wextra", "-fcheck=all", "-fbacktrace", "programa.f90", "-o", "programa"], { cwd, encoding: "utf8", timeout: 20000 });
  assert.equal(compilacion.status, 0, compilacion.stderr);
  const ejecucion = spawnSync(join(cwd, "programa"), [], { cwd, input: entrada, encoding: "utf8", timeout: 10000 });
  assert.ok(!ejecucion.error, String(ejecucion.error));
  return ejecucion;
}

function compararSalida(actual, esperada, etiqueta) {
  const tokens = (s) => s.trim().split(/\s+/);
  const obtenidos = tokens(actual), esperados = tokens(esperada);
  assert.equal(obtenidos.length, esperados.length, `${etiqueta}: longitud de salida`);
  esperados.forEach((valor, i) => {
    const numero = Number(valor), obtenido = Number(obtenidos[i]);
    if (Number.isFinite(numero) && Number.isFinite(obtenido)) {
      assert.ok(Math.abs(obtenido - numero) <= 1.e-6 * Math.max(1, Math.abs(numero)), `${etiqueta}: ${obtenido} != ${numero}`);
    } else assert.equal(obtenidos[i], valor, etiqueta);
  });
}

try {
  for (const archivo of readdirSync(directorio).filter((a) => /^sesion-\d+\.md$/.test(a)).sort()) {
    const ruta = join(directorio, archivo);
    let texto = readFileSync(ruta, "utf8");
    let indice = 0;
    texto = texto.replace(patron, (bloque, codigo, salida) => {
      const etiqueta = `${archivo}#${++indice}`;
      const cwd = join(temporal, `${archivo}-${indice}`);
      mkdirSync(cwd);
      // Cada bloque recibe sus propios datos y archivos, sin compartir estado.
      const entrada = /program densidad_material\b/i.test(codigo) ? "10 2\n" : "";
      const archivos = {
        "serie.dat": "0 10\n1 14\n2 18\n",
        "mediciones.dat": "10\n14\n18\n",
        "parametros.dat": "3\n",
        "temperaturas.dat": "3\n0 10\n1 14\n2 18\n",
      };
      for (const [nombre, contenido] of Object.entries(archivos)) writeFileSync(join(cwd, nombre), contenido);
      const ejecucion = ejecutar(codigo, cwd, entrada);
      assert.equal(ejecucion.status, 0, `${etiqueta}: ${ejecucion.stderr}`);
      assert.equal(ejecucion.stderr.trim(), "", `${etiqueta}: terminacion o diagnostico inesperado`);
      const actual = ejecucion.stdout.trimEnd();
      if (!actualizar && salida !== undefined) compararSalida(actual, salida, etiqueta);
      resultados.push({ archivo, bloque: indice, salida: actual });

      const mutacion = codigo.match(/! verificar-error: (.+?) => (.+)/);
      if (mutacion) {
        const fuente = codigo.replace(mutacion[0], "");
        assert.ok(fuente.includes(mutacion[1]), `${etiqueta}: mutacion inexistente`);
        const incorrecto = ejecutar(fuente.replace(mutacion[1], mutacion[2]), cwd, entrada);
        assert.notEqual(incorrecto.status, 0, `${etiqueta}: la prueba acepto la solucion incorrecta`);
        negativos++;
      }
      if (!actualizar || actual === "") return bloque;
      return `\`\`\`fortran !sin-consola\n${codigo}\n\`\`\`\n\n\`\`\`salida\n${actual}\n\`\`\``;
    });
    if (actualizar) writeFileSync(ruta, texto);
  }
  assert.ok(resultados.length > 0, "No hay ejemplos Fortran");
  console.log(`${carpeta}: ${resultados.length} programas compilados y ejecutados; ${negativos} soluciones incorrectas rechazadas.`);
} finally {
  rmSync(temporal, { recursive: true, force: true });
}
