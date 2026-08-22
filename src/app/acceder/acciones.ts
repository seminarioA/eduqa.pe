"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { clienteServidor } from "@/lib/supabase/servidor";

export type EstadoAcceso = { ok: false; error: string } | { ok: true; aviso: string };

const RE_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function limpiar(v: FormDataEntryValue | null) {
  return typeof v === "string" ? v.trim() : "";
}

/** Sanea el destino: solo rutas internas, para no habilitar redirección abierta. */
function destinoSeguro(valor: string) {
  return valor.startsWith("/") && !valor.startsWith("//") ? valor : "/panel";
}

export async function accederConContrasena(
  _prev: EstadoAcceso | null,
  formData: FormData,
): Promise<EstadoAcceso> {
  const email = limpiar(formData.get("email")).toLowerCase();
  const password = limpiar(formData.get("password"));
  const volverA = destinoSeguro(limpiar(formData.get("volverA")));

  if (!RE_EMAIL.test(email)) return { ok: false, error: "Ese correo no parece válido." };
  if (!password) return { ok: false, error: "Escribe tu contraseña." };

  const supabase = await clienteServidor();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    // Mismo mensaje para correo inexistente y contraseña incorrecta: distinguirlos
    // permitiría averiguar qué correos están registrados.
    return { ok: false, error: "Correo o contraseña incorrectos." };
  }

  revalidatePath("/", "layout");
  redirect(volverA);
}

export async function enviarEnlaceMagico(
  _prev: EstadoAcceso | null,
  formData: FormData,
): Promise<EstadoAcceso> {
  const email = limpiar(formData.get("email")).toLowerCase();
  if (!RE_EMAIL.test(email)) return { ok: false, error: "Ese correo no parece válido." };

  const supabase = await clienteServidor();
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITIO_URL ?? "http://localhost:3011"}/auth/confirmar`,
      // No crear cuentas desde el formulario: las altas se hacen a mano.
      shouldCreateUser: false,
    },
  });

  if (error) {
    console.error("[enviarEnlaceMagico]", error);
    return { ok: false, error: "No pudimos enviar el enlace. Intenta de nuevo." };
  }

  return {
    ok: true,
    aviso: "Si ese correo está registrado, recibirás un enlace para entrar.",
  };
}

export async function cerrarSesion() {
  const supabase = await clienteServidor();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/acceder");
}
