import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { usuarioActual } from "@/lib/supabase/servidor";
import { perfilActual } from "@/lib/matriculas";
import { rutas } from "@/lib/rutas";
import { obtenerCursos } from "@/lib/catalogo-cursos";
import { Migas } from "@/components/Migas";
import { PanelFormacionNav } from "@/components/PanelFormacionNav";
import { GestionRutasForm } from "./FormularioRuta";

export const metadata: Metadata = {
  title: "Gestión de Rutas — EDUQA.PE",
  robots: { index: false, follow: false },
};

export default async function PanelRutasPage() {
  const usuario = await usuarioActual();
  if (!usuario) redirect("/acceder?volverA=/panel/rutas");

  const perfil = await perfilActual();
  if (!perfil?.es_admin) redirect("/cursos");

  const [itinerarios, catalogoCursos] = await Promise.all([
    rutas(),
    obtenerCursos(),
  ]);

  const cursosFormateados = catalogoCursos.map((c) => ({
    slug: c.slug,
    titulo: c.titulo,
  }));

  const rutasFormateadas = itinerarios.map((r, idx) => ({
    slug: r.slug,
    nombre: r.nombre,
    descripcion: r.descripcion,
    orden: idx + 1,
    cursos: r.cursos.map((c) => ({
      slug: c.slug,
      titulo: c.titulo,
      posicion: c.posicion,
      requisitos: c.requisitos,
    })),
  }));

  return (
    <main className="mx-auto w-full max-w-4xl px-6 py-10 lg:pl-64 xl:pl-32 2xl:pl-6">
      <Migas
        items={[
          { texto: "Panel", href: "/panel" },
          { texto: "Gestión académica", href: "/panel/cursos" },
          { texto: "Rutas de aprendizaje" },
        ]}
      />

      <div className="mt-4">
        <h1 className="text-2xl font-bold tracking-tight text-texto">
          Gestión de Rutas de Aprendizaje
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-texto-suave">
          Organiza los cursos en secuencias pedagógicas lógicas, define el orden de avance y establece los prerrequisitos necesarios para que los alumnos sigan una especialización técnica completa.
        </p>
      </div>

      <PanelFormacionNav activo="rutas" />

      <div className="mt-8">
        <GestionRutasForm rutas={rutasFormateadas} cursos={cursosFormateados} />
      </div>
    </main>
  );
}
