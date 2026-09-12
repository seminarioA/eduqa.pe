import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { Infinity as Infinito, UserRound } from "lucide-react";
import { obtenerCursos } from "@/lib/catalogo-cursos";
import { valoraciones } from "@/lib/valoraciones";
import { rutas } from "@/lib/rutas";
import { popularidad, ordenarPorPopularidad, ordenarRutasPorPopularidad } from "@/lib/popularidad";
import { misMatriculas, perfilActual, resumenPlan } from "@/lib/matriculas";
import { precios } from "@/lib/precios";
import { contarPorCurso, miProgreso } from "@/lib/progreso";
import { avisosVisibles } from "@/lib/avisos";
import { Tablero } from "@/components/Tablero";
import { usuarioActual } from "@/lib/supabase/servidor";
import { cerrarSesion } from "@/app/acceder/acciones";
import { Llama } from "@/components/Llama";
import { MenuPerfil } from "@/components/MenuPerfil";
import { Migas } from "@/components/Migas";
import { Listado } from "./Listado";
import { AvisoTope } from "./AvisoTope";

export const metadata: Metadata = {
  title: "Cursos — EDUQA.PE",
  robots: { index: false, follow: false },
};

export default async function Page() {
  // Se repite la comprobación de proxy.ts: es la que autoriza de verdad.
  const usuario = await usuarioActual();
  if (!usuario) redirect("/acceder?volverA=/cursos");

  const [perfil, matriculas, tarifas, progreso, avisos] = await Promise.all([
    perfilActual(),
    misMatriculas(),
    precios(),
    miProgreso(),
    avisosVisibles(),
  ]);
  const vistasPorCurso = contarPorCurso(progreso);
  const plan = resumenPlan(perfil, matriculas);

  // El nombre sale del perfil. Si aún no lo puso, se pide en /perfil:
  // hace falta el nombre real para emitir certificados.
  const nombre =
    perfil?.nombre?.trim().split(" ")[0] ?? usuario.email?.split("@")[0] ?? "";

  const porCurso = new Map(matriculas.map((m) => [m.curso_slug, m]));
  const notas = await valoraciones();
  const itinerarios = await rutas();
  const catalogo = await obtenerCursos();
  const cuentas = await popularidad();
  const disponibles = catalogo.filter((c) => tarifas.has(c.slug));
  const cursosPorSlug = new Map(disponibles.map((c) => [c.slug, c]));
  const rutasVisibles = itinerarios.map((r) => ({
    slug: r.slug,
    nombre: r.nombre,
    descripcion: r.descripcion,
    cursos: r.cursos.flatMap((c) => {
      const curso = cursosPorSlug.get(c.slug);
      if (!curso) return [];
      return [
        {
          slug: c.slug,
          titulo: c.titulo,
          requisitos: c.requisitos,
          acceso_libre: c.acceso_libre,
          horas: curso.horas,
          icono: curso.icono,
        },
      ];
    }),
  }));

  return (
    <div className="mx-auto w-full max-w-5xl px-6 lg:pl-64 xl:pl-32 2xl:pl-6 py-14">
      <Listado
        populares={ordenarPorPopularidad(disponibles, cuentas).map((c) => ({
          slug: c.slug,
          titulo: tarifas.get(c.slug)?.titulo ?? c.titulo,
          resumen: tarifas.get(c.slug)?.resumen ?? c.resumen,
          primeraLeccion: c.lecciones[0].slug,
          matriculas: cuentas.get(c.slug) ?? 0,
          icono: c.icono,
        }))}
        cabecera={
          <>
            <Link href="/cursos" className="flex shrink-0 items-center gap-2.5">
              <Llama className="h-9 w-auto shrink-0 text-rojo-acento" />
              <span className="text-sm font-bold uppercase tracking-[0.18em] text-rojo-acento">
                EDUQA.PE
              </span>
            </Link>
            <Tablero avisos={avisos} />
          </>
        }
        acciones={
          <MenuPerfil
            nombre={perfil?.nombre}
            correo={usuario.email}
            foto={perfil?.foto}
            onSalir={cerrarSesion}
          />
        }
        entreBarraYRejilla={
          <>
            <div className="mt-8">
              <Migas items={[{ texto: "Cursos" }]} />
            </div>

            {!perfil?.nombre?.trim() && (
              <Link
                href="/ajustes"
                className="mt-2 flex items-center gap-2 rounded-lg border border-borde bg-superficie px-4 py-3 text-sm text-texto-suave transition-colors hover:border-rojo-acento"
              >
                <UserRound size={15} className="shrink-0 text-rojo-acento" aria-hidden="true" />
                Falta tu nombre completo. Se necesita para emitir tu certificado.
                <span className="ml-auto font-medium text-rojo-acento">Completar</span>
              </Link>
            )}

            <div className="mt-2 flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                Cursos
              </h1>
              {nombre && (
                <span className="text-sm text-texto-suave">
                  Bienvenido, <span className="font-medium text-texto">{nombre}</span>
                </span>
              )}
              <span className="inline-flex items-center gap-1.5 rounded-full border border-borde bg-superficie px-3 py-1 text-xs font-medium text-texto-suave">
                {plan.ilimitado ? (
                  <>
                    <Infinito size={13} className="text-rojo-acento" aria-hidden="true" />
                    Cursos sin límite
                  </>
                ) : (
                  `${plan.activas} de ${plan.limite} cursos gratis en uso`
                )}
              </span>
            </div>

            {plan.alTope && (
              <AvisoTope limite={plan.limite} esAdmin={perfil?.es_admin ?? false} />
            )}
          </>
        }

        rutas={ordenarRutasPorPopularidad(rutasVisibles, cuentas)}
        alTope={plan.alTope}
        esAdmin={perfil?.es_admin ?? false}
        cursos={disponibles.map((c) => {
          const m = porCurso.get(c.slug);
          const t = tarifas.get(c.slug);
          return {
            slug: c.slug,
            titulo: t?.titulo ?? c.titulo,
            resumen: t?.resumen ?? c.resumen,
            area: c.area,
            nivel: c.nivel,
            horas: c.horas,
            sesiones: c.lecciones.length,
            primeraLeccion: c.lecciones[0].slug,
            valoracion: notas.get(c.slug),
            icono: c.icono,
            matriculado: m?.estado === "activa" || m?.estado === "completada",
            completado: m?.estado === "completada",
            precio: t?.precio ?? 0,
            inscritoEn: m?.creada_en ? new Date(m.creada_en).getTime() : null,
            vistas: vistasPorCurso.get(c.slug) ?? 0,
          };
        })}
      />
    </div>
  );
}
