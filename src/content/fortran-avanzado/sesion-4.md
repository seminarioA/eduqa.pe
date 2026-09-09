---
numero: 4
titulo: "Estabilidad numérica y operaciones independientes"
---

# Objetivos y preparación

Aprenderás a rechazar valores no finitos, validar resultados con tolerancias y expresar cálculos independientes. `real64`, del módulo intrínseco `iso_fortran_env`, identifica una clase real de 64 bits cuando el procesador la ofrece. Más precisión no corrige un algoritmo inestable ni sustituye la validación de entrada.

# Detectar valores no finitos

El módulo `ieee_arithmetic` ofrece consultas relacionadas con la aritmética del Institute of Electrical and Electronics Engineers (IEEE). `ieee_is_finite` distingue valores finitos de infinitos y de valores que no representan un número, llamados NaN por *Not a Number*. NaN no se detecta de forma fiable con una comprobación de intervalo. Primero se comprueba finitud y luego se aplica el criterio del dominio.

La creación del NaN siguiente es deliberada y sirve para verificar el rechazo. `ieee_support_nan` comprueba si el procesador admite esa representación para la clase utilizada.

```fortran
program filtrar_no_finitos
  use iso_fortran_env, only: real64
  use, intrinsic :: ieee_arithmetic, only: ieee_is_finite, ieee_value, &
    ieee_quiet_nan, ieee_support_nan
  implicit none
  real(real64) :: medidas(3)
  logical :: validas(3)
  if (.not. ieee_support_nan(0.0_real64)) error stop 'NaN no disponible'
  medidas = [1.0_real64, ieee_value(0.0_real64, ieee_quiet_nan), 3.0_real64]
  validas = ieee_is_finite(medidas)
  if (count(validas) /= 2) error stop 'Filtro incorrecto'
  write(*,'(I0)') count(validas)
end program filtrar_no_finitos
```

```salida
2
```

> Doc: [GNU Fortran: módulos IEEE](https://gcc.gnu.org/onlinedocs/gfortran/IEEE-modules.html)

> Nota: las optimizaciones que permiten suponer ausencia de NaN o infinitos pueden invalidar estos filtros. Esta ruta no utiliza `-ffast-math`. La documentación de GNU especifica opciones adicionales cuando se requiere conformidad IEEE completa; el ejemplo no certifica esa conformidad para todos los procesadores.

# Comparar con una escala explícita

Para dos resultados finitos, una comprobación útil es `abs(obtenido - esperado) <= absoluta + relativa * abs(esperado)`. La tolerancia absoluta controla errores cerca de cero y la relativa escala con el valor de referencia. Ambas dependen del algoritmo y de las unidades: no existe una constante universal para todos los problemas. Deben elegirse antes de observar un fallo, a partir del error aceptable.

# Práctica: calcular energías por elemento

Calcula las energías cinéticas de tres cuerpos y comprueba cada resultado. `do concurrent` declara que las iteraciones cumplen restricciones de independencia; no garantiza ejecución paralela ni mejora de velocidad. Cada iteración escribe un elemento diferente y solo lee entradas que no se modifican. El índice `cuerpo` es local al constructo.

```fortran
program energias_independientes
  use iso_fortran_env, only: real64
  use, intrinsic :: ieee_arithmetic, only: ieee_is_finite
  implicit none
  integer :: cuerpo
  real(real64) :: masa(3), velocidad(3), energia(3), referencia(3)
  real(real64), parameter :: tolerancia = 1.e-12_real64
  masa = [2.0_real64, 4.0_real64, 6.0_real64]
  velocidad = [3.0_real64, 2.0_real64, 1.0_real64]
  referencia = [9.0_real64, 8.0_real64, 3.0_real64]
  if (.not. all(ieee_is_finite(masa))) error stop 'Masa no finita'
  if (any(masa < 0.0_real64)) error stop 'Masa negativa'
  if (.not. all(ieee_is_finite(velocidad))) error stop 'Velocidad no finita'
  do concurrent (cuerpo = 1:size(masa))
  ! verificar-error: velocidad(cuerpo)**2 => velocidad(cuerpo)**3
    energia(cuerpo) = 0.5_real64 * masa(cuerpo) * velocidad(cuerpo)**2
  end do
  if (.not. all(ieee_is_finite(energia))) error stop 'Energia no finita'
  if (any(abs(energia - referencia) > tolerancia)) error stop 'Calculo incorrecto'
  write(*,'(3(F5.2,1X))') energia
end program energias_independientes
```

```salida
 9.00  8.00  3.00
```

> Doc: [GNU Fortran: estado de soporte de Fortran 2008](https://gcc.gnu.org/onlinedocs/gfortran/Fortran-2008-status.html)

Para comprobar que las pruebas detectan errores, sustituye la potencia `**2` por `**3`: el programa debe terminar en la comprobación del cálculo. Una suma acumulada compartida dentro de este bucle incumpliría su independencia; las reducciones requieren un diseño y soporte de estándar adecuados.

# Medir antes de optimizar

Se valida primero una implementación de referencia y después se mide otra que produce resultados equivalentes dentro de tolerancia. Un tiempo aislado mezcla calentamiento, carga del sistema y tamaño de entrada. Documenta compilador, opciones, dimensiones y varias repeticiones. Los arreglos de Fortran almacenan contiguamente los elementos que varían en el primer índice; respetar ese recorrido puede reducir accesos dispersos. Esta propiedad orienta una medición, pero no constituye por sí sola un resultado de rendimiento.

> Doc: [Fortran-lang: arreglos multidimensionales](https://fortran-lang.org/learn/best_practices/multidim_arrays/)

# Ejercicio en el navegador

Completa el programa y pulsa «Comprobar». El código se compila y ejecuta en tu navegador; cada intento comienza desde cero.

```ejercicio fortran
# Enunciado
Completa la operación que falta para que el programa cumpla las comprobaciones de esta sesión.
# Plantilla
program energias_independientes
  use iso_fortran_env, only: real64
  use, intrinsic :: ieee_arithmetic, only: ieee_is_finite
  implicit none
  integer :: cuerpo
  real(real64) :: masa(3), velocidad(3), energia(3), referencia(3)
  real(real64), parameter :: tolerancia = 1.e-12_real64
  masa = [2.0_real64, 4.0_real64, 6.0_real64]
  velocidad = [3.0_real64, 2.0_real64, 1.0_real64]
  referencia = [9.0_real64, 8.0_real64, 3.0_real64]
  if (.not. all(ieee_is_finite(masa))) error stop 'Masa no finita'
  if (any(masa < 0.0_real64)) error stop 'Masa negativa'
  if (.not. all(ieee_is_finite(velocidad))) error stop 'Velocidad no finita'
  do concurrent (cuerpo = 1:size(masa))
    energia(cuerpo) = 0.5_real64 * masa(cuerpo) * ___
  end do
  if (.not. all(ieee_is_finite(energia))) error stop 'Energia no finita'
  if (any(abs(energia - referencia) > tolerancia)) error stop 'Calculo incorrecto'
  write(*,'(3(F5.2,1X))') energia
end program energias_independientes
# Esperado
 9.00  8.00  3.00
# Pista
Revisa la práctica resuelta de esta sesión y las condiciones que comprueba antes de imprimir la salida.
```

# Cierre

Completaste el nivel avanzado: memoria, interfaces, objetos y validación numérica. El curso Fortran aplicado a la ingeniería de software integra estas decisiones en bibliotecas con contratos, pruebas y entradas externas verificables.
