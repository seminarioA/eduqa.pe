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
