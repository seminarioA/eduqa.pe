/** La misma marca tipográfica en la navegación general y en las lecciones. */
export function MarcaTextoLateral({
  ocultarAlColapsar = false,
}: {
  ocultarAlColapsar?: boolean;
}) {
  return (
    <span
      className={`text-sm font-bold uppercase tracking-[0.18em] text-rojo-acento${ocultarAlColapsar ? " sidebar-etiqueta" : ""}`}
    >
      EDUQA.PE
    </span>
  );
}
