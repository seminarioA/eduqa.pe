import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { Stamp } from "lucide-react";
import { usuarioActual } from "@/lib/supabase/servidor";
import { perfilActual } from "@/lib/matriculas";
import {
  ETIQUETAS_RANURA,
  marcaActual,
  RANURAS_MARCA,
  type RanuraMarca,
} from "@/lib/marca";
import { Llama } from "@/components/Llama";
import { Migas } from "@/components/Migas";
import { Subir } from "./Subir";
import { Restablecer } from "./Restablecer";

export const metadata: Metadata = {
  title: "Marca — EDUQA.PE",
  robots: { index: false, follow: false },
};

/** Qué parte de la interfaz toca cada ranura; se muestra bajo su etiqueta. */
const AYUDA: Record<RanuraMarca, string> = {
  sidebar: "Barra lateral de toda la aplicación.",
  cabecera: "Logo sobre las migas de pan en las páginas internas.",
  favicon: "Icono de la pestaña del navegador. Tarda unos minutos en verse.",
  cierre: "Celebración al terminar todas las sesiones de un curso.",
};

export default async function Page() {
  const usuario = await usuarioActual();
  if (!usuario) redirect("/acceder?volverA=/panel/marca");

  // Cambiar la marca es gestión: no basta con tener sesión.
  const perfil = await perfilActual();
  if (!perfil?.es_admin) redirect("/cursos");

  const marca = await marcaActual();

  return (
    <main className="mx-auto w-full max-w-3xl px-6 lg:pl-64 xl:pl-32 2xl:pl-6 py-12">
      <div className="flex items-center justify-between gap-4">
        <Link href="/panel" className="flex items-center gap-3">
          <Llama className="h-10 w-auto text-rojo-acento" />
          <span className="text-base font-bold uppercase tracking-[0.2em] text-rojo-acento">
            EDUQA.PE
          </span>
        </Link>
      </div>

      <div className="mt-8">
        <Migas items={[{ texto: "Panel", href: "/panel" }, { texto: "Marca" }]} />
      </div>

      <h1 className="mt-4 flex items-center gap-2 text-3xl font-semibold tracking-tight">
        <Stamp size={26} className="text-rojo-acento" aria-hidden="true" />
        Marca
      </h1>
      <p className="mt-2 max-w-xl text-sm leading-relaxed text-texto-suave">
        Reemplaza la llama donde aparece. Sube archivos SVG que usen{" "}
        <code className="rounded bg-superficie px-1 py-0.5 text-xs">currentColor</code>{" "}
        para que sigan cambiando de tono con el tema claro y oscuro.
      </p>

      {/* Dos por fila: cuatro tarjetas apiladas obligaban a mucho scroll
          para algo que se quiere ver de un vistazo. */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {RANURAS_MARCA.map((clave) => (
          <div
            key={clave}
            className="rounded-xl border border-borde bg-superficie p-5"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-sm font-medium">{ETIQUETAS_RANURA[clave]}</p>
                <p className="mt-0.5 text-xs text-texto-suave">{AYUDA[clave]}</p>
              </div>
              {/* Vista previa: lo que hay guardado ahora mismo. */}
              {marca[clave] ? (
                <span
                  aria-hidden="true"
                  // La altura fija da el tamaño de muestra; el SVG interior
                  // se estira a ella.
                  className="inline-flex h-12 shrink-0 text-rojo-acento [&>svg]:h-full [&>svg]:w-auto"
                  dangerouslySetInnerHTML={{ __html: marca[clave]! }}
                />
              ) : (
                <Llama className="h-12 w-auto shrink-0 text-rojo-acento" />
              )}
            </div>

            <div className="mt-4">
              <Subir clave={clave} />
            </div>

            {marca[clave] && (
              <div className="mt-3">
                <Restablecer clave={clave} />
              </div>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}
