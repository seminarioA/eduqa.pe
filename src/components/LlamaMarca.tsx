import { Llama } from "./Llama";

/**
 * Pinta el SVG personalizado de una ranura de la marca, o cae a la llama
 * original si esa ranura no tiene uno.
 *
 * Va inline y no como <img> a propósito: inyectado en el árbol, el SVG usa
 * `currentColor` y sigue cambiando de tono con el tema igual que la llama
 * original. La altura la da la envoltura; el SVG interior se estira a ella.
 *
 * Recibe el SVG por props y no lo va a buscar solo: este archivo se incluye
 * también en componentes de cliente, donde no hay acceso a la base de datos.
 * Quien lo renderiza desde un Server Component lee `marcaActual()` y pasa
 * la ranura correspondiente.
 */
export function MarcaInline({
  svg,
  className,
}: {
  svg: string | null;
  className?: string;
}) {
  if (!svg) return <Llama className={className} />;

  return (
    <span
      role="img"
      aria-label="Llama de EDUQA.PE"
      className={`inline-flex shrink-0 [&>svg]:h-full [&>svg]:w-auto ${className ?? ""}`}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
