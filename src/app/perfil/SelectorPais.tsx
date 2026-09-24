"use client";

/* eslint-disable @next/next/no-img-element */

import { useState } from "react";
import * as Select from "@radix-ui/react-select";
import { Check, ChevronDown, ChevronUp, Globe2 } from "lucide-react";
import { PAISES, paisPorCodigo, urlBandera } from "@/lib/paises";

function Bandera({ codigo }: { codigo: string }) {
  return (
    <img
      src={urlBandera(codigo)}
      alt=""
      width={24}
      height={18}
      loading="lazy"
      className="h-[15px] w-5 shrink-0 rounded-[2px] object-cover shadow-[0_0_0_1px_rgba(127,127,127,0.2)]"
      aria-hidden="true"
    />
  );
}

export function SelectorPais({ valorInicial }: { valorInicial?: string | null }) {
  const [valor, setValor] = useState(valorInicial ?? "");
  const seleccionado = paisPorCodigo(valor);

  return (
    <>
      <input type="hidden" name="pais" value={valor} />

      <Select.Root value={valor} onValueChange={setValor}>
        <Select.Trigger
          aria-label="País"
          className="flex w-full items-center justify-between gap-3 rounded-lg border border-borde-fuerte bg-fondo px-3 py-2.5 text-sm text-texto transition-colors hover:border-rojo-acento focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rojo-acento"
        >
          <span className="flex min-w-0 items-center gap-2.5">
            {seleccionado ? (
              <>
                <Bandera codigo={seleccionado.codigo} />
                <span className="truncate">{seleccionado.nombre}</span>
              </>
            ) : (
              <>
                <Globe2 size={17} className="shrink-0 text-texto-tenue" aria-hidden="true" />
                <span className="text-texto-tenue">Selecciona un país</span>
              </>
            )}
          </span>

          <Select.Icon>
            <ChevronDown size={15} className="shrink-0 text-texto-tenue" aria-hidden="true" />
          </Select.Icon>
        </Select.Trigger>

        <Select.Portal>
          <Select.Content
            position="popper"
            sideOffset={6}
            collisionPadding={12}
            className="z-50 max-h-[min(22rem,var(--radix-select-content-available-height))] min-w-[var(--radix-select-trigger-width)] overflow-hidden rounded-xl border border-borde bg-fondo shadow-xl"
          >
            <Select.ScrollUpButton className="flex h-8 cursor-default items-center justify-center bg-fondo text-texto-tenue">
              <ChevronUp size={15} aria-hidden="true" />
            </Select.ScrollUpButton>

            <Select.Viewport className="p-1">
              {PAISES.map((pais) => (
                <Select.Item
                  key={pais.codigo}
                  value={pais.codigo}
                  textValue={pais.nombre}
                  className="relative flex cursor-pointer select-none items-center gap-2.5 rounded-lg py-2 pl-3 pr-9 text-sm text-texto-suave outline-none data-[highlighted]:bg-superficie data-[highlighted]:text-texto data-[state=checked]:font-medium data-[state=checked]:text-rojo-acento"
                >
                  <Bandera codigo={pais.codigo} />
                  <Select.ItemText>{pais.nombre}</Select.ItemText>
                  <Select.ItemIndicator className="absolute right-3 inline-flex items-center">
                    <Check size={14} aria-hidden="true" />
                  </Select.ItemIndicator>
                </Select.Item>
              ))}
            </Select.Viewport>

            <Select.ScrollDownButton className="flex h-8 cursor-default items-center justify-center bg-fondo text-texto-tenue">
              <ChevronDown size={15} aria-hidden="true" />
            </Select.ScrollDownButton>
          </Select.Content>
        </Select.Portal>
      </Select.Root>
    </>
  );
}
