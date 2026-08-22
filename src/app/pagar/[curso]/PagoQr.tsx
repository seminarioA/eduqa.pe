"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  QrCode,
  RefreshCw,
} from "lucide-react";
import { estadoDePago, generarQrDePago, type EstadoPago } from "./acciones";
import { Boton } from "@/components/ui";

export function PagoQr({ curso, precio }: { curso: string; precio: number }) {
  const router = useRouter();
  const [estado, accion, generando] = useActionState<EstadoPago | null, FormData>(
    generarQrDePago,
    null,
  );
  const [pagado, setPagado] = useState(false);

  const qr = estado?.ok ? estado : null;

  // El pago lo confirma el callback de Niubiz; esto solo refresca la pantalla.
  useEffect(() => {
    if (!qr || pagado) return;
    const id = setInterval(async () => {
      const { pagado: ya } = await estadoDePago(qr.pagoId);
      if (ya) {
        setPagado(true);
        clearInterval(id);
        router.refresh();
      }
    }, 5000);
    return () => clearInterval(id);
  }, [qr, pagado, router]);

  if (pagado) {
    return (
      <div className="rounded-xl border border-borde bg-superficie p-8 text-center">
        <CheckCircle2 size={44} className="mx-auto text-exito" aria-hidden="true" />
        <p className="mt-4 text-lg font-semibold">Pago confirmado</p>
        <p className="mt-1.5 text-sm text-texto-suave">
          Ya estás matriculado. El curso quedó disponible.
        </p>
        <Boton onClick={() => router.push("/cursos")} className="mt-6">
          Ir a los cursos
        </Boton>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-borde bg-superficie p-8 text-center">
      {qr ? (
        <>
          <div className="mx-auto w-fit rounded-lg bg-white p-1.5">
            <Image
              src={qr.imagen}
              alt="Código QR para pagar"
              width={240}
              height={240}
              unoptimized
              className="size-60"
            />
          </div>
          <p className="mt-5 text-lg font-semibold">S/{qr.monto.toFixed(2)}</p>
          <p className="mx-auto mt-1.5 max-w-xs text-sm leading-relaxed text-texto-suave">
            Abre tu billetera, elige pagar con QR y escanea. En cuanto se
            confirme el pago te llevamos al curso, sin que tengas que hacer
            nada más. No cierres esta página.
          </p>
          <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-texto-tenue">
            <Loader2 size={12} className="animate-spin" aria-hidden="true" />
            Esperando tu pago
          </p>

          <Billeteras />
        </>
      ) : (
        <>
          <QrCode size={40} className="mx-auto text-texto-tenue" aria-hidden="true" />
          <p className="mt-4 text-sm leading-relaxed text-texto-suave">
            Paga desde tu celular escaneando un código. El curso se abre apenas
            se confirme el pago.
          </p>
          <p className="mt-2 text-2xl font-semibold">S/{precio.toFixed(2)}</p>
          <Billeteras />
        </>
      )}

      {estado && !estado.ok && (
        <p
          role="alert"
          className="mx-auto mt-4 flex max-w-sm items-start gap-2 rounded-lg border border-rojo-acento/30 bg-rojo-tenue px-3 py-2.5 text-left text-sm text-rojo-acento"
        >
          <AlertCircle size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
          {estado.error}
        </p>
      )}

      <form action={accion} className="mt-6">
        <input type="hidden" name="curso" value={curso} />
        <Boton
          type="submit"
          variante={qr ? "secundario" : "principal"}
          disabled={generando}
          className={qr ? "text-xs" : ""}
        >
          {generando && <Loader2 size={16} className="animate-spin" aria-hidden="true" />}
          {qr && !generando && <RefreshCw size={13} aria-hidden="true" />}
          {generando ? "Un momento…" : qr ? "Mostrar otro código" : "Comprar curso"}
        </Boton>
      </form>
    </div>
  );
}

/**
 * Con qué se puede pagar.
 *
 * Va en los dos estados de la pantalla: en el de antes, porque es donde se
 * decide comprar y hay que saber si uno tiene con qué; y en el del código,
 * porque es donde se paga. Los logotipos lo dicen sin texto, de modo que
 * ninguna de las dos pantallas necesita nombrarlos por escrito.
 *
 * Van en PNG porque ninguna de las dos marcas está en simple-icons ni en
 * react-icons, y redibujarlas a mano queda descartado: son marcas registradas.
 */
function Billeteras() {
  return (
    <div className="mt-5 flex items-center justify-center gap-4 border-t border-borde pt-4">
      <Image src="/yape.png" alt="Yape" width={34} height={34} className="size-8" />
      <Image src="/plin.png" alt="Plin" width={34} height={34} className="size-8" />
      <span className="text-xs text-texto-tenue">y otras billeteras</span>
    </div>
  );
}
