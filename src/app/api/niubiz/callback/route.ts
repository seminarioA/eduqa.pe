import { NextResponse, type NextRequest } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { IPS_NIUBIZ } from "@/lib/niubiz";

/**
 * Recibe la notificación de pago de Niubiz.
 *
 * Niubiz no firma el callback, así que la única verificación posible es el
 * origen. Sin este filtro cualquiera podría llamar a esta ruta y marcarse
 * un pago como cobrado.
 *
 * El importe también se comprueba contra el registro de `pagos`: un callback
 * legítimo con el monto cambiado no debe activar el plan.
 */
function ipOrigen(request: NextRequest) {
  // En Vercel la IP real llega en x-forwarded-for; el primer valor es el cliente.
  const reenviada = request.headers.get("x-forwarded-for");
  return reenviada?.split(",")[0]?.trim() ?? null;
}

export async function POST(request: NextRequest) {
  const ip = ipOrigen(request);
  const permitirCualquierIp = process.env.NIUBIZ_CALLBACK_SIN_FILTRO === "1";

  if (!permitirCualquierIp && (!ip || !IPS_NIUBIZ.includes(ip))) {
    console.warn("[niubiz/callback] origen rechazado:", ip);
    return NextResponse.json({ error: "origen no autorizado" }, { status: 403 });
  }

  let trama: Record<string, unknown>;
  try {
    trama = await request.json();
  } catch {
    return NextResponse.json({ error: "cuerpo inválido" }, { status: 400 });
  }

  // `idc` es el identificador que se envió al generar el QR: es la fila de pagos.
  const idc = String(trama.idc ?? "");
  const tagId = String(trama.tagId ?? "");
  const montoNotificado = Number(trama.amount ?? trama.transactionAmount ?? 0);

  if (!idc && !tagId) {
    return NextResponse.json({ error: "falta idc o tagId" }, { status: 400 });
  }

  const supabase = supabaseAdmin();
  const consulta = supabase.from("pagos").select("id, monto, estado, usuario_id");
  const { data: pago } = idc
    ? await consulta.eq("id", idc).maybeSingle()
    : await consulta.eq("tag_id", tagId).maybeSingle();

  if (!pago) {
    console.warn("[niubiz/callback] pago no encontrado:", { idc, tagId });
    return NextResponse.json({ error: "pago no encontrado" }, { status: 404 });
  }

  // Idempotencia: Niubiz puede reintentar el aviso.
  if (pago.estado === "pagado") {
    return NextResponse.json({ ok: true, nota: "ya estaba registrado" });
  }

  if (Math.abs(Number(pago.monto) - montoNotificado) > 0.009) {
    console.error("[niubiz/callback] importe distinto", {
      esperado: pago.monto,
      recibido: montoNotificado,
    });
    return NextResponse.json({ error: "importe no coincide" }, { status: 409 });
  }

  const { error } = await supabase
    .from("pagos")
    .update({
      estado: "pagado",
      pagado_en: new Date().toISOString(),
      transaction_id: String(trama.transactionId ?? ""),
      numero_operacion: String(trama.operationNumber ?? ""),
      purchase_number: String(trama.purchaseNumber ?? ""),
      crudo: trama,
    })
    .eq("id", pago.id);

  if (error) {
    console.error("[niubiz/callback]", error);
    return NextResponse.json({ error: "no se pudo registrar" }, { status: 500 });
  }

  // El trigger activar_plan_pagado() ya movió el perfil a plan de pago.
  return NextResponse.json({ ok: true });
}
