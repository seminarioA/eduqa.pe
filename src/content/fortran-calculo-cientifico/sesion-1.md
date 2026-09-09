---
numero: 1
titulo: "Arreglos, secciones y asignación enmascarada"
---

# Objetivos y preparación

Cada bloque es un programa independiente. Compílalo con `gfortran -std=f2018 -Wall -Wextra -fcheck=all archivo.f90 -o programa` y ejecuta `./programa`. Las salidas se obtuvieron con GNU Fortran; los espacios y las últimas cifras pueden variar entre procesadores.

Al terminar podrás declarar arreglos con límites explícitos, razonar sobre rango, extensión, forma y tamaño, operar con arreglos completos, seleccionar secciones regulares o arbitrarias y modificar elementos mediante una máscara lógica.

# El modelo de un arreglo

Un arreglo reúne elementos del mismo tipo y *kind*. Su **rango** es el número de dimensiones. La **extensión** de una dimensión es su número de elementos. La **forma** es el vector ordenado de extensiones y el **tamaño** es el producto de todas ellas. Un escalar tiene rango cero.

En una declaración, cada par `inferior:superior` fija los límites de una dimensión. El signo de dos puntos (`:`) separa ambos límites. Si se omite el límite inferior, Fortran adopta `1`. Los límites pueden ser negativos o cero; no forman parte de la forma, porque `temperatura(-2:2)` y `temperatura(1:5)` tienen la misma forma de cinco elementos.

```fortran
program geometria_arreglo
  implicit none
  real :: temperatura(-2:2)
  real, dimension(3, 4) :: campo

  temperatura = 18.0
  campo = 0.0

  print *, rank(temperatura), shape(temperatura), size(temperatura)
  print *, lbound(campo), ubound(campo), shape(campo), size(campo)
end program geometria_arreglo
```

```salida
           1           5           5
           1           1           3           4           3           4          12
```

> Doc: [Documentación de Fortran-lang](https://fortran-lang.org/learn/quickstart/arrays_strings/)

`SHAPE` devuelve las extensiones, `SIZE` devuelve el número total de elementos y `LBOUND` y `UBOUND` devuelven los límites inferior y superior. `RANK` no pertenece a Fortran 90: la primera versión requiere un estándar posterior. En Fortran 90, el rango se conoce por la declaración y puede comprobarse indirectamente mediante el tamaño de `SHAPE`.

El ejemplo anterior incluye `rank`, por tanto requiere un estándar posterior. La variante estrictamente Fortran 90 es la siguiente:

```fortran
program geometria_fortran_90
  implicit none
  real :: temperatura(-2:2)
  real, dimension(3, 4) :: campo

  temperatura = 18.0
  campo = 0.0

  print *, size(shape(temperatura)), shape(temperatura), size(temperatura)
  print *, lbound(campo), ubound(campo), shape(campo), size(campo)
end program geometria_fortran_90
```

```salida
           1           5           5
           1           1           3           4           3           4          12
```

> Doc: [Documentación de Fortran-lang](https://fortran-lang.org/learn/quickstart/arrays_strings/)

> Nota: las funciones de consulta no necesitan leer los valores de los elementos para determinar límites, forma o tamaño. Aun así, inicializar los arreglos evita que un cambio posterior del ejemplo lea datos indefinidos.

# Constructores y orden de almacenamiento

Un constructor de arreglo de Fortran 90 se delimita con `(/` y `/)`. Todos sus elementos deben tener tipo y *kind* compatibles. `RESHAPE` reorganiza una secuencia unidimensional con la forma indicada en su segundo argumento.

Fortran ordena los elementos variando primero el primer subíndice. En una matriz, los elementos de una columna son contiguos antes que los de la columna siguiente. Esta convención se denomina orden por columnas y determina cómo `RESHAPE` distribuye los valores.

```fortran
program construir_matriz
  implicit none
  real :: conductividad(2, 3)

  conductividad = reshape((/ 1.0, 2.0, 3.0, 4.0, 5.0, 6.0 /), &
                          (/ 2, 3 /))

  print *, conductividad(:, 1)
  print *, conductividad(:, 2)
  print *, conductividad(:, 3)
end program construir_matriz
```

```salida
   1.00000000       2.00000000    
   3.00000000       4.00000000    
   5.00000000       6.00000000
```

> Doc: [Documentación de Fortran-lang](https://fortran-lang.org/learn/quickstart/arrays_strings/)

En esta matriz, la primera columna recibe `1.0` y `2.0`; la segunda recibe `3.0` y `4.0`; la tercera recibe `5.0` y `6.0`. El operador de continuación (`&`) al final de una línea indica que la sentencia continúa en la línea siguiente.

> Nota: el orden por columnas afecta la localidad de memoria. En bucles anidados, hacer variar el primer índice en el bucle interior suele recorrer posiciones contiguas. La sesión usa operaciones de arreglo siempre que expresen la operación con claridad y reserva los bucles para algoritmos cuyo orden sí sea significativo.

# Operaciones con arreglos completos

Una referencia sin subíndices, como `presion`, designa el arreglo completo. Los operadores aritméticos (`+`, `-`, `*`, `/` y `**`) aplicados a arreglos conformables actúan elemento por elemento. La multiplicación `*` entre matrices no es producto matricial; sigue siendo multiplicación elemento a elemento.

Dos arreglos son **conformables** si tienen la misma forma. Un escalar puede combinarse con un arreglo: el procesador aplica el escalar a cada elemento. Una asignación entre arreglos exige conformabilidad entre el lado izquierdo y el resultado del lado derecho.

```fortran
program balance_termico
  implicit none
  real :: inicial(4), final(4), cambio(4), relativo(4)

  inicial = (/ 280.0, 285.0, 290.0, 295.0 /)
  final   = (/ 282.0, 284.0, 294.0, 300.0 /)

  cambio = final - inicial
  relativo = cambio / inicial

  print *, cambio
  print *, relativo
end program balance_termico
```

```salida
   2.00000000      -1.00000000       4.00000000       5.00000000    
   7.14285718E-03  -3.50877200E-03   1.37931034E-02   1.69491526E-02
```

> Doc: [Documentación de Fortran-lang](https://fortran-lang.org/learn/quickstart/arrays_strings/)

El operador de división (`/`) de `cambio / inicial` divide pares de elementos. No debe confundirse con los caracteres `/)` que cierran un constructor de arreglo.

Las funciones intrínsecas de reducción resumen un arreglo completo o una dimensión. `SUM` suma, `PRODUCT` multiplica, `MINVAL` y `MAXVAL` buscan valores extremos, `COUNT` cuenta elementos verdaderos, `ANY` comprueba si existe alguno verdadero y `ALL` comprueba si todos son verdaderos.

```fortran
program diagnostico_mediciones
  implicit none
  real :: residuo(5)
  logical :: aceptable(5)

  residuo = (/ -0.02, 0.01, 0.08, -0.03, 0.00 /)
  aceptable = abs(residuo) <= 0.05

  print *, sum(residuo)
  print *, maxval(abs(residuo))
  print *, count(aceptable)
  print *, all(aceptable), any(residuo > 0.0)
end program diagnostico_mediciones
```

```salida
   3.99999991E-02
   7.99999982E-02
           4
 F T
```

> Doc: [Documentación de Fortran-lang](https://fortran-lang.org/learn/quickstart/arrays_strings/)

`ABS` es elemental: si recibe un arreglo, produce un arreglo de la misma forma. `MAXVAL`, en cambio, es transformacional: sin argumento `DIM` reduce todos los elementos a un escalar.

# Secciones mediante tripletes

Una sección selecciona parte de un arreglo sin dejar de ser un arreglo. El triplete de subíndices tiene la forma `inicio:fin:paso`. Si se omite `inicio`, se usa el límite inferior declarado; si se omite `fin`, se usa el límite superior; si se omite `paso`, su valor es `1`. El paso no puede ser cero.

```fortran
program secciones_regulares
  implicit none
  integer :: muestra(8)

  muestra = (/ 10, 20, 30, 40, 50, 60, 70, 80 /)

  print *, muestra(2:6)
  print *, muestra(1:8:2)
  print *, muestra(8:2:-2)
  print *, muestra(:4)
  print *, muestra(5:)
end program secciones_regulares
```

```salida
          20          30          40          50          60
          10          30          50          70
          80          60          40          20
          10          20          30          40
          50          60          70          80
```

> Doc: [Documentación de Fortran-lang](https://fortran-lang.org/learn/quickstart/arrays_strings/)

Un paso positivo selecciona índices crecientes que no superan `fin`. Un paso negativo selecciona índices decrecientes que no bajan de `fin`. Si los límites y el signo del paso no permiten seleccionar ningún índice, la sección tiene tamaño cero; la sección sigue siendo válida.

En varias dimensiones, un subíndice escalar elimina esa dimensión de la sección. Un triplete la conserva. Así, `campo(:, 2)` es un vector formado por la segunda columna, mientras que `campo(2, :)` es un vector formado por la segunda fila.

```fortran
program cortes_de_campo
  implicit none
  real :: campo(3, 4)

  campo = reshape((/ 1.0, 2.0, 3.0, 4.0, 5.0, 6.0, &
                     7.0, 8.0, 9.0, 10.0, 11.0, 12.0 /), (/ 3, 4 /))

  campo(:, 2) = 0.0
  campo(1:3:2, 3:4) = -1.0

  print *, campo
end program cortes_de_campo
```

```salida
   1.00000000       2.00000000       3.00000000       0.00000000       0.00000000       0.00000000      -1.00000000       8.00000000      -1.00000000      -1.00000000       11.0000000      -1.00000000
```

> Doc: [Documentación de Fortran-lang](https://fortran-lang.org/learn/quickstart/arrays_strings/)

> Nota: una sección con paso distinto de uno puede no ocupar memoria contigua. Una operación intrínseca puede procesarla directamente, pero el paso a ciertos procedimientos puede requerir un temporal. La sesión 3 explica cómo los argumentos de forma asumida y las interfaces explícitas representan estas secciones.

# Secciones mediante vectores de subíndices

Un vector de subíndices es un arreglo entero de rango uno. Permite seleccionar posiciones en cualquier orden, no solo una progresión regular.

```fortran
program estaciones_seleccionadas
  implicit none
  real :: concentracion(6)
  integer :: estaciones(3)

  concentracion = (/ 0.12, 0.18, 0.11, 0.25, 0.16, 0.09 /)
  estaciones = (/ 4, 1, 5 /)

  print *, concentracion(estaciones)
end program estaciones_seleccionadas
```

```salida
  0.250000000      0.119999997      0.159999996
```

> Doc: [Documentación de Fortran-lang](https://fortran-lang.org/learn/quickstart/arrays_strings/)

Los valores del vector deben estar dentro de los límites del arreglo. En el lado derecho, un índice puede repetirse. En el lado izquierdo de una asignación, una sección con índices repetidos no es válida, porque un mismo elemento recibiría más de un valor sin que el estándar fije un orden.

```fortran
program actualizacion_disjunta
  implicit none
  real :: calibracion(6)
  integer :: sensores(3)

  calibracion = 1.0
  sensores = (/ 2, 4, 6 /)
  calibracion(sensores) = (/ 0.98, 1.03, 1.01 /)

  print *, calibracion
end program actualizacion_disjunta
```

```salida
   1.00000000      0.980000019       1.00000000       1.02999997       1.00000000       1.00999999
```

> Doc: [Documentación de Fortran-lang](https://fortran-lang.org/learn/quickstart/arrays_strings/)

# Asignación solapada

En una asignación intrínseca, Fortran determina el valor completo del lado derecho antes de definir el lado izquierdo. Esta regla permite desplazar datos dentro del mismo arreglo sin destruir valores que todavía se necesitan.

```fortran
program desplazar_serie
  implicit none
  real :: serie(6)

  serie = (/ 2.0, 4.0, 6.0, 8.0, 10.0, 12.0 /)
  serie(2:6) = serie(1:5)

  print *, serie
end program desplazar_serie
```

```salida
   2.00000000       2.00000000       4.00000000       6.00000000       8.00000000       10.0000000
```

> Doc: [Documentación de Fortran-lang](https://fortran-lang.org/learn/quickstart/arrays_strings/)

La sentencia no equivale necesariamente a un bucle ascendente que asigna elemento por elemento. El modelo de evaluación protege el valor original de `serie(1:5)` durante la asignación.

# Máscaras lógicas y WHERE

Una expresión relacional de arreglos produce un arreglo lógico conformable. Los seis operadores relacionales modernos son igual (`==`), distinto (`/=`), menor (`<`), menor o igual (`<=`), mayor (`>`) y mayor o igual (`>=`). `WHERE` usa un arreglo lógico como máscara y restringe una asignación a las posiciones verdaderas.

```fortran
program limitar_senal
  implicit none
  real :: senal(7)

  senal = (/ -1.4, -0.8, -0.2, 0.0, 0.3, 0.9, 1.5 /)

  where (senal < -1.0)
    senal = -1.0
  elsewhere
    where (senal > 1.0)
      senal = 1.0
    end where
  end where

  print *, senal
end program limitar_senal
```

```salida
  -1.00000000     -0.800000012     -0.200000003       0.00000000      0.300000012      0.899999976       1.00000000
```

> Doc: [Documentación de Fortran-lang](https://fortran-lang.org/learn/quickstart/arrays_strings/)

El `WHERE` exterior selecciona los valores menores que `-1.0`. El `ELSEWHERE` selecciona el complemento de esa máscara; dentro de ese complemento, el `WHERE` anidado limita los valores mayores que `1.0`. Todas las asignaciones del constructo se consideran en secuencia, pero cada una solo define los elementos habilitados por su máscara efectiva.

Fortran 90 también admite una sentencia `WHERE` de una sola línea cuando solo hay una asignación.

```fortran
program corregir_ceros
  implicit none
  real :: magnitud(5), inversa(5)

  magnitud = (/ 2.0, 0.0, -4.0, 0.5, 0.0 /)
  inversa = 0.0
  where (magnitud /= 0.0) inversa = 1.0 / magnitud

  print *, inversa
end program corregir_ceros
```

```salida
  0.500000000       0.00000000     -0.250000000       2.00000000       0.00000000
```

> Doc: [Documentación de Fortran-lang](https://fortran-lang.org/learn/quickstart/arrays_strings/)

La evaluación elemental de la división se limita a las posiciones verdaderas de la máscara, de modo que los ceros no se usan como divisores. Esta garantía no se extiende de la misma manera a una función no elemental: una función transformacional puede evaluarse por completo antes de que la máscara seleccione elementos de su resultado.

> Nota: no conviene comparar resultados calculados en punto flotante con cero o entre sí mediante igualdad exacta cuando interviene error de redondeo. La comparación exacta del ejemplo es adecuada porque los valores se inicializan como constantes que incluyen ceros deliberados. Para resultados numéricos, se compara `abs(valor) <= tolerancia` con una tolerancia definida por el problema.

# Patrón científico: depurar y resumir observaciones

El siguiente programa combina operaciones completas, una máscara, una reducción y una sección. Cada paso mantiene visible la intención matemática.

```fortran
program resumen_observaciones
  implicit none
  real, parameter :: ausente = -999.0
  real :: observacion(8), limpia(8), media
  logical :: valida(8)
  integer :: n_validas

  observacion = (/ 12.1, 12.4, ausente, 12.0, 11.8, ausente, 12.3, 12.2 /)
  valida = observacion /= ausente
  n_validas = count(valida)

  limpia = 0.0
  where (valida) limpia = observacion
  media = sum(limpia) / real(n_validas)

  print *, n_validas, media
  print *, observacion(1:8:2)
end program resumen_observaciones
```

```salida
           6   12.1333323    
   12.1000004      -999.000000       11.8000002       12.3000002
```

> Doc: [Documentación de Fortran-lang](https://fortran-lang.org/learn/quickstart/arrays_strings/)

La conversión `REAL(n_validas)` evita una división entera. Antes de dividir, un programa de producción debe comprobar que `n_validas` sea mayor que cero. La máscara separa el criterio de validez de la operación de reducción y permite reutilizarlo con `COUNT`, `WHERE`, `MINVAL` o `MAXVAL`.

# Práctica: Invertir una sección

Invierte cuatro mediciones utilizando un triplete con paso negativo. Conserva la comprobación de todos los elementos para detectar un cambio de recorrido.

La solución de referencia incluye la comprobación. El comentario `verificar-error` identifica una alteración deliberada que el verificador debe rechazar.

```fortran
program practica_inversion
  implicit none
  integer :: serie(4) = [10, 20, 30, 40]
  integer :: invertida(4)
  ! verificar-error: serie(4:1:-1) => serie(1:4)
  invertida = serie(4:1:-1)
  if (any(invertida /= [40, 30, 20, 10])) error stop 'Orden incorrecto'
  write(*,'(4(I0,1X))') invertida
end program practica_inversion
```

```salida
40 30 20 10
```

> Doc: [Documentación de Fortran-lang](https://fortran-lang.org/learn/quickstart/arrays_strings/)

# Ejercicio en el navegador

Completa el programa y pulsa «Comprobar». El código se compila y ejecuta en tu navegador; cada intento comienza desde cero.

```ejercicio fortran
# Enunciado
Completa la operación que falta para que el programa cumpla las comprobaciones de esta sesión.
# Plantilla
program practica_inversion
  implicit none
  integer :: serie(4) = [10, 20, 30, 40]
  integer :: invertida(4)
  invertida = ___
  if (any(invertida /= [40, 30, 20, 10])) error stop 'Orden incorrecto'
  write(*,'(4(I0,1X))') invertida
end program practica_inversion
# Esperado
40 30 20 10
# Pista
Revisa la práctica resuelta de esta sesión y las condiciones que comprueba antes de imprimir la salida.
```

# Cierre

Esta sesión cubrió el modelo completo de los arreglos de Fortran 90: rango, extensiones, forma, tamaño y límites; constructores y orden por columnas; operaciones elementales y reducciones; secciones con tripletes y vectores; asignación solapada; y selección mediante `WHERE`. La sesión 2 emplea estas reglas con arreglos cuyo tamaño se decide durante la ejecución, define precisión numérica portable y distingue las operaciones elemento a elemento de los productos vectoriales y matriciales.
