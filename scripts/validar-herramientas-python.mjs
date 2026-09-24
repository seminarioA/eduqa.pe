import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";

const preguntas = JSON.parse(
  readFileSync("src/content/python-quiz.json", "utf8"),
);
const curso = readFileSync("src/content/python.ts", "utf8");
const barra = readFileSync("src/components/curso/BarraLateral.tsx", "utf8");
const leccion = readFileSync(
  "src/app/cursos/[curso]/[leccion]/page.tsx",
  "utf8",
);
const sandbox = readFileSync(
  "src/components/curso/SandboxPython.tsx",
  "utf8",
);
const quiz = readFileSync("src/components/curso/QuizPython.tsx", "utf8");
const borrador = readFileSync("src/lib/borrador-python.ts", "utf8");

assert.equal(preguntas.length, 16, "El quiz debe tener 16 preguntas");
assert.equal(new Set(preguntas.map((p) => p.id)).size, preguntas.length);

for (const sesion of [1, 2, 3, 4]) {
  assert.equal(
    preguntas.filter((p) => p.sesion === sesion).length,
    4,
    `La sesión ${sesion} debe aportar cuatro preguntas`,
  );
}

for (const pregunta of preguntas) {
  assert.equal(pregunta.opciones.length, 4, `${pregunta.id}: cuatro opciones`);
  assert.equal(
    new Set(pregunta.opciones).size,
    4,
    `${pregunta.id}: opciones distintas`,
  );
  assert.ok(
    Number.isInteger(pregunta.correcta) &&
      pregunta.correcta >= 0 &&
      pregunta.correcta < 4,
    `${pregunta.id}: índice correcto válido`,
  );
  assert.ok(pregunta.explicacion.length >= 50, `${pregunta.id}: explicación útil`);
}

const conceptosPorSesion = [
  [/Variables/, /input\(\)/, /División entera/],
  [/Listas/, /Diccionarios/, /Conjuntos/],
  [/sentencia if/, /range/, /zip/, /break y continue/],
  [/Definir una función/, /Valores por defecto mutables/, /Módulos/, /Manejar errores/],
];
for (const [indice, conceptos] of conceptosPorSesion.entries()) {
  for (const concepto of conceptos) {
    assert.match(curso, concepto, `El quiz cita contenido de la sesión ${indice + 1}`);
  }
}

const contenidoLateral = barra.slice(barra.indexOf("function Contenido"));
const posicionSandbox = contenidoLateral.indexOf(
  'herramienta.tipo === "sandbox"',
);
const posicionIndice = contenidoLateral.indexOf("<Indice");
const posicionQuiz = contenidoLateral.indexOf(
  'herramienta.tipo === "quiz"',
  posicionIndice,
);
assert.ok(posicionSandbox >= 0, "El sandbox debe aparecer en la barra lateral");
assert.ok(posicionIndice > posicionSandbox, "El sandbox debe ir antes de las sesiones");
assert.ok(posicionQuiz > posicionIndice, "El quiz debe ir después de las sesiones");
assert.match(leccion, /Sandbox de Python/);
assert.match(leccion, /Quiz de Python/);
assert.match(sandbox, /ejecutarProyectoPython\(/);
assert.match(sandbox, /proyecto\.archivos\.map/);
assert.match(sandbox, /activo\.nombre/);
assert.match(sandbox, /enlace\.download = archivo\.nombre/);
assert.match(sandbox, /PROYECTO_INICIAL_PYTHON/);
assert.doesNotMatch(quiz, /#[0-9a-f]{3,8}/i, "El quiz solo usa tokens de color");
assert.match(quiz, /evento\.key !== "Enter"/);
assert.match(quiz, /aria-keyshortcuts="Enter"/);
assert.doesNotMatch(quiz, /También puedes continuar/);

const codigoInicial = borrador.match(
  /PROGRAMA_INICIAL_PYTHON = `([\s\S]*?)`;/,
)?.[1];
assert.ok(codigoInicial, "El sandbox debe incluir un programa inicial");
const ejecucion = spawnSync("python3", ["-c", codigoInicial], {
  encoding: "utf8",
});
assert.equal(ejecucion.status, 0, ejecucion.stderr);
assert.equal(ejecucion.stdout.trim(), "Total: 4440\nPromedio: 1110.00");

console.log(
  "Sandbox ejecutado con Python real y quiz validado: 16 preguntas, cuatro por sesión.",
);
