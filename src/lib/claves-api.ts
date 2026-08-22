import "server-only";

import { createHash, randomBytes, timingSafeEqual } from "node:crypto";

export const PREFIJO = "eduqa_sk_";

/**
 * Genera una clave nueva y su resumen.
 *
 * La clave completa se devuelve una única vez, al crearla; lo que se guarda es
 * su resumen SHA-256. Una filtración de la base no permite autenticarse, y por
 * eso tampoco existe forma de volver a mostrarla: si se pierde, se emite otra.
 */
export function generarClave() {
  const secreto = randomBytes(32).toString("base64url");
  const clave = `${PREFIJO}${secreto}`;
  return { clave, resumen: resumir(clave), prefijo: clave.slice(0, PREFIJO.length + 6) };
}

export function resumir(clave: string) {
  return createHash("sha256").update(clave).digest("hex");
}

/**
 * Compara dos resúmenes en tiempo constante.
 *
 * La comparación con `===` termina en el primer carácter distinto, y ese
 * tiempo variable permite deducir el valor byte a byte. Aquí no aplica porque
 * se comparan resúmenes y no la clave, pero mantenerlo es gratuito.
 */
export function coincide(a: string, b: string) {
  const x = Buffer.from(a, "hex");
  const y = Buffer.from(b, "hex");
  return x.length === y.length && timingSafeEqual(x, y);
}
