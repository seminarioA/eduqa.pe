---
numero: 4
titulo: "Arreglos, procedimientos y módulos"
---

# Objetivos y referencias

La sesión combina explicación, programas completos y una práctica resuelta. Cada ejemplo se compila en su propio archivo; no depende de haber ejecutado otra sesión. Las referencias enlazan documentación pública del lenguaje y del compilador.

Al terminar la sesión podrás declarar y consultar arreglos, operar sobre formas conformables, pasar arreglos con forma asumida, definir funciones y subrutinas con contratos de argumentos y reunir datos y procedimientos relacionados en un módulo.

# Rango, forma y extensión de un arreglo

Un arreglo reúne elementos del mismo tipo y clase. Su rango es el número de dimensiones, su forma es la secuencia de extensiones y cada extensión cuenta los elementos de una dimensión. `real :: temperatura(24)` declara un arreglo de rango uno y extensión 24; `real :: campo(20, 30)` declara uno de rango dos y forma `[20, 30]`.

Los subíndices predeterminados comienzan en uno. Una declaración puede fijar otros límites, como `integer :: desfase(-3:3)`. `lbound` consulta el límite inferior, `ubound` el superior y `size` el número de elementos. Acceder fuera de esos límites constituye un error; durante el desarrollo, las comprobaciones de límites del compilador deben permanecer activas.

```fortran !sin-consola
program limites_arreglo
  implicit none
  integer :: desfase(-3:3)
  integer :: indice

  do indice = lbound(desfase, 1), ubound(desfase, 1)
    desfase(indice) = indice**2
  end do

  print *, size(desfase), lbound(desfase, 1), ubound(desfase, 1)
  print *, desfase
end program limites_arreglo
```

```salida
           7          -3           3
           9           4           1           0           1           4           9
```

> Doc: [Organización del código](https://fortran-lang.org/learn/quickstart/organising_code/)

El segundo argumento de `lbound` y `ubound` selecciona la dimensión consultada. En un arreglo de rango uno vale `1`; en una matriz puede consultarse cada dimensión por separado.

# Constructores e inicialización

Un constructor de arreglo se delimita con corchetes (`[` y `]`) y enumera elementos separados por comas. La cantidad de valores debe concordar con la entidad que recibe la asignación. Una asignación escalar a un arreglo completo replica el escalar en todos sus elementos.

```fortran !sin-consola
program calibracion_sensores
  implicit none
  real :: ganancia(4)
  real :: cero(4)

  ganancia = [1.02, 0.99, 1.01, 1.00]
  cero = 0.0

  print *, ganancia
  print *, cero
end program calibracion_sensores
```

```salida
   1.01999998      0.990000010       1.00999999       1.00000000    
   0.00000000       0.00000000       0.00000000       0.00000000
```

> Doc: [Organización del código](https://fortran-lang.org/learn/quickstart/organising_code/)

Los cuatro valores del constructor corresponden, en orden, a los cuatro elementos de `ganancia`. La asignación `cero = 0.0` actúa sobre el arreglo completo y no requiere un bucle explícito.

# Arreglos completos y conformabilidad

Las operaciones intrínsecas sobre arreglos completos se aplican elemento por elemento. Dos arreglos son conformables cuando tienen la misma forma; un escalar también puede combinarse con cada elemento de un arreglo. La multiplicación `*` entre matrices sigue siendo elemental: la multiplicación matricial se expresa con la intrínseca `matmul`.

```fortran !sin-consola
program conversion_temperaturas
  implicit none
  real :: temperatura_c(5)
  real :: temperatura_k(5)

  temperatura_c = [-10.0, 0.0, 18.5, 25.0, 80.0]
  temperatura_k = temperatura_c + 273.15

  print *, temperatura_k
end program conversion_temperaturas
```

```salida
   263.149994       273.149994       291.649994       298.149994       353.149994
```

> Doc: [Organización del código](https://fortran-lang.org/learn/quickstart/organising_code/)

El escalar `273.15` se suma a cada elemento. La forma del resultado coincide con la forma de `temperatura_c` y la asignación es válida porque `temperatura_k` tiene esa misma forma.

# Secciones y tripletes de subíndices

Una sección selecciona parte de un arreglo mediante un triplete `inicio:fin:paso`. Los dos primeros valores son inclusivos y el paso predeterminado es uno. El signo de dos puntos (`:`) por sí solo selecciona todos los índices de una dimensión.

```fortran !sin-consola
program ventanas_de_senal
  implicit none
  real :: senal(10)
  real :: ventana(4)

  senal = [0.0, 0.2, 0.5, 0.8, 1.0, 0.7, 0.3, 0.1, -0.1, 0.0]
  ventana = senal(3:6)
  senal(2:10:2) = 0.0

  print *, ventana
  print *, senal
end program ventanas_de_senal
```

```salida
  0.500000000      0.800000012       1.00000000      0.699999988    
   0.00000000       0.00000000      0.500000000       0.00000000       1.00000000       0.00000000      0.300000012       0.00000000     -0.100000001       0.00000000
```

> Doc: [Organización del código](https://fortran-lang.org/learn/quickstart/organising_code/)

`senal(3:6)` contiene cuatro elementos consecutivos. `senal(2:10:2)` selecciona las posiciones pares entre 2 y 10. Una sección sigue siendo un arreglo, aunque contenga un solo elemento.

# Matrices y orden de almacenamiento

Fortran almacena los arreglos de rango dos por columnas: el primer subíndice varía de forma contigua. `matriz(fila, columna)` conserva el orden matemático de los índices, pero un recorrido que cambia primero la fila suele aprovechar mejor la localidad de memoria.

`reshape(fuente, forma)` reorganiza una secuencia en la forma solicitada siguiendo ese orden por columnas. La forma se proporciona como un arreglo entero con la extensión de cada dimensión.

```fortran !sin-consola
program campo_bidimensional
  implicit none
  integer :: fila
  integer :: columna
  real :: campo(3, 2)

  campo = reshape([11.0, 12.0, 13.0, 21.0, 22.0, 23.0], &
                  shape(campo))

  do columna = 1, size(campo, 2)
    do fila = 1, size(campo, 1)
      campo(fila, columna) = campo(fila, columna) * 0.5
    end do
  end do

  print *, campo
end program campo_bidimensional
```

```salida
   5.50000000       6.00000000       6.50000000       10.5000000       11.0000000       11.5000000
```

> Doc: [Organización del código](https://fortran-lang.org/learn/quickstart/organising_code/)

Los tres primeros valores del constructor llenan la primera columna y los tres siguientes, la segunda. `shape(campo)` devuelve `[3, 2]`, que describe la forma del destino.

# Intrínsecas de reducción y consulta

`sum` suma elementos; `product` los multiplica; `minval` y `maxval` devuelven extremos; `count` cuenta elementos verdaderos de un arreglo lógico; `any` comprueba si alguno es verdadero; y `all`, si todos son verdaderos. Muchas reducciones aceptan un argumento `dim` para operar por dimensión y un argumento `mask` para incluir solo elementos seleccionados.

```fortran !sin-consola
program resumen_serie
  implicit none
  real :: lecturas(6)
  logical :: validas(6)
  real :: promedio

  lecturas = [4.2, 4.5, -99.0, 4.4, 4.3, -99.0]
  validas = lecturas > -90.0

  if (count(validas) > 0) then
    promedio = sum(lecturas, mask=validas) / real(count(validas))
    print *, promedio, minval(lecturas, mask=validas), &
             maxval(lecturas, mask=validas)
  else
    print *, 'No hay lecturas validas.'
  end if
end program resumen_serie
```

```salida
   4.35000038       4.19999981       4.50000000
```

> Doc: [Organización del código](https://fortran-lang.org/learn/quickstart/organising_code/)

La máscara lógica tiene la misma forma que `lecturas`. `sum`, `minval` y `maxval` ignoran los elementos cuyo valor correspondiente en `validas` es falso. La condición evita aplicar las reducciones de extremo a un conjunto vacío.

# Procedimientos y descomposición

Un procedimiento encapsula una operación con entradas y resultados definidos. Una subrutina se invoca mediante `call` y puede comunicar varios resultados por su lista de argumentos. Una función se usa dentro de una expresión y devuelve un resultado principal.

Colocar procedimientos internos después de `contains` ofrece una interfaz explícita: el compilador conoce tipos, clases, rangos y atributos de los argumentos al revisar cada llamada. Cada procedimiento mantiene su propia parte de especificación y debe incluir `implicit none`.

# Subrutinas e INTENT

En un argumento ficticio, `intent(in)` indica que el procedimiento recibe un valor y no puede definirlo; `intent(out)` indica que debe producirlo; `intent(inout)` indica que recibe un valor existente y puede reemplazarlo. Declarar la intención de todos los argumentos convierte la interfaz en un contrato comprobable.

```fortran !sin-consola
program convertir_coordenadas
  implicit none
  real :: radio
  real :: angulo_rad
  real :: coordenada_x
  real :: coordenada_y

  radio = 3.5
  angulo_rad = 0.8
  call polar_a_cartesiana(radio, angulo_rad, coordenada_x, coordenada_y)
  print *, coordenada_x, coordenada_y

contains

  subroutine polar_a_cartesiana(r, theta, x_cart, y_cart)
    implicit none
    real, intent(in) :: r
    real, intent(in) :: theta
    real, intent(out) :: x_cart
    real, intent(out) :: y_cart

    x_cart = r * cos(theta)
    y_cart = r * sin(theta)
  end subroutine polar_a_cartesiana

end program convertir_coordenadas
```

```salida
   2.43847346       2.51074624
```

> Doc: [Organización del código](https://fortran-lang.org/learn/quickstart/organising_code/)

Los nombres `r`, `theta`, `x_cart` y `y_cart` son argumentos ficticios de la subrutina; los nombres de la llamada son argumentos reales. Deben concordar en número, tipo y rango. La interfaz explícita permite que el compilador compruebe buena parte de esa concordancia.

# Arreglos de forma asumida

Un argumento declarado con dos puntos, como `real, intent(in) :: datos(:)`, toma su extensión del arreglo real asociado. Es un arreglo de forma asumida y requiere una interfaz explícita. Dentro del procedimiento se consulta con `size`, `lbound` y `ubound` en lugar de repetir una longitud separada que podría contradecirlo.

```fortran !sin-consola
program normalizar_serie
  implicit none
  real :: serie(5)

  serie = [2.0, 3.0, 5.0, 7.0, 11.0]
  call centrar(serie)
  print *, serie

contains

  subroutine centrar(valores)
    implicit none
    real, intent(inout) :: valores(:)
    real :: media

    if (size(valores) == 0) return
    media = sum(valores) / real(size(valores))
    valores = valores - media
  end subroutine centrar

end program normalizar_serie
```

```salida
  -3.59999990      -2.59999990     -0.599999905       1.40000010       5.40000010
```

> Doc: [Organización del código](https://fortran-lang.org/learn/quickstart/organising_code/)

La asignación de arreglo completo modifica todos los elementos. `intent(inout)` es necesario porque la subrutina usa los valores originales para calcular la media y después reemplaza los elementos.

# Funciones

Una función devuelve un resultado que participa en una expresión. `result(nombre)` asigna un nombre explícito al resultado y evita confundirlo con el nombre de la función. Una función orientada al cálculo debe evitar efectos laterales inesperados: sus argumentos de entrada no deben modificarse ni debería depender de estado global mutable.

```fortran !sin-consola
program energia_resorte
  implicit none
  real :: rigidez_n_m
  real :: elongacion_m
  real :: energia_j

  rigidez_n_m = 180.0
  elongacion_m = 0.12
  energia_j = energia_elastica(rigidez_n_m, elongacion_m)
  print *, energia_j

contains

  pure function energia_elastica(rigidez, elongacion) result(energia)
    implicit none
    real, intent(in) :: rigidez
    real, intent(in) :: elongacion
    real :: energia

    energia = 0.5 * rigidez * elongacion**2
  end function energia_elastica

end program energia_resorte
```

```salida
   1.29600000
```

> Doc: [Organización del código](https://fortran-lang.org/learn/quickstart/organising_code/)

El atributo `pure` restringe efectos laterales y favorece el razonamiento local. El tipo del resultado se declara dentro de la función; el tipo de los argumentos también forma parte de la interfaz explícita.

# Módulos

Un módulo reúne constantes, datos derivados y procedimientos relacionados. El módulo se compila antes de cualquier unidad que lo use. La sentencia `use nombre_modulo, only: lista` importa únicamente los nombres indicados, reduce colisiones y documenta dependencias.

Dentro de un módulo, `private` establece acceso privado por omisión y `public :: nombre` expone la interfaz elegida. Los procedimientos colocados después de `contains` tienen interfaz explícita para las unidades que usan el módulo.

```fortran !sin-consola
module conversion_unidades
  implicit none
  private
  real, parameter, public :: pascal_por_bar = 100000.0
  public :: bar_a_pascal

contains

  pure function bar_a_pascal(presion_bar) result(presion_pa)
    implicit none
    real, intent(in) :: presion_bar
    real :: presion_pa

    presion_pa = presion_bar * pascal_por_bar
  end function bar_a_pascal

end module conversion_unidades

program usar_conversion
  use conversion_unidades, only: bar_a_pascal
  implicit none
  real :: presion_bar
  real :: presion_pa

  presion_bar = 1.25
  presion_pa = bar_a_pascal(presion_bar)
  print *, presion_pa
end program usar_conversion
```

```salida
   125000.000
```

> Doc: [Organización del código](https://fortran-lang.org/learn/quickstart/organising_code/)

El módulo precede al programa en este archivo fuente para que el compilador pueda generar su información antes de procesar `use`. En un proyecto con archivos separados, primero se compila el archivo del módulo y después la unidad que lo importa; al final se enlazan ambos objetos.

# Un módulo para operaciones sobre arreglos

Combinar módulos con argumentos de forma asumida produce componentes reutilizables y comprobables. El módulo define la precisión una sola vez y la misma constante de clase forma parte de la interfaz de sus procedimientos.

```fortran !sin-consola
module estadistica_basica
  implicit none
  private
  integer, parameter, public :: rk = selected_real_kind(p=12, r=100)
  public :: media

contains

  pure function media(valores) result(promedio)
    implicit none
    real(kind=rk), intent(in) :: valores(:)
    real(kind=rk) :: promedio

    if (size(valores) == 0) then
      promedio = 0.0_rk
    else
      promedio = sum(valores) / real(size(valores), kind=rk)
    end if
  end function media

end module estadistica_basica

program analizar_temperaturas
  use estadistica_basica, only: media, rk
  implicit none
  real(kind=rk) :: temperaturas_c(4)

  temperaturas_c = [18.2_rk, 18.5_rk, 18.1_rk, 18.4_rk]
  print *, media(temperaturas_c)
end program analizar_temperaturas
```

```salida
   18.300000000000001
```

> Doc: [Organización del código](https://fortran-lang.org/learn/quickstart/organising_code/)

Importar también `rk` garantiza que el arreglo real y el argumento ficticio tengan la misma clase. La política elegida para un arreglo vacío devuelve cero; en una biblioteca científica, esa decisión debe documentarse o sustituirse por un mecanismo explícito de error si cero pudiera confundirse con una medición válida.

# Compilación separada y dependencias

Si `estadistica_basica` está en `estadistica_basica.f90` y el programa en `analizar_temperaturas.f90`, una compilación separada con GNU Fortran puede usar `gfortran -c estadistica_basica.f90`, después `gfortran -c analizar_temperaturas.f90` y finalmente `gfortran estadistica_basica.o analizar_temperaturas.o -o analizar_temperaturas`. La primera orden crea también el archivo de información del módulo que necesita la segunda.

El orden de enlace puede importar con bibliotecas y dependencias más complejas. Un sistema de construcción debe expresar que el programa depende del módulo para no compilar en un orden accidental. Las interfaces explícitas detectan incompatibilidades durante la compilación, pero no sustituyen pruebas sobre valores límite, arreglos vacíos, escalas numéricas y unidades físicas.

# Diseño de una unidad científica

Antes de crear un procedimiento, define qué recibe, qué devuelve, qué unidades usa y qué condiciones deben cumplir sus argumentos. Usa `intent(in)` salvo que la modificación sea parte explícita del contrato. Prefiere resultados de función para un valor principal y subrutinas cuando la operación produce varios resultados relacionados o modifica una entidad de forma intencional.

Mantén privados los detalles que no formen parte de la interfaz del módulo. Importa con `only`, usa arreglos de forma asumida y consulta sus límites. Estas decisiones permiten que el compilador verifique más propiedades y reducen las dependencias que una persona debe recordar al reutilizar el cálculo.

# Práctica final: una función que resume una serie

Define una función interna que reciba un arreglo entero y devuelva su suma. Pruébala con tres elementos y con un arreglo vacío. La suma del arreglo vacío es cero; esa propiedad no significa que su promedio esté definido.

```fortran !sin-consola
program practica_resumen
  implicit none
  integer :: muestras(3)
  muestras = [4, 7, 9]
  if (total(muestras) /= 20) error stop 'Suma incorrecta'
  if (total([integer ::]) /= 0) error stop 'Caso vacio incorrecto'
  write(*,'(I0)') total(muestras)
contains
  pure function total(valores) result(acumulado)
    implicit none
    integer, intent(in) :: valores(:)
    integer :: acumulado
    ! verificar-error: sum(valores) => size(valores)
    acumulado = sum(valores)
  end function total
end program practica_resumen
```

```salida
20
```

> Doc: [GNU Fortran: SUM](https://gcc.gnu.org/onlinedocs/gfortran/SUM.html)

El constructor `[integer ::]` declara explícitamente el tipo de un arreglo sin elementos. La solución incorrecta que devuelve su tamaño debe fallar para la serie de tres elementos. Para cerrar el curso, compila este archivo desde una carpeta nueva: la función debe estar incluida después de `contains` y no depender de módulos generados en otra práctica.

# Cierre

Esta sesión cubrió rango, forma, límites, constructores, operaciones elementales, secciones, matrices, reducciones, subrutinas, funciones, argumentos con `intent`, arreglos de forma asumida, módulos, visibilidad y compilación separada.

Con estas herramientas ya puedes dividir un cálculo científico introductorio en unidades verificables: los arreglos representan colecciones coherentes, los procedimientos expresan operaciones con contratos y los módulos reúnen interfaces reutilizables sin recurrir a estado global implícito. El siguiente paso de estudio puede abordar entrada y salida formateada, arreglos asignables, tipos derivados, manejo explícito de errores y pruebas automatizadas de procedimientos.
