import Link from "next/link";
import type { Metadata } from "next";
import { Llama } from "@/components/Llama";
import { Formulario } from "./Formulario";

export const metadata: Metadata = {
  title: "Acceder — EDUQA.PE",
  robots: { index: false, follow: false },
};

function destinoSeguro(valor: string | string[] | undefined) {
  return typeof valor === "string" && valor.startsWith("/") && !valor.startsWith("//")
    ? valor
    : "/panel";
}

export default async function Page({ searchParams }: PageProps<"/acceder">) {
  // Next 16: searchParams llega como promesa.
  const { volverA, error } = await searchParams;
  const destino = destinoSeguro(volverA);
  const errorInicial =
    error === "oauth_google"
      ? "No pudimos completar el acceso con Google. Intenta de nuevo."
      : undefined;

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
        <h1 className="text-xl font-semibold tracking-tight">Acceder</h1>
        <p className="mt-1.5 text-sm text-texto-suave">
          Entra para administrar cursos y certificados.
        </p>

        <div className="mt-6">
          <Formulario volverA={destino} errorInicial={errorInicial} />
        </div>
      </div>
    </main>
  );
}
