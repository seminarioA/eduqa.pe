import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { Route, Sparkles, Plus } from "lucide-react";
import { usuarioEsAdmin } from "@/lib/supabase/servidor";
import { obtenerCursos } from "@/lib/catalogo-cursos";
import { listarTodasLasRutas } from "@/lib/rutas-bd";
import { FormularioRuta } from "./FormularioRuta";
import { Migas } from "@/components/Migas";

export const metadata: Metadata = {
  title: "Gestión de Rutas de Aprendizaje — Panel EDUQA.PE",
  robots: { index: false, follow: false },
};

export default async function PanelRutasPage() {
  const esAdmin = await usuarioEsAdmin();
  if (!esAdmin) redirect("/cursos");

  const [rutasBD, catalogo] = await Promise.all([
    listarTodasLasRutas(),
    obtenerCursos(),
  ]);

  const cursosDisponibles = catalogo.map((c) => ({
    slug: c.slug,
    titulo: c.titulo,
    area: c.area,
    horas: c.horas,
    formato: c.formato,
  }));

  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-14 lg:pl-64 xl:pl-32 2xl:pl-6">
      <Migas
        items={[
          { texto: "Panel", href: "/panel" },
          { texto: "Gestión de Rutas" },
        ]}
      />

      <header className="mt-6 border-b border-borde pb-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-rojo-acento">
              <Route size={14} />
              Itinerarios Formativos
            </div>
            <h1 className="mt-1 text-3xl font-bold tracking-tight text-texto">
              Gestión de Rutas de Aprendizaje
            </h1>
            <p className="mt-1 text-sm text-texto-suave">
              Crea secuencias educativas estructuradas, define el orden pedagógico y asigna prerrequisitos entre cursos.
            </p>
          </div>
        </div>
      </header>

      <section className="mt-8">
        <FormularioRuta
          rutasIniciales={rutasBD}
          cursosDisponibles={cursosDisponibles}
        />
      </section>
    </div>
  );
}
