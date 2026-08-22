import type { Metadata } from "next";
import { NotebookPen } from "lucide-react";
import { marca } from "@/lib/catalogo";
import { FormularioReclamacion } from "./Formulario";

export const metadata: Metadata = {
  title: `Libro de reclamaciones — ${marca.nombre}`,
  description: "Presenta un reclamo o una queja sobre los cursos de EDUQA.PE.",
};

export default function Page() {
  return (
    <div className="mx-auto w-full max-w-2xl px-6 py-14">
      <h1 className="flex items-center gap-3 text-3xl font-semibold tracking-tight">
        <NotebookPen size={28} className="text-rojo-acento" aria-hidden="true" />
        Libro de reclamaciones
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-texto-suave">
        Aquí se registra cualquier reclamo o queja sobre los cursos. No hace
        falta tener cuenta. Al enviarlo recibirás un número de hoja y una copia
        en el correo que indiques.
      </p>

      <div className="mt-8">
        <FormularioReclamacion />
      </div>
    </div>
  );
}
