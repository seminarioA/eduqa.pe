import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { ArrowLeft } from 'lucide-react';
import { rutas } from '@/lib/rutas';
import { obtenerCursos } from '@/lib/catalogo-cursos';
import { Icono } from '@/components/Iconos';
import { Migas } from '@/components/Migas';
import { PreparacionFortran } from '@/components/curso/PreparacionFortran';
import { SandboxFortran } from '@/components/curso/SandboxFortran';

export const metadata: Metadata = { title: 'Sandbox de Fortran — EDUQA.PE' };

export default async function Page({ params }: PageProps<'/rutas/[ruta]/sandbox'>) {
  const { ruta: slug } = await params;
  const ruta = (await rutas()).find(r => r.slug === slug);
  if (!ruta) notFound();
  const catalogo = await obtenerCursos();
  const cursos = ruta.cursos.filter(c => catalogo.some(d => d.slug === c.slug && d.icono === 'fortran'));
  if (!cursos.length) notFound();

  return <main className="w-full lg:pl-64"><div className="mx-auto w-full max-w-6xl px-6 py-12">
    <Migas items={[{ texto: 'Cursos', href: '/cursos' }, { texto: ruta.nombre, href: `/rutas/${ruta.slug}` }, { texto: 'Sandbox' }]} />
    <header className="mb-6">
      <div className="flex items-center gap-4">
        <Icono nombre="fortran" className="size-12 shrink-0 text-texto-suave" />
        <div><p className="text-xs font-medium text-texto-tenue">{ruta.nombre}</p><h1 className="mt-1 text-3xl font-semibold tracking-tight">Sandbox de Fortran</h1></div>
      </div>
      <p className="mt-4 max-w-2xl text-sm leading-relaxed text-texto-suave">Prueba tus ideas mientras avanzas por la ruta. Escribe un programa, prepara sus datos y pulsa Ejecutar. Cada intento comienza con memoria y archivos nuevos.</p>
      <PreparacionFortran />
    </header>
    <SandboxFortran key={ruta.slug} ruta={ruta.slug} />
    <footer className="mt-8 flex flex-wrap items-center gap-4 border-t border-borde pt-5 text-sm">
      <Link href={`/rutas/${ruta.slug}`} className="inline-flex items-center gap-2 font-medium text-rojo-acento hover:underline"><ArrowLeft size={15} aria-hidden="true" />Volver a la ruta</Link>
      <span className="text-texto-tenue">Cursos:</span>
      {cursos.map(c => <Link key={c.slug} href={`/cursos/${c.slug}/${catalogo.find(d => d.slug === c.slug)!.lecciones[0].slug}`} className="text-texto-suave hover:text-rojo-acento hover:underline">{c.titulo}</Link>)}
    </footer>
  </div></main>;
}
