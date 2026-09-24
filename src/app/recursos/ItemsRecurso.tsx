import { Documento } from "@/components/Documento";
import type { SlugRecurso } from "@/lib/recursos";
import { datosRecurso } from "@/lib/recursos";
import { guardarItem, eliminarItem } from "./acciones";

export async function ItemsRecurso({ slug, administrador }: { slug: SlugRecurso; administrador: boolean }) {
  const { documento, items, revisiones } = await datosRecurso(slug);

  return (
    <section className="mt-10">
      <p className="text-sm text-texto-tenue">Versión del recurso: v{documento.version}</p>
      {items.length > 0 && <div className="mt-8 space-y-8">
        {items.map((item) => (
          <article key={item.id} className="rounded-xl border border-borde bg-superficie p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-lg font-semibold">{item.titulo}</h2>
              <span className="text-xs text-texto-tenue">v{item.version}</span>
            </div>
            <div className="mt-2"><Documento markdown={item.contenido} /></div>
            {administrador && (
              <details className="mt-5 border-t border-borde pt-4">
                <summary className="cursor-pointer text-sm font-medium text-rojo-acento">Editar ítem</summary>
                <form action={guardarItem} className="mt-4 space-y-3">
                  <input type="hidden" name="recurso" value={slug} />
                  <input type="hidden" name="id" value={item.id} />
                  <CampoItem titulo={item.titulo} contenido={item.contenido} posicion={item.posicion} />
                  <button className="rounded-lg bg-rojo-acento px-4 py-2 text-sm font-semibold text-white">Guardar cambios</button>
                </form>
                <details className="mt-4">
                  <summary className="cursor-pointer text-sm text-rojo-acento">Eliminar ítem</summary>
                  <form action={eliminarItem} className="mt-2">
                    <input type="hidden" name="recurso" value={slug} />
                    <input type="hidden" name="id" value={item.id} />
                    <p className="mb-2 text-sm text-texto-suave">Se quitará de esta página. La última versión permanecerá en el historial.</p>
                    <button className="rounded-lg border border-rojo-acento px-3 py-2 text-sm font-semibold text-rojo-acento">Confirmar eliminación</button>
                  </form>
                </details>
              </details>
            )}
          </article>
        ))}
      </div>}
      {administrador && (
        <section className="mt-10 rounded-xl border border-borde bg-superficie p-5">
          <h2 className="text-lg font-semibold">Nuevo ítem</h2>
          <form action={guardarItem} className="mt-4 space-y-3">
            <input type="hidden" name="recurso" value={slug} />
            <CampoItem posicion={(items.at(-1)?.posicion ?? 0) + 10} />
            <button className="rounded-lg bg-rojo-acento px-4 py-2 text-sm font-semibold text-white">Crear ítem</button>
          </form>
        </section>
      )}
      <details className="mt-10 border-t border-borde pt-5">
        <summary className="cursor-pointer text-sm font-medium">Historial de versiones ({revisiones.length})</summary>
        {revisiones.length === 0 ? <p className="mt-3 text-sm text-texto-suave">Aún no hay cambios registrados.</p> : (
          <ol className="mt-4 space-y-3">
            {revisiones.map((revision) => (
              <li key={revision.id} className="rounded-lg border border-borde p-3 text-sm">
                <details>
                  <summary className="cursor-pointer">
                    {revision.accion === "crear" ? "Creado" : revision.accion === "editar" ? "Editado" : "Eliminado"}: {revision.titulo} · v{revision.version} · {new Date(revision.registrada_en).toLocaleString("es-PE", { timeZone: "America/Lima" })}
                  </summary>
                  <div className="mt-3 border-t border-borde pt-3"><Documento markdown={revision.contenido} /></div>
                </details>
              </li>
            ))}
          </ol>
        )}
      </details>
    </section>
  );
}

function CampoItem({ titulo = "", contenido = "", posicion }: { titulo?: string; contenido?: string; posicion: number }) {
  const clase = "mt-1 w-full rounded-lg border border-borde bg-fondo p-2 text-sm text-texto focus:border-rojo-acento focus:outline-none";
  return <>
    <label className="block text-sm">Título<input name="titulo" required minLength={3} maxLength={160} defaultValue={titulo} className={clase} /></label>
    <label className="block text-sm">Contenido (Markdown)<textarea name="contenido" required minLength={3} maxLength={20000} rows={5} defaultValue={contenido} className={clase} /></label>
    <label className="block text-sm">Orden<input name="posicion" type="number" min={0} max={100000} required defaultValue={posicion} className={clase} /></label>
  </>;
}
