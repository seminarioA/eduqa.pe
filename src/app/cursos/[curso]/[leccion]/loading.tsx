import { BookOpen } from "lucide-react";

export default function CargandoLeccion() {
  return (
    <div className="flex min-h-dvh bg-fondo" role="status" aria-live="polite" aria-label="Cargando curso">
      <aside className="hidden w-64 shrink-0 border-r border-borde bg-superficie p-6 lg:block" aria-hidden="true">
        <div className="h-7 w-36 animate-pulse rounded bg-borde" />
        <div className="mt-12 space-y-4">
          <div className="h-5 w-44 animate-pulse rounded bg-borde" />
          <div className="h-5 w-36 animate-pulse rounded bg-borde" />
          <div className="h-5 w-40 animate-pulse rounded bg-borde" />
        </div>
      </aside>
      <main className="mx-auto w-full max-w-3xl px-6 py-12 lg:px-10">
        <div className="flex items-center gap-3 text-sm font-medium text-texto-suave">
          <BookOpen size={20} className="animate-pulse text-rojo-acento" aria-hidden="true" />
          Cargando curso…
        </div>
        <div className="mt-14 h-10 w-3/4 animate-pulse rounded bg-borde" aria-hidden="true" />
        <div className="mt-14 space-y-5" aria-hidden="true">
          <div className="h-5 w-full animate-pulse rounded bg-borde" />
          <div className="h-5 w-11/12 animate-pulse rounded bg-borde" />
          <div className="h-5 w-2/3 animate-pulse rounded bg-borde" />
        </div>
      </main>
    </div>
  );
}
