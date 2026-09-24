"use client";

import { useActionState, useState } from "react";
import { AlertCircle, CheckCircle2, KeyRound, Loader2, Mail } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import {
  accederConContrasena,
  enviarEnlaceMagico,
  type EstadoAcceso,
} from "./acciones";
import { Boton, Campo, claseInput } from "@/components/ui";
import { clienteNavegador } from "@/lib/supabase/navegador";

type Metodo = "contrasena" | "enlace";

export function Formulario({
  volverA,
  errorInicial,
}: {
  volverA: string;
  errorInicial?: string;
}) {
  const [metodo, setMetodo] = useState<Metodo>("contrasena");
  const [enviandoGoogle, setEnviandoGoogle] = useState(false);
  const [errorGoogle, setErrorGoogle] = useState<string | null>(errorInicial ?? null);
  const [estadoPass, accionPass, enviandoPass] = useActionState<
    EstadoAcceso | null,
    FormData
  >(accederConContrasena, null);
  const [estadoLink, accionLink, enviandoLink] = useActionState<
    EstadoAcceso | null,
    FormData
  >(enviarEnlaceMagico, null);

  const estado = metodo === "contrasena" ? estadoPass : estadoLink;
  const enviando = metodo === "contrasena" ? enviandoPass : enviandoLink;

  async function accederConGoogle() {
    setEnviandoGoogle(true);
    setErrorGoogle(null);

    const callback = new URL("/auth/callback", window.location.origin);
    callback.searchParams.set("next", volverA);

    const supabase = clienteNavegador();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: callback.toString(),
      },
    });

    if (error) {
      console.error("[accederConGoogle]", error.message);
      setErrorGoogle("No pudimos iniciar el acceso con Google. Intenta de nuevo.");
      setEnviandoGoogle(false);
    }
  }

  return (
    <div>
      <Boton
        type="button"
        variante="secundario"
        className="w-full"
        disabled={enviandoGoogle}
        onClick={accederConGoogle}
      >
        {enviandoGoogle ? (
          <Loader2 size={16} className="animate-spin" aria-hidden="true" />
        ) : (
          <FcGoogle size={18} aria-hidden="true" />
        )}
        {enviandoGoogle ? "Abriendo Google…" : "Continuar con Google"}
      </Boton>

      <div className="my-5 flex items-center gap-3" aria-hidden="true">
        <span className="h-px flex-1 bg-borde" />
        <span className="text-xs text-texto-tenue">o continúa con correo</span>
        <span className="h-px flex-1 bg-borde" />
      </div>

      {errorGoogle && (
        <p
          role="alert"
          className="mb-4 flex items-start gap-2 rounded-lg border border-rojo-acento/30 bg-rojo-tenue px-3 py-2.5 text-sm text-rojo-acento"
        >
          <AlertCircle size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
          {errorGoogle}
        </p>
      )}

      <div
        role="tablist"
        aria-label="Método de acceso"
        className="mb-6 flex rounded-lg border border-borde bg-superficie p-1"
      >
        {(
          [
            { id: "contrasena", etiqueta: "Contraseña", Icono: KeyRound },
            { id: "enlace", etiqueta: "Por correo", Icono: Mail },
          ] as const
        ).map(({ id, etiqueta, Icono }) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={metodo === id}
            onClick={() => setMetodo(id)}
            className={`flex flex-1 items-center justify-center gap-1.5 whitespace-nowrap rounded-md px-2 py-1.5 text-sm font-medium transition-colors ${
              metodo === id
                ? "bg-fondo text-texto shadow-sm"
                : "text-texto-tenue hover:text-texto"
            }`}
          >
            <Icono size={14} aria-hidden="true" />
            {etiqueta}
          </button>
        ))}
      </div>

      <form
        key={metodo}
        action={metodo === "contrasena" ? accionPass : accionLink}
        className="space-y-4"
      >
        <input type="hidden" name="volverA" value={volverA} />

        <Campo etiqueta="Correo">
          <input
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="tu@correo.com"
            className={claseInput}
          />
        </Campo>

        {metodo === "contrasena" && (
          <Campo etiqueta="Contraseña">
            <input
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className={claseInput}
            />
          </Campo>
        )}

        {estado && !estado.ok && (
          <p
            role="alert"
            className="flex items-start gap-2 rounded-lg border border-rojo-acento/30 bg-rojo-tenue px-3 py-2.5 text-sm text-rojo-acento"
          >
            <AlertCircle size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
            {estado.error}
          </p>
        )}

        {estado?.ok && (
          <p className="flex items-start gap-2 rounded-lg border border-borde bg-superficie px-3 py-2.5 text-sm text-texto-suave">
            <CheckCircle2
              size={16}
              className="mt-0.5 shrink-0 text-exito"
              aria-hidden="true"
            />
            {estado.aviso}
          </p>
        )}

        <Boton type="submit" disabled={enviando} className="w-full">
          {enviando && <Loader2 size={16} className="animate-spin" aria-hidden="true" />}
          {enviando
            ? "Comprobando…"
            : metodo === "contrasena"
              ? "Entrar"
              : "Enviarme el enlace"}
        </Boton>
      </form>

      <p className="mt-6 text-center text-xs leading-relaxed text-texto-tenue">
        Con Google puedes entrar o crear tu cuenta en el mismo flujo.
      </p>
    </div>
  );
}
