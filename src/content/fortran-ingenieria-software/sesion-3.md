---
numero: 3
titulo: "Entradas, archivos y mensajes de error"
---

# Objetivos y preparación

La entrada externa debe convertirse y validarse antes de llegar al cálculo. Estudiarás dos problemas distintos: recorrer registros hasta el fin de un archivo e interpretar un registro como un único decimal. Los programas incluyen sus propios datos y se ejecutan de forma independiente.

# Distinguir el fin de archivo

`newunit` obtiene una unidad disponible; `status='scratch'` crea un archivo temporal que se elimina al cerrarlo. El programa escribe dos registros y usa `rewind` para volver al inicio antes de leer. En cada operación, `iostat` recibe su estado.

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
  open(newunit=unidad, status='scratch', action='readwrite', iostat=estado)
  if (estado /= 0) error stop 'No se pudo abrir el archivo'
  write(unidad,'(A)',iostat=estado) '10', '14'
  if (estado /= 0) error stop 'No se pudo escribir'
  rewind(unidad, iostat=estado)
  if (estado /= 0) error stop 'No se pudo reposicionar'
  cantidad = 0
  suma = 0.0_real64
  do
    read(unidad,*,iostat=estado) medicion
    if (is_iostat_end(estado)) exit
    if (estado /= 0) error stop 'Registro invalido'
    cantidad = cantidad + 1
    suma = suma + medicion
  end do
  close(unidad, iostat=estado)
  if (estado /= 0) error stop 'No se pudo cerrar'
  if (cantidad /= 2) error stop 'Cantidad de registros incorrecta'
  if (abs(suma - 24.0_real64) > 1.e-12_real64) error stop 'Suma incorrecta'
  write(*,'(A,I0,A,F6.2)') 'Registros: ', cantidad, '; suma: ', suma
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
  registro = '12.5'
  call convertir(registro, medicion, estado)
  if (estado /= 0) error stop 'Decimal valido rechazado'
  if (abs(medicion-12.5_real64) > 1.e-12_real64) error stop 'Conversion incorrecta'
  registro = '12,5'
  call convertir(registro, medicion, estado)
  if (estado == 0) error stop 'Lista aceptada como decimal'
  write(*,'(A)') 'Decimal aceptado; lista rechazada'
contains
  subroutine convertir(texto, valor, codigo)
    character(len=*), intent(in) :: texto
    real(real64), intent(out) :: valor
    integer, intent(out) :: codigo
    valor = 0.0_real64
    codigo = 1
    if (len_trim(texto) == 0) return
    if (verify(trim(texto), '0123456789.+-eEdD') /= 0) return
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
  open(newunit=unidad, status='scratch', action='readwrite', iostat=estado)
  if (estado /= 0) error stop 'No se pudo abrir el archivo'
  write(unidad,'(A)',iostat=estado) '10', '14'
  if (estado /= 0) error stop 'No se pudo escribir'
  rewind(unidad, iostat=estado)
  if (estado /= 0) error stop 'No se pudo reposicionar'
  cantidad = 0
  suma = 0.0_real64
  do
    read(unidad,*,iostat=estado) medicion
    if (is_iostat_end(estado)) exit
    if (estado /= 0) error stop 'Registro invalido'
    ___
    suma = suma + medicion
  end do
  close(unidad, iostat=estado)
  if (estado /= 0) error stop 'No se pudo cerrar'
  if (cantidad /= 2) error stop 'Cantidad de registros incorrecta'
  if (abs(suma - 24.0_real64) > 1.e-12_real64) error stop 'Suma incorrecta'
  write(*,'(A,I0,A,F6.2)') 'Registros: ', cantidad, '; suma: ', suma
end program recorrer_archivo
# Esperado
Registros: 2; suma:  24.00
# Pista
Revisa la práctica resuelta de esta sesión y las condiciones que comprueba antes de imprimir la salida.
```

# Cierre

Recorriste un archivo con comprobaciones, distinguiste fin de archivo de error y validaste el formato de entrada. La sesión final reutiliza la misma biblioteca desde C y reúne código, pruebas y documentación en una entrega reproducible.
