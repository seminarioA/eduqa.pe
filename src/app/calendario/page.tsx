import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { CalendarDays } from "lucide-react";
import { usuarioActual } from "@/lib/supabase/servidor";
import { perfilActual } from "@/lib/matriculas";
import { misReuniones } from "@/lib/reuniones";
import { cerrarSesion } from "@/app/acceder/acciones";
import { CabeceraApp } from "@/components/CabeceraApp";
import { Migas } from "@/components/Migas";
import { Calendario } from "./Calendario";

export const metadata: Metadata = {
  title: "Calendario — EDUQA.PE",
  robots: { index: false, follow: false },
};

export default async function Page() {
  const usuario = await usuarioActual();
  if (!usuario) redirect("/acceder?volverA=/calendario");

  const [perfil, reuniones] = await Promise.all([perfilActual(), misReuniones()]);

  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-14 lg:pl-64 xl:pl-32 2xl:pl-6">
      <CabeceraApp
        nombre={perfil?.nombre?.trim().split(" ")[0] ?? ""}
        correo={usuario.email}
        foto={perfil?.foto}
        onSalir={cerrarSesion}
      />

      <div className="mt-8">
        <Migas items={[{ texto: "Calendario" }]} />
      </div>

      <h1 className="flex items-center gap-2 text-3xl font-semibold tracking-tight">
        <CalendarDays size={26} className="text-rojo-acento" aria-hidden="true" />
        Calendario
      </h1>
      <p className="mt-2 text-sm leading-relaxed text-texto-suave">
        Las clases en vivo de las ediciones en las que estás matriculado. Las horas
        son de Perú.
      </p>

      <Calendario
        reuniones={reuniones.map((r) => ({
          id: r.id,
          titulo: r.titulo,
          iniciaEn: r.iniciaEn,
          minutos: r.minutos,
          enlace: r.enlace,
          cursoNombre: r.cursoNombre,
          docente: r.docente,
          cancelada: r.cancelada,
        }))}
      />
    </div>
  );
}
