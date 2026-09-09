# Analizador de mediciones

Proyecto del curso Fortran aplicado a la ingeniería de software de EDUQA.
Requiere GNU Fortran, un compilador de C y Make. En Windows se puede utilizar WSL.

```sh
make test
make run
./analizador 10 14 18
```

Cada argumento es un número decimal, sin separadores ni espacios internos.
Se acepta notación exponencial con `e` o `d`. Se admiten de 1 a 100000 valores
finitos, de valor absoluto no superior a 1000000 y con hasta 128 caracteres
por argumento. Los límites son parte del contrato didáctico de la biblioteca.
Una entrada inválida termina con estado distinto de cero y escribe el error
en la salida de errores. El promedio solo es válido si el estado es cero.

- `estadistica.f90`: cálculo sin entrada/salida; estados 0 (éxito),
  1 (cantidad inválida), 2 (valor inválido).
- `analizador.f90`: argumentos, conversión y diagnóstico.
- `pruebas.f90`: cinco casos del contrato.
- `interfaz_c.f90` y `consumidor.c`: llamada real entre C y Fortran.

El consumidor C debe proporcionar punteros válidos, memoria para el resultado
y el estado, y un arreglo de longitud suficiente. Conserva la propiedad de su
memoria durante la llamada. El adaptador no puede comprobar el tamaño físico
del arreglo a partir de un puntero C.

El Makefile expresa el orden de compilación de los módulos. `make clean`
elimina solo sus productos de compilación. Para cambiar de compilador o de
opciones, ejecuta primero `make clean` y vuelve a construir. No distribuyas
archivos `.mod` como sustitutos del código fuente.

En el repositorio principal, `python3 scripts/verificar-proyecto-fortran.py`
comprueba además entradas de terminal inválidas y una mutación de la fórmula.
