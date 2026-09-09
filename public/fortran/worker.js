/* Runtime de LFortran/xeus compilado a WebAssembly, aislado por ejecución. */
const BASE = '/vendor/xlfortran/';
const LIMITE_SALIDA = 65536;
const enviar = self.postMessage.bind(self);
const limpiar = texto => String(texto).replace(/\x1b\[[0-9;]*m/g, '');
let salida = '';
let fallo = false;
let terminado = false;
let iniciado = false;
function agregar(texto) {
  salida += limpiar(texto);
  if (salida.length > LIMITE_SALIDA) {
    salida = salida.slice(0, LIMITE_SALIDA) + '\nLa salida superó el límite de 64 KB.';
    finalizar(true);
    throw new Error('Límite de salida');
  }
}
function finalizar(error) {
  if (terminado) return;
  terminado = true;
  enviar({ tipo: 'resultado', salida: salida.trimEnd(), error });
  self.close();
}
// xeus publica mensajes Jupyter; solo se presenta texto, nunca HTML ejecutable.
self.postMessage = mensaje => {
  const tipo = mensaje.header?.msg_type;
  if (tipo === 'stream') agregar(mensaje.content.text);
  if (tipo === 'error') { fallo = true; agregar((mensaje.content.traceback || [mensaje.content.evalue]).join('\n')); }
  if (tipo === 'execute_reply') finalizar(fallo || mensaje.content.status !== 'ok');
};
self.onmessage = async ({ data }) => {
  if (iniciado) return;
  iniciado = true;
  try {
    if (typeof data.codigo !== 'string' || data.codigo.length > 50000) throw new Error('El programa debe tener como máximo 50 000 caracteres.');
    enviar({ tipo: 'fase', fase: 'cargando' });
    importScripts(BASE + 'xlfortran.js');
    const entrada = new TextEncoder().encode(String(data.entrada ?? ''));
    let posicion = 0;
    const mod = await self.createXeusModule({
      locateFile: archivo => BASE + archivo,
      print: texto => agregar(texto + '\n'),
      printErr: texto => agregar(texto + '\n'),
      stdin: () => posicion < entrada.length ? entrada[posicion++] : null,
    });
    self.Module = mod;
    self.get_stdin = () => ({ error: 'Introduce los datos en el campo de entrada antes de ejecutar.' });
    mod.FS.mkdir('/practica');
    mod.FS.chdir('/practica');
    for (const [nombre, texto] of Object.entries(data.archivos ?? {})) {
      if (!/^[a-zA-Z0-9_.-]+$/.test(nombre) || typeof texto !== 'string' || texto.length > 50000) throw new Error('Archivo de práctica inválido.');
      mod.FS.writeFile(nombre, texto);
    }
    const kernel = new mod.xkernel(['xlfortran']);
    const servidor = kernel.get_server();
    kernel.start();
    enviar({ tipo: 'fase', fase: 'ejecutando' });
    servidor.notify_listener({
      header: { msg_id: 'ejecucion', username: 'estudiante', session: 'practica', date: new Date().toISOString(), msg_type: 'execute_request', version: '5.3' },
      parent_header: {}, metadata: {}, buffers: [], channel: 'shell',
      content: { code: data.codigo, silent: false, store_history: false, user_expressions: {}, allow_stdin: false, stop_on_error: true },
    });
  } catch (e) {
    let mensaje = e instanceof Error ? e.message : String(e);
    if (self.Module?.getExceptionMessage && e instanceof WebAssembly.Exception) mensaje = self.Module.getExceptionMessage(e).join(': ');
    agregar('\n' + mensaje);
    finalizar(true);
  }
};
