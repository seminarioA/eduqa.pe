# LFortran en WebAssembly

Artefactos oficiales descargados el 9 de septiembre de 2026 desde:
https://lfortran.github.io/lfortran/xeus/xeus-lfortran-wasm-host/

`xlfortran.js`, `.wasm` y `.data` proceden de `bin/`; `libxeus.so`, de la raíz.
Los bytes quedan fijados en este repositorio; SHA256.json permite comprobarlos.
No se descarga una versión «latest» durante la ejecución del alumno.

El compilador completo y el núcleo xeus se ejecutan en un Worker nuevo para cada
intento. Los programas se compilan y ejecutan localmente en WebAssembly. La página
recibe únicamente texto del protocolo Jupyter; no presenta HTML producido por el
programa. La carga inicial del motor es de aproximadamente 65 MB sin compresión.

Al abrir un curso o el sandbox de Fortran se descarga e inicializa un Worker de
reserva. La primera ejecución consume esa reserva; al terminar se destruye y se
prepara otra mientras siga abierto un curso o sandbox. Al salir se libera la
reserva. La inicialización compartida evita duplicar la descarga si se pulsa
Ejecutar antes de que termine la carga.

Referencias técnicas:
- https://gws.phd/posts/fortran_wasm/ (Fortran y WebAssembly)
- https://github.com/lfortran/lfortran/blob/main/doc/src/jupyterlite.md
- https://github.com/jupyterlite/xeus/blob/main/packages/xeus-core/src/worker.base.ts

Se usa el motor actual de LFortran para permitir editar código en el navegador;
el procedimiento Flang del artículo original compila previamente las fuentes.
Las licencias de LFortran, xeus, xeus-lite, LLVM y Emscripten se incluyen aquí.

Comprobación: `npm run test:fortran:web`. Dos ejemplos permanecen marcados
`!sin-consola`: el bucle con paso negativo de Introducción (sesión 3) y la lectura
hasta EOF de Intermedio (sesión 4), porque no reproducen aún la salida de GNU
Fortran con este motor. Los 16 ejercicios sí se ejecutan en WebAssembly.
