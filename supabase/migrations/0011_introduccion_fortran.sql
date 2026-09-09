-- Generado desde los Markdown. Aplicar como una sola transacción.

-- Conserva precio, estado, acceso y matrículas de cursos existentes.

begin;

insert into public.rutas (slug, nombre, descripcion, orden) values ('programacion-fortran', 'Programación Fortran', 'Aprende Fortran desde cero y avanza hacia programación avanzada y desarrollo de software con pruebas, archivos e interoperabilidad.', 3) on conflict (slug) do update set nombre=excluded.nombre, descripcion=excluded.descripcion, orden=excluded.orden;

insert into public.cursos (slug, titulo, resumen, precio, estado, acceso_libre, orden, ruta, posicion, requisitos) values ('fortran-fundamentos', 'Introducción a Fortran', 'Fundamentos de Fortran moderno para formular cálculos científicos: tipos y precisión, control de flujo, arreglos, procedimientos y módulos.', 20, 'publico', true, 15, 'programacion-fortran', 1, array[]::text[]) on conflict (slug) do update set titulo=excluded.titulo, resumen=excluded.resumen, orden=excluded.orden, ruta=excluded.ruta, posicion=excluded.posicion, requisitos=excluded.requisitos, actualizado_en=now();

insert into public.curso_contenido (curso_slug, archivo, contenido) values ('fortran-fundamentos', 'curso.md', '---
slug: fortran-fundamentos
titulo: "Introducción a Fortran"
resumen: "Fundamentos de Fortran moderno para formular cálculos científicos: tipos y precisión, control de flujo, arreglos, procedimientos y módulos."
area: "Lenguajes"
nivel: INTRODUCCIÓN
horas: 16
icono: fortran
precio: 20
estado: publico
acceso_libre: true
orden: 15
ruta:
  slug: programacion-fortran
  nombre: "Programación Fortran"
  descripcion: "Aprende Fortran desde cero y avanza hacia programación avanzada y desarrollo de software con pruebas, archivos e interoperabilidad."
  orden: 3
  posicion: 1
  requisitos: []
---
') on conflict (curso_slug, archivo) do update set contenido=excluded.contenido, actualizado_en=now();

insert into public.curso_contenido (curso_slug, archivo, contenido) values ('fortran-fundamentos', 'sesion-1.md', '---
numero: 1
titulo: "Estructura, compilación y variables"
---

# Objetivos y referencias

La sesión combina explicación, programas completos y una práctica resuelta. Cada ejemplo se compila en su propio archivo; no depende de haber ejecutado otra sesión. Las referencias enlazan documentación pública del lenguaje y del compilador.

Al terminar la sesión podrás reconocer las partes de una unidad de programa, guardar código fuente en formato libre, convertirlo en un ejecutable, declarar datos escalares y detectar nombres no declarados durante la compilación.

# Preparar el entorno

Necesitas un editor de texto, una terminal y GNU Fortran. Sigue la instalación correspondiente a tu sistema en la documentación enlazada y ejecuta `gfortran --version` para comprobar que la terminal encuentra el compilador. La consola de EDUQA ejecuta Python; estos programas se compilan en tu equipo.

> Doc: [Fortran-lang: instalar GNU Fortran](https://fortran-lang.org/learn/os_setup/install_gfortran/)

Crea una carpeta de prácticas y guarda cada bloque completo en un archivo `.f90`, sin las marcas de Markdown. En macOS o Linux, `pwd` muestra la carpeta actual y `cd` permite cambiarla. En PowerShell utiliza `Get-Location` para consultar la carpeta y `Set-Location` para cambiarla. Compila desde la carpeta que contiene el archivo. En Windows puedes nombrar la salida `programa.exe` y ejecutarla con `./programa.exe`.

Las salidas publicadas se obtuvieron ejecutando los ejemplos con GNU Fortran. El formato dirigido por lista y las propiedades del modelo real pueden variar entre compiladores; los espacios y las últimas cifras no son un contrato portable. Los ejercicios con formato explícito facilitan comparar los resultados.

# Del texto fuente al programa en ejecución

Un archivo Fortran moderno suele usar la extensión `.f90`. El archivo contiene texto fuente: declaraciones y operaciones que todavía no son instrucciones ejecutables del procesador. Un compilador comprueba el texto y lo traduce a código objeto. El enlazador combina ese objeto con las bibliotecas requeridas y produce el archivo ejecutable. Muchos controladores de compilación realizan ambas etapas con una sola orden.

Con GNU Fortran, `gfortran -std=f2018 -Wall -Wextra -fcheck=all medicion.f90 -o medicion` solicita el estándar Fortran 2018, activa diagnósticos habituales, añade comprobaciones en ejecución y nombra `medicion` al ejecutable. En sistemas tipo Unix, `./medicion` ejecuta ese archivo. El indicador `-c` detiene el proceso después de crear código objeto; resulta útil cuando un proyecto compila varias unidades por separado antes de enlazarlas.

Un diagnóstico del compilador no es una salida científica del programa. Primero se corrigen los errores de sintaxis o de tipos; después se analizan los resultados del ejecutable. Las advertencias también requieren revisión porque suelen revelar variables sin uso, conversiones o expresiones sospechosas.

# La unidad de programa principal

Una unidad principal puede comenzar con `program nombre` y termina con `end program nombre`. Entre ambas sentencias se distinguen una parte de especificación y una parte de ejecución. La parte de especificación contiene `implicit none` y las declaraciones; la parte ejecutable contiene asignaciones, entrada, salida y llamadas. Una sentencia ejecutable no puede preceder a una declaración de la misma unidad.

```fortran !sin-consola
program energia_cinetica
  implicit none
  real :: masa_kg
  real :: velocidad_m_s
  real :: energia_j

  masa_kg = 2.5
  velocidad_m_s = 4.0
  energia_j = 0.5 * masa_kg * velocidad_m_s**2

  print *, energia_j
end program energia_cinetica
```

```salida
   20.0000000
```

> Doc: [Tipos y variables](https://fortran-lang.org/learn/quickstart/variables/)

El operador de asignación (`=`) evalúa la expresión de la derecha y almacena el resultado en la variable de la izquierda. El operador de potencia (`**`) eleva la velocidad al cuadrado. `print *` solicita salida con formato elegido por el procesador; por esa razón el curso no promete una representación textual literal.

> Nota: Fortran no distingue mayúsculas de minúsculas en palabras clave ni identificadores. Mantener una convención estable mejora la lectura, pero `masa_kg` y `MASA_KG` designan el mismo nombre.

# Sentencias y comentarios en formato libre

En el formato libre de los archivos `.f90`, una sentencia puede comenzar en cualquier columna. El signo de exclamación (`!`) inicia un comentario y hace que el compilador ignore el resto de esa línea. Un comentario debe explicar propósito, unidades, supuestos o límites; repetir la operación visible no añade información.

El signo ampersand (`&`) al final de una línea continúa una sentencia en la línea siguiente. Si la continuación divide una constante de caracteres, se coloca también un ampersand al inicio de la parte continuada. Una línea fuente no debe dividirse por su apariencia visual si la división oculta la estructura de la expresión.

```fortran !sin-consola
program alcance_proyectil
  implicit none
  real, parameter :: gravedad_m_s2 = 9.80665
  real :: velocidad_m_s
  real :: angulo_rad
  real :: alcance_m

  velocidad_m_s = 18.0
  angulo_rad = 0.60
  alcance_m = velocidad_m_s**2 * &
              sin(2.0 * angulo_rad) / gravedad_m_s2

  print *, alcance_m
end program alcance_proyectil
```

```salida
   30.7934570
```

> Doc: [Tipos y variables](https://fortran-lang.org/learn/quickstart/variables/)

La coma separa atributos o elementos de una lista. El doble dos puntos (`::`) separa la especificación del tipo y sus atributos de la lista de entidades declaradas. Aunque `::` puede omitirse en declaraciones sencillas, conservarlo permite añadir atributos sin cambiar la forma general de la declaración.

# Identificadores y diccionario de datos

Un identificador estándar comienza con una letra y puede continuar con letras, dígitos y guion bajo (`_`). Su longitud máxima es de 63 caracteres. Los nombres deben expresar la magnitud y, cuando sea útil, la unidad: `presion_pa` informa más que `p`. Como los identificadores no distinguen mayúsculas, cambiar la capitalización no crea otra variable.

Un diccionario de datos breve documenta qué representa cada variable y en qué unidades se expresa. En programas pequeños puede quedar integrado en los nombres y comentarios. En proyectos extensos conviene mantener esa información junto a las declaraciones para evitar que una temperatura en grados Celsius se confunda con una temperatura en kelvin.

# Tipos intrínsecos escalares

`integer` representa enteros; `real`, números de punto flotante; `complex`, números con parte real e imaginaria; `logical`, valores lógicos; y `character`, texto. Esta sesión utiliza las formas básicas. La precisión y los parámetros de clase, llamados *kind*, se estudian en la sesión siguiente.

```fortran !sin-consola
program estado_experimento
  implicit none
  integer :: muestras
  real :: temperatura_c
  complex :: impedancia_ohm
  logical :: sensor_activo
  character(len=12) :: identificador

  muestras = 240
  temperatura_c = 21.75
  impedancia_ohm = cmplx(4.2, -0.8)
  sensor_activo = .true.
  identificador = ''camara-norte''

  print *, muestras, temperatura_c, impedancia_ohm
  print *, sensor_activo, identificador
end program estado_experimento
```

```salida
         240   21.7500000               (4.19999981,-0.800000012)
 T camara-norte
```

> Doc: [Tipos y variables](https://fortran-lang.org/learn/quickstart/variables/)

Los puntos forman parte de las constantes lógicas `.true.` y `.false.`. En `character(len=12)`, `len` establece una longitud de doce caracteres: una asignación más corta se rellena con espacios y una más larga se trunca. `cmplx` construye el valor complejo a partir de sus componentes.

> Nota: una variable local no adquiere un valor definido por el mero hecho de declararla. Leerla antes de asignarle un valor produce un programa incorrecto aunque una ejecución concreta parezca mostrar cero.

# Constantes con nombre

El atributo `parameter` convierte una entidad en constante con nombre. La expresión que la inicializa se evalúa en la declaración y el programa no puede asignarle otro valor. Las constantes con nombre eliminan números sin explicación y mantienen una decisión física en un solo lugar.

```fortran !sin-consola
program periodo_pendulo
  implicit none
  real, parameter :: pi = acos(-1.0)
  real, parameter :: gravedad_m_s2 = 9.80665
  real :: longitud_m
  real :: periodo_s

  longitud_m = 0.80
  periodo_s = 2.0 * pi * sqrt(longitud_m / gravedad_m_s2)

  print *, periodo_s
end program periodo_pendulo
```

```salida
   1.79458702
```

> Doc: [Tipos y variables](https://fortran-lang.org/learn/quickstart/variables/)

La constante `pi` se obtiene mediante la función intrínseca `acos`, arco coseno, aplicada a `-1.0`. La constante `gravedad_m_s2` incluye su unidad en el identificador. El atributo `parameter` evita que una sentencia posterior modifique cualquiera de las dos.

# IMPLICIT NONE y declaración explícita

Sin una sentencia que lo impida, Fortran conserva reglas históricas de tipado implícito: un nombre que empieza entre `I` y `N` se interpreta como entero y otros nombres como reales. Un error tipográfico puede crear entonces una variable distinta en vez de generar un diagnóstico. `implicit none` desactiva esas reglas y obliga a declarar cada nombre.

`implicit none` se escribe en la parte de especificación, después de las sentencias `use` cuando existan y antes de las declaraciones. Debe aparecer en cada unidad de programa: programa principal, módulo, subrutina o función. Esta disciplina convierte numerosos errores de escritura en errores de compilación localizables.

```fortran !sin-consola
program balance_termico
  implicit none
  real :: energia_entrada_j
  real :: energia_salida_j
  real :: energia_almacenada_j

  energia_entrada_j = 1250.0
  energia_salida_j = 930.0
  energia_almacenada_j = energia_entrada_j - energia_salida_j

  print *, energia_almacenada_j
end program balance_termico
```

```salida
   320.000000
```

> Doc: [Tipos y variables](https://fortran-lang.org/learn/quickstart/variables/)

Si la última asignación escribiera por error `energia_saldia_j`, el compilador tendría que rechazar el nombre porque no está declarado. Sin `implicit none`, ese error podría convertirse en una entidad real implícita y ocultar el defecto.

# Entrada y salida dirigidas por lista

`read (*, *)` lee valores desde la unidad de entrada predeterminada y `print *` o `write (*, *)` escribe en la unidad de salida predeterminada. Los asteriscos (`*`) solicitan la unidad predeterminada y un formato elegido por el procesador. Esta modalidad resulta adecuada para aprendizaje y comprobaciones rápidas; no garantiza una disposición idéntica entre compiladores.

```fortran !sin-consola
program densidad_material
  implicit none
  real :: masa_kg
  real :: volumen_m3
  real :: densidad_kg_m3

  print *, ''Ingrese masa en kg y volumen en m3:''
  read (*, *) masa_kg, volumen_m3
  densidad_kg_m3 = masa_kg / volumen_m3
  print *, ''Densidad en kg/m3:'', densidad_kg_m3
end program densidad_material
```

```salida
 Ingrese masa en kg y volumen en m3:
 Densidad en kg/m3:   5.00000000
```

> Doc: [Tipos y variables](https://fortran-lang.org/learn/quickstart/variables/)

Para reproducir el ejemplo, escribe `10 2` y pulsa Enter cuando el programa solicite la entrada. El primer valor representa la masa y el segundo, el volumen.

La lista de `read` asigna los valores en el orden indicado. Este programa presupone un volumen distinto de cero y una entrada numérica válida; un programa de producción debe validar ambos supuestos antes de dividir.

# Flujo de trabajo de compilación

Guarda una sola unidad principal en `densidad_material.f90`. Compila con comprobaciones activas. Si el compilador informa una línea y una columna, examina primero ese punto y luego la sentencia anterior, porque un paréntesis o una continuación sin cerrar puede desplazar el diagnóstico. Ejecuta únicamente cuando la compilación y el enlace hayan terminado sin errores.

Durante el desarrollo, conserva `-Wall -Wextra -fcheck=all` con GNU Fortran. Las comprobaciones aumentan el costo de ejecución, pero detectan defectos antes de que contaminen un cálculo. Para estudiar un fallo, reduce los datos sin cambiar la operación que lo produce y vuelve a compilar desde el fuente corregido.

# Práctica: convertir minutos a segundos

Declara una cantidad entera de minutos, conviértela a segundos y comprueba el resultado antes de imprimirlo. Usa siete minutos como entrada. La solución incorpora una comprobación que termina con `error stop` si el cálculo es incorrecto. `if` ejecuta esa comprobación condicional; se estudia en detalle en la sesión 3. El formato `I0` representa un entero con el ancho mínimo necesario.

```fortran !sin-consola
program practica_conversion
  implicit none
  integer :: minutos, segundos
  minutos = 7
  ! verificar-error: minutos * 60 => minutos * 100
  segundos = minutos * 60
  if (segundos /= 420) error stop ''Conversion incorrecta''
  write(*,''(I0)'') segundos
end program practica_conversion
```

```salida
420
```

> Doc: [GNU Fortran: entrada y salida](https://fortran-lang.org/learn/quickstart/variables/#standard-input-output)

El comentario `verificar-error` documenta la alteración que utiliza el verificador del curso. Sustituir el factor 60 por 100 debe producir un error; después de restaurarlo, el programa debe terminar normalmente. No copies la respuesta numérica en la asignación: conserva la conversión a partir de `minutos`.

# Cierre

Esta sesión estableció la ruta desde un archivo `.f90` hasta un ejecutable, separó especificación y ejecución, presentó los cinco tipos intrínsecos, las constantes con nombre, la entrada y salida dirigidas por lista y la obligación práctica de usar `implicit none`.

La sesión siguiente profundiza en expresiones, conversiones, parámetros de clase, precisión de punto flotante y funciones intrínsecas. Esos conceptos permitirán decidir no solo qué operación escribir, sino también con qué representación numérica debe evaluarse.
') on conflict (curso_slug, archivo) do update set contenido=excluded.contenido, actualizado_en=now();

insert into public.curso_contenido (curso_slug, archivo, contenido) values ('fortran-fundamentos', 'sesion-2.md', '---
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
  if (abs(proporcion - 0.375) > 1.e-6) error stop ''Se perdio la fraccion''
  write(*,''(F5.3)'') proporcion
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
') on conflict (curso_slug, archivo) do update set contenido=excluded.contenido, actualizado_en=now();

insert into public.curso_contenido (curso_slug, archivo, contenido) values ('fortran-fundamentos', 'sesion-3.md', '---
numero: 3
titulo: "Decisiones y bucles"
---

# Objetivos y referencias

La sesión combina explicación, programas completos y una práctica resuelta. Cada ejemplo se compila en su propio archivo; no depende de haber ejecutado otra sesión. Las referencias enlazan documentación pública del lenguaje y del compilador.

Al terminar la sesión podrás construir condiciones completas, ordenar ramas que se excluyen, seleccionar casos discretos y recorrer procesos mediante bucles cuyo criterio de terminación sea visible y verificable.

# Valores y expresiones lógicas

El tipo `logical` almacena `.true.` o `.false.`. Una expresión relacional compara dos valores y produce uno de esos resultados. Los seis operadores relacionales simbólicos son igualdad (`==`), desigualdad (`/=`), menor que (`<`), menor o igual que (`<=`), mayor que (`>`) y mayor o igual que (`>=`).

Fortran también admite las grafías históricas `.eq.`, `.ne.`, `.lt.`, `.le.`, `.gt.` y `.ge.`. En código nuevo, las formas simbólicas suelen mostrar mejor la relación matemática. Los dos operandos deben ser comparables; una cadena no se compara numéricamente con un entero.

```fortran !sin-consola
program relaciones_presion
  implicit none
  real :: presion_pa
  real :: referencia_pa
  logical :: igual
  logical :: distinta
  logical :: menor
  logical :: no_mayor
  logical :: mayor
  logical :: no_menor

  presion_pa = 101420.0
  referencia_pa = 101325.0
  igual = presion_pa == referencia_pa
  distinta = presion_pa /= referencia_pa
  menor = presion_pa < referencia_pa
  no_mayor = presion_pa <= referencia_pa
  mayor = presion_pa > referencia_pa
  no_menor = presion_pa >= referencia_pa

  print *, igual, distinta, menor
  print *, no_mayor, mayor, no_menor
end program relaciones_presion
```

```salida
 F T F
 F T T
```

> Doc: [Operadores y control](https://fortran-lang.org/learn/quickstart/operators_control_flow/)

Cada asignación muestra uno de los seis operadores. En datos reales calculados, `==` y `/=` comparan representaciones exactas; para equivalencia aproximada se formula una tolerancia como en la sesión anterior.

# Operadores lógicos combinatorios

La negación (`.not.`) invierte un valor lógico. La conjunción (`.and.`) es verdadera cuando ambos operandos son verdaderos. La disyunción (`.or.`) es verdadera cuando al menos uno es verdadero. La equivalencia (`.eqv.`) es verdadera cuando ambos operandos tienen el mismo valor lógico y la no equivalencia (`.neqv.`), cuando difieren.

Fortran no garantiza evaluación con cortocircuito. Si una segunda condición divide por una variable o accede a un elemento cuya validez depende de la primera condición, utiliza bloques `if` anidados.

La precedencia lógica coloca primero las relaciones, luego `.not.`, después `.and.`, a continuación `.or.` y finalmente `.eqv.` o `.neqv.`. Los paréntesis deben conservarse cuando hagan visible la condición científica o de seguridad.

```fortran !sin-consola
program ventana_operativa
  implicit none
  real :: temperatura_c
  real :: presion_kpa
  logical :: mantenimiento
  logical :: dentro_de_rango
  logical :: operacion_permitida

  temperatura_c = 42.0
  presion_kpa = 180.0
  mantenimiento = .false.
  dentro_de_rango = (temperatura_c >= 15.0) .and. &
                    (temperatura_c <= 55.0) .and. &
                    (presion_kpa >= 120.0) .and. &
                    (presion_kpa <= 220.0)
  operacion_permitida = dentro_de_rango .and. (.not. mantenimiento)

  print *, operacion_permitida
end program ventana_operativa
```

```salida
 T
```

> Doc: [Operadores y control](https://fortran-lang.org/learn/quickstart/operators_control_flow/)

Los límites inferior y superior se escriben por separado: Fortran no interpreta una cadena matemática como `15.0 <= temperatura_c <= 55.0`. Cada relación produce un lógico y `.and.` combina los resultados.

# IF de una sola rama

El bloque `if` ejecuta su cuerpo solo cuando la expresión entre paréntesis es verdadera. La palabra clave `then` introduce el bloque y `end if` lo cierra. La sangría no modifica el significado, pero permite reconocer los límites de la rama.

```fortran !sin-consola
program advertencia_esfuerzo
  implicit none
  real :: esfuerzo_mpa
  real, parameter :: limite_mpa = 250.0

  esfuerzo_mpa = 267.0

  if (esfuerzo_mpa > limite_mpa) then
    print *, ''El esfuerzo supera el limite definido.''
  end if
end program advertencia_esfuerzo
```

```salida
 El esfuerzo supera el limite definido.
```

> Doc: [Operadores y control](https://fortran-lang.org/learn/quickstart/operators_control_flow/)

Cuando la condición es falsa, la ejecución continúa después de `end if`. El bloque no necesita una rama alternativa si no existe una operación válida para ese caso.

# IF, ELSE IF y ELSE

Una cadena `if` evalúa condiciones de arriba hacia abajo. Se ejecuta el bloque de la primera condición verdadera y se omiten los restantes. `else` recibe todos los casos no capturados antes. Por tanto, el orden forma parte del algoritmo cuando los intervalos se solapan.

```fortran !sin-consola
program clasificacion_residuo
  implicit none
  real :: residuo
  real :: magnitud

  residuo = -0.034
  magnitud = abs(residuo)

  if (magnitud <= 0.001) then
    print *, ''Convergencia estricta.''
  else if (magnitud <= 0.010) then
    print *, ''Convergencia moderada.''
  else if (magnitud <= 0.050) then
    print *, ''Aproximacion inicial.''
  else
    print *, ''El residuo requiere revision.''
  end if
end program clasificacion_residuo
```

```salida
 Aproximacion inicial.
```

> Doc: [Operadores y control](https://fortran-lang.org/learn/quickstart/operators_control_flow/)

Las condiciones avanzan del intervalo más restrictivo al más amplio. Si la segunda prueba se evaluara primero, también capturaría los valores que pertenecen a la categoría estricta.

# SELECT CASE para categorías discretas

`select case (expresion)` compara una expresión entera, de caracteres o lógica con selectores mutuamente excluyentes. `case (valor)` selecciona un valor; `case (inferior:superior)`, un intervalo cerrado; `case (:superior)`, un intervalo sin límite inferior; y `case (inferior:)`, uno sin límite superior. Una lista separada por comas reúne varios selectores.

`case default` procesa valores no contemplados. Aunque es opcional en la sintaxis, incluirlo hace visible la política para entradas inválidas o estados nuevos.

```fortran !sin-consola
program regimen_bomba
  implicit none
  integer :: codigo_modo

  codigo_modo = 2

  select case (codigo_modo)
  case (0)
    print *, ''Bomba detenida.''
  case (1)
    print *, ''Caudal reducido.''
  case (2, 3)
    print *, ''Regimen de operacion.''
  case (4:6)
    print *, ''Regimen de prueba.''
  case default
    print *, ''Codigo de modo no valido.''
  end select
end program regimen_bomba
```

```salida
 Regimen de operacion.
```

> Doc: [Operadores y control](https://fortran-lang.org/learn/quickstart/operators_control_flow/)

Ningún valor puede pertenecer a dos selectores del mismo constructo. Cuando la decisión depende de varias variables o de relaciones diferentes, una cadena `if` expresa mejor la lógica que `select case`.

# El bucle DO contado

El bucle contado adopta la forma `do indice = inicio, fin, paso`. Inicio, fin y paso se evalúan al entrar al bucle. El paso es opcional y su valor predeterminado es uno. Un paso positivo requiere un inicio no mayor que el final para ejecutar alguna iteración; un paso negativo requiere el orden contrario.

El índice debe ser entero en código moderno y no se modifica dentro del cuerpo. Después de `end do`, no se debe depender de su valor. El cuerpo puede ejecutarse cero veces si los parámetros no describen un recorrido válido.

```fortran !sin-consola
program suma_trabajo
  implicit none
  integer :: intervalo
  integer, parameter :: cantidad_intervalos = 6
  real :: fuerza_n(cantidad_intervalos)
  real :: desplazamiento_m
  real :: trabajo_j

  fuerza_n = [12.0, 13.5, 15.0, 14.0, 11.5, 10.0]
  desplazamiento_m = 0.25
  trabajo_j = 0.0

  do intervalo = 1, cantidad_intervalos
    trabajo_j = trabajo_j + fuerza_n(intervalo) * desplazamiento_m
  end do

  print *, trabajo_j
end program suma_trabajo
```

```salida
   19.0000000
```

> Doc: [Operadores y control](https://fortran-lang.org/learn/quickstart/operators_control_flow/)

El acumulador `trabajo_j` se inicializa antes del bucle. Cada iteración añade la contribución de un intervalo; omitir la inicialización haría que el primer cálculo utilizara un valor indefinido.

# Pasos descendentes y no unitarios

El tercer parámetro del `do` es el incremento. Un valor de dos recorre posiciones alternas y un valor negativo recorre en sentido descendente. El incremento no puede ser cero.

```fortran !sin-consola
program barrido_descendente
  implicit none
  integer :: nivel

  do nivel = 10, 2, -2
    print *, nivel
  end do
end program barrido_descendente
```

```salida
          10
           8
           6
           4
           2
```

> Doc: [Operadores y control](https://fortran-lang.org/learn/quickstart/operators_control_flow/)

El límite final se incluye cuando el índice lo alcanza exactamente. Este bucle visita una secuencia descendente porque el incremento es `-2`; con un incremento positivo no ejecutaría ninguna iteración.

# DO WHILE y condición previa

`do while (condicion)` comprueba la condición antes de cada iteración. Si comienza falsa, el cuerpo se ejecuta cero veces. Alguna operación del cuerpo debe modificar los datos de los que depende la condición; de otro modo, el bucle puede no terminar.

```fortran !sin-consola
program enfriamiento_iterativo
  implicit none
  integer :: iteracion
  integer, parameter :: max_iteraciones = 100
  real :: temperatura_c
  real, parameter :: objetivo_c = 30.0

  iteracion = 0
  temperatura_c = 85.0

  do while ((temperatura_c > objetivo_c) .and. &
            (iteracion < max_iteraciones))
    temperatura_c = temperatura_c - 0.08 * (temperatura_c - 20.0)
    iteracion = iteracion + 1
  end do

  print *, iteracion, temperatura_c
end program enfriamiento_iterativo
```

```salida
          23   29.5506611
```

> Doc: [Operadores y control](https://fortran-lang.org/learn/quickstart/operators_control_flow/)

El límite de iteraciones evita una espera ilimitada si el modelo deja de acercarse al objetivo. Al salir, el programa debe distinguir si alcanzó el criterio térmico o agotó el límite cuando esa diferencia afecte decisiones posteriores.

# Terminación anticipada con EXIT

Un `do` sin parámetros repite su cuerpo hasta que una sentencia transfiere el control. `exit` termina el bucle más interno y continúa después de `end do`. Esta forma resulta clara cuando la condición de terminación se calcula en medio del cuerpo. El ejemplo siguiente conserva un bucle contado para imponer además un máximo; `exit` funciona tanto en bucles contados como indefinidos.

```fortran !sin-consola
program aproximacion_raiz
  implicit none
  integer :: iteracion
  integer, parameter :: max_iteraciones = 40
  real :: estimacion
  real :: nueva_estimacion
  real, parameter :: tolerancia = 1.0e-6

  estimacion = 1.0

  do iteracion = 1, max_iteraciones
    nueva_estimacion = 0.5 * (estimacion + 2.0 / estimacion)
    if (abs(nueva_estimacion - estimacion) <= tolerancia) exit
    estimacion = nueva_estimacion
  end do

  print *, nueva_estimacion
end program aproximacion_raiz
```

```salida
   1.41421354
```

> Doc: [Operadores y control](https://fortran-lang.org/learn/quickstart/operators_control_flow/)

La sentencia `if` lógica de una línea ejecuta aquí únicamente `exit`. No sustituye un bloque cuando una condición controla varias sentencias. El máximo de iteraciones hace que la terminación sea demostrable incluso si la tolerancia no se alcanza.

# CYCLE y la iteración actual

`cycle` abandona el resto de la iteración actual y vuelve al control del bucle para iniciar la siguiente. No termina el bucle completo. Conviene usarlo para descartar un dato antes de ejecutar cálculos que presuponen su validez.

```fortran !sin-consola
program promedio_lecturas_validas
  implicit none
  integer :: posicion
  integer :: cantidad_validas
  real :: lecturas_c(6)
  real :: suma_c

  lecturas_c = [19.8, -999.0, 20.1, 20.0, -999.0, 19.9]
  cantidad_validas = 0
  suma_c = 0.0

  do posicion = 1, size(lecturas_c)
    if (lecturas_c(posicion) == -999.0) cycle
    suma_c = suma_c + lecturas_c(posicion)
    cantidad_validas = cantidad_validas + 1
  end do

  if (cantidad_validas > 0) then
    print *, suma_c / real(cantidad_validas)
  else
    print *, ''No hay lecturas validas.''
  end if
end program promedio_lecturas_validas
```

```salida
   19.9500008
```

> Doc: [Operadores y control](https://fortran-lang.org/learn/quickstart/operators_control_flow/)

La constante centinela se compara de forma exacta porque proviene de un código de ausencia asignado de forma directa, no de un cálculo real. En un sistema real, la política de datos ausentes debe estar definida por el formato de adquisición.

# Bucles anidados y nombres

Un nombre seguido de dos puntos (`:`) puede identificar un constructo. `exit nombre` termina el bucle nombrado y `cycle nombre` inicia la siguiente iteración de ese bucle. Los nombres eliminan ambigüedad cuando existen bucles anidados.

```fortran !sin-consola
program localizar_umbral
  implicit none
  integer :: fila
  integer :: columna
  integer :: fila_encontrada
  integer :: columna_encontrada
  real :: campo(3, 4)
  real, parameter :: umbral = 8.0

  campo = reshape([1.0, 2.0, 3.0, 4.0, 9.0, 6.0, &
                   7.0, 8.0, 5.0, 2.0, 1.0, 0.0], shape(campo))
  fila_encontrada = 0
  columna_encontrada = 0

  buscar: do columna = 1, size(campo, 2)
    do fila = 1, size(campo, 1)
      if (campo(fila, columna) > umbral) then
        fila_encontrada = fila
        columna_encontrada = columna
        exit buscar
      end if
    end do
  end do buscar

  print *, fila_encontrada, columna_encontrada
end program localizar_umbral
```

```salida
           2           2
```

> Doc: [Operadores y control](https://fortran-lang.org/learn/quickstart/operators_control_flow/)

`exit buscar` abandona ambos niveles porque el nombre pertenece al bucle exterior. El orden de los índices recorre primero las filas de cada columna, coherente con el almacenamiento por columnas de los arreglos Fortran.

# Práctica: contar observaciones sobre un umbral

Recorre cuatro mediciones y cuenta solo las que superan estrictamente 20. El caso de frontera, una medición igual a 20, permite distinguir `>` de `>=`. Mantén la comprobación después del bucle para verificar ambas variantes.

```fortran !sin-consola
program practica_umbral
  implicit none
  integer :: mediciones(4), indice, superiores
  mediciones = [18, 20, 22, 25]
  superiores = 0
  do indice = 1, size(mediciones)
    ! verificar-error: mediciones(indice) > 20 => mediciones(indice) >= 20
    if (mediciones(indice) > 20) superiores = superiores + 1
  end do
  if (superiores /= 2) error stop ''El limite se conto incorrectamente''
  write(*,''(I0)'') superiores
end program practica_umbral
```

```salida
2
```

> Doc: [Fortran-lang: control de flujo](https://fortran-lang.org/learn/quickstart/operators_control_flow/)

La solución inicializa el contador una vez y lo incrementa solo dentro de la condición. Si se inicializara dentro del bucle, se perdería el conteo anterior. La sesión siguiente desarrolla los arreglos empleados para reunir las mediciones.

# Cierre

Esta sesión cubrió los seis operadores relacionales, cinco operadores lógicos, bloques `if`, cadenas `else if`, selección por casos y bucles contados, condicionales, indefinidos, anidados y controlados por `cycle` o `exit`.

La sesión siguiente organiza colecciones de datos mediante arreglos y separa responsabilidades mediante subrutinas, funciones y módulos. Las estructuras de control aprendidas aquí se utilizarán dentro de esos procedimientos sin depender de estado oculto.
') on conflict (curso_slug, archivo) do update set contenido=excluded.contenido, actualizado_en=now();

insert into public.curso_contenido (curso_slug, archivo, contenido) values ('fortran-fundamentos', 'sesion-4.md', '---
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
    print *, ''No hay lecturas validas.''
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
  if (total(muestras) /= 20) error stop ''Suma incorrecta''
  if (total([integer ::]) /= 0) error stop ''Caso vacio incorrecto''
  write(*,''(I0)'') total(muestras)
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
') on conflict (curso_slug, archivo) do update set contenido=excluded.contenido, actualizado_en=now();

insert into public.curso_sesiones (curso_slug, archivo, numero, titulo, slug) values ('fortran-fundamentos', 'sesion-1.md', 1, 'Estructura, compilación y variables', 'sesion-1') on conflict (curso_slug, archivo) do update set numero=excluded.numero, titulo=excluded.titulo, slug=excluded.slug;

insert into public.curso_sesiones (curso_slug, archivo, numero, titulo, slug) values ('fortran-fundamentos', 'sesion-2.md', 2, 'Expresiones, tipos, precisión e intrínsecas', 'sesion-2') on conflict (curso_slug, archivo) do update set numero=excluded.numero, titulo=excluded.titulo, slug=excluded.slug;

insert into public.curso_sesiones (curso_slug, archivo, numero, titulo, slug) values ('fortran-fundamentos', 'sesion-3.md', 3, 'Decisiones y bucles', 'sesion-3') on conflict (curso_slug, archivo) do update set numero=excluded.numero, titulo=excluded.titulo, slug=excluded.slug;

insert into public.curso_sesiones (curso_slug, archivo, numero, titulo, slug) values ('fortran-fundamentos', 'sesion-4.md', 4, 'Arreglos, procedimientos y módulos', 'sesion-4') on conflict (curso_slug, archivo) do update set numero=excluded.numero, titulo=excluded.titulo, slug=excluded.slug;

commit;

