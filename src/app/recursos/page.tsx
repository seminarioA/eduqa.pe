import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { Library } from "lucide-react";
import { usuarioActual } from "@/lib/supabase/servidor";
import { perfilActual } from "@/lib/matriculas";
import { esInterno, NOMBRE_ROL } from "@/lib/roles";
import { cerrarSesion } from "@/app/acceder/acciones";
import { CabeceraApp } from "@/components/CabeceraApp";
import { Migas } from "@/components/Migas";
import { listarRecursos } from "@/lib/recursos";
import { BuscadorRecursos } from "./BuscadorRecursos";

export const metadata: Metadata = {
  title: "Recursos — EDUQA.PE",
  robots: { index: false, follow: false },
};

export default async function Page() {
  const usuario = await usuarioActual();
  if (!usuario) redirect("/acceder?volverA=/recursos");

  const perfil = await perfilActual();
  // El acceso lo decide el rol, no el hecho de tener sesión: esta sección es
  // material de trabajo del equipo, no del alumnado.
  if (!esInterno(perfil)) redirect("/cursos");
  const recursos = await listarRecursos();

  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-14 lg:pl-64 xl:pl-32 2xl:pl-6">
      <CabeceraApp
        nombre={perfil?.nombre?.trim().split(" ")[0] ?? ""}
        correo={usuario.email}
        foto={perfil?.foto}
        onSalir={cerrarSesion}
      />

      <div className="mt-8">
        <Migas items={[{ texto: "Recursos" }]} />
      </div>

      <h1 className="flex items-center gap-2 text-3xl font-semibold tracking-tight">
        <Library size={26} className="text-rojo-acento" aria-hidden="true" />
        Recursos
      </h1>
      <p className="mt-2 text-sm leading-relaxed text-texto-suave">
        Documentación interna para quien produce o integra contenido. Entras con
        el rol de{" "}
        <span className="font-medium text-texto">
          {NOMBRE_ROL[perfil?.rol ?? "alumno"] ?? "Alumno"}
        </span>
        .
      </p>

      <BuscadorRecursos recursos={recursos} />
    </div>
  );
}
