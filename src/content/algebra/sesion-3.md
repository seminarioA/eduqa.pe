---
numero: 3
titulo: "Potencias, raíces y notación científica"
---

# Multiplicar muchas veces

Una potencia es una multiplicación repetida: `3 ** 4` es tres multiplicado por
sí mismo cuatro veces. La base es el número que se repite y el exponente,
cuántas veces.

```python
print(3 ** 4)
print(3 * 3 * 3 * 3)
print(2 ** 10)
```

```salida
81
81
1024
```

> Nota: `2 ** 10` es 1024, y de ahí viene que un kilobyte no sean mil bytes.
> Las potencias de dos aparecen en todo lo que un ordenador procesa internamente.

```ejercicio
# Enunciado
Completa el exponente que eleva 2 hasta 1024.

# Plantilla
print(2 ** ___)

# Esperado
1024

# Pista
Diez.
```

# Las leyes de los exponentes

Multiplicar potencias de la misma base es sumar los exponentes. Dividirlas es
restarlos. Elevar una potencia a otra es multiplicarlos.

```python
print(2 ** 3 * 2 ** 4, 2 ** 7)
print(2 ** 7 / 2 ** 4, 2 ** 3)
print((2 ** 3) ** 4, 2 ** 12)
```

```salida
128 128
8.0 8
4096 4096
```

```ejercicio
# Enunciado
Completa el exponente que resulta de multiplicar dos potencias de base 2 con exponentes 3 y 4.

# Plantilla
print(2 ** 3 * 2 ** 4 == 2 ** ___)

# Esperado
True

# Pista
La suma de los dos exponentes.
```

# El exponente cero y los negativos

Cualquier número elevado a cero vale uno. Un exponente negativo es el inverso:
`2 ** -3` es `1 / 2 ** 3`.

```python
print(5 ** 0)
print(2 ** -3)
print(1 / 2 ** 3)
```

```salida
1
0.125
0.125
```

> Nota: Que un número elevado a cero valga uno no es un capricho. Se deduce de la ley
> de la división: `2**3 / 2**3` es a la vez `1` y `2**0`. Para que la regla siga
> valiendo, `2**0` tiene que ser `1`.

```ejercicio
# Enunciado
Completa el signo del exponente para obtener el inverso de una potencia.

# Plantilla
print(2 ** ___3)

# Esperado
0.125

# Pista
Un solo carácter, el que indica un número negativo.
```

# Las raíces son potencias

La raíz cuadrada es elevar a `1/2`, la cúbica a `1/3`. No es una analogía: es la
definición.

```python
print(9 ** 0.5)
print(27 ** (1 / 3))
print(16 ** (1 / 4))
```

```salida
3.0
3.0
2.0
```

> Nota: La raíz cúbica de 27 resulta `3.0000000000000004` y no `3`, porque `1/3` no
> es exacto en decimales. Es el mismo asunto de la primera sesión: cuando el
> resultado se compara, se redondea antes.

```ejercicio
# Enunciado
Completa el exponente que calcula la raíz cuadrada.

# Plantilla
print(9 ** ___)

# Esperado
3.0

# Pista
Cero coma cinco.
```

# La raíz cuadrada del módulo math

`math.sqrt()` calcula la raíz cuadrada por un camino más directo y con menos
error que elevar a `0.5`.

```python
import math

print(math.sqrt(9))
print(math.sqrt(2))
print(round(math.sqrt(2) ** 2, 10))
```

```salida
3.0
1.4142135623730951
2.0
```

```ejercicio
# Enunciado
Completa la función de math que calcula la raíz cuadrada.

# Plantilla
import math
print(math.___(144))

# Esperado
12.0

# Pista
Cuatro letras: la abreviatura inglesa de «raíz cuadrada».
```

# Números muy grandes y muy pequeños

La notación científica escribe un número como una cifra entre uno y diez
multiplicada por una potencia de diez. En Python la `e` significa «por diez
elevado a».

```python
print(3e8)
print(1.5e-4)
print(3e8 == 300000000.0)
```

```salida
300000000.0
0.00015
True
```

> Nota: `3e8` son 300 millones, la velocidad de la luz en metros por segundo.
> Escribirlo así evita contar ceros, que es el origen de los errores de un
> factor diez.

```ejercicio
# Enunciado
Completa el exponente para escribir 300000000 en notación científica.

# Plantilla
print(3e___ == 300000000.0)

# Esperado
True

# Pista
Ocho ceros detrás del tres.
```

# El orden de magnitud

El orden de magnitud es el exponente de diez que más se le parece. Sirve para
comparar cosas de tamaños muy distintos sin perderse en las cifras.

```python
import math

for n in [7, 850, 12000, 3e8]:
    print(n, "->", math.floor(math.log10(n)))
```

```salida
7 -> 0
850 -> 2
12000 -> 4
300000000.0 -> 8
```

> Nota: Comparar órdenes de magnitud es la forma rápida de detectar un
> disparate. Si un cálculo de segundos devuelve algo de orden 9, no es necesario
> revisar los decimales: sobran nueve ceros por alguna parte.

```ejercicio
# Enunciado
Completa la función que redondea hacia abajo hasta el entero.

# Plantilla
import math
print(math.___(math.log10(850)))

# Esperado
2

# Pista
Cinco letras: «suelo» en inglés.
```

# Comparar creciendo

Elevar al cuadrado no duplica: dispara. La diferencia entre crecer de forma
lineal y hacerlo por potencias es la que separa un programa que aguanta de uno
que se atasca.

```python
for n in [10, 100, 1000]:
    print(n, n * 2, n ** 2)
```

```salida
10 20 100
100 200 10000
1000 2000 1000000
```

```ejercicio
# Enunciado
Completa el exponente que hace que 1000 se convierta en un millón.

# Plantilla
print(1000 ** ___)

# Esperado
1000000

# Pista
Dos: el cuadrado.
```

# Cierre

Ya se manejan potencias, raíces y las dos formas de escribir números enormes o
diminutos sin equivocarse contando ceros.

Hasta aquí todo eran números concretos. La sesión siguiente introduce las
letras, que es donde empieza el álgebra de verdad.
