import { Star } from "lucide-react";

/**
 * Nota media en estrellas.
 *
 * Sin votos no se dibuja nada. Pintar cinco estrellas vacías o un «0,0» daría
 * a entender que el curso está mal valorado cuando lo que ocurre es que
 * todavía no lo ha valorado nadie, y son cosas distintas.
 *
 * Las estrellas son iconos, no caracteres: un glifo de texto cambia de forma
 * y de tamaño según la tipografía de cada sistema.
 */
export function Estrellas({
  promedio,
  total,
  tamano = 13,
}: {
  promedio: number;
  total: number;
  tamano?: number;
}) {
  if (total === 0) return null;

  // Se redondea a la media estrella más cercana, que es la resolución que el
  // ojo distingue; afinar más solo produce diferencias que nadie ve.
  const medias = Math.round(promedio * 2) / 2;

  return (
    <span
      className="inline-flex items-center gap-1"
      title={`${promedio.toFixed(1)} de 5 · ${total} valoración${total === 1 ? "" : "es"}`}
    >
      <span className="inline-flex" aria-hidden="true">
        {[1, 2, 3, 4, 5].map((n) => {
          const llena = medias >= n;
          const media = !llena && medias >= n - 0.5;
          return (
            <span key={n} className="relative inline-block" style={{ width: tamano, height: tamano }}>
              <Star size={tamano} className="absolute inset-0 text-borde-fuerte" />
              {(llena || media) && (
                <span
                  className="absolute inset-0 overflow-hidden"
                  style={{ width: media ? tamano / 2 : tamano }}
                >
                  <Star size={tamano} className="fill-current text-rojo-acento" />
                </span>
              )}
            </span>
          );
        })}
      </span>
      <span className="text-[11px] tabular-nums text-texto-suave">
        {promedio.toFixed(1)}
        <span className="text-texto-tenue"> ({total})</span>
      </span>
      <span className="sr-only">
        {promedio.toFixed(1)} de 5 estrellas, {total} valoraci
        {total === 1 ? "ón" : "ones"}
      </span>
    </span>
  );
}
