---
numero: 3
titulo: "Las leyes de una variable"
preludio: |
  from itertools import product

  def equivalentes(f, g):
      n = f.__code__.co_argcount
      return all(f(*caso) == g(*caso) for caso in product([False, True], repeat=n))
---

# Qué es una ley

Una ley del álgebra booleana es una igualdad entre dos expresiones que se
cumple en **todos** los casos. Como los casos son `2**n` y no más, demostrar
una ley es comprobarlos todos, sin excepción y sin argumento adicional.

Las leyes de esta sesión relacionan una variable con las dos constantes, `0` y
`1`, y con su propio complemento. Son las que permiten eliminar términos de una
expresión, que es de lo que trata simplificar.

# El comprobador de leyes

La función `equivalentes` recibe las dos expresiones de una igualdad, ya
escritas como funciones, y devuelve si coinciden en todos los casos. Deduce el
número de variables del primer argumento con `__code__.co_argcount`, como en la
sesión 2.

```python
from itertools import product

def equivalentes(f, g):
    n = f.__code__.co_argcount
    return all(f(*caso) == g(*caso) for caso in product([False, True], repeat=n))

print(equivalentes(lambda a, b: a and b, lambda a, b: b and a))
print(equivalentes(lambda a, b: a and b, lambda a, b: a or b))
```

```salida
True
False
```

> Doc: [all()](https://docs.python.org/3/library/functions.html#all)

> Nota: `all` devuelve `True` sobre una secuencia vacía. Aquí no llega a
> ocurrir, porque `product` con `repeat=n` genera al menos una combinación
> incluso para `n = 0`, pero es la razón por la que conviene no usar `all`
> sobre una secuencia que podría estar vacía sin comprobarlo antes.

Esta función queda disponible en el resto de bloques de la sesión sin volver a
definirla.

```ejercicio
# Enunciado
Completa la función que devuelve verdadero solo si todos los elementos lo son.

# Plantilla
print(___([True, True, False]))

# Esperado
False

# Pista
Tres letras, en inglés: «todos».
```

# Ley de identidad

Cada operación tiene un elemento neutro: un valor que, combinado con cualquier
otro, lo deja igual. Para la conjunción es `1`; para la disyunción es `0`.

```
a ∧ 1 = a          a ∨ 0 = a
```

```python
print(equivalentes(lambda a: a and True, lambda a: a))
print(equivalentes(lambda a: a or False, lambda a: a))
```

```salida
True
True
```

# Ley de dominación

El otro emparejamiento produce el resultado contrario: en lugar de dejar el
valor igual, lo fija. `1` domina la disyunción y `0` domina la conjunción.

```
a ∨ 1 = 1          a ∧ 0 = 0
```

```python
print(equivalentes(lambda a: a or True, lambda a: True))
print(equivalentes(lambda a: a and False, lambda a: False))
```

```salida
True
True
```

> Nota: la dominación es la que justifica la evaluación en cortocircuito de la
> sesión 1. Si el primer operando de `or` es verdadero, el resultado ya está
> determinado y el segundo no se evalúa; y esa es la garantía que hace correcta
> una expresión como `if datos and datos[0] > 0`, donde el segundo operando
> fallaría con una lista vacía.

# Ley de idempotencia

Combinar un valor consigo mismo no lo altera, con cualquiera de las dos
operaciones.

```
a ∧ a = a          a ∨ a = a
```

```python
print(equivalentes(lambda a: a and a, lambda a: a))
print(equivalentes(lambda a: a or a, lambda a: a))
```

```salida
True
True
```

> Nota: es una diferencia clara con el álgebra de los números, donde `a + a` da
> `2a` y no `a`. En el álgebra booleana no hay coeficientes que acumular:
> repetir un término no aporta nada, y por eso una expresión repetida se puede
> tachar sin más.

```ejercicio
# Enunciado
Completa la ley de idempotencia de la disyunción: a ∨ a equivale a la propia a.

# Plantilla
from itertools import product
print(all((a or a) == ___ for a in [False, True]))

# Esperado
True

# Pista
Una sola letra: la misma variable del bucle.
```

# Ley del complemento

Una variable y su complemento no pueden ser verdaderos a la vez, ni falsos a la
vez. La conjunción de ambos es siempre `0`; la disyunción, siempre `1`.

```
a ∧ ¬a = 0          a ∨ ¬a = 1
```

```python
print(equivalentes(lambda a: a and not a, lambda a: False))
print(equivalentes(lambda a: a or not a, lambda a: True))
```

```salida
True
True
```

> Nota: la segunda igualdad es el principio del tercero excluido, y la primera
> el de no contradicción. En este álgebra son teoremas comprobables en dos
> filas, no supuestos: se cumplen porque el conjunto tiene exactamente dos
> elementos.

# Ley de involución

Negar dos veces devuelve el valor de partida.

```
¬(¬a) = a
```

```python
print(equivalentes(lambda a: not (not a), lambda a: a))
```

```salida
True
```

> Nota: en Python la doble negación con `not not` sí tiene un efecto sobre
> valores que no son booleanos: convierte cualquier objeto al `bool` que le
> corresponde según la prueba de valor de verdad. `not not []` devuelve
> `False`, igual que `bool([])`. Como conversión explícita, `bool()` se lee
> mejor.

# Las constantes y el principio de dualidad

Falta el complemento de las propias constantes, que cierra el juego.

```
¬0 = 1          ¬1 = 0
```

```python
print(not False, not True)
```

```salida
True False
```

Todas las leyes de esta sesión han aparecido por pares, y el emparejamiento no
es casual. Si en una ley válida se intercambia `∧` por `∨` y `0` por `1`, el
resultado es otra ley válida. Es el **principio de dualidad**, y significa que
cada ley demostrada regala su pareja.

| Ley | Su dual |
|---|---|
| `a ∧ 1 = a` | `a ∨ 0 = a` |
| `a ∧ 0 = 0` | `a ∨ 1 = 1` |
| `a ∧ a = a` | `a ∨ a = a` |
| `a ∧ ¬a = 0` | `a ∨ ¬a = 1` |

La dualidad se puede comprobar sobre las columnas de la sesión 2: intercambiar
las operaciones y las constantes equivale a negar entradas y salida a la vez.

```python
print(equivalentes(lambda a, b: not (a and b), lambda a, b: (not a) or (not b)))
print(equivalentes(lambda a, b: not (a or b), lambda a, b: (not a) and (not b)))
```

```salida
True
True
```

Esas dos igualdades son las leyes de De Morgan, que la sesión 5 desarrolla: son
el mecanismo concreto que convierte una ley en su dual.

# Lo que queda cubierto

Están demostradas, comprobando todos sus casos, las leyes que gobiernan una
variable frente a las constantes y frente a su complemento: identidad,
dominación, idempotencia, complemento e involución. Y está el principio de
dualidad, que empareja cada una con otra.

La sesión 4 pasa a las leyes que relacionan dos y tres variables entre sí:
conmutativa, asociativa, distributiva y absorción. Ahí aparece la distributiva
de la disyunción sobre la conjunción, que no tiene equivalente en el álgebra de
los números.
