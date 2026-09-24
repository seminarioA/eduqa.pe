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
  enlaceMedium: string | null;
  categorias: string[];
  minutosLectura: number;
};
