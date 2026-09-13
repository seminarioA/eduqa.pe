import "server-only";

import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { parse as parseYaml } from "yaml";
import { resolverIconoCurso } from "@/lib/iconos-curso";
import {
  REGIONES_VENN,
  derivarSecciones,
  idsDeSecciones,
  type RegionVenn,
  type Bloque,
  type Curso,
  type Ejercicio,
  type Leccion,
} from "@/lib/curso-tipos";

/**
 * Lector de cursos escritos en Markdown.
 *
 * Un curso es contenido, no código: quien lo escribe no debería tener que
 * tocar TypeScript ni saber qué es un `Bloque`. El Markdown es la fuente y
 * esto solo lo traduce a la estructura que la aplicación sabe pintar.
 *
 * El formato está descrito en FORMATO-CURSO.md, junto a los cursos.
 *
 * Va marcado como `server-only`: lee del sistema de archivos, así que no
 * puede acabar en el paquete del navegador. Si alguien lo importa desde un
 * componente cliente, la compilación falla en lugar de romperse al ejecutar.
 */

const RAIZ = join(process.cwd(), "src", "content");

type Frontmatter = Record<string, unknown>;

/** Separa el frontmatter del cuerpo. Sin frontmatter, todo es cuerpo. */
function separarFrontmatter(texto: string): [Frontmatter, string] {
  const limpio = texto.replace(/^\uFEFF/, "");
  if (!limpio.startsWith("---")) return [{}, limpio];

  const cierre = limpio.indexOf("\n---", 3);
  if (cierre === -1) return [{}, limpio];

  const cabecera = limpio.slice(3, cierre);
  const cuerpo = limpio.slice(cierre + 4);
  return [(parseYaml(cabecera) ?? {}) as Frontmatter, cuerpo.replace(/^\n/, "")];
}

/*
 * El cuerpo se recorre línea a línea y no con una expresión regular sobre el
 * texto entero: las vallas de código pueden contener cualquier cosa, incluidos
 * encabezados y comillas, y separarlas a ojo produce cortes en mitad de un
 * ejemplo.
 */
type Valla = { lenguaje: string; modificadores: string[]; contenido: string };

function esValla(linea: string) {
  return /^```/.test(linea);
}

function leerValla(lineas: string[], i: number): [Valla, number] {
  const info = lineas[i].slice(3).trim().split(/\s+/).filter(Boolean);
  const lenguaje = info[0] ?? "";
  const modificadores = info.slice(1);

  const cuerpo: string[] = [];
  let j = i + 1;
  while (j < lineas.length && !/^```\s*$/.test(lineas[j])) {
    cuerpo.push(lineas[j]);
    j++;
  }
  return [{ lenguaje, modificadores, contenido: cuerpo.join("\n") }, j + 1];
}

/** `> Doc: [Título](url)` y `> Nota: texto`, que modifican el bloque anterior. */
const RE_DOC = /^>\s*Doc:\s*\[([^\]]+)\]\(([^)]+)\)\s*$/;
const RE_NOTA = /^>\s*Nota:\s*(.*)$/;

/**
 * Convierte un ejercicio escrito con secciones a su estructura.
 *
 * Las cuatro partes van marcadas con encabezados dentro de la valla, porque
 * el enunciado y la pista son prosa y la plantilla es código: meterlos en
 * claves de YAML obligaría a escapar comillas y saltos de línea.
 */
function leerEjercicio(texto: string, donde: string): Ejercicio {
  const partes: Record<string, string[]> = {};
  let actual: string | null = null;

  for (const linea of texto.split("\n")) {
    const encabezado = linea.match(/^#\s+(Enunciado|Plantilla|Esperado|Pista)\s*$/i);
    if (encabezado) {
      actual = encabezado[1].toLowerCase();
      partes[actual] = [];
      continue;
    }
    if (actual) partes[actual].push(linea);
  }

  const sacar = (clave: string) => (partes[clave] ?? []).join("\n").trim();

  const enunciado = sacar("enunciado");
  const plantilla = sacar("plantilla");
  const esperado = sacar("esperado");
  const pista = sacar("pista");

  for (const [clave, valor] of Object.entries({ enunciado, plantilla, pista })) {
    if (!valor) {
      throw new Error(`Ejercicio sin ${clave} en ${donde}.`);
    }
  }
  if (!plantilla.includes("___")) {
    throw new Error(`El ejercicio de ${donde} no tiene hueco (___) en su plantilla.`);
  }

  return { enunciado, plantilla, esperado, pista };
}

/**
 * Lee un diagrama de Venn declarado en YAML.
 *
 * Se valida al leer y no al pintar: un nombre de región mal escrito tiene que
 * romper la carga del curso, no dibujar un diagrama vacío que nadie note.
 */
function leerVenn(texto: string, donde: string): Bloque {
  const datos = (parseYaml(texto) ?? {}) as Record<string, unknown>;
  const izquierda = String(datos.izquierda ?? "").trim();
  const derecha = String(datos.derecha ?? "").trim();
  const resalta = String(datos.resalta ?? "ninguna").trim() as RegionVenn;

  if (!izquierda || !derecha) {
    throw new Error(`Un diagrama sin los dos conjuntos, en ${donde}.`);
  }
  if (!REGIONES_VENN.includes(resalta)) {
    throw new Error(
      `Región «${resalta}» desconocida en ${donde}. Las válidas son: ${REGIONES_VENN.join(", ")}.`,
    );
  }

  return {
    tipo: "venn",
    izquierda,
    derecha,
    resalta,
    ...(datos.pie ? { pie: String(datos.pie) } : {}),
  };
}

type ResultadoSesion = {
  bloques: Bloque[];
  ejercicios: Record<string, Ejercicio>;
  frontmatter: Frontmatter;
};

function leerSesion(texto: string, donde: string): ResultadoSesion {
  const [frontmatter, cuerpo] = separarFrontmatter(texto);
  const lineas = cuerpo.split("\n");

  const bloques: Bloque[] = [];
  const ejercicios: Record<string, Ejercicio> = {};
  // Sección en curso: el ejercicio que aparezca se le asigna a ella. Así el
  // ejercicio vive donde se lee, y no en un índice aparte que puede quedarse
  // apuntando a una sección renombrada.
  let seccionActual: string | null = null;
  let parrafo: string[] = [];

  const ultimo = () => bloques[bloques.length - 1];

  const cerrarParrafo = () => {
    const texto = parrafo.join("\n").trim();
    parrafo = [];
    if (texto) bloques.push({ tipo: "teoria", contenido: texto });
  };

  let i = 0;
  while (i < lineas.length) {
    const linea = lineas[i];

    if (esValla(linea)) {
      cerrarParrafo();
      const [valla, siguiente] = leerValla(lineas, i);
      i = siguiente;

      if (valla.lenguaje === "entrada" || valla.lenguaje === "archivo") {
        const bloque = ultimo();
        if (!bloque || bloque.tipo !== "codigo" || bloque.lenguaje !== "fortran") {
          throw new Error(`Datos de entrada sin programa Fortran delante, en ${donde}.`);
        }
        if (valla.lenguaje === "entrada") bloque.entrada = valla.contenido + "\n";
        else {
          const nombre = valla.modificadores[0];
          if (!nombre || !/^[a-zA-Z0-9_-][a-zA-Z0-9_.-]*$/.test(nombre)) throw new Error(`Nombre de archivo inválido en ${donde}.`);
          bloque.archivos = { ...bloque.archivos, [nombre]: valla.contenido + "\n" };
        }
        continue;
      }

      if (valla.lenguaje === "salida") {
        const bloque = ultimo();
        if (!bloque || bloque.tipo !== "codigo") {
          throw new Error(`Una salida sin bloque de código delante, en ${donde}.`);
        }
        bloque.salida = valla.contenido;
        continue;
      }

      if (valla.lenguaje === "venn") {
        bloques.push(leerVenn(valla.contenido, donde));
        continue;
      }

      if (valla.lenguaje === "ejercicio") {
        if (!seccionActual) {
          throw new Error(`Un ejercicio fuera de toda sección, en ${donde}.`);
        }
        if (ejercicios[seccionActual]) {
          throw new Error(
            `Dos ejercicios para la misma sección (${seccionActual}) en ${donde}.`,
          );
        }
        ejercicios[seccionActual] = {
          ...leerEjercicio(valla.contenido, donde),
          ...(valla.modificadores.includes("fortran") ? { lenguaje: "fortran" as const } : {}),
        };
        continue;
      }

      bloques.push({
        tipo: "codigo",
        contenido: valla.contenido,
        lenguaje: valla.lenguaje || "text",
        salida: null,
        // Marca los bloques que no se pueden ejecutar aquí, por ejemplo los
        // que necesitan una clave de API.
        ...(valla.modificadores.includes("!sin-consola")
          ? { sinConsola: true }
          : {}),
      });
      continue;
    }

    const doc = linea.match(RE_DOC);
    if (doc) {
      cerrarParrafo();
      const bloque = ultimo();
      if (!bloque) throw new Error(`Una cita sin bloque delante, en ${donde}.`);
      bloque.docs = [...(bloque.docs ?? []), { titulo: doc[1], url: doc[2] }];
      i++;
      continue;
    }

    const nota = linea.match(RE_NOTA);
    if (nota) {
      cerrarParrafo();
      // Una nota puede ocupar varias líneas mientras sigan citadas.
      const trozos = [nota[1]];
      i++;
      while (i < lineas.length && /^>\s*(?!Doc:|Nota:)/.test(lineas[i])) {
        trozos.push(lineas[i].replace(/^>\s?/, ""));
        i++;
      }
      const bloque = ultimo();
      if (!bloque) throw new Error(`Una nota sin bloque delante, en ${donde}.`);
      bloque.nota = trozos.join("\n").trim();
      continue;
    }

    // Un encabezado abre sección y, con ella, un bloque de teoría nuevo.
    if (/^#{1,6}\s+/.test(linea)) cerrarParrafo();

    parrafo.push(linea);
    i++;

    // La sección en curso se recalcula con los ids reales, que salen del
    // título: así el ejercicio y el índice lateral usan el mismo.
    if (/^#{1,3}\s+/.test(linea)) {
      const provisional = [...bloques, { tipo: "teoria" as const, contenido: linea }];
      const ids = idsDeSecciones(provisional);
      seccionActual = ids.get(provisional.length - 1) ?? null;
    }
  }
  cerrarParrafo();

  return { bloques, ejercicios, frontmatter };
}

/** Construye una lección a partir del texto de su archivo. */
function construirSesion(donde: string, texto: string): Leccion {
  const { bloques, ejercicios, frontmatter } = leerSesion(texto, donde);

  const numero = Number(frontmatter.numero);
  const titulo = String(frontmatter.titulo ?? "");
  if (!Number.isInteger(numero) || numero < 1) {
    throw new Error(`${donde}: falta el número de sesión.`);
  }
  if (!titulo) {
    throw new Error(`${donde}: falta el título de la sesión.`);
  }

  return {
    slug: String(frontmatter.slug ?? `sesion-${numero}`),\n    numero,\n    titulo,\n    bloques,\n    secciones: derivarSecciones(bloques),\n    ...(Object.keys(ejercicios).length > 0 ? { ejercicios } : {}),\n    ...(frontmatter.paquetes ? { paquetes: frontmatter.paquetes as string[] } : {}),\n    ...(frontmatter.preludio ? { preludio: String(frontmatter.preludio) } : {}),\n  };\n}\n\n/**\n * Construye un curso a partir de sus archivos ya leídos.\n *\n * Recibe el contenido, no rutas, para no atarse a que los archivos estén en el\n * disco: los mismos textos pueden venir de la base de datos, y así publicar un\n * curso nuevo no obliga a volver a desplegar la aplicación.\n *\n * Las sesiones se ordenan por su número, no por el nombre del archivo:\n * renombrarlos no debe cambiar el orden del temario.\n */\nexport function construirCurso(\n  nombre: string,\n  archivos: Map<string, string>,\n  /**\n   * Sesiones que existen aunque su texto no se haya podido leer. Con el\n   * material en la base, a quien no está matriculado las políticas solo le\n   * dejan ver la ficha; el temario sí es público, así que las sesiones que\n   * falten se rellenan vacías para que el catálogo cuente bien y el enlace\n   * lleve a la pantalla de compra en lugar de a un 404.\\\n   */\n  indice: { numero: number; titulo: string; slug: string }[] = [],\n): Curso {\n  const fichaTexto = archivos.get(\"curso.md\");\n  if (!fichaTexto) {\n    throw new Error(`El curso ${nombre} no tiene curso.md.`);\n  }\n  const [ficha, cuerpo] = separarFrontmatter(fichaTexto);\n\n  // El preludio del curso va como una valla dentro de curso.md: es código y\n  // en el frontmatter habría que escaparlo.\n  let preludio: string | undefined;\n  const lineas = cuerpo.split(\"\\n\");\n  for (let i = 0; i < lineas.length; i++) {\n    if (esValla(lineas[i])) {\n      const [valla] = leerValla(lineas, i);\n      if (valla.lenguaje === \"preludio\") preludio = valla.contenido;\n    }\n  }\n\n  const lecciones = [...archivos.entries()]\n    .filter(([archivo]) => archivo.endsWith(\".md\") && archivo !== \"curso.md\")\n    .map(([archivo, texto]) => construirSesion(`${nombre}/${archivo}`, texto));\n\n  const leidas = new Set(lecciones.map((l) => l.slug));\n  for (const s of indice) {\n    if (!leidas.has(s.slug)) {\n      lecciones.push({ ...s, bloques: [], secciones: [] });\n    }\n  }\n  lecciones.sort((a, b) => a.numero - b.numero);\n\n  if (lecciones.length === 0) {\n    throw new Error(`El curso ${nombre} no tiene ninguna sesión.`);\n  }\n\n  return {\n    slug: String(ficha.slug ?? nombre),\n    titulo: String(ficha.titulo ?? \"\"),\n    resumen: String(ficha.resumen ?? \"\"),\n    area: ficha.area as Curso[\"area\"],\n    nivel: String(ficha.nivel ?? \"INTRODUCCIÓN\"),\n    formato: (ficha.formato as Curso[\"formato\"]) ?? (ficha.tipo as Curso[\"formato\"]) ?? \"curso\",\n    horas: Number(ficha.horas ?? 0),\n    icono: resolverIconoCurso(String(ficha.slug ?? nombre), String(ficha.area ?? \"\"), ficha.icono),\n    ...(ficha.paquetes ? { paquetes: ficha.paquetes as string[] } : {}),\n    ...(preludio ? { preludio } : {}),\n    lecciones,\n  };\n}\n\n/** Carga un curso desde su carpeta en el repositorio. */\nexport function cargarCurso(carpeta: string, raiz = RAIZ): Curso {\n  const dir = join(raiz, carpeta);\n  const archivos = new Map(\n    readdirSync(dir)\n      .filter((f) => f.endsWith(\".md\"))\n      .map((f) => [f, readFileSync(join(dir, f), \"utf8\")] as const),\n  );\n  return construirCurso(carpeta, archivos);\n}\n\n/** Descubre carpetas con ficha; agregar Markdown no requiere editar un registro. */\nexport function cargarCursosLocales(raiz = RAIZ): Curso[] {\n  return readdirSync(raiz, { withFileTypes: true })\n    .filter((entrada) => entrada.isDirectory() && existsSync(join(raiz, entrada.name, \"curso.md\")))\n    .map((entrada) => entrada.name)\n    .sort()\n    .map((carpeta) => cargarCurso(carpeta, raiz));\n}\n