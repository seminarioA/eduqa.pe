---
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

  if (estado /= 0) stop 'No se pudo reservar la malla'
  temperatura = 273.15

  print *, shape(temperatura), size(temperatura)

  deallocate(temperatura, stat=estado)
  if (estado /= 0) stop 'No se pudo liberar la malla'
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
  if (estado /= 0) stop 'Fallo al reservar el primer espectro'
  espectro = 0.0

  if (allocated(espectro)) then
    deallocate(espectro, stat=estado)
    if (estado /= 0) stop 'Fallo al liberar el primer espectro'
  end if

  allocate(espectro(0:511), stat=estado)
  if (estado /= 0) stop 'Fallo al reservar el segundo espectro'
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
  if (estado /= 0) stop 'Fallo al reservar los vectores'

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
    stop 'Numero de niveles fuera del intervalo permitido'
  end if

  allocate(altura(niveles), densidad(niveles), stat=estado)
  if (estado /= 0) stop 'Fallo al reservar el perfil'

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

  if (rk < 0) stop 'El procesador no ofrece la precision solicitada'

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
    stop 'Dimensiones incompatibles en MATMUL'
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
    stop 'Todas las dimensiones deben ser positivas'
  end if

  allocate(a(m, k), b(k, n), c(m, n), stat=estado)
  if (estado /= 0) stop 'Fallo al reservar las matrices'

  a = 0.0_rk
  b = 0.0_rk
  a(:, 1) = 1.0_rk
  b(1, :) = 2.0_rk

  if (size(a, 2) /= size(b, 1)) then
    stop 'Dimensiones internas incompatibles'
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
  if (estado /= 0) error stop 'Reserva fallida'
  mediciones = 2.0
  if (size(mediciones) /= 3) error stop 'Tamano incorrecto'
  write(*,'(F4.1)') sum(mediciones)
  deallocate(mediciones)
  if (allocated(mediciones)) error stop 'Reserva no liberada'
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
  if (estado /= 0) error stop 'Reserva fallida'
  mediciones = 2.0
  if (size(mediciones) /= 3) error stop 'Tamano incorrecto'
  write(*,'(F4.1)') sum(mediciones)
  deallocate(mediciones)
  if (allocated(mediciones)) error stop 'Reserva no liberada'
end program practica_reserva
# Esperado
 6.0
# Pista
Revisa la práctica resuelta de esta sesión y las condiciones que comprueba antes de imprimir la salida.
```

# Cierre

Esta sesión cubrió el ciclo de vida de los arreglos `ALLOCATABLE`, la comprobación con `STAT=` y `ALLOCATED`, los límites dinámicos y la ausencia de reasignación automática en Fortran 90. También estableció precisión portable con `SELECTED_REAL_KIND`, constantes con sufijo de *kind*, consultas del modelo numérico, tolerancias dependientes de escala y las operaciones `DOT_PRODUCT`, `MATMUL` y `TRANSPOSE`. La sesión 3 encapsula estos cálculos en funciones y subrutinas con contratos explícitos, procedimientos puros y elementales, y módulos reutilizables.
