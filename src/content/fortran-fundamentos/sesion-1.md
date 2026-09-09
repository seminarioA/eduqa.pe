---
numero: 1
titulo: "Estructura, compilación y variables"
---

# Objetivos y referencias

La sesión combina explicación, programas completos y una práctica resuelta. Cada ejemplo se compila en su propio archivo; no depende de haber ejecutado otra sesión. Las referencias enlazan documentación pública del lenguaje y del compilador.

Al terminar la sesión podrás reconocer las partes de una unidad de programa, guardar código fuente en formato libre, convertirlo en un ejecutable, declarar datos escalares y detectar nombres no declarados durante la compilación.

# Preparar el entorno

Necesitas un editor de texto, una terminal y GNU Fortran. Sigue la instalación correspondiente a tu sistema en la documentación enlazada y ejecuta `gfortran --version` para comprobar que la terminal encuentra el compilador. Puedes ejecutar y editar Fortran en EDUQA. El compilador se carga la primera vez que pulsas «Ejecutar» o «Comprobar»; las siguientes ejecuciones reutilizan la descarga. Los bloques marcados «ejecución local» requieren GNU Fortran.

> Doc: [Fortran-lang: instalar GNU Fortran](https://fortran-lang.org/learn/os_setup/install_gfortran/)

Crea una carpeta de prácticas y guarda cada bloque completo en un archivo `.f90`, sin las marcas de Markdown. En macOS o Linux, `pwd` muestra la carpeta actual y `cd` permite cambiarla. En PowerShell utiliza `Get-Location` para consultar la carpeta y `Set-Location` para cambiarla. Compila desde la carpeta que contiene el archivo. En Windows puedes nombrar la salida `programa.exe` y ejecutarla con `./programa.exe`.

Las salidas publicadas se obtuvieron ejecutando los ejemplos con GNU Fortran. El formato dirigido por lista y las propiedades del modelo real pueden variar entre compiladores; los espacios y las últimas cifras no son un contrato portable. Los ejercicios con formato explícito facilitan comparar los resultados.

# Del texto fuente al programa en ejecución

Un archivo Fortran moderno suele usar la extensión `.f90`. El archivo contiene texto fuente: declaraciones y operaciones que todavía no son instrucciones ejecutables del procesador. Un compilador comprueba el texto y lo traduce a código objeto. El enlazador combina ese objeto con las bibliotecas requeridas y produce el archivo ejecutable. Muchos controladores de compilación realizan ambas etapas con una sola orden.

Con GNU Fortran, `gfortran -std=f2018 -Wall -Wextra -fcheck=all medicion.f90 -o medicion` solicita el estándar Fortran 2018, activa diagnósticos habituales, añade comprobaciones en ejecución y nombra `medicion` al ejecutable. En sistemas tipo Unix, `./medicion` ejecuta ese archivo. El indicador `-c` detiene el proceso después de crear código objeto; resulta útil cuando un proyecto compila varias unidades por separado antes de enlazarlas.

Un diagnóstico del compilador no es una salida científica del programa. Primero se corrigen los errores de sintaxis o de tipos; después se analizan los resultados del ejecutable. Las advertencias también requieren revisión porque suelen revelar variables sin uso, conversiones o expresiones sospechosas.

# La unidad de programa principal

Una unidad principal puede comenzar con `program nombre` y termina con `end program nombre`. Entre ambas sentencias se distinguen una parte de especificación y una parte de ejecución. La parte de especificación contiene `implicit none` y las declaraciones; la parte ejecutable contiene asignaciones, entrada, salida y llamadas. Una sentencia ejecutable no puede preceder a una declaración de la misma unidad.

```fortran
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

```fortran
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

```fortran
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
  identificador = 'camara-norte'

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

```fortran
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

```fortran
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

```fortran
program densidad_material
  implicit none
  real :: masa_kg
  real :: volumen_m3
  real :: densidad_kg_m3

  print *, 'Ingrese masa en kg y volumen en m3:'
  read (*, *) masa_kg, volumen_m3
  densidad_kg_m3 = masa_kg / volumen_m3
  print *, 'Densidad en kg/m3:', densidad_kg_m3
end program densidad_material
```

```salida
 Ingrese masa en kg y volumen en m3:
 Densidad en kg/m3:   5.00000000
```

```entrada
10 2
```

> Doc: [Tipos y variables](https://fortran-lang.org/learn/quickstart/variables/)

Para reproducir el ejemplo, escribe `10 2` y pulsa Enter cuando el programa solicite la entrada. El primer valor representa la masa y el segundo, el volumen.

La lista de `read` asigna los valores en el orden indicado. Este programa presupone un volumen distinto de cero y una entrada numérica válida; un programa de producción debe validar ambos supuestos antes de dividir.

# Flujo de trabajo de compilación

Guarda una sola unidad principal en `densidad_material.f90`. Compila con comprobaciones activas. Si el compilador informa una línea y una columna, examina primero ese punto y luego la sentencia anterior, porque un paréntesis o una continuación sin cerrar puede desplazar el diagnóstico. Ejecuta únicamente cuando la compilación y el enlace hayan terminado sin errores.

Durante el desarrollo, conserva `-Wall -Wextra -fcheck=all` con GNU Fortran. Las comprobaciones aumentan el costo de ejecución, pero detectan defectos antes de que contaminen un cálculo. Para estudiar un fallo, reduce los datos sin cambiar la operación que lo produce y vuelve a compilar desde el fuente corregido.

# Práctica: convertir minutos a segundos

Declara una cantidad entera de minutos, conviértela a segundos y comprueba el resultado antes de imprimirlo. Usa siete minutos como entrada. La solución incorpora una comprobación que termina con `error stop` si el cálculo es incorrecto. `if` ejecuta esa comprobación condicional; se estudia en detalle en la sesión 3. El formato `I0` representa un entero con el ancho mínimo necesario.

```fortran
program practica_conversion
  implicit none
  integer :: minutos, segundos
  minutos = 7
  ! verificar-error: minutos * 60 => minutos * 100
  segundos = minutos * 60
  if (segundos /= 420) error stop 'Conversion incorrecta'
  write(*,'(I0)') segundos
end program practica_conversion
```

```salida
420
```

> Doc: [GNU Fortran: entrada y salida](https://fortran-lang.org/learn/quickstart/variables/#standard-input-output)

El comentario `verificar-error` documenta la alteración que utiliza el verificador del curso. Sustituir el factor 60 por 100 debe producir un error; después de restaurarlo, el programa debe terminar normalmente. No copies la respuesta numérica en la asignación: conserva la conversión a partir de `minutos`.

# Ejercicio en el navegador

Completa el programa y pulsa «Comprobar». El código se compila y ejecuta en tu navegador; cada intento comienza desde cero.

```ejercicio fortran
# Enunciado
Completa la operación que falta para que el programa cumpla las comprobaciones de esta sesión.
# Plantilla
program practica_conversion
  implicit none
  integer :: minutos, segundos
  minutos = 7
  segundos = ___
  if (segundos /= 420) error stop 'Conversion incorrecta'
  write(*,'(I0)') segundos
end program practica_conversion
# Esperado
420
# Pista
Revisa la práctica resuelta de esta sesión y las condiciones que comprueba antes de imprimir la salida.
```

# Cierre

Esta sesión estableció la ruta desde un archivo `.f90` hasta un ejecutable, separó especificación y ejecución, presentó los cinco tipos intrínsecos, las constantes con nombre, la entrada y salida dirigidas por lista y la obligación práctica de usar `implicit none`.

La sesión siguiente profundiza en expresiones, conversiones, parámetros de clase, precisión de punto flotante y funciones intrínsecas. Esos conceptos permitirán decidir no solo qué operación escribir, sino también con qué representación numérica debe evaluarse.
