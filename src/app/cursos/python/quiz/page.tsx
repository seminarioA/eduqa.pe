import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ListChecks } from "lucide-react";
import { buscarCurso } from "@/lib/catalogo-cursos";
import { autorizarAccesoCurso } from "@/lib/acceso-curso";
import { codigoDeCurso } from "@/lib/precios";
import {
  BarraLateral,
  type HerramientaCurso,
} from "@/components/curso/BarraLateral";
import { QuizPython } from "@/components/curso/QuizPython";
import { Migas } from "@/components/Migas";
import { SelectorTema } from "@/components/Tema";

export const metadata: Metadata = {
  title: "Quiz de Python — Introducción a Python",
  description: "Comprueba los conceptos de las cuatro sesiones del curso.",
};

export default async function QuizPythonPage() {
  const curso = await buscarCurso("python");
  if (!curso) notFound();

  const [{ usuario }, codigo] = await Promise.all([
    autorizarAccesoCurso("python", "/cursos/python/quiz"),
    codigoDeCurso("python"),
  ]);
  const herramientas: HerramientaCurso[] = [
    {
      href: "/cursos/python/sandbox",
      etiqueta: "Sandbox de Python",
      tipo: "sandbox",
    },
    {
      href: "/cursos/python/quiz",
      etiqueta: "Quiz de Python",
      tipo: "quiz",
      activa: true,
    },
  ];

  return (
    <div className="flex min-h-dvh">
      <BarraLateral
        curso={curso}
        codigo={codigo}
        inicio={usuario ? "/cursos" : "/"}
        herramientas={herramientas}
      />

      <main className="min-w-0 flex-1">
        <article className="mx-auto w-full max-w-4xl px-6 py-12 lg:px-10">
          <Migas
            items={[
              { texto: "Cursos", href: usuario ? "/cursos" : "/" },
              {
                texto: curso.titulo,
                href: `/cursos/${curso.slug}/${curso.lecciones[0].slug}`,
              },
              { texto: "Quiz de Python" },
            ]}
          />

          <header className="border-b border-borde pb-6">
            <div className="flex items-start justify-between gap-4">
              <p className="flex items-center gap-2 font-mono text-sm text-rojo-acento">
                <ListChecks size={17} aria-hidden="true" />
                16 preguntas · 4 sesiones
              </p>
              <SelectorTema />
            </div>
            <h1 className="mt-2 text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
              Quiz de Python
            </h1>
            <p className="mt-3 max-w-2xl leading-relaxed text-texto-suave">
              Selecciona una tarjeta por pregunta. Después de responder verás la
              explicación antes de pasar a la siguiente.
            </p>
          </header>

          <div className="mt-8">
            <QuizPython />
          </div>
        </article>
      </main>
    </div>
  );
}
