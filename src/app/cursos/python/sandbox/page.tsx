import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FlaskConical } from "lucide-react";
import { buscarCurso } from "@/lib/catalogo-cursos";
import { autorizarAccesoCurso } from "@/lib/acceso-curso";
import { codigoDeCurso } from "@/lib/precios";
import {
  BarraLateral,
  type HerramientaCurso,
} from "@/components/curso/BarraLateral";
import { CargandoCurso } from "@/components/curso/CargandoCurso";
import { SandboxPython } from "@/components/curso/SandboxPython";
import { Migas } from "@/components/Migas";
import { SelectorTema } from "@/components/Tema";

export const metadata: Metadata = {
  title: "Sandbox de Python — Introducción a Python",
  description: "Escribe y ejecuta Python en el navegador con WebAssembly.",
};

export default async function SandboxPythonPage() {
  const curso = await buscarCurso("python");
  if (!curso) notFound();

  const [{ usuario }, codigo] = await Promise.all([
    autorizarAccesoCurso("python", "/cursos/python/sandbox"),
    codigoDeCurso("python"),
  ]);
  const herramientas: HerramientaCurso[] = [
    {
      href: "/cursos/python/sandbox",
      etiqueta: "Sandbox de Python",
      tipo: "sandbox",
      activa: true,
    },
    {
      href: "/cursos/python/quiz",
      etiqueta: "Quiz de Python",
      tipo: "quiz",
    },
  ];

  return (
    <div className="flex min-h-dvh">
      <CargandoCurso />
      <BarraLateral
        curso={curso}
        codigo={codigo}
        inicio={usuario ? "/cursos" : "/"}
        herramientas={herramientas}
      />

      <main className="min-w-0 flex-1">
        <article className="mx-auto w-full max-w-5xl px-6 py-12 lg:px-10">
          <Migas
            items={[
              { texto: "Cursos", href: usuario ? "/cursos" : "/" },
              {
                texto: curso.titulo,
                href: `/cursos/${curso.slug}/${curso.lecciones[0].slug}`,
              },
              { texto: "Sandbox de Python" },
            ]}
          />

          <header className="border-b border-borde pb-6">
            <div className="flex items-start justify-between gap-4">
              <p className="flex items-center gap-2 font-mono text-sm text-rojo-acento">
                <FlaskConical size={17} aria-hidden="true" />
                Práctica libre
              </p>
              <SelectorTema />
            </div>
            <h1 className="mt-2 text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
              Sandbox de Python
            </h1>
            <p className="mt-3 max-w-2xl leading-relaxed text-texto-suave">
              Escribe un programa completo y ejecútalo con Python real dentro de
              esta pestaña. Puedes conservar el borrador o descargarlo como archivo.
            </p>
          </header>

          <div className="mt-8">
            <SandboxPython />
          </div>
        </article>
      </main>
    </div>
  );
}
