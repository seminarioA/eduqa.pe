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
