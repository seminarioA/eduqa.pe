import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { Settings } from "lucide-react";
import { usuarioActual } from "@/lib/supabase/servidor";
import { perfilActual } from "@/lib/matriculas";
import { cerrarSesion } from "@/app/acceder/acciones";
import { CabeceraApp } from "@/components/CabeceraApp";
import { Migas } from "@/components/Migas";
import { SelectorTema } from "@/components/Tema";
import { Formulario } from "@/app/perfil/Formulario";
import { Foto } from "@/app/perfil/Foto";

export const metadata: Metadata = {
  title: "Ajustes — EDUQA.PE",
  robots: { index: false, follow: false },
};

export default async function Page() {
  const usuario = await usuarioActual();
  if (!usuario) redirect("/acceder?volverA=/ajustes");

  const perfil = await perfilActual();
  const nombre = perfil?.nombre?.trim().split(" ")[0] ?? "";

  const alta = usuario.created_at
    ? new Date(usuario.created_at).toLocaleDateString("es-PE", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <div className="mx-auto w-full max-w-2xl px-6 lg:pl-64 xl:pl-32 2xl:pl-6 py-14">
      <CabeceraApp
        nombre={nombre}
        correo={usuario.email}
        foto={perfil?.foto}
        onSalir={cerrarSesion}
      />

      <div className="mt-8">
        <Migas items={[{ texto: "Ajustes" }]} />
      </div>

      <h1 className="flex items-center gap-2 text-3xl font-semibold tracking-tight">
        <Settings size={26} className="text-rojo-acento" aria-hidden="true" />
        Ajustes
      </h1>

      {/* Las tres secciones comparten forma: rótulo fuera y tarjeta dentro.
          Cada bloque con su propio botón va separado por una línea, para que
          se vea qué guarda cada uno; antes había dos «Guardar» seguidos sin
          nada que los distinguiera. */}
      <section className="mt-8">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-texto-tenue">
          Tus datos
        </h2>
        <div className="mt-4 divide-y divide-borde rounded-xl border border-borde">
          <div className="px-5 py-5">
            <Foto actual={perfil?.foto} nombre={perfil?.nombre} />
          </div>
          <div className="px-5 py-5">
            <Formulario
              nombre={perfil?.nombre ?? ""}
              telefono={perfil?.telefono ?? ""}
            />
          </div>
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-texto-tenue">
          Apariencia
        </h2>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-borde px-5 py-4">
          <div>
            <p className="text-sm font-medium">Tema</p>
            <p className="mt-0.5 text-sm text-texto-suave">
              Claro, oscuro o el que use tu sistema.
            </p>
          </div>
          <SelectorTema />
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-texto-tenue">
          Cuenta
        </h2>
        <dl className="mt-4 divide-y divide-borde rounded-xl border border-borde">
          <div className="flex flex-wrap items-center justify-between gap-2 px-5 py-3.5">
            <dt className="text-sm text-texto-suave">Correo</dt>
            <dd className="truncate text-sm font-medium">{usuario.email}</dd>
          </div>
          {alta && (
            <div className="flex flex-wrap items-center justify-between gap-2 px-5 py-3.5">
              <dt className="text-sm text-texto-suave">Cuenta creada</dt>
              <dd className="text-sm font-medium">{alta}</dd>
            </div>
          )}
          <div className="flex flex-wrap items-center justify-between gap-2 px-5 py-3.5">
            <dt className="text-sm text-texto-suave">Rol</dt>
            <dd className="text-sm font-medium">
              {perfil?.es_admin ? "Administrador" : "Alumno"}
            </dd>
          </div>
        </dl>
        <p className="mt-2 text-xs leading-relaxed text-texto-tenue">
          El correo no se puede cambiar desde aquí.
        </p>
      </section>
    </div>
  );
}
