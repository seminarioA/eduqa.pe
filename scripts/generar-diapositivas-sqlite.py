"""Genera PDFs 16:9 con medidas constantes y saltos de página."""

import html
import json
import re
import sys
from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.utils import ImageReader
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas
from reportlab.platypus import Paragraph, Preformatted, Spacer, Table, TableStyle


RAIZ = Path(__file__).resolve().parents[1]
DESTINO = RAIZ / "public/cursos/sqlite"
LLAMA = ImageReader(str(RAIZ / "scripts/assets/llama-eduqa.png"))
LLAMA_BLANCA = ImageReader(str(RAIZ / "scripts/assets/llama-eduqa-blanca.png"))
ICONO_SQLITE = ImageReader(str(RAIZ / "scripts/assets/sqlite-curso-gris.png"))
ICONO_SQLITE_BLANCO = ImageReader(str(RAIZ / "scripts/assets/sqlite-curso-blanco.png"))
ANCHO, ALTO = 960, 540
MARGEN = 72
ANCHO_CONTENIDO = ANCHO - 2 * MARGEN
BASE_CONTENIDO = 108
ROJO = colors.HexColor("#C8102E")
TEXTO = colors.HexColor("#20242C")
SUAVE = colors.HexColor("#5F6672")
BORDE = colors.HexColor("#E1E3E8")

FUENTES = [
    ("/System/Library/Fonts/Supplemental/Arial.ttf", "/System/Library/Fonts/Supplemental/Arial Bold.ttf"),
    ("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"),
]
FUENTE, FUENTE_NEGRITA = "Helvetica", "Helvetica-Bold"
for regular, negrita in FUENTES:
    if Path(regular).exists() and Path(negrita).exists():
        pdfmetrics.registerFont(TTFont("Curso", regular))
        pdfmetrics.registerFont(TTFont("Curso-Bold", negrita))
        pdfmetrics.registerFontFamily("Curso", normal="Curso", bold="Curso-Bold")
        FUENTE, FUENTE_NEGRITA = "Curso", "Curso-Bold"
        break

ESTILO = ParagraphStyle(
    "cuerpo", fontName=FUENTE, fontSize=18, leading=26,
    textColor=TEXTO,
)
ESTILO_NOTA = ParagraphStyle(
    "nota", parent=ESTILO, fontSize=16, leading=23,
    textColor=SUAVE,
)
ESTILO_DOC = ParagraphStyle(
    "doc", parent=ESTILO, fontSize=13.5, leading=19,
    textColor=SUAVE,
)
ESTILO_CODIGO = ParagraphStyle(
    "codigo", fontName="Courier", fontSize=13, leading=18,
    textColor=TEXTO,
)
ESTILO_TITULO = ParagraphStyle(
    "titulo", fontName=FUENTE_NEGRITA, fontSize=30, leading=36,
    textColor=TEXTO,
)


def en_linea(texto):
    """Conserva enlaces, código y negritas del Markdown en Paragraph."""
    trozos = re.split(r"(`[^`]+`|\*\*[^*]+\*\*|\[[^]]+\]\([^)]+\))", texto)
    salida = []
    for trozo in trozos:
        if trozo.startswith("`") and trozo.endswith("`"):
            salida.append(f'<font name="Courier" color="#C8102E">{html.escape(trozo[1:-1])}</font>')
        elif trozo.startswith("**") and trozo.endswith("**"):
            salida.append(f"<b>{html.escape(trozo[2:-2])}</b>")
        elif trozo.startswith("[") and "](" in trozo:
            etiqueta, url = trozo[1:-1].split("](", 1)
            salida.append(f'<link href="{html.escape(url, quote=True)}" color="#C8102E">{html.escape(etiqueta)}</link>')
        else:
            salida.append(html.escape(trozo))
    return "".join(salida)


def texto_markdown(texto):
    elementos = []
    for parrafo in re.split(r"\n\s*\n", texto.strip()):
        if not parrafo.strip():
            continue
        lineas = parrafo.splitlines()
        if all(re.match(r"^\s*[-*] ", linea) for linea in lineas):
            for linea in lineas:
                elementos.append(Paragraph("• " + en_linea(re.sub(r"^\s*[-*] ", "", linea)), ESTILO))
                elementos.append(Spacer(1, 8))
            continue
        limpio = re.sub(r"^#{1,3}\s+", "", parrafo)
        elementos.append(Paragraph(en_linea(limpio).replace("\n", "<br/>"), ESTILO))
        elementos.append(Spacer(1, 10))
    return elementos


def caja_codigo(lineas):
    if any(len(linea) > 100 for linea in lineas):
        raise ValueError("Una línea de código supera el ancho fijo de la diapositiva")
    caja = Table([[Preformatted("\n".join(lineas), ESTILO_CODIGO)]], colWidths=[ANCHO_CONTENIDO - 2])
    caja.hAlign = "LEFT"
    caja.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#F6F7F9")),
        ("BOX", (0, 0), (-1, -1), 0.5, BORDE),
        ("LEFTPADDING", (0, 0), (-1, -1), 13),
        ("RIGHTPADDING", (0, 0), (-1, -1), 13),
        ("TOPPADDING", (0, 0), (-1, -1), 7),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 7),
    ]))
    return caja


def contenido_pagina(pagina):
    elementos = []
    documentos = []
    for bloque in pagina["bloques"]:
        if bloque["tipo"] == "teoria":
            elementos.extend(texto_markdown(bloque["contenido"]))
        elif bloque["tipo"] == "codigo":
            lineas = bloque["contenido"].expandtabs(4).splitlines() or [""]
            for inicio in range(0, len(lineas), 10):
                elementos.append(caja_codigo(lineas[inicio:inicio + 10]))
                elementos.append(Spacer(1, 10))
            if bloque.get("salida"):
                salidas = bloque["salida"].splitlines() or [""]
                for inicio in range(0, len(salidas), 8):
                    etiqueta = "Salida" if inicio == 0 else "Salida (continuación)"
                    elementos.append((
                        Paragraph(etiqueta, ESTILO_DOC),
                        Spacer(1, 4),
                        Preformatted("\n".join(salidas[inicio:inicio + 8]), ESTILO_CODIGO),
                    ))
                    elementos.append(Spacer(1, 10))
        if bloque.get("nota"):
            elementos.append(Paragraph('<font color="#C8102E"><b>Nota técnica.</b></font> ' + en_linea(bloque["nota"]), ESTILO_NOTA))
            elementos.append(Spacer(1, 10))
        if bloque.get("docs"):
            for doc in bloque["docs"]:
                if doc["url"] not in [item["url"] for item in documentos]:
                    documentos.append(doc)
    if documentos:
        etiquetas = [
            f'<link href="{html.escape(doc["url"], quote=True)}" color="#C8102E">{html.escape(doc["titulo"])}</link>'
            for doc in documentos[:3]
        ]
        elementos.append(Paragraph("Documentación: " + " · ".join(etiquetas), ESTILO_DOC))
    return elementos or [Paragraph("Continúa en la siguiente diapositiva.", ESTILO)]


def medida_titulo(pdf, titulo):
    parrafo = Paragraph(html.escape(titulo), ESTILO_TITULO)
    _, altura = parrafo.wrapOn(pdf, ANCHO_CONTENIDO, 110)
    return parrafo, altura


def tope_contenido(pdf, titulo):
    _, altura = medida_titulo(pdf, titulo)
    return ALTO - 156 - altura


def paginar(pdf, pagina):
    """Mantiene las medidas; cualquier desborde crea otra página."""
    titulo = pagina["titulo"]
    disponible = tope_contenido(pdf, titulo) - BASE_CONTENIDO
    if disponible < 160:
        raise ValueError(f"El título ocupa demasiado espacio: {titulo}")
    fragmentos = [{"titulo": titulo, "continuacion": False, "elementos": []}]
    restante = disponible
    pendientes = list(contenido_pagina(pagina))
    while pendientes:
        elemento = pendientes.pop(0)
        partes_grupo = elemento if isinstance(elemento, tuple) else (elemento,)
        altura = sum(parte.wrapOn(pdf, ANCHO_CONTENIDO, disponible)[1] for parte in partes_grupo)
        if altura > disponible + 0.01:
            if isinstance(elemento, tuple):
                raise ValueError(f"Una salida no cabe con el tamaño fijo: {titulo}")
            partes = elemento.splitOn(pdf, ANCHO_CONTENIDO, disponible)
            if len(partes) < 2:
                raise ValueError(f"Un bloque no cabe con el tamaño fijo: {titulo}")
            pendientes = partes + pendientes
            continue
        if altura > restante + 0.01:
            fragmentos.append({"titulo": titulo, "continuacion": True, "elementos": []})
            restante = disponible
            if isinstance(elemento, Spacer):
                continue
        if not fragmentos[-1]["elementos"] and isinstance(elemento, Spacer):
            continue
        fragmentos[-1]["elementos"].append((elemento, altura))
        restante -= altura
    return fragmentos


def dibujar_portada(pdf, leccion):
    pdf.setFillColor(ROJO)
    pdf.rect(0, 0, ANCHO, ALTO, fill=1, stroke=0)
    pdf.drawImage(LLAMA_BLANCA, MARGEN, ALTO - 195, width=100, height=131, mask="auto")
    pdf.drawImage(ICONO_SQLITE_BLANCO, ANCHO - MARGEN - 72, ALTO - 160, width=72, height=72, mask="auto")
    pdf.setFillColor(colors.white)
    pdf.setFont(FUENTE_NEGRITA, 17)
    pdf.drawString(MARGEN + 135, ALTO - 103, "EDUQA.PE")
    pdf.setFont(FUENTE, 15)
    pdf.drawString(MARGEN + 135, ALTO - 130, "INTRODUCCIÓN A SQLITE CON PYTHON")
    pdf.setStrokeColor(colors.HexColor("#F0B6C3"))
    pdf.line(MARGEN, 316, ANCHO - MARGEN, 316)
    pdf.setFillColor(colors.white)
    pdf.setFont(FUENTE_NEGRITA, 13)
    pdf.drawString(MARGEN, 278, f"SESIÓN {int(leccion['slug'].split('-')[-1]):02d}")
    titulo = Paragraph(html.escape(leccion["titulo"]), ParagraphStyle(
        "portada", fontName=FUENTE_NEGRITA, fontSize=37, leading=44, textColor=colors.white,
    ))
    _, altura = titulo.wrapOn(pdf, ANCHO_CONTENIDO, 180)
    titulo.drawOn(pdf, MARGEN, 262 - altura)
    pdf.setFont(FUENTE_NEGRITA, 9)
    pdf.drawString(MARGEN, 106, "AUTOR")
    pdf.setFont(FUENTE_NEGRITA, 15)
    pdf.drawString(MARGEN, 82, leccion["autor"]["nombre"])
    pdf.setFont(FUENTE, 11)
    pdf.drawString(MARGEN, 61, leccion["autor"]["cargo"])
    pdf.showPage()


def dibujar_cierre(pdf, leccion):
    pdf.setFillColor(ROJO)
    pdf.rect(0, 0, ANCHO, ALTO, fill=1, stroke=0)
    pdf.drawImage(LLAMA_BLANCA, MARGEN, ALTO - 175, width=76, height=100, mask="auto")
    pdf.drawImage(ICONO_SQLITE_BLANCO, ANCHO - MARGEN - 78, ALTO - 160, width=78, height=78, mask="auto")
    pdf.setFillColor(colors.white)
    pdf.setFont(FUENTE_NEGRITA, 36)
    pdf.drawString(MARGEN, 245, "Fin de la sesión")
    titulo = Paragraph(html.escape(leccion["titulo"]), ParagraphStyle(
        "cierre", fontName=FUENTE, fontSize=23, leading=29, textColor=colors.white,
    ))
    _, altura = titulo.wrapOn(pdf, ANCHO_CONTENIDO, 100)
    titulo.drawOn(pdf, MARGEN, 222 - altura)
    pdf.setFont(FUENTE, 13)
    pdf.drawString(MARGEN, 72, leccion["autor"]["nombre"])
    pdf.showPage()


def dibujar_pagina(pdf, leccion, fragmento, numero, total):
    pdf.setFillColor(colors.white)
    pdf.rect(0, 0, ANCHO, ALTO, fill=1, stroke=0)
    pdf.drawImage(LLAMA, MARGEN, ALTO - 87, width=23, height=30, mask="auto")
    pdf.setFillColor(ROJO)
    pdf.setFont(FUENTE_NEGRITA, 11)
    pdf.drawString(MARGEN + 34, ALTO - 70, "EDUQA.PE")
    pdf.drawImage(ICONO_SQLITE, ANCHO - MARGEN - 26, ALTO - 87, width=26, height=26, mask="auto")
    pdf.setFont(FUENTE, 11)
    pdf.setFillColor(SUAVE)
    pdf.drawRightString(ANCHO - MARGEN - 38, ALTO - 70, leccion["titulo"])

    titulo, altura_titulo = medida_titulo(pdf, fragmento["titulo"])
    titulo.drawOn(pdf, MARGEN, ALTO - 117 - altura_titulo)
    if fragmento["continuacion"]:
        pdf.setFont(FUENTE, 11)
        pdf.setFillColor(SUAVE)
        pdf.drawString(MARGEN + 170, ALTO - 70, "CONTINUACIÓN")

    linea_y = ALTO - 136 - altura_titulo
    pdf.setStrokeColor(BORDE)
    pdf.line(MARGEN, linea_y, ANCHO - MARGEN, linea_y)
    y = linea_y - 20
    for elemento, altura in fragmento["elementos"]:
        if isinstance(elemento, tuple):
            for parte in elemento:
                _, altura_parte = parte.wrapOn(pdf, ANCHO_CONTENIDO, altura)
                y -= altura_parte
                parte.drawOn(pdf, MARGEN, y)
        else:
            y -= altura
            elemento.drawOn(pdf, MARGEN, y)
    if y < BASE_CONTENIDO - 0.01:
        raise ValueError(f"Contenido fuera de la diapositiva: {fragmento['titulo']}")

    pdf.setStrokeColor(BORDE)
    pdf.line(MARGEN, 88, ANCHO - MARGEN, 88)
    pdf.setFont(FUENTE, 10)
    pdf.setFillColor(SUAVE)
    pdf.drawString(MARGEN, 64, "INTRODUCCIÓN A SQLITE CON PYTHON")
    pdf.drawRightString(ANCHO - MARGEN, 64, f"{numero:02d} / {total:02d}")
    pdf.showPage()


def main():
    datos = json.load(sys.stdin)
    DESTINO.mkdir(parents=True, exist_ok=True)
    for leccion in datos["lecciones"]:
        if not leccion["paginas"]:
            raise ValueError(f"La sesión {leccion['slug']} no tiene diapositivas")
        archivo = DESTINO / f"{leccion['slug']}.pdf"
        pdf = canvas.Canvas(str(archivo), pagesize=(ANCHO, ALTO), pageCompression=1)
        pdf.setTitle(f"{leccion['titulo']} - Introducción a SQLite con Python")
        pdf.setAuthor(leccion["autor"]["nombre"])
        fragmentos = [fragmento for pagina in leccion["paginas"] for fragmento in paginar(pdf, pagina)]
        dibujar_portada(pdf, leccion)
        for numero, fragmento in enumerate(fragmentos, 1):
            dibujar_pagina(pdf, leccion, fragmento, numero, len(fragmentos))
        dibujar_cierre(pdf, leccion)
        pdf.save()
        print(f"{archivo.relative_to(RAIZ)}: portada + {len(fragmentos)} diapositivas + cierre")


if __name__ == "__main__":
    main()
