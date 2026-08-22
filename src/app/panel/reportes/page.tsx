import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { Bug, Paperclip } from "lucide-react";
import { clienteServidor, usuarioActual } from "@/lib/supabase/servidor";
import { perfilActual } from "@/lib/matriculas";
import { Llama } from "@/components/Llama";
import { Migas } from "@/components/Migas";
import { CambiarEstado } from "./CambiarEstado";

export const metadata: Metadata = {
  title: "Reportes — EDUQA.PE",
  robots: { index: false, follow: false },
};

type Reporte = {
  id: string;
  titulo: string;
  descripcion: string;
  ruta: string | null;
  navegador: string | null;
  estado: string;
  adjuntos: string[];
  creado_en: string;
  origen: string;
};

const ETIQUETA: Record<string, string> = {
  abierto: "Abierto",
  en_curso: "En curso",
  resuelto: "Resuelto",
  descartado: "Descartado",
};

const COLOR: Record<string, string> = {
  abierto:
    "bg-rojo-tenue text-rojo-acento ring-rojo-acento/25",
  en_curso:
    "bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:ring-amber-900",
  resuelto:
    "bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:ring-emerald-900",
  descartado: "bg-superficie text-texto-tenue ring-borde-fuerte",
};

export default async function Page() {
  const usuario = await usuarioActual();
  if (!usuario) redirect("/acceder?volverA=/panel/reportes");

  // Esta página es de gestión: no basta con tener sesión.
  const perfil = await perfilActual();
  if (!perfil?.es_admin) redirect("/cursos");

  const supabase = await clienteServidor();
  const { data } = await supabase
    .from("reportes")
    .select("id, titulo, descripcion, ruta, navegador, estado, adjuntos, creado_en, origen")
    .order("creado_en", { ascending: false });

  const reportes = (data ?? []) as Reporte[];
  const abiertos = reportes.filter((r) => r.estado === "abierto").length;

  return (
    <main className="mx-auto w-full max-w-4xl px-6 lg:pl-64 xl:pl-32 2xl:pl-6 py-12">
      <div className="flex items-center justify-between gap-4">
        <Link href="/panel" className="flex items-center gap-3">
          <Llama className="h-10 w-auto text-rojo-acento" />
          <span className="text-base font-bold uppercase tracking-[0.2em] text-rojo-acento">
            EDUQA.PE
          </span>
        </Link>
      </div>

      <div className="mt-8">
        <Migas items={[{ texto: "Panel", href: "/panel" }, { texto: "Reportes" }]} />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <h1 className="flex items-center gap-2 text-3xl font-semibold tracking-tight">
          <Bug size={26} className="text-rojo-acento" aria-hidden="true" />
          Reportes
        </h1>
        {abiertos > 0 && (
          <span className="rounded-full border border-borde bg-superficie px-3 py-1 text-xs font-medium text-texto-suave">
            {abiertos} sin atender
          </span>
        )}
      </div>

      <p className="mt-3 max-w-2xl leading-relaxed text-texto-suave">
        Lo que llega por el botón flotante se recoge aquí, venga de un alumno o
        de administración, y queda para consultarlo en otra sesión.
      </p>

      {reportes.length === 0 ? (
        <p className="mt-4 rounded-xl border border-borde bg-superficie px-5 py-8 text-center text-sm text-texto-suave">
          Todavía no hay ninguno.
        </p>
      ) : (
        <ul className="mt-4 space-y-3">
          {reportes.map((r) => (
            <li key={r.id} className="rounded-xl border border-borde bg-superficie p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <h3 className="font-medium">{r.titulo}</h3>
                <span className="flex shrink-0 items-center gap-2">
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ring-1 ring-inset ${
                    r.origen === "alumno"
                      ? "bg-fondo text-rojo-acento ring-rojo-acento/25"
                      : "bg-fondo text-texto-tenue ring-borde"
                  }`}
                >
                  {r.origen === "alumno" ? "Alumno" : "Interno"}
                </span>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ring-1 ring-inset ${
                    COLOR[r.estado] ?? COLOR.descartado
                  }`}
                >
                  {ETIQUETA[r.estado] ?? r.estado}
                </span>
                </span>
              </div>

              <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-texto-suave">
                {r.descripcion}
              </p>

              <dl className="mt-3 space-y-0.5 text-xs text-texto-tenue">
                <div className="flex gap-2">
                  <dt className="shrink-0">Fecha</dt>
                  <dd>
                    {new Date(r.creado_en).toLocaleString("es-PE", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </dd>
                </div>
                {r.ruta && (
                  <div className="flex gap-2">
                    <dt className="shrink-0">Ruta</dt>
                    <dd className="truncate font-mono">{r.ruta}</dd>
                  </div>
                )}
                {r.navegador && (
                  <div className="flex gap-2">
                    <dt className="shrink-0">Navegador</dt>
                    <dd className="truncate">{r.navegador}</dd>
                  </div>
                )}
                {r.adjuntos.length > 0 && (
                  <div className="flex gap-2">
                    <dt className="shrink-0">Adjuntos</dt>
                    <dd className="flex flex-wrap gap-x-3">
                      {r.adjuntos.map((a) => (
                        <span key={a} className="flex items-center gap-1 font-mono">
                          <Paperclip size={11} aria-hidden="true" />
                          {a.split("/").pop()}
                        </span>
                      ))}
                    </dd>
                  </div>
                )}
              </dl>

              <div className="mt-4">
                <CambiarEstado id={r.id} estado={r.estado} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
