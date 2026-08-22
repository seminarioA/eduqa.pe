import "server-only";

/**
 * Integración con el API de QR de Niubiz (QR Manager v1.5).
 *
 * El flujo es:
 *   1. API Security devuelve un token JWT con autenticación básica.
 *   2. QR Manager genera un QR dinámico con el importe, y devuelve una
 *      imagen PNG en base64.
 *   3. El cliente escanea con Yape, Plin o cualquier billetera de la red.
 *   4. Niubiz avisa del pago por callback a la URL que registre el comercio.
 *
 * El QR es de la red de Niubiz, no de Yape: cualquier billetera adherida
 * puede leerlo. Por eso funciona con Yape y con Plin sin integrar cada una.
 */

const SANDBOX = {
  security: "https://apitestenv.vnforapps.com/api.security/v1/security",
  qrAscii: "https://apitestenv.vnforapps.com/api.qr.manager/v1/qr/ascii",
  consulta: "https://apitestenv.vnforapps.com/api.qr.manager/v1/qr/queryTransaction",
};

const PRODUCCION = {
  security: "https://apiprod.vnforapps.com/api.security/v1/security",
  qrAscii: "https://apiprod.vnforapps.com/api.qr.manager/v1/qr/ascii",
  consulta: "https://apiprod.vnforapps.com/api.qr.manager/v1/qr/queryTransaction",
};

const esProduccion = process.env.NIUBIZ_ENTORNO === "produccion";
const API = esProduccion ? PRODUCCION : SANDBOX;

/** Código de comercio de integración que la propia guía de Niubiz publica. */
const COMERCIO_SANDBOX = "438933213";

export const MONEDA_SOLES = "604";

function credenciales() {
  const usuario = process.env.NIUBIZ_USUARIO;
  const clave = process.env.NIUBIZ_CLAVE;
  const comercio = process.env.NIUBIZ_COMERCIO ?? COMERCIO_SANDBOX;

  if (!usuario || !clave) {
    throw new Error(
      "Faltan NIUBIZ_USUARIO y NIUBIZ_CLAVE. Sin credenciales no se puede generar el QR.",
    );
  }
  return { usuario, clave, comercio };
}

export function niubizConfigurado() {
  return Boolean(process.env.NIUBIZ_USUARIO && process.env.NIUBIZ_CLAVE);
}

/**
 * Paso 1: token de seguridad. Se pide uno por operación a propósito.
 * El token caduca y cachearlo obligaría a manejar su expiración, que es
 * más código y más formas de fallar que pedirlo de nuevo.
 */
async function obtenerToken(): Promise<string> {
  const { usuario, clave } = credenciales();
  const basica = Buffer.from(`${usuario}:${clave}`).toString("base64");

  const res = await fetch(API.security, {
    method: "GET",
    headers: { Authorization: `Basic ${basica}` },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Niubiz security devolvió ${res.status}`);
  }
  // La respuesta es el JWT en texto plano, no JSON.
  return (await res.text()).trim();
}

/** Fecha de vencimiento en el formato ddmmyyyy que exige el API. */
function fechaVencimiento(dias: number) {
  const d = new Date();
  // La guía advierte que el vencimiento cuenta desde las 00:00, así que
  // para que valga "hoy" hay que enviar la fecha del día siguiente.
  d.setDate(d.getDate() + dias + 1);
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  return `${dd}${mm}${d.getFullYear()}`;
}

export type QrGenerado = {
  tagId: string;
  imagenBase64: string;
  venceEn: Date;
};

/**
 * Paso 2: genera un QR dinámico con importe fijo.
 * `idc` viaja hasta el callback, de modo que al recibir el aviso de pago
 * se sabe qué registro de la tabla `pagos` corresponde.
 */
export async function generarQr({
  monto,
  idc,
  diasValidez = 1,
}: {
  monto: number;
  idc: string;
  diasValidez?: number;
}): Promise<QrGenerado> {
  const { comercio } = credenciales();
  const token = await obtenerToken();

  const res = await fetch(API.qrAscii, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
    cache: "no-store",
    body: JSON.stringify({
      enabled: true,
      param: [
        { name: "merchantId", value: comercio },
        { name: "transactionCurrency", value: MONEDA_SOLES },
        { name: "transactionAmount", value: monto.toFixed(2) },
        { name: "idc", value: idc },
      ],
      tagType: "DYNAMIC",
      validityDate: fechaVencimiento(diasValidez),
    }),
  });

  if (!res.ok) {
    throw new Error(`Niubiz qr/ascii devolvió ${res.status}`);
  }

  const datos = (await res.json()) as {
    codeResponse?: number;
    codResponse?: number;
    message?: string;
    tagId?: string;
    tagImg?: string;
  };

  // La guía documenta el campo como codResponse y el ejemplo lo muestra
  // como codeResponse. Se aceptan ambos para no depender de esa ambigüedad.
  const codigo = datos.codeResponse ?? datos.codResponse;
  if (codigo !== 0 || !datos.tagId || !datos.tagImg) {
    throw new Error(`Niubiz rechazó la generación: ${datos.message ?? "sin detalle"}`);
  }

  const venceEn = new Date();
  venceEn.setDate(venceEn.getDate() + diasValidez);

  return { tagId: datos.tagId, imagenBase64: datos.tagImg, venceEn };
}

/** Consulta el estado de una transacción por su identificador. */
export async function consultarTransaccion(transactionId: string) {
  const token = await obtenerToken();
  const res = await fetch(`${API.consulta}/${transactionId}`, {
    method: "GET",
    headers: { Authorization: token },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Niubiz consulta devolvió ${res.status}`);
  return res.json();
}

/**
 * IPs desde las que Niubiz envía el callback, según la guía de integración.
 * El callback no viene firmado, así que el origen es la única verificación
 * disponible: sin este filtro cualquiera podría marcar un pago como cobrado.
 */
export const IPS_NIUBIZ = esProduccion
  ? ["34.226.236.16", "54.174.152.7"]
  : ["35.153.17.226"];
