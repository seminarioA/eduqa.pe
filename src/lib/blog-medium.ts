import "server-only";

import { cache } from "react";

export type ArticuloBlog = {
  guid: string;
  slug: string;
  titulo: string;
  resumen: string;
  contenido: string;
  portada: string | null;
  fecha: string;
  fechaIso: string;
  autor: string;
  enlaceMedium: string;
  categorias: string[];
  minutosLectura: number;
};

function extraerImagen(html: string): string | null {
  const m = html.match(/<img[^>]+src=["']([^"']+)["']/i);
  return m ? m[1] : null;
}

function limpiarTexto(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}

function slugificar(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Obtiene los artículos del blog sincronizados desde el feed de Medium de la empresa.
 * Si el feed falla o no contiene entradas, no se publica contenido inexistente.
 */
export const obtenerArticulosMedium = cache(async (): Promise<ArticuloBlog[]> => {
  const feedUrl =
    process.env.MEDIUM_FEED_URL ||
    (process.env.NEXT_PUBLIC_MEDIUM_USERNAME
      ? `https://medium.com/feed/@${process.env.NEXT_PUBLIC_MEDIUM_USERNAME.replace(/^@/, "")}`
      : "https://medium.com/feed/@seminarioA");

  try {
    const res = await fetch(feedUrl, {
      next: { revalidate: 3600, tags: ["medium-blog"] },
      headers: { Accept: "application/rss+xml, application/xml, text/xml" },
    });

    if (!res.ok) {
      console.warn(`El feed de Medium respondió ${res.status}: ${feedUrl}`);
      return [];
    }

    const xml = await res.text();
    const articulos = parsearRssMedium(xml);
    return articulos;
  } catch (error) {
    console.warn("No se pudo consultar el feed de Medium:", error);
    return [];
  }
});

function parsearRssMedium(xml: string): ArticuloBlog[] {
  const items = xml.match(/<item>([\s\S]*?)<\/item>/gi) ?? [];
  const articulos: ArticuloBlog[] = [];

  for (const item of items) {
    const sacar = (tag: string) => {
      const match = item.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i"));
      if (!match) return "";
      return match[1].replace(/<!\[CDATA\[([\s\S]*?)\]\]>/gi, "$1").trim();
    };

    const titulo = sacar("title");
    const link = sacar("link");
    const guid = sacar("guid") || link;
    const pubDate = sacar("pubDate");
    const creator = sacar("dc:creator");
    const content = sacar("content:encoded") || sacar("description");

    const categoriasMatches = item.match(/<category>([\s\S]*?)<\/category>/gi) ?? [];
    const categorias = categoriasMatches
      .map((c) => c.replace(/<category[^>]*>|<\/category>/gi, "").replace(/<!\[CDATA\[([\s\S]*?)\]\]>/gi, "$1").trim())
      .filter(Boolean);

    if (!titulo || !content || !link || !pubDate || Number.isNaN(new Date(pubDate).getTime())) continue;

    const portada = extraerImagen(content);
    const textoPlano = limpiarTexto(content);
    const resumen = textoPlano.slice(0, 220).trim() + "...";
    const palabras = textoPlano.split(/\s+/).length;
    const minutosLectura = Math.max(1, Math.round(palabras / 180));

    const fechaObj = new Date(pubDate);
    const fecha = fechaObj.toLocaleDateString("es-PE", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    articulos.push({
      guid,
      slug: slugificar(titulo),
      titulo,
      resumen,
      contenido: content,
      portada,
      fecha,
      fechaIso: fechaObj.toISOString(),
      autor: creator || "Autor no indicado",
      enlaceMedium: link,
      categorias,
      minutosLectura,
    });
  }

  return articulos;
}

export const buscarArticuloMedium = cache(async (slug: string): Promise<ArticuloBlog | undefined> => {
  const articulos = await obtenerArticulosMedium();
  return articulos.find((a) => a.slug === slug);
});

export const obtenerCategoriasBlog = cache(async (): Promise<string[]> => {
  const articulos = await obtenerArticulosMedium();
  const set = new Set<string>();
  for (const a of articulos) {
    for (const c of a.categorias) set.add(c);
  }
  return [...set];
});
