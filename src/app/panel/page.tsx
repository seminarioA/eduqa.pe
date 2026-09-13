import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { BookOpen, Bug, Megaphone } from "lucide-react";
import { usuarioActual } from "@/lib/supabase/servidor";
import { Migas } from "@/components/Migas";
import { obtenerCursos } from "@/lib/catalogo-cursos";
import { misMatriculas, perfilActual } from "@/lib/matriculas";
import { precios } from "@/lib/precios";
import { TarjetaGestion } from "./TarjetaGestion";

export const metadata: Metadata = {
  title: "Panel — EDUQA.PE",
  robots: { index: false, follow: false },
};

export default async function Page() {
  // proxy.ts ya filtró, pero se vuelve a comprobar aquí: esa comprobación
  // es la que autoriza de verdad. proxy corre también sobre rutas precargadas
  // y no debe ser la única barrera.
  const usuario = await usuarioActual();
  if (!usuario) redirect("/acceder?volverA=/panel");

  const [perfil, tarifas, matriculas] = await Promise.all([
    perfilActual(),
    precios(),
    misMatriculas(),
  ]);

  const alta = usuario.created_at
    ? new Date(usuario.created_at).toLocaleDateString("es-PE", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  const cursos = await obtenerCursos();
  const misCursos = cursos.filter((c) =>
    matriculas.some((m) => m.curso_slug === c.slug),
  );

  return (
    <main className="mx-auto w-full max-w-5xl px-6 lg:pl-64 xl:pl-32 2xl:pl-6 py-12">
      <Migas items={[{ texto: "Panel" }]} />

      <h1 className="mt-4 text-3xl font-semibold tracking-tight">Panel</h1>

      <section className="mt-8 rounded-xl border border-borde bg-superficie p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-texto-tenue">
          Sesión activa
        </h2>

        <dl className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-xs uppercase tracking-wide text-texto-tenue">Nombre</dt>
            <dd className="mt-0.5 font-medium">
              {perfil?.nombre ?? (
                <Link href="/ajustes" className="text-rojo-acento hover:underline">
                  Completar
                </Link>
              )}
            </dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-texto-tenue">Correo</dt>
            <dd className="mt-0.5 truncate font-medium">{usuario.email}</dd>
          </div>
          {alta && (
            <div>
              <dt className="text-xs uppercase tracking-wide text-texto-tenue">
                Cuenta creada
              </dt>
              <dd className="mt-0.5 text-sm text-texto-suave">{alta}</dd>
            </div>
          )}
          <div>
            <dt className="text-xs uppercase tracking-wide text-texto-tenue">Rol</dt>
            <dd className="mt-0.5 text-sm text-texto-suave">
              {perfil?.es_admin ? "Administrador" : "Alumno"}
            </dd>
          </div>
        </dl>

        <Link
          href="/ajustes"
          className="mt-5 inline-block text-sm font-medium text-rojo-acento hover:underline"
        >
          Editar perfil
        </Link>
      </section>

      {/* Mis cursos: lo que ve cualquier usuario */}
      <section className="mt-10">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-texto-tenue">
          Mis cursos
        </h2>
        {misCursos.length === 0 ? (
          <p className="mt-3 text-sm text-texto-suave">
            Todavía no estás matriculado en ninguno.{" "}
            <Link href="/cursos" className="font-medium text-rojo-acento hover:underline">
              Ver el catálogo
            </Link>
          </p>
        ) : (
          <ul className="mt-4 divide-y divide-borde rounded-xl border border-borde">
            {misCursos.map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/cursos/${c.slug}/${c.lecciones[0].slug}`}
                  className="flex items-center justify-between gap-4 px-5 py-3.5 transition-colors hover:bg-superficie"
                >
                  <span className="text-sm font-medium">{c.titulo}</span>
                  <span className="flex items-center gap-1.5 text-xs text-texto-tenue">
                    <BookOpen size={13} aria-hidden="true" />
                    {c.lecciones.length} sesiones
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      {perfil?.es_admin && (
        <Link
          href="/panel/avisos"
          className="mt-10 flex items-center gap-2 rounded-xl border border-borde bg-superficie px-5 py-4 text-sm transition-colors hover:border-rojo-acento"
        >
          <Megaphone size={16} className="shrink-0 text-rojo-acento" aria-hidden="true" />
          <span className="font-medium">Tablero de avisos</span>
          <span className="text-texto-suave">
            Lo que todo alumno debe leer al entrar.
          </span>
          <span className="ml-auto font-medium text-rojo-acento">Abrir</span>
        </Link>
      )}

      {perfil?.es_admin && (
        <Link
          href="/panel/cursos"
          className="mt-4 flex items-center gap-2 rounded-xl border border-borde bg-superficie px-5 py-4 text-sm transition-colors hover:border-rojo-acento"
        >
          <BookOpen size={16} className="shrink-0 text-rojo-acento" aria-hidden="true" />
          <span className="font-medium">Cursos</span>
          <span className="text-texto-suave">
            Publica o corrige un curso sin desplegar.
          </span>
          <span className="ml-auto font-medium text-rojo-acento">Abrir</span>
        </Link>
      )}

      {perfil?.es_admin && (
        <Link
          href="/panel/reportes"
          className="mt-4 flex items-center gap-2 rounded-xl border border-borde bg-superficie px-5 py-4 text-sm transition-colors hover:border-rojo-acento"
        >
          <Bug size={16} className="shrink-0 text-rojo-acento" aria-hidden="true" />
          <span className="font-medium">Reportes de error</span>
          <span className="text-texto-suave">
            Anota lo que falla para arreglarlo después.
          </span>
          <span className="ml-auto font-medium text-rojo-acento">Abrir</span>
        </Link>
      )}

      {/* Gestión: solo administradores */}
      {perfil?.es_admin && (
        <section className="mt-12">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-texto-tenue">
            Gestión de cursos
          </h2>
          <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-texto-suave">
            Borrador queda oculto para todos menos gestión. Privado no aparece en el
            catálogo, pero entra quien tenga el enlace o a quien matricules a mano.
            Público aparece en el catálogo.
          </p>

          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {cursos.map((c) => {
              const t = tarifas.get(c.slug);
              return (
                <TarjetaGestion
                  key={c.slug}
                  curso={{
                    slug: c.slug,
                    titulo: t?.titulo ?? c.titulo,
                    resumen: t?.resumen ?? c.resumen,
                    estado: t?.estado ?? "publico",
                    precio: t?.precio ?? 0,
                    accesoLibre: t?.acceso_libre ?? false,
                    sesiones: c.lecciones.length,
                    horas: c.horas,
                    primeraLeccion: c.lecciones[0].slug,
                    icono: c.icono,
                  }}
                />
              );
            })}
          </div>
        </section>
      )}
    </main>
  );
}
