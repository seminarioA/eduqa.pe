import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import ts from 'typescript';
import { cargar } from './validar-iconos-cursos.mjs';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const { cargarCursosLocales } = cargar(path.resolve('src/lib/curso-markdown.ts'));
const biblioteca = ts.transpileModule(fs.readFileSync('src/lib/fortran-web.ts','utf8'), {compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText;
const servidor = http.createServer((req,res)=>{
  const ruta = new URL(req.url,'http://localhost').pathname;
  if(ruta==='/'){res.setHeader('Content-Type','text/html');res.end('<!doctype html><html><body>Verificación Fortran</body></html>');return;}
  if(ruta==='/motor.js'){res.setHeader('Content-Type','application/javascript');res.end(biblioteca);return;}
  const archivo=path.resolve('public','.'+ruta);
  if(!archivo.startsWith(path.resolve('public')+path.sep)||!fs.existsSync(archivo)||!fs.statSync(archivo).isFile()){res.statusCode=404;res.end();return;}
  res.setHeader('Content-Type',archivo.endsWith('.wasm')?'application/wasm':archivo.endsWith('.js')?'application/javascript':'application/octet-stream');
  res.setHeader('Cache-Control','public, max-age=3600');
  fs.createReadStream(archivo).pipe(res);
});
await new Promise(resolve=>servidor.listen(0,'127.0.0.1',resolve));
const browser=await chromium.launch({headless:true,...(process.env.PLAYWRIGHT_CHANNEL?{channel:process.env.PLAYWRIGHT_CHANNEL}:{})});
const cursos=cargarCursosLocales().filter(c=>c.slug.startsWith('fortran'));
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
 if(!process.argv.includes('--solo-ejercicios')){
  let cantidad=0;
  for(const c of cursos)for(const l of c.lecciones)for(const b of l.bloques){
   if(b.tipo!=='codigo'||b.lenguaje!=='fortran'||b.sinConsola)continue;
   const r=await ejecutar(b.contenido,{entrada:b.entrada,archivos:b.archivos});
   assert.equal(r.error,false,`${c.slug}/${l.slug}: ${r.salida}`);
   assert.ok(comparar(r.salida,b.salida||''),`${c.slug}/${l.slug}: ${r.salida} != ${b.salida}`);
   cantidad++;
  }
  console.log(`${cantidad} ejemplos ejecutados en WebAssembly y comparados con GNU Fortran.`);
 }
 if(!process.argv.includes('--solo-ejemplos')) {
 for(const c of cursos)for(const l of c.lecciones)for(const e of Object.values(l.ejercicios??{})){
  if(e.lenguaje!=='fortran')continue;
  const ficha=respuestas.find(r=>r.curso===c.slug&&r.archivo===`sesion-${l.numero}.md`);
  assert.ok(ficha,'Falta respuesta de verificación');
  for(const correcta of [true,false]){
   const r=await ejecutar(e.plantilla.replace('___',()=>correcta?ficha.respuesta:ficha.incorrecta));
   const acierto=!r.error&&normalizar(r.salida)===normalizar(e.esperado);
   assert.equal(acierto,correcta,`${c.slug}/${l.slug} (${correcta}): ${r.salida}`);
  }
  console.log(`${c.slug}/${l.slug}: respuesta correcta aceptada e incorrecta rechazada.`);
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
