---
numero: 8
titulo: "Exponenciales y logaritmos"
paquetes: ["sympy"]
preludio: |
  import sympy as sp
  x = sp.Symbol("x")
---

# Crecer multiplicando

Una recta crece sumando siempre lo mismo. Una exponencial crece multiplicando
siempre por lo mismo, y esa diferencia se hace enorme muy rápido.

```python
lineal = 100
exponencial = 100
for mes in range(1, 7):
    lineal = lineal + 20
    exponencial = exponencial * 1.20
    print(mes, lineal, round(exponencial, 2))
```

```salida
1 120 120.0
2 140 144.0
3 160 172.8
4 180 207.36
5 200 248.83
6 220 298.6
```

> Nota: Al principio van casi iguales y al sexto mes ya se separan. Ese
> «al principio parece lo mismo» es la razón por la que el crecimiento
> exponencial se subestima de forma sistemática, en interés compuesto y en
> cualquier otra cosa que se multiplique.

```ejercicio
# Enunciado
Completa el factor que hace crecer un 20 % en cada paso.

# Plantilla
v = 100
for mes in range(2):
    v = v * ___
print(round(v, 2))

# Esperado
144.0

# Pista
Uno coma dos.
```

# La forma cerrada

El bucle no es necesario: el valor tras `n` pasos es el inicial multiplicado por
el factor elevado a `n`.

```python
print(round(100 * 1.20 ** 6, 2))
print(round(100 * 1.20 ** 12, 2))
```

```salida
298.6
891.61
```

```ejercicio
# Enunciado
Completa el exponente que corresponde a seis periodos de crecimiento.

# Plantilla
print(round(100 * 1.20 ** ___, 2))

# Esperado
298.6

# Pista
Seis.
```

# La pregunta inversa

Saber cuánto vale tras seis meses es fácil. La pregunta útil suele ser la
contraria: cuántos meses se requieren para llegar a cierta cantidad. Esa
pregunta la responde el logaritmo.

```python
import math

print(math.log(8, 2))
print(2 ** 3)
print(math.log(1000, 10))
```

```salida
3.0
8
2.9999999999999996
```

> Nota: El logaritmo en base 2 de 8 es 3 porque hay que multiplicar 2 por sí
> mismo tres veces para llegar a 8. Un logaritmo no es más que eso: el exponente
> que falta.

```ejercicio
# Enunciado
Completa la base del logaritmo para que el resultado de 1000 sea 3.

# Plantilla
import math
print(math.log(1000, ___))

# Esperado
2.9999999999999996

# Pista
Diez.
```

# El logaritmo natural

`math.log()` con un solo argumento usa la base `e`, un número que aparece por
todas partes en crecimiento continuo. No es la base diez.

```python
import math

print(math.e)
print(math.log(math.e))
print(math.log(100))
print(math.log10(100))
```

```salida
2.718281828459045
1.0
4.605170185988092
2.0
```

> Nota: `math.log(100)` da 4.6 y `math.log10(100)` da 2. Confundirlos es el
> error más común con logaritmos, y no avisa: los dos devuelven un número
> razonable.

```ejercicio
# Enunciado
Completa la función que calcula el logaritmo en base diez.

# Plantilla
import math
print(math.___(100))

# Esperado
2.0

# Pista
Tres letras y el número de la base.
```

# Despejar el exponente

Con logaritmos se resuelve «cuánto tiempo se requiere». Se aplica el logaritmo a
los dos lados y el exponente baja.

```python
import math

# 100 * 1.20**n = 300  ->  n = log(3) / log(1.20)
n = math.log(300 / 100) / math.log(1.20)
print(round(n, 2))
print(round(100 * 1.20 ** n, 2))
```

```salida
6.03
300.0
```

```ejercicio
# Enunciado
Completa el cociente al que hay que aplicar el logaritmo para triplicar.

# Plantilla
import math
print(round(math.log(___) / math.log(1.20), 2))

# Esperado
6.03

# Pista
Triplicar es multiplicar por tres.
```

# El tiempo de duplicación

El caso más usado es cuánto tarda algo en duplicarse. Solo depende de la tasa,
no de la cantidad de partida.

```python
import math

for tasa in [0.05, 0.10, 0.20]:
    print(tasa, round(math.log(2) / math.log(1 + tasa), 2))
```

```salida
0.05 14.21
0.1 7.27
0.2 3.8
```

> Nota: De ahí procede la regla del 70 que se usa de cabeza: dividir 70 entre la
> tasa en porcentaje da aproximadamente los periodos que tarda en duplicarse. Al
> 10 %, siete periodos; el cálculo exacto da 7.27.

```ejercicio
# Enunciado
Completa el número cuyo logaritmo aparece al calcular el tiempo de duplicación.

# Plantilla
import math
print(round(math.log(___) / math.log(1.10), 2))

# Esperado
7.27

# Pista
Duplicar es multiplicar por dos.
```

# Resolverlo con SymPy

`solve` también despeja exponentes, y devuelve la expresión exacta en lugar de
un decimal.

```python
print(sp.solve(sp.Eq(2 ** x, 8), x))
print(sp.solve(sp.Eq(100 * sp.Rational(6, 5) ** x, 300), x))
```

```salida
[3]
[-log(3)/(-log(6) + log(5))]
```

```ejercicio
# Enunciado
Completa el resultado al que debe llegar la potencia de base 2 para que x valga 3.

# Plantilla
print(sp.solve(sp.Eq(2 ** x, ___), x))

# Esperado
[3]

# Pista
Dos elevado a tres.
```

# Por qué los logaritmos aparecen en las escalas

Cuando unos datos van de la unidad a los millones, una escala normal aplasta
todo lo pequeño. El logaritmo los reparte de forma legible.

```python
import math

for n in [1, 10, 1000, 1000000]:
    print(f"{n:>9}  {math.log10(n):>4.0f}")
```

```salida
        1     0
       10     1
     1000     3
  1000000     6
```

> Nota: Es la razón de que los terremotos, el sonido y el pH se midan en escalas
> logarítmicas. Un paso en la escala no es «un poco más», es diez veces más, y
> por eso la diferencia entre un sismo de 5 y uno de 7 es de cien veces.

```ejercicio
# Enunciado
Completa la función que da el orden de magnitud de un millón.

# Plantilla
import math
print(int(math.___(1000000)))

# Esperado
6

# Pista
Tres letras y el número diez.
```

# Cierre

El recorrido está completo: de las operaciones y su orden a las fracciones y los
porcentajes, de las potencias a las letras, de una ecuación a un sistema, y de
las rectas a las curvas y al crecimiento multiplicativo.

Con esto ya no falta álgebra para empezar a programar. El siguiente paso natural
es el curso de introducción a Python, donde estas mismas ideas dejan de
calcularse una a una y pasan a escribirse como programas.
