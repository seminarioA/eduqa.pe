---
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
  if (contador%cantidad() /= 2) error stop 'Conteo incorrecto'
  write(*,'(I0)') contador%cantidad()
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
  if (operacion%aplicar(6) /= 12) error stop 'Despacho incorrecto'
  write(*,'(I0)') operacion%aplicar(6)
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
  if (operacion%aplicar(6) /= 12) error stop 'Despacho incorrecto'
  write(*,'(I0)') operacion%aplicar(6)
  deallocate(operacion)
end program seleccionar_transformacion
# Esperado
12
# Pista
Revisa la práctica resuelta de esta sesión y las condiciones que comprueba antes de imprimir la salida.
```

# Cierre

Construiste un tipo con estado privado y verificaste una llamada polimórfica. La última sesión examina un límite independiente del diseño de tipos: un programa bien organizado todavía puede producir resultados numéricos inválidos.
