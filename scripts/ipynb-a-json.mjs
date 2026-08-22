// Convierte los .ipynb del curso a JSON estructurado.
// Uso: node scripts/ipynb-a-json.mjs <destino.json> <archivo1.ipynb> ...
import { readFileSync, writeFileSync } from "node:fs";

const [destino, ...entradas] = process.argv.slice(2);

const texto = (v) => (Array.isArray(v) ? v.join("") : (v ?? ""));

// Quita códigos ANSI de los tracebacks y recorta salidas larguísimas.
const ANSI = new RegExp(String.fromCharCode(27) + "\\[[0-9;]*m", "g");
const limpiarSalida = (s) =>
  s.replace(ANSI, "").split("\n").slice(0, 40).join("\n").trimEnd();

function salidaDeCelda(celda) {
  const outs = celda.outputs ?? [];
  const partes = [];
  for (const o of outs) {
    if (o.output_type === "stream") partes.push(texto(o.text));
    else if (o.output_type === "execute_result" || o.output_type === "display_data") {
      const plain = o.data?.["text/plain"];
      if (plain) partes.push(texto(plain));
    } else if (o.output_type === "error") {
      partes.push(`${o.ename}: ${o.evalue}`);
    }
  }
  const s = limpiarSalida(partes.join("\n"));
  return s.trim() ? s : null;
}

// El subtítulo real está en la línea "## Sesión N — Tema".
function tituloDe(celdas, respaldo) {
  for (const c of celdas) {
    if (c.cell_type !== "markdown") continue;
    const m = texto(c.source).match(
      /^#{1,3}\s*(?:.*?)Sesi[oó]n\s*\d+\s*[—–-]\s*(.+)$/im,
    );
    if (m) return m[1].replace(/[*_`]/g, "").trim();
  }
  return respaldo;
}

// El material llegó rotulado con la marca de otra escuela. Se retira:
// republicarlo con esa marca en EDUQA sería un problema, no un descuido.
const MARCAS_AJENAS = /PROEDUCATE\s*[-–—]?\s*/gi;

// Sin emojis en encabezados: es regla del curso.
const EMOJI = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}\u{2B00}-\u{2BFF}]/gu;
const limpiarMarca = (s) =>
  s
    .replace(MARCAS_AJENAS, "")
    .replace(EMOJI, "")
    .split("\n")
    .map((l) => l.replace(/[ \t]{2,}/g, " ").trimEnd())
    .join("\n")
    .trimStart();

const lecciones = entradas.map((ruta, i) => {
  const nb = JSON.parse(readFileSync(ruta, "utf8"));
  const celdas = nb.cells ?? [];

  const bloques = [];
  for (const c of celdas) {
    const src = texto(c.source).trimEnd();
    if (!src.trim()) continue;
    if (c.cell_type === "markdown") {
      bloques.push({ tipo: "teoria", contenido: limpiarMarca(src) });
    } else if (c.cell_type === "code") {
      bloques.push({
        tipo: "codigo",
        contenido: src,
        lenguaje: "python",
        salida: salidaDeCelda(c),
      });
    }
  }

  // Índice lateral: encabezados de nivel 1 y 2 de las celdas de teoría.
  const secciones = [];
  bloques.forEach((b, idx) => {
    if (b.tipo !== "teoria") return;
    const m = b.contenido.match(/^#{1,2}\s+(.+)$/m);
    if (m) {
      const t = m[1].replace(/[*_`#]/g, "").trim();
      if (t && !secciones.some((s) => s.titulo === t)) {
        secciones.push({ id: `b${idx}`, titulo: t });
      }
    }
  });

  const n = i + 1;
  return {
    slug: `sesion-${n}`,
    numero: n,
    titulo: tituloDe(celdas, `Sesión ${n}`),
    bloques,
    secciones,
  };
});

const total = lecciones.reduce(
  (a, l) => ({
    teoria: a.teoria + l.bloques.filter((b) => b.tipo === "teoria").length,
    codigo: a.codigo + l.bloques.filter((b) => b.tipo === "codigo").length,
  }),
  { teoria: 0, codigo: 0 },
);

writeFileSync(destino, JSON.stringify(lecciones, null, 2));
console.log(`${lecciones.length} lecciones -> ${destino}`);
console.log(`bloques: ${total.teoria} de teoria, ${total.codigo} de codigo`);
lecciones.forEach((l) =>
  console.log(
    `  ${l.slug}: "${l.titulo}" (${l.bloques.length} bloques, ${l.secciones.length} secciones)`,
  ),
);
