import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import ts from 'typescript';
import { cargar } from './validar-iconos-cursos.mjs';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const { cargarCursosLocales } = cargar(path.resolve('src/lib/curso-markdown.ts'));
const biblioteca = ts.transpileModule(fs.readFileSync('src/lib/fortran-web.ts','utf8'), {compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText;
let fallarDescarga = false;
const servidor = http.createServer((req,res)=>{
  const ruta = new URL(req.url,'http://localhost').pathname;
  if(ruta==='/'){res.setHeader('Content-Type','text/html');res.end('<!doctype html><html><body>Verificación Fortran</body></html>');return;}
  if(ruta==='/motor.js'){res.setHeader('Content-Type','application/javascript');res.end(biblioteca);return;}
  if(fallarDescarga && ruta.endsWith('/xlfortran.js')){res.statusCode=503;res.end('Descarga no disponible');return;}
  const archivo=path.resolve('public','.'+ruta);
  if(!archivo.startsWith(path.resolve('public')+path.sep)||!fs.existsSync(archivo)||!fs.statSync(archivo).isFile()){res.statusCode=404;res.end();return;}
  res.setHeader('Content-Type',archivo.endsWith('.wasm')?'application/wasm':archivo.endsWith('.js')?'application/javascript':'application/octet-stream');
  res.setHeader('Cache-Control','public, max-age=3600');
  fs.createReadStream(archivo).pipe(res);
});
await new Promise(resolve=>servidor.listen(0,'127.0.0.1',resolve));
const browser=await chromium.launch({headless:true,...(process.env.PLAYWRIGHT_CHANNEL?{channel:process.env.PLAYWRIGHT_CHANNEL}:{})});
const cursoSeleccionado=process.argv.find(a=>a.startsWith('--curso='))?.split('=')[1];
const cursos=cargarCursosLocales().filter(c=>c.slug.startsWith('fortran')&&(!cursoSeleccionado||c.slug===cursoSeleccionado));
assert.ok(cursos.length, 'No hay cursos Fortran para verificar');
const actualizarEsperados=process.argv.includes('--actualizar-esperados');
if(actualizarEsperados)assert.ok(cursoSeleccionado,'Selecciona un curso para actualizar las salidas de sus ejercicios');
const sesionSeleccionada=Number(process.argv.find(a=>a.startsWith('--sesion='))?.split('=')[1]);
if(sesionSeleccionada)for(const curso of cursos)curso.lecciones=curso.lecciones.filter(l=>l.numero===sesionSeleccionada);
const respuestas=JSON.parse(fs.readFileSync('scripts/fortran-respuestas.json','utf8'));
const normalizar=s=>s.trim().replace(/\s+/g,' ');
function comparar(actual,esperada){
 const a=normalizar(actual).split(' '),b=normalizar(esperada).split(' ');
 return a.length===b.length&&a.every((v,i)=>v===b[i]||(Number.isFinite(Number(v))&&Number.isFinite(Number(b[i]))&&Math.abs(Number(v)-Number(b[i]))<=1e-6*Math.max(1,Math.abs(Number(b[i])))));
}
try{
 const page=await browser.newPage();
 await page.goto(`http://127.0.0.1:${servidor.address().port}/`);
 async function ejecutar(codigo,opciones={}){
  return page.evaluate(async({codigo,opciones})=>{const {ejecutarFortran}=await import('/motor.js');return ejecutarFortran(codigo,opciones);},{codigo,opciones});
 }
 let workers=0;
 page.on('worker',()=>workers++);
 const preparado=await page.evaluate(async()=>{
  const motor=await import('/motor.js');
  const resultados=await Promise.all([motor.prepararFortran(),motor.prepararFortran(),motor.prepararFortran()]);
  return {resultados,estado:motor.estadoFortran()};
 });
 assert.deepEqual(preparado,{resultados:[true,true,true],estado:'listo'});
 assert.equal(workers,1,'La precarga debe compartir un único Worker');
 assert.deepEqual(await ejecutar('program primero\n print *, 42\nend program primero'),{salida:'42',error:false});
 assert.equal(workers,1,'La primera ejecución debe consumir el compilador ya preparado');
 const duranteCarga=await page.evaluate(async()=>{
  const motor=await import('/motor.js');
  const precarga=motor.prepararFortran();
  const resultado=await motor.ejecutarFortran('program segundo\n print *, 7\nend program segundo');
  return {preparado:await precarga,resultado};
 });
 assert.deepEqual(duranteCarga,{preparado:true,resultado:{salida:'7',error:false}});
 assert.equal(workers,2,'Ejecutar durante la precarga no debe iniciar otra descarga');
 const limpieza=await page.evaluate(async()=>{
  const motor=await import('/motor.js');
  const salir=motor.mantenerFortranPreparado();
  await motor.prepararFortran();
  salir();
  await new Promise(resolve=>setTimeout(resolve,20));
  return motor.estadoFortran();
 });
 assert.equal(limpieza,'sin-empezar');
 // Una pestaña sin caché permite simular un fallo real y reintentar.
 const falloContexto=await browser.newContext();
 const falloPagina=await falloContexto.newPage();
 await falloPagina.goto(`http://127.0.0.1:${servidor.address().port}/`);
 fallarDescarga=true;
 assert.equal(await falloPagina.evaluate(async()=>{const m=await import('/motor.js');await m.prepararFortran();return m.estadoFortran();}),'error');
 fallarDescarga=false;
 assert.equal(await falloPagina.evaluate(async()=>{const m=await import('/motor.js');return m.prepararFortran();}),true);
 await falloContexto.close();
 console.log('Precarga única, reutilización, ejecución durante la carga, liberación y reintento verificados.');
 if(!process.argv.includes('--solo-ejercicios') && !process.argv.includes('--solo-preparacion')){
  let cantidad=0;
  for(const c of cursos)for(const l of c.lecciones)for(const b of l.bloques){
   if(b.tipo!=='codigo'||b.lenguaje!=='fortran'||b.sinConsola)continue;
   const r=await ejecutar(b.contenido,{entrada:b.entrada,archivos:b.archivos});
   assert.equal(r.error,false,`${c.slug}/${l.slug}: ${r.salida}`);
   assert.ok(comparar(r.salida,b.salida||''),`${c.slug}/${l.slug}: ${r.salida} != ${b.salida}\n${b.contenido}`);
   cantidad++;
  }
  console.log(`${cantidad} ejemplos ejecutados en WebAssembly y comparados con GNU Fortran.`);
 }
 if(!process.argv.includes('--solo-ejemplos') && !process.argv.includes('--solo-preparacion')) {
 for(const c of cursos)for(const l of c.lecciones)for(const [seccion,e] of Object.entries(l.ejercicios??{})){
  if(e.lenguaje!=='fortran')continue;
  const ficha=respuestas.find(r=>r.curso===c.slug&&r.archivo===`sesion-${l.numero}.md`&&(!r.seccion||r.seccion===seccion));
  assert.ok(ficha,`Falta respuesta de verificación: ${c.slug}/${l.slug}#${seccion}`);
  for(const correcta of [true,false]){
   const r=await ejecutar(e.plantilla.replace('___',()=>correcta?ficha.respuesta:ficha.incorrecta));
   if(actualizarEsperados&&correcta){
    assert.equal(r.error,false,r.salida);
    assert.ok(comparar(r.salida,e.esperado),`La salida web difiere de la salida nativa: ${seccion}`);
    const archivo=path.join('src/content',c.slug,ficha.archivo);
    const texto=fs.readFileSync(archivo,'utf8');
    const indiceObjetivo=Object.keys(l.ejercicios).indexOf(seccion);
    let indiceEjercicio=0;
    let encontrado=false;
    const actualizado=texto.replace(/```ejercicio fortran\n([\s\S]*?)\n```/g,(bloque,contenido)=>{
      if(indiceEjercicio++!==indiceObjetivo)return bloque;
      const plantilla=contenido.match(/# Plantilla\n([\s\S]*?)\n# Esperado/)[1].trim();
      assert.equal(plantilla,e.plantilla,'El ejercicio cambió durante la verificación');
      encontrado=true;
      return bloque.replace(/# Esperado\n[\s\S]*?\n# Pista/,'# Esperado\n'+r.salida.trim()+'\n# Pista');
    });
    assert.ok(encontrado,seccion);
    fs.writeFileSync(archivo,actualizado);
    e.esperado=r.salida.trim();
   }
   const acierto=!r.error&&normalizar(r.salida)===normalizar(e.esperado);
   assert.equal(acierto,correcta,`${c.slug}/${l.slug}#${seccion} (${correcta}): ${r.salida}`);
  }
  console.log(`${c.slug}/${l.slug}#${seccion}: respuesta correcta aceptada e incorrecta rechazada.`);
 }
 const invalido=await ejecutar('program roto\n esto no es Fortran\nend program roto');
 assert.equal(invalido.error,true);
 const cancelado=await page.evaluate(async()=>{
  const {ejecutarFortran}=await import('/motor.js');const controller=new AbortController();
  const promise=ejecutarFortran('program infinito\n do\n end do\nend program infinito',{signal:controller.signal,alCambiarFase:f=>{if(f==='ejecutando')setTimeout(()=>controller.abort(),100)}});
  return promise;
 });
 assert.equal(cancelado.salida,'Ejecución cancelada.');
 const limitado=await ejecutar('program infinito\n do\n end do\nend program infinito');
 assert.equal(limitado.error,true);assert.match(limitado.salida,/tiempo límite/);
 const recuperado=await ejecutar('program recuperado\n print *, 42\nend program recuperado');
 assert.equal(recuperado.error,false);assert.equal(recuperado.salida.trim(),'42');
 console.log('Sintaxis inválida, cancelación, tiempo límite y recuperación verificados.');
 }
}finally{await browser.close();await new Promise(resolve=>servidor.close(resolve));}
