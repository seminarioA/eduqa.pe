---
numero: 1
titulo: "Bibliotecas, contratos y compilación reproducible"
---

# Objetivos y preparación

Este curso aplica los módulos, la memoria y los procedimientos estudiados en Fortran avanzado. Construirás una biblioteca de estadística, un programa de terminal y un consumidor escrito en C. El objetivo es que otro desarrollador pueda compilar el proyecto, comprobarlo y reconocer una entrada inválida.

Necesitas GNU Fortran, un compilador C y Make. En Ubuntu puedes instalarlos con `sudo apt install gfortran build-essential`; en macOS, instala las herramientas de línea de comandos de Xcode y GNU Fortran. Comprueba la instalación con `gfortran --version`, `cc --version` y `make --version`. Cada bloque Fortran incluye sus dependencias: guárdalo en un archivo independiente y ejecuta `gfortran -std=f2018 -Wall -Wextra -fcheck=all archivo.f90 -o programa`, seguido de `./programa`.

`-std=f2018` selecciona Fortran 2018; `-Wall` y `-Wextra` activan advertencias; `-fcheck=all` añade comprobaciones durante la ejecución; `-o` nombra el ejecutable. También puedes editar y ejecutar los ejemplos y resolver el ejercicio de cada sesión directamente en el navegador. Al abrir el curso se descarga y prepara el compilador WebAssembly; cada intento usa memoria y archivos virtuales independientes. El sandbox de la ruta permite practicar con programas propios y archivos de entrada.

# Definir el contrato de una biblioteca

Una biblioteca recibe valores y devuelve resultados; la interfaz de terminal convierte texto en esos valores. Separar ambas responsabilidades permite probar el cálculo sin simular el teclado y reutilizarlo desde C.

El procedimiento `media` admite entre una y cien mil mediciones finitas, cada una con valor absoluto de hasta un millón. Devuelve el promedio y un estado: cero indica éxito, uno indica una cantidad inválida y dos indica valores inválidos. Ante un error, el promedio se inicializa a cero, pero el consumidor debe consultar el estado antes de utilizarlo. Estos límites pertenecen al contrato del proyecto, no al lenguaje.

`private` oculta los nombres del módulo por omisión y `public :: media` expone su operación. `intent(in)` impide modificar la entrada a través de ese argumento; `intent(out)` declara resultados que el procedimiento debe asignar. `pure` restringe efectos secundarios y permite razonar sobre el cálculo a partir de sus argumentos.

# Práctica: rechazar una serie vacía

Implementa el contrato y comprueba tanto una serie válida como un arreglo vacío. La guarda de tamaño debe ejecutarse antes de dividir. La implementación de referencia siguiente contiene el módulo y su consumidor para que puedas compilar el bloque completo desde cero.

```fortran
! verificar-error: size(valores) < 1 => size(valores) < 0
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

program consumir_biblioteca
  use iso_fortran_env, only: real64
  use estadistica, only: media
  implicit none
  real(real64) :: promedio
  integer :: estado
  call media([10.0_real64, 14.0_real64, 18.0_real64], promedio, estado)
  if (estado /= 0) error stop 'Mediciones validas rechazadas'
  if (abs(promedio - 14.0_real64) > 1.e-12_real64) error stop 'Media incorrecta'
  call media([real(real64) ::], promedio, estado)
  if (estado /= 1) error stop 'Serie vacia aceptada'
  write(*,'(A)') 'Contrato de biblioteca verificado'
end program consumir_biblioteca
```

```salida
Contrato de biblioteca verificado
```

> Doc: [Organización de módulos y procedimientos](https://fortran-lang.org/learn/quickstart/organising_code/#modules)

El constructor `[real(real64) ::]` crea un arreglo vacío del tipo indicado. Si cambias la condición de rechazo de tamaño menor que uno a tamaño menor que cero, el consumidor termina con error: la prueba comprueba el contrato, no solo que el programa imprima un mensaje.

# Compilar archivos separados

En el [proyecto descargable](/fortran/analizador.zip), `estadistica.f90` contiene el módulo y `analizador.f90` contiene la interfaz de terminal. El compilador produce un archivo objeto `.o` y un archivo de interfaz `.mod` para el módulo. Compila el módulo antes que sus consumidores. `-c` compila sin enlazar; el enlace combina los objetos y las bibliotecas de ejecución en un ejecutable.

Ejecuta `make` dentro de la carpeta extraída. El archivo `Makefile` declara que `analizador` depende de su fuente y de `estadistica.o`; por eso un cambio en el módulo obliga a reconstruir el programa. No distribuyas archivos `.mod` como sustitutos de las fuentes: dependen del compilador empleado.

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
    if (___ .or. size(valores) > 100000) return
    estado = 2
    if (.not. all(ieee_is_finite(valores))) return
    if (any(abs(valores) > 1.e6_real64)) return
    promedio = sum(valores) / real(size(valores), real64)
    estado = 0
  end subroutine media
end module estadistica

program consumir_biblioteca
  use iso_fortran_env, only: real64
  use estadistica, only: media
  implicit none
  real(real64) :: promedio
  integer :: estado
  call media([10.0_real64, 14.0_real64, 18.0_real64], promedio, estado)
  if (estado /= 0) error stop 'Mediciones validas rechazadas'
  if (abs(promedio - 14.0_real64) > 1.e-12_real64) error stop 'Media incorrecta'
  call media([real(real64) ::], promedio, estado)
  if (estado /= 1) error stop 'Serie vacia aceptada'
  write(*,'(A)') 'Contrato de biblioteca verificado'
end program consumir_biblioteca
# Esperado
Contrato de biblioteca verificado
# Pista
Revisa la práctica resuelta de esta sesión y las condiciones que comprueba antes de imprimir la salida.
```

# Cierre

Definiste una interfaz con estados de error, separaste cálculo de entrada y comprendiste el orden de compilación. La siguiente sesión convierte ese contrato en pruebas repetibles y comprueba que detectan una regresión.
