type CampoPdf = {
  etiqueta: string;
  valor: string;
};

type SeccionPdf = {
  titulo: string;
};

type LeccionPdf = {
  numero: number;
  titulo: string;
  secciones: SeccionPdf[];
};

export type DatosPdfInformacionCurso = {
  titulo: string;
  resumen: string;
  ficha: CampoPdf[];
  trazabilidad: CampoPdf[];
  lecciones: LeccionPdf[];
  ruta: string | null;
};

const ANCHO = 595;
const ALTO = 842;
const IZQUIERDA = 52;
const DERECHA = 543;
const ARRIBA = 790;
const ABAJO = 56;

function limpiarTexto(texto: string) {
  return texto
    .replace(/[–—]/g, "-")
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/…/g, "...")
    .normalize("NFC");
}

/**
 * Los PDF Type1 estándar usan WinAnsiEncoding. Para el contenido académico
 * basta Latin-1/WinAnsi (incluye tildes, ñ, ¿ y ¡); cualquier carácter fuera
 * de ese rango se sustituye por ? para que el archivo siga siendo válido.
 */
function textoHexadecimal(texto: string) {
  let salida = "";
  for (const caracter of limpiarTexto(texto)) {
    let codigo = caracter.codePointAt(0) ?? 63;
    if (codigo > 255) codigo = 63;
    salida += codigo.toString(16).padStart(2, "0").toUpperCase();
  }
  return salida;
}

function envolver(texto: string, maximo: number) {
  const palabras = limpiarTexto(texto).split(/\s+/).filter(Boolean);
  const lineas: string[] = [];
  let linea = "";

  for (const palabraOriginal of palabras) {
    let palabra = palabraOriginal;

    while (palabra.length > maximo) {
      if (linea) {
        lineas.push(linea);
        linea = "";
      }
      lineas.push(palabra.slice(0, maximo));
      palabra = palabra.slice(maximo);
    }

    const candidata = linea ? `${linea} ${palabra}` : palabra;
    if (candidata.length <= maximo) {
      linea = candidata;
    } else {
      if (linea) lineas.push(linea);
      linea = palabra;
    }
  }

  if (linea) lineas.push(linea);
  return lineas.length > 0 ? lineas : [""];
}

/**
 * Generador PDF sin dependencias externas. Produce un documento A4 de texto
 * seleccionable usando Helvetica/Helvetica-Bold incorporadas por el estándar.
 */
export function generarPdfInformacionCurso(datos: DatosPdfInformacionCurso) {
  const paginas: string[][] = [[]];
  let pagina = 0;
  let y = ARRIBA;

  const actual = () => paginas[pagina];

  const asegurarEspacio = (alto: number) => {
    if (y - alto >= ABAJO) return;
    pagina += 1;
    paginas.push([]);
    y = ARRIBA;
  };

  const texto = (
    valor: string,
    opciones: {
      x?: number;
      tamano?: number;
      fuente?: "F1" | "F2";
      interlineado?: number;
      ancho?: number;
      margenDespues?: number;
    } = {},
  ) => {
    const x = opciones.x ?? IZQUIERDA;
    const tamano = opciones.tamano ?? 10;
    const fuente = opciones.fuente ?? "F1";
    const interlineado = opciones.interlineado ?? tamano * 1.35;
    const ancho = opciones.ancho ?? DERECHA - x;
    const margenDespues = opciones.margenDespues ?? 0;
    const maximo = Math.max(8, Math.floor(ancho / (tamano * 0.52)));
    const lineas = envolver(valor, maximo);

    asegurarEspacio(lineas.length * interlineado + margenDespues);

    for (const linea of lineas) {
      actual().push(
        `BT /${fuente} ${tamano.toFixed(1)} Tf ${x.toFixed(1)} ${y.toFixed(1)} Td <${textoHexadecimal(linea)}> Tj ET`,
      );
      y -= interlineado;
    }
    y -= margenDespues;
  };

  const linea = (margenDespues = 8) => {
    asegurarEspacio(margenDespues + 2);
    actual().push(
      `0.85 G 0.5 w ${IZQUIERDA} ${y.toFixed(1)} m ${DERECHA} ${y.toFixed(1)} l S`,
    );
    y -= margenDespues;
  };

  const seccion = (titulo: string) => {
    asegurarEspacio(34);
    y -= 6;
    texto(titulo, {
      tamano: 14,
      fuente: "F2",
      interlineado: 18,
      margenDespues: 5,
    });
    linea(10);
  };

  const campo = ({ etiqueta, valor }: CampoPdf) => {
    const anchoEtiqueta = 135;
    const xValor = IZQUIERDA + anchoEtiqueta;
    const maximo = Math.max(
      8,
      Math.floor((DERECHA - xValor) / (10 * 0.52)),
    );
    const lineasValor = envolver(valor, maximo);
    const alto = Math.max(20, lineasValor.length * 13.5 + 5);

    asegurarEspacio(alto);

    actual().push(
      `BT /F1 9.5 Tf ${IZQUIERDA} ${y.toFixed(1)} Td <${textoHexadecimal(etiqueta)}> Tj ET`,
    );

    let yValor = y;
    for (const lineaValor of lineasValor) {
      actual().push(
        `BT /F2 10 Tf ${xValor} ${yValor.toFixed(1)} Td <${textoHexadecimal(lineaValor)}> Tj ET`,
      );
      yValor -= 13.5;
    }

    y -= alto;
    actual().push(
      `0.9 G 0.4 w ${IZQUIERDA} ${y.toFixed(1)} m ${DERECHA} ${y.toFixed(1)} l S`,
    );
    y -= 5;
  };

  texto("EDUQA.PE", { tamano: 10, fuente: "F2", margenDespues: 4 });
  texto("Información del curso", {
    tamano: 20,
    fuente: "F2",
    interlineado: 25,
    margenDespues: 4,
  });
  texto(datos.titulo, { tamano: 13, interlineado: 18, margenDespues: 8 });
  linea(14);

  seccion("Ficha académica");
  if (datos.resumen) {
    texto(datos.resumen, { tamano: 10, interlineado: 14, margenDespues: 10 });
  }
  datos.ficha.forEach(campo);

  seccion("Trazabilidad editorial");
  datos.trazabilidad.forEach(campo);

  seccion("Temario e índice de contenido");
  for (const leccion of datos.lecciones) {
    asegurarEspacio(32);
    texto(
      `${String(leccion.numero).padStart(2, "0")}  ${leccion.titulo}`,
      { tamano: 11, fuente: "F2", interlineado: 15, margenDespues: 2 },
    );

    if (leccion.secciones.length === 0) {
      texto("Sin apartados declarados.", {
        x: IZQUIERDA + 18,
        tamano: 9.5,
        interlineado: 13,
      });
    } else {
      for (const apartado of leccion.secciones) {
        texto(`- ${apartado.titulo}`, {
          x: IZQUIERDA + 18,
          tamano: 9.5,
          interlineado: 13,
          ancho: DERECHA - (IZQUIERDA + 18),
        });
      }
    }
    y -= 6;
  }

  if (datos.ruta) {
    seccion("Ruta de aprendizaje");
    texto(datos.ruta, { tamano: 10, interlineado: 14, margenDespues: 4 });
  }

  paginas.forEach((contenido, indice) => {
    contenido.push(
      `BT /F1 8 Tf ${IZQUIERDA} 28 Td <${textoHexadecimal(`EDUQA.PE - Página ${indice + 1} de ${paginas.length}`)}> Tj ET`,
    );
  });

  const objetos: string[] = [];
  objetos[1] = "<< /Type /Catalog /Pages 2 0 R >>";
  objetos[3] =
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>";
  objetos[4] =
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>";

  const paginasRef: string[] = [];
  paginas.forEach((contenido, indice) => {
    const paginaId = 5 + indice * 2;
    const contenidoId = paginaId + 1;
    paginasRef.push(`${paginaId} 0 R`);

    const stream = contenido.join("\n");
    objetos[paginaId] =
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${ANCHO} ${ALTO}] /Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents ${contenidoId} 0 R >>`;
    objetos[contenidoId] =
      `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`;
  });

  objetos[2] =
    `<< /Type /Pages /Kids [${paginasRef.join(" ")}] /Count ${paginas.length} >>`;

  const maximoObjeto = objetos.length - 1;
  let pdf = "%PDF-1.4\n";
  const posiciones = new Array<number>(maximoObjeto + 1).fill(0);

  for (let id = 1; id <= maximoObjeto; id += 1) {
    posiciones[id] = pdf.length;
    pdf += `${id} 0 obj\n${objetos[id]}\nendobj\n`;
  }

  const posicionXref = pdf.length;
  pdf += `xref\n0 ${maximoObjeto + 1}\n0000000000 65535 f \n`;
  for (let id = 1; id <= maximoObjeto; id += 1) {
    pdf += `${String(posiciones[id]).padStart(10, "0")} 00000 n \n`;
  }

  pdf +=
    `trailer\n<< /Size ${maximoObjeto + 1} /Root 1 0 R >>\n` +
    `startxref\n${posicionXref}\n%%EOF\n`;

  return new TextEncoder().encode(pdf);
}
