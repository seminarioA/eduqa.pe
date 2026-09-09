"use client";
import { useEffect, useId, useRef, useState } from 'react';
import { Play, RotateCcw, Square } from 'lucide-react';
import { ejecutarFortran, type FaseFortran } from '@/lib/fortran-web';

export function ConsolaFortran({ codigo, entrada = '', archivos = {} }: { codigo: string; entrada?: string; archivos?: Record<string, string> }) {
  const id = useId();
  const [fuente, setFuente] = useState(codigo);
  const [datos, setDatos] = useState(entrada);
  const [ficheros, setFicheros] = useState(archivos);
  const [editando, setEditando] = useState(false);
  const [fase, setFase] = useState<FaseFortran | null>(null);
  const [resultado, setResultado] = useState<{ salida: string; error: boolean } | null>(null);
  const controlador = useRef<AbortController | null>(null);
  useEffect(() => () => controlador.current?.abort(), []);
  async function ejecutar() {
    controlador.current = new AbortController();
    setResultado(null);
    setFase('cargando');
    const salida = await ejecutarFortran(fuente, { signal: controlador.current.signal, alCambiarFase: setFase, entrada: datos, archivos: ficheros });
    setResultado(salida);
    setFase(null);
  }
  const etiqueta = fase === 'cargando' ? 'Cargando Fortran…' : fase === 'compilando' ? 'Compilando…' : 'Ejecutando…';
  return <div className="border-t border-borde bg-superficie" data-consola-fortran>
    <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2">
      <span className="text-xs font-medium text-texto-suave">Fortran en el navegador</span>
      <div className="flex flex-wrap items-center gap-2">
        <button type="button" disabled={!!fase} onClick={() => setEditando(!editando)} aria-expanded={editando} aria-controls={id} className="rounded px-2 py-1 text-xs text-texto-suave hover:text-rojo-acento">{editando ? 'Ocultar editor' : 'Editar código'}</button>
        {fase ? <button type="button" onClick={() => controlador.current?.abort()} className="flex items-center gap-1 rounded border border-borde-fuerte px-2 py-1 text-xs"><Square size={12}/>Detener</button> : <button type="button" onClick={ejecutar} className="flex items-center gap-1 rounded border border-borde-fuerte bg-fondo px-3 py-1 text-xs font-medium hover:text-rojo-acento"><Play size={12}/>Ejecutar</button>}
      </div>
    </div>
    {editando && <div id={id} className="px-4 pb-3">
      <label htmlFor={`${id}-fuente`} className="sr-only">Código Fortran</label>
      <textarea id={`${id}-fuente`} value={fuente} onChange={e => setFuente(e.target.value)} disabled={!!fase} spellCheck={false} autoCapitalize="off" autoCorrect="off" rows={Math.min(18, fuente.split('\n').length + 1)} className="w-full resize-y rounded border border-borde-fuerte bg-fondo p-3 font-mono text-xs leading-relaxed"/>
      <button type="button" disabled={!!fase} onClick={() => { setFuente(codigo); setDatos(entrada); setFicheros(archivos); setResultado(null); }} className="mt-2 flex items-center gap-1 text-xs text-texto-suave"><RotateCcw size={12}/>Restaurar código</button>
    </div>}
    {(editando || entrada || Object.keys(archivos).length > 0) && <details className="px-4 pb-3 text-xs">
      <summary className="cursor-pointer text-texto-suave">Datos de entrada</summary>
      <label className="mt-2 block">Entrada estándar
        <textarea value={datos} disabled={!!fase} onChange={e => setDatos(e.target.value)} rows={2} className="mt-1 w-full rounded border border-borde-fuerte bg-fondo p-2 font-mono"/>
      </label>
      {Object.entries(ficheros).map(([nombre, texto]) => <label key={nombre} className="mt-2 block">{nombre}
        <textarea value={texto} disabled={!!fase} onChange={e => setFicheros({...ficheros, [nombre]: e.target.value})} rows={4} className="mt-1 w-full rounded border border-borde-fuerte bg-fondo p-2 font-mono"/>
      </label>)}
    </details>}
    <div role="status" aria-live="polite" className="px-4 pb-3 text-xs">
      {fase && <p className="text-texto-suave">{etiqueta}</p>}
      {resultado && <><p className={resultado.error ? 'font-medium text-rojo-acento' : 'font-medium text-texto-suave'}>{resultado.error ? 'Error' : 'Salida'}</p><pre className="mt-2 max-h-80 overflow-auto whitespace-pre-wrap break-words font-mono leading-relaxed">{resultado.salida || 'Sin salida.'}</pre></>}
    </div>
  </div>;
}
