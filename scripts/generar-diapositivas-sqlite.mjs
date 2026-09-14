import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { execFileSync } from "node:child_process";
import vm from "node:vm";
import ts from "typescript";

const raiz = join(dirname(fileURLToPath(import.meta.url)), "..");
const fuente = readFileSync(join(raiz, "src/content/sqlite.ts"), "utf8");
const javascript = ts.transpileModule(fuente, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText;

const modulo = { exports: {} };
vm.runInNewContext(javascript, {
  module: modulo,
  exports: modulo.exports,
  require: (nombre) => {
    if (nombre === "@/lib/cursos") return { derivarSecciones: () => [] };
    throw new Error(`Importación inesperada: ${nombre}`);
  },
}, { filename: "sqlite.ts" });

const lecciones = modulo.exports.leccionesSqlite.map((leccion) => {
  const paginas = [];
  for (const bloque of leccion.bloques) {
    const encabezado = bloque.tipo === "teoria"
      ? bloque.contenido.match(/^(#{1,3})\s+(.+)$/m)
      : null;
    if (encabezado) {
      paginas.push({ titulo: encabezado[2].trim(), bloques: [] });
    }
    if (paginas.length === 0) paginas.push({ titulo: "Introducción", bloques: [] });
    const contenido = encabezado
      ? bloque.contenido.replace(/^#{1,3}\s+.+$/m, "").trim()
      : bloque.contenido;
    if (contenido) paginas.at(-1).bloques.push({ ...bloque, contenido });
  }
  return {
    slug: leccion.slug,
    titulo: leccion.titulo,
    autor: { nombre: "Alejandro Valentino Seminario Medina", cargo: "AI Engineer" },
    paginas,
  };
});

const python = process.env.PYTHON || "python3";
execFileSync(python, [join(raiz, "scripts/generar-diapositivas-sqlite.py")], {
  cwd: raiz,
  input: JSON.stringify({ lecciones }),
  stdio: ["pipe", "inherit", "inherit"],
});
