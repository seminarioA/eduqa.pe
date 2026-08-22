import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { usuarioActual } from "@/lib/supabase/servidor";
import { Llama } from "@/components/Llama";
import { LIMITE_PLAN_GRATIS } from "@/lib/matriculas";
import { Formulario } from "./Formulario";

export const metadata: Metadata = {
  title: "Crear cuenta — EDUQA.PE",
  robots: { index: false, follow: false },
};

export default async function Page() {
  if (await usuarioActual()) redirect("/cursos");

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center px-6 py-12">
      <div className="absolute right-6 top-6">
      </div>

      <Link href="/" className="flex items-center gap-3">
        <Llama className="h-12 w-auto text-rojo-acento" />
        <span className="text-base font-bold uppercase tracking-[0.2em] text-rojo-acento">
          EDUQA.PE
        </span>
      </Link>

      <div className="mt-10 w-full max-w-sm rounded-2xl border border-borde bg-fondo p-7 shadow-sm">
        <h1 className="text-xl font-semibold tracking-tight">Crear cuenta</h1>
        <p className="mt-1.5 text-sm leading-relaxed text-texto-suave">
          Con una cuenta gratuita puedes cursar {LIMITE_PLAN_GRATIS} cursos a la vez.
        </p>

        <div className="mt-6">
          <Formulario />
        </div>
      </div>
    </main>
  );
}
