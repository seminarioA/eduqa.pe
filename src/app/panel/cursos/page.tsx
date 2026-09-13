import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { BookOpen, GraduationCap, Sparkles } from "lucide-react";
import { usuarioEsAdmin } from "@/lib/supabase/servidor";
import { obtenerCursos } from "@/lib/catalogo-cursos";
import { precios } from "@/lib/precios";
import { TarjetaGestion } from "@/app/panel/TarjetaGestion";
import { Migas } from "@/components/Migas";

export const metadata: Metadata = {
  title: "Gestión de Cursos & Precios — Panel EDUQA.PE",
  robots: { index: false, follow: false },
};

export default async function PanelCursosPage() {
  const esAdmin = await usuarioEsAdmin();
  if (!esAdmin) redirect("/cursos");

  const [catalogo, tarifas] = await Promise.all([obtenerCursos(), precios()]);

  const cursosConEstado = catalogo.map((c) => {
    const tarifa = tarifas.get(c.slug);
    return {
      slug: c.slug,
      titulo: tarifa?.titulo ?? c.titulo,
      resumen: tarifa?.resumen ?? c.resumen,
      area: c.area,
      nivel: c.nivel,
      horas: c.horas,
      formato: c.formato,
      sesiones: c.lecciones.length,
      icono: c.icono,
      publicado: tarifas.has(c.slug),
      precio: tarifa?.precio ?? 0,
    };
  });

  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-14 lg:pl-64 xl:pl-32 2xl:pl-6">
      <Migas
        items={[
          { texto: "Panel", href: "/panel" },
          { texto: "Gestión de Cursos" },
        ]}
      />

      <header className="mt-6 border-b border-borde pb-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-rojo-acento">
              <GraduationCap size={14} />
              Catálogo & Precios
            </div>
            <h1 className="mt-1 text-3xl font-bold tracking-tight text-texto">
              Gestión de Cursos y Microcursos
            </h1>
            <p className="mt-1 text-sm text-texto-suave">
              Publica, despublica o ajusta el precio de los cursos escritos en Markdown en `src/content/`.
            </p>
          </div>
        </div>
      </header>

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {cursosConEstado.map((curso) => (
          <TarjetaGestion key={curso.slug} curso={curso} />
        ))}
      </div>
    </div>
  );
}
