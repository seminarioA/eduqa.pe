import { codeToHtml } from "shiki";
import { CornerDownRight } from "lucide-react";
import type { Doc } from "@/lib/cursos";
import { BotonCopiar } from "./BotonCopiar";
import { Citas } from "./Citas";
import { NotaTecnica } from "./NotaTecnica";
import { Consola } from "./Consola";

/** Nombres editoriales que Shiki registra con otro identificador. */
const LENGUAJES_SHIKI: Record<string, string> = {
  fortran: "fortran-free-form",
};

/**
 * Resaltado con Shiki (el mismo motor que VS Code y la documentación de Next).
 * Corre en el servidor: al cliente solo llega HTML ya coloreado, sin JS de resaltado.
 *
 * Tres bandas de gris ascendente para que se distingan sin recuadros extra:
 * cabecera, código sobre blanco, y salida sobre el gris más marcado.
 */
export async function BloqueCodigo({
  codigo,
  lenguaje,
  salida,
  docs,
  nota,
  ejecutable = false,
  paquetes,
  preludio,
}: {
  codigo: string;
  lenguaje: string;
  salida: string | null;
  docs?: Doc[];
  nota?: string;
  /** Añade una consola para correr el fragmento en el navegador. */
  ejecutable?: boolean;
  paquetes?: string[];
  preludio?: string;
}) {
  // Dos temas a la vez: Shiki emite variables CSS y globals.css decide cuál pinta.
  const html = await codeToHtml(codigo, {
    lang: LENGUAJES_SHIKI[lenguaje] ?? lenguaje,
    themes: { light: "github-light", dark: "github-dark" },
    defaultColor: "light",
  });

  const tendraConsola = ejecutable && lenguaje === "python";

  return (
    <div className="my-6">
      <div className="overflow-hidden rounded-xl border border-borde-fuerte">
        <div className="flex items-center justify-between gap-3 bg-superficie px-3 py-2">
          <span className="font-mono text-xs uppercase tracking-wide text-texto-tenue">
            {lenguaje}
          </span>
          <BotonCopiar texto={codigo} />
        </div>

        <div className="overflow-x-auto [&_pre]:!bg-fondo [&_pre]:p-4 [&_pre]:text-[0.8125rem] [&_pre]:leading-relaxed">
          <div dangerouslySetInnerHTML={{ __html: html }} />
        </div>

        {/* La salida del temario se pinta salvo cuando va a haber consola:
            ahí la produce el botón y repetirla sería decir dos veces lo mismo.
            La condición mira el lenguaje y no solo si la sesión es ejecutable,
            porque un bloque de shell nunca recibe consola y su salida tiene
            que verse igual. */}
        {salida && !tendraConsola && (
          <div className="border-t border-borde bg-superficie">
            <div className="flex items-center gap-1.5 px-4 pt-2.5 text-[11px] uppercase tracking-wide text-texto-tenue">
              <CornerDownRight size={12} aria-hidden="true" />
              Salida
            </div>
            <pre className="overflow-x-auto px-4 pb-3.5 pt-1.5 font-mono text-[0.78rem] leading-relaxed text-texto-suave">
              {salida}
            </pre>
          </div>
        )}
        {tendraConsola && (
          <Consola codigo={codigo} paquetes={paquetes} preludio={preludio} />
        )}
      </div>
      <NotaTecnica texto={nota} />
      <Citas docs={docs} />
    </div>
  );
}
