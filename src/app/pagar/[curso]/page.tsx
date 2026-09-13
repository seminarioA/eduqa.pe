import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import { usuarioActual } from "@/lib/supabase/servidor";
import { estaMatriculado } from "@/lib/matriculas";
import { precios } from "@/lib/precios";
import { buscarCurso } from "@/lib/catalogo-cursos";
import { Migas } from "@/components/Migas";
import { PagoQr } from "./PagoQr";

export const metadata: Metadata = {
  title: "Comprar curso — EDUQA.PE",
  robots: { index: false, follow: false },
};

export default async function Page({ params }: PageProps<"/pagar/[curso]">) {
  const { curso: slug } = await params;

  const usuario = await usuarioActual();
  if (!usuario) redirect(`/acceder?volverA=/pagar/${slug}`);

  const curso = await buscarCurso(slug);
  if (!curso) notFound();

  // Si ya está matriculado no tiene nada que pagar.
  if (await estaMatriculado(slug)) redirect(`/cursos/${slug}/${curso.lecciones[0].slug}`);

  const mapa = await precios();
  const precio = mapa.get(slug)?.precio ?? 0;

  return (
    <main className="mx-auto w-full max-w-2xl px-6 lg:pl-64 xl:pl-32 2xl:pl-6 py-12">
      <Migas items={[{ texto: "Cursos", href: "/cursos" }, { texto: curso.titulo, href: `/cursos/${slug}/${curso.lecciones[0].slug}` }, { texto: "Comprar" }]} />

      <h1 className="mt-4 text-2xl font-semibold tracking-tight">{curso.titulo}</h1>
      <p className="mt-2 leading-relaxed text-texto-suave">
        Ya tienes tus dos cursos gratis en uso. Este se compra aparte y no ocupa
        ninguno de esos dos espacios.
      </p>

      <div className="mt-8">
        <PagoQr curso={slug} precio={precio} />
      </div>

      <p className="mt-6 text-center text-xs leading-relaxed text-texto-tenue">
        No necesitas tarjeta ni suscripción. El pago se procesa de forma segura.
      </p>
    </main>
  );
}
