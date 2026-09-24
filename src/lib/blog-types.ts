export type PosicionCaratulaBlog = "arriba" | "centro" | "abajo";

export type CaratulaBlog = {
  url: string;
  alt: string;
  posicion?: PosicionCaratulaBlog;
};

export type ArticuloBlog = {
  guid: string;
  slug: string;
  titulo: string;
  resumen: string;
  contenido: string;
  /**
   * Carátula editorial opcional para artículos nativos.
   * Permite controlar el texto alternativo y el punto vertical de recorte.
   */
  caratula?: CaratulaBlog | null;
  /**
   * Campo heredado de Medium. Se mantiene como fallback de compatibilidad.
   */
  portada: string | null;
  fecha: string;
  fechaIso: string;
  autor: string;
  enlaceMedium: string | null;
  categorias: string[];
  minutosLectura: number;
};

export function resolverCaratulaBlog(
  articulo: ArticuloBlog,
): CaratulaBlog | null {
  if (articulo.caratula?.url) return articulo.caratula;
  if (!articulo.portada) return null;

  return {
    url: articulo.portada,
    alt: articulo.titulo,
    posicion: "centro",
  };
}

export function posicionObjetoCaratula(
  posicion: PosicionCaratulaBlog | undefined,
): string {
  if (posicion === "arriba") return "center top";
  if (posicion === "abajo") return "center bottom";
  return "center center";
}
