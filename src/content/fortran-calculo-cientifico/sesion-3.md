---
numero: 3
titulo: "Procedimientos, interfaces explícitas y módulos"
---

# Objetivos y preparación

La lectura base principal es *Fortran 90 Handbook*, de Jeanne C. Adams, Walter S. Brainerd, Jeanne T. Martin, Brian T. Smith y Jerrold L. Wagener: capítulo 11, secciones 11.3–11.6 sobre procedimientos internos, asociación con el anfitrión, subprogramas externos y módulos (páginas 489–515); y capítulo 12, secciones 12.1–12.6 sobre subrutinas, funciones, asociación de argumentos e interfaces explícitas (páginas 522–587). Para `PURE` y `ELEMENTAL`, incorporados después de Fortran 90, la lectura secundaria es *Fortran for Scientists and Engineers*, cuarta edición, de Stephen J. Chapman: capítulo 9, sección 9.6, «Pure and Elemental Procedures» (páginas 434–436). Todos los ejemplos son originales.

Al terminar podrás separar un cálculo en funciones y subrutinas, declarar la intención de cada argumento, pasar arreglos de forma asumida, reconocer cuándo se necesita una interfaz explícita, limitar efectos laterales con `PURE`, aplicar una función escalar a arreglos mediante `ELEMENTAL` y publicar una API numérica desde un módulo.

# Función o subrutina

Una **función** devuelve un resultado y se referencia dentro de una expresión. Una **subrutina** ejecuta una operación y se invoca con `CALL`; puede comunicar varios resultados mediante argumentos. La elección debe reflejar el contrato: una transformación con un resultado natural suele ser función; una operación con varios resultados o un cambio deliberado de estado suele ser subrutina.

El atributo `INTENT` declara cómo usa el procedimiento un argumento ficticio:

- `INTENT(IN)` permite leerlo, pero no definirlo.
- `INTENT(OUT)` indica que el procedimiento debe producir su valor; el valor anterior no se conserva como entrada.
- `INTENT(INOUT)` permite leerlo y redefinirlo.

```fortran
program usar_norma
  implicit none
  real :: velocidad(3), magnitud

  velocidad = (/ 3.0, 4.0, 12.0 /)
  magnitud = norma_euclidea(velocidad)
  print *, magnitud

contains

  function norma_euclidea(vector) result(norma)
    implicit none
    real, intent(in) :: vector(:)
    real :: norma

    norma = sqrt(dot_product(vector, vector))
  end function norma_euclidea
end program usar_norma
```

```salida
   13.0000000
```

> Doc: [Documentación de Fortran-lang](https://fortran-lang.org/learn/quickstart/organising_code/)

`RESULT(norma)` da al resultado un nombre distinto del nombre de la función. La forma `vector(:)` es un argumento de forma asumida: el procedimiento recibe la extensión del argumento real. Como la función es interna, su interfaz es explícita dentro del programa anfitrión.

> Nota: un procedimiento interno puede acceder por asociación con el anfitrión a nombres declarados en el programa que lo contiene. Conviene pasar como argumentos los datos que forman parte del contrato y reservar la asociación con el anfitrión para constantes o contexto claramente compartido.

# Subrutinas con varios resultados

Una subrutina permite devolver varios valores con `INTENT(OUT)`. El procedimiento siguiente calcula media y norma residual de un vector sin depender de variables globales.

```fortran
program estadistica_basica
  implicit none
  real :: muestras(5), media, norma_residual

  muestras = (/ 1.0, 2.0, 4.0, 4.0, 4.0 /)
  call resumir(muestras, media, norma_residual)
  print *, media, norma_residual

contains

  subroutine resumir(valores, promedio, norma)
    implicit none
    real, intent(in) :: valores(:)
    real, intent(out) :: promedio, norma
    real :: residuo(size(valores))

    if (size(valores) == 0) stop 'No se puede resumir un arreglo vacio'

    promedio = sum(valores) / real(size(valores))
    residuo = valores - promedio
    norma = sqrt(dot_product(residuo, residuo))
  end subroutine resumir
end program estadistica_basica
```

```salida
   3.00000000       2.82842708
```

> Doc: [Documentación de Fortran-lang](https://fortran-lang.org/learn/quickstart/organising_code/)

`residuo(size(valores))` es un arreglo automático: su extensión se determina al entrar al procedimiento y su duración se limita a esa invocación. El programa comprueba el tamaño antes de dividir.

# Forma asumida e interfaz explícita

Los dos puntos (`:`) en un argumento como `campo(:,:)` indican **forma asumida**. El rango queda fijado en la declaración, pero cada extensión procede del argumento real. El procedimiento puede consultar `SIZE`, `SHAPE`, `LBOUND` y `UBOUND`.

Un procedimiento con argumentos de forma asumida requiere una interfaz explícita en el lugar de la llamada. Las funciones internas y los procedimientos de módulo la proporcionan automáticamente. Para un subprograma externo, un bloque `INTERFACE` puede describirla, pero duplica información que debe mantenerse idéntica a la definición.

```fortran
program integrar_malla
  implicit none
  real :: campo(3, 4), integral

  campo = 2.0
  call integrar_rectangulos(campo, 0.5, 0.25, integral)
  print *, integral

contains

  subroutine integrar_rectangulos(valores, dx, dy, resultado)
    implicit none
    real, intent(in) :: valores(:,:)
    real, intent(in) :: dx, dy
    real, intent(out) :: resultado

    if (dx <= 0.0 .or. dy <= 0.0) stop 'Los pasos deben ser positivos'
    resultado = sum(valores) * dx * dy
  end subroutine integrar_rectangulos
end program integrar_malla
```

```salida
   3.00000000
```

> Doc: [Documentación de Fortran-lang](https://fortran-lang.org/learn/quickstart/organising_code/)

Pasar `campo(1:3:2, :)` también es válido: el descriptor asociado a un argumento de forma asumida representa su forma aunque la sección no sea contigua. Según el procedimiento y el compilador, una operación puede crear un temporal; el contrato semántico no cambia.

> Nota: los límites inferiores de un argumento de forma asumida son `1` por omisión dentro del procedimiento, aunque el arreglo real tenga otro límite inferior. Si el algoritmo necesita conservar otro origen lógico, se declara de forma explícita, por ejemplo `valores(0:)`, o se pasa el origen como argumento separado.

# Qué contiene una interfaz

La interfaz de un procedimiento comprende su nombre, la naturaleza de función o subrutina, el tipo, *kind* y rango del resultado, y el orden y los atributos de sus argumentos ficticios. Una interfaz explícita permite al compilador comprobar asociaciones y es obligatoria, entre otros casos de Fortran 90, para argumentos opcionales, argumentos por palabra clave, funciones que devuelven arreglos, argumentos de forma asumida y procedimientos genéricos.

El siguiente ejemplo muestra un bloque de interfaz para una subrutina externa. La definición aparece después del programa como otra unidad de programa.

```fortran
program llamada_externa
  implicit none
  real :: perfil(4)

  interface
    subroutine centrar(valores)
      implicit none
      real, intent(inout) :: valores(:)
    end subroutine centrar
  end interface

  perfil = (/ 2.0, 3.0, 5.0, 10.0 /)
  call centrar(perfil)
  print *, perfil
end program llamada_externa

subroutine centrar(valores)
  implicit none
  real, intent(inout) :: valores(:)
  real :: promedio

  if (size(valores) == 0) return
  promedio = sum(valores) / real(size(valores))
  valores = valores - promedio
end subroutine centrar
```

```salida
  -3.00000000      -2.00000000       0.00000000       5.00000000
```

> Doc: [Documentación de Fortran-lang](https://fortran-lang.org/learn/quickstart/organising_code/)

El bloque `INTERFACE` no contiene el algoritmo. Declara el mismo contrato que la definición externa. Si ambos divergen, el programa deja de ser conforme aunque cada unidad pueda compilar por separado. Un módulo evita esta duplicación.

# Módulos como unidad de interfaz y encapsulación

Un módulo reúne declaraciones y procedimientos relacionados. `CONTAINS` separa la parte de especificación de los procedimientos del módulo. Un programa accede a nombres públicos mediante `USE`; la cláusula `ONLY` limita los nombres importados y deja visibles las dependencias.

```fortran
module magnitudes_fisicas
  implicit none
  private

  integer, parameter, public :: rk = selected_real_kind(12, 100)
  public :: energia_cinetica

contains

  function energia_cinetica(masa, velocidad) result(energia)
    implicit none
    real(kind=rk), intent(in) :: masa
    real(kind=rk), intent(in) :: velocidad(:)
    real(kind=rk) :: energia

    if (masa < 0.0_rk) stop 'La masa no puede ser negativa'
    energia = 0.5_rk * masa * dot_product(velocidad, velocidad)
  end function energia_cinetica
end module magnitudes_fisicas

program calcular_energia
  use magnitudes_fisicas, only: rk, energia_cinetica
  implicit none
  real(kind=rk) :: velocidad(3), energia

  velocidad = (/ 2.0_rk, -1.0_rk, 0.5_rk /)
  energia = energia_cinetica(3.0_rk, velocidad)
  print *, energia
end program calcular_energia
```

```salida
   7.8750000000000000
```

> Doc: [Documentación de Fortran-lang](https://fortran-lang.org/learn/quickstart/organising_code/)

`PRIVATE` establece accesibilidad privada por omisión. Los atributos `PUBLIC` exponen solo el parámetro de precisión y la función. El uso de `ONLY:` impide que otros nombres públicos futuros entren accidentalmente en el ámbito del programa.

Para compilar unidades separadas, el archivo que contiene el módulo debe compilarse antes que el archivo que contiene el programa usuario. El compilador genera información de interfaz para procesar la sentencia `USE`; el nombre y formato de ese archivo auxiliar dependen del compilador.

# Diseño de un módulo numérico

Una API numérica pequeña suele necesitar: una definición común de precisión, procedimientos públicos, detalles auxiliares privados y contratos que comprueben tamaños. La función siguiente evalúa un polinomio con el esquema de Horner.

```fortran
module polinomios
  implicit none
  private

  integer, parameter, public :: rk = selected_real_kind(12, 100)
  public :: evaluar_polinomio

contains

  function evaluar_polinomio(coeficientes, argumento) result(valor)
    implicit none
    real(kind=rk), intent(in) :: coeficientes(:)
    real(kind=rk), intent(in) :: argumento
    real(kind=rk) :: valor
    integer :: i

    if (size(coeficientes) == 0) then
      valor = 0.0_rk
      return
    end if

    valor = coeficientes(size(coeficientes))
    do i = size(coeficientes) - 1, 1, -1
      valor = valor * argumento + coeficientes(i)
    end do
  end function evaluar_polinomio
end module polinomios

program usar_polinomio
  use polinomios, only: rk, evaluar_polinomio
  implicit none
  real(kind=rk) :: coeficientes(3), valor

  coeficientes = (/ 1.0_rk, -2.0_rk, 0.5_rk /)
  valor = evaluar_polinomio(coeficientes, 3.0_rk)
  print *, valor
end program usar_polinomio
```

```salida
 -0.50000000000000000
```

> Doc: [Documentación de Fortran-lang](https://fortran-lang.org/learn/quickstart/organising_code/)

Los coeficientes se ordenan desde el término constante. El procedimiento acepta cualquier extensión mediante `coeficientes(:)` y trata explícitamente el polinomio vacío.

# PURE: un contrato sin efectos laterales observables

`PURE` no forma parte del estándar Fortran 90; se incorporó en Fortran 95. Se incluye porque permite expresar una propiedad importante del cálculo científico y porque los compiladores actuales que aceptan código de estilo Fortran 90 suelen admitirlo.

Un procedimiento puro restringe los efectos laterales: sus argumentos no pueden usarse para modificar estado externo, una función pura no puede definir sus argumentos, y el procedimiento no debe efectuar entrada o salida externa. Estas restricciones facilitan el razonamiento independiente sobre cada llamada y permiten usar el procedimiento en contextos que exigen pureza.

```fortran
module conversiones
  implicit none
  private
  integer, parameter, public :: rk = selected_real_kind(12, 100)
  public :: celsius_a_kelvin

contains

  pure function celsius_a_kelvin(celsius) result(kelvin)
    implicit none
    real(kind=rk), intent(in) :: celsius
    real(kind=rk) :: kelvin

    kelvin = celsius + 273.15_rk
  end function celsius_a_kelvin
end module conversiones

program convertir_temperatura
  use conversiones, only: rk, celsius_a_kelvin
  implicit none
  real(kind=rk) :: temperatura

  temperatura = celsius_a_kelvin(21.5_rk)
  print *, temperatura
end program convertir_temperatura
```

```salida
   294.64999999999998
```

> Doc: [Documentación de Fortran-lang](https://fortran-lang.org/learn/quickstart/organising_code/)

La comprobación de errores de una función pura no debe depender de escribir un mensaje en un archivo o en la salida estándar. Cuando el dominio puede fallar, el contrato puede devolver un indicador por medio de una subrutina pura o el llamador puede validar las precondiciones antes de invocar la función.

> Nota: `PURE` no prueba estabilidad numérica, exactitud ni ausencia de errores algorítmicos. Declara restricciones sobre efectos y definiciones; la calidad matemática requiere pruebas separadas.

# ELEMENTAL: una definición escalar aplicable a arreglos

`ELEMENTAL` tampoco pertenece a Fortran 90; los procedimientos elementales definidos por el usuario se incorporaron en Fortran 95. Un procedimiento elemental se declara con argumentos ficticios escalares. Puede llamarse con escalares o con arreglos conformables; en el segundo caso, se aplica independientemente a cada posición y el resultado adopta la forma de los argumentos de arreglo.

```fortran
module sensores
  implicit none
  private
  integer, parameter, public :: rk = selected_real_kind(12, 100)
  public :: corregir_lineal

contains

  pure elemental function corregir_lineal(lectura, ganancia, sesgo) &
      result(corregida)
    implicit none
    real(kind=rk), intent(in) :: lectura, ganancia, sesgo
    real(kind=rk) :: corregida

    corregida = ganancia * lectura + sesgo
  end function corregir_lineal
end module sensores

program calibrar_sensores
  use sensores, only: rk, corregir_lineal
  implicit none
  real(kind=rk) :: lectura(4), corregida(4)

  lectura = (/ 0.2_rk, 0.4_rk, 0.6_rk, 0.8_rk /)
  corregida = corregir_lineal(lectura, 1.05_rk, -0.01_rk)
  print *, corregida
end program calibrar_sensores
```

```salida
  0.20000000000000001       0.41000000000000003       0.62000000000000000       0.83000000000000007
```

> Doc: [Documentación de Fortran-lang](https://fortran-lang.org/learn/quickstart/organising_code/)

`lectura` es un arreglo real en la llamada, mientras que `ganancia` y `sesgo` son escalares. Los escalares se combinan con cada elemento. Si más de un argumento real es arreglo, todos los argumentos de arreglo deben ser conformables.

Las funciones intrínsecas elementales de Fortran 90, como `ABS`, `SQRT`, `SIN` y `EXP`, ya ofrecen este comportamiento. `ELEMENTAL` extiende el mismo modelo a una operación definida por el programa en estándares posteriores.

# PURE y ELEMENTAL dentro de una API matricial

El módulo siguiente combina una función elemental para una transformación local y una función pura para una reducción global. La primera conserva la forma; la segunda devuelve un escalar.

```fortran
module errores_numericos
  implicit none
  private
  integer, parameter, public :: rk = selected_real_kind(12, 100)
  public :: error_cuadrado, rmse

contains

  pure elemental function error_cuadrado(calculado, observado) result(error2)
    implicit none
    real(kind=rk), intent(in) :: calculado, observado
    real(kind=rk) :: error2

    error2 = (calculado - observado)**2
  end function error_cuadrado

  pure function rmse(calculado, observado) result(valor)
    implicit none
    real(kind=rk), intent(in) :: calculado(:), observado(:)
    real(kind=rk) :: valor

    if (size(calculado) /= size(observado) .or. &
        size(calculado) == 0) then
      valor = huge(1.0_rk)
      return
    end if

    valor = sqrt(sum(error_cuadrado(calculado, observado)) / &
                 real(size(calculado), kind=rk))
  end function rmse
end module errores_numericos

program medir_error
  use errores_numericos, only: rk, rmse
  implicit none
  real(kind=rk) :: calculado(3), observado(3)

  calculado = (/ 1.1_rk, 1.9_rk, 3.2_rk /)
  observado = (/ 1.0_rk, 2.0_rk, 3.0_rk /)
  print *, rmse(calculado, observado)
end program medir_error
```

```salida
  0.14142135623730964
```

> Doc: [Documentación de Fortran-lang](https://fortran-lang.org/learn/quickstart/organising_code/)

El valor `HUGE(1.0_rk)` funciona aquí como señal documentada de precondición incumplida, no como un resultado físico. En una biblioteca real, una subrutina con argumento de estado puede representar el fallo sin confundirlo con un valor numérico.

# Práctica: Aplicar un procedimiento elemental

Define una función elemental que convierta grados Celsius a kelvin y aplícala a un arreglo. La solución comprueba cada resultado con tolerancia.

La solución de referencia incluye la comprobación. El comentario `verificar-error` identifica una alteración deliberada que el verificador debe rechazar.

```fortran
program practica_elemental
  implicit none
  real :: kelvin(2)
  kelvin = convertir([0.0, 100.0])
  if (any(abs(kelvin - [273.15, 373.15]) > 1.e-4)) error stop 'Conversion incorrecta'
  write(*,'(2(F7.2,1X))') kelvin
contains
  elemental function convertir(celsius) result(temperatura)
    implicit none
    real, intent(in) :: celsius
    real :: temperatura
    ! verificar-error: celsius + 273.15 => celsius - 273.15
    temperatura = celsius + 273.15
  end function convertir
end program practica_elemental
```

```salida
 273.15  373.15
```

> Doc: [Documentación de Fortran-lang](https://fortran-lang.org/learn/quickstart/organising_code/)

# Ejercicio en el navegador

Completa el programa y pulsa «Comprobar». El código se compila y ejecuta en tu navegador; cada intento comienza desde cero.

```ejercicio fortran
# Enunciado
Completa la operación que falta para que el programa cumpla las comprobaciones de esta sesión.
# Plantilla
program practica_elemental
  implicit none
  real :: kelvin(2)
  kelvin = convertir([0.0, 100.0])
  if (any(abs(kelvin - [273.15, 373.15]) > 1.e-4)) error stop 'Conversion incorrecta'
  write(*,'(2(F7.2,1X))') kelvin
contains
  elemental function convertir(celsius) result(temperatura)
    implicit none
    real, intent(in) :: celsius
    real :: temperatura
    temperatura = ___
  end function convertir
end program practica_elemental
# Esperado
 273.15  373.15
# Pista
Revisa la práctica resuelta de esta sesión y las condiciones que comprueba antes de imprimir la salida.
```

# Cierre

Esta sesión distinguió funciones y subrutinas, precisó `INTENT`, arreglos automáticos y argumentos de forma asumida, y mostró por qué una interfaz explícita permite comprobar el contrato. Los módulos proporcionaron esa interfaz sin duplicarla y añadieron encapsulación con `PRIVATE`, `PUBLIC` y `USE, ONLY`. Finalmente, se separó el núcleo Fortran 90 de `PURE` y `ELEMENTAL`, incorporados en Fortran 95, y se aplicaron ambos a transformaciones científicas. La sesión 4 modela registros con tipos derivados, procesa archivos con diagnóstico de entrada y salida e integra arreglos, módulos y procedimientos en un programa científico completo.
