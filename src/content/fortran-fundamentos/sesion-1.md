---
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

La sentencia `print` escribe en la salida del programa. En `print *, 'Hola, Fortran'`, el asterisco (`*`) selecciona un formato automático, llamado **dirigido por lista**, y la coma (`,`) lo separa del contenido que se imprime.

Las comillas simples (`'`) delimitan un texto literal: los caracteres que se van a mostrar. Las comillas no forman parte de la salida. `print` se escribe entre el inicio y el final del programa.

```fortran
program saludo
  print *, 'Hola, Fortran'
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
  ___ *, 'Hola, Fortran'
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
  print *, 'Hola'
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
  print *, 'Hola'
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
  print *, 'Hola'
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
  print *, 'Hola'
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

`ciudad` puede guardar el texto `'Lima'`, que ocupa cuatro caracteres.

```fortran
program destino
  implicit none
  character(len=4) :: ciudad
  ciudad = 'Lima'
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
  ciudad = 'Lima'
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
