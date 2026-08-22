import { createHash } from "node:crypto";
import { marcaActual } from "@/lib/marca";

/**
 * Favicon dinámico.
 *
 * Sirve el SVG guardado en la marca; si no hay ninguno, redirige a la llama
 * original de `public/`. Va por ruta y no por archivo porque el favicon se
 * cambia desde el módulo Marca sin desplegar nada.
 */

/**
 * Endurecimiento del SVG servido: es contenido subido por personas, así que
 * se declara explícitamente que es una imagen y se le prohíbe cargar nada
 * externo o ejecutar scripts aunque alguien colara algo por validación.
 */
const CABECERAS_SVG = {
  "Content-Type": "image/svg+xml",
  "X-Content-Type-Options": "nosniff",
  "Content-Security-Policy": "default-src 'none'; style-src 'unsafe-inline'",
} as const;

export async function GET(peticion: Request) {
  const { favicon } = await marcaActual();

  // Sin SVG propio la respuesta es un redireccionamiento a la llama original,
  // que es un archivo estático: ni base de datos ni cómputo por petición.
  if (!favicon) {
    return new Response(null, {
      status: 307,
      headers: { Location: new URL("/llama.svg", peticion.url).toString() },
    });
  }

  // El ETag permite el 304: si el SVG no cambió, ni el navegador ni el CDN
  // vuelven a descargarlo. Basta un hash corto del contenido.
  const etag = `W/"${createHash("sha256").update(favicon).digest("base64").slice(0, 27)}"`;

  if (peticion.headers.get("if-none-match") === etag) {
    return new Response(null, { status: 304, headers: { ETag: etag } });
  }

  return new Response(favicon, {
    headers: {
      ...CABECERAS_SVG,
      ETag: etag,
      // Cinco minutos en el navegador para que un cambio se vea el mismo día;
      // una hora en el CDN con revalidación en segundo plano, porque el
      // favicon es igual para todos y no vale una consulta a la base por
      // petición.
      "Cache-Control":
        "public, max-age=300, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
