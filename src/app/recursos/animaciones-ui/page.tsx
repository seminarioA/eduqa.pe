import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { WandSparkles } from "lucide-react";
import { usuarioActual } from "@/lib/supabase/servidor";
import { perfilActual } from "@/lib/matriculas";
import { esInterno } from "@/lib/roles";
import { cerrarSesion } from "@/app/acceder/acciones";
import { CabeceraApp } from "@/components/CabeceraApp";
import { Migas } from "@/components/Migas";
import { GaleriaAnimaciones } from "./GaleriaAnimaciones";

export const metadata: Metadata = {
  title: "Animaciones UI — EDUQA.PE",
  robots: { index: false, follow: false },
};

export default async function Page() {
  const usuario = await usuarioActual();
  if (!usuario) redirect("/acceder?volverA=/recursos/animaciones-ui");

  const perfil = await perfilActual();
  if (!esInterno(perfil)) redirect("/cursos");

  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-14 lg:pl-64 xl:pl-32 2xl:pl-6">
      <CabeceraApp
        nombre={perfil?.nombre?.trim().split(" ")[0] ?? ""}
        correo={usuario.email}
        foto={perfil?.foto}
        onSalir={cerrarSesion}
      />

      <div className="mt-8">
        <Migas
          items={[
            { texto: "Recursos", href: "/recursos" },
            { texto: "Animaciones UI" },
          ]}
        />
      </div>

      <h1 className="flex items-center gap-2 text-3xl font-semibold tracking-tight">
        <WandSparkles size={26} className="text-rojo-acento" aria-hidden="true" />
        Animaciones UI
      </h1>
      <p className="mt-2 max-w-3xl text-sm leading-relaxed text-texto-suave">
        Catálogo visual de patrones de animación para la interfaz. Pasa el cursor
        sobre los ejemplos para ver el efecto y usa el icono de copiar para copiar
        su nombre exacto y pedir su implementación.
      </p>

      <GaleriaAnimaciones />
    </div>
  );
}
