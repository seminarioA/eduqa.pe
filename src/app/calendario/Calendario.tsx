"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Clock, User, Video } from "lucide-react";

export type ReunionVista = {
  id: string;
  titulo: string;
  iniciaEn: string;
  minutos: number;
  enlace: string | null;
  cursoNombre: string;
  docente: string;
  cancelada: boolean;
};

const ZONA = "America/Lima";
const DIAS = ["L", "M", "M", "J", "V", "S", "D"];

/** Día en Perú al que pertenece un instante, como AAAA-MM-DD. */
function diaEnLima(iso: string) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: ZONA,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(iso));
}

const hora = (iso: string) =>
  new Intl.DateTimeFormat("es-PE", {
    timeZone: ZONA,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(iso));

/** Mayúscula solo en la primera letra: «lunes, 7 de setiembre» no es un título. */
const capitalizar = (t: string) => t.charAt(0).toUpperCase() + t.slice(1);

const fechaLarga = (iso: string) =>
  new Intl.DateTimeFormat("es-PE", {
    timeZone: ZONA,
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(new Date(iso));

/**
 * Calendario de clases en vivo.
 *
 * Todo se formatea en la hora de Perú y no en la del navegador: una clase
 * puesta a las 19:00 tiene que decir 19:00 aunque quien mire esté en otro
 * huso, porque esa es la hora a la que se dicta.
 */
export function Calendario({ reuniones }: { reuniones: ReunionVista[] }) {
  const hoy = new Date();
  const primera = reuniones.find((r) => new Date(r.iniciaEn) >= hoy) ?? reuniones[0];
  const arranque = primera ? new Date(primera.iniciaEn) : hoy;

  const [mes, setMes] = useState(() => new Date(arranque.getFullYear(), arranque.getMonth(), 1));
  const [diaElegido, setDiaElegido] = useState<string | null>(null);

  const porDia = useMemo(() => {
    const mapa = new Map<string, ReunionVista[]>();
    for (const r of reuniones) {
      const clave = diaEnLima(r.iniciaEn);
      mapa.set(clave, [...(mapa.get(clave) ?? []), r]);
    }
    return mapa;
  }, [reuniones]);

  const celdas = useMemo(() => {
    const primeroDelMes = new Date(mes.getFullYear(), mes.getMonth(), 1);
    // La semana empieza en lunes, que es como se lee un calendario en Perú.
    const hueco = (primeroDelMes.getDay() + 6) % 7;
    const dias = new Date(mes.getFullYear(), mes.getMonth() + 1, 0).getDate();
    return [
      ...Array.from({ length: hueco }, () => null),
      ...Array.from({ length: dias }, (_, i) => i + 1),
    ];
  }, [mes]);

  const claveDe = (dia: number) =>
    `${mes.getFullYear()}-${String(mes.getMonth() + 1).padStart(2, "0")}-${String(dia).padStart(2, "0")}`;

  const hoyClave = diaEnLima(new Date().toISOString());

  const proximas = reuniones
    .filter((r) => !r.cancelada && new Date(r.iniciaEn) >= new Date())
    .slice(0, 6);

  const mostradas = diaElegido ? (porDia.get(diaElegido) ?? []) : proximas;

  return (
    <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_20rem]">
      <section className="rounded-xl border border-borde bg-superficie p-5">
        <header className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-texto">
            {capitalizar(
              new Intl.DateTimeFormat("es-PE", { month: "long", year: "numeric" }).format(mes),
            )}
          </h2>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setMes(new Date(mes.getFullYear(), mes.getMonth() - 1, 1))}
              aria-label="Mes anterior"
              className="rounded-md p-1.5 text-texto-tenue transition-colors hover:bg-fondo hover:text-rojo-acento"
            >
              <ChevronLeft size={16} aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => setMes(new Date(mes.getFullYear(), mes.getMonth() + 1, 1))}
              aria-label="Mes siguiente"
              className="rounded-md p-1.5 text-texto-tenue transition-colors hover:bg-fondo hover:text-rojo-acento"
            >
              <ChevronRight size={16} aria-hidden="true" />
            </button>
          </div>
        </header>

        <div className="mt-4 grid grid-cols-7 gap-1 text-center text-[11px] text-texto-tenue">
          {DIAS.map((d, i) => (
            <span key={i}>{d}</span>
          ))}
        </div>

        <div className="mt-1 grid grid-cols-7 gap-1">
          {celdas.map((dia, i) => {
            if (dia === null) return <span key={`v${i}`} />;
            const clave = claveDe(dia);
            const tiene = porDia.has(clave);
            const esHoy = clave === hoyClave;
            const elegido = clave === diaElegido;

            return (
              <button
                key={clave}
                type="button"
                disabled={!tiene}
                onClick={() => setDiaElegido(elegido ? null : clave)}
                aria-label={`${dia}${tiene ? `, ${porDia.get(clave)!.length} reunión(es)` : ", sin reuniones"}`}
                aria-pressed={elegido}
                className={`aspect-square rounded-lg text-xs transition-colors ${
                  // El día con clase se pinta entero: un punto pequeño obliga a
                  // buscarlo, y el color macizo se ve de un vistazo.
                  tiene
                    ? "bg-rojo font-semibold text-sobre-rojo hover:bg-rojo-hover"
                    : "text-texto-tenue"
                } ${elegido ? "outline outline-2 outline-offset-2 outline-rojo-acento" : ""} ${
                  esHoy && !tiene ? "ring-1 ring-inset ring-rojo-acento" : ""
                }`}
              >
                {dia}
              </button>
            );
          })}
        </div>
      </section>

      <aside className="rounded-xl border border-borde bg-superficie p-5">
        <h2 className="text-sm font-semibold text-texto">
          {diaElegido ? "Ese día" : "Próximas reuniones"}
        </h2>
        {diaElegido && (
          <button
            type="button"
            onClick={() => setDiaElegido(null)}
            className="mt-1 text-xs text-rojo-acento hover:underline"
          >
            Ver las próximas
          </button>
        )}

        {mostradas.length === 0 ? (
          <p className="mt-3 text-xs leading-relaxed text-texto-suave">
            {reuniones.length === 0
              ? "Todavía no tienes clases en vivo programadas. Aparecerán aquí en cuanto te asignen una edición."
              : "No hay reuniones ese día."}
          </p>
        ) : (
          <ul className="mt-3 space-y-3">
            {mostradas.map((r) => (
              <li
                key={r.id}
                className="rounded-lg border border-borde bg-fondo p-3 text-xs"
              >
                <p className="font-medium text-texto">{capitalizar(fechaLarga(r.iniciaEn))}</p>
                <p className="mt-0.5 flex items-center gap-1 text-texto-suave">
                  <Clock size={11} aria-hidden="true" />
                  {hora(r.iniciaEn)} · {r.minutos} min
                </p>
                <p className="mt-1.5 font-medium text-texto">{r.titulo}</p>
                <p className="text-texto-tenue">{r.cursoNombre}</p>
                {r.docente && (
                  <p className="mt-0.5 flex items-center gap-1 text-texto-tenue">
                    <User size={11} aria-hidden="true" />
                    {r.docente}
                  </p>
                )}

                {r.cancelada ? (
                  <p className="mt-2 font-medium text-rojo-acento">Cancelada</p>
                ) : r.enlace ? (
                  <a
                    href={r.enlace}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 inline-flex items-center gap-1.5 rounded-md bg-rojo px-3 py-1.5 font-semibold text-white transition-colors hover:bg-rojo-hover"
                  >
                    <Video size={12} aria-hidden="true" />
                    Entrar
                  </a>
                ) : (
                  <p className="mt-2 text-texto-tenue">El enlace se publica antes de la clase.</p>
                )}
              </li>
            ))}
          </ul>
        )}
      </aside>
    </div>
  );
}
