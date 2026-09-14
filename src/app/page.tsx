import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  Check,
  ChevronDown,
  Clock,
  Mail,
  Radio,
  UserPlus,
} from "lucide-react";
import {
  comoFunciona,
  faq,
  instructor,
  marca,
  promesas,
  plazaLibre,
} from "@/lib/catalogo";
import { obtenerCursos } from "@/lib/catalogo-cursos";
import { LIMITE_PLAN_GRATIS } from "@/lib/matriculas";
import { precios } from "@/lib/precios";
import { usuarioActual } from "@/lib/supabase/servidor";
import { Icono, IconoRed, Stack } from "@/components/Iconos";
import { Llama } from "@/components/Llama";
import { SelectorTema } from "@/components/Tema";
import { Boton, Seccion } from "@/components/ui";

export default async function Page() {
  // La portada cambia según haya sesión: a quien ya entró no se le ofrece
  // crear cuenta como llamada principal.
  const [usuario, tarifas] = await Promise.all([usuarioActual(), precios()]);

  // Solo los cursos que la base deja ver. Sin sesión, RLS deja pasar los
  // públicos; los borradores y privados no llegan hasta acá.
  const abiertos = (await obtenerCursos()).filter((c) => tarifas.has(c.slug));

  return (
    <>
      <main className="flex-1">
        {/* Hero */}
        <header className="bg-rojo px-6 py-14 text-white sm:py-20">
          <div className="mx-auto w-full max-w-5xl">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2.5">
                <Llama className="h-7 w-auto text-white" />
                <span className="text-sm font-bold uppercase tracking-[0.22em]">
                  {marca.nombre}
                </span>
              </div>
              <SelectorTema />
            </div>

            <div className="mt-10 grid items-center gap-12 sm:grid-cols-[1fr_auto]">
              <div>
                <h1 className="text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl">
                  {marca.lema}
                </h1>

                <p className="mt-5 max-w-xl text-lg leading-relaxed text-sobre-rojo-suave">
                  {marca.gancho}
                </p>

                <div className="mt-9 flex flex-wrap items-center gap-3">
                  {usuario ? (
                    <Link href="/cursos">
                      <Boton variante="sobreRojo">
                        Ir a mis cursos
                        <ArrowRight size={16} aria-hidden="true" />
                      </Boton>
                    </Link>
                  ) : (
                    <>
                      <Link href="/registro">
                        <Boton variante="sobreRojo">
                          Crear cuenta gratis
                          <ArrowRight size={16} aria-hidden="true" />
                        </Boton>
                      </Link>
                      <Link
                        href="/acceder"
                        className="rounded-lg border border-white/45 px-5 py-3 text-sm font-semibold transition-colors hover:bg-white/10"
                      >
                        Ya tengo cuenta
                      </Link>
                    </>
                  )}
                </div>

                <p className="mt-5 max-w-md text-sm leading-relaxed text-sobre-rojo-suave">
                  {LIMITE_PLAN_GRATIS} cursos gratis a la vez, con todo su material. Los
                  demás, {marca.moneda}
                  {marca.precio} cada uno.
                </p>
              </div>

              <Llama className="hidden h-72 w-auto text-white sm:block lg:h-96" />
            </div>
          </div>
        </header>

        {/* Cursos con material publicado */}
        {abiertos.length > 0 && (
          <Seccion titulo="Abiertos ahora" ancho="amplio">
            <p className="-mt-4 mb-8 max-w-2xl leading-relaxed text-texto-suave">
              Estos ya tienen material publicado: la teoría y todo el código de las
              sesiones, con las citas a la documentación oficial de cada herramienta.
            </p>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {abiertos.map((c) => {
                const t = tarifas.get(c.slug);
                return (
                  <Link
                    key={c.slug}
                    href={
                      usuario
                        ? "/cursos"
                        : t?.acceso_libre
                          ? // Se lee sin cuenta: no tiene sentido mandarlo antes
                            // a registrarse.
                            `/cursos/${c.slug}/${c.lecciones[0].slug}`
                          : "/registro"
                    }
                    className="group flex flex-col rounded-xl border border-borde bg-fondo p-5 transition-all hover:-translate-y-0.5 hover:border-rojo-acento hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rojo-acento"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <Icono
                          nombre={c.icono}
                          className="size-9 shrink-0 text-texto-tenue transition-colors group-hover:text-rojo-acento"
                        />
                      <span className="flex shrink-0 flex-col items-end gap-1">
                        <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-emerald-700 ring-1 ring-inset ring-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:ring-emerald-900">
                          {c.nivel}
                        </span>
                        {t?.acceso_libre && (
                          <span className="rounded-full bg-rojo-tenue px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-rojo-acento ring-1 ring-inset ring-rojo-acento/25">
                            Sin cuenta
                          </span>
                        )}
                      </span>
                    </div>

                    <h3 className="mt-4 text-base font-semibold leading-snug group-hover:text-rojo-acento">
                      {t?.titulo ?? c.titulo}
                    </h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-texto-suave">
                      {t?.resumen ?? c.resumen}
                    </p>

                    <div className="mt-4 flex items-center justify-between border-t border-borde pt-2.5 text-xs text-texto-tenue">
                      <span className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <BookOpen size={13} aria-hidden="true" />
                          {c.lecciones.length} sesiones
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={13} aria-hidden="true" />
                          {c.horas} h
                        </span>
                      </span>
                      <ArrowRight
                        size={14}
                        aria-hidden="true"
                        className="opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
                      />
                    </div>
                  </Link>
                );
              })}
            </div>
          </Seccion>
        )}

        {/* Cómo se accede */}
        <Seccion titulo="Cómo se accede">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-borde p-5">
              <p className="text-sm font-semibold">Cuenta gratuita</p>
              <p className="mt-1 text-2xl font-semibold">{marca.moneda}0</p>
              <ul className="mt-4 space-y-2 text-sm text-texto-suave">
                {[
                  `Hasta ${LIMITE_PLAN_GRATIS} cursos matriculados a la vez`,
                  "Todo el material de esos cursos",
                  "Constancia de participación al terminar",
                ].map((x) => (
                  <li key={x} className="flex gap-2">
                    <Check
                      size={16}
                      className="mt-0.5 shrink-0 text-rojo-acento"
                      aria-hidden="true"
                    />
                    {x}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl border-2 border-rojo-acento p-5">
              <p className="text-sm font-semibold text-rojo-acento">Un curso más</p>
              <p className="mt-1 flex items-center gap-2 text-2xl font-semibold">
                <span>
                  {marca.moneda}
                  {marca.precio}
                </span>
                <span className="text-sm font-normal text-texto-tenue">por curso</span>
              </p>
              <ul className="mt-4 space-y-2 text-sm text-texto-suave">
                {[
                  `Cuando ya ocupaste los ${LIMITE_PLAN_GRATIS} gratuitos`,
                  "Se paga escaneando un QR desde el celular",
                  "Sin tarjeta ni suscripción que se renueva sola",
                ].map((x) => (
                  <li key={x} className="flex gap-2">
                    <Check
                      size={16}
                      className="mt-0.5 shrink-0 text-rojo-acento"
                      aria-hidden="true"
                    />
                    {x}
                  </li>
                ))}
              </ul>

              <div className="mt-5 flex items-center gap-4 border-t border-borde pt-4">
                <Image
                  src="/yape.png"
                  alt="Yape"
                  width={28}
                  height={28}
                  className="size-7 rounded"
                />
                <Image
                  src="/plin.png"
                  alt="Plin"
                  width={28}
                  height={28}
                  className="size-7 rounded"
                />
                <span className="text-xs text-texto-tenue">Yape o Plin</span>
              </div>
            </div>
          </div>
        </Seccion>

        {/* Promesas */}
        <Seccion titulo="Qué nos hace distintos">
          <div className="grid gap-x-10 gap-y-8 sm:grid-cols-2">
            {promesas.map((p) => (
              <div key={p.titulo}>
                <h3 className="flex items-start gap-2 font-medium">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-rojo" />
                  {p.titulo}
                </h3>
                <p className="mt-2 pl-3.5 text-sm leading-relaxed text-texto-suave">
                  {p.texto}
                </p>
              </div>
            ))}
          </div>
        </Seccion>

        {/* Certificados */}
        <Seccion titulo="La constancia lleva código">
          <div className="flex flex-col gap-4 rounded-xl border border-borde bg-superficie p-6 sm:flex-row sm:items-start">
            <BadgeCheck size={34} className="shrink-0 text-rojo-acento" aria-hidden="true" />
            <div>
              <p className="leading-relaxed text-texto-suave">
                Quien asiste a un dictado en vivo recibe una constancia de participación
                con su nombre completo, las horas cursadas, la fecha y un código único
                de emisión. Es una constancia, no un título universitario, y no se
                vende como tal.
              </p>
            </div>
          </div>
        </Seccion>

        {/* Stack */}
        <Seccion titulo="Las herramientas de las clases" ancho="amplio">
          <p className="-mt-4 mb-9 leading-relaxed text-texto-suave">
            Lo que vas a tocar en las sesiones. Nada de pseudocódigo ni entornos de
            juguete.
          </p>
          <Stack />
        </Seccion>

        {/* Cómo funciona */}
        <Seccion titulo="Cómo funciona">
          <dl className="grid gap-x-10 gap-y-7 sm:grid-cols-2">
            {comoFunciona.map((c) => (
              <div key={c.titulo}>
                <dt className="font-medium">{c.titulo}</dt>
                <dd className="mt-1.5 text-sm leading-relaxed text-texto-suave">
                  {c.texto}
                </dd>
              </div>
            ))}
          </dl>
        </Seccion>

        {/* Instructor */}
        <Seccion titulo="Quién enseña" ancho="amplio">
          <div className="grid items-stretch gap-5 sm:grid-cols-2">
            <article className="flex flex-col rounded-xl border border-borde bg-superficie p-6">
              <h3 className="text-lg font-medium">{instructor.nombre}</h3>
              <p className="mt-0.5 text-sm font-medium text-rojo-acento">{instructor.titulo}</p>
              <div className="mt-4 flex-1 space-y-3">
                {instructor.bio.map((p) => (
                  <p key={p} className="text-sm leading-relaxed text-texto-suave">
                    {p}
                  </p>
                ))}
              </div>
              <div className="mt-6 flex flex-wrap gap-2">
                {instructor.redes.map((r) => (
                  <a
                    key={r.red}
                    href={r.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg border border-borde-fuerte bg-fondo px-3 py-1.5 text-sm font-medium text-texto-suave transition-colors hover:border-rojo-acento hover:text-rojo-acento"
                  >
                    <IconoRed nombre={r.red} className="size-4" />
                    {r.etiqueta}
                  </a>
                ))}
              </div>
            </article>

            {/* Plaza libre: se lee como un hueco por llenar, no como un aviso de empleo. */}
            <article className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-borde-fuerte bg-superficie p-6 text-center">
              <div
                aria-hidden="true"
                className="flex size-14 items-center justify-center rounded-full border-2 border-dashed border-borde-fuerte"
              >
                <UserPlus size={22} className="text-texto-tenue" />
              </div>

              {/* Esqueleto: insinúa la ficha que todavía no existe. */}
              <div aria-hidden="true" className="mt-5 w-full max-w-[13rem] space-y-2">
                <div className="mx-auto h-3 w-3/4 rounded bg-borde" />
                <div className="mx-auto h-2.5 w-1/2 rounded bg-borde" />
                <div className="mt-4 space-y-1.5">
                  <div className="h-2 w-full rounded bg-borde" />
                  <div className="h-2 w-11/12 rounded bg-borde" />
                  <div className="h-2 w-4/6 rounded bg-borde" />
                </div>
              </div>

              <h3 className="mt-7 font-medium text-texto">{plazaLibre.titulo}</h3>
              <p className="mt-1.5 max-w-xs text-sm leading-relaxed text-texto-suave">
                {plazaLibre.texto}
              </p>

              <a
                href={`mailto:${plazaLibre.correo}?subject=Quiero dictar en EDUQA.PE`}
                className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-rojo-acento underline-offset-4 hover:underline"
              >
                <Mail size={16} aria-hidden="true" />
                {plazaLibre.correo}
              </a>
            </article>
          </div>
        </Seccion>

        {/* FAQ */}
        <Seccion titulo="Preguntas">
          <div className="divide-y divide-borde border-y border-borde">
            {faq.map((f) => (
              <details key={f.p} className="group py-4">
                <summary className="flex cursor-pointer list-none items-start gap-2.5 font-medium marker:content-none">
                  <ChevronDown
                    size={18}
                    className="mt-0.5 shrink-0 text-texto-tenue transition-transform group-open:rotate-180 group-open:text-rojo-acento"
                    aria-hidden="true"
                  />
                  {f.p}
                </summary>
                <p className="mt-2.5 pl-7 leading-relaxed text-texto-suave">{f.r}</p>
              </details>
            ))}
          </div>
        </Seccion>

        {/* Cierre */}
        <Seccion>
          <div className="rounded-2xl bg-rojo px-6 py-12 text-center text-white sm:px-10">
            <Llama className="mx-auto mb-6 h-20 w-auto text-white" />
            <h2 className="mx-auto max-w-lg text-2xl font-semibold leading-tight tracking-tight">
              {usuario
                ? "Sigue donde lo dejaste"
                : `Empieza con ${LIMITE_PLAN_GRATIS} cursos gratis`}
            </h2>
            <p className="mx-auto mt-3 max-w-md leading-relaxed text-sobre-rojo-suave">
              {usuario
                ? "Tus cursos y tu material te están esperando."
                : "Crear la cuenta toma un minuto y no pide tarjeta. Te matriculas y el material se abre al instante."}
            </p>
            <Link href={usuario ? "/cursos" : "/registro"} className="mt-7 inline-block">
              <Boton variante="sobreRojo">
                {usuario ? "Ir a mis cursos" : "Crear cuenta gratis"}
                <ArrowRight size={16} aria-hidden="true" />
              </Boton>
            </Link>
          </div>
        </Seccion>
      </main>

      <footer className="border-t border-borde px-6 py-8">
        <div className="mx-auto flex w-full max-w-3xl flex-wrap items-center justify-between gap-4 text-sm text-texto-tenue">
          <span className="flex items-center gap-2">
            <Llama className="h-5 w-auto text-rojo-acento" />
            {marca.nombre}
          </span>
          <span className="flex items-center gap-4">
            <Link href="/acceder" className="transition-colors hover:text-rojo-acento">
              Acceder
            </Link>
            {/* Distintivo oficial. Va sobre blanco a propósito: su único
                color es un azul oscuro que en el tema oscuro desaparecería. */}
            <Link
              href="/reclamaciones"
              aria-label="Libro de Reclamaciones"
              className="rounded-md bg-white px-2 py-1.5 ring-1 ring-borde transition-opacity hover:opacity-80"
            >
              <img
                src="/libro-de-reclamaciones.svg"
                alt="Libro de Reclamaciones"
                width={64}
                height={44}
                className="h-9 w-auto"
              />
            </Link>
            <span className="flex items-center gap-1.5">
              <Radio size={14} aria-hidden="true" />
              {marca.ciudad}
            </span>
          </span>
        </div>
      </footer>
    </>
  );
}
