---
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
    print *, 'Disponible'
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
    print *, 'Disponible'
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
    print *, 'Disponible'
  else
    print *, 'Agotado'
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
    print *, 'Disponible'
  ___
    print *, 'Agotado'
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
    print *, 'Negativo'
  else if (0 == 0) then
    print *, 'Cero'
  else
    print *, 'Positivo'
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
    print *, 'Negativo'
  else if (0 ___ 0) then
    print *, 'Cero'
  else
    print *, 'Positivo'
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
