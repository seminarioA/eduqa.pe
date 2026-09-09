---
numero: 2
titulo: "Pruebas unitarias y detección de regresiones"
---

# Objetivos y preparación

Una prueba unitaria llama a una operación con entradas conocidas y verifica su resultado. En esta sesión comprobarás el contrato de `media` sin leer archivos ni argumentos de terminal. Cada bloque incluye el módulo necesario; compílalo con las opciones de comprobación de la primera sesión.

# Elegir casos que distingan errores

La batería contiene cinco casos: una serie de dos elementos, una sola observación, una serie vacía, un valor fuera del dominio y un valor NaN, abreviatura de *Not a Number*. Los dos primeros comprueban resultados válidos; los otros tres comprueban rechazos. Una prueba que solo recorra el caso habitual no verifica las ramas de error.

En cálculos reales, la comparación usa una tolerancia absoluta de `1.e-12_real64`, adecuada para estos valores pequeños y operaciones concretas. No es una tolerancia universal. Antes se comprueba que el resultado sea finito: una comparación de error absoluto por sí sola puede aceptar un NaN si se escribe como «fallar solo cuando el error sea mayor que el umbral».

# Práctica: detectar un divisor incorrecto

Ejecuta la batería completa. Después cambia el divisor de la media de `size(valores)` a `size(valores)+1`. La prueba del caso normal debe terminar con estado distinto de cero y el mensaje `Media incorrecta`. Restituye el divisor y vuelve a ejecutar. Ese cambio deliberado comprueba que la batería detecta la regresión que pretende evitar.

```fortran
! verificar-error: real(size(valores), real64) => real(size(valores)+1, real64)
module estadistica
  use iso_fortran_env, only: real64
  use, intrinsic :: ieee_arithmetic, only: ieee_is_finite
  implicit none
  private
  public :: media
contains
  pure subroutine media(valores, promedio, estado)
    implicit none
    real(real64), intent(in) :: valores(:)
    real(real64), intent(out) :: promedio
    integer, intent(out) :: estado
    promedio = 0.0_real64
    estado = 1
    if (size(valores) < 1 .or. size(valores) > 100000) return
    estado = 2
    if (.not. all(ieee_is_finite(valores))) return
    if (any(abs(valores) > 1.e6_real64)) return
    promedio = sum(valores) / real(size(valores), real64)
    estado = 0
  end subroutine media
end module estadistica

program pruebas
  use iso_fortran_env, only: real64
  use, intrinsic :: ieee_arithmetic, only: ieee_value, ieee_quiet_nan, ieee_is_finite
  use estadistica, only: media
  implicit none
  real(real64) :: promedio
  integer :: estado
  call media([10.0_real64, 14.0_real64], promedio, estado)
  call exigir(estado == 0, 'Caso normal rechazado')
  call exigir(ieee_is_finite(promedio), 'Resultado no finito')
  call exigir(abs(promedio - 12.0_real64) < 1.e-12_real64, 'Media incorrecta')
  call media([7.0_real64], promedio, estado)
  call exigir(estado == 0, 'Observacion unica rechazada')
  call exigir(ieee_is_finite(promedio), 'Resultado unico no finito')
  call exigir(abs(promedio - 7.0_real64) < 1.e-12_real64, 'Observacion incorrecta')
  call media([real(real64) ::], promedio, estado)
  call exigir(estado == 1, 'Serie vacia aceptada')
  call media([2.e6_real64], promedio, estado)
  call exigir(estado == 2, 'Fuera de limite aceptado')
  call media([ieee_value(0.0_real64, ieee_quiet_nan)], promedio, estado)
  call exigir(estado == 2, 'NaN aceptado')
  write(*,'(A)') 'Cinco casos verificados'
contains
  subroutine exigir(condicion, mensaje)
    implicit none
    logical, intent(in) :: condicion
    character(len=*), intent(in) :: mensaje
    if (.not. condicion) then
      write(*,'(A)') mensaje
      error stop 1
    end if
  end subroutine exigir
end program pruebas
```

```salida
Cinco casos verificados
```

> Doc: [Módulos IEEE de GNU Fortran](https://gcc.gnu.org/onlinedocs/gfortran/IEEE-modules.html)

`ieee_value` construye el NaN silencioso del último caso. `exigir` recibe una condición y un mensaje; si la condición es falsa, `error stop 1` termina la ejecución con error. Así Make y un sistema de integración continua pueden reconocer el fallo por el estado del proceso, sin interpretar texto.

# Ejecutar la batería en un proyecto

Descarga el proyecto de la primera sesión, extrae el archivo y ejecuta `make test`. El objetivo compila la biblioteca, ejecuta la batería Fortran y ejecuta el consumidor C. Ejecuta `make clean` y otra vez `make test` para comprobar que no dependías de archivos objeto antiguos. `clean` elimina únicamente los archivos generados enumerados en el Makefile.

En integración continua, usa una instalación conocida de los compiladores, registra sus versiones y ejecuta esos mismos objetivos desde una copia limpia del repositorio. No continúes con la publicación si `make test` devuelve un estado de error. La prueba unitaria valida el cálculo; la sesión siguiente añade pruebas de las entradas externas.

# Ejercicio en el navegador

Completa el programa y pulsa «Comprobar». El código se compila y ejecuta en tu navegador; cada intento comienza desde cero.

```ejercicio fortran
# Enunciado
Completa la operación que falta para que el programa cumpla las comprobaciones de esta sesión.
# Plantilla
module estadistica
  use iso_fortran_env, only: real64
  use, intrinsic :: ieee_arithmetic, only: ieee_is_finite
  implicit none
  private
  public :: media
contains
  pure subroutine media(valores, promedio, estado)
    implicit none
    real(real64), intent(in) :: valores(:)
    real(real64), intent(out) :: promedio
    integer, intent(out) :: estado
    promedio = 0.0_real64
    estado = 1
    if (size(valores) < 1 .or. size(valores) > 100000) return
    estado = 2
    if (.not. all(ieee_is_finite(valores))) return
    if (any(abs(valores) > 1.e6_real64)) return
    promedio = sum(valores) / ___
    estado = 0
  end subroutine media
end module estadistica

program pruebas
  use iso_fortran_env, only: real64
  use, intrinsic :: ieee_arithmetic, only: ieee_value, ieee_quiet_nan, ieee_is_finite
  use estadistica, only: media
  implicit none
  real(real64) :: promedio
  integer :: estado
  call media([10.0_real64, 14.0_real64], promedio, estado)
  call exigir(estado == 0, 'Caso normal rechazado')
  call exigir(ieee_is_finite(promedio), 'Resultado no finito')
  call exigir(abs(promedio - 12.0_real64) < 1.e-12_real64, 'Media incorrecta')
  call media([7.0_real64], promedio, estado)
  call exigir(estado == 0, 'Observacion unica rechazada')
  call exigir(ieee_is_finite(promedio), 'Resultado unico no finito')
  call exigir(abs(promedio - 7.0_real64) < 1.e-12_real64, 'Observacion incorrecta')
  call media([real(real64) ::], promedio, estado)
  call exigir(estado == 1, 'Serie vacia aceptada')
  call media([2.e6_real64], promedio, estado)
  call exigir(estado == 2, 'Fuera de limite aceptado')
  call media([ieee_value(0.0_real64, ieee_quiet_nan)], promedio, estado)
  call exigir(estado == 2, 'NaN aceptado')
  write(*,'(A)') 'Cinco casos verificados'
contains
  subroutine exigir(condicion, mensaje)
    implicit none
    logical, intent(in) :: condicion
    character(len=*), intent(in) :: mensaje
    if (.not. condicion) then
      write(*,'(A)') mensaje
      error stop 1
    end if
  end subroutine exigir
end program pruebas
# Esperado
Cinco casos verificados
# Pista
Revisa la práctica resuelta de esta sesión y las condiciones que comprueba antes de imprimir la salida.
```

# Cierre

Comprobaste cinco casos del contrato y una modificación incorrecta que debe ser rechazada. En la siguiente sesión distinguirás el fin normal de un archivo de los errores de lectura y validarás texto antes de convertirlo en mediciones.
