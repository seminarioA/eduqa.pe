-- Generado desde los Markdown. Aplicar como una sola transacción.

-- Conserva precio, estado, acceso y matrículas de cursos existentes.

begin;

insert into public.rutas (slug, nombre, descripcion, orden) values ('programacion-fortran', 'Programación Fortran', 'Aprende Fortran desde cero y avanza hacia programación avanzada y desarrollo de software con pruebas, archivos e interoperabilidad.', 3) on conflict (slug) do update set nombre=excluded.nombre, descripcion=excluded.descripcion, orden=excluded.orden;

insert into public.cursos (slug, titulo, resumen, precio, estado, acceso_libre, orden, ruta, posicion, requisitos) values ('fortran-avanzado', 'Fortran avanzado', 'Gestión de memoria, procedimientos genéricos, orientación a objetos y cálculo numérico robusto con Fortran moderno.', 20, 'publico', false, 17, 'programacion-fortran', 3, array['fortran-calculo-cientifico']::text[]) on conflict (slug) do update set titulo=excluded.titulo, resumen=excluded.resumen, orden=excluded.orden, ruta=excluded.ruta, posicion=excluded.posicion, requisitos=excluded.requisitos, actualizado_en=now();

insert into public.curso_contenido (curso_slug, archivo, contenido) values ('fortran-avanzado', 'curso.md', '---
slug: fortran-avanzado
titulo: "Fortran avanzado"
resumen: "Gestión de memoria, procedimientos genéricos, orientación a objetos y cálculo numérico robusto con Fortran moderno."
area: "Lenguajes"
nivel: AVANZADO
horas: 16
icono: fortran
precio: 20
estado: publico
acceso_libre: false
orden: 17
ruta:
  slug: programacion-fortran
  nombre: "Programación Fortran"
  descripcion: "Aprende Fortran desde cero y avanza hacia programación avanzada y desarrollo de software con pruebas, archivos e interoperabilidad."
  orden: 3
  posicion: 3
  requisitos: ["fortran-calculo-cientifico"]
---
') on conflict (curso_slug, archivo) do update set contenido=excluded.contenido, actualizado_en=now();

insert into public.curso_contenido (curso_slug, archivo, contenido) values ('fortran-avanzado', 'sesion-1.md', '---
numero: 1
titulo: "Memoria, punteros y propiedad de los datos"
---

# Objetivos y preparación

Esta sesión presupone arreglos y módulos del curso intermedio. Aprenderás a distinguir quién reserva memoria de quién referencia datos, transferir una reserva y evitar punteros inválidos. Guarda cada programa en un archivo independiente y compílalo con `gfortran -std=f2018 -Wall -Wextra -fcheck=all archivo.f90 -o programa`. Ejecuta `./programa` desde la misma carpeta. `-std` selecciona el estándar; `-Wall` y `-Wextra` activan advertencias; `-fcheck=all` añade comprobaciones durante la ejecución; `-o` establece el nombre de salida.

# Transferir una reserva

Un arreglo `allocatable` administra una reserva de memoria. `allocated` consulta si existe esa reserva; no debe consultarse `size` antes de comprobarla. `move_alloc(origen, destino)` transfiere la reserva al destino y deja el origen sin asignar. Si el destino ya estaba asignado, su reserva anterior se libera. El origen y el destino deben tener el mismo tipo, clase y rango.

El patrón siguiente amplía una serie: reserva espacio nuevo, copia los elementos conservados y transfiere la reserva. Los corchetes (`[]`) construyen un arreglo y el triplete `1:2` selecciona una sección. El programa comprueba tanto el contenido como el estado posterior del origen.

```fortran
program ampliar_serie
  implicit none
  integer, allocatable :: muestras(:), ampliadas(:)
  integer :: estado
  allocate(muestras(2), stat=estado)
  if (estado /= 0) error stop ''No se pudo reservar la serie''
  muestras = [12, 18]
  allocate(ampliadas(3), stat=estado)
  if (estado /= 0) error stop ''No se pudo ampliar la serie''
  ampliadas(1:2) = muestras
  ampliadas(3) = 24
  call move_alloc(ampliadas, muestras)
  if (allocated(ampliadas)) error stop ''El origen sigue asignado''
  if (any(muestras /= [12, 18, 24])) error stop ''Serie incorrecta''
  write(*,''(3(I0,1X))'') muestras
end program ampliar_serie
```

```salida
12 18 24
```

> Doc: [GNU Fortran: MOVE_ALLOC](https://gcc.gnu.org/onlinedocs/gfortran/MOVE_005fALLOC.html)

> Nota: ampliar de un elemento en un elemento copia repetidamente los datos. En colecciones extensas se separa longitud utilizada de capacidad y se reserva capacidad adicional por bloques. La transferencia final evita una copia adicional, pero no elimina la copia inicial de los valores conservados.

# Referenciar un destino existente

Un `pointer` representa una asociación. El atributo `target` permite que una variable sea destino de un puntero; `=>` es la asignación de asociación y `=` modifica el valor del destino asociado. `null()` inicializa un puntero sin asociación y `nullify` elimina la asociación sin liberar el destino.

Un puntero no prolonga la vida de su destino. No se utiliza después de que el destino se libere o deje de existir. Tampoco se supone que `associated` pueda reparar o consultar con seguridad una asociación que ya quedó indefinida.

# Práctica: modificar una sección sin perder la serie

Asocia un puntero al segundo y tercer elemento de `[10, 20, 30, 40]`, incrementa solo esa sección y elimina después la asociación. Antes de consultar la solución, decide qué diferencia produciría usar `=` en lugar de `=>` en la asociación.

```fortran
program editar_ventana
  implicit none
  integer, target :: serie(4) = [10, 20, 30, 40]
  integer, pointer :: ventana(:) => null()
  ventana => serie(2:3)
  ! verificar-error: ventana = ventana + 1 => ventana = ventana + 2
  ventana = ventana + 1
  nullify(ventana)
  if (associated(ventana)) error stop ''Asociacion conservada''
  if (any(serie /= [10, 21, 31, 40])) error stop ''Seccion incorrecta''
  write(*,''(4(I0,1X))'') serie
end program editar_ventana
```

```salida
10 21 31 40
```

> Doc: [Fortran-lang: punteros](https://fortran-lang.org/learn/f95_features/pointers/)

La solución modifica los elementos seleccionados en la serie original. Para comprobar tu variante, conserva las dos sentencias `if`: una asociación residual o una sección incorrecta deben terminar con error. No se llama a `deallocate(ventana)`, porque su destino es una sección de un arreglo que no se reservó mediante el puntero.

# Ejercicio en el navegador

Completa el programa y pulsa «Comprobar». El código se compila y ejecuta en tu navegador; cada intento comienza desde cero.

```ejercicio fortran
# Enunciado
Completa la operación que falta para que el programa cumpla las comprobaciones de esta sesión.
# Plantilla
program editar_ventana
  implicit none
  integer, target :: serie(4) = [10, 20, 30, 40]
  integer, pointer :: ventana(:) => null()
  ventana => serie(2:3)
  ___
  nullify(ventana)
  if (associated(ventana)) error stop ''Asociacion conservada''
  if (any(serie /= [10, 21, 31, 40])) error stop ''Seccion incorrecta''
  write(*,''(4(I0,1X))'') serie
end program editar_ventana
# Esperado
10 21 31 40
# Pista
Revisa la práctica resuelta de esta sesión y las condiciones que comprueba antes de imprimir la salida.
```

# Cierre

Quedaron diferenciadas reserva, transferencia y asociación. Puedes ampliar una colección sin perder sus valores y limitar la vida de una referencia. En la siguiente sesión definirás interfaces que permiten utilizar estas estructuras sin exponer su representación interna.
') on conflict (curso_slug, archivo) do update set contenido=excluded.contenido, actualizado_en=now();

insert into public.curso_contenido (curso_slug, archivo, contenido) values ('fortran-avanzado', 'sesion-2.md', '---
numero: 2
titulo: "Interfaces genéricas y argumentos opcionales"
---

# Objetivos y preparación

Aprenderás a ofrecer varias implementaciones bajo un nombre y a diseñar argumentos opcionales con valores predeterminados. Cada bloque contiene el módulo antes del programa que lo utiliza y se compila de manera independiente con las opciones de la sesión anterior. La interfaz de un procedimiento describe tipos, clases, rangos y atributos de sus argumentos; no constituye una prueba de que su cálculo sea correcto.

# Una operación para distintos tipos

El bloque `interface` declara un nombre genérico y `module procedure` enumera sus implementaciones. El compilador selecciona una implementación según los argumentos de la llamada. El tipo del resultado por sí solo no permite distinguir dos implementaciones. Una llamada que coincide con varias interfaces es ambigua y debe corregirse.

En el módulo siguiente, `private` oculta las implementaciones y `public` expone solo `doble`. `pure` declara procedimientos con restricciones sobre efectos laterales; `result` asigna un nombre a su resultado. El sufijo `_real64` fija la clase de la constante real.

```fortran
module escalas_genericas
  use iso_fortran_env, only: real64
  implicit none
  private
  public :: doble
  interface doble
    module procedure doble_entero, doble_real
  end interface
contains
  pure function doble_entero(cantidad) result(escalada)
    integer, intent(in) :: cantidad
    integer :: escalada
    escalada = 2 * cantidad
  end function doble_entero
  pure function doble_real(medida) result(escalada)
    real(real64), intent(in) :: medida
    real(real64) :: escalada
    escalada = 2.0_real64 * medida
  end function doble_real
end module escalas_genericas

program usar_escalas
  use iso_fortran_env, only: real64
  use escalas_genericas, only: doble
  implicit none
  if (doble(7) /= 14) error stop ''Escala entera incorrecta''
  if (abs(doble(1.25_real64) - 2.5_real64) > 1.e-12_real64) &
    error stop ''Escala real incorrecta''
  write(*,''(I0,1X,F5.2)'') doble(7), doble(1.25_real64)
end program usar_escalas
```

```salida
14  2.50
```

> Doc: [Fortran-lang: unidades de programa y procedimientos](https://fortran-lang.org/learn/f95_features/program_units_and_procedures/)

> Nota: el caso entero presupone que duplicar la cantidad cabe en el tipo. Un nombre genérico no convierte automáticamente enteros demasiado grandes ni agrega comprobaciones de desbordamiento.

# Argumentos que pueden omitirse

`optional` permite omitir un argumento y `present` comprueba si se proporcionó. Primero se establece el valor predeterminado y después, dentro de un `if`, se utiliza el argumento presente. Fortran no garantiza evaluación con cortocircuito: una expresión como `present(limite) .and. limite > 0` puede evaluar un argumento ausente. Las comprobaciones deben estar anidadas.

# Práctica: aplicar un desplazamiento opcional

Diseña `ajustar(valor, desplazamiento)` para que una llamada sin desplazamiento conserve el valor y una llamada con desplazamiento lo sume. La solución comprueba los dos caminos y usa un argumento por nombre en la segunda llamada, de modo que el propósito no dependa de recordar su posición.

```fortran
program ajuste_opcional
  implicit none
  if (ajustar(20) /= 20) error stop ''Fallo del valor predeterminado''
  if (ajustar(20, desplazamiento=-3) /= 17) error stop ''Fallo del ajuste''
  write(*,''(2(I0,1X))'') ajustar(20), ajustar(20, desplazamiento=-3)
contains
  pure function ajustar(valor, desplazamiento) result(ajustado)
    integer, intent(in) :: valor
    integer, intent(in), optional :: desplazamiento
    integer :: ajustado
    ajustado = valor
    if (present(desplazamiento)) then
  ! verificar-error: ajustado = ajustado + desplazamiento => ajustado = ajustado - desplazamiento
      ajustado = ajustado + desplazamiento
    end if
  end function ajustar
end program ajuste_opcional
```

```salida
20 17
```

> Doc: [GNU Fortran: PRESENT](https://gcc.gnu.org/onlinedocs/gfortran/PRESENT.html)

Conserva las comprobaciones al modificar la función. Si reemplazas la suma por una resta, debe fallar la llamada con desplazamiento negativo; probar solo la llamada sin argumento no detectaría ese defecto.

# Ejercicio en el navegador

Completa el programa y pulsa «Comprobar». El código se compila y ejecuta en tu navegador; cada intento comienza desde cero.

```ejercicio fortran
# Enunciado
Completa la operación que falta para que el programa cumpla las comprobaciones de esta sesión.
# Plantilla
program ajuste_opcional
  implicit none
  if (ajustar(20) /= 20) error stop ''Fallo del valor predeterminado''
  if (ajustar(20, desplazamiento=-3) /= 17) error stop ''Fallo del ajuste''
  write(*,''(2(I0,1X))'') ajustar(20), ajustar(20, desplazamiento=-3)
contains
  pure function ajustar(valor, desplazamiento) result(ajustado)
    integer, intent(in) :: valor
    integer, intent(in), optional :: desplazamiento
    integer :: ajustado
    ajustado = valor
    if (present(desplazamiento)) then
      ___
    end if
  end function ajustar
end program ajuste_opcional
# Esperado
20 17
# Pista
Revisa la práctica resuelta de esta sesión y las condiciones que comprueba antes de imprimir la salida.
```

# Cierre

Definiste una interfaz genérica verificable y un argumento opcional que se consulta de forma segura. La siguiente sesión asocia operaciones a tipos y utiliza polimorfismo para seleccionar un comportamiento durante la ejecución.
') on conflict (curso_slug, archivo) do update set contenido=excluded.contenido, actualizado_en=now();

insert into public.curso_contenido (curso_slug, archivo, contenido) values ('fortran-avanzado', 'sesion-3.md', '---
numero: 3
titulo: "Tipos con métodos y polimorfismo"
---

# Objetivos y preparación

Un tipo derivado puede agrupar estado y procedimientos asociados. En esta sesión definirás una operación asociada a un tipo y sustituirás su implementación en una extensión. Los ejemplos utilizan características incorporadas desde Fortran 2003 y se compilan como Fortran 2018. Cada bloque incluye todas sus dependencias.

# Asociar una operación a un tipo

Dentro del tipo, `contains` inicia la lista de procedimientos asociados. La declaración `procedure :: incrementar` registra la operación y el módulo contiene su implementación. Por omisión, la llamada `contador%incrementar()` pasa el objeto como primer argumento. `class(contador_muestras)` permite recibir el tipo declarado o una extensión; `intent(inout)` permite modificar el estado recibido.

La inicialización del componente en su declaración fija su estado inicial. `private` sobre el componente impide que otro módulo lo modifique directamente, mientras que el método de consulta expone el valor.

```fortran
module conteo
  implicit none
  private
  public :: contador_muestras
  type :: contador_muestras
    private
    integer :: total = 0
  contains
    procedure :: incrementar
    procedure :: cantidad
  end type contador_muestras
contains
  subroutine incrementar(este)
    class(contador_muestras), intent(inout) :: este
    este%total = este%total + 1
  end subroutine incrementar
  integer function cantidad(este)
    class(contador_muestras), intent(in) :: este
    cantidad = este%total
  end function cantidad
end module conteo

program contar_muestras
  use conteo, only: contador_muestras
  implicit none
  type(contador_muestras) :: contador
  call contador%incrementar()
  call contador%incrementar()
  if (contador%cantidad() /= 2) error stop ''Conteo incorrecto''
  write(*,''(I0)'') contador%cantidad()
end program contar_muestras
```

```salida
2
```

> Doc: [Fortran-lang: programación basada en objetos](https://fortran-lang.org/learn/oop_features_in_fortran/object_based_programming_techniques/)

# Extender y sustituir comportamiento

`extends(tipo_padre)` establece una extensión. El tipo hijo conserva los componentes del padre y puede sustituir un procedimiento asociado respetando la compatibilidad de su interfaz. Una variable `class(tipo_padre), allocatable` tiene un tipo declarado estable, pero su tipo dinámico depende de la reserva. La llamada al método usa ese tipo dinámico.

La composición, mediante un componente de otro tipo, suele bastar cuando solo se quieren agrupar datos. La extensión resulta útil cuando varios tipos deben responder a una misma operación con comportamientos distintos.

# Práctica: seleccionar una transformación

Implementa una transformación identidad y una extensión que duplique un valor. Reserva una variable polimórfica como la extensión y comprueba que la llamada utiliza la implementación hija. La solución contiene las dos implementaciones completas.

```fortran
module transformaciones
  implicit none
  type :: transformacion
    integer :: factor = 1
  contains
    procedure :: aplicar => identidad
  end type transformacion
  type, extends(transformacion) :: duplicadora
  contains
    procedure :: aplicar => duplicar
  end type duplicadora
contains
  integer function identidad(este, valor) result(salida)
    class(transformacion), intent(in) :: este
    integer, intent(in) :: valor
    salida = este%factor * valor
  end function identidad
  integer function duplicar(este, valor) result(salida)
    class(duplicadora), intent(in) :: este
    integer, intent(in) :: valor
  ! verificar-error: salida = 2 * este%factor * valor => salida = 3 * este%factor * valor
    salida = 2 * este%factor * valor
  end function duplicar
end module transformaciones

program seleccionar_transformacion
  use transformaciones, only: transformacion, duplicadora
  implicit none
  class(transformacion), allocatable :: operacion
  allocate(duplicadora :: operacion)
  if (operacion%aplicar(6) /= 12) error stop ''Despacho incorrecto''
  write(*,''(I0)'') operacion%aplicar(6)
  deallocate(operacion)
end program seleccionar_transformacion
```

```salida
12
```

> Doc: [Fortran-lang: extensiones y polimorfismo](https://fortran-lang.org/learn/oop_features_in_fortran/object_oriented_programming_techniques/)

`=>` en la declaración del procedimiento asocia un nombre público con su implementación; en este contexto no es una asociación de datos. El argumento `este` representa el objeto recibido. Ambas implementaciones consultan su componente `factor`, que comienza en uno; la extensión multiplica además por dos.

# Ejercicio en el navegador

Completa el programa y pulsa «Comprobar». El código se compila y ejecuta en tu navegador; cada intento comienza desde cero.

```ejercicio fortran
# Enunciado
Completa la operación que falta para que el programa cumpla las comprobaciones de esta sesión.
# Plantilla
module transformaciones
  implicit none
  type :: transformacion
    integer :: factor = 1
  contains
    procedure :: aplicar => identidad
  end type transformacion
  type, extends(transformacion) :: duplicadora
  contains
    procedure :: aplicar => duplicar
  end type duplicadora
contains
  integer function identidad(este, valor) result(salida)
    class(transformacion), intent(in) :: este
    integer, intent(in) :: valor
    salida = este%factor * valor
  end function identidad
  integer function duplicar(este, valor) result(salida)
    class(duplicadora), intent(in) :: este
    integer, intent(in) :: valor
    ___
  end function duplicar
end module transformaciones

program seleccionar_transformacion
  use transformaciones, only: transformacion, duplicadora
  implicit none
  class(transformacion), allocatable :: operacion
  allocate(duplicadora :: operacion)
  if (operacion%aplicar(6) /= 12) error stop ''Despacho incorrecto''
  write(*,''(I0)'') operacion%aplicar(6)
  deallocate(operacion)
end program seleccionar_transformacion
# Esperado
12
# Pista
Revisa la práctica resuelta de esta sesión y las condiciones que comprueba antes de imprimir la salida.
```

# Cierre

Construiste un tipo con estado privado y verificaste una llamada polimórfica. La última sesión examina un límite independiente del diseño de tipos: un programa bien organizado todavía puede producir resultados numéricos inválidos.
') on conflict (curso_slug, archivo) do update set contenido=excluded.contenido, actualizado_en=now();

insert into public.curso_contenido (curso_slug, archivo, contenido) values ('fortran-avanzado', 'sesion-4.md', '---
numero: 4
titulo: "Estabilidad numérica y operaciones independientes"
---

# Objetivos y preparación

Aprenderás a rechazar valores no finitos, validar resultados con tolerancias y expresar cálculos independientes. `real64`, del módulo intrínseco `iso_fortran_env`, identifica una clase real de 64 bits cuando el procesador la ofrece. Más precisión no corrige un algoritmo inestable ni sustituye la validación de entrada.

# Detectar valores no finitos

El módulo `ieee_arithmetic` ofrece consultas relacionadas con la aritmética del Institute of Electrical and Electronics Engineers (IEEE). `ieee_is_finite` distingue valores finitos de infinitos y de valores que no representan un número, llamados NaN por *Not a Number*. NaN no se detecta de forma fiable con una comprobación de intervalo. Primero se comprueba finitud y luego se aplica el criterio del dominio.

La creación del NaN siguiente es deliberada y sirve para verificar el rechazo. `ieee_support_nan` comprueba si el procesador admite esa representación para la clase utilizada.

```fortran
program filtrar_no_finitos
  use iso_fortran_env, only: real64
  use, intrinsic :: ieee_arithmetic, only: ieee_is_finite, ieee_value, &
    ieee_quiet_nan, ieee_support_nan
  implicit none
  real(real64) :: medidas(3)
  logical :: validas(3)
  if (.not. ieee_support_nan(0.0_real64)) error stop ''NaN no disponible''
  medidas = [1.0_real64, ieee_value(0.0_real64, ieee_quiet_nan), 3.0_real64]
  validas = ieee_is_finite(medidas)
  if (count(validas) /= 2) error stop ''Filtro incorrecto''
  write(*,''(I0)'') count(validas)
end program filtrar_no_finitos
```

```salida
2
```

> Doc: [GNU Fortran: módulos IEEE](https://gcc.gnu.org/onlinedocs/gfortran/IEEE-modules.html)

> Nota: las optimizaciones que permiten suponer ausencia de NaN o infinitos pueden invalidar estos filtros. Esta ruta no utiliza `-ffast-math`. La documentación de GNU especifica opciones adicionales cuando se requiere conformidad IEEE completa; el ejemplo no certifica esa conformidad para todos los procesadores.

# Comparar con una escala explícita

Para dos resultados finitos, una comprobación útil es `abs(obtenido - esperado) <= absoluta + relativa * abs(esperado)`. La tolerancia absoluta controla errores cerca de cero y la relativa escala con el valor de referencia. Ambas dependen del algoritmo y de las unidades: no existe una constante universal para todos los problemas. Deben elegirse antes de observar un fallo, a partir del error aceptable.

# Práctica: calcular energías por elemento

Calcula las energías cinéticas de tres cuerpos y comprueba cada resultado. `do concurrent` declara que las iteraciones cumplen restricciones de independencia; no garantiza ejecución paralela ni mejora de velocidad. Cada iteración escribe un elemento diferente y solo lee entradas que no se modifican. El índice `cuerpo` es local al constructo.

```fortran
program energias_independientes
  use iso_fortran_env, only: real64
  use, intrinsic :: ieee_arithmetic, only: ieee_is_finite
  implicit none
  integer :: cuerpo
  real(real64) :: masa(3), velocidad(3), energia(3), referencia(3)
  real(real64), parameter :: tolerancia = 1.e-12_real64
  masa = [2.0_real64, 4.0_real64, 6.0_real64]
  velocidad = [3.0_real64, 2.0_real64, 1.0_real64]
  referencia = [9.0_real64, 8.0_real64, 3.0_real64]
  if (.not. all(ieee_is_finite(masa))) error stop ''Masa no finita''
  if (any(masa < 0.0_real64)) error stop ''Masa negativa''
  if (.not. all(ieee_is_finite(velocidad))) error stop ''Velocidad no finita''
  do concurrent (cuerpo = 1:size(masa))
  ! verificar-error: velocidad(cuerpo)**2 => velocidad(cuerpo)**3
    energia(cuerpo) = 0.5_real64 * masa(cuerpo) * velocidad(cuerpo)**2
  end do
  if (.not. all(ieee_is_finite(energia))) error stop ''Energia no finita''
  if (any(abs(energia - referencia) > tolerancia)) error stop ''Calculo incorrecto''
  write(*,''(3(F5.2,1X))'') energia
end program energias_independientes
```

```salida
 9.00  8.00  3.00
```

> Doc: [GNU Fortran: estado de soporte de Fortran 2008](https://gcc.gnu.org/onlinedocs/gfortran/Fortran-2008-status.html)

Para comprobar que las pruebas detectan errores, sustituye la potencia `**2` por `**3`: el programa debe terminar en la comprobación del cálculo. Una suma acumulada compartida dentro de este bucle incumpliría su independencia; las reducciones requieren un diseño y soporte de estándar adecuados.

# Medir antes de optimizar

Se valida primero una implementación de referencia y después se mide otra que produce resultados equivalentes dentro de tolerancia. Un tiempo aislado mezcla calentamiento, carga del sistema y tamaño de entrada. Documenta compilador, opciones, dimensiones y varias repeticiones. Los arreglos de Fortran almacenan contiguamente los elementos que varían en el primer índice; respetar ese recorrido puede reducir accesos dispersos. Esta propiedad orienta una medición, pero no constituye por sí sola un resultado de rendimiento.

> Doc: [Fortran-lang: arreglos multidimensionales](https://fortran-lang.org/learn/best_practices/multidim_arrays/)

# Ejercicio en el navegador

Completa el programa y pulsa «Comprobar». El código se compila y ejecuta en tu navegador; cada intento comienza desde cero.

```ejercicio fortran
# Enunciado
Completa la operación que falta para que el programa cumpla las comprobaciones de esta sesión.
# Plantilla
program energias_independientes
  use iso_fortran_env, only: real64
  use, intrinsic :: ieee_arithmetic, only: ieee_is_finite
  implicit none
  integer :: cuerpo
  real(real64) :: masa(3), velocidad(3), energia(3), referencia(3)
  real(real64), parameter :: tolerancia = 1.e-12_real64
  masa = [2.0_real64, 4.0_real64, 6.0_real64]
  velocidad = [3.0_real64, 2.0_real64, 1.0_real64]
  referencia = [9.0_real64, 8.0_real64, 3.0_real64]
  if (.not. all(ieee_is_finite(masa))) error stop ''Masa no finita''
  if (any(masa < 0.0_real64)) error stop ''Masa negativa''
  if (.not. all(ieee_is_finite(velocidad))) error stop ''Velocidad no finita''
  do concurrent (cuerpo = 1:size(masa))
    energia(cuerpo) = 0.5_real64 * masa(cuerpo) * ___
  end do
  if (.not. all(ieee_is_finite(energia))) error stop ''Energia no finita''
  if (any(abs(energia - referencia) > tolerancia)) error stop ''Calculo incorrecto''
  write(*,''(3(F5.2,1X))'') energia
end program energias_independientes
# Esperado
 9.00  8.00  3.00
# Pista
Revisa la práctica resuelta de esta sesión y las condiciones que comprueba antes de imprimir la salida.
```

# Cierre

Completaste el nivel avanzado: memoria, interfaces, objetos y validación numérica. El curso Fortran aplicado a la ingeniería de software integra estas decisiones en bibliotecas con contratos, pruebas y entradas externas verificables.
') on conflict (curso_slug, archivo) do update set contenido=excluded.contenido, actualizado_en=now();

insert into public.curso_sesiones (curso_slug, archivo, numero, titulo, slug) values ('fortran-avanzado', 'sesion-1.md', 1, 'Memoria, punteros y propiedad de los datos', 'sesion-1') on conflict (curso_slug, archivo) do update set numero=excluded.numero, titulo=excluded.titulo, slug=excluded.slug;

insert into public.curso_sesiones (curso_slug, archivo, numero, titulo, slug) values ('fortran-avanzado', 'sesion-2.md', 2, 'Interfaces genéricas y argumentos opcionales', 'sesion-2') on conflict (curso_slug, archivo) do update set numero=excluded.numero, titulo=excluded.titulo, slug=excluded.slug;

insert into public.curso_sesiones (curso_slug, archivo, numero, titulo, slug) values ('fortran-avanzado', 'sesion-3.md', 3, 'Tipos con métodos y polimorfismo', 'sesion-3') on conflict (curso_slug, archivo) do update set numero=excluded.numero, titulo=excluded.titulo, slug=excluded.slug;

insert into public.curso_sesiones (curso_slug, archivo, numero, titulo, slug) values ('fortran-avanzado', 'sesion-4.md', 4, 'Estabilidad numérica y operaciones independientes', 'sesion-4') on conflict (curso_slug, archivo) do update set numero=excluded.numero, titulo=excluded.titulo, slug=excluded.slug;

commit;

