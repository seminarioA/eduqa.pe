---
numero: 2
titulo: "Expresiones, tipos, precisión e intrínsecas"
---

# Objetivos y referencias

La sesión combina explicación, programas completos y una práctica resuelta. Cada ejemplo se compila en su propio archivo; no depende de haber ejecutado otra sesión. Las referencias enlazan documentación pública del lenguaje y del compilador.

Al terminar la sesión podrás predecir el tipo de una expresión, impedir divisiones enteras accidentales, seleccionar una representación real por requisitos de precisión y emplear funciones intrínsecas sin atribuir al punto flotante exactitud matemática ilimitada.

# Operadores aritméticos y precedencia

Fortran dispone de suma (`+`), resta (`-`), multiplicación (`*`), división (`/`) y potencia (`**`). Los paréntesis se evalúan desde los más internos; después se evalúan las potencias de derecha a izquierda; multiplicaciones y divisiones, de izquierda a derecha; y sumas y restas, de izquierda a derecha. Los signos unarios `+` y `-` expresan el signo de un operando.

Los paréntesis deben comunicar la fórmula incluso cuando la precedencia ya produzca el resultado deseado. Una expresión legible permite comparar el código con la ecuación científica y reduce errores durante el mantenimiento.

```fortran !sin-consola
program distancia_acelerada
  implicit none
  real :: aceleracion_m_s2
  real :: tiempo_s
  real :: distancia_m

  aceleracion_m_s2 = 1.8
  tiempo_s = 7.5
  distancia_m = 0.5 * aceleracion_m_s2 * (tiempo_s**2)

  print *, distancia_m
end program distancia_acelerada
```

```salida
   50.6250000
```

> Doc: [Funciones intrínsecas](https://gcc.gnu.org/onlinedocs/gfortran/Intrinsic-Procedures.html)

El operador de potencia es asociativo por la derecha: `a**b**c` se interpreta como `a**(b**c)`. Cuando una fórmula requiere `(a**b)**c`, los paréntesis cambian de forma explícita el orden.

# Aritmética entera

Una operación entre dos valores `integer` produce un resultado entero. La división entera descarta la parte fraccionaria y trunca hacia cero. El tipo de la variable receptora no modifica una operación que ya ocurrió: asignar `muestras_validas / muestras_totales` a una variable real conserva primero el cociente entero.

```fortran !sin-consola
program fraccion_valida
  implicit none
  integer :: muestras_validas
  integer :: muestras_totales
  real :: fraccion

  muestras_validas = 17
  muestras_totales = 20
  fraccion = real(muestras_validas) / real(muestras_totales)

  print *, fraccion
end program fraccion_valida
```

```salida
  0.850000024
```

> Doc: [Funciones intrínsecas](https://gcc.gnu.org/onlinedocs/gfortran/Intrinsic-Procedures.html)

La función intrínseca de conversión `real` crea operandos reales antes de la división. Convertir al menos uno de los operandos sería suficiente para que la operación fuera real; convertir ambos documenta con claridad la intención.

> Nota: la división entera es adecuada cuando se desea un cociente entero. El defecto aparece cuando una fórmula requiere una fracción y ambos operandos llegan a `/` como enteros.

# Aritmética real y error de redondeo

Un valor `real` ocupa un número finito de bits. Muchos números decimales no tienen una representación binaria finita, por lo que se almacenan mediante una aproximación. Cada operación puede redondear su resultado y una secuencia larga puede acumular error.

La igualdad exacta (`==`) rara vez es la prueba adecuada para resultados reales calculados. Una comparación numérica suele aceptar una tolerancia absoluta, relativa o una combinación de ambas según la escala y el modelo físico. La tolerancia debe derivarse del problema; no existe una constante universal que sustituya ese análisis.

```fortran !sin-consola
program comparacion_aproximada
  implicit none
  real :: valor_calculado
  real :: valor_referencia
  real :: tolerancia
  logical :: coincide

  valor_calculado = sqrt(2.0)**2
  valor_referencia = 2.0
  tolerancia = 100.0 * epsilon(valor_calculado)
  coincide = abs(valor_calculado - valor_referencia) <= &
             tolerancia * max(1.0, abs(valor_referencia))

  print *, coincide
end program comparacion_aproximada
```

```salida
 T
```

> Doc: [Funciones intrínsecas](https://gcc.gnu.org/onlinedocs/gfortran/Intrinsic-Procedures.html)

`epsilon` devuelve la separación relativa entre `1` y el siguiente número representable para la clase del argumento. Multiplicarla por una escala constituye aquí una demostración de comparación relativa, no una tolerancia física para cualquier cálculo.

# Expresiones de modo mixto

Cuando una misma operación combina un entero y un real, Fortran convierte el entero al tipo real aplicable y obtiene un resultado real. La conversión ocurre en esa operación, no al inicio de toda la expresión. Por eso `1.0 + 1 / 4` evalúa primero una división entera, mientras que `1.0 + 1.0 / 4.0` mantiene aritmética real.

Las conversiones explícitas hacen visible una decisión. `real` convierte a real; `int` trunca un real hacia cero; `nint` devuelve el entero más cercano; `floor` devuelve el mayor entero no superior al argumento; y `ceiling`, el menor entero no inferior al argumento.

```fortran !sin-consola
program discretizacion_temporal
  implicit none
  real :: duracion_s
  real :: paso_s
  integer :: pasos_completos
  integer :: pasos_necesarios

  duracion_s = 10.2
  paso_s = 0.5
  pasos_completos = floor(duracion_s / paso_s)
  pasos_necesarios = ceiling(duracion_s / paso_s)

  print *, pasos_completos, pasos_necesarios
end program discretizacion_temporal
```

```salida
          20          21
```

> Doc: [Funciones intrínsecas](https://gcc.gnu.org/onlinedocs/gfortran/Intrinsic-Procedures.html)

`floor` y `ceiling` expresan dos modelos distintos: intervalos completos contenidos en la duración e intervalos necesarios para cubrirla. Elegir entre ambos requiere definir el problema, no solo convertir el tipo.

# Clase, precisión y rango

El parámetro de clase, llamado *kind*, distingue representaciones dentro de un tipo intrínseco. Un número de clase no es un tamaño portable: que un compilador use `8` para cierto real no obliga a otro a usar el mismo valor. Tampoco conviene basar un algoritmo en las etiquetas informales de precisión simple o doble.

`selected_real_kind(p, r)` solicita una clase real con al menos `p` dígitos decimales de precisión y un rango de exponentes decimales de al menos `r`. La función devuelve un valor negativo si el procesador no ofrece una clase que satisfaga los requisitos. Definir el resultado como constante con nombre permite usar la misma clase en variables, literales y conversiones.

```fortran !sin-consola
program caida_con_precision
  implicit none
  integer, parameter :: rk = selected_real_kind(p=12, r=100)
  real(kind=rk), parameter :: gravedad_m_s2 = 9.80665_rk
  real(kind=rk) :: tiempo_s
  real(kind=rk) :: velocidad_m_s

  tiempo_s = 12.5_rk
  velocidad_m_s = gravedad_m_s2 * tiempo_s

  print *, velocidad_m_s
end program caida_con_precision
```

```salida
   122.58312500000000
```

> Doc: [Funciones intrínsecas](https://gcc.gnu.org/onlinedocs/gfortran/Intrinsic-Procedures.html)

El sufijo `_rk` asigna la clase elegida a cada literal real. Declarar una variable con `real(kind=rk)` no recupera cifras que se hayan perdido al evaluar antes una constante con la clase real predeterminada.

> Nota: un resultado negativo de `selected_real_kind` debe provocar un error de configuración en software portable. Los requisitos `p=12` y `r=100` son moderados, pero el programa no debe convertir silenciosamente un valor negativo en parámetro de clase.

# Consultas sobre el modelo numérico

Las funciones intrínsecas de consulta describen la representación del argumento. `precision` informa los dígitos decimales de precisión; `range`, el rango decimal de exponentes; `huge`, el mayor número finito positivo; `tiny`, el menor número positivo normal; y `epsilon`, la precisión relativa cerca de uno.

```fortran !sin-consola
program propiedades_reales
  implicit none
  integer, parameter :: rk = selected_real_kind(p=12, r=100)
  real(kind=rk) :: referencia

  referencia = 1.0_rk
  print *, precision(referencia)
  print *, range(referencia)
  print *, huge(referencia)
  print *, tiny(referencia)
  print *, epsilon(referencia)
end program propiedades_reales
```

```salida
          15
         307
   1.7976931348623157E+308
   2.2250738585072014E-308
   2.2204460492503131E-016
```

> Doc: [Funciones intrínsecas](https://gcc.gnu.org/onlinedocs/gfortran/Intrinsic-Procedures.html)

Estas consultas evitan atribuir a una clase propiedades recordadas de otra plataforma. `huge` y `tiny` no autorizan a operar cerca de los límites sin analizar desbordamiento, subdesbordamiento y estabilidad numérica.

# Constantes y conversiones con la clase correcta

Una conversión puede recibir el argumento nombrado `kind`. `real(conteo, kind=rk)` convierte un entero directamente a la clase `rk`. Del mismo modo, las constantes reales empleadas en una expresión de alta precisión deben llevar el sufijo de clase.

```fortran !sin-consola
program promedio_mediciones
  implicit none
  integer, parameter :: rk = selected_real_kind(p=12, r=100)
  integer :: cantidad
  real(kind=rk) :: suma_pa
  real(kind=rk) :: promedio_pa

  cantidad = 8
  suma_pa = 812340.0_rk
  promedio_pa = suma_pa / real(cantidad, kind=rk)

  print *, promedio_pa
end program promedio_mediciones
```

```salida
   101542.50000000000
```

> Doc: [Funciones intrínsecas](https://gcc.gnu.org/onlinedocs/gfortran/Intrinsic-Procedures.html)

La conversión explícita impide una operación de modo mixto cuyo detalle dependa del contexto. También documenta que el promedio debe conservar la clase usada para acumular la suma.

# Funciones intrínsecas matemáticas

Una función intrínseca recibe argumentos entre paréntesis y devuelve un valor que puede participar en una expresión. Entre las funciones elementales más usadas están `abs` para valor absoluto, `sqrt` para raíz cuadrada, `exp` para exponencial natural, `log` para logaritmo natural, `log10` para logaritmo decimal, y `sin`, `cos` y `tan` para trigonometría en radianes. `min` y `max` seleccionan extremos; `mod` calcula un resto.

El dominio forma parte del contrato: `sqrt` requiere un argumento real no negativo si se espera un resultado real; `log` y `log10` requieren un argumento positivo. Las funciones trigonométricas estándar reciben radianes, de modo que los grados deben convertirse antes.

```fortran !sin-consola
program componentes_vector
  implicit none
  integer, parameter :: rk = selected_real_kind(p=12, r=100)
  real(kind=rk), parameter :: pi = acos(-1.0_rk)
  real(kind=rk) :: magnitud_n
  real(kind=rk) :: angulo_grados
  real(kind=rk) :: angulo_radianes
  real(kind=rk) :: componente_horizontal_n
  real(kind=rk) :: componente_vertical_n

  magnitud_n = 125.0_rk
  angulo_grados = 35.0_rk
  angulo_radianes = angulo_grados * pi / 180.0_rk
  componente_horizontal_n = magnitud_n * cos(angulo_radianes)
  componente_vertical_n = magnitud_n * sin(angulo_radianes)

  print *, componente_horizontal_n, componente_vertical_n
end program componentes_vector
```

```salida
   102.39400553612397        71.697054543880753
```

> Doc: [Funciones intrínsecas](https://gcc.gnu.org/onlinedocs/gfortran/Intrinsic-Procedures.html)

`acos(-1.0_rk)` obtiene π en la misma clase que el resto del cálculo. Los nombres distinguen grados y radianes para que la conversión no quede implícita en una cifra.

# Intrínsecas genéricas y tipo del resultado

Muchas intrínsecas son genéricas: el compilador selecciona una versión compatible con el tipo y la clase de los argumentos. `abs` devuelve un entero cuando recibe un entero y un real de la clase correspondiente cuando recibe un real. `min` y `max` exigen argumentos compatibles; mezclar clases sin intención explícita dificulta razonar sobre el resultado.

```fortran !sin-consola
program error_acotado
  implicit none
  real :: medicion
  real :: referencia
  real :: error_absoluto
  real :: error_limitado

  medicion = 9.74
  referencia = 10.0
  error_absoluto = abs(medicion - referencia)
  error_limitado = min(error_absoluto, 1.0)

  print *, error_absoluto, error_limitado
end program error_acotado
```

```salida
  0.260000229      0.260000229
```

> Doc: [Funciones intrínsecas](https://gcc.gnu.org/onlinedocs/gfortran/Intrinsic-Procedures.html)

La primera llamada a `abs` conserva el tipo real del argumento. La llamada a `min` compara dos reales compatibles y limita el valor almacenado sin alterar `error_absoluto`.

# Estabilidad antes que más cifras

Aumentar la precisión reduce ciertos errores de redondeo, pero no corrige una fórmula inestable. Restar números cercanos puede perder cifras significativas; acumular valores de magnitudes muy diferentes puede ocultar contribuciones pequeñas; y exceder `huge` sigue produciendo desbordamiento. La elección de clase debe acompañarse de una formulación numérica adecuada y pruebas con escalas representativas.

Antes de fijar `p` y `r`, identifica cuántas cifras significativas necesita el resultado, qué magnitudes intermedias aparecerán y qué error admite el modelo. Después consulta las propiedades reales del compilador y conserva la misma clase en datos, literales y procedimientos.

# Práctica: conservar una fracción

Calcula la proporción de tres muestras válidas entre ocho muestras totales. Convierte los operandos antes de dividir. La solución comprueba el resultado con una tolerancia absoluta de una millonésima, suficiente para este cálculo acotado. El formato `F5.3` reserva cinco caracteres y muestra tres decimales.

```fortran !sin-consola
program practica_fraccion
  implicit none
  integer :: validas, total
  real :: proporcion
  validas = 3
  total = 8
  ! verificar-error: real(validas) / real(total) => validas / total
  proporcion = real(validas) / real(total)
  if (abs(proporcion - 0.375) > 1.e-6) error stop 'Se perdio la fraccion'
  write(*,'(F5.3)') proporcion
end program practica_fraccion
```

```salida
0.375
```

> Doc: [Fortran-lang: división entera](https://fortran-lang.org/learn/best_practices/integer_division/)

Comprueba que retirar las conversiones hace fallar el programa. Declarar `proporcion` como real no modifica retroactivamente la división entera.

# Cierre

Esta sesión cubrió operadores y precedencia, división entera, aritmética mixta, conversiones explícitas, aproximación de punto flotante, selección portable de clase y funciones intrínsecas matemáticas y de consulta.

La sesión siguiente emplea expresiones lógicas para seleccionar y repetir operaciones mediante `if`, `select case` y distintas formas de `do`. La precisión numérica seguirá siendo relevante al formular condiciones con valores reales.
