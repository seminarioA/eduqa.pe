import sharp from "sharp";

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
  logoSvg: string | null;
};

const ANCHO = 595;
const ALTO = 842;
const MARGEN_X = 48;
const ARRIBA = 790;
const ABAJO = 54;
const ANCHO_UTIL = ANCHO - MARGEN_X * 2;

const ROJO = "#c70724";
const BORDE = "#d9dde3";
const GRIS = "#f4f5f7";
const GRIS_SUAVE = "#fafafa";
const TEXTO_SUAVE = "#4b5563";

type Fuente = "F1" | "F2";

type Celda = {
  texto: string;
  fuente?: Fuente;
  tamano?: number;
  color?: string;
  fondo?: string;
  alineacion?: "izquierda" | "centro";
};

type Pagina = {
  comandos: string[];
  portada?: boolean;
};

function rgb(hex: string) {
  const normalizado = hex.replace("#", "");
  const r = Number.parseInt(normalizado.slice(0, 2), 16) / 255;
  const g = Number.parseInt(normalizado.slice(2, 4), 16) / 255;
  const b = Number.parseInt(normalizado.slice(4, 6), 16) / 255;
  return [r, g, b] as const;
}

function colorRelleno(hex: string) {
  const [r, g, b] = rgb(hex);
  return `${r.toFixed(4)} ${g.toFixed(4)} ${b.toFixed(4)} rg`;
}

function colorTrazo(hex: string) {
  const [r, g, b] = rgb(hex);
  return `${r.toFixed(4)} ${g.toFixed(4)} ${b.toFixed(4)} RG`;
}

function limpiarTexto(texto: string) {
  return texto
    .replace(/[–—]/g, "-")
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/…/g, "...")
    .replace(/·/g, " - ")
    .normalize("NFC");
}

function textoHexadecimal(texto: string) {
  let salida = "";
  for (const caracter of limpiarTexto(texto)) {
    let codigo = caracter.codePointAt(0) ?? 63;
    if (codigo > 255) codigo = 63;
    salida += codigo.toString(16).padStart(2, "0").toUpperCase();
  }
  return salida;
}

function envolverLinea(texto: string, maximo: number) {
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

function envolver(texto: string, maximo: number) {
  return limpiarTexto(texto)
    .split("\n")
    .flatMap((linea) => envolverLinea(linea, maximo));
}

function estimarCaracteres(ancho: number, tamano: number) {
  return Math.max(6, Math.floor(ancho / (tamano * 0.51)));
}

function anchoEstimado(texto: string, tamano: number) {
  return limpiarTexto(texto).length * tamano * 0.51;
}

async function prepararLogo(svg: string | null) {
  if (!svg) return null;

  try {
    const blanco = svg
      .replace(/currentColor/gi, "#ffffff")
      .replace(/color\s*:\s*[^;"']+/gi, "color:#ffffff");

    const resultado = await sharp(Buffer.from(blanco))
      .resize({
        width: 420,
        height: 300,
        fit: "inside",
        withoutEnlargement: false,
      })
      .flatten({ background: ROJO })
      .jpeg({ quality: 96, chromaSubsampling: "4:4:4" })
      .toBuffer({ resolveWithObject: true });

    return {
      datos: resultado.data,
      ancho: resultado.info.width,
      alto: resultado.info.height,
    };
  } catch {
    return null;
  }
}

/**
 * PDF A4 con una portada de marca y layout tabular.
 *
 * Cada fila calcula su altura usando el contenido de todas sus celdas y luego
 * dibuja la caja completa. El wrapping y los saltos de página dejan de depender
 * de coordenadas independientes para etiqueta, valor y línea divisoria.
 */
export async function generarPdfInformacionCurso(
  datos: DatosPdfInformacionCurso,
) {
  const logo = await prepararLogo(datos.logoSvg);
  const paginas: Pagina[] = [{ comandos: [], portada: true }, { comandos: [] }];
  let pagina = 1;
  let y = ARRIBA;

  const actual = () => paginas[pagina].comandos;

  const nuevaPagina = () => {
    paginas.push({ comandos: [] });
    pagina = paginas.length - 1;
    y = ARRIBA;
  };

  const asegurarEspacio = (alto: number) => {
    if (y - alto >= ABAJO) return;
    nuevaPagina();
  };

  const rectangulo = (
    x: number,
    ySuperior: number,
    ancho: number,
    alto: number,
    opciones: { fondo?: string; borde?: string; grosor?: number } = {},
  ) => {
    const yInferior = ySuperior - alto;
    if (opciones.fondo) {
      actual().push(
        `q ${colorRelleno(opciones.fondo)} ${x.toFixed(1)} ${yInferior.toFixed(1)} ${ancho.toFixed(1)} ${alto.toFixed(1)} re f Q`,
      );
    }
    if (opciones.borde) {
      actual().push(
        `q ${colorTrazo(opciones.borde)} ${(opciones.grosor ?? 0.55).toFixed(2)} w ${x.toFixed(1)} ${yInferior.toFixed(1)} ${ancho.toFixed(1)} ${alto.toFixed(1)} re S Q`,
      );
    }
  };

  const textoEn = (
    valor: string,
    x: number,
    baseline: number,
    opciones: {
      tamano?: number;
      fuente?: Fuente;
      color?: string;
    } = {},
  ) => {
    const tamano = opciones.tamano ?? 10;
    const fuente = opciones.fuente ?? "F1";
    const color = opciones.color ?? "#111827";
    actual().push(
      `BT ${colorRelleno(color)} /${fuente} ${tamano.toFixed(1)} Tf ${x.toFixed(1)} ${baseline.toFixed(1)} Td <${textoHexadecimal(valor)}> Tj ET`,
    );
  };

  const parrafo = (
    valor: string,
    opciones: {
      x?: number;
      ancho?: number;
      tamano?: number;
      fuente?: Fuente;
      color?: string;
      interlineado?: number;
      margenDespues?: number;
    } = {},
  ) => {
    const x = opciones.x ?? MARGEN_X;
    const ancho = opciones.ancho ?? ANCHO_UTIL;
    const tamano = opciones.tamano ?? 10;
    const fuente = opciones.fuente ?? "F1";
    const color = opciones.color ?? "#111827";
    const interlineado = opciones.interlineado ?? tamano * 1.38;
    const lineas = envolver(valor, estimarCaracteres(ancho, tamano));
    const alto = lineas.length * interlineado + (opciones.margenDespues ?? 0);

    asegurarEspacio(alto);

    for (const linea of lineas) {
      textoEn(linea, x, y, { tamano, fuente, color });
      y -= interlineado;
    }
    y -= opciones.margenDespues ?? 0;
  };

  const tituloSeccion = (titulo: string) => {
    asegurarEspacio(38);
    parrafo(titulo, {
      tamano: 15,
      fuente: "F2",
      interlineado: 19,
      margenDespues: 5,
    });
    actual().push(
      `q ${colorTrazo(BORDE)} 0.7 w ${MARGEN_X} ${y.toFixed(1)} m ${(MARGEN_X + ANCHO_UTIL).toFixed(1)} ${y.toFixed(1)} l S Q`,
    );
    y -= 10;
  };

  const medirFila = (
    celdas: Celda[],
    anchos: number[],
    paddingX = 8,
    paddingY = 7,
  ) => {
    const lineas = celdas.map((celda, indice) => {
      const tamano = celda.tamano ?? 10;
      return envolver(
        celda.texto,
        estimarCaracteres(anchos[indice] - paddingX * 2, tamano),
      );
    });
    const altoContenido = Math.max(
      ...lineas.map(
        (ls, indice) =>
          ls.length * ((celdas[indice].tamano ?? 10) * 1.35),
      ),
    );

    return {
      lineas,
      alto: Math.max(26, altoContenido + paddingY * 2),
    };
  };

  const dibujarFila = (
    celdas: Celda[],
    anchos: number[],
    opciones: {
      paddingX?: number;
      paddingY?: number;
      asegurar?: boolean;
    } = {},
  ) => {
    const paddingX = opciones.paddingX ?? 8;
    const paddingY = opciones.paddingY ?? 7;
    const medida = medirFila(celdas, anchos, paddingX, paddingY);

    if (opciones.asegurar !== false) asegurarEspacio(medida.alto);

    const superior = y;
    let x = MARGEN_X;

    celdas.forEach((celda, indice) => {
      const ancho = anchos[indice];
      rectangulo(x, superior, ancho, medida.alto, {
        fondo: celda.fondo,
        borde: BORDE,
      });

      const tamano = celda.tamano ?? 10;
      const fuente = celda.fuente ?? "F1";
      const color = celda.color ?? "#111827";
      const interlineado = tamano * 1.35;
      let baseline = superior - paddingY - tamano;

      for (const linea of medida.lineas[indice]) {
        let xTexto = x + paddingX;
        if (celda.alineacion === "centro") {
          xTexto =
            x +
            Math.max(
              paddingX,
              (ancho - anchoEstimado(linea, tamano)) / 2,
            );
        }
        textoEn(linea, xTexto, baseline, { tamano, fuente, color });
        baseline -= interlineado;
      }

      x += ancho;
    });

    y -= medida.alto;
    return medida.alto;
  };

  const tablaDosColumnas = (filas: CampoPdf[]) => {
    const anchos = [150, ANCHO_UTIL - 150];
    for (const fila of filas) {
      dibujarFila(
        [
          {
            texto: fila.etiqueta,
            fuente: "F1",
            tamano: 9.5,
            color: TEXTO_SUAVE,
            fondo: GRIS_SUAVE,
          },
          {
            texto: fila.valor,
            fuente: "F2",
            tamano: 10,
          },
        ],
        anchos,
      );
    }
    y -= 8;
  };

  const cabeceraTemario = () => {
    dibujarFila(
      [
        { texto: "N°", fuente: "F2", fondo: GRIS, alineacion: "centro" },
        { texto: "Sesión", fuente: "F2", fondo: GRIS },
        { texto: "Apartados", fuente: "F2", fondo: GRIS },
      ],
      [42, 178, ANCHO_UTIL - 220],
      { asegurar: false },
    );
  };

  const tablaTemario = (lecciones: LeccionPdf[]) => {
    const anchos = [42, 178, ANCHO_UTIL - 220];
    cabeceraTemario();

    for (const leccion of lecciones) {
      const apartados =
        leccion.secciones.length > 0
          ? leccion.secciones
              .map((seccion) => `- ${seccion.titulo}`)
              .join("\n")
          : "Sin apartados declarados.";

      const celdas: Celda[] = [
        {
          texto: String(leccion.numero).padStart(2, "0"),
          fuente: "F2",
          alineacion: "centro",
        },
        { texto: leccion.titulo, fuente: "F2" },
        { texto: apartados, tamano: 9.3 },
      ];

      const medida = medirFila(celdas, anchos);
      if (y - medida.alto < ABAJO) {
        nuevaPagina();
        parrafo("Temario e índice de contenido (continuación)", {
          tamano: 12,
          fuente: "F2",
          margenDespues: 7,
        });
        cabeceraTemario();
      }
      dibujarFila(celdas, anchos, { asegurar: false });
    }
    y -= 8;
  };

  const portada = paginas[0].comandos;
  const [rr, rg, rb] = rgb(ROJO);
  portada.push(
    `q ${rr.toFixed(4)} ${rg.toFixed(4)} ${rb.toFixed(4)} rg 0 0 ${ANCHO} ${ALTO} re f Q`,
  );

  if (logo) {
    const maxAncho = 185;
    const maxAlto = 175;
    const escala = Math.min(maxAncho / logo.ancho, maxAlto / logo.alto);
    const anchoLogo = logo.ancho * escala;
    const altoLogo = logo.alto * escala;
    const xLogo = (ANCHO - anchoLogo) / 2;
    const yLogo = 500;
    portada.push(
      `q ${anchoLogo.toFixed(2)} 0 0 ${altoLogo.toFixed(2)} ${xLogo.toFixed(2)} ${yLogo.toFixed(2)} cm /Logo Do Q`,
    );
  }

  const textoPortadaCentrado = (
    valor: string,
    yBase: number,
    tamano: number,
    fuente: Fuente,
  ) => {
    const ancho = anchoEstimado(valor, tamano);
    const x = Math.max(48, (ANCHO - ancho) / 2);
    portada.push(
      `BT 1 1 1 rg /${fuente} ${tamano.toFixed(1)} Tf ${x.toFixed(1)} ${yBase.toFixed(1)} Td <${textoHexadecimal(valor)}> Tj ET`,
    );
  };

  textoPortadaCentrado("EDUQA.PE", 455, 13, "F2");
  textoPortadaCentrado("Información del curso", 407, 24, "F2");

  const lineasTitulo = envolver(datos.titulo, 42);
  let yTitulo = 360;
  for (const linea of lineasTitulo) {
    textoPortadaCentrado(linea, yTitulo, 17, "F2");
    yTitulo -= 24;
  }
  textoPortadaCentrado(
    "Ficha académica y trazabilidad editorial",
    96,
    9.5,
    "F1",
  );

  tituloSeccion("Ficha académica");
  if (datos.resumen) {
    parrafo(datos.resumen, {
      tamano: 10,
      color: TEXTO_SUAVE,
      margenDespues: 12,
    });
  }
  tablaDosColumnas(datos.ficha);

  tituloSeccion("Trazabilidad editorial");
  tablaDosColumnas(datos.trazabilidad);

  tituloSeccion("Temario e índice de contenido");
  tablaTemario(datos.lecciones);

  if (datos.ruta) {
    tituloSeccion("Ruta de aprendizaje");
    dibujarFila([{ texto: datos.ruta, tamano: 10 }], [ANCHO_UTIL]);
  }

  const paginasContenido = paginas.length - 1;
  paginas.forEach((p, indice) => {
    if (p.portada) return;
    p.comandos.push(
      `BT ${colorRelleno("#6b7280")} /F1 8 Tf ${MARGEN_X} 28 Td <${textoHexadecimal(`EDUQA.PE - Página ${indice} de ${paginasContenido}`)}> Tj ET`,
    );
  });

  const objetos = new Map<number, Buffer>();
  objetos.set(1, Buffer.from("<< /Type /Catalog /Pages 2 0 R >>"));
  objetos.set(
    3,
    Buffer.from(
      "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>",
    ),
  );
  objetos.set(
    4,
    Buffer.from(
      "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>",
    ),
  );

  let siguienteId = 5;
  const logoId = logo ? siguienteId++ : null;

  if (logo && logoId) {
    objetos.set(
      logoId,
      Buffer.concat([
        Buffer.from(
          `<< /Type /XObject /Subtype /Image /Width ${logo.ancho} /Height ${logo.alto} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${logo.datos.length} >>\nstream\n`,
        ),
        logo.datos,
        Buffer.from("\nendstream"),
      ]),
    );
  }

  const referenciasPaginas: string[] = [];

  paginas.forEach((p) => {
    const paginaId = siguienteId++;
    const contenidoId = siguienteId++;
    referenciasPaginas.push(`${paginaId} 0 R`);

    const stream = Buffer.from(p.comandos.join("\n"));
    const recursos =
      p.portada && logoId
        ? `<< /Font << /F1 3 0 R /F2 4 0 R >> /XObject << /Logo ${logoId} 0 R >> >>`
        : "<< /Font << /F1 3 0 R /F2 4 0 R >> >>";

    objetos.set(
      paginaId,
      Buffer.from(
        `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${ANCHO} ${ALTO}] /Resources ${recursos} /Contents ${contenidoId} 0 R >>`,
      ),
    );
    objetos.set(
      contenidoId,
      Buffer.concat([
        Buffer.from(`<< /Length ${stream.length} >>\nstream\n`),
        stream,
        Buffer.from("\nendstream"),
      ]),
    );
  });

  objetos.set(
    2,
    Buffer.from(
      `<< /Type /Pages /Kids [${referenciasPaginas.join(" ")}] /Count ${paginas.length} >>`,
    ),
  );

  const maximoObjeto = siguienteId - 1;
  const partes: Buffer[] = [
    Buffer.from("%PDF-1.4\n%\xE2\xE3\xCF\xD3\n", "binary"),
  ];
  const posiciones = new Array<number>(maximoObjeto + 1).fill(0);
  let posicion = partes[0].length;

  for (let id = 1; id <= maximoObjeto; id += 1) {
    const cuerpo = objetos.get(id);
    if (!cuerpo) throw new Error(`Objeto PDF faltante: ${id}`);

    posiciones[id] = posicion;
    const objeto = Buffer.concat([
      Buffer.from(`${id} 0 obj\n`),
      cuerpo,
      Buffer.from("\nendobj\n"),
    ]);
    partes.push(objeto);
    posicion += objeto.length;
  }

  const posicionXref = posicion;
  let xref = `xref\n0 ${maximoObjeto + 1}\n0000000000 65535 f \n`;
  for (let id = 1; id <= maximoObjeto; id += 1) {
    xref += `${String(posiciones[id]).padStart(10, "0")} 00000 n \n`;
  }
  xref +=
    `trailer\n<< /Size ${maximoObjeto + 1} /Root 1 0 R >>\n` +
    `startxref\n${posicionXref}\n%%EOF\n`;

  partes.push(Buffer.from(xref));
  return new Uint8Array(Buffer.concat(partes));
}
