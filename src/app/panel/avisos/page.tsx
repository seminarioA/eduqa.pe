import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { Eye, Megaphone, Pin } from "lucide-react";
import { usuarioActual } from "@/lib/supabase/servidor";
import { perfilActual } from "@/lib/matriculas";
import { avisosVisibles } from "@/lib/avisos";
import { Migas } from "@/components/Migas";
import { Tablero } from "@/components/Tablero";
import { Formulario } from "./Formulario";
import { Borrar } from "./Borrar";

export const metadata: Metadata = {
  title: "Avisos — EDUQA.PE",
  robots: { index: false, follow: false },
};

export default async function Page() {
  const usuario = await usuarioActual();
  if (!usuario) redirect("/acceder?volverA=/panel/avisos");

  // Publicar es gestión: no basta con tener sesión.
  const perfil = await perfilActual();
  if (!perfil?.es_admin) redirect("/cursos");

  const avisos = await avisosVisibles();

  /*
   * Lo que verá un alumno.
   *
   * A administración la política de lectura le muestra todo, borradores
   * incluidos, así que la vista previa tiene que volver a filtrar: enseñar
   * aquí un aviso sin publicar daría una idea falsa de cómo está el tablero.
   */
  const hoy = new Date().toISOString().slice(0, 10);
  const comoSeVe = avisos.filter(
    (a) => a.publicado && (a.vigente_hasta === null || a.vigente_hasta >= hoy),
  );

  return (
    <main className="mx-auto w-full max-w-3xl px-6 lg:pl-64 xl:pl-32 2xl:pl-6 py-12">
      <Migas items={[{ texto: "Panel", href: "/panel" }, { texto: "Avisos" }]} />

      <h1 className="mt-4 flex items-center gap-2 text-3xl font-semibold tracking-tight">
        <Megaphone size={26} className="text-rojo-acento" aria-hidden="true" />
        Avisos
      </h1>

      <p className="mt-3 max-w-2xl leading-relaxed text-texto-suave">
        Lo que publiques aquí lo ve todo el que entre, en el tablero de la
        cabecera. Va en una sola dirección: nadie responde.
      </p>

      {/* Vista previa del botón que aparece en la cabecera de /cursos. */}
      <section className="mt-8 rounded-xl border border-borde bg-superficie p-5">
        <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-texto-tenue">
          <Eye size={13} aria-hidden="true" />
          Así se ve en Cursos
        </p>

        <div className="mt-4 flex items-center rounded-lg bg-fondo px-4 py-4">
          <Tablero avisos={comoSeVe} />
        </div>

        <p className="mt-3 text-xs leading-relaxed text-texto-tenue">
          {comoSeVe.length === 0
            ? "Ahora mismo el tablero está vacío para los alumnos."
            : `${comoSeVe.length} ${comoSeVe.length === 1 ? "aviso visible" : "avisos visibles"} de ${avisos.length} en total. Los borradores y los caducados no salen.`}
        </p>
      </section>

      <div className="mt-8">
        <Formulario />
      </div>

      <h2 className="mt-12 text-sm font-semibold uppercase tracking-wide text-texto-tenue">
        En el tablero
      </h2>

      {avisos.length === 0 ? (
        <p className="mt-4 rounded-xl border border-borde bg-superficie px-5 py-8 text-center text-sm text-texto-suave">
          Todavía no hay ninguno.
        </p>
      ) : (
        <ul className="mt-4 divide-y divide-borde rounded-xl border border-borde">
          {avisos.map((a) => (
            <li key={a.id} className="px-5 py-4">
              <div className="flex items-start justify-between gap-3">
                <p className="flex items-start gap-1.5 font-medium">
                  {a.fijado && (
                    <Pin
                      size={14}
                      className="mt-1 shrink-0 text-rojo-acento"
                      aria-label="Fijado"
                    />
                  )}
                  {a.titulo}
                </p>
                <span className="flex shrink-0 items-center gap-2">
                  {!a.publicado && (
                    <span className="rounded-full bg-superficie px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-texto-tenue ring-1 ring-inset ring-borde-fuerte">
                      Borrador
                    </span>
                  )}
                  <Borrar id={a.id} />
                </span>
              </div>

              <p className="mt-1.5 whitespace-pre-wrap text-sm leading-relaxed text-texto-suave">
                {a.cuerpo}
              </p>

              <p className="mt-2 text-xs text-texto-tenue">
                {new Date(a.creado_en).toLocaleDateString("es-PE", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
                {a.vigente_hasta &&
                  ` · vigente hasta el ${new Date(
                    `${a.vigente_hasta}T00:00:00`,
                  ).toLocaleDateString("es-PE", { day: "numeric", month: "long" })}`}
              </p>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
