---
numero: 4
titulo: "Interoperabilidad con C y proyecto final"
---

# Objetivos y preparación

Una interfaz de interoperabilidad permite que otro lenguaje invoque una operación de Fortran con tipos y convenciones acordados. En esta sesión expondrás `media` a C, ejecutarás un consumidor real y prepararás la entrega del proyecto. Necesitas los compiladores y Make indicados en la primera sesión.

# Definir la interfaz binaria

`bind(C, name='media_c')` declara una rutina interoperable con C y fija su nombre externo. `iso_c_binding` proporciona `c_int` y `c_double`, correspondientes a `int` y `double`. El atributo `value` hace que la cantidad se reciba por valor; los argumentos de salida se reciben mediante direcciones desde C.

`valores(*)` es un arreglo de tamaño asumido: su extensión no acompaña automáticamente a la dirección. El consumidor debe proporcionar memoria válida para al menos `cantidad` elementos. La rutina comprueba el rango de la cantidad antes de construir una sección, pero no puede comprobar que un puntero C arbitrario tenga esa memoria. No se admiten punteros nulos para los argumentos del contrato.

La conversión explícita entre `c_double` y `real64` evita asumir que sus identificadores de clase son iguales en todos los compiladores. La biblioteca conserva su interfaz Fortran y el adaptador contiene las decisiones de interoperabilidad.

# Práctica: comprobar el adaptador

El bloque reúne biblioteca, adaptador y un programa Fortran que comprueba el adaptador. Cambia su conversión de `resultado_local` para sumarle uno: la comprobación de la media debe fallar. Esta prueba es útil antes de enlazar con otro lenguaje; la prueba C posterior verifica además el enlace y el paso de argumentos real.

```fortran
! verificar-error: real(resultado_local, c_double) => real(resultado_local + 1.0_real64, c_double)
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

module interfaz_c
  use iso_c_binding, only: c_int, c_double
  use iso_fortran_env, only: real64
  use estadistica, only: media
  implicit none
contains
  subroutine media_c(cantidad, valores, promedio, estado) bind(C, name='media_c')
    implicit none
    integer(c_int), value :: cantidad
    real(c_double), intent(in) :: valores(*)
    real(c_double), intent(out) :: promedio
    integer(c_int), intent(out) :: estado
    real(real64) :: resultado_local
    integer :: estado_local
    promedio = 0.0_c_double
    estado = 1_c_int
    if (cantidad < 1 .or. cantidad > 100000) return
    call media(real(valores(1:cantidad), real64), resultado_local, estado_local)
    promedio = real(resultado_local, c_double)
    estado = int(estado_local, c_int)
  end subroutine media_c
end module interfaz_c

program comprobar_interfaz
  use iso_c_binding, only: c_double, c_int
  use interfaz_c, only: media_c
  implicit none
  real(c_double) :: promedio
  integer(c_int) :: estado
  call media_c(3_c_int, [10.0_c_double,14.0_c_double,18.0_c_double], promedio, estado)
  if (estado /= 0) error stop 'Interfaz rechazo la serie'
  if (abs(promedio-14.0_c_double) > 1.e-12_c_double) error stop 'Interfaz devolvio otra media'
  call media_c(0_c_int, [0.0_c_double], promedio, estado)
  if (estado /= 1) error stop 'Interfaz acepto longitud cero'
  write(*,'(A)') 'Interfaz interoperable verificada'
end program comprobar_interfaz
```

```salida
Interfaz interoperable verificada
```

> Doc: [Interoperabilidad de Fortran con C](https://gcc.gnu.org/onlinedocs/gfortran/Interoperability-with-C.html)

# Ejecutar un consumidor C

El archivo `consumidor.c` del proyecto usa el siguiente código. Su prototipo debe coincidir con el adaptador Fortran. El operador `&` obtiene la dirección de una variable; las salidas se escriben en las direcciones de `promedio` y `estado`. El consumidor comprueba una media válida, el rechazo de una longitud cero y el rechazo de un NaN.

```c !sin-consola
#include <math.h>
#include <stdio.h>

void media_c(int cantidad, const double *valores, double *promedio, int *estado);

int main(void) {
    double valores[] = {10.0, 14.0, 18.0};
    double promedio;
    int estado;
    media_c(3, valores, &promedio, &estado);
    if (estado != 0 || !isfinite(promedio) || fabs(promedio - 14.0) > 1e-12) return 1;
    printf("Media desde C: %.6f\n", promedio);
    media_c(0, valores, &promedio, &estado);
    if (estado != 1) return 1;
    valores[0] = NAN;
    media_c(3, valores, &promedio, &estado);
    if (estado != 2) return 1;
    return 0;
}
```

Este bloque depende de `estadistica.f90` e `interfaz_c.f90` del proyecto. Ejecuta `make test` desde la carpeta extraída. El Makefile compila C con `cc`, Fortran con `gfortran` y realiza el enlace final con `gfortran` para incorporar sus bibliotecas de ejecución. `-lm` enlaza la biblioteca matemática; no necesitas calcular a mano el resultado esperado para comprobar el proceso.

# Proyecto final: analizador de mediciones

[Descarga el proyecto completo](/fortran/analizador.zip). El archivo incluye las fuentes Fortran y C, las pruebas, el Makefile y un README con el contrato y los comandos. No incluye ejecutables: compílalos en tu equipo.

La entrega debe satisfacer estos criterios:

- `make clean` seguido de `make test` compila desde cero y finaliza sin errores.
- `make run` acepta las tres mediciones del proyecto y presenta su cantidad y media.
- La biblioteca rechaza series vacías, valores no finitos y magnitudes fuera del contrato.
- La terminal rechaza texto, listas dentro de un argumento y argumentos vacíos o demasiado largos.
- El consumidor C comprueba resultados y estados, sin asumir que toda llamada tuvo éxito.
- El README describe las herramientas, los límites de entrada, los estados y la forma de ejecutar las pruebas.

Como revisión de la entrega, introduce el divisor incorrecto de la segunda sesión y comprueba que `make test` falla; después restaura el código. Esta revisión ya se ha ejecutado sobre el proyecto de referencia, junto con diez casos de entrada inválida de la terminal.

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
    promedio = sum(valores) / real(size(valores), real64)
    estado = 0
  end subroutine media
end module estadistica

module interfaz_c
  use iso_c_binding, only: c_int, c_double
  use iso_fortran_env, only: real64
  use estadistica, only: media
  implicit none
contains
  subroutine media_c(cantidad, valores, promedio, estado) bind(C, name='media_c')
    implicit none
    integer(c_int), value :: cantidad
    real(c_double), intent(in) :: valores(*)
    real(c_double), intent(out) :: promedio
    integer(c_int), intent(out) :: estado
    real(real64) :: resultado_local
    integer :: estado_local
    promedio = 0.0_c_double
    estado = 1_c_int
    if (cantidad < 1 .or. cantidad > 100000) return
    call media(real(valores(1:cantidad), real64), resultado_local, estado_local)
    promedio = ___
    estado = int(estado_local, c_int)
  end subroutine media_c
end module interfaz_c

program comprobar_interfaz
  use iso_c_binding, only: c_double, c_int
  use interfaz_c, only: media_c
  implicit none
  real(c_double) :: promedio
  integer(c_int) :: estado
  call media_c(3_c_int, [10.0_c_double,14.0_c_double,18.0_c_double], promedio, estado)
  if (estado /= 0) error stop 'Interfaz rechazo la serie'
  if (abs(promedio-14.0_c_double) > 1.e-12_c_double) error stop 'Interfaz devolvio otra media'
  call media_c(0_c_int, [0.0_c_double], promedio, estado)
  if (estado /= 1) error stop 'Interfaz acepto longitud cero'
  write(*,'(A)') 'Interfaz interoperable verificada'
end program comprobar_interfaz
# Esperado
Interfaz interoperable verificada
# Pista
Revisa la práctica resuelta de esta sesión y las condiciones que comprueba antes de imprimir la salida.
```

# Cierre

Completaste una biblioteca con contrato explícito, pruebas que detectan regresiones, validación de entradas e interoperabilidad real con C. La ruta de Fortran concluye con un proyecto que otra persona puede compilar y comprobar desde sus fuentes.
