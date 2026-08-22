---
numero: 2
titulo: "Fracciones, razones y porcentajes"
---

# La aritmética más costosa

Un porcentaje mal aplicado no da error: da un número plausible. Un descuento
que se aplica dos veces, un aumento que se cree reversible, una media de
porcentajes que no significa nada. Todos se producen sin aviso.

Esta sesión es la que más veces se necesita después.

# Fracciones exactas

El módulo `fractions` guarda una fracción como lo que es —numerador y
denominador— en lugar de convertirla a decimal, así que no pierde exactitud.

```python
from fractions import Fraction

print(Fraction(1, 3))
print(Fraction(1, 3) + Fraction(1, 6))
print(float(Fraction(1, 3)))
```

```salida
1/3
1/2
0.3333333333333333
```

> Nota: `1/3 + 1/6` da exactamente `1/2`. Con decimales daría
> `0.49999999999999994`. Cuando el resultado tiene que ser exacto —repartos,
> proporciones, dinero— la fracción es la herramienta, no el decimal.

```ejercicio
# Enunciado
Completa la clase que representa una fracción exacta.

# Plantilla
from fractions import Fraction
print(___(1, 4) + Fraction(1, 4))

# Esperado
1/2

# Pista
Ocho letras: «fracción» en inglés, con mayúscula inicial.
```

# Simplificar

Una fracción se simplifica dividiendo arriba y abajo por el mismo número.
`Fraction` lo hace solo, siempre.

```python
from fractions import Fraction

print(Fraction(6, 8))
print(Fraction(100, 250))
print(Fraction(6, 8).numerator, Fraction(6, 8).denominator)
```

```salida
3/4
2/5
3 4
```

```ejercicio
# Enunciado
Completa el atributo que devuelve el número de abajo de la fracción.

# Plantilla
from fractions import Fraction
print(Fraction(6, 8).___)

# Esperado
4

# Pista
Once letras: «denominador» en inglés, que se escribe casi igual.
```

# Un porcentaje es una fracción

«Por ciento» significa «entre cien». El 18 % es `18/100`, o sea `0.18`. Nada
más.

```python
precio = 250
igv = precio * 18 / 100
print(igv)
print(precio + igv)
print(precio * 1.18)
```

```salida
45.0
295.0
295.0
```

> Nota: Las dos últimas líneas dan lo mismo. Multiplicar por `1.18` es sumar el
> 18 % en un solo paso, y es la forma que menos se equivoca: no hay que acordarse
> de sumar el resultado al original.

```ejercicio
# Enunciado
Completa el factor que suma un 18 % en una sola multiplicación.

# Plantilla
print(250 * ___)

# Esperado
295.0

# Pista
Uno coma dieciocho.
```

# Descontar

Un descuento del 30 % deja el 70 %. Se multiplica por `0.7`, no se resta un
`0.3`.

```python
precio = 250
print(precio * 0.70)
print(precio - precio * 0.30)
```

```salida
175.0
175.0
```

```ejercicio
# Enunciado
Completa el factor que aplica un descuento del 30 %.

# Plantilla
print(250 * ___)

# Esperado
175.0

# Pista
Lo que queda tras quitar el treinta por ciento, en tanto por uno.
```

# Subir y bajar el mismo porcentaje no devuelve al origen

Es el error más repetido de todos. Si un precio sube un 20 % y después baja un
20 %, no vuelve a valer lo que valía.

```python
precio = 100
subido = precio * 1.20
bajado = subido * 0.80
print(subido)
print(bajado)
print(bajado - precio)
```

```salida
120.0
96.0
-4.0
```

> Nota: El motivo es que el segundo porcentaje se calcula sobre una cantidad
> distinta: el 20 % de 120 es 24, no 20. Para deshacer una subida del 20 % hay
> que dividir entre 1.20, no multiplicar por 0.80.

```ejercicio
# Enunciado
Completa el operador que deshace de verdad una subida del 20 %.

# Plantilla
print(round(100 * 1.20 ___ 1.20, 2))

# Esperado
100.0

# Pista
Un solo carácter: la operación inversa de multiplicar.
```

# Descuentos encadenados

Dos descuentos seguidos del 10 % no son un 20 %. Se multiplican los factores,
no se suman los porcentajes.

```python
precio = 200
print(precio * 0.90 * 0.90)
print(precio * 0.80)
print(round((1 - 0.90 * 0.90) * 100, 2))
```

```salida
162.0
160.0
19.0
```

```ejercicio
# Enunciado
Completa el segundo factor para encadenar dos descuentos del 10 %.

# Plantilla
print(200 * 0.90 * ___)

# Esperado
162.0

# Pista
El mismo factor que el primero.
```

# Cuánto varió algo

La variación porcentual es la diferencia dividida entre el valor de partida.
Cuál es «el de partida» decide el signo y la magnitud.

```python
antes = 80
despues = 100
print(round((despues - antes) / antes * 100, 2))
print(round((antes - despues) / despues * 100, 2))
```

```salida
25.0
-20.0
```

> Nota: Subir de 80 a 100 es un aumento del 25 %, pero bajar de 100 a 80 es una
> caída del 20 %. El mismo cambio absoluto da dos porcentajes distintos, y por
> eso un porcentaje sin decir respecto a qué no informa de nada.

```ejercicio
# Enunciado
Completa el denominador para calcular el aumento respecto al valor de partida.

# Plantilla
antes = 80
despues = 100
print(round((despues - antes) / ___ * 100, 2))

# Esperado
25.0

# Pista
El valor de partida, que aquí está en una variable.
```

# Proporciones

Una proporción dice que dos razones son iguales. Se resuelve multiplicando en
cruz, que es la regla de tres de toda la vida.

```python
# Si 3 kg cuestan 21 soles, ¿cuánto cuestan 8 kg?
print(21 / 3 * 8)
# Y al revés: ¿cuántos kilos se compran con 49 soles?
print(49 / (21 / 3))
```

```salida
56.0
7.0
```

```ejercicio
# Enunciado
Completa la cantidad de kilos por la que se multiplica el precio unitario.

# Plantilla
print(21 / 3 * ___)

# Esperado
56.0

# Pista
Ocho kilos.
```

# Cierre

Fracciones exactas, porcentajes como factores, y las dos trampas que más se
repiten: subir y bajar lo mismo no vuelve al origen, y encadenar descuentos no
los suma.

La sesión siguiente sube a las potencias y las raíces, que es como se escriben
las cantidades muy grandes y muy pequeñas.
