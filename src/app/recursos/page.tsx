import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { BookOpenCheck, Library, Plug } from "lucide-react";
import { usuarioActual } from "@/lib/supabase/servidor";
import { perfilActual } from "@/lib/matriculas";
import { esInterno, NOMBRE_ROL } from "@/lib/roles";
import { cerrarSesion } from "@/app/acceder/acciones";
import { CabeceraApp } from "@/components/CabeceraApp";
import { Migas } from "@/components/Migas";

export const metadata: Metadata = {
  title: "Recursos — EDUQA.PE",
  robots: { index: false, follow: false },
};

const RECURSOS = [
  {
    href: "/recursos/redaccion",
    Icono: BookOpenCheck,
    titulo: "Cómo se escribe un curso",
    resumen:
      "El formato del contenido, el registro con el que se redacta y la verificación que exige antes de publicarse.",
    para: "Profesores, gestores y agentes",
  },
  {
    href: "/recursos/api",
    Icono: Plug,
    titulo: "API para publicar cursos",
    resumen:
      "Estructura del envío, formato de los archivos, autenticación por clave y respuestas de error.",
    para: "Desarrolladores y agentes de IA",
  },
];

export default async function Page() {
  const usuario = await usuarioActual();
  if (!usuario) redirect("/acceder?volverA=/recursos");

  const perfil = await perfilActual();
  // El acceso lo decide el rol, no el hecho de tener sesión: esta sección es
  // material de trabajo del equipo, no del alumnado.
  if (!esInterno(perfil)) redirect("/cursos");

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

      <ul className="mt-8 space-y-4">
        {RECURSOS.map(({ href, Icono, titulo, resumen, para }) => (
          <li key={href}>
            <Link
              href={href}
              className="group flex items-start gap-4 rounded-xl border border-borde bg-superficie p-5 transition-colors hover:border-rojo-acento"
            >
              <Icono
                size={22}
                className="mt-0.5 shrink-0 text-texto-tenue transition-colors group-hover:text-rojo-acento"
                aria-hidden="true"
              />
              <span className="min-w-0">
                <span className="block text-base font-semibold group-hover:text-rojo-acento">
                  {titulo}
                </span>
                <span className="mt-1 block text-sm leading-relaxed text-texto-suave">
                  {resumen}
                </span>
                <span className="mt-2 block text-[11px] uppercase tracking-wide text-texto-tenue">
                  {para}
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
