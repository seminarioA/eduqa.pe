program analizador
  use iso_fortran_env, only: real64, error_unit
  use estadistica, only: media
  implicit none
  real(real64), allocatable :: mediciones(:)
  real(real64) :: promedio
  character(len=128) :: argumento
  integer :: cantidad, posicion, estado, longitud
  cantidad = command_argument_count()
  if (cantidad < 1 .or. cantidad > 100000) call fallar('Indica entre 1 y 100000 mediciones')
  allocate(mediciones(cantidad), stat=estado)
  if (estado /= 0) call fallar('No se pudo reservar memoria')
  do posicion = 1, cantidad
    call get_command_argument(posicion, argumento, length=longitud, status=estado)
    if (estado /= 0 .or. longitud < 1 .or. longitud > len(argumento)) call fallar('Argumento demasiado largo o vacio')
    ! Un argumento es un solo decimal: se excluyen espacios, listas y terminadores.
    if (verify(argumento(:longitud), '0123456789.+-eEdD') /= 0) call fallar('Formato numerico invalido')
    read(argumento(:longitud), *, iostat=estado) mediciones(posicion)
    if (estado /= 0) call fallar('No se pudo interpretar la medicion')
  end do
  call media(mediciones, promedio, estado)
  if (estado /= 0) call fallar('Mediciones no finitas o fuera del limite de un millon')
  write(*,'(A,I0,A,F12.6)') 'Cantidad: ', cantidad, '; media: ', promedio
contains
  subroutine fallar(mensaje)
    implicit none
    character(len=*), intent(in) :: mensaje
    write(error_unit,'(A)') mensaje
    error stop 1
  end subroutine fallar
end program analizador
