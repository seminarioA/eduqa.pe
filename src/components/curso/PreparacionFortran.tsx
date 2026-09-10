"use client";

import { useEffect, useSyncExternalStore } from 'react';
import { Check, Loader2 } from 'lucide-react';
import { estadoFortran, mantenerFortranPreparado, prepararFortran, suscribirseFortran } from '@/lib/fortran-web';

export function PreparacionFortran() {
  const estado = useSyncExternalStore(suscribirseFortran, estadoFortran, () => 'sin-empezar' as const);
  useEffect(mantenerFortranPreparado, []);

  return <div role="status" aria-live="polite" data-preparacion-fortran={estado} className="mt-4 flex flex-wrap items-center gap-2 text-xs text-texto-suave">
    {estado === 'error' ? <>
      <span>No pudimos preparar Fortran.</span>
      <button type="button" onClick={() => void prepararFortran()} className="font-medium text-rojo-acento underline">Reintentar</button>
    </> : estado === 'listo' ? <>
      <Check size={14} aria-hidden="true" className="text-exito" />Fortran listo para ejecutar
    </> : <>
      <Loader2 size={14} aria-hidden="true" className="animate-spin" />Preparando Fortran… Puedes seguir leyendo.
    </>}
  </div>;
}
