"use client";

import { useActionState } from "react";
import Link from "next/link";
import { AlertCircle, CheckCircle2, Loader2, MailCheck } from "lucide-react";
import {
  registrar,
  reenviarCodigo,
  verificarCodigo,
  type EstadoRegistro,
} from "./acciones";
import { Boton, Campo, claseInput } from "@/components/ui";

function Aviso({ estado }: { estado: EstadoRegistro | null }) {
  if (!estado) return null;
  if (estado.error)
    return (
      <p
        role="alert"
        className="flex items-start gap-2 rounded-lg border border-rojo-acento/30 bg-rojo-tenue px-3 py-2.5 text-sm text-rojo-acento"
      >
        <AlertCircle size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
        {estado.error}
      </p>
    );
  if (estado.paso === "codigo" && estado.aviso)
    return (
      <p className="flex items-start gap-2 rounded-lg border border-borde bg-superficie px-3 py-2.5 text-sm text-texto-suave">
        <CheckCircle2
          size={16}
          className="mt-0.5 shrink-0 text-exito"
          aria-hidden="true"
        />
        {estado.aviso}
      </p>
    );
  return null;
}

export function Formulario() {
  const [estado, accionRegistrar, registrando] = useActionState<
    EstadoRegistro | null,
    FormData
  >(registrar, null);
  const [estadoCodigo, accionVerificar, verificando] = useActionState<
    EstadoRegistro | null,
    FormData
  >(verificarCodigo, null);
  const [estadoReenvio, accionReenviar, reenviando] = useActionState<
    EstadoRegistro | null,
    FormData
  >(reenviarCodigo, null);

  // Una vez enviado el código se pasa al segundo paso y no se vuelve atrás.
  const enPasoCodigo =
    estado?.paso === "codigo" ||
    estadoCodigo?.paso === "codigo" ||
    estadoReenvio?.paso === "codigo";

  const email =
    (estado?.paso === "codigo" && estado.email) ||
    (estadoCodigo?.paso === "codigo" && estadoCodigo.email) ||
    (estadoReenvio?.paso === "codigo" && estadoReenvio.email) ||
    "";

  if (enPasoCodigo) {
    const ultimo = estadoReenvio ?? estadoCodigo ?? estado;
    return (
      <div>
        <div className="mb-5 flex items-start gap-2.5 rounded-lg border border-borde bg-superficie px-3.5 py-3">
          <MailCheck size={18} className="mt-0.5 shrink-0 text-rojo-acento" aria-hidden="true" />
          <p className="text-sm leading-relaxed text-texto-suave">
            Enviamos un código de verificación a{" "}
            <strong className="font-medium text-texto">{email}</strong>.
          </p>
        </div>

        <form action={accionVerificar} className="space-y-4">
          <input type="hidden" name="email" value={email} />
          <Campo etiqueta="Código de verificación">
            <input
              name="codigo"
              required
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={10}
              placeholder="123456"
              className={`${claseInput} text-center font-mono text-lg tracking-[0.3em]`}
            />
          </Campo>

          <Aviso estado={ultimo} />

          <Boton type="submit" disabled={verificando} className="w-full">
            {verificando && (
              <Loader2 size={16} className="animate-spin" aria-hidden="true" />
            )}
            {verificando ? "Comprobando…" : "Verificar y entrar"}
          </Boton>
        </form>

        <form action={accionReenviar} className="mt-3">
          <input type="hidden" name="email" value={email} />
          <button
            type="submit"
            disabled={reenviando}
            className="w-full text-center text-xs text-texto-tenue transition-colors hover:text-rojo-acento disabled:opacity-50"
          >
            {reenviando ? "Reenviando…" : "No me llegó, enviar otro código"}
          </button>
        </form>
      </div>
    );
  }

  return (
    <form action={accionRegistrar} className="space-y-4">
      <Campo etiqueta="Nombre completo">
        <input
          name="nombre"
          required
          minLength={3}
          autoComplete="name"
          placeholder="Ana Quispe Rojas"
          className={claseInput}
        />
      </Campo>

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

      <Campo
        etiqueta="Contraseña"
        ayuda="Mínimo 8 caracteres. Que no sea la misma de otra página."
      >
        <input
          name="password"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          className={claseInput}
        />
      </Campo>

      <Aviso estado={estado} />

      <Boton type="submit" disabled={registrando} className="w-full">
        {registrando && <Loader2 size={16} className="animate-spin" aria-hidden="true" />}
        {registrando ? "Creando la cuenta…" : "Crear cuenta"}
      </Boton>

      <p className="text-center text-xs text-texto-tenue">
        ¿Ya tienes cuenta?{" "}
        <Link href="/acceder" className="font-medium text-rojo-acento hover:underline">
          Accede
        </Link>
      </p>
    </form>
  );
}
