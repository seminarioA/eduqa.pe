import { BotonActualizar } from "@/app/blog/BotonActualizar";

export function GestionMedium({ articulos }: { articulos: number }) {
  return (
    <section
      id="gestion-medium"
      aria-label="Gestión del blog"
      className="mt-8 flex flex-col gap-4 border-y border-borde py-5 sm:flex-row sm:items-center sm:justify-between"
    >
      <div>
        <h2 className="text-sm font-semibold text-texto">Publicación desde Medium</h2>
        <p className="mt-1 text-sm text-texto-suave">
          {articulos} artículos disponibles · Actualización automática cada hora
        </p>
      </div>
      <BotonActualizar />
    </section>
  );
}
