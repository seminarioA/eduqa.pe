"use client";

import { useMemo, useState } from "react";
import { LayoutGrid, List } from "lucide-react";
import { TarjetaGestion, type CursoGestion, type VistaGestion } from "../TarjetaGestion";

type OrdenGestion = "recientes" | "titulo" | "categoria" | "estado";
const TODAS = "todas";

export function CatalogoGestion({ cursos }: { cursos: CursoGestion[] }) {
  const [vista, setVista] = useState<VistaGestion>("grilla");
  const [categoria, setCategoria] = useState(TODAS);
  const [orden, setOrden] = useState<OrdenGestion>("recientes");

  const categorias = useMemo(
    () => [...new Set(cursos.map((curso) => curso.area))].sort((a, b) => a.localeCompare(b, "es")),
    [cursos],
  );

  const visibles = useMemo(() => {
    const filtrados = categoria === TODAS
      ? cursos
      : cursos.filter((curso) => curso.area === categoria);

    return [...filtrados].sort((a, b) => {
      if (orden === "titulo") return a.titulo.localeCompare(b.titulo, "es");
      if (orden === "categoria") {
        return a.area.localeCompare(b.area, "es") || a.titulo.localeCompare(b.titulo, "es");
      }
      if (orden === "estado") {
        return a.estado.localeCompare(b.estado, "es") || a.titulo.localeCompare(b.titulo, "es");
      }
      return new Date(b.actualizadoEn).getTime() - new Date(a.actualizadoEn).getTime();
    });
  }, [categoria, cursos, orden]);

  return (
    <>
      <div className="mt-5 flex flex-wrap items-center gap-2">
        <label className="sr-only" htmlFor="categoria-cursos">Filtrar por categoría</label>
        <select
          id="categoria-cursos"
          value={categoria}
          onChange={(evento) => setCategoria(evento.target.value)}
          className="h-9 rounded-lg border border-borde bg-fondo px-3 text-xs text-texto outline-none transition-colors focus:border-rojo-acento focus-visible:outline-2 focus-visible:outline-rojo-acento"
        >
          <option value={TODAS}>Todas las categorías</option>
          {categorias.map((nombre) => <option key={nombre} value={nombre}>{nombre}</option>)}
        </select>

        <label className="sr-only" htmlFor="orden-cursos">Ordenar cursos</label>
        <select
          id="orden-cursos"
          value={orden}
          onChange={(evento) => setOrden(evento.target.value as OrdenGestion)}
          className="h-9 rounded-lg border border-borde bg-fondo px-3 text-xs text-texto outline-none transition-colors focus:border-rojo-acento focus-visible:outline-2 focus-visible:outline-rojo-acento"
        >
          <option value="recientes">Actualizados recientemente</option>
          <option value="titulo">Título (A–Z)</option>
          <option value="categoria">Categoría</option>
          <option value="estado">Estado</option>
        </select>

        <span className="ml-auto text-xs text-texto-tenue">
          {visibles.length} {visibles.length === 1 ? "curso" : "cursos"}
        </span>

        <div className="flex rounded-lg border border-borde bg-fondo p-0.5" aria-label="Vista del catálogo">
          <button
            type="button"
            onClick={() => setVista("grilla")}
            aria-label="Ver como grilla"
            aria-pressed={vista === "grilla"}
            className={`rounded-md p-1.5 transition-colors focus-visible:outline-2 focus-visible:outline-rojo-acento ${vista === "grilla" ? "bg-rojo-tenue text-rojo-acento" : "text-texto-tenue hover:bg-superficie"}`}
          >
            <LayoutGrid size={15} aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => setVista("lista")}
            aria-label="Ver como lista"
            aria-pressed={vista === "lista"}
            className={`rounded-md p-1.5 transition-colors focus-visible:outline-2 focus-visible:outline-rojo-acento ${vista === "lista" ? "bg-rojo-tenue text-rojo-acento" : "text-texto-tenue hover:bg-superficie"}`}
          >
            <List size={15} aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className={vista === "grilla"
        ? "mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        : "mt-4 flex flex-col gap-3"}
      >
        {visibles.map((curso) => (
          <TarjetaGestion key={curso.slug} curso={curso} vista={vista} />
        ))}
      </div>
    </>
  );
}
