---
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

  open(unit=unidad, file='perfil.dat', status='replace', &
       action='write', form='formatted', iostat=estado)
  if (estado /= 0) stop 'No se pudo abrir perfil.dat'

  do i = 1, size(altura)
    write(unit=unidad, fmt='(F8.2,1X,F8.2)', iostat=estado) &
      altura(i), temperatura(i)
    if (estado /= 0) stop 'No se pudo escribir perfil.dat'
  end do

  close(unit=unidad, iostat=estado)
  if (estado /= 0) stop 'No se pudo cerrar perfil.dat'
end program escribir_perfil
```

> Doc: [Documentación de Fortran-lang](https://fortran-lang.org/learn/best_practices/file_io/)

`STATUS='REPLACE'` solicita reemplazar el archivo si existe o crearlo si no existe. `ACTION='WRITE'` prohíbe lecturas desde esa conexión. `FORM='FORMATTED'` selecciona registros de caracteres. El descriptor `F8.2` reserva un campo de ocho caracteres con dos decimales y `1X` inserta un espacio.

> Nota: `STATUS='REPLACE'` destruye el contenido anterior. Solo debe usarse cuando esa sustitución sea parte explícita del contrato. Para una entrada existente se usa `STATUS='OLD'`; para exigir un archivo nuevo, `STATUS='NEW'`.

# IOSTAT como control de flujo de entrada y salida

El especificador `IOSTAT=` recibe un entero tras una operación de entrada o salida. En una transferencia de datos, cero indica éxito, un valor positivo indica error y un valor negativo indica fin de archivo o fin de registro. Los valores concretos dependen del procesador; el signo es la clasificación portable relevante para este curso.

```fortran !sin-consola
program leer_hasta_fin
  implicit none
  integer, parameter :: unidad = 21
  integer :: estado, cantidad
  real :: tiempo, valor, suma

  open(unit=unidad, file='serie.dat', status='old', action='read', &
       form='formatted', iostat=estado)
  if (estado /= 0) stop 'No se pudo abrir serie.dat'

  cantidad = 0
  suma = 0.0
  do
    read(unit=unidad, fmt=*, iostat=estado) tiempo, valor
    if (estado < 0) exit
    if (estado > 0) stop 'Registro invalido en serie.dat'

    cantidad = cantidad + 1
    suma = suma + valor
  end do

  close(unit=unidad, iostat=estado)
  if (estado /= 0) stop 'No se pudo cerrar serie.dat'

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

  mensaje = ''
  open(unit=unidad, file='mediciones.dat', status='old', &
       action='read', form='formatted', iostat=estado, iomsg=mensaje)

  if (estado /= 0) then
    print *, 'No se pudo abrir mediciones.dat: ', trim(mensaje)
    stop 1
  end if

  close(unit=unidad, iostat=estado, iomsg=mensaje)
  if (estado /= 0) then
    print *, 'No se pudo cerrar mediciones.dat: ', trim(mensaje)
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

  inquire(file='parametros.dat', exist=existe, iostat=estado)
  if (estado /= 0) stop 'No se pudo consultar parametros.dat'

  if (.not. existe) then
    print *, 'Falta el archivo parametros.dat'
  else
    print *, 'El archivo parametros.dat existe'
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

  write(unit=*, fmt='(A,1X,I5)') 'iteracion', iteracion
  write(unit=*, fmt='(A,1X,ES14.6)') 'residuo', residuo
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

  mensaje = ''
  open(unit=unidad_entrada, file='temperaturas.dat', status='old', &
       action='read', form='formatted', iostat=estado, iomsg=mensaje)
  if (estado /= 0) then
    print *, 'No se pudo abrir temperaturas.dat: ', trim(mensaje)
    stop 1
  end if

  read(unit=unidad_entrada, fmt=*, iostat=estado, iomsg=mensaje) n
  if (estado /= 0) then
    print *, 'No se pudo leer la cantidad de observaciones: ', trim(mensaje)
    close(unit=unidad_entrada)
    stop 1
  end if

  if (n < 1 .or. n > max_observaciones) then
    print *, 'Cantidad de observaciones fuera del intervalo permitido: ', n
    close(unit=unidad_entrada)
    stop 1
  end if

  allocate(tiempo(n), temperatura(n), stat=estado)
  if (estado /= 0) then
    print *, 'No se pudieron reservar los arreglos para ', n, ' observaciones'
    close(unit=unidad_entrada)
    stop 1
  end if

  do i = 1, n
    read(unit=unidad_entrada, fmt=*, iostat=estado, iomsg=mensaje) &
      tiempo(i), temperatura(i)
    if (estado /= 0) then
      print *, 'Error en la observacion ', i, ': ', trim(mensaje)
      deallocate(tiempo, temperatura)
      close(unit=unidad_entrada)
      stop 1
    end if
  end do

  close(unit=unidad_entrada, iostat=estado, iomsg=mensaje)
  if (estado /= 0) then
    print *, 'No se pudo cerrar temperaturas.dat: ', trim(mensaje)
    deallocate(tiempo, temperatura)
    stop 1
  end if

  do i = 2, n
    if (tiempo(i) <= tiempo(i - 1)) then
      print *, 'Los tiempos deben ser estrictamente crecientes; indice ', i
      deallocate(tiempo, temperatura)
      stop 1
    end if
  end do

  resumen = calcular_resumen(temperatura)

  mensaje = ''
  open(unit=unidad_salida, file='resumen_temperaturas.txt', &
       status='replace', action='write', form='formatted', &
       iostat=estado, iomsg=mensaje)
  if (estado /= 0) then
    print *, 'No se pudo abrir el informe: ', trim(mensaje)
    deallocate(tiempo, temperatura)
    stop 1
  end if

  write(unit=unidad_salida, fmt='(A,1X,I0)', &
        iostat=estado, iomsg=mensaje) 'cantidad', resumen%cantidad
  if (estado == 0) then
    write(unit=unidad_salida, fmt='(A,1X,ES24.16)', &
          iostat=estado, iomsg=mensaje) 'tiempo_inicial', tiempo(1)
  end if
  if (estado == 0) then
    write(unit=unidad_salida, fmt='(A,1X,ES24.16)', &
          iostat=estado, iomsg=mensaje) 'tiempo_final', tiempo(n)
  end if
  if (estado == 0) then
    write(unit=unidad_salida, fmt='(A,1X,ES24.16)', &
          iostat=estado, iomsg=mensaje) 'minimo', resumen%minimo
  end if
  if (estado == 0) then
    write(unit=unidad_salida, fmt='(A,1X,ES24.16)', &
          iostat=estado, iomsg=mensaje) 'maximo', resumen%maximo
  end if
  if (estado == 0) then
    write(unit=unidad_salida, fmt='(A,1X,ES24.16)', &
          iostat=estado, iomsg=mensaje) 'media', resumen%media
  end if
  if (estado == 0) then
    write(unit=unidad_salida, fmt='(A,1X,ES24.16)', &
          iostat=estado, iomsg=mensaje) 'desviacion', resumen%desviacion
  end if

  if (estado /= 0) then
    print *, 'No se pudo escribir el informe: ', trim(mensaje)
    close(unit=unidad_salida)
    deallocate(tiempo, temperatura)
    stop 1
  end if

  close(unit=unidad_salida, iostat=estado, iomsg=mensaje)
  if (estado /= 0) then
    print *, 'No se pudo cerrar el informe: ', trim(mensaje)
    deallocate(tiempo, temperatura)
    stop 1
  end if

  deallocate(tiempo, temperatura, stat=estado)
  if (estado /= 0) stop 'No se pudieron liberar los arreglos'
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
  character(len=12) :: registro = 'no-numerico'
  real :: temperatura
  integer :: estado
  read(registro, *, iostat=estado) temperatura
  ! verificar-error: estado /= 0 => estado == 0
  if (estado /= 0) then
    write(*,'(A)') 'Registro rechazado'
  else
    error stop 'Registro invalido aceptado'
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
  character(len=12) :: registro = 'no-numerico'
  real :: temperatura
  integer :: estado
  read(registro, *, iostat=estado) temperatura
  if (___) then
    write(*,'(A)') 'Registro rechazado'
  else
    error stop 'Registro invalido aceptado'
  end if
end program practica_registro
# Esperado
Registro rechazado
# Pista
Revisa la práctica resuelta de esta sesión y las condiciones que comprueba antes de imprimir la salida.
```

# Cierre

Esta sesión cubrió tipos derivados, componentes, constructores, arreglos de estructuras y definiciones compartidas mediante módulos. También estableció el modelo de archivo, unidad, registro y posición; explicó formatos explícitos, `INQUIRE`, `OPEN`, `READ`, `WRITE` y `CLOSE`; y distinguió el estado portable de `IOSTAT` del diagnóstico dependiente del procesador que entrega `IOMSG` en Fortran 2003. El programa integrador reunió precisión seleccionada, memoria dinámica, validación, estadísticas, tipos derivados, procedimientos e informes formateados. Con ello quedan cubiertas las cuatro sesiones del curso y una base coherente para mantener programas científicos de Fortran 90 en compiladores actuales.
