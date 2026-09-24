import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { ListChecks } from "lucide-react";
import { usuarioActual } from "@/lib/supabase/servidor";
import { perfilActual } from "@/lib/matriculas";
import { esInterno } from "@/lib/roles";
import { cerrarSesion } from "@/app/acceder/acciones";
import { CabeceraApp } from "@/components/CabeceraApp";
import { Migas } from "@/components/Migas";
import { ItemsRecurso } from "../ItemsRecurso";

export const metadata: Metadata = {
  title: "Tipos de preguntas — EDUQA.PE",
  robots: { index: false, follow: false },
};

export default async function Page({ searchParams }: { searchParams: Promise<{ estado?: string }> }) {
  const usuario = await usuarioActual();
  if (!usuario) redirect("/acceder?volverA=/recursos/tipos-de-preguntas");
  const perfil = await perfilActual();
  if (!esInterno(perfil)) redirect("/cursos");
  const { estado } = await searchParams;
  const mensajes: Record<string, string> = {
    guardado: "El ítem se guardó y quedó registrada una versión.",
    eliminado: "El ítem se eliminó y el historial conserva su última versión.",
    "datos-invalidos": "Revisa el título, el contenido y el orden.",
    error: "No se pudo completar la operación. Inténtalo de nuevo.",
  };

  return <div className="mx-auto w-full max-w-3xl px-6 py-14 lg:pl-64 xl:pl-32 2xl:pl-6">
    <CabeceraApp nombre={perfil?.nombre?.trim().split(" ")[0] ?? ""} correo={usuario.email} foto={perfil?.foto} onSalir={cerrarSesion} />
    <div className="mt-8"><Migas items={[{ texto: "Recursos", href: "/recursos" }, { texto: "Tipos de preguntas" }]} /></div>
    <h1 className="flex items-center gap-2 text-3xl font-semibold tracking-tight">
      <ListChecks size={26} className="text-rojo-acento" aria-hidden="true" />Tipos de preguntas
    </h1>
    <p className="mt-2 text-sm leading-relaxed text-texto-suave">Formatos de ítems de evaluación para elegir según lo que debe demostrar el estudiante.</p>
    {estado && mensajes[estado] && <p role="status" className="mt-5 rounded-xl border border-borde bg-superficie p-3 text-sm">{mensajes[estado]}</p>}
    <ItemsRecurso slug="tipos-de-preguntas" administrador={Boolean(perfil?.es_admin || perfil?.rol === "admin")} />
  </div>;
}
