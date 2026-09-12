---
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
      print *, 'Hola'
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
      print *, 'Hola'
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
