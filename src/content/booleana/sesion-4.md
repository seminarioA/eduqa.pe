---
numero: 4
titulo: "Las leyes de dos y tres variables"
preludio: |
  from itertools import product

  def equivalentes(f, g):
      n = f.__code__.co_argcount
      return all(f(*caso) == g(*caso) for caso in product([False, True], repeat=n))
---

# El comprobador, otra vez

Esta sesión usa el mismo `equivalentes` de la sesión 3. Se repite aquí para que
la sesión funcione al entrar directo a ella.

```python
from itertools import product

def equivalentes(f, g):
    n = f.__code__.co_argcount
    return all(f(*caso) == g(*caso) for caso in product([False, True], repeat=n))

print(equivalentes(lambda a: a and a, lambda a: a))
```

```salida
True
```

# Ley conmutativa

El orden de los operandos no altera el resultado, en las dos operaciones.

```
a ∧ b = b ∧ a          a ∨ b = b ∨ a
```

```python
print(equivalentes(lambda a, b: a and b, lambda a, b: b and a))
print(equivalentes(lambda a, b: a or b, lambda a, b: b or a))
```

```salida
True
True
```

> Nota: la ley se cumple en el álgebra, pero **no** en la evaluación de Python
> cuando los operandos tienen efectos. `f() and g()` y `g() and f()` dan el
> mismo valor de verdad y ejecutan cosas distintas: por el cortocircuito, cada
> orden decide cuál de las dos llamadas puede no llegar a producirse. Es la
> razón por la que `if usuario is not None and usuario.activo` no se puede
> reordenar.

# Ley asociativa

Con tres operandos y una sola operación repetida, los paréntesis no cambian
nada.

```
(a ∧ b) ∧ c = a ∧ (b ∧ c)          (a ∨ b) ∨ c = a ∨ (b ∨ c)
```

```python
print(equivalentes(lambda a, b, c: (a and b) and c, lambda a, b, c: a and (b and c)))
print(equivalentes(lambda a, b, c: (a or b) or c, lambda a, b, c: a or (b or c)))
```

```salida
True
True
```

> Nota: la asociatividad es lo que permite escribir `a and b and c` sin
> paréntesis y hablar de «la conjunción de una lista». Sin ella, `all([a, b,
> c])` no estaría definido sin decir además en qué orden agrupa.

```python
print(all([True, True, False]))
print(any([True, True, False]))
```

```salida
False
True
```

> Doc: [any()](https://docs.python.org/3/library/functions.html#any)

```ejercicio
# Enunciado
Completa la función que devuelve verdadero si al menos un elemento lo es.

# Plantilla
print(___([False, False, True]))

# Esperado
True

# Pista
Tres letras, en inglés: «alguno».
```

# Ley distributiva de la conjunción sobre la disyunción

La primera distributiva es la que ya se conoce del álgebra de los números, con
`∧` en el papel del producto y `∨` en el de la suma.

```
a ∧ (b ∨ c) = (a ∧ b) ∨ (a ∧ c)
```

```python
print(equivalentes(
    lambda a, b, c: a and (b or c),
    lambda a, b, c: (a and b) or (a and c),
))
```

```salida
True
```

# Ley distributiva de la disyunción sobre la conjunción

La segunda no tiene equivalente en los números. Dice que la disyunción también
distribuye sobre la conjunción, cosa que la suma no hace sobre el producto.

```
a ∨ (b ∧ c) = (a ∨ b) ∧ (a ∨ c)
```

```python
print(equivalentes(
    lambda a, b, c: a or (b and c),
    lambda a, b, c: (a or b) and (a or c),
))
```

```salida
True
```

Con números la igualdad correspondiente es falsa, y basta un caso para
comprobarlo.

```python
a, b, c = 2, 3, 4
print(a + (b * c))
print((a + b) * (a + c))
```

```salida
14
30
```

> Nota: la asimetría del álgebra de los números procede de que la suma y el
> producto no juegan el mismo papel. En el álgebra booleana sí lo juegan, y por
> eso toda ley tiene su dual. Escribir `∧` como producto y `∨` como suma es una
> notación cómoda, pero sugiere una analogía que se rompe justo aquí.

```ejercicio
# Enunciado
Completa el operador que hace válida la distributiva de la disyunción sobre la conjunción.

# Plantilla
from itertools import product
casos = product([False, True], repeat=3)
print(all((a or (b and c)) == ((a or b) ___ (a or c)) for a, b, c in casos))

# Esperado
True

# Pista
Tres letras, en inglés: la conjunción.
```

# Ley de absorción

Un término absorbe al otro cuando aparece dentro de él. Las dos formas
eliminan una variable entera de la expresión.

```
a ∨ (a ∧ b) = a          a ∧ (a ∨ b) = a
```

```python
print(equivalentes(lambda a, b: a or (a and b), lambda a, b: a))
print(equivalentes(lambda a, b: a and (a or b), lambda a, b: a))
```

```salida
True
True
```

```venn
izquierda: a
derecha: b
resalta: izquierda
pie: "La absorción a ∨ (a ∧ b) = a: la intersección está contenida en a, así que unirla no añade nada"
```

La absorción es la primera ley que **acorta** una expresión sin condiciones: la
variable `b` desaparece, y con ella cualquier cálculo que costara obtenerla.

```python
print(equivalentes(
    lambda a, b, c: a or (a and b) or (a and b and c),
    lambda a, b, c: a,
))
```

```salida
True
```

# Lo que no existe en este álgebra

Conviene nombrar las operaciones que **no** hay, porque su ausencia explica
por qué simplificar aquí funciona de otro modo.

- **No hay resta ni división.** En los números, `a + b = a + c` permite cancelar
  `a` y concluir `b = c`. Aquí no: con `a = 1`, `a ∨ b` vale `1` sea cual sea
  `b`, así que de `a ∨ b = a ∨ c` no se deduce nada sobre `b` y `c`.

```python
a, b, c = True, True, False
print((a or b) == (a or c))
print(b == c)
```

```salida
True
False
```

- **No hay elemento inverso**, y por eso el complemento no lo sustituye: `¬a`
  no deshace `a` en el sentido en que `-a` deshace `a` en la suma. Lo que
  produce `a ∨ ¬a` no es el neutro `0`, sino el dominante `1`.

# Lo que queda cubierto

Están demostradas las leyes que relacionan dos y tres variables: conmutativa,
asociativa, las dos distributivas y la absorción. Está señalado el punto donde
la analogía con el álgebra de los números se rompe —la segunda distributiva— y
las dos operaciones que este álgebra no tiene, la resta y la división, con la
cancelación que se pierde con ellas.

La sesión 5 trata la pareja de leyes que falta, y que es la de uso más
frecuente al escribir código: las de De Morgan, que dicen cómo se niega una
conjunción y cómo se niega una disyunción.
