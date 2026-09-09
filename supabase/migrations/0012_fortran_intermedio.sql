-- Generado desde los Markdown. Aplicar como una sola transacción.

-- Conserva precio, estado, acceso y matrículas de cursos existentes.

begin;

insert into public.rutas (slug, nombre, descripcion, orden) values ('programacion-fortran', 'Programación Fortran', 'Aprende Fortran desde cero y avanza hacia programación avanzada y desarrollo de software con pruebas, archivos e interoperabilidad.', 3) on conflict (slug) do update set nombre=excluded.nombre, descripcion=excluded.descripcion, orden=excluded.orden;

insert into public.cursos (slug, titulo, resumen, precio, estado, acceso_libre, orden, ruta, posicion, requisitos) values ('fortran-calculo-cientifico', 'Fortran intermedio', 'Arreglos, memoria dinámica, precisión portable, procedimientos, módulos, tipos derivados y archivos aplicados a programas numéricos verificables.', 20, 'publico', false, 16, 'programacion-fortran', 2, array['fortran-fundamentos']::text[]) on conflict (slug) do update set titulo=excluded.titulo, resumen=excluded.resumen, orden=excluded.orden, ruta=excluded.ruta, posicion=excluded.posicion, requisitos=excluded.requisitos, actualizado_en=now();

insert into public.curso_contenido (curso_slug, archivo, contenido) values ('fortran-calculo-cientifico', 'curso.md', '---
slug: fortran-calculo-cientifico
titulo: "Fortran intermedio"
resumen: "Arreglos, memoria dinámica, precisión portable, procedimientos, módulos, tipos derivados y archivos aplicados a programas numéricos verificables."
area: "Lenguajes"
nivel: INTERMEDIO
horas: 16
icono: fortran
precio: 20
estado: publico
acceso_libre: false
orden: 16
ruta:
  slug: programacion-fortran
  nombre: "Programación Fortran"
  descripcion: "Aprende Fortran desde cero y avanza hacia programación avanzada y desarrollo de software con pruebas, archivos e interoperabilidad."
  orden: 3
  posicion: 2
  requisitos: ["fortran-fundamentos"]
---
') on conflict (curso_slug, archivo) do update set contenido=excluded.contenido, actualizado_en=now();

insert into public.curso_contenido (curso_slug, archivo, contenido) values ('fortran-calculo-cientifico', 'sesion-1.md', '---
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
  if (any(invertida /= [40, 30, 20, 10])) error stop ''Orden incorrecto''
  write(*,''(4(I0,1X))'') invertida
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
  if (any(invertida /= [40, 30, 20, 10])) error stop ''Orden incorrecto''
  write(*,''(4(I0,1X))'') invertida
end program practica_inversion
# Esperado
40 30 20 10
# Pista
Revisa la práctica resuelta de esta sesión y las condiciones que comprueba antes de imprimir la salida.
```

# Cierre

Esta sesión cubrió el modelo completo de los arreglos de Fortran 90: rango, extensiones, forma, tamaño y límites; constructores y orden por columnas; operaciones elementales y reducciones; secciones con tripletes y vectores; asignación solapada; y selección mediante `WHERE`. La sesión 2 emplea estas reglas con arreglos cuyo tamaño se decide durante la ejecución, define precisión numérica portable y distingue las operaciones elemento a elemento de los productos vectoriales y matriciales.
') on conflict (curso_slug, archivo) do update set contenido=excluded.contenido, actualizado_en=now();

insert into public.curso_contenido (curso_slug, archivo, contenido) values ('fortran-calculo-cientifico', 'sesion-2.md', '---
numero: 2
titulo: "Memoria dinámica, precisión portable y cálculo matricial"
---

# Objetivos y preparación

Cada bloque es un programa independiente. Compílalo con `gfortran -std=f2018 -Wall -Wextra -fcheck=all archivo.f90 -o programa` y ejecuta `./programa`. Las salidas se obtuvieron con GNU Fortran; los espacios y las últimas cifras pueden variar entre procesadores.

Al terminar podrás reservar y liberar arreglos cuyo tamaño se conoce durante la ejecución, solicitar una representación real por requisitos decimales, construir constantes del mismo *kind* que las variables y expresar productos escalares y matriciales con comprobaciones de dimensiones.

# Arreglos de forma diferida

El atributo `ALLOCATABLE` declara un arreglo dinámico administrado por el programa. La declaración fija el tipo, el *kind* y el rango, pero deja cada extensión pendiente mediante dos puntos (`:`). Por eso `real, allocatable :: temperaturas(:,:)` siempre tendrá rango dos, aunque sus límites y su forma se decidirán al ejecutar `ALLOCATE`.

```fortran
program malla_dinamica
  implicit none
  real, allocatable :: temperatura(:,:)
  integer :: filas, columnas, estado

  filas = 120
  columnas = 80
  allocate(temperatura(filas, columnas), stat=estado)

  if (estado /= 0) stop ''No se pudo reservar la malla''
  temperatura = 273.15

  print *, shape(temperatura), size(temperatura)

  deallocate(temperatura, stat=estado)
  if (estado /= 0) stop ''No se pudo liberar la malla''
end program malla_dinamica
```

```salida
         120          80        9600
```

> Doc: [Documentación de Fortran-lang](https://fortran-lang.org/learn/best_practices/allocatable_arrays/)

`ALLOCATE` reserva almacenamiento y establece límites, forma y tamaño. El especificador `STAT=` recibe cero cuando la operación termina correctamente y un valor positivo dependiente del procesador si falla. Sin `STAT=`, un error de asignación termina el programa. `DEALLOCATE` libera el almacenamiento; después de la liberación, el arreglo no puede leerse ni definirse hasta una nueva reserva.

> Nota: `STAT=` permite detectar el fallo, pero no describe su causa de manera portable en Fortran 90. Conviene incluir en el diagnóstico las dimensiones solicitadas y la fase del cálculo, datos que sí controla el programa.

# Estado de asignación y ciclo de vida

`ALLOCATED(arreglo)` devuelve un valor lógico que indica si un arreglo asignable tiene almacenamiento. En Fortran 90, intentar reservar un arreglo ya asignado o liberar uno no asignado es un error. Consultar el estado evita que las rutas alternativas de un algoritmo ejecuten una operación inválida.

```fortran
program reutilizar_vector
  implicit none
  real, allocatable :: espectro(:)
  integer :: estado

  allocate(espectro(256), stat=estado)
  if (estado /= 0) stop ''Fallo al reservar el primer espectro''
  espectro = 0.0

  if (allocated(espectro)) then
    deallocate(espectro, stat=estado)
    if (estado /= 0) stop ''Fallo al liberar el primer espectro''
  end if

  allocate(espectro(0:511), stat=estado)
  if (estado /= 0) stop ''Fallo al reservar el segundo espectro''
  espectro = 0.0

  print *, lbound(espectro), ubound(espectro), size(espectro)

  deallocate(espectro)
end program reutilizar_vector
```

```salida
           0         511         512
```

> Doc: [Documentación de Fortran-lang](https://fortran-lang.org/learn/best_practices/allocatable_arrays/)

La segunda reserva usa límites `0:511`. Omitir el límite inferior habría producido `1:512`: ambos arreglos tendrían 512 elementos, pero sus índices válidos serían distintos.

En Fortran 90, la asignación intrínseca a un arreglo `ALLOCATABLE` no reserva memoria ni cambia su forma automáticamente. Antes de `destino = fuente`, `destino` debe estar asignado y ser conformable con `fuente`. La reasignación automática de asignables corresponde a revisiones posteriores del lenguaje.

```fortran
program copia_dinamica_fortran_90
  implicit none
  real, allocatable :: origen(:), destino(:)
  integer :: estado

  allocate(origen(4), destino(4), stat=estado)
  if (estado /= 0) stop ''Fallo al reservar los vectores''

  origen = (/ 1.5, 2.5, 3.5, 4.5 /)
  destino = origen

  print *, destino

  deallocate(origen, destino)
end program copia_dinamica_fortran_90
```

```salida
   1.50000000       2.50000000       3.50000000       4.50000000
```

> Doc: [Documentación de Fortran-lang](https://fortran-lang.org/learn/best_practices/allocatable_arrays/)

# Reserva condicionada por los datos

Una estrategia robusta separa tres fases: obtener o validar las dimensiones, reservar y comprobar, y recién entonces calcular. El tamaño nunca debe usarse para dimensionar memoria antes de verificar que sea admisible para el problema.

```fortran
program perfil_variable
  implicit none
  integer, parameter :: max_niveles = 100000
  integer :: niveles, estado
  real, allocatable :: altura(:), densidad(:)

  niveles = 500
  if (niveles < 2 .or. niveles > max_niveles) then
    stop ''Numero de niveles fuera del intervalo permitido''
  end if

  allocate(altura(niveles), densidad(niveles), stat=estado)
  if (estado /= 0) stop ''Fallo al reservar el perfil''

  altura = 0.0
  densidad = 0.0

  print *, size(altura), size(densidad)

  deallocate(altura, densidad)
end program perfil_variable
```

```salida
         500         500
```

> Doc: [Documentación de Fortran-lang](https://fortran-lang.org/learn/best_practices/allocatable_arrays/)

El operador lógico `.OR.` combina las dos condiciones inválidas. Establecer un máximo no sustituye la comprobación de `STAT=`, pero impide que una entrada absurda se convierta directamente en una petición de memoria.

# Qué significa kind

Cada tipo intrínseco puede tener varias representaciones, identificadas por un parámetro entero denominado **parámetro de clase** o *kind*. El valor numérico de un *kind* depende del procesador: no debe suponerse que `8` significa siempre 64 bits ni que coincide entre compiladores.

`SELECTED_REAL_KIND(p, r)` solicita un *kind* real con al menos `p` dígitos decimales de precisión y un intervalo de exponentes decimales de al menos `10^-r` a `10^r`. La función devuelve un valor válido si el procesador ofrece esa representación; devuelve un valor negativo si no puede satisfacer los requisitos.

```fortran
program consultar_precision
  implicit none
  integer, parameter :: rk = selected_real_kind(12, 100)

  if (rk < 0) stop ''El procesador no ofrece la precision solicitada''

  print *, rk
end program consultar_precision
```

```salida
           8
```

> Doc: [Documentación de Fortran-lang](https://fortran-lang.org/learn/best_practices/allocatable_arrays/)

El argumento `p` describe dígitos significativos; el argumento `r` describe alcance del exponente. No son número de bytes ni número de bits. Pedir más precisión de la necesaria puede aumentar memoria y tiempo sin mejorar una respuesta limitada por los datos o por el método numérico.

> Nota: el valor negativo distingue requisitos no disponibles, pero el código no debe usar ese valor como parámetro de tipo. Cuando la disponibilidad sea una condición de despliegue, se comprueba durante la configuración o compilación; el programa científico documenta los requisitos que motivan `p` y `r`.

# Variables y constantes del mismo kind

El selector `real(kind=rk)` declara variables de la representación elegida. Una constante real sin sufijo conserva el *kind* real por omisión, aunque se asigne después a una variable de mayor precisión. El sufijo `_rk` hace que la constante se construya directamente con el *kind* solicitado.

```fortran
program constantes_portables
  implicit none
  integer, parameter :: rk = selected_real_kind(12, 100)
  real(kind=rk), parameter :: pi = &
    3.1415926535897932384626433832795_rk
  real(kind=rk) :: radio, area

  radio = 2.75_rk
  area = pi * radio**2

  print *, area
end program constantes_portables
```

```salida
   23.758294442772812
```

> Doc: [Documentación de Fortran-lang](https://fortran-lang.org/learn/best_practices/allocatable_arrays/)

El operador de potencia (`**`) eleva `radio` al exponente entero `2`. El sufijo del literal se escribe después del valor, como `2.75_rk`. En una conversión explícita, `REAL(entero, kind=rk)` produce un valor real del *kind* elegido.

```fortran
program media_portable
  implicit none
  integer, parameter :: rk = selected_real_kind(12, 100)
  real(kind=rk) :: muestras(4), media

  muestras = (/ 0.1_rk, 0.2_rk, 0.3_rk, 0.4_rk /)
  media = sum(muestras) / real(size(muestras), kind=rk)

  print *, media
end program media_portable
```

```salida
  0.25000000000000000
```

> Doc: [Documentación de Fortran-lang](https://fortran-lang.org/learn/best_practices/allocatable_arrays/)

`KIND`, `PRECISION`, `RANGE`, `EPSILON`, `TINY` y `HUGE` permiten consultar la representación seleccionada. `EPSILON(valor)` mide la separación relativa del modelo cerca de uno; no es una tolerancia universal para comparar cualquier magnitud.

```fortran
program entorno_numerico
  implicit none
  integer, parameter :: rk = selected_real_kind(12, 100)
  real(kind=rk) :: referencia

  referencia = 1.0_rk
  print *, kind(referencia)
  print *, precision(referencia), range(referencia)
  print *, epsilon(referencia), tiny(referencia), huge(referencia)
end program entorno_numerico
```

```salida
           8
          15         307
   2.2204460492503131E-016   2.2250738585072014E-308   1.7976931348623157E+308
```

> Doc: [Documentación de Fortran-lang](https://fortran-lang.org/learn/best_practices/allocatable_arrays/)

# Tolerancias ligadas a escala

Una comparación numérica suele necesitar una parte absoluta y otra relativa. La parte absoluta protege valores próximos a cero; la relativa se adapta a la magnitud de los operandos. La expresión siguiente ilustra el criterio, pero sus coeficientes deben justificarse según el algoritmo y los datos.

```fortran
program comparar_resultados
  implicit none
  integer, parameter :: rk = selected_real_kind(12, 100)
  real(kind=rk) :: calculado, referencia, tolerancia
  logical :: coincide

  calculado = 0.3000000000001_rk
  referencia = 0.3_rk
  tolerancia = 10.0_rk * epsilon(1.0_rk) * &
               max(1.0_rk, abs(calculado), abs(referencia))
  coincide = abs(calculado - referencia) <= tolerancia

  print *, coincide, tolerancia
end program comparar_resultados
```

```salida
 F   2.2204460492503131E-015
```

> Doc: [Documentación de Fortran-lang](https://fortran-lang.org/learn/best_practices/allocatable_arrays/)

`MAX` compara los argumentos escalares y devuelve el mayor. El factor `10.0_rk` no es una regla del lenguaje: representa una decisión numérica que debe sustituirse por un análisis de error cuando la precisión del resultado sea crítica.

# Producto escalar

`DOT_PRODUCT(a, b)` calcula el producto escalar de dos vectores del mismo tamaño. Para vectores reales, suma los productos de componentes correspondientes. El resultado es escalar.

```fortran
program trabajo_mecanico
  implicit none
  integer, parameter :: rk = selected_real_kind(12, 100)
  real(kind=rk) :: fuerza(3), desplazamiento(3), trabajo

  fuerza = (/ 12.0_rk, -3.0_rk, 4.0_rk /)
  desplazamiento = (/ 0.5_rk, 2.0_rk, -1.0_rk /)

  trabajo = dot_product(fuerza, desplazamiento)

  print *, trabajo
end program trabajo_mecanico
```

```salida
  -4.0000000000000000
```

> Doc: [Documentación de Fortran-lang](https://fortran-lang.org/learn/best_practices/allocatable_arrays/)

`DOT_PRODUCT` exige argumentos de rango uno y tamaños iguales. Para datos complejos, la definición incluye la conjugación del primer vector; esta diferencia importa en espacios vectoriales complejos.

# Producto matricial

`MATMUL(a, b)` expresa multiplicación de matrices. Si ambos argumentos tienen rango dos, el número de columnas de `a` debe coincidir con el número de filas de `b`; el resultado tiene tantas filas como `a` y tantas columnas como `b`. También admite matriz por vector y vector por matriz.

```fortran
program propagacion_lineal
  implicit none
  integer, parameter :: rk = selected_real_kind(12, 100)
  real(kind=rk) :: operador(3, 3), estado(3), siguiente(3)

  operador = reshape((/ &
    0.8_rk, 0.1_rk, 0.0_rk, &
    0.2_rk, 0.7_rk, 0.3_rk, &
    0.0_rk, 0.2_rk, 0.7_rk  &
  /), (/ 3, 3 /))
  estado = (/ 10.0_rk, 5.0_rk, 2.0_rk /)

  if (size(operador, 2) /= size(estado)) then
    stop ''Dimensiones incompatibles en MATMUL''
  end if
  siguiente = matmul(operador, estado)

  print *, siguiente
end program propagacion_lineal
```

```salida
   9.0000000000000000        4.9000000000000004        2.8999999999999999
```

> Doc: [Documentación de Fortran-lang](https://fortran-lang.org/learn/best_practices/allocatable_arrays/)

`SIZE(operador, 2)` consulta la extensión de la segunda dimensión. La comprobación documenta la precondición algebraica aunque las formas sean fijas en este ejemplo.

La expresión `a * b` no sustituye a `MATMUL(a, b)`. Si `a` y `b` son matrices conformables, `a * b` multiplica cada par de elementos; `MATMUL` combina filas y columnas mediante sumas de productos.

# Traspuesta y productos de Gram

`TRANSPOSE(matriz)` intercambia las dos dimensiones de una matriz. Una aplicación frecuente es el producto de Gram `A^T A`, que resulta cuadrado con orden igual al número de columnas de `A`.

```fortran
program matriz_de_gram
  implicit none
  integer, parameter :: rk = selected_real_kind(12, 100)
  real(kind=rk) :: diseno(4, 2), gram(2, 2)

  diseno = reshape((/ &
    1.0_rk, 1.0_rk, 1.0_rk, 1.0_rk, &
    0.0_rk, 1.0_rk, 2.0_rk, 3.0_rk  &
  /), (/ 4, 2 /))

  gram = matmul(transpose(diseno), diseno)

  print *, gram
end program matriz_de_gram
```

```salida
   4.0000000000000000        6.0000000000000000        6.0000000000000000        14.000000000000000
```

> Doc: [Documentación de Fortran-lang](https://fortran-lang.org/learn/best_practices/allocatable_arrays/)

`TRANSPOSE` solo acepta rango dos. No modifica `diseno`: produce un valor matricial nuevo que `MATMUL` consume como primer argumento.

# Matrices dinámicas con comprobación de conformidad

El siguiente programa combina forma diferida, precisión portable y cálculo matricial. Las dimensiones se validan antes de reservar el resultado y antes de ejecutar el producto.

```fortran
program producto_dinamico
  implicit none
  integer, parameter :: rk = selected_real_kind(12, 100)
  integer :: m, k, n, estado
  real(kind=rk), allocatable :: a(:,:), b(:,:), c(:,:)

  m = 40
  k = 25
  n = 10

  if (m < 1 .or. k < 1 .or. n < 1) then
    stop ''Todas las dimensiones deben ser positivas''
  end if

  allocate(a(m, k), b(k, n), c(m, n), stat=estado)
  if (estado /= 0) stop ''Fallo al reservar las matrices''

  a = 0.0_rk
  b = 0.0_rk
  a(:, 1) = 1.0_rk
  b(1, :) = 2.0_rk

  if (size(a, 2) /= size(b, 1)) then
    stop ''Dimensiones internas incompatibles''
  end if
  c = matmul(a, b)

  print *, shape(c), maxval(abs(c))

  deallocate(a, b, c)
end program producto_dinamico
```

```salida
          40          10   2.0000000000000000
```

> Doc: [Documentación de Fortran-lang](https://fortran-lang.org/learn/best_practices/allocatable_arrays/)

Los arreglos tienen las formas exactas requeridas antes de la asignación `c = matmul(a, b)`. Esta disciplina es obligatoria en Fortran 90, donde la asignación no redimensiona automáticamente un arreglo asignable.

# Práctica: Reservar y liberar memoria

Reserva un arreglo a partir de una cantidad, asigna sus valores, comprueba su tamaño y libera la reserva. Consulta allocated después de liberar para comprobar su estado.

La solución de referencia incluye la comprobación. El comentario `verificar-error` identifica una alteración deliberada que el verificador debe rechazar.

```fortran
program practica_reserva
  implicit none
  real, allocatable :: mediciones(:)
  integer :: cantidad, estado
  cantidad = 3
  ! verificar-error: allocate(mediciones(cantidad) => allocate(mediciones(cantidad+1)
  allocate(mediciones(cantidad), stat=estado)
  if (estado /= 0) error stop ''Reserva fallida''
  mediciones = 2.0
  if (size(mediciones) /= 3) error stop ''Tamano incorrecto''
  write(*,''(F4.1)'') sum(mediciones)
  deallocate(mediciones)
  if (allocated(mediciones)) error stop ''Reserva no liberada''
end program practica_reserva
```

```salida
 6.0
```

> Doc: [Documentación de Fortran-lang](https://fortran-lang.org/learn/best_practices/allocatable_arrays/)

# Ejercicio en el navegador

Completa el programa y pulsa «Comprobar». El código se compila y ejecuta en tu navegador; cada intento comienza desde cero.

```ejercicio fortran
# Enunciado
Completa la operación que falta para que el programa cumpla las comprobaciones de esta sesión.
# Plantilla
program practica_reserva
  implicit none
  real, allocatable :: mediciones(:)
  integer :: cantidad, estado
  cantidad = 3
  ___, stat=estado)
  if (estado /= 0) error stop ''Reserva fallida''
  mediciones = 2.0
  if (size(mediciones) /= 3) error stop ''Tamano incorrecto''
  write(*,''(F4.1)'') sum(mediciones)
  deallocate(mediciones)
  if (allocated(mediciones)) error stop ''Reserva no liberada''
end program practica_reserva
# Esperado
 6.0
# Pista
Revisa la práctica resuelta de esta sesión y las condiciones que comprueba antes de imprimir la salida.
```

# Cierre

Esta sesión cubrió el ciclo de vida de los arreglos `ALLOCATABLE`, la comprobación con `STAT=` y `ALLOCATED`, los límites dinámicos y la ausencia de reasignación automática en Fortran 90. También estableció precisión portable con `SELECTED_REAL_KIND`, constantes con sufijo de *kind*, consultas del modelo numérico, tolerancias dependientes de escala y las operaciones `DOT_PRODUCT`, `MATMUL` y `TRANSPOSE`. La sesión 3 encapsula estos cálculos en funciones y subrutinas con contratos explícitos, procedimientos puros y elementales, y módulos reutilizables.
') on conflict (curso_slug, archivo) do update set contenido=excluded.contenido, actualizado_en=now();

insert into public.curso_contenido (curso_slug, archivo, contenido) values ('fortran-calculo-cientifico', 'sesion-3.md', '---
numero: 3
titulo: "Procedimientos, interfaces explícitas y módulos"
---

# Objetivos y preparación

La lectura base principal es *Fortran 90 Handbook*, de Jeanne C. Adams, Walter S. Brainerd, Jeanne T. Martin, Brian T. Smith y Jerrold L. Wagener: capítulo 11, secciones 11.3–11.6 sobre procedimientos internos, asociación con el anfitrión, subprogramas externos y módulos (páginas 489–515); y capítulo 12, secciones 12.1–12.6 sobre subrutinas, funciones, asociación de argumentos e interfaces explícitas (páginas 522–587). Para `PURE` y `ELEMENTAL`, incorporados después de Fortran 90, la lectura secundaria es *Fortran for Scientists and Engineers*, cuarta edición, de Stephen J. Chapman: capítulo 9, sección 9.6, «Pure and Elemental Procedures» (páginas 434–436). Todos los ejemplos son originales.

Al terminar podrás separar un cálculo en funciones y subrutinas, declarar la intención de cada argumento, pasar arreglos de forma asumida, reconocer cuándo se necesita una interfaz explícita, limitar efectos laterales con `PURE`, aplicar una función escalar a arreglos mediante `ELEMENTAL` y publicar una API numérica desde un módulo.

# Función o subrutina

Una **función** devuelve un resultado y se referencia dentro de una expresión. Una **subrutina** ejecuta una operación y se invoca con `CALL`; puede comunicar varios resultados mediante argumentos. La elección debe reflejar el contrato: una transformación con un resultado natural suele ser función; una operación con varios resultados o un cambio deliberado de estado suele ser subrutina.

El atributo `INTENT` declara cómo usa el procedimiento un argumento ficticio:

- `INTENT(IN)` permite leerlo, pero no definirlo.
- `INTENT(OUT)` indica que el procedimiento debe producir su valor; el valor anterior no se conserva como entrada.
- `INTENT(INOUT)` permite leerlo y redefinirlo.

```fortran
program usar_norma
  implicit none
  real :: velocidad(3), magnitud

  velocidad = (/ 3.0, 4.0, 12.0 /)
  magnitud = norma_euclidea(velocidad)
  print *, magnitud

contains

  function norma_euclidea(vector) result(norma)
    implicit none
    real, intent(in) :: vector(:)
    real :: norma

    norma = sqrt(dot_product(vector, vector))
  end function norma_euclidea
end program usar_norma
```

```salida
   13.0000000
```

> Doc: [Documentación de Fortran-lang](https://fortran-lang.org/learn/quickstart/organising_code/)

`RESULT(norma)` da al resultado un nombre distinto del nombre de la función. La forma `vector(:)` es un argumento de forma asumida: el procedimiento recibe la extensión del argumento real. Como la función es interna, su interfaz es explícita dentro del programa anfitrión.

> Nota: un procedimiento interno puede acceder por asociación con el anfitrión a nombres declarados en el programa que lo contiene. Conviene pasar como argumentos los datos que forman parte del contrato y reservar la asociación con el anfitrión para constantes o contexto claramente compartido.

# Subrutinas con varios resultados

Una subrutina permite devolver varios valores con `INTENT(OUT)`. El procedimiento siguiente calcula media y norma residual de un vector sin depender de variables globales.

```fortran
program estadistica_basica
  implicit none
  real :: muestras(5), media, norma_residual

  muestras = (/ 1.0, 2.0, 4.0, 4.0, 4.0 /)
  call resumir(muestras, media, norma_residual)
  print *, media, norma_residual

contains

  subroutine resumir(valores, promedio, norma)
    implicit none
    real, intent(in) :: valores(:)
    real, intent(out) :: promedio, norma
    real :: residuo(size(valores))

    if (size(valores) == 0) stop ''No se puede resumir un arreglo vacio''

    promedio = sum(valores) / real(size(valores))
    residuo = valores - promedio
    norma = sqrt(dot_product(residuo, residuo))
  end subroutine resumir
end program estadistica_basica
```

```salida
   3.00000000       2.82842708
```

> Doc: [Documentación de Fortran-lang](https://fortran-lang.org/learn/quickstart/organising_code/)

`residuo(size(valores))` es un arreglo automático: su extensión se determina al entrar al procedimiento y su duración se limita a esa invocación. El programa comprueba el tamaño antes de dividir.

# Forma asumida e interfaz explícita

Los dos puntos (`:`) en un argumento como `campo(:,:)` indican **forma asumida**. El rango queda fijado en la declaración, pero cada extensión procede del argumento real. El procedimiento puede consultar `SIZE`, `SHAPE`, `LBOUND` y `UBOUND`.

Un procedimiento con argumentos de forma asumida requiere una interfaz explícita en el lugar de la llamada. Las funciones internas y los procedimientos de módulo la proporcionan automáticamente. Para un subprograma externo, un bloque `INTERFACE` puede describirla, pero duplica información que debe mantenerse idéntica a la definición.

```fortran
program integrar_malla
  implicit none
  real :: campo(3, 4), integral

  campo = 2.0
  call integrar_rectangulos(campo, 0.5, 0.25, integral)
  print *, integral

contains

  subroutine integrar_rectangulos(valores, dx, dy, resultado)
    implicit none
    real, intent(in) :: valores(:,:)
    real, intent(in) :: dx, dy
    real, intent(out) :: resultado

    if (dx <= 0.0 .or. dy <= 0.0) stop ''Los pasos deben ser positivos''
    resultado = sum(valores) * dx * dy
  end subroutine integrar_rectangulos
end program integrar_malla
```

```salida
   3.00000000
```

> Doc: [Documentación de Fortran-lang](https://fortran-lang.org/learn/quickstart/organising_code/)

Pasar `campo(1:3:2, :)` también es válido: el descriptor asociado a un argumento de forma asumida representa su forma aunque la sección no sea contigua. Según el procedimiento y el compilador, una operación puede crear un temporal; el contrato semántico no cambia.

> Nota: los límites inferiores de un argumento de forma asumida son `1` por omisión dentro del procedimiento, aunque el arreglo real tenga otro límite inferior. Si el algoritmo necesita conservar otro origen lógico, se declara de forma explícita, por ejemplo `valores(0:)`, o se pasa el origen como argumento separado.

# Qué contiene una interfaz

La interfaz de un procedimiento comprende su nombre, la naturaleza de función o subrutina, el tipo, *kind* y rango del resultado, y el orden y los atributos de sus argumentos ficticios. Una interfaz explícita permite al compilador comprobar asociaciones y es obligatoria, entre otros casos de Fortran 90, para argumentos opcionales, argumentos por palabra clave, funciones que devuelven arreglos, argumentos de forma asumida y procedimientos genéricos.

El siguiente ejemplo muestra un bloque de interfaz para una subrutina externa. La definición aparece después del programa como otra unidad de programa.

```fortran
program llamada_externa
  implicit none
  real :: perfil(4)

  interface
    subroutine centrar(valores)
      implicit none
      real, intent(inout) :: valores(:)
    end subroutine centrar
  end interface

  perfil = (/ 2.0, 3.0, 5.0, 10.0 /)
  call centrar(perfil)
  print *, perfil
end program llamada_externa

subroutine centrar(valores)
  implicit none
  real, intent(inout) :: valores(:)
  real :: promedio

  if (size(valores) == 0) return
  promedio = sum(valores) / real(size(valores))
  valores = valores - promedio
end subroutine centrar
```

```salida
  -3.00000000      -2.00000000       0.00000000       5.00000000
```

> Doc: [Documentación de Fortran-lang](https://fortran-lang.org/learn/quickstart/organising_code/)

El bloque `INTERFACE` no contiene el algoritmo. Declara el mismo contrato que la definición externa. Si ambos divergen, el programa deja de ser conforme aunque cada unidad pueda compilar por separado. Un módulo evita esta duplicación.

# Módulos como unidad de interfaz y encapsulación

Un módulo reúne declaraciones y procedimientos relacionados. `CONTAINS` separa la parte de especificación de los procedimientos del módulo. Un programa accede a nombres públicos mediante `USE`; la cláusula `ONLY` limita los nombres importados y deja visibles las dependencias.

```fortran
module magnitudes_fisicas
  implicit none
  private

  integer, parameter, public :: rk = selected_real_kind(12, 100)
  public :: energia_cinetica

contains

  function energia_cinetica(masa, velocidad) result(energia)
    implicit none
    real(kind=rk), intent(in) :: masa
    real(kind=rk), intent(in) :: velocidad(:)
    real(kind=rk) :: energia

    if (masa < 0.0_rk) stop ''La masa no puede ser negativa''
    energia = 0.5_rk * masa * dot_product(velocidad, velocidad)
  end function energia_cinetica
end module magnitudes_fisicas

program calcular_energia
  use magnitudes_fisicas, only: rk, energia_cinetica
  implicit none
  real(kind=rk) :: velocidad(3), energia

  velocidad = (/ 2.0_rk, -1.0_rk, 0.5_rk /)
  energia = energia_cinetica(3.0_rk, velocidad)
  print *, energia
end program calcular_energia
```

```salida
   7.8750000000000000
```

> Doc: [Documentación de Fortran-lang](https://fortran-lang.org/learn/quickstart/organising_code/)

`PRIVATE` establece accesibilidad privada por omisión. Los atributos `PUBLIC` exponen solo el parámetro de precisión y la función. El uso de `ONLY:` impide que otros nombres públicos futuros entren accidentalmente en el ámbito del programa.

Para compilar unidades separadas, el archivo que contiene el módulo debe compilarse antes que el archivo que contiene el programa usuario. El compilador genera información de interfaz para procesar la sentencia `USE`; el nombre y formato de ese archivo auxiliar dependen del compilador.

# Diseño de un módulo numérico

Una API numérica pequeña suele necesitar: una definición común de precisión, procedimientos públicos, detalles auxiliares privados y contratos que comprueben tamaños. La función siguiente evalúa un polinomio con el esquema de Horner.

```fortran
module polinomios
  implicit none
  private

  integer, parameter, public :: rk = selected_real_kind(12, 100)
  public :: evaluar_polinomio

contains

  function evaluar_polinomio(coeficientes, argumento) result(valor)
    implicit none
    real(kind=rk), intent(in) :: coeficientes(:)
    real(kind=rk), intent(in) :: argumento
    real(kind=rk) :: valor
    integer :: i

    if (size(coeficientes) == 0) then
      valor = 0.0_rk
      return
    end if

    valor = coeficientes(size(coeficientes))
    do i = size(coeficientes) - 1, 1, -1
      valor = valor * argumento + coeficientes(i)
    end do
  end function evaluar_polinomio
end module polinomios

program usar_polinomio
  use polinomios, only: rk, evaluar_polinomio
  implicit none
  real(kind=rk) :: coeficientes(3), valor

  coeficientes = (/ 1.0_rk, -2.0_rk, 0.5_rk /)
  valor = evaluar_polinomio(coeficientes, 3.0_rk)
  print *, valor
end program usar_polinomio
```

```salida
 -0.50000000000000000
```

> Doc: [Documentación de Fortran-lang](https://fortran-lang.org/learn/quickstart/organising_code/)

Los coeficientes se ordenan desde el término constante. El procedimiento acepta cualquier extensión mediante `coeficientes(:)` y trata explícitamente el polinomio vacío.

# PURE: un contrato sin efectos laterales observables

`PURE` no forma parte del estándar Fortran 90; se incorporó en Fortran 95. Se incluye porque permite expresar una propiedad importante del cálculo científico y porque los compiladores actuales que aceptan código de estilo Fortran 90 suelen admitirlo.

Un procedimiento puro restringe los efectos laterales: sus argumentos no pueden usarse para modificar estado externo, una función pura no puede definir sus argumentos, y el procedimiento no debe efectuar entrada o salida externa. Estas restricciones facilitan el razonamiento independiente sobre cada llamada y permiten usar el procedimiento en contextos que exigen pureza.

```fortran
module conversiones
  implicit none
  private
  integer, parameter, public :: rk = selected_real_kind(12, 100)
  public :: celsius_a_kelvin

contains

  pure function celsius_a_kelvin(celsius) result(kelvin)
    implicit none
    real(kind=rk), intent(in) :: celsius
    real(kind=rk) :: kelvin

    kelvin = celsius + 273.15_rk
  end function celsius_a_kelvin
end module conversiones

program convertir_temperatura
  use conversiones, only: rk, celsius_a_kelvin
  implicit none
  real(kind=rk) :: temperatura

  temperatura = celsius_a_kelvin(21.5_rk)
  print *, temperatura
end program convertir_temperatura
```

```salida
   294.64999999999998
```

> Doc: [Documentación de Fortran-lang](https://fortran-lang.org/learn/quickstart/organising_code/)

La comprobación de errores de una función pura no debe depender de escribir un mensaje en un archivo o en la salida estándar. Cuando el dominio puede fallar, el contrato puede devolver un indicador por medio de una subrutina pura o el llamador puede validar las precondiciones antes de invocar la función.

> Nota: `PURE` no prueba estabilidad numérica, exactitud ni ausencia de errores algorítmicos. Declara restricciones sobre efectos y definiciones; la calidad matemática requiere pruebas separadas.

# ELEMENTAL: una definición escalar aplicable a arreglos

`ELEMENTAL` tampoco pertenece a Fortran 90; los procedimientos elementales definidos por el usuario se incorporaron en Fortran 95. Un procedimiento elemental se declara con argumentos ficticios escalares. Puede llamarse con escalares o con arreglos conformables; en el segundo caso, se aplica independientemente a cada posición y el resultado adopta la forma de los argumentos de arreglo.

```fortran
module sensores
  implicit none
  private
  integer, parameter, public :: rk = selected_real_kind(12, 100)
  public :: corregir_lineal

contains

  pure elemental function corregir_lineal(lectura, ganancia, sesgo) &
      result(corregida)
    implicit none
    real(kind=rk), intent(in) :: lectura, ganancia, sesgo
    real(kind=rk) :: corregida

    corregida = ganancia * lectura + sesgo
  end function corregir_lineal
end module sensores

program calibrar_sensores
  use sensores, only: rk, corregir_lineal
  implicit none
  real(kind=rk) :: lectura(4), corregida(4)

  lectura = (/ 0.2_rk, 0.4_rk, 0.6_rk, 0.8_rk /)
  corregida = corregir_lineal(lectura, 1.05_rk, -0.01_rk)
  print *, corregida
end program calibrar_sensores
```

```salida
  0.20000000000000001       0.41000000000000003       0.62000000000000000       0.83000000000000007
```

> Doc: [Documentación de Fortran-lang](https://fortran-lang.org/learn/quickstart/organising_code/)

`lectura` es un arreglo real en la llamada, mientras que `ganancia` y `sesgo` son escalares. Los escalares se combinan con cada elemento. Si más de un argumento real es arreglo, todos los argumentos de arreglo deben ser conformables.

Las funciones intrínsecas elementales de Fortran 90, como `ABS`, `SQRT`, `SIN` y `EXP`, ya ofrecen este comportamiento. `ELEMENTAL` extiende el mismo modelo a una operación definida por el programa en estándares posteriores.

# PURE y ELEMENTAL dentro de una API matricial

El módulo siguiente combina una función elemental para una transformación local y una función pura para una reducción global. La primera conserva la forma; la segunda devuelve un escalar.

```fortran
module errores_numericos
  implicit none
  private
  integer, parameter, public :: rk = selected_real_kind(12, 100)
  public :: error_cuadrado, rmse

contains

  pure elemental function error_cuadrado(calculado, observado) result(error2)
    implicit none
    real(kind=rk), intent(in) :: calculado, observado
    real(kind=rk) :: error2

    error2 = (calculado - observado)**2
  end function error_cuadrado

  pure function rmse(calculado, observado) result(valor)
    implicit none
    real(kind=rk), intent(in) :: calculado(:), observado(:)
    real(kind=rk) :: valor

    if (size(calculado) /= size(observado) .or. &
        size(calculado) == 0) then
      valor = huge(1.0_rk)
      return
    end if

    valor = sqrt(sum(error_cuadrado(calculado, observado)) / &
                 real(size(calculado), kind=rk))
  end function rmse
end module errores_numericos

program medir_error
  use errores_numericos, only: rk, rmse
  implicit none
  real(kind=rk) :: calculado(3), observado(3)

  calculado = (/ 1.1_rk, 1.9_rk, 3.2_rk /)
  observado = (/ 1.0_rk, 2.0_rk, 3.0_rk /)
  print *, rmse(calculado, observado)
end program medir_error
```

```salida
  0.14142135623730964
```

> Doc: [Documentación de Fortran-lang](https://fortran-lang.org/learn/quickstart/organising_code/)

El valor `HUGE(1.0_rk)` funciona aquí como señal documentada de precondición incumplida, no como un resultado físico. En una biblioteca real, una subrutina con argumento de estado puede representar el fallo sin confundirlo con un valor numérico.

# Práctica: Aplicar un procedimiento elemental

Define una función elemental que convierta grados Celsius a kelvin y aplícala a un arreglo. La solución comprueba cada resultado con tolerancia.

La solución de referencia incluye la comprobación. El comentario `verificar-error` identifica una alteración deliberada que el verificador debe rechazar.

```fortran
program practica_elemental
  implicit none
  real :: kelvin(2)
  kelvin = convertir([0.0, 100.0])
  if (any(abs(kelvin - [273.15, 373.15]) > 1.e-4)) error stop ''Conversion incorrecta''
  write(*,''(2(F7.2,1X))'') kelvin
contains
  elemental function convertir(celsius) result(temperatura)
    implicit none
    real, intent(in) :: celsius
    real :: temperatura
    ! verificar-error: celsius + 273.15 => celsius - 273.15
    temperatura = celsius + 273.15
  end function convertir
end program practica_elemental
```

```salida
 273.15  373.15
```

> Doc: [Documentación de Fortran-lang](https://fortran-lang.org/learn/quickstart/organising_code/)

# Ejercicio en el navegador

Completa el programa y pulsa «Comprobar». El código se compila y ejecuta en tu navegador; cada intento comienza desde cero.

```ejercicio fortran
# Enunciado
Completa la operación que falta para que el programa cumpla las comprobaciones de esta sesión.
# Plantilla
program practica_elemental
  implicit none
  real :: kelvin(2)
  kelvin = convertir([0.0, 100.0])
  if (any(abs(kelvin - [273.15, 373.15]) > 1.e-4)) error stop ''Conversion incorrecta''
  write(*,''(2(F7.2,1X))'') kelvin
contains
  elemental function convertir(celsius) result(temperatura)
    implicit none
    real, intent(in) :: celsius
    real :: temperatura
    temperatura = ___
  end function convertir
end program practica_elemental
# Esperado
 273.15  373.15
# Pista
Revisa la práctica resuelta de esta sesión y las condiciones que comprueba antes de imprimir la salida.
```

# Cierre

Esta sesión distinguió funciones y subrutinas, precisó `INTENT`, arreglos automáticos y argumentos de forma asumida, y mostró por qué una interfaz explícita permite comprobar el contrato. Los módulos proporcionaron esa interfaz sin duplicarla y añadieron encapsulación con `PRIVATE`, `PUBLIC` y `USE, ONLY`. Finalmente, se separó el núcleo Fortran 90 de `PURE` y `ELEMENTAL`, incorporados en Fortran 95, y se aplicaron ambos a transformaciones científicas. La sesión 4 modela registros con tipos derivados, procesa archivos con diagnóstico de entrada y salida e integra arreglos, módulos y procedimientos en un programa científico completo.
') on conflict (curso_slug, archivo) do update set contenido=excluded.contenido, actualizado_en=now();

insert into public.curso_contenido (curso_slug, archivo, contenido) values ('fortran-calculo-cientifico', 'sesion-4.md', '---
numero: 4
titulo: "Tipos derivados, archivos y programa científico integrador"
---

# Objetivos y preparación

Cada bloque es un programa independiente. Compílalo con `gfortran -std=f2018 -Wall -Wextra -fcheck=all archivo.f90 -o programa` y ejecuta `./programa`. Las salidas se obtuvieron con GNU Fortran; los espacios y las últimas cifras pueden variar entre procesadores.

Al terminar podrás definir registros científicos con tipos derivados, distinguir archivos secuenciales formateados de las unidades que los representan, abrir, leer, escribir y cerrar archivos con comprobación de estado, interpretar `IOSTAT`, conservar el diagnóstico del procesador mediante `IOMSG` y organizar un programa que carga una serie, calcula estadísticas y guarda un informe.

# Archivos para reproducir los ejemplos

Cada ejemplo utiliza una carpeta de trabajo independiente. Antes de ejecutar el lector correspondiente, crea el archivo indicado con un editor de texto. `serie.dat` contiene tres líneas: `0 10`, `1 14` y `2 18`. `mediciones.dat` contiene tres líneas: `10`, `14` y `18`. `parametros.dat` contiene una línea: `3`.

Para el programa integrador, guarda `temperaturas.dat` con estas cuatro líneas. La primera indica el número de observaciones; las siguientes contienen tiempo y temperatura.

```text !sin-consola
3
0 10
1 14
2 18
```

Las salidas mostradas corresponden a estos archivos. El programa que escribe `perfil.dat` lo crea por sí mismo. El integrador genera `resumen_temperaturas.txt`; se debe inspeccionar además de la salida de la terminal.

# Tipos derivados como registros científicos

Un tipo derivado agrupa componentes relacionados bajo una sola definición. Cada componente conserva su propio tipo, *kind*, rango y longitud. Una variable declarada con `TYPE(nombre)` es una estructura de ese tipo.

El signo de porcentaje (`%`) selecciona un componente. En `muestra%temperatura`, `muestra` es la estructura y `temperatura` es el componente.

```fortran
program registro_de_muestra
  implicit none

  type :: muestra_termica
    integer :: identificador
    real :: tiempo
    real :: temperatura
    logical :: valida
  end type muestra_termica

  type(muestra_termica) :: muestra

  muestra%identificador = 17
  muestra%tiempo = 2.5
  muestra%temperatura = 298.4
  muestra%valida = .true.

  print *, muestra%identificador, muestra%temperatura
end program registro_de_muestra
```

```salida
          17   298.399994
```

> Doc: [Documentación de Fortran-lang](https://fortran-lang.org/learn/best_practices/file_io/)

La definición del tipo no reserva una variable; describe la composición que tendrán las variables declaradas después. Los componentes no reciben valores automáticamente en Fortran 90, de modo que deben definirse antes de leerse.

# Constructores de estructura

Un constructor de estructura usa el nombre del tipo seguido de un valor para cada componente, en el orden de la definición. En Fortran 90 no se indican nombres de componentes dentro del constructor: el orden es parte del contrato.

```fortran
program construir_muestra
  implicit none

  type :: punto_espacial
    real :: x
    real :: y
    real :: z
  end type punto_espacial

  type(punto_espacial) :: posicion

  posicion = punto_espacial(1.5, -0.5, 3.0)
  print *, posicion%x, posicion%y, posicion%z
end program construir_muestra
```

```salida
   1.50000000     -0.500000000       3.00000000
```

> Doc: [Documentación de Fortran-lang](https://fortran-lang.org/learn/best_practices/file_io/)

La asignación intrínseca entre dos estructuras del mismo tipo copia sus componentes. Un arreglo de estructuras permite representar una colección de registros homogéneos.

```fortran
program trayectoria
  implicit none
  integer :: i

  type :: estado_particula
    real :: tiempo
    real :: posicion(3)
  end type estado_particula

  type(estado_particula) :: estados(3)

  do i = 1, size(estados)
    estados(i)%tiempo = real(i - 1) * 0.1
    estados(i)%posicion = (/ real(i), 0.0, -real(i) /)
  end do

  print *, estados%tiempo
  print *, estados(2)%posicion
end program trayectoria
```

```salida
   0.00000000      0.100000001      0.200000003    
   2.00000000       0.00000000      -2.00000000
```

> Doc: [Documentación de Fortran-lang](https://fortran-lang.org/learn/best_practices/file_io/)

`estados%tiempo` es un arreglo formado por el componente escalar `tiempo` de cada elemento. En cambio, seleccionar simultáneamente un arreglo de estructuras y un componente que también es arreglo tiene restricciones en Fortran 90; `estados(2)%posicion` selecciona primero una estructura escalar y luego su componente vectorial, por lo que es inequívoco.

# Definir el tipo una sola vez en un módulo

Dos definiciones textualmente iguales no crean necesariamente el mismo tipo. Para compartir estructuras entre el programa y sus procedimientos, se define el tipo en un módulo y se importa con `USE`.

```fortran
module modelos_de_medicion
  implicit none
  private

  type, public :: resumen_serie
    integer :: cantidad
    real :: minimo
    real :: maximo
    real :: media
  end type resumen_serie

  public :: resumir_serie

contains

  function resumir_serie(valores) result(resumen)
    implicit none
    real, intent(in) :: valores(:)
    type(resumen_serie) :: resumen

    resumen%cantidad = size(valores)
    if (resumen%cantidad == 0) then
      resumen%minimo = 0.0
      resumen%maximo = 0.0
      resumen%media = 0.0
      return
    end if

    resumen%minimo = minval(valores)
    resumen%maximo = maxval(valores)
    resumen%media = sum(valores) / real(resumen%cantidad)
  end function resumir_serie
end module modelos_de_medicion

program usar_resumen
  use modelos_de_medicion, only: resumen_serie, resumir_serie
  implicit none
  real :: concentracion(4)
  type(resumen_serie) :: resumen

  concentracion = (/ 0.8, 1.1, 0.9, 1.2 /)
  resumen = resumir_serie(concentracion)

  print *, resumen%cantidad, resumen%media
end program usar_resumen
```

```salida
           4   1.00000000
```

> Doc: [Documentación de Fortran-lang](https://fortran-lang.org/learn/best_practices/file_io/)

La función devuelve una estructura completa. Antes de terminar, define todos sus componentes tanto en el caso vacío como en el caso general.

# Archivo, unidad, registro y posición

Un archivo externo contiene una secuencia de registros. Una **unidad** es el identificador entero que las sentencias de entrada y salida usan para referirse a la conexión. `OPEN` establece la conexión entre unidad y archivo; `CLOSE` la termina.

En acceso secuencial, cada lectura o escritura avanza por los registros en orden. En un archivo formateado, los registros contienen caracteres interpretados mediante un formato explícito o mediante formato dirigido por lista, indicado con un asterisco (`*`).

```fortran
program escribir_perfil
  implicit none
  integer, parameter :: unidad = 20
  integer :: i, estado
  real :: altura(3), temperatura(3)

  altura = (/ 0.0, 100.0, 200.0 /)
  temperatura = (/ 288.2, 287.5, 286.9 /)

  open(unit=unidad, file=''perfil.dat'', status=''replace'', &
       action=''write'', form=''formatted'', iostat=estado)
  if (estado /= 0) stop ''No se pudo abrir perfil.dat''

  do i = 1, size(altura)
    write(unit=unidad, fmt=''(F8.2,1X,F8.2)'', iostat=estado) &
      altura(i), temperatura(i)
    if (estado /= 0) stop ''No se pudo escribir perfil.dat''
  end do

  close(unit=unidad, iostat=estado)
  if (estado /= 0) stop ''No se pudo cerrar perfil.dat''
end program escribir_perfil
```

> Doc: [Documentación de Fortran-lang](https://fortran-lang.org/learn/best_practices/file_io/)

`STATUS=''REPLACE''` solicita reemplazar el archivo si existe o crearlo si no existe. `ACTION=''WRITE''` prohíbe lecturas desde esa conexión. `FORM=''FORMATTED''` selecciona registros de caracteres. El descriptor `F8.2` reserva un campo de ocho caracteres con dos decimales y `1X` inserta un espacio.

> Nota: `STATUS=''REPLACE''` destruye el contenido anterior. Solo debe usarse cuando esa sustitución sea parte explícita del contrato. Para una entrada existente se usa `STATUS=''OLD''`; para exigir un archivo nuevo, `STATUS=''NEW''`.

# IOSTAT como control de flujo de entrada y salida

El especificador `IOSTAT=` recibe un entero tras una operación de entrada o salida. En una transferencia de datos, cero indica éxito, un valor positivo indica error y un valor negativo indica fin de archivo o fin de registro. Los valores concretos dependen del procesador; el signo es la clasificación portable relevante para este curso.

```fortran !sin-consola
program leer_hasta_fin
  implicit none
  integer, parameter :: unidad = 21
  integer :: estado, cantidad
  real :: tiempo, valor, suma

  open(unit=unidad, file=''serie.dat'', status=''old'', action=''read'', &
       form=''formatted'', iostat=estado)
  if (estado /= 0) stop ''No se pudo abrir serie.dat''

  cantidad = 0
  suma = 0.0
  do
    read(unit=unidad, fmt=*, iostat=estado) tiempo, valor
    if (estado < 0) exit
    if (estado > 0) stop ''Registro invalido en serie.dat''

    cantidad = cantidad + 1
    suma = suma + valor
  end do

  close(unit=unidad, iostat=estado)
  if (estado /= 0) stop ''No se pudo cerrar serie.dat''

  if (cantidad > 0) print *, suma / real(cantidad)
end program leer_hasta_fin
```

```salida
   14.0000000
```

> Nota: Esta construcción no reproduce todavía la salida correcta con el compilador web fijado. Ejecuta este ejemplo con GNU Fortran en tu equipo; el ejercicio de la sesión sí se puede resolver en el navegador.

> Doc: [Documentación de Fortran-lang](https://fortran-lang.org/learn/best_practices/file_io/)

La comprobación ocurre inmediatamente después de `READ`, antes de usar `tiempo` o `valor`. Si la lectura falla, los elementos de la lista de entrada no deben considerarse definidos. El caso `estado < 0` termina el bucle; el caso `estado > 0` representa un registro inválido u otro error.

# IOMSG conserva el diagnóstico del procesador

`IOMSG=` recibe un mensaje descriptivo cuando una operación de entrada o salida falla. No pertenece a Fortran 90; fue incorporado en Fortran 2003. Se enseña junto a `IOSTAT=` porque permite que un programa actual informe la causa sin depender de una tabla de códigos específica del compilador.

```fortran
program apertura_diagnosticada
  implicit none
  integer, parameter :: unidad = 22
  integer :: estado
  character(len=256) :: mensaje

  mensaje = ''''
  open(unit=unidad, file=''mediciones.dat'', status=''old'', &
       action=''read'', form=''formatted'', iostat=estado, iomsg=mensaje)

  if (estado /= 0) then
    print *, ''No se pudo abrir mediciones.dat: '', trim(mensaje)
    stop 1
  end if

  close(unit=unidad, iostat=estado, iomsg=mensaje)
  if (estado /= 0) then
    print *, ''No se pudo cerrar mediciones.dat: '', trim(mensaje)
    stop 1
  end if
end program apertura_diagnosticada
```

```archivo mediciones.dat
10
14
18
```

> Doc: [Documentación de Fortran-lang](https://fortran-lang.org/learn/best_practices/file_io/)

`TRIM` elimina blancos finales del mensaje de longitud fija. El texto exacto de `IOMSG` depende del procesador, por lo que el programa añade contexto estable: la operación y el nombre del archivo. No se compara el mensaje con una cadena literal; las decisiones se basan en `IOSTAT`.

> Nota: para conservar compatibilidad estricta con Fortran 90, se omite `IOMSG=` y se informa el código entero junto con el contexto controlado por el programa. La lógica basada en cero, positivo y negativo permanece válida para transferencias.

# Comprobar existencia antes de abrir

`INQUIRE` consulta propiedades de un archivo o de una unidad. El especificador `EXIST=` recibe un lógico. Esta comprobación mejora el diagnóstico, pero no sustituye `IOSTAT=` en `OPEN`: el estado del sistema de archivos puede cambiar entre ambas sentencias.

```fortran
program comprobar_archivo
  implicit none
  logical :: existe
  integer :: estado

  inquire(file=''parametros.dat'', exist=existe, iostat=estado)
  if (estado /= 0) stop ''No se pudo consultar parametros.dat''

  if (.not. existe) then
    print *, ''Falta el archivo parametros.dat''
  else
    print *, ''El archivo parametros.dat existe''
  end if
end program comprobar_archivo
```

```salida
 El archivo parametros.dat existe
```

```archivo parametros.dat
3
```

> Doc: [Documentación de Fortran-lang](https://fortran-lang.org/learn/best_practices/file_io/)

El operador lógico `.NOT.` niega `existe`. Aun cuando el resultado sea verdadero, la apertura posterior debe comprobar su propio estado.

# Formatos explícitos para datos reproducibles

Un formato explícito fija cómo se representan los valores. El descriptor `I` edita enteros, `F` usa punto fijo, `E` usa notación exponencial y `A` transfiere caracteres. En `ES14.6`, `ES` solicita notación científica, `14` es el ancho total y `6` es el número de cifras después del separador decimal.

```fortran
program informe_formateado
  implicit none
  integer :: iteracion
  real :: residuo

  iteracion = 12
  residuo = 0.00003125

  write(unit=*, fmt=''(A,1X,I5)'') ''iteracion'', iteracion
  write(unit=*, fmt=''(A,1X,ES14.6)'') ''residuo'', residuo
end program informe_formateado
```

```salida
iteracion    12
residuo   3.125000E-05
```

> Doc: [Documentación de Fortran-lang](https://fortran-lang.org/learn/best_practices/file_io/)

El asterisco en `UNIT=*` selecciona la unidad de salida por omisión. El formato explícito controla ancho y representación, pero un campo demasiado estrecho puede producir asteriscos en lugar del número; se elige el ancho a partir del intervalo esperado de los datos.

# Diseño del programa integrador

El programa integrador procesará un archivo secuencial formateado llamado `temperaturas.dat`. Su contrato de entrada es:

1. El primer registro contiene un entero positivo `n`, la cantidad de observaciones.
2. Cada uno de los `n` registros siguientes contiene tiempo y temperatura como valores reales.
3. No se aceptan registros ausentes dentro de las `n` observaciones.

El programa reservará dos vectores, calculará mínimo, máximo, media y desviación cuadrática media respecto de la media, y escribirá `resumen_temperaturas.txt`. No se presenta una salida literal porque depende del archivo proporcionado y del procesador.

# Programa científico integrador

El módulo reúne la precisión, el tipo de resumen y el procedimiento de cálculo. La rutina de lectura pertenece al programa porque administra nombres de archivo y diagnóstico; la rutina numérica no efectúa entrada ni salida.

```fortran
module estadistica_series
  implicit none
  private

  integer, parameter, public :: rk = selected_real_kind(12, 100)

  type, public :: resumen_estadistico
    integer :: cantidad
    real(kind=rk) :: minimo
    real(kind=rk) :: maximo
    real(kind=rk) :: media
    real(kind=rk) :: desviacion
  end type resumen_estadistico

  public :: calcular_resumen

contains

  function calcular_resumen(valores) result(resumen)
    implicit none
    real(kind=rk), intent(in) :: valores(:)
    type(resumen_estadistico) :: resumen
    real(kind=rk) :: diferencias(size(valores))

    resumen%cantidad = size(valores)
    if (resumen%cantidad == 0) then
      resumen%minimo = 0.0_rk
      resumen%maximo = 0.0_rk
      resumen%media = 0.0_rk
      resumen%desviacion = 0.0_rk
      return
    end if

    resumen%minimo = minval(valores)
    resumen%maximo = maxval(valores)
    resumen%media = sum(valores) / real(resumen%cantidad, kind=rk)
    diferencias = valores - resumen%media
    resumen%desviacion = sqrt(dot_product(diferencias, diferencias) / &
                              real(resumen%cantidad, kind=rk))
  end function calcular_resumen
end module estadistica_series

program analizar_temperaturas
  use estadistica_series, only: rk, resumen_estadistico, calcular_resumen
  implicit none

  integer, parameter :: unidad_entrada = 30
  integer, parameter :: unidad_salida = 31
  integer, parameter :: max_observaciones = 1000000
  integer :: n, i, estado
  character(len=256) :: mensaje
  real(kind=rk), allocatable :: tiempo(:), temperatura(:)
  type(resumen_estadistico) :: resumen

  mensaje = ''''
  open(unit=unidad_entrada, file=''temperaturas.dat'', status=''old'', &
       action=''read'', form=''formatted'', iostat=estado, iomsg=mensaje)
  if (estado /= 0) then
    print *, ''No se pudo abrir temperaturas.dat: '', trim(mensaje)
    stop 1
  end if

  read(unit=unidad_entrada, fmt=*, iostat=estado, iomsg=mensaje) n
  if (estado /= 0) then
    print *, ''No se pudo leer la cantidad de observaciones: '', trim(mensaje)
    close(unit=unidad_entrada)
    stop 1
  end if

  if (n < 1 .or. n > max_observaciones) then
    print *, ''Cantidad de observaciones fuera del intervalo permitido: '', n
    close(unit=unidad_entrada)
    stop 1
  end if

  allocate(tiempo(n), temperatura(n), stat=estado)
  if (estado /= 0) then
    print *, ''No se pudieron reservar los arreglos para '', n, '' observaciones''
    close(unit=unidad_entrada)
    stop 1
  end if

  do i = 1, n
    read(unit=unidad_entrada, fmt=*, iostat=estado, iomsg=mensaje) &
      tiempo(i), temperatura(i)
    if (estado /= 0) then
      print *, ''Error en la observacion '', i, '': '', trim(mensaje)
      deallocate(tiempo, temperatura)
      close(unit=unidad_entrada)
      stop 1
    end if
  end do

  close(unit=unidad_entrada, iostat=estado, iomsg=mensaje)
  if (estado /= 0) then
    print *, ''No se pudo cerrar temperaturas.dat: '', trim(mensaje)
    deallocate(tiempo, temperatura)
    stop 1
  end if

  do i = 2, n
    if (tiempo(i) <= tiempo(i - 1)) then
      print *, ''Los tiempos deben ser estrictamente crecientes; indice '', i
      deallocate(tiempo, temperatura)
      stop 1
    end if
  end do

  resumen = calcular_resumen(temperatura)

  mensaje = ''''
  open(unit=unidad_salida, file=''resumen_temperaturas.txt'', &
       status=''replace'', action=''write'', form=''formatted'', &
       iostat=estado, iomsg=mensaje)
  if (estado /= 0) then
    print *, ''No se pudo abrir el informe: '', trim(mensaje)
    deallocate(tiempo, temperatura)
    stop 1
  end if

  write(unit=unidad_salida, fmt=''(A,1X,I0)'', &
        iostat=estado, iomsg=mensaje) ''cantidad'', resumen%cantidad
  if (estado == 0) then
    write(unit=unidad_salida, fmt=''(A,1X,ES24.16)'', &
          iostat=estado, iomsg=mensaje) ''tiempo_inicial'', tiempo(1)
  end if
  if (estado == 0) then
    write(unit=unidad_salida, fmt=''(A,1X,ES24.16)'', &
          iostat=estado, iomsg=mensaje) ''tiempo_final'', tiempo(n)
  end if
  if (estado == 0) then
    write(unit=unidad_salida, fmt=''(A,1X,ES24.16)'', &
          iostat=estado, iomsg=mensaje) ''minimo'', resumen%minimo
  end if
  if (estado == 0) then
    write(unit=unidad_salida, fmt=''(A,1X,ES24.16)'', &
          iostat=estado, iomsg=mensaje) ''maximo'', resumen%maximo
  end if
  if (estado == 0) then
    write(unit=unidad_salida, fmt=''(A,1X,ES24.16)'', &
          iostat=estado, iomsg=mensaje) ''media'', resumen%media
  end if
  if (estado == 0) then
    write(unit=unidad_salida, fmt=''(A,1X,ES24.16)'', &
          iostat=estado, iomsg=mensaje) ''desviacion'', resumen%desviacion
  end if

  if (estado /= 0) then
    print *, ''No se pudo escribir el informe: '', trim(mensaje)
    close(unit=unidad_salida)
    deallocate(tiempo, temperatura)
    stop 1
  end if

  close(unit=unidad_salida, iostat=estado, iomsg=mensaje)
  if (estado /= 0) then
    print *, ''No se pudo cerrar el informe: '', trim(mensaje)
    deallocate(tiempo, temperatura)
    stop 1
  end if

  deallocate(tiempo, temperatura, stat=estado)
  if (estado /= 0) stop ''No se pudieron liberar los arreglos''
end program analizar_temperaturas
```

```archivo temperaturas.dat
3
0 10
1 14
2 18
```

> Doc: [Documentación de Fortran-lang](https://fortran-lang.org/learn/best_practices/file_io/)

`I0` es un descriptor de ancho mínimo incorporado después de Fortran 90. Para un compilador estrictamente Fortran 90 se sustituye `I0` por un ancho suficiente para el límite validado, por ejemplo `I10`. `IOMSG=` también requiere Fortran 2003. El resto de la arquitectura conserva el modelo de Fortran 90: módulos, tipo derivado, arreglos asignables, interfaces explícitas, procedimientos y entrada/salida secuencial formateada.

La cadena de comprobaciones evita tres fallos frecuentes: usar dimensiones inválidas para reservar memoria, consumir variables después de una lectura fallida y publicar un informe parcial como si estuviera completo. El cálculo usa la desviación poblacional, porque divide entre `n`; una estimación muestral requeriría otro contrato y, como mínimo, `n > 1`.

# Práctica: Rechazar un registro inválido

Realiza una lectura interna de una cadena no numérica y comprueba que se detecta el error antes de utilizar el resultado. Un cambio que acepte el registro debe hacer fallar la práctica.

La solución de referencia incluye la comprobación. El comentario `verificar-error` identifica una alteración deliberada que el verificador debe rechazar.

```fortran
program practica_registro
  implicit none
  character(len=12) :: registro = ''no-numerico''
  real :: temperatura
  integer :: estado
  read(registro, *, iostat=estado) temperatura
  ! verificar-error: estado /= 0 => estado == 0
  if (estado /= 0) then
    write(*,''(A)'') ''Registro rechazado''
  else
    error stop ''Registro invalido aceptado''
  end if
end program practica_registro
```

```salida
Registro rechazado
```

> Doc: [Documentación de Fortran-lang](https://fortran-lang.org/learn/best_practices/file_io/)

# Ejercicio en el navegador

Completa el programa y pulsa «Comprobar». El código se compila y ejecuta en tu navegador; cada intento comienza desde cero.

```ejercicio fortran
# Enunciado
Completa la operación que falta para que el programa cumpla las comprobaciones de esta sesión.
# Plantilla
program practica_registro
  implicit none
  character(len=12) :: registro = ''no-numerico''
  real :: temperatura
  integer :: estado
  read(registro, *, iostat=estado) temperatura
  if (___) then
    write(*,''(A)'') ''Registro rechazado''
  else
    error stop ''Registro invalido aceptado''
  end if
end program practica_registro
# Esperado
Registro rechazado
# Pista
Revisa la práctica resuelta de esta sesión y las condiciones que comprueba antes de imprimir la salida.
```

# Cierre

Esta sesión cubrió tipos derivados, componentes, constructores, arreglos de estructuras y definiciones compartidas mediante módulos. También estableció el modelo de archivo, unidad, registro y posición; explicó formatos explícitos, `INQUIRE`, `OPEN`, `READ`, `WRITE` y `CLOSE`; y distinguió el estado portable de `IOSTAT` del diagnóstico dependiente del procesador que entrega `IOMSG` en Fortran 2003. El programa integrador reunió precisión seleccionada, memoria dinámica, validación, estadísticas, tipos derivados, procedimientos e informes formateados. Con ello quedan cubiertas las cuatro sesiones del curso y una base coherente para mantener programas científicos de Fortran 90 en compiladores actuales.
') on conflict (curso_slug, archivo) do update set contenido=excluded.contenido, actualizado_en=now();

insert into public.curso_sesiones (curso_slug, archivo, numero, titulo, slug) values ('fortran-calculo-cientifico', 'sesion-1.md', 1, 'Arreglos, secciones y asignación enmascarada', 'sesion-1') on conflict (curso_slug, archivo) do update set numero=excluded.numero, titulo=excluded.titulo, slug=excluded.slug;

insert into public.curso_sesiones (curso_slug, archivo, numero, titulo, slug) values ('fortran-calculo-cientifico', 'sesion-2.md', 2, 'Memoria dinámica, precisión portable y cálculo matricial', 'sesion-2') on conflict (curso_slug, archivo) do update set numero=excluded.numero, titulo=excluded.titulo, slug=excluded.slug;

insert into public.curso_sesiones (curso_slug, archivo, numero, titulo, slug) values ('fortran-calculo-cientifico', 'sesion-3.md', 3, 'Procedimientos, interfaces explícitas y módulos', 'sesion-3') on conflict (curso_slug, archivo) do update set numero=excluded.numero, titulo=excluded.titulo, slug=excluded.slug;

insert into public.curso_sesiones (curso_slug, archivo, numero, titulo, slug) values ('fortran-calculo-cientifico', 'sesion-4.md', 4, 'Tipos derivados, archivos y programa científico integrador', 'sesion-4') on conflict (curso_slug, archivo) do update set numero=excluded.numero, titulo=excluded.titulo, slug=excluded.slug;

commit;

