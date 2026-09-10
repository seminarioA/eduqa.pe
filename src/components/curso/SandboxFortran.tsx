"use client";

import { useEffect, useId, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import { Download, Play, Plus, RotateCcw, Square, Trash2 } from 'lucide-react';
import { ejecutarFortran, type FaseFortran, type ResultadoFortran } from '@/lib/fortran-web';
import { BORRADOR_INICIAL, crearAlmacenBorrador, leerBorrador, nombreArchivoValido, PROGRAMA_INICIAL, type BorradorFortran } from '@/lib/borrador-fortran';

const campo = 'w-full rounded-lg border border-borde-fuerte bg-fondo p-3 font-mono text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-rojo-acento disabled:opacity-60';
const boton = 'inline-flex items-center justify-center gap-2 rounded-lg border border-borde-fuerte bg-fondo px-3 py-2 text-sm font-medium text-texto-suave hover:text-rojo-acento disabled:opacity-50';

export function SandboxFortran({ ruta }: { ruta: string }) {
  const id = useId();
  const almacen = useMemo(() => crearAlmacenBorrador(ruta), [ruta]);
  const texto = useSyncExternalStore(almacen.suscribir, almacen.leer, () => BORRADOR_INICIAL);
  const borrador = useMemo(() => leerBorrador(texto), [texto]);
  const [guardado, setGuardado] = useState(true);
  const [nombre, setNombre] = useState('');
  const [avisoArchivo, setAvisoArchivo] = useState('');
  const [fase, setFase] = useState<FaseFortran | null>(null);
  const [resultado, setResultado] = useState<ResultadoFortran | null>(null);
  const controlador = useRef<AbortController | null>(null);
  useEffect(() => () => controlador.current?.abort(), []);

  function cambiar(cambios: Partial<BorradorFortran>) {
    setGuardado(almacen.guardar({ ...borrador, ...cambios }));
  }
  async function ejecutar() {
    if (fase) return;
    controlador.current = new AbortController();
    setResultado(null);
    setFase('cargando');
    const respuesta = await ejecutarFortran(borrador.codigo, {
      entrada: borrador.entrada && !borrador.entrada.endsWith('\n') ? `${borrador.entrada}\n` : borrador.entrada,
      archivos: borrador.archivos,
      signal: controlador.current.signal,
      alCambiarFase: setFase,
    });
    setResultado(respuesta);
    setFase(null);
  }
  function descargar() {
    const url = URL.createObjectURL(new Blob([borrador.codigo], { type: 'text/plain;charset=utf-8' }));
    const enlace = document.createElement('a');
    enlace.href = url;
    enlace.download = 'sandbox.f90';
    document.body.appendChild(enlace);
    enlace.click();
    enlace.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  function agregarArchivo() {
    const archivo = nombre.trim();
    if (!nombreArchivoValido(archivo)) { setAvisoArchivo('Usa un nombre como datos.txt, sin carpetas ni espacios.'); return; }
    if (Object.hasOwn(borrador.archivos, archivo)) { setAvisoArchivo('Ya existe un archivo con ese nombre.'); return; }
    if (Object.keys(borrador.archivos).length >= 5) { setAvisoArchivo('Puedes preparar hasta cinco archivos.'); return; }
    cambiar({ archivos: { ...borrador.archivos, [archivo]: '' } });
    setNombre('');
    setAvisoArchivo('');
  }

  return <div data-sandbox-fortran>
    <div className="overflow-hidden rounded-xl border border-borde bg-superficie">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-borde p-4">
        <div><h2 className="text-sm font-semibold">Tu programa</h2><p className="mt-1 text-xs text-texto-tenue">El borrador se guarda en este navegador.</p></div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={descargar} className={boton}><Download size={15} aria-hidden="true" />Descargar .f90</button>
          {fase ? <button type="button" onClick={() => controlador.current?.abort()} className={boton}><Square size={15} aria-hidden="true" />Detener</button> : <button type="button" onClick={ejecutar} className="inline-flex items-center gap-2 rounded-lg bg-rojo px-5 py-2 text-sm font-semibold text-white hover:bg-rojo-hover"><Play size={15} aria-hidden="true" />Ejecutar</button>}
        </div>
      </div>
      <div className="grid min-w-0 gap-5 p-4 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <div className="min-w-0">
          <label htmlFor={`${id}-codigo`} className="mb-2 block text-xs font-medium text-texto-suave">Código Fortran</label>
          <textarea id={`${id}-codigo`} value={borrador.codigo} onChange={e => cambiar({ codigo: e.target.value })} disabled={!!fase} maxLength={50000} rows={20} spellCheck={false} autoCapitalize="off" autoCorrect="off" className={`${campo} min-h-80 resize-y whitespace-pre`} />
          <button type="button" disabled={!!fase} onClick={() => { cambiar({ codigo: PROGRAMA_INICIAL }); setResultado(null); }} className="mt-2 inline-flex items-center gap-1.5 text-xs text-texto-suave hover:text-rojo-acento disabled:opacity-50"><RotateCcw size={13} aria-hidden="true" />Restaurar ejemplo inicial</button>
        </div>
        <div className="min-w-0">
          <h2 className="mb-2 text-xs font-medium text-texto-suave">Salida</h2>
          <div role="status" aria-live="polite" data-salida-sandbox className="min-h-40 rounded-lg border border-borde bg-fondo p-4">
            {fase ? <p className="text-sm text-texto-suave">{fase === 'cargando' ? 'Preparando Fortran…' : 'Compilando y ejecutando…'}</p> : resultado ? <>
              <p className={`mb-3 text-xs font-semibold ${resultado.error ? 'text-rojo-acento' : 'text-exito'}`}>{resultado.error ? 'No se completó la ejecución' : 'Ejecución completada'}</p>
              <pre className="max-h-96 overflow-auto whitespace-pre-wrap break-words font-mono text-sm leading-relaxed">{resultado.salida || 'El programa terminó sin imprimir salida.'}</pre>
            </> : <p className="text-sm leading-relaxed text-texto-tenue">La salida de tu programa aparecerá aquí.</p>}
          </div>
          <label htmlFor={`${id}-entrada`} className="mb-2 mt-5 block text-xs font-medium text-texto-suave">Entrada estándar</label>
          <textarea id={`${id}-entrada`} value={borrador.entrada} onChange={e => cambiar({ entrada: e.target.value })} disabled={!!fase} maxLength={50000} rows={4} placeholder="Datos que leerá READ(*,*)" className={`${campo} resize-y`} />
          <p className="mt-2 text-xs leading-relaxed text-texto-tenue">Escribe los datos antes de ejecutar, en el orden en que los pide el programa.</p>
        </div>
      </div>
      <details className="border-t border-borde p-4">
        <summary className="cursor-pointer text-sm font-medium">Archivos de entrada ({Object.keys(borrador.archivos).length})</summary>
        <p className="mt-3 text-xs leading-relaxed text-texto-suave">Los archivos se preparan de nuevo en cada ejecución. Ábrelos desde Fortran con su nombre, por ejemplo datos.txt.</p>
        <div className="mt-3 flex flex-wrap items-end gap-2">
          <label className="min-w-0 flex-1 text-xs font-medium">Nombre del archivo<input value={nombre} onChange={e => setNombre(e.target.value)} disabled={!!fase} maxLength={80} placeholder="datos.txt" className={`${campo} mt-1`} /></label>
          <button type="button" disabled={!!fase} onClick={agregarArchivo} className={boton}><Plus size={15} aria-hidden="true" />Agregar archivo</button>
        </div>
        {avisoArchivo && <p role="alert" className="mt-2 text-xs text-rojo-acento">{avisoArchivo}</p>}
        {Object.entries(borrador.archivos).map(([archivo, contenido]) => <div key={archivo} className="mt-4">
          <div className="mb-2 flex items-center justify-between gap-2"><label htmlFor={`${id}-${archivo}`} className="truncate font-mono text-xs">{archivo}</label><button type="button" disabled={!!fase} aria-label={`Quitar ${archivo}`} onClick={() => { const archivos = { ...borrador.archivos }; delete archivos[archivo]; cambiar({ archivos }); }} className="rounded p-1 text-texto-tenue hover:text-rojo-acento"><Trash2 size={15} aria-hidden="true" /></button></div>
          <textarea id={`${id}-${archivo}`} value={contenido} onChange={e => cambiar({ archivos: { ...borrador.archivos, [archivo]: e.target.value } })} disabled={!!fase} rows={4} maxLength={50000} spellCheck={false} className={campo} />
        </div>)}
      </details>
    </div>
    {!guardado && <p role="alert" className="mt-3 text-sm text-rojo-acento">No pudimos guardar el borrador en el navegador. Puedes descargar el programa para conservarlo.</p>}
  </div>;
}
