"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { clienteServidor } from "@/lib/supabase/servidor";

export type EstadoRegistro =
  | { paso: "datos"; error?: string }
  | { paso: "codigo"; email: string; aviso?: string; error?: string };

const RE_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
/*
 * El largo del código lo decide Supabase, no este código: es un ajuste del
 * panel (Email OTP Length) que va de 6 a 10 y por defecto vale 6. Fijar aquí
 * un largo concreto haría que el formulario rechace códigos válidos si ese
 * ajuste cambia, así que se acepta todo el rango y quien valida de verdad
 * es verifyOtp.
 */
const RE_CODIGO = /^\d{6,10}$/;
const LARGO_MINIMO = 8;

function limpiar(v: FormDataEntryValue | null) {
  return typeof v === "string" ? v.trim() : "";
}

/**
 * Crea la cuenta e inicia sesión directamente sin pedir código de verificación.
 */
export async function registrar(
  _prev: EstadoRegistro | null,
  formData: FormData,
): Promise<EstadoRegistro> {
  const nombre = limpiar(formData.get("nombre"));
  const email = limpiar(formData.get("email")).toLowerCase();
  const password = limpiar(formData.get("password"));

  if (nombre.length < 3)
    return { paso: "datos", error: "Escribe tu nombre completo." };
  if (!RE_EMAIL.test(email))
    return { paso: "datos", error: "Ese correo no parece válido." };
  if (password.length < LARGO_MINIMO)
    return {
      paso: "datos",
      error: `La contraseña necesita al menos ${LARGO_MINIMO} caracteres.`,
    };

  const supabase = await clienteServidor();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { nombre } },
  });

  if (error) {
    // Supabase rechaza contraseñas filtradas cuando esa opción está activa.
    if (/pwned|leaked|compromised/i.test(error.message)) {
      return {
        paso: "datos",
        error:
          "Esa contraseña es muy conocida y ya se ha filtrado antes. Elige otra.",
      };
    }
    if (/rate limit|too many/i.test(error.message)) {
      return {
        paso: "datos",
        error: "Demasiados intentos seguidos. Espera unos minutos y vuelve a probar.",
      };
    }
    console.error("[registrar]", error);
    return { paso: "datos", error: "No pudimos crear la cuenta. Intenta de nuevo." };
  }

  // Si la sesión no viene dada automáticamente por signUp, iniciamos sesión directamente
  if (!data.session) {
    const { error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (loginError) {
      console.error("[registrar:autoLogin]", loginError);
    }
  }

  revalidatePath("/", "layout");
  redirect("/cursos");
}

/** Paso 2: verifica el código y deja la sesión iniciada. */
export async function verificarCodigo(
  _prev: EstadoRegistro | null,
  formData: FormData,
): Promise<EstadoRegistro> {
  const email = limpiar(formData.get("email")).toLowerCase();
  const codigo = limpiar(formData.get("codigo")).replace(/\s/g, "");

  if (!RE_CODIGO.test(codigo))
    return { paso: "codigo", email, error: "El código son solo números." };

  const supabase = await clienteServidor();
  const { error } = await supabase.auth.verifyOtp({
    email,
    token: codigo,
    type: "signup",
  });

  if (error) {
    return {
      paso: "codigo",
      email,
      error: "Ese código no es válido o ya caducó. Pide uno nuevo.",
    };
  }

  revalidatePath("/", "layout");
  redirect("/cursos");
}

/** Reenvía el código si el primero no llegó o caducó. */
export async function reenviarCodigo(
  _prev: EstadoRegistro | null,
  formData: FormData,
): Promise<EstadoRegistro> {
  const email = limpiar(formData.get("email")).toLowerCase();

  const supabase = await clienteServidor();
  const { error } = await supabase.auth.resend({ type: "signup", email });

  if (error) {
    if (/rate limit|too many|security purposes/i.test(error.message)) {
      return {
        paso: "codigo",
        email,
        error: "Espera un minuto antes de pedir otro código.",
      };
    }
    return { paso: "codigo", email, error: "No pudimos reenviar el código." };
  }

  return { paso: "codigo", email, aviso: "Código reenviado." };
}
