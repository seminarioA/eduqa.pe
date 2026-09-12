---
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

El operador de concatenación (`//`), formado por dos barras, une dos textos. Conserva sus caracteres, incluidos los espacios. El espacio al final de `'Hola, '` separa el saludo del nombre.

```fortran
program saludo
  implicit none
  print *, 'Hola, ' // 'Ana'
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
  print *, 'Hola, ' ___ 'Ana'
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
