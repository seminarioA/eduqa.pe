import type { ComponentProps, ReactNode } from "react";

function unir(...clases: (string | false | undefined)[]) {
  return clases.filter(Boolean).join(" ");
}

export function Boton({
  variante = "principal",
  className,
  ...props
}: ComponentProps<"button"> & {
  variante?: "principal" | "secundario" | "sobreRojo";
}) {
  const variantes = {
    principal: "bg-rojo text-white hover:bg-rojo-hover focus-visible:outline-rojo-acento",
    secundario:
      "border border-borde-fuerte bg-fondo text-texto hover:bg-superficie focus-visible:outline-rojo-acento",
    // Va sobre la cabecera roja, no sobre el fondo de la página: su tinta es
    // el rojo de marca en ambos temas, porque el papel de abajo es blanco.
    sobreRojo:
      "bg-white text-rojo hover:bg-sobre-rojo-suave focus-visible:outline-white",
  } as const;

  return (
    <button
      {...props}
      className={unir(
        "inline-flex items-center justify-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold",
        "transition-colors focus-visible:outline-2 focus-visible:outline-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-50",
        variantes[variante],
        className,
      )}
    />
  );
}

export function Seccion({
  id,
  titulo,
  ancho = "normal",
  children,
}: {
  id?: string;
  titulo?: string;
  ancho?: "normal" | "amplio";
  children: ReactNode;
}) {
  return (
    <section id={id} className="border-t border-borde px-6 py-16 sm:py-20">
      <div
        className={unir(
          "mx-auto w-full",
          ancho === "amplio" ? "max-w-6xl" : "max-w-3xl",
        )}
      >
        {titulo && (
          <h2 className="mb-8 text-2xl font-semibold tracking-tight sm:text-3xl">
            {titulo}
          </h2>
        )}
        {children}
      </div>
    </section>
  );
}

export function Campo({
  etiqueta,
  ayuda,
  children,
}: {
  etiqueta: string;
  ayuda?: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-texto">{etiqueta}</span>
      {children}
      {ayuda && <span className="mt-1.5 block text-xs text-texto-tenue">{ayuda}</span>}
    </label>
  );
}

/** Sin ancho: para cuando el ancho lo decide quien lo usa (ej. el select de país). */
export const claseInputBase = unir(
  "rounded-lg border border-borde-fuerte bg-fondo px-3.5 py-2.5 text-sm text-texto",
  "placeholder:text-texto-tenue",
  "focus:border-rojo-acento focus:outline-none focus:ring-1 focus:ring-rojo-acento",
);

export const claseInput = unir(claseInputBase, "w-full");
