---
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
  if (doble(7) /= 14) error stop 'Escala entera incorrecta'
  if (abs(doble(1.25_real64) - 2.5_real64) > 1.e-12_real64) &
    error stop 'Escala real incorrecta'
  write(*,'(I0,1X,F5.2)') doble(7), doble(1.25_real64)
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
  if (ajustar(20) /= 20) error stop 'Fallo del valor predeterminado'
  if (ajustar(20, desplazamiento=-3) /= 17) error stop 'Fallo del ajuste'
  write(*,'(2(I0,1X))') ajustar(20), ajustar(20, desplazamiento=-3)
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
  if (ajustar(20) /= 20) error stop 'Fallo del valor predeterminado'
  if (ajustar(20, desplazamiento=-3) /= 17) error stop 'Fallo del ajuste'
  write(*,'(2(I0,1X))') ajustar(20), ajustar(20, desplazamiento=-3)
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
