"use client";

import { useEffect, useState } from "react";

export function ProgresoLectura() {
  const [progreso, setProgreso] = useState(0);

  useEffect(() => {
    const actualizar = () => {
      const documento = document.documentElement;
      const recorrible = documento.scrollHeight - window.innerHeight;
      const siguiente = recorrible <= 0 ? 1 : window.scrollY / recorrible;
      setProgreso(Math.min(1, Math.max(0, siguiente)));
    };

    actualizar();
    window.addEventListener("scroll", actualizar, { passive: true });
    window.addEventListener("resize", actualizar);

    return () => {
      window.removeEventListener("scroll", actualizar);
      window.removeEventListener("resize", actualizar);
    };
  }, []);

  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-0 z-[70] h-1 bg-borde/40"
      aria-hidden="true"
    >
      <div
        className="h-full origin-left bg-rojo-acento transition-transform duration-150"
        style={{ transform: `scaleX(${progreso})` }}
      />
    </div>
  );
}
