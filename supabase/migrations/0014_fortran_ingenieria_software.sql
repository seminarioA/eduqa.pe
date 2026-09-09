-- Generado desde los Markdown. Aplicar como una sola transacción.

-- Conserva precio, estado, acceso y matrículas de cursos existentes.

begin;

insert into public.rutas (slug, nombre, descripcion, orden) values ('programacion-fortran', 'Programación Fortran', 'Aprende Fortran desde cero y avanza hacia programación avanzada y desarrollo de software con pruebas, archivos e interoperabilidad.', 3) on conflict (slug) do update set nombre=excluded.nombre, descripcion=excluded.descripcion, orden=excluded.orden;

insert into public.cursos (slug, titulo, resumen, precio, estado, acceso_libre, orden, ruta, posicion, requisitos) values ('fortran-ingenieria-software', 'Fortran aplicado a la ingeniería de software', 'Diseña bibliotecas, automatiza pruebas, valida archivos y conecta Fortran con C en un proyecto reproducible.', 20, 'publico', false, 18, 'programacion-fortran', 4, array['fortran-avanzado']::text[]) on conflict (slug) do update set titulo=excluded.titulo, resumen=excluded.resumen, orden=excluded.orden, ruta=excluded.ruta, posicion=excluded.posicion, requisitos=excluded.requisitos, actualizado_en=now();

insert into public.curso_contenido (curso_slug, archivo, contenido) values ('fortran-ingenieria-software', 'curso.md', '---
slug: fortran-ingenieria-software
titulo: "Fortran aplicado a la ingeniería de software"
resumen: "Diseña bibliotecas, automatiza pruebas, valida archivos y conecta Fortran con C en un proyecto reproducible."
area: "Lenguajes"
nivel: AVANZADO
horas: 16
icono: fortran
precio: 20
estado: publico
acceso_libre: false
orden: 18
ruta:
  slug: programacion-fortran
  nombre: "Programación Fortran"
  descripcion: "Aprende Fortran desde cero y avanza hacia programación avanzada y desarrollo de software con pruebas, archivos e interoperabilidad."
  orden: 3
  posicion: 4
  requisitos: ["fortran-avanzado"]
---
') on conflict (curso_slug, archivo) do update set contenido=excluded.contenido, actualizado_en=now();

insert into public.curso_contenido (curso_slug, archivo, contenido) values ('fortran-ingenieria-software', 'sesion-1.md', '---
numero: 1
titulo: "Bibliotecas, contratos y compilación reproducible"
---

# Objetivos y preparación

Este curso aplica los módulos, la memoria y los procedimientos estudiados en Fortran avanzado. Construirás una biblioteca de estadística, un programa de terminal y un consumidor escrito en C. El objetivo es que otro desarrollador pueda compilar el proyecto, comprobarlo y reconocer una entrada inválida.

Necesitas GNU Fortran, un compilador C y Make. En Ubuntu puedes instalarlos con `sudo apt install gfortran build-essential`; en macOS, instala las herramientas de línea de comandos de Xcode y GNU Fortran. Comprueba la instalación con `gfortran --version`, `cc --version` y `make --version`. Cada bloque Fortran incluye sus dependencias: guárdalo en un archivo independiente y ejecuta `gfortran -std=f2018 -Wall -Wextra -fcheck=all archivo.f90 -o programa`, seguido de `./programa`.

`-std=f2018` selecciona Fortran 2018; `-Wall` y `-Wextra` activan advertencias; `-fcheck=all` añade comprobaciones durante la ejecución; `-o` nombra el ejecutable. También puedes editar y ejecutar los ejemplos y resolver el ejercicio de cada sesión directamente en el navegador. La primera ejecución descarga el compilador WebAssembly; cada intento usa memoria y archivos virtuales independientes.

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
  if (estado /= 0) error stop ''Mediciones validas rechazadas''
  if (abs(promedio - 14.0_real64) > 1.e-12_real64) error stop ''Media incorrecta''
  call media([real(real64) ::], promedio, estado)
  if (estado /= 1) error stop ''Serie vacia aceptada''
  write(*,''(A)'') ''Contrato de biblioteca verificado''
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
  if (estado /= 0) error stop ''Mediciones validas rechazadas''
  if (abs(promedio - 14.0_real64) > 1.e-12_real64) error stop ''Media incorrecta''
  call media([real(real64) ::], promedio, estado)
  if (estado /= 1) error stop ''Serie vacia aceptada''
  write(*,''(A)'') ''Contrato de biblioteca verificado''
end program consumir_biblioteca
# Esperado
Contrato de biblioteca verificado
# Pista
Revisa la práctica resuelta de esta sesión y las condiciones que comprueba antes de imprimir la salida.
```

# Cierre

Definiste una interfaz con estados de error, separaste cálculo de entrada y comprendiste el orden de compilación. La siguiente sesión convierte ese contrato en pruebas repetibles y comprueba que detectan una regresión.
') on conflict (curso_slug, archivo) do update set contenido=excluded.contenido, actualizado_en=now();

insert into public.curso_contenido (curso_slug, archivo, contenido) values ('fortran-ingenieria-software', 'sesion-2.md', '---
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
  call exigir(estado == 0, ''Caso normal rechazado'')
  call exigir(ieee_is_finite(promedio), ''Resultado no finito'')
  call exigir(abs(promedio - 12.0_real64) < 1.e-12_real64, ''Media incorrecta'')
  call media([7.0_real64], promedio, estado)
  call exigir(estado == 0, ''Observacion unica rechazada'')
  call exigir(ieee_is_finite(promedio), ''Resultado unico no finito'')
  call exigir(abs(promedio - 7.0_real64) < 1.e-12_real64, ''Observacion incorrecta'')
  call media([real(real64) ::], promedio, estado)
  call exigir(estado == 1, ''Serie vacia aceptada'')
  call media([2.e6_real64], promedio, estado)
  call exigir(estado == 2, ''Fuera de limite aceptado'')
  call media([ieee_value(0.0_real64, ieee_quiet_nan)], promedio, estado)
  call exigir(estado == 2, ''NaN aceptado'')
  write(*,''(A)'') ''Cinco casos verificados''
contains
  subroutine exigir(condicion, mensaje)
    implicit none
    logical, intent(in) :: condicion
    character(len=*), intent(in) :: mensaje
    if (.not. condicion) then
      write(*,''(A)'') mensaje
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
  call exigir(estado == 0, ''Caso normal rechazado'')
  call exigir(ieee_is_finite(promedio), ''Resultado no finito'')
  call exigir(abs(promedio - 12.0_real64) < 1.e-12_real64, ''Media incorrecta'')
  call media([7.0_real64], promedio, estado)
  call exigir(estado == 0, ''Observacion unica rechazada'')
  call exigir(ieee_is_finite(promedio), ''Resultado unico no finito'')
  call exigir(abs(promedio - 7.0_real64) < 1.e-12_real64, ''Observacion incorrecta'')
  call media([real(real64) ::], promedio, estado)
  call exigir(estado == 1, ''Serie vacia aceptada'')
  call media([2.e6_real64], promedio, estado)
  call exigir(estado == 2, ''Fuera de limite aceptado'')
  call media([ieee_value(0.0_real64, ieee_quiet_nan)], promedio, estado)
  call exigir(estado == 2, ''NaN aceptado'')
  write(*,''(A)'') ''Cinco casos verificados''
contains
  subroutine exigir(condicion, mensaje)
    implicit none
    logical, intent(in) :: condicion
    character(len=*), intent(in) :: mensaje
    if (.not. condicion) then
      write(*,''(A)'') mensaje
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
') on conflict (curso_slug, archivo) do update set contenido=excluded.contenido, actualizado_en=now();

insert into public.curso_contenido (curso_slug, archivo, contenido) values ('fortran-ingenieria-software', 'sesion-3.md', '---
numero: 3
titulo: "Entradas, archivos y mensajes de error"
---

# Objetivos y preparación

La entrada externa debe convertirse y validarse antes de llegar al cálculo. Estudiarás dos problemas distintos: recorrer registros hasta el fin de un archivo e interpretar un registro como un único decimal. Los programas incluyen sus propios datos y se ejecutan de forma independiente.

# Distinguir el fin de archivo

`newunit` obtiene una unidad disponible; `status=''scratch''` crea un archivo temporal que se elimina al cerrarlo. El programa escribe dos registros y usa `rewind` para volver al inicio antes de leer. En cada operación, `iostat` recibe su estado.

`is_iostat_end(estado)` reconoce el fin de archivo. Compruébalo antes de tratar cualquier estado distinto de cero como error. Una conversión numérica fallida no significa que hayas llegado al final. Solo acumula la medición después de una lectura exitosa.

# Práctica: conservar todos los registros

Verifica la cantidad y la suma al terminar. Luego reemplaza `cantidad = cantidad + 1` por `cantidad = cantidad + 2`: la comprobación final debe detectar el error. Esta prueba evita aceptar un recorrido que acumule valores correctos pero informe una cantidad equivocada.

```fortran
! verificar-error: cantidad = cantidad + 1 => cantidad = cantidad + 2
program recorrer_archivo
  use iso_fortran_env, only: real64
  implicit none
  integer :: unidad, estado, cantidad
  real(real64) :: medicion, suma
  open(newunit=unidad, status=''scratch'', action=''readwrite'', iostat=estado)
  if (estado /= 0) error stop ''No se pudo abrir el archivo''
  write(unidad,''(A)'',iostat=estado) ''10'', ''14''
  if (estado /= 0) error stop ''No se pudo escribir''
  rewind(unidad, iostat=estado)
  if (estado /= 0) error stop ''No se pudo reposicionar''
  cantidad = 0
  suma = 0.0_real64
  do
    read(unidad,*,iostat=estado) medicion
    if (is_iostat_end(estado)) exit
    if (estado /= 0) error stop ''Registro invalido''
    cantidad = cantidad + 1
    suma = suma + medicion
  end do
  close(unidad, iostat=estado)
  if (estado /= 0) error stop ''No se pudo cerrar''
  if (cantidad /= 2) error stop ''Cantidad de registros incorrecta''
  if (abs(suma - 24.0_real64) > 1.e-12_real64) error stop ''Suma incorrecta''
  write(*,''(A,I0,A,F6.2)'') ''Registros: '', cantidad, ''; suma: '', suma
end program recorrer_archivo
```

```salida
Registros: 2; suma:  24.00
```

> Doc: [Reconocer el fin de archivo con IS_IOSTAT_END](https://gcc.gnu.org/onlinedocs/gfortran/IS_005fIOSTAT_005fEND.html)

# Interpretar un único decimal

La lectura dirigida por lista permite separadores y terminadores. Por eso, un `read` exitoso no garantiza que todo el texto represente una única medición. El siguiente conversor acepta únicamente dígitos, signo, punto decimal y marcadores de exponente; después delega la sintaxis numérica al lector de Fortran. `verify` devuelve cero cuando todos los caracteres pertenecen al conjunto permitido.

La lista de caracteres no valida por sí sola el número: `1e+` contiene caracteres admitidos, pero la lectura lo rechaza. Este ejemplo elimina blancos finales con `trim`; el analizador de terminal del proyecto es más estricto y rechaza espacios dentro del argumento original.

```fortran
program validar_registro
  use iso_fortran_env, only: real64
  use, intrinsic :: ieee_arithmetic, only: ieee_is_finite
  implicit none
  character(len=12) :: registro
  real(real64) :: medicion
  integer :: estado
  registro = ''12.5''
  call convertir(registro, medicion, estado)
  if (estado /= 0) error stop ''Decimal valido rechazado''
  if (abs(medicion-12.5_real64) > 1.e-12_real64) error stop ''Conversion incorrecta''
  registro = ''12,5''
  call convertir(registro, medicion, estado)
  if (estado == 0) error stop ''Lista aceptada como decimal''
  write(*,''(A)'') ''Decimal aceptado; lista rechazada''
contains
  subroutine convertir(texto, valor, codigo)
    character(len=*), intent(in) :: texto
    real(real64), intent(out) :: valor
    integer, intent(out) :: codigo
    valor = 0.0_real64
    codigo = 1
    if (len_trim(texto) == 0) return
    if (verify(trim(texto), ''0123456789.+-eEdD'') /= 0) return
    read(texto,*,iostat=codigo) valor
    if (codigo /= 0) return
    if (.not. ieee_is_finite(valor)) codigo = 2
  end subroutine convertir
end program validar_registro
```

```salida
Decimal aceptado; lista rechazada
```

> Doc: [Verificar caracteres con VERIFY](https://gcc.gnu.org/onlinedocs/gfortran/VERIFY.html)

La implementación rechaza la coma decimal: el contrato utiliza punto. También rechaza texto como `NaN`, `Inf` o `/`. La biblioteca realiza, además, la comprobación de finitud y del límite de magnitud, porque también puede recibir valores desde otro programa sin pasar por este conversor.

# Validar la interfaz de terminal

En el proyecto descargable, `command_argument_count` determina cuántas mediciones se recibieron. `get_command_argument` copia cada argumento y devuelve su longitud original y el estado. Comprueba ambos antes de extraer una subcadena: un argumento que no cabe puede quedar truncado. El programa admite hasta 128 caracteres por argumento y entre una y cien mil mediciones.

Ejecuta `make run` para analizar tres mediciones. Después ejecuta `./analizador 10 error` y `./analizador "1 2"`: ambas llamadas deben terminar con error. `error_unit` identifica el canal de diagnóstico, separado de la salida de resultados. El programa informa el motivo y devuelve un estado distinto de cero; no imprime una media parcial.

> Doc: [Recuperar argumentos y detectar truncamiento](https://gcc.gnu.org/onlinedocs/gfortran/GET_005fCOMMAND_005fARGUMENT.html)

# Ejercicio en el navegador

Completa el programa y pulsa «Comprobar». El código se compila y ejecuta en tu navegador; cada intento comienza desde cero.

```ejercicio fortran
# Enunciado
Completa la operación que falta para que el programa cumpla las comprobaciones de esta sesión.
# Plantilla
program recorrer_archivo
  use iso_fortran_env, only: real64
  implicit none
  integer :: unidad, estado, cantidad
  real(real64) :: medicion, suma
  open(newunit=unidad, status=''scratch'', action=''readwrite'', iostat=estado)
  if (estado /= 0) error stop ''No se pudo abrir el archivo''
  write(unidad,''(A)'',iostat=estado) ''10'', ''14''
  if (estado /= 0) error stop ''No se pudo escribir''
  rewind(unidad, iostat=estado)
  if (estado /= 0) error stop ''No se pudo reposicionar''
  cantidad = 0
  suma = 0.0_real64
  do
    read(unidad,*,iostat=estado) medicion
    if (is_iostat_end(estado)) exit
    if (estado /= 0) error stop ''Registro invalido''
    ___
    suma = suma + medicion
  end do
  close(unidad, iostat=estado)
  if (estado /= 0) error stop ''No se pudo cerrar''
  if (cantidad /= 2) error stop ''Cantidad de registros incorrecta''
  if (abs(suma - 24.0_real64) > 1.e-12_real64) error stop ''Suma incorrecta''
  write(*,''(A,I0,A,F6.2)'') ''Registros: '', cantidad, ''; suma: '', suma
end program recorrer_archivo
# Esperado
Registros: 2; suma:  24.00
# Pista
Revisa la práctica resuelta de esta sesión y las condiciones que comprueba antes de imprimir la salida.
```

# Cierre

Recorriste un archivo con comprobaciones, distinguiste fin de archivo de error y validaste el formato de entrada. La sesión final reutiliza la misma biblioteca desde C y reúne código, pruebas y documentación en una entrega reproducible.
') on conflict (curso_slug, archivo) do update set contenido=excluded.contenido, actualizado_en=now();

insert into public.curso_contenido (curso_slug, archivo, contenido) values ('fortran-ingenieria-software', 'sesion-4.md', '---
numero: 4
titulo: "Interoperabilidad con C y proyecto final"
---

# Objetivos y preparación

Una interfaz de interoperabilidad permite que otro lenguaje invoque una operación de Fortran con tipos y convenciones acordados. En esta sesión expondrás `media` a C, ejecutarás un consumidor real y prepararás la entrega del proyecto. Necesitas los compiladores y Make indicados en la primera sesión.

# Definir la interfaz binaria

`bind(C, name=''media_c'')` declara una rutina interoperable con C y fija su nombre externo. `iso_c_binding` proporciona `c_int` y `c_double`, correspondientes a `int` y `double`. El atributo `value` hace que la cantidad se reciba por valor; los argumentos de salida se reciben mediante direcciones desde C.

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
  subroutine media_c(cantidad, valores, promedio, estado) bind(C, name=''media_c'')
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
  if (estado /= 0) error stop ''Interfaz rechazo la serie''
  if (abs(promedio-14.0_c_double) > 1.e-12_c_double) error stop ''Interfaz devolvio otra media''
  call media_c(0_c_int, [0.0_c_double], promedio, estado)
  if (estado /= 1) error stop ''Interfaz acepto longitud cero''
  write(*,''(A)'') ''Interfaz interoperable verificada''
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
  subroutine media_c(cantidad, valores, promedio, estado) bind(C, name=''media_c'')
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
  if (estado /= 0) error stop ''Interfaz rechazo la serie''
  if (abs(promedio-14.0_c_double) > 1.e-12_c_double) error stop ''Interfaz devolvio otra media''
  call media_c(0_c_int, [0.0_c_double], promedio, estado)
  if (estado /= 1) error stop ''Interfaz acepto longitud cero''
  write(*,''(A)'') ''Interfaz interoperable verificada''
end program comprobar_interfaz
# Esperado
Interfaz interoperable verificada
# Pista
Revisa la práctica resuelta de esta sesión y las condiciones que comprueba antes de imprimir la salida.
```

# Cierre

Completaste una biblioteca con contrato explícito, pruebas que detectan regresiones, validación de entradas e interoperabilidad real con C. La ruta de Fortran concluye con un proyecto que otra persona puede compilar y comprobar desde sus fuentes.
') on conflict (curso_slug, archivo) do update set contenido=excluded.contenido, actualizado_en=now();

insert into public.curso_sesiones (curso_slug, archivo, numero, titulo, slug) values ('fortran-ingenieria-software', 'sesion-1.md', 1, 'Bibliotecas, contratos y compilación reproducible', 'sesion-1') on conflict (curso_slug, archivo) do update set numero=excluded.numero, titulo=excluded.titulo, slug=excluded.slug;

insert into public.curso_sesiones (curso_slug, archivo, numero, titulo, slug) values ('fortran-ingenieria-software', 'sesion-2.md', 2, 'Pruebas unitarias y detección de regresiones', 'sesion-2') on conflict (curso_slug, archivo) do update set numero=excluded.numero, titulo=excluded.titulo, slug=excluded.slug;

insert into public.curso_sesiones (curso_slug, archivo, numero, titulo, slug) values ('fortran-ingenieria-software', 'sesion-3.md', 3, 'Entradas, archivos y mensajes de error', 'sesion-3') on conflict (curso_slug, archivo) do update set numero=excluded.numero, titulo=excluded.titulo, slug=excluded.slug;

insert into public.curso_sesiones (curso_slug, archivo, numero, titulo, slug) values ('fortran-ingenieria-software', 'sesion-4.md', 4, 'Interoperabilidad con C y proyecto final', 'sesion-4') on conflict (curso_slug, archivo) do update set numero=excluded.numero, titulo=excluded.titulo, slug=excluded.slug;

commit;

