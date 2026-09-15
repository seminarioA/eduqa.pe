import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";

function validar(mensaje) {
  return spawnSync(process.execPath, ["scripts/validar-tickets-commit.mjs"], {
    cwd: process.cwd(),
    input: mensaje,
    encoding: "utf8",
  });
}

assert.equal(validar("[fix] (ui): corregir buscador\n\nRefs: #6\n").status, 0);
assert.equal(validar("[feat] (cursos): agregar códigos\n\nCloses: #2, #3\n").status, 0);
assert.equal(validar("[fix] (ui): corregir buscador\n").status, 1);
assert.match(validar("[fix] (ui): corregir buscador\n").stderr, /no vincula un ticket/);
assert.equal(
  validar("[fix] (ui): primero\n\nRefs: #6\0[fix] (pdf): segundo\n").status,
  1,
  "Cada commit del push debe vincular al menos un ticket",
);
