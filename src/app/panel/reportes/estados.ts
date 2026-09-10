export const ESTADOS_REPORTE = [
  "abierto",
  "en_curso",
  "resuelto",
  "descartado",
] as const;

export type EstadoDeReporte = (typeof ESTADOS_REPORTE)[number];
