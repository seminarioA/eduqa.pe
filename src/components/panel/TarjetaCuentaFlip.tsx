"use client";

import { useState } from "react";
import Link from "next/link";
import {
  BadgeCheck,
  BookOpenCheck,
  CalendarDays,
  Mail,
  Phone,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Llama } from "@/components/Llama";

type TarjetaCuentaFlipProps = {
  nombre: string;
  rol: string;
  correo?: string | null;
  alta?: string | null;
  foto?: string | null;
  telefono?: string | null;
  plan?: "gratis" | "pago" | null;
  planHasta?: string | null;
  rolInterno?: string | null;
  cursosActivos: number;
  cursosCompletados: number;
};

export function TarjetaCuentaFlip({
  nombre,
  rol,
  correo,
  alta,
  foto,
  telefono,
  plan,
  planHasta,
  rolInterno,
  cursosActivos,
  cursosCompletados,
}: TarjetaCuentaFlipProps) {
  const [girada, setGirada] = useState(false);
  const inicial = nombre.charAt(0).toUpperCase();

  return (
    <div
      className="h-full min-h-[450px] cursor-pointer"
      style={{ perspective: "1400px" }}
      onMouseEnter={() => setGirada(true)}
      onMouseLeave={() => setGirada(false)}
      onClick={(evento) => {
        if ((evento.target as HTMLElement).closest("a")) return;
        setGirada((valor) => !valor);
      }}
      aria-label="Tarjeta de cuenta: pasa el cursor o haz clic para ver más información"
    >
      <div
        className="relative h-full min-h-[450px] w-full transition-transform duration-700 ease-in-out motion-reduce:transition-none"
        style={{
          transformStyle: "preserve-3d",
          transform: girada ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* Frente */}
        <article
          className="absolute inset-0 flex overflow-hidden rounded-2xl border border-rojo bg-rojo text-white"
          style={{ backfaceVisibility: "hidden" }}
        >
          <div className="flex h-full w-full flex-col p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white">
                  EDUQA.PE
                </p>
                <h2 className="mt-1 text-xs font-semibold uppercase tracking-wider text-white/75">
                  Datos de la cuenta
                </h2>
              </div>

              <Llama className="h-10 w-auto text-white" />
            </div>

            <div className="mt-6 flex flex-col items-center text-center">
              <div className="flex size-20 items-center justify-center overflow-hidden rounded-2xl border border-white/30 bg-white/10 text-3xl font-bold text-white shadow-sm">
                {foto ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={foto}
                    alt={`Foto de ${nombre}`}
                    className="size-full object-cover"
                  />
                ) : (
                  inicial
                )}
              </div>

              <h3 className="mt-4 max-w-full truncate text-lg font-bold text-white">
                {nombre}
              </h3>

              <span className="mt-1.5 inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-white/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
                <ShieldCheck size={12} className="text-white" />
                {rol}
              </span>
            </div>

            <dl className="mt-6 space-y-3 border-t border-white/20 pt-5">
              <div className="flex items-start gap-3">
                <Mail size={15} className="mt-0.5 shrink-0 text-white/70" />
                <div className="min-w-0">
                  <dt className="text-[10px] uppercase tracking-wide text-white/65">
                    Correo
                  </dt>
                  <dd className="mt-0.5 truncate text-xs font-medium text-white">
                    {correo || "No registrado"}
                  </dd>
                </div>
              </div>

              {alta && (
                <div className="flex items-start gap-3">
                  <CalendarDays
                    size={15}
                    className="mt-0.5 shrink-0 text-white/70"
                  />
                  <div>
                    <dt className="text-[10px] uppercase tracking-wide text-white/65">
                      Miembro desde
                    </dt>
                    <dd className="mt-0.5 text-xs font-medium text-white">
                      {alta}
                    </dd>
                  </div>
                </div>
              )}
            </dl>

            <div className="mt-auto pt-6">
              <Link
                href="/ajustes"
                className="inline-flex w-full items-center justify-center rounded-lg border border-white/25 bg-white/10 px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-white/20"
              >
                Editar perfil
              </Link>
            </div>
          </div>
        </article>

        {/* Reverso */}
        <article
          className="absolute inset-0 flex overflow-hidden rounded-2xl border border-rojo bg-rojo text-white"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <div className="flex h-full w-full flex-col p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white">
                  EDUQA.PE
                </p>
                <h2 className="mt-1 text-xs font-semibold uppercase tracking-wider text-white/75">
                  Más información
                </h2>
              </div>

              <Llama className="h-10 w-auto text-white" />
            </div>

            <div className="mt-6 grid gap-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-white/20 bg-white/10 p-3">
                  <div className="flex items-center gap-2 text-white/70">
                    <Sparkles size={14} />
                    <span className="text-[9px] font-semibold uppercase tracking-wide">
                      Plan
                    </span>
                  </div>
                  <p className="mt-2 text-sm font-bold capitalize text-white">
                    {plan || "gratis"}
                  </p>
                  <p className="mt-0.5 text-[10px] text-white/65">
                    {planHasta ? `Hasta ${planHasta}` : "Sin vencimiento registrado"}
                  </p>
                </div>

                <div className="rounded-xl border border-white/20 bg-white/10 p-3">
                  <div className="flex items-center gap-2 text-white/70">
                    <BadgeCheck size={14} />
                    <span className="text-[9px] font-semibold uppercase tracking-wide">
                      Rol
                    </span>
                  </div>
                  <p className="mt-2 truncate text-sm font-bold capitalize text-white">
                    {rolInterno || "alumno"}
                  </p>
                  <p className="mt-0.5 text-[10px] text-white/65">
                    Permisos de la cuenta
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-white/20 bg-white/10 p-3">
                <div className="flex items-center gap-2 text-white/70">
                  <Phone size={14} />
                  <span className="text-[9px] font-semibold uppercase tracking-wide">
                    Teléfono
                  </span>
                </div>
                <p className="mt-2 text-sm font-semibold text-white">
                  {telefono?.trim() || "No registrado"}
                </p>
              </div>

              <div className="rounded-xl border border-white/20 bg-white/10 p-3">
                <div className="flex items-center gap-2 text-white/70">
                  <BookOpenCheck size={14} />
                  <span className="text-[9px] font-semibold uppercase tracking-wide">
                    Actividad académica
                  </span>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-2xl font-bold leading-none text-white">
                      {cursosActivos}
                    </p>
                    <p className="mt-1 text-[10px] uppercase tracking-wide text-white/65">
                      Activos
                    </p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold leading-none text-white">
                      {cursosCompletados}
                    </p>
                    <p className="mt-1 text-[10px] uppercase tracking-wide text-white/65">
                      Completados
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-auto pt-6">
              <Link
                href="/ajustes"
                className="inline-flex w-full items-center justify-center rounded-lg border border-white/25 bg-white/10 px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-white/20"
              >
                Gestionar cuenta
              </Link>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}
