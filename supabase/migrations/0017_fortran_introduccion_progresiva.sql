-- Generado desde los Markdown. Aplicar como una sola transacción.

-- Conserva precio, estado, acceso y matrículas de cursos existentes.

begin;

insert into public.rutas (slug, nombre, descripcion, orden) values ('programacion-fortran', 'Programación Fortran', 'Aprende Fortran desde cero y avanza hacia programación avanzada y desarrollo de software con pruebas, archivos e interoperabilidad.', 3) on conflict (slug) do update set nombre=excluded.nombre, descripcion=excluded.descripcion, orden=excluded.orden;

insert into public.cursos (slug, titulo, resumen, precio, estado, acceso_libre, orden, ruta, posicion, requisitos) values ('fortran-fundamentos', 'Introducción a Fortran', 'Fortran desde cero, un concepto por apartado. Programas breves, ejercicios en el navegador y referencias a la documentación de Fortran-lang y GNU Fortran.', 20, 'publico', true, 15, 'programacion-fortran', 1, array[]::text[]) on conflict (slug) do update set titulo=excluded.titulo, resumen=excluded.resumen, orden=excluded.orden, ruta=excluded.ruta, posicion=excluded.posicion, requisitos=excluded.requisitos, actualizado_en=now();

insert into public.curso_contenido (curso_slug, archivo, contenido) values ('fortran-fundamentos', 'curso.md', '---
slug: fortran-fundamentos
titulo: "Introducción a Fortran"
resumen: "Fortran desde cero, un concepto por apartado. Programas breves, ejercicios en el navegador y referencias a la documentación de Fortran-lang y GNU Fortran."
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
titulo: "Primeros programas y variables"
---

# Antes de empezar

Fortran es un lenguaje de programación: permite escribir instrucciones para que una computadora las ejecute. El texto de esas instrucciones es el **código fuente**. Un **compilador** traduce ese texto a un programa ejecutable y detecta errores de sintaxis, es decir, incumplimientos de las reglas de escritura del lenguaje.

En este curso el compilador se carga al abrir la página. Cada bloque se puede ejecutar y editar en el navegador. El enlace **Sandbox de Fortran** abre un espacio para practicar con programas propios. No hace falta instalar un compilador para seguir las sesiones.

La secuencia avanza desde un programa vacío hasta variables de varios tipos. Los ejemplos y los ejercicios se ejecutan por separado; cada uno contiene lo necesario para funcionar. Las referencias de consulta son la documentación de Fortran-lang y el manual de GNU Fortran.

> Doc: [Fortran-lang: primer programa y compilador](https://fortran-lang.org/learn/quickstart/hello_world/)

# La unidad de programa principal

Un **programa principal** es la unidad desde la que comienza la ejecución. `program` señala su inicio y `end program` su final. El nombre `saludo` identifica esta unidad; al escribirlo en ambas sentencias debe coincidir.

Este programa está vacío. Al ejecutarlo termina sin mostrar texto. Por ahora solo se estudian sus límites.

```fortran
program saludo
end program saludo
```

> Doc: [La unidad de programa principal](https://fortran-lang.org/learn/quickstart/hello_world/#id1)

> Nota: En Fortran, las palabras clave y los nombres no distinguen mayúsculas de minúsculas. Usaremos minúsculas de forma consistente.

```ejercicio fortran
# Enunciado
Completa la palabra que cierra el programa. Una ejecución correcta termina sin salida.
# Plantilla
program saludo
___ program saludo
# Esperado

# Pista
El cierre comienza con end.
```

# Mostrar un texto con print

La sentencia `print` escribe en la salida del programa. En `print *, ''Hola, Fortran''`, el asterisco (`*`) selecciona un formato automático, llamado **dirigido por lista**, y la coma (`,`) lo separa del contenido que se imprime.

Las comillas simples (`''`) delimitan un texto literal: los caracteres que se van a mostrar. Las comillas no forman parte de la salida. `print` se escribe entre el inicio y el final del programa.

```fortran
program saludo
  print *, ''Hola, Fortran''
end program saludo
```

```salida
 Hola, Fortran
```

> Doc: [Mostrar un texto con print](https://fortran-lang.org/learn/quickstart/hello_world/#id1)

```ejercicio fortran
# Enunciado
Completa la sentencia que muestra el saludo.
# Plantilla
program saludo
  ___ *, ''Hola, Fortran''
end program saludo
# Esperado
Hola, Fortran
# Pista
La sentencia se llama print.
```

# Escribir comentarios

El signo de exclamación (`!`) inicia un **comentario**: el compilador ignora lo que sigue hasta el final de esa línea. Un comentario explica una decisión o describe una instrucción; no aparece en la salida.

```fortran
program saludo
  ! Mensaje de bienvenida
  print *, ''Hola''
end program saludo
```

```salida
 Hola
```

> Doc: [Escribir comentarios](https://fortran-lang.org/learn/quickstart/hello_world/#id1)

```ejercicio fortran
# Enunciado
Completa el signo que convierte la descripción en un comentario.
# Plantilla
program saludo
  ___ Mensaje de bienvenida
  print *, ''Hola''
end program saludo
# Esperado
Hola
# Pista
Se usa el signo de exclamación (!).
```

# Exigir declaraciones con implicit none

Una **variable** es un espacio de almacenamiento identificado por un nombre. Su **tipo** establece qué clase de valores puede guardar. Una **declaración** indica ese tipo antes de usar la variable.

`implicit none` desactiva la asignación implícita de tipos: exige declarar las variables. Se coloca después de `program`. Así, escribir mal un nombre no crea inadvertidamente otra variable. El programa siguiente todavía no declara ninguna; incorpora esta regla antes de empezar a trabajar con ellas.

```fortran
program saludo
  implicit none
  print *, ''Hola''
end program saludo
```

```salida
 Hola
```

> Doc: [Exigir declaraciones con implicit none](https://fortran-lang.org/learn/quickstart/variables/#declaring-variables)

```ejercicio fortran
# Enunciado
Completa la palabra que desactiva los tipos implícitos.
# Plantilla
program saludo
  implicit ___
  print *, ''Hola''
end program saludo
# Esperado
Hola
# Pista
La sentencia completa es implicit none.
```

# Declarar una variable entera

`integer` declara una variable de tipo entero: admite números sin parte fraccionaria, positivos, negativos o cero. El doble signo de dos puntos (`::`) separa el tipo del nombre declarado.

`cantidad` es el nombre de la variable. Un nombre empieza con una letra y puede continuar con letras, dígitos y guiones bajos (`_`); no lleva espacios. La declaración se coloca después de `implicit none` y antes de las instrucciones que se ejecutan.

Declarar `cantidad` no le asigna un valor. Por eso este programa no la imprime y termina sin salida.

```fortran
program inventario
  implicit none
  integer :: cantidad
end program inventario
```

> Doc: [Declarar una variable entera](https://fortran-lang.org/learn/quickstart/variables/#declaring-variables)

> Nota: Leer una variable antes de asignarle un valor no produce un resultado definido. La declaración reserva almacenamiento, pero no garantiza que contenga cero.

```ejercicio fortran
# Enunciado
Declara cantidad como un entero. El programa debe terminar sin salida.
# Plantilla
program inventario
  implicit none
  ___ :: cantidad
end program inventario
# Esperado

# Pista
El tipo de los números enteros se llama integer.
```

# Asignar y consultar un valor

El operador de asignación (`=`) guarda en la variable de la izquierda el valor de la derecha. Después de `cantidad = 4`, `print *, cantidad` consulta ese valor y lo muestra.

El nombre se escribe sin comillas. Con comillas, `print` mostraría el texto literal y no el contenido de la variable.

```fortran
program inventario
  implicit none
  integer :: cantidad
  cantidad = 4
  print *, cantidad
end program inventario
```

```salida
           4
```

> Doc: [Asignar y consultar un valor](https://fortran-lang.org/learn/quickstart/variables/#declaring-variables)

```ejercicio fortran
# Enunciado
Asigna cuatro unidades a cantidad.
# Plantilla
program inventario
  implicit none
  integer :: cantidad
  cantidad ___ 4
  print *, cantidad
end program inventario
# Esperado
4
# Pista
La asignación se escribe con un solo signo igual (=).
```

# Cambiar el valor de una variable

Una segunda asignación reemplaza el valor almacenado. Las instrucciones se ejecutan en el orden en que están escritas: la primera consulta muestra el valor inicial y la segunda, el nuevo. El tipo de la variable sigue siendo `integer`.

```fortran
program inventario
  implicit none
  integer :: cantidad
  cantidad = 4
  print *, cantidad
  cantidad = 6
  print *, cantidad
end program inventario
```

```salida
           4
           6
```

> Doc: [Cambiar el valor de una variable](https://fortran-lang.org/learn/quickstart/variables/#declaring-variables)

```ejercicio fortran
# Enunciado
Cambia cantidad a seis antes de imprimirla.
# Plantilla
program inventario
  implicit none
  integer :: cantidad
  cantidad = 4
  cantidad = ___
  print *, cantidad
end program inventario
# Esperado
6
# Pista
El nuevo valor reemplaza al 4.
```

# Números reales

`real` declara una variable para valores numéricos que pueden tener parte fraccionaria. En el código se usa el punto (`.`) como separador decimal. El literal `1.5` es real; `1` es entero.

El formato automático de `print *` puede mostrar ceros adicionales. Esos ceros no cambian el valor que se asignó.

```fortran
program longitud
  implicit none
  real :: metros
  metros = 1.5
  print *, metros
end program longitud
```

```salida
   1.50000000
```

> Doc: [Números reales](https://fortran-lang.org/learn/quickstart/variables/#declaring-variables)

> Nota: Los valores real se representan con precisión finita. Muchas fracciones decimales no tienen una representación binaria exacta. Fortran intermedio trata la selección de precisión y la verificación del error de redondeo.

```ejercicio fortran
# Enunciado
Completa el tipo de metros para conservar la parte fraccionaria.
# Plantilla
program longitud
  implicit none
  ___ :: metros
  metros = 1.5
  print *, metros
end program longitud
# Esperado
1.50000000
# Pista
El tipo para este valor fraccionario se llama real.
```

# Variables de texto

`character` declara una variable de texto. En `character(len=4)`, el parámetro `len` —de *length*, longitud— fija una capacidad de cuatro caracteres. Los paréntesis (`()`) delimitan esa especificación y `len=4` indica su valor.

`ciudad` puede guardar el texto `''Lima''`, que ocupa cuatro caracteres.

```fortran
program destino
  implicit none
  character(len=4) :: ciudad
  ciudad = ''Lima''
  print *, ciudad
end program destino
```

```salida
 Lima
```

> Doc: [Variables de texto](https://fortran-lang.org/learn/quickstart/arrays_strings/#character-strings)

> Nota: Si el texto asignado es más largo, se trunca por la derecha; si es más corto, se completa con espacios a la derecha. Esta variable tiene longitud fija.

```ejercicio fortran
# Enunciado
Completa la longitud necesaria para guardar Lima entera.
# Plantilla
program destino
  implicit none
  character(len=___) :: ciudad
  ciudad = ''Lima''
  print *, ciudad
end program destino
# Esperado
Lima
# Pista
Lima tiene cuatro caracteres.
```

# Valores lógicos

`logical` declara una variable que guarda un valor de verdad. Sus dos literales son `.true.` —verdadero— y `.false.` —falso—, con puntos al inicio y al final. `print *` los representa habitualmente como `T` y `F`.

Primero se guarda verdadero y después falso en la misma variable.

```fortran
program conexion
  implicit none
  logical :: conectado
  conectado = .true.
  print *, conectado
  conectado = .false.
  print *, conectado
end program conexion
```

```salida
 T
 F
```

> Doc: [Valores lógicos](https://fortran-lang.org/learn/quickstart/variables/#declaring-variables)

```ejercicio fortran
# Enunciado
Asigna el valor lógico falso.
# Plantilla
program conexion
  implicit none
  logical :: conectado
  conectado = ___
  print *, conectado
end program conexion
# Esperado
F
# Pista
El literal falso se escribe .false., con ambos puntos.
```

# Constantes con nombre

El atributo `parameter` declara una **constante con nombre**: su valor se fija en la declaración y no puede cambiar durante la ejecución. La coma separa `integer` del atributo `parameter`; `::` separa esa especificación del nombre.

`dias_semana` representa un valor que se mantiene fijo. Se usa un número entero conocido, sin introducir funciones ni fórmulas.

```fortran
program calendario
  implicit none
  integer, parameter :: dias_semana = 7
  print *, dias_semana
end program calendario
```

```salida
           7
```

> Doc: [Intel Fortran: atributo PARAMETER](https://www.intel.com/content/www/us/en/docs/fortran-compiler/developer-guide-reference/2023-2/parameter.html)

```ejercicio fortran
# Enunciado
Completa el atributo que convierte dias_semana en una constante.
# Plantilla
program calendario
  implicit none
  integer, ___ :: dias_semana = 7
  print *, dias_semana
end program calendario
# Esperado
7
# Pista
El atributo se llama parameter.
```

# Cierre

Ya puedes delimitar un programa, mostrar texto, escribir comentarios, declarar variables, asignar valores y definir una constante. Cada tipo se introdujo por separado. La siguiente sesión combina valores mediante operadores y funciones incorporadas al lenguaje.
') on conflict (curso_slug, archivo) do update set contenido=excluded.contenido, actualizado_en=now();

insert into public.curso_contenido (curso_slug, archivo, contenido) values ('fortran-fundamentos', 'sesion-2.md', '---
numero: 2
titulo: "Operaciones y funciones incorporadas"
---

# Antes de empezar

Una **expresión** combina valores y operaciones para producir un resultado. Esta sesión comienza con los operadores aritméticos, continúa con texto y termina con funciones incorporadas. Cada ejemplo conserva la estructura de programa de la primera sesión.

# Sumar

El operador de suma (`+`) obtiene la suma de sus dos operandos. Los **operandos** son los valores sobre los que actúa el operador. Aquí son dos literales enteros.

```fortran
program suma
  implicit none
  print *, 3 + 2
end program suma
```

```salida
           5
```

> Doc: [Sumar](https://fortran-lang.org/learn/quickstart/variables/#expressions)

```ejercicio fortran
# Enunciado
Completa el operador que suma tres y dos.
# Plantilla
program suma
  implicit none
  print *, 3 ___ 2
end program suma
# Esperado
5
# Pista
La suma usa el signo más (+).
```

# Restar

El operador de resta (`-`) sustrae el operando derecho del izquierdo. El orden importa: se parte de ocho unidades y se retiran tres.

```fortran
program resta
  implicit none
  print *, 8 - 3
end program resta
```

```salida
           5
```

> Doc: [Restar](https://fortran-lang.org/learn/quickstart/variables/#expressions)

```ejercicio fortran
# Enunciado
Completa el operador que resta tres a ocho.
# Plantilla
program resta
  implicit none
  print *, 8 ___ 3
end program resta
# Esperado
5
# Pista
La resta usa el signo menos (-).
```

# Multiplicar

El operador de multiplicación (`*`) calcula el producto. En `print *, 4 * 3`, el primer asterisco selecciona el formato de salida; el segundo multiplica los números. La posición determina su función.

```fortran
program producto
  implicit none
  print *, 4 * 3
end program producto
```

```salida
          12
```

> Doc: [Multiplicar](https://fortran-lang.org/learn/quickstart/variables/#expressions)

```ejercicio fortran
# Enunciado
Completa el operador que multiplica cuatro por tres.
# Plantilla
program producto
  implicit none
  print *, 4 ___ 3
end program producto
# Esperado
12
# Pista
La multiplicación se escribe con un asterisco (*).
```

# Dividir enteros

El operador de división (`/`) divide el operando izquierdo entre el derecho. Si ambos son enteros, el resultado también es entero: se descarta la parte fraccionaria. Dividir siete entre dos no conserva el medio restante.

```fortran
program reparto
  implicit none
  print *, 7 / 2
end program reparto
```

```salida
           3
```

> Doc: [Dividir enteros](https://fortran-lang.org/learn/best_practices/integer_division/)

> Nota: La parte fraccionaria se descarta hacia cero, también con números negativos. El divisor debe ser distinto de cero.

```ejercicio fortran
# Enunciado
Completa el operador de división.
# Plantilla
program reparto
  implicit none
  print *, 7 ___ 2
end program reparto
# Esperado
3
# Pista
La división se escribe con una barra (/).
```

# Dividir números reales

Si los dos operandos son reales, la división conserva una aproximación de la parte fraccionaria. El punto decimal permite escribir `7.0` y `2.0` como literales reales.

No es suficiente guardar una división entera en una variable `real`: los tipos de los operandos determinan cómo se calcula la expresión antes de asignarla.

```fortran
program reparto
  implicit none
  print *, 7.0 / 2.0
end program reparto
```

```salida
   3.50000000
```

> Doc: [Dividir números reales](https://fortran-lang.org/learn/quickstart/variables/#expressions)

```ejercicio fortran
# Enunciado
Completa el denominador real para dividir siete entre dos.
# Plantilla
program reparto
  implicit none
  print *, 7.0 / ___
end program reparto
# Esperado
3.50000000
# Pista
Escribe 2.0, con punto decimal.
```

# Elevar a una potencia

El operador de potencia (`**`) eleva la base, a la izquierda, al exponente, a la derecha. En `2 ** 3`, se multiplica la base dos por sí misma tres veces.

```fortran
program potencia
  implicit none
  print *, 2 ** 3
end program potencia
```

```salida
           8
```

> Doc: [Elevar a una potencia](https://fortran-lang.org/learn/quickstart/variables/#expressions)

```ejercicio fortran
# Enunciado
Completa el operador de potencia.
# Plantilla
program potencia
  implicit none
  print *, 2 ___ 3
end program potencia
# Esperado
8
# Pista
La potencia se escribe con dos asteriscos consecutivos (**).
```

# Agrupar operaciones

La **precedencia** determina el orden de evaluación: primero la potencia, luego multiplicación y división, y después suma y resta. Los paréntesis (`()`) agrupan una expresión para calcularla antes de usar su resultado.

Los dos ejemplos usan los mismos números. Los paréntesis cambian qué suma se calcula antes de multiplicar.

```fortran
program agrupacion
  implicit none
  print *, 2 + 3 * 4
  print *, (2 + 3) * 4
end program agrupacion
```

```salida
          14
          20
```

> Doc: [Agrupar operaciones](https://fortran-lang.org/learn/quickstart/variables/#expressions)

> Nota: A igual precedencia, suma, resta, multiplicación y división se agrupan de izquierda a derecha. Una cadena de potencias se agrupa de derecha a izquierda. Los paréntesis evitan depender de recordar esa regla.

```ejercicio fortran
# Enunciado
Completa la suma agrupada para calcularla antes de multiplicar por cuatro.
# Plantilla
program agrupacion
  implicit none
  print *, ___ * 4
end program agrupacion
# Esperado
20
# Pista
Encierra 2 + 3 entre paréntesis.
```

# Unir textos

El operador de concatenación (`//`), formado por dos barras, une dos textos. Conserva sus caracteres, incluidos los espacios. El espacio al final de `''Hola, ''` separa el saludo del nombre.

```fortran
program saludo
  implicit none
  print *, ''Hola, '' // ''Ana''
end program saludo
```

```salida
 Hola, Ana
```

> Doc: [Unir textos](https://fortran-lang.org/learn/quickstart/arrays_strings/#character-strings)

```ejercicio fortran
# Enunciado
Completa el operador que une los dos textos.
# Plantilla
program saludo
  implicit none
  print *, ''Hola, '' ___ ''Ana''
end program saludo
# Esperado
Hola, Ana
# Pista
La concatenación utiliza dos barras (//).
```

# Convertir a real

Una **función** recibe argumentos y devuelve un valor. Para llamarla se escribe su nombre y, entre paréntesis, sus argumentos. Una función **intrínseca** está incorporada al lenguaje: no hay que definirla en el programa.

La función `real(7)` recibe el entero `7` y devuelve su conversión a tipo real. Aquí se convierte el operando antes de dividir, para conservar la fracción.

```fortran
program conversion
  implicit none
  print *, real(7) / 2.0
end program conversion
```

```salida
   3.50000000
```

> Doc: [Convertir a real](https://gcc.gnu.org/onlinedocs/gfortran/REAL.html)

> Nota: En una operación aritmética entre un entero y un real, el entero se convierte a real. Esa conversión no recupera una fracción que ya se perdió en una división entera anterior.

```ejercicio fortran
# Enunciado
Completa la función que convierte siete a tipo real.
# Plantilla
program conversion
  implicit none
  print *, ___(7) / 2.0
end program conversion
# Esperado
3.50000000
# Pista
La función tiene el mismo nombre que el tipo real.
```

# Convertir a entero

La función intrínseca `int` convierte un número real a entero descartando la parte fraccionaria hacia cero. No redondea al entero más cercano.

```fortran
program parte_entera
  implicit none
  print *, int(3.9)
end program parte_entera
```

```salida
           3
```

> Doc: [Convertir a entero](https://gcc.gnu.org/onlinedocs/gfortran/INT.html)

```ejercicio fortran
# Enunciado
Completa la función que obtiene la parte entera de 3.9.
# Plantilla
program parte_entera
  implicit none
  print *, ___(3.9)
end program parte_entera
# Esperado
3
# Pista
La función de conversión a entero se llama int.
```

# Obtener el resto

La función intrínseca `mod` devuelve el resto de una división. Recibe dos argumentos separados por coma: el dividendo y el divisor. En `mod(7, 2)`, se obtiene lo que queda después de repartir siete unidades en grupos de dos.

Los dos argumentos deben tener el mismo tipo numérico y el divisor debe ser distinto de cero.

```fortran
program resto
  implicit none
  print *, mod(7, 2)
end program resto
```

```salida
           1
```

> Doc: [Obtener el resto](https://gcc.gnu.org/onlinedocs/gfortran/MOD.html)

```ejercicio fortran
# Enunciado
Completa la función que calcula el resto.
# Plantilla
program resto
  implicit none
  print *, ___(7, 2)
end program resto
# Esperado
1
# Pista
La función se llama mod.
```

# Cierre

Ya has usado suma, resta, multiplicación, división, potencia, agrupación y concatenación. También has llamado funciones intrínsecas para convertir tipos y obtener el resto. En la siguiente sesión las comparaciones producirán valores lógicos para seleccionar y repetir instrucciones.
') on conflict (curso_slug, archivo) do update set contenido=excluded.contenido, actualizado_en=now();

insert into public.curso_contenido (curso_slug, archivo, contenido) values ('fortran-fundamentos', 'sesion-3.md', '---
numero: 3
titulo: "Comparaciones, decisiones y bucles"
---

# Antes de empezar

Las comparaciones devuelven valores de tipo `logical`. Esos resultados permiten ejecutar una instrucción bajo una condición o repetirla mientras una condición se cumpla. Primero se estudian los seis operadores de comparación, uno por apartado.

# Igualdad

El operador de igualdad (`==`) comprueba si dos valores son iguales. Devuelve un valor lógico. Se distingue de `=`, que asigna un valor.

```fortran
program comparacion
  implicit none
  print *, 4 == 4
end program comparacion
```

```salida
 T
```

> Doc: [Igualdad](https://fortran-lang.org/learn/quickstart/operators_control_flow/#logical-operators)

```ejercicio fortran
# Enunciado
Completa el operador de igualdad para que la comparación sea verdadera.
# Plantilla
program comparacion
  implicit none
  print *, 4 ___ 4
end program comparacion
# Esperado
T
# Pista
Usa el operador ==.
```

# Desigualdad

El operador de desigualdad (`/=`) comprueba si los valores son diferentes. No representa una división seguida de una asignación: los dos signos forman un solo operador.

```fortran
program comparacion
  implicit none
  print *, 4 /= 6
end program comparacion
```

```salida
 T
```

> Doc: [Desigualdad](https://fortran-lang.org/learn/quickstart/operators_control_flow/#logical-operators)

```ejercicio fortran
# Enunciado
Completa el operador de desigualdad para que la comparación sea verdadera.
# Plantilla
program comparacion
  implicit none
  print *, 4 ___ 6
end program comparacion
# Esperado
T
# Pista
Usa el operador /=.
```

# Mayor que

El operador mayor que (`>`) comprueba si el valor izquierdo supera al derecho. Cuando los dos son iguales, el resultado es falso.

```fortran
program comparacion
  implicit none
  print *, 6 > 4
end program comparacion
```

```salida
 T
```

> Doc: [Mayor que](https://fortran-lang.org/learn/quickstart/operators_control_flow/#logical-operators)

```ejercicio fortran
# Enunciado
Completa el operador de mayor que para que la comparación sea verdadera.
# Plantilla
program comparacion
  implicit none
  print *, 6 ___ 4
end program comparacion
# Esperado
T
# Pista
Usa el operador >.
```

# Menor que

El operador menor que (`<`) comprueba si el valor izquierdo es inferior al derecho. La igualdad no satisface esta comparación.

```fortran
program comparacion
  implicit none
  print *, 4 < 6
end program comparacion
```

```salida
 T
```

> Doc: [Menor que](https://fortran-lang.org/learn/quickstart/operators_control_flow/#logical-operators)

```ejercicio fortran
# Enunciado
Completa el operador de menor que para que la comparación sea verdadera.
# Plantilla
program comparacion
  implicit none
  print *, 4 ___ 6
end program comparacion
# Esperado
T
# Pista
Usa el operador <.
```

# Mayor o igual que

El operador mayor o igual que (`>=`) incluye la igualdad. Por eso dos valores iguales satisfacen esta comparación.

```fortran
program comparacion
  implicit none
  print *, 4 >= 4
end program comparacion
```

```salida
 T
```

> Doc: [Mayor o igual que](https://fortran-lang.org/learn/quickstart/operators_control_flow/#logical-operators)

```ejercicio fortran
# Enunciado
Completa el operador de mayor o igual que para que la comparación sea verdadera.
# Plantilla
program comparacion
  implicit none
  print *, 4 ___ 4
end program comparacion
# Esperado
T
# Pista
Usa el operador >=.
```

# Menor o igual que

El operador menor o igual que (`<=`) incluye la igualdad. Se escribe primero el signo menor y después el signo igual.

```fortran
program comparacion
  implicit none
  print *, 4 <= 4
end program comparacion
```

```salida
 T
```

> Doc: [Menor o igual que](https://fortran-lang.org/learn/quickstart/operators_control_flow/#logical-operators)

```ejercicio fortran
# Enunciado
Completa el operador de menor o igual que para que la comparación sea verdadera.
# Plantilla
program comparacion
  implicit none
  print *, 4 ___ 4
end program comparacion
# Esperado
T
# Pista
Usa el operador <=.
```

# Conjunción lógica

El operador de conjunción (`.and.`) produce verdadero solo si los dos operandos son verdaderos. Los puntos forman parte del operador. Aquí una comparación es verdadera y la otra falsa, por lo que su conjunción es falsa.

```fortran
program condiciones
  implicit none
  print *, (4 > 2) .and. (4 < 3)
end program condiciones
```

```salida
 F
```

> Doc: [Conjunción lógica](https://fortran-lang.org/learn/quickstart/operators_control_flow/#logical-operators)

```ejercicio fortran
# Enunciado
Completa el operador que exige que ambas comparaciones sean verdaderas.
# Plantilla
program condiciones
  implicit none
  print *, (4 > 2) ___ (4 < 3)
end program condiciones
# Esperado
F
# Pista
La conjunción se escribe .and.
```

# Disyunción lógica

El operador de disyunción (`.or.`) produce verdadero si al menos uno de los operandos es verdadero. También es verdadero cuando ambos lo son.

```fortran
program condiciones
  implicit none
  print *, (4 > 2) .or. (4 < 3)
end program condiciones
```

```salida
 T
```

> Doc: [Disyunción lógica](https://fortran-lang.org/learn/quickstart/operators_control_flow/#logical-operators)

```ejercicio fortran
# Enunciado
Completa el operador que acepta que al menos una comparación sea verdadera.
# Plantilla
program condiciones
  implicit none
  print *, (4 > 2) ___ (4 < 3)
end program condiciones
# Esperado
T
# Pista
La disyunción se escribe .or.
```

# Negación lógica

El operador de negación (`.not.`) invierte el valor lógico de un único operando: de verdadero a falso o de falso a verdadero. Se escribe antes de ese operando.

```fortran
program condiciones
  implicit none
  print *, .not. .false.
end program condiciones
```

```salida
 T
```

> Doc: [Negación lógica](https://fortran-lang.org/learn/quickstart/operators_control_flow/#logical-operators)

```ejercicio fortran
# Enunciado
Completa la negación para obtener verdadero.
# Plantilla
program condiciones
  implicit none
  print *, ___ .false.
end program condiciones
# Esperado
T
# Pista
La negación se escribe .not.
```

# Ejecutar bajo una condición

La construcción `if (...) then` ejecuta un bloque si su condición es verdadera. `if` significa «si» y `then`, «entonces». Los paréntesis delimitan la condición; `end if` cierra el bloque.

La variable `cantidad` contiene cuatro, por lo que la condición se cumple y se imprime el mensaje. Si se cambia su valor a cero, no se imprime nada. La sangría permite reconocer las instrucciones del bloque.

```fortran
program inventario
  implicit none
  integer :: cantidad
  cantidad = 4
  if (cantidad > 0) then
    print *, ''Disponible''
  end if
end program inventario
```

```salida
 Disponible
```

> Doc: [Ejecutar bajo una condición](https://fortran-lang.org/learn/quickstart/operators_control_flow/#conditional-construct-if)

```ejercicio fortran
# Enunciado
Completa la palabra que abre la condición.
# Plantilla
program inventario
  implicit none
  ___ (4 > 0) then
    print *, ''Disponible''
  end if
end program inventario
# Esperado
Disponible
# Pista
La condición se abre con if.
```

# Elegir una alternativa con else

`else` —«si no»— añade la alternativa que se ejecuta cuando la condición de `if` es falsa. En esta construcción se ejecuta exactamente una de las dos ramas.

La condición siguiente es falsa, así que se imprime el mensaje de la rama `else`.

```fortran
program inventario
  implicit none
  if (0 > 0) then
    print *, ''Disponible''
  else
    print *, ''Agotado''
  end if
end program inventario
```

```salida
 Agotado
```

> Doc: [Elegir una alternativa con else](https://fortran-lang.org/learn/quickstart/operators_control_flow/#conditional-construct-if)

```ejercicio fortran
# Enunciado
Completa la palabra que inicia la alternativa de una condición falsa.
# Plantilla
program inventario
  implicit none
  if (0 > 0) then
    print *, ''Disponible''
  ___
    print *, ''Agotado''
  end if
end program inventario
# Esperado
Agotado
# Pista
La alternativa se escribe con else.
```

# Añadir otra condición

`else if (...) then` comprueba otra condición cuando la anterior fue falsa. Las condiciones se evalúan en orden. Al encontrar una verdadera se ejecuta su bloque y se omiten las demás ramas; `else` cubre el caso en que ninguna se cumple.

Aquí el número no es menor que cero, pero sí es igual a cero.

```fortran
program clasificacion
  implicit none
  if (0 < 0) then
    print *, ''Negativo''
  else if (0 == 0) then
    print *, ''Cero''
  else
    print *, ''Positivo''
  end if
end program clasificacion
```

```salida
 Cero
```

> Doc: [Añadir otra condición](https://fortran-lang.org/learn/quickstart/operators_control_flow/#conditional-construct-if)

```ejercicio fortran
# Enunciado
Completa la segunda condición para reconocer el cero.
# Plantilla
program clasificacion
  implicit none
  if (0 < 0) then
    print *, ''Negativo''
  else if (0 ___ 0) then
    print *, ''Cero''
  else
    print *, ''Positivo''
  end if
end program clasificacion
# Esperado
Cero
# Pista
Usa la comparación de igualdad (==).
```

# Repetir con do

Un **bucle** repite instrucciones. `do indice = 1, 3` asigna al contador `indice` los valores desde uno hasta tres, incluidos los extremos, con incremento de uno por omisión. La coma separa el valor inicial del final y `end do` cierra el bucle.

Cada repetición, llamada **iteración**, añade el contador a `total`. Esta variable comienza en cero y acumula las sumas. La declaración `integer :: indice, total` declara dos enteros; la coma separa sus nombres. Al terminar el bucle se imprime la suma acumulada.

```fortran
program conteo
  implicit none
  integer :: indice, total
  total = 0
  do indice = 1, 3
    total = total + indice
  end do
  print *, total
end program conteo
```

```salida
           6
```

> Doc: [Repetir con do](https://fortran-lang.org/learn/quickstart/operators_control_flow/#loop-constructs-do)

```ejercicio fortran
# Enunciado
Completa el límite para sumar los enteros desde uno hasta tres.
# Plantilla
program conteo
  implicit none
  integer :: indice, total
  total = 0
  do indice = 1, ___
    total = total + indice
  end do
  print *, total
end program conteo
# Esperado
6
# Pista
El valor final está incluido.
```

# Cambiar el incremento del bucle

Un tercer valor en `do` fija el incremento del contador. `do indice = 2, 6, 2` comienza en dos y suma dos en cada iteración, sin superar seis. El incremento no puede ser cero. El acumulador `total` suma los valores dos, cuatro y seis.

```fortran
program conteo
  implicit none
  integer :: indice, total
  total = 0
  do indice = 2, 6, 2
    total = total + indice
  end do
  print *, total
end program conteo
```

```salida
          12
```

> Doc: [Cambiar el incremento del bucle](https://fortran-lang.org/learn/quickstart/operators_control_flow/#loop-constructs-do)

```ejercicio fortran
# Enunciado
Completa el incremento para sumar dos, cuatro y seis.
# Plantilla
program conteo
  implicit none
  integer :: indice, total
  total = 0
  do indice = 2, 6, ___
    total = total + indice
  end do
  print *, total
end program conteo
# Esperado
12
# Pista
El tercer valor indica cuánto aumenta el contador.
```

# Repetir mientras se cumpla una condición

`do while (...)` —«repetir mientras»— comprueba una condición antes de cada iteración. Si es falsa desde el principio, el cuerpo no se ejecuta.

Este bucle imprime `turno` y luego lo aumenta. En `turno = turno + 1`, primero se calcula el valor derecho con el contenido actual y después se asigna el resultado. Esa actualización permite que la condición deje de cumplirse.

```fortran
program conteo
  implicit none
  integer :: turno
  turno = 1
  do while (turno <= 3)
    print *, turno
    turno = turno + 1
  end do
end program conteo
```

```salida
           1
           2
           3
```

> Doc: [Repetir mientras se cumpla una condición](https://fortran-lang.org/learn/quickstart/operators_control_flow/#conditional-loop-do-while)

```ejercicio fortran
# Enunciado
Completa el límite para imprimir los turnos uno, dos y tres.
# Plantilla
program conteo
  implicit none
  integer :: turno
  turno = 1
  do while (turno <= ___)
    print *, turno
    turno = turno + 1
  end do
end program conteo
# Esperado
1
2
3
# Pista
El bucle continúa mientras turno sea menor o igual que el límite.
```

# Terminar un bucle con exit

La sentencia `exit` termina el bucle en el que aparece. Aquí se ejecuta cuando el contador llega a tres, antes de sumar ese valor a `total`. La ejecución continúa después de `end do` y muestra la suma de uno y dos.

```fortran
program conteo
  implicit none
  integer :: indice, total
  total = 0
  do indice = 1, 4
    if (indice == 3) then
      exit
    end if
    total = total + indice
  end do
  print *, total
end program conteo
```

```salida
           3
```

> Doc: [Terminar un bucle con exit](https://fortran-lang.org/learn/quickstart/operators_control_flow/#loop-control-statements-exit-and-cycle)

```ejercicio fortran
# Enunciado
Completa la sentencia que termina el bucle antes de sumar tres.
# Plantilla
program conteo
  implicit none
  integer :: indice, total
  total = 0
  do indice = 1, 4
    if (indice == 3) then
      ___
    end if
    total = total + indice
  end do
  print *, total
end program conteo
# Esperado
3
# Pista
Para abandonar el bucle se usa exit.
```

# Omitir una iteración con cycle

La sentencia `cycle` omite las instrucciones restantes de la iteración actual. El bucle continúa con la siguiente iteración. Aquí se omite la suma del dos, pero se suma el tres. El resultado reúne solo uno y tres.

```fortran
program conteo
  implicit none
  integer :: indice, total
  total = 0
  do indice = 1, 3
    if (indice == 2) then
      cycle
    end if
    total = total + indice
  end do
  print *, total
end program conteo
```

```salida
           4
```

> Doc: [Omitir una iteración con cycle](https://fortran-lang.org/learn/quickstart/operators_control_flow/#loop-control-statements-exit-and-cycle)

```ejercicio fortran
# Enunciado
Completa la sentencia que omite el dos y permite continuar con el tres.
# Plantilla
program conteo
  implicit none
  integer :: indice, total
  total = 0
  do indice = 1, 3
    if (indice == 2) then
      ___
    end if
    total = total + indice
  end do
  print *, total
end program conteo
# Esperado
4
# Pista
Para continuar con la siguiente iteración se usa cycle.
```

# Cierre

Ya puedes comparar valores con los seis operadores relacionales, combinar condiciones con conjunción, disyunción y negación, elegir ramas y controlar bucles. En la siguiente sesión agruparás valores en arreglos y organizarás operaciones en funciones, subrutinas y módulos.
') on conflict (curso_slug, archivo) do update set contenido=excluded.contenido, actualizado_en=now();

insert into public.curso_contenido (curso_slug, archivo, contenido) values ('fortran-fundamentos', 'sesion-4.md', '---
numero: 4
titulo: "Arreglos y organización del código"
---

# Antes de empezar

Hasta aquí cada variable ha guardado un solo valor. Esta sesión introduce arreglos de una dimensión y, después, procedimientos para reutilizar instrucciones. Los ejemplos usan cantidades enteras para concentrarse en la nueva estructura.

# Crear un arreglo

Un **arreglo** reúne elementos del mismo tipo bajo un nombre. `integer :: cantidades(3)` declara tres elementos enteros; el número entre paréntesis fija cuántos contiene.

Los corchetes (`[]`) construyen un arreglo de valores separados por comas. La asignación copia esos tres valores a `cantidades`, y `print` muestra el arreglo completo.

```fortran
program inventario
  implicit none
  integer :: cantidades(3)
  cantidades = [2, 4, 6]
  print *, cantidades
end program inventario
```

```salida
           2           4           6
```

> Doc: [Crear un arreglo](https://fortran-lang.org/learn/quickstart/arrays_strings/#array-declaration)

> Nota: Este arreglo es de una dimensión: cada elemento se identifica con un índice. Las matrices y los arreglos cuyo tamaño se decide durante la ejecución se estudian en Fortran intermedio.

```ejercicio fortran
# Enunciado
Completa la cantidad de elementos del arreglo.
# Plantilla
program inventario
  implicit none
  integer :: cantidades(___)
  cantidades = [2, 4, 6]
  print *, cantidades
end program inventario
# Esperado
2 4 6
# Pista
El constructor contiene tres valores.
```

# Consultar un elemento

Un **índice** identifica la posición de un elemento. En un arreglo declarado como `cantidades(3)`, el primer índice es uno y el último es tres. `cantidades(2)` consulta únicamente el segundo elemento.

Los paréntesis se usan aquí para seleccionar una posición del arreglo; el nombre `cantidades` fue declarado como arreglo, no como función.

```fortran
program inventario
  implicit none
  integer :: cantidades(3)
  cantidades = [2, 4, 6]
  print *, cantidades(2)
end program inventario
```

```salida
           4
```

> Doc: [Consultar un elemento](https://fortran-lang.org/learn/quickstart/arrays_strings/#array-declaration)

```ejercicio fortran
# Enunciado
Completa el índice del segundo elemento.
# Plantilla
program inventario
  implicit none
  integer :: cantidades(3)
  cantidades = [2, 4, 6]
  print *, cantidades(___)
end program inventario
# Esperado
4
# Pista
El primer elemento usa el índice uno.
```

# Modificar un elemento

Un elemento también puede aparecer a la izquierda de `=`. La asignación modifica esa posición y conserva las demás. Aquí se reemplaza el segundo elemento por ocho.

```fortran
program inventario
  implicit none
  integer :: cantidades(3)
  cantidades = [2, 4, 6]
  cantidades(2) = 8
  print *, cantidades
end program inventario
```

```salida
           2           8           6
```

> Doc: [Modificar un elemento](https://fortran-lang.org/learn/quickstart/arrays_strings/#array-declaration)

```ejercicio fortran
# Enunciado
Completa el índice del elemento que debe cambiar a ocho.
# Plantilla
program inventario
  implicit none
  integer :: cantidades(3)
  cantidades = [2, 4, 6]
  cantidades(___) = 8
  print *, cantidades
end program inventario
# Esperado
2 8 6
# Pista
Debe cambiar la posición que contiene cuatro.
```

# Seleccionar una sección

Los dos puntos (`:`) separan el índice inicial del final de una **sección** del arreglo. `cantidades(2:3)` selecciona los elementos segundo y tercero, incluidos ambos extremos. El resultado sigue siendo un arreglo.

```fortran
program inventario
  implicit none
  integer :: cantidades(3)
  cantidades = [2, 4, 6]
  print *, cantidades(2:3)
end program inventario
```

```salida
           4           6
```

> Doc: [Seleccionar una sección](https://fortran-lang.org/learn/quickstart/arrays_strings/#array-slicing)

```ejercicio fortran
# Enunciado
Completa el signo que selecciona desde el segundo elemento hasta el tercero.
# Plantilla
program inventario
  implicit none
  integer :: cantidades(3)
  cantidades = [2, 4, 6]
  print *, cantidades(2___3)
end program inventario
# Esperado
4
6
# Pista
Los límites se separan con dos puntos (:).
```

# Consultar el tamaño

La función intrínseca `size` recibe un arreglo y devuelve su número total de elementos como un entero. Contar los elementos no suma sus valores: el arreglo del ejemplo contiene tres elementos, aunque sus valores sean dos, cuatro y seis.

```fortran
program inventario
  implicit none
  integer :: cantidades(3)
  cantidades = [2, 4, 6]
  print *, size(cantidades)
end program inventario
```

```salida
           3
```

> Doc: [Consultar el tamaño](https://gcc.gnu.org/onlinedocs/gfortran/SIZE.html)

```ejercicio fortran
# Enunciado
Completa la función que cuenta los elementos.
# Plantilla
program inventario
  implicit none
  integer :: cantidades(3)
  cantidades = [2, 4, 6]
  print *, ___(cantidades)
end program inventario
# Esperado
3
# Pista
La función de consulta del tamaño se llama size.
```

# Sumar los elementos

La función intrínseca `sum` recibe un arreglo numérico y devuelve la suma de sus elementos. Como el arreglo es entero, esta llamada también devuelve un entero.

```fortran
program inventario
  implicit none
  integer :: cantidades(3)
  cantidades = [2, 4, 6]
  print *, sum(cantidades)
end program inventario
```

```salida
          12
```

> Doc: [Sumar los elementos](https://gcc.gnu.org/onlinedocs/gfortran/SUM.html)

```ejercicio fortran
# Enunciado
Completa la función que suma las cantidades.
# Plantilla
program inventario
  implicit none
  integer :: cantidades(3)
  cantidades = [2, 4, 6]
  print *, ___(cantidades)
end program inventario
# Esperado
12
# Pista
La suma de elementos se obtiene con sum.
```

# Recorrer un arreglo

El contador de un bucle puede seleccionar un elemento en cada iteración. El recorrido va desde uno hasta `size(cantidades)`, que es el último índice de este arreglo. En cada iteración se añade el elemento a `total`. Este acumulador permite comprobar el resultado del recorrido. Se obtiene la misma suma que con `sum`, ahora mediante un bucle explícito.

```fortran
program inventario
  implicit none
  integer :: cantidades(3)
  integer :: indice, total
  cantidades = [2, 4, 6]
  total = 0
  do indice = 1, size(cantidades)
    total = total + cantidades(indice)
  end do
  print *, total
end program inventario
```

```salida
          12
```

> Doc: [Recorrer un arreglo](https://fortran-lang.org/learn/quickstart/operators_control_flow/#loop-constructs-do)

```ejercicio fortran
# Enunciado
Completa el índice que cambia en cada iteración.
# Plantilla
program inventario
  implicit none
  integer :: cantidades(3)
  integer :: indice, total
  cantidades = [2, 4, 6]
  total = 0
  do indice = 1, size(cantidades)
    total = total + cantidades(___)
  end do
  print *, total
end program inventario
# Esperado
12
# Pista
Utiliza el contador del bucle.
```

# Definir una función

Una función propia permite nombrar una operación y reutilizarla. `contains` separa las instrucciones del programa principal de las definiciones de sus procedimientos internos. La definición no se ejecuta por estar escrita allí: se usa al llamar a la función.

`integer function doble(numero)` declara una función llamada `doble`, con resultado entero. `numero` es el argumento que recibe. `intent(in)` indica que el argumento se utiliza como entrada y no se modifica dentro de la función. La coma separa este atributo del tipo del argumento.

La asignación a `doble` fija el valor que devuelve la función. `end function` cierra su definición. En la llamada `doble(4)`, el argumento `numero` recibe cuatro.

```fortran
program calculo
  implicit none
  print *, doble(4)
  contains
    integer function doble(numero)
      integer, intent(in) :: numero
      doble = 2 * numero
    end function doble
end program calculo
```

```salida
           8
```

> Doc: [Definir una función](https://fortran-lang.org/learn/quickstart/organising_code/#functions)

> Nota: Una función interna tiene acceso al ámbito del programa que la contiene. También hereda su implicit none. El argumento se declara dentro de la función porque pertenece a ese procedimiento.

```ejercicio fortran
# Enunciado
Completa la operación que duplica el argumento.
# Plantilla
program calculo
  implicit none
  print *, doble(4)
  contains
    integer function doble(numero)
      integer, intent(in) :: numero
      doble = ___ * numero
    end function doble
end program calculo
# Esperado
8
# Pista
Multiplica el argumento por dos.
```

# Definir una subrutina

Una **subrutina** agrupa instrucciones que se ejecutan mediante `call` —«llamar»—. A diferencia de una función, no produce un valor para insertar en una expresión. En este caso su acción es imprimir un saludo.

`subroutine saludar()` comienza la definición; los paréntesis vacíos indican que no hay argumentos. `end subroutine` la cierra. `call saludar()` ejecuta esa subrutina.

```fortran
program bienvenida
  implicit none
  call saludar()
  contains
    subroutine saludar()
      print *, ''Hola''
    end subroutine saludar
end program bienvenida
```

```salida
 Hola
```

> Doc: [Definir una subrutina](https://fortran-lang.org/learn/quickstart/organising_code/#subroutines)

```ejercicio fortran
# Enunciado
Completa la sentencia que ejecuta la subrutina.
# Plantilla
program bienvenida
  implicit none
  ___ saludar()
  contains
    subroutine saludar()
      print *, ''Hola''
    end subroutine saludar
end program bienvenida
# Esperado
Hola
# Pista
Las subrutinas se invocan con call.
```

# Compartir una constante mediante un módulo

Un **módulo** reúne definiciones que pueden utilizar otras unidades de programa. `module` y `end module` delimitan esa unidad. Aquí contiene únicamente la constante `dias_semana`, ya estudiada en la primera sesión.

`use calendario` permite usar las definiciones del módulo. El modificador `only:` restringe el acceso a los nombres de la lista que sigue: aquí, solo `dias_semana`. La coma separa el nombre del módulo de `only:`, y los dos puntos introducen esa lista. La sentencia `use` se escribe antes de `implicit none`.

El módulo se coloca primero para que esté disponible al compilar el programa principal. Ambas unidades forman un solo ejemplo ejecutable.

```fortran
module calendario
  implicit none
  integer, parameter :: dias_semana = 7
end module calendario

program semana
  use calendario, only: dias_semana
  implicit none
  print *, dias_semana
end program semana
```

```salida
           7
```

> Doc: [Compartir una constante mediante un módulo](https://fortran-lang.org/learn/quickstart/organising_code/#modules)

```ejercicio fortran
# Enunciado
Completa la sentencia que permite usar la constante del módulo.
# Plantilla
module calendario
  implicit none
  integer, parameter :: dias_semana = 7
end module calendario
program semana
  ___ calendario, only: dias_semana
  implicit none
  print *, dias_semana
end program semana
# Esperado
7
# Pista
La sentencia se llama use.
```

# Cierre

Has creado arreglos, consultado y modificado elementos, seleccionado secciones, obtenido su tamaño y su suma, y recorrido sus posiciones. También has definido una función, una subrutina y un módulo con una constante.

El curso de introducción termina con esas herramientas. Fortran intermedio desarrolla la precisión numérica, los arreglos dinámicos, la entrada y salida de datos y la organización de procedimientos en módulos. Puedes practicar lo aprendido en el Sandbox de Fortran de la ruta.
') on conflict (curso_slug, archivo) do update set contenido=excluded.contenido, actualizado_en=now();

insert into public.curso_sesiones (curso_slug, archivo, numero, titulo, slug) values ('fortran-fundamentos', 'sesion-1.md', 1, 'Primeros programas y variables', 'sesion-1') on conflict (curso_slug, archivo) do update set numero=excluded.numero, titulo=excluded.titulo, slug=excluded.slug;

insert into public.curso_sesiones (curso_slug, archivo, numero, titulo, slug) values ('fortran-fundamentos', 'sesion-2.md', 2, 'Operaciones y funciones incorporadas', 'sesion-2') on conflict (curso_slug, archivo) do update set numero=excluded.numero, titulo=excluded.titulo, slug=excluded.slug;

insert into public.curso_sesiones (curso_slug, archivo, numero, titulo, slug) values ('fortran-fundamentos', 'sesion-3.md', 3, 'Comparaciones, decisiones y bucles', 'sesion-3') on conflict (curso_slug, archivo) do update set numero=excluded.numero, titulo=excluded.titulo, slug=excluded.slug;

insert into public.curso_sesiones (curso_slug, archivo, numero, titulo, slug) values ('fortran-fundamentos', 'sesion-4.md', 4, 'Arreglos y organización del código', 'sesion-4') on conflict (curso_slug, archivo) do update set numero=excluded.numero, titulo=excluded.titulo, slug=excluded.slug;

commit;
