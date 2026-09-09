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
