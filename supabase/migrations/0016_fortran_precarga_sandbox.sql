begin;

update public.curso_contenido
set contenido = replace(contenido, $antes$El compilador se carga la primera vez que pulsas «Ejecutar» o «Comprobar»; las siguientes ejecuciones reutilizan la descarga.$antes$, $despues$El compilador se descarga y prepara al abrir el curso. Puedes seguir leyendo durante la carga y practicar con tus propios programas en el sandbox de la ruta, disponible desde el índice del curso.$despues$),
    actualizado_en = now()
where curso_slug = 'fortran-fundamentos' and archivo = 'sesion-1.md'
  and strpos(contenido, $antes$El compilador se carga la primera vez que pulsas «Ejecutar» o «Comprobar»; las siguientes ejecuciones reutilizan la descarga.$antes$) > 0;

update public.curso_contenido
set contenido = replace(contenido, $antes$La primera ejecución descarga el compilador WebAssembly; cada intento usa memoria y archivos virtuales independientes.$antes$, $despues$Al abrir el curso se descarga y prepara el compilador WebAssembly; cada intento usa memoria y archivos virtuales independientes. El sandbox de la ruta permite practicar con programas propios y archivos de entrada.$despues$),
    actualizado_en = now()
where curso_slug = 'fortran-ingenieria-software' and archivo = 'sesion-1.md'
  and strpos(contenido, $antes$La primera ejecución descarga el compilador WebAssembly; cada intento usa memoria y archivos virtuales independientes.$antes$) > 0;

commit;
