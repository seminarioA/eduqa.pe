"use server";

import { clienteServidor } from "@/lib/supabase/servidor";

export type EstadoReclamacion = { ok: boolean; error?: string; correlativo?: number };

const texto = (f: FormData, k: string) => String(f.get(k) ?? "").trim();

/**
 * Registra una hoja del libro de reclamaciones.
 *
 * Se guarda siempre, aunque quien reclama no tenga cuenta: el libro tiene que
 * estar abierto a cualquiera. Si hay sesión se anota, para que esa persona
 * pueda consultar después el estado de lo que presentó.
 */
export async function presentarReclamacion(
  _prev: EstadoReclamacion | null,
  formData: FormData,
): Promise<EstadoReclamacion> {
  const nombre = texto(formData, "nombre");
  const documento = texto(formData, "documento");
  const email = texto(formData, "email");
  const descripcionBien = texto(formData, "descripcion_bien");
  const detalle = texto(formData, "detalle");
  const pedido = texto(formData, "pedido");
  const tipo = texto(formData, "tipo");
  const esMenor = formData.get("es_menor") !== null;
  const apoderado = texto(formData, "apoderado");

  if (nombre.length < 3) return { ok: false, error: "Escribe tu nombre completo." };
  if (documento.length < 6) return { ok: false, error: "El número de documento no parece válido." };
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return { ok: false, error: "Revisa el correo: ahí te llegará la copia." };
  }
  if (descripcionBien.length < 3) return { ok: false, error: "Indica qué curso o servicio contrataste." };
  if (detalle.length < 10) return { ok: false, error: "Cuenta con algo más de detalle qué pasó." };
  if (pedido.length < 5) return { ok: false, error: "Indica qué esperas que se haga." };
  if (tipo !== "reclamo" && tipo !== "queja") return { ok: false, error: "Elige reclamo o queja." };
  // Si el consumidor es menor de edad, la hoja tiene que identificar a quien
  // lo representa; sin eso no se puede tramitar.
  if (esMenor && apoderado.length < 3) {
    return { ok: false, error: "Si el consumidor es menor de edad, indica el nombre del padre o apoderado." };
  }

  const monto = Number(formData.get("monto"));
  const supabase = await clienteServidor();

  // Se llama a la función y no se inserta directo: quien reclama sin cuenta no
  // puede leer la tabla, y un insert con RETURNING necesita lectura.
  const { data, error } = await supabase.rpc("registrar_reclamacion", {
    p_nombre: nombre,
    p_documento_tipo: texto(formData, "documento_tipo") || "DNI",
    p_documento: documento,
    p_email: email,
    p_telefono: texto(formData, "telefono"),
    p_domicilio: texto(formData, "domicilio"),
    p_es_menor: esMenor,
    p_apoderado: esMenor ? apoderado : "",
    p_tipo_bien: texto(formData, "tipo_bien") || "servicio",
    p_descripcion_bien: descripcionBien,
    p_monto: Number.isFinite(monto) && monto > 0 ? monto : null,
    p_tipo: tipo,
    p_detalle: detalle,
    p_pedido: pedido,
  });

  if (error) return { ok: false, error: "No se pudo registrar. Inténtalo de nuevo en un momento." };

  return { ok: true, correlativo: Number(data) };
}
