import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { BookOpen, Database, HardDrive, User } from "lucide-react";
import { usuarioActual, clienteServidor } from "@/lib/supabase/servidor";
import { perfilActual } from "@/lib/matriculas";
import { obtenerCursos } from "@/lib/catalogo-cursos";
import { Migas } from "@/components/Migas";
import { FormularioCurso } from "./Formulario";
import { CrearCurso } from "./Crear";

export const metadata: Metadata = {
  title: "Cursos — EDUQA.PE",
  robots: { index: false, follow: false },
};

export default async function Page() {
  const usuario = await usuarioActual();
  if (!usuario) redirect("/acceder?volverA=/panel/cursos");

  const perfil = await perfilActual();
  if (!perfil?.es_admin) redirect("/cursos");

  const supabase = await clienteServidor();
  const { data: enLaBase } = await supabase
    .from("curso_sesiones")
    .select("curso_slug, archivo");

  const sesionesPorCurso = new Map<string, number>();
  for (const s of enLaBase ?? []) {
    sesionesPorCurso.set(s.curso_slug, (sesionesPorCurso.get(s.curso_slug) ?? 0) + 1);
  }

  // Creadores: el nombre sale de `perfiles`, que es donde vive el del alumno.
  const { data: autorias } = await supabase
    .from("curso_creadores")
    .select("curso_slug, usuario_id, rol, orden")
    .order("orden");

  const { data: perfiles } = await supabase.from("perfiles").select("id, nombre");
  const nombrePorId = new Map((perfiles ?? []).map((p) => [p.id, p.nombre]));

  const creadoresPorCurso = new Map<string, string[]>();
  for (const a of autorias ?? []) {
    const lista = creadoresPorCurso.get(a.curso_slug) ?? [];
    lista.push(nombrePorId.get(a.usuario_id) || "sin nombre");
    creadoresPorCurso.set(a.curso_slug, lista);
  }

  const cursos = await obtenerCursos();

  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-10">
      <Migas
        items={[
          { texto: "Panel", href: "/panel" },
          { texto: "Cursos", href: "/panel/cursos" },
        ]}
      />

      <h1 className="mt-4 text-2xl font-bold text-texto">Cursos</h1>
      <p className="mt-2 text-sm leading-relaxed text-texto-suave">
        Un curso guardado aquí se sirve leyéndolo de la base, así que corregir
        una errata o añadir una sesión no obliga a desplegar la aplicación. Los
        que todavía viven en el repositorio siguen funcionando igual; para
        moverlos, basta con publicarlos aquí.
      </p>

      <section className="mt-8">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-texto-tenue">
          Crear, publicar o actualizar
        </h2>
        <div className="mt-3">
          <CrearCurso />
        </div>

        <div className="mt-5">
          <FormularioCurso />
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-texto-tenue">
          En el catálogo
        </h2>
        <ul className="mt-3 divide-y divide-borde rounded-xl border border-borde">
          {cursos.map((c) => {
            const enBase = sesionesPorCurso.has(c.slug);
            return (
              <li key={c.slug} className="flex items-center gap-3 px-4 py-3">
                <BookOpen size={15} className="shrink-0 text-texto-tenue" aria-hidden="true" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-texto">{c.titulo}</p>
                  <p className="font-mono text-[11px] text-texto-tenue">{c.slug}</p>
                </div>
                <span className="shrink-0 text-xs text-texto-suave">
                  {c.lecciones.length} sesiones
                </span>
                <span
                  className="flex shrink-0 items-center gap-1 text-[11px] text-texto-tenue"
                  title={
                    creadoresPorCurso.get(c.slug)?.join(", ") ??
                    "Sin creador registrado"
                  }
                >
                  <User size={12} aria-hidden="true" />
                  {creadoresPorCurso.get(c.slug)?.length
                    ? creadoresPorCurso.get(c.slug)!.length === 1
                      ? creadoresPorCurso.get(c.slug)![0]
                      : `${creadoresPorCurso.get(c.slug)!.length} creadores`
                    : "sin creador"}
                </span>
                <span
                  title={enBase ? "Se sirve desde la base" : "Vive en el repositorio"}
                  className="flex shrink-0 items-center gap-1 text-[11px] text-texto-tenue"
                >
                  {enBase ? (
                    <>
                      <Database size={12} aria-hidden="true" /> base
                    </>
                  ) : (
                    <>
                      <HardDrive size={12} aria-hidden="true" /> repo
                    </>
                  )}
                </span>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
