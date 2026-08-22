import { readFileSync } from "node:fs";
import { join } from "node:path";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { BookOpenCheck } from "lucide-react";
import { usuarioActual } from "@/lib/supabase/servidor";
import { perfilActual } from "@/lib/matriculas";
import { esInterno } from "@/lib/roles";
import { cerrarSesion } from "@/app/acceder/acciones";
import { CabeceraApp } from "@/components/CabeceraApp";
import { Migas } from "@/components/Migas";
import { Documento } from "@/components/Documento";

export const metadata: Metadata = {
  title: "Cómo se escribe un curso — EDUQA.PE",
  robots: { index: false, follow: false },
};

export default async function Page() {
  const usuario = await usuarioActual();
  if (!usuario) redirect("/acceder?volverA=/recursos/redaccion");

  const perfil = await perfilActual();
  if (!esInterno(perfil)) redirect("/cursos");

  // Se sirve el archivo del repositorio en lugar de una copia: dos versiones
  // del mismo documento acaban divergiendo, y la que se lee aquí sería la
  // desactualizada.
  const lineamientos = readFileSync(join(process.cwd(), "LINEAMIENTOS.md"), "utf8");
  const formato = readFileSync(
    join(process.cwd(), "src", "content", "FORMATO-CURSO.md"),
    "utf8",
  );

  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-14 lg:pl-64 xl:pl-32 2xl:pl-6">
      <CabeceraApp
        nombre={perfil?.nombre?.trim().split(" ")[0] ?? ""}
        correo={usuario.email}
        foto={perfil?.foto}
        onSalir={cerrarSesion}
      />

      <div className="mt-8">
        <Migas items={[{ texto: "Recursos", href: "/recursos" }, { texto: "Redacción" }]} />
      </div>

      <h1 className="flex items-center gap-2 text-3xl font-semibold tracking-tight">
        <BookOpenCheck size={26} className="text-rojo-acento" aria-hidden="true" />
        Cómo se escribe un curso
      </h1>

      <div className="mt-10">
        <Documento markdown={lineamientos} />
      </div>

      <div className="mt-16">
        <Documento markdown={formato} />
      </div>
    </div>
  );
}
