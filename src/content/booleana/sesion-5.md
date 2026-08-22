---
numero: 5
titulo: "Las leyes de De Morgan"
preludio: |
  from itertools import product

  def equivalentes(f, g):
      n = f.__code__.co_argcount
      return all(f(*caso) == g(*caso) for caso in product([False, True], repeat=n))
---

# Cómo entra una negación en un paréntesis

Las leyes anteriores dicen cómo se combinan las variables. Las de De Morgan
dicen algo distinto y de uso más frecuente: **qué pasa cuando se niega una
expresión entera**. Son las que se aplican cada vez que se reescribe una
condición para quitarle el `not` de delante.

Son dos, una por operación, y se llaman así por Augustus De Morgan.

```
¬(a ∧ b) = ¬a ∨ ¬b
¬(a ∨ b) = ¬a ∧ ¬b
```

La negación entra en el paréntesis, se aplica a cada operando **y cambia la
operación por la otra**. Ese cambio es la parte que se olvida.

# Negar una conjunción

Que no sea cierto que las dos cosas ocurren equivale a que falle al menos una.

```python
from itertools import product

cabecera = ["a", "b", "no (a and b)", "(not a) or (not b)"]
print(" | ".join(cabecera))
for a, b in product([False, True], repeat=2):
    fila = [a, b, not (a and b), (not a) or (not b)]
    print(" | ".join(str(int(v)).rjust(len(c)) for v, c in zip(fila, cabecera)))
```

```salida
a | b | no (a and b) | (not a) or (not b)
0 | 0 |            1 |                  1
0 | 1 |            1 |                  1
1 | 0 |            1 |                  1
1 | 1 |            0 |                  0
```

Las dos columnas coinciden en las cuatro filas, así que la ley queda
demostrada.

```venn
izquierda: a
derecha: b
resalta: complemento-interseccion
pie: ¬(a ∧ b) es todo lo que queda fuera de la intersección, que es exactamente lo que no está en a junto con lo que no está en b
```

# Negar una disyunción

Que no ocurra ninguna de las dos equivale a que fallen las dos.

```python
from itertools import product

cabecera = ["a", "b", "no (a or b)", "(not a) and (not b)"]
print(" | ".join(cabecera))
for a, b in product([False, True], repeat=2):
    fila = [a, b, not (a or b), (not a) and (not b)]
    print(" | ".join(str(int(v)).rjust(len(c)) for v, c in zip(fila, cabecera)))
```

```salida
a | b | no (a or b) | (not a) and (not b)
0 | 0 |           1 |                   1
0 | 1 |           0 |                   0
1 | 0 |           0 |                   0
1 | 1 |           0 |                   0
```

```venn
izquierda: a
derecha: b
resalta: complemento-union
pie: ¬(a ∨ b) es lo que queda fuera de los dos círculos, que es a la vez fuera de a y fuera de b
```

> Nota: la segunda ley es la primera aplicada al dual, y a la inversa. Por eso
> De Morgan es el mecanismo concreto detrás del principio de dualidad de la
> sesión 3: negar entradas y salida a la vez intercambia `∧` con `∨`.

```ejercicio
# Enunciado
Completa la operación que hace válida la primera ley de De Morgan.

# Plantilla
from itertools import product
casos = product([False, True], repeat=2)
print(all((not (a and b)) == ((not a) ___ (not b)) for a, b in casos))

# Esperado
True

# Pista
Dos letras, en inglés: la disyunción.
```

# La regla en tres pasos

Aplicar De Morgan a mano es siempre lo mismo:

1. Quitar la negación de delante del paréntesis.
2. Cambiar la operación por la otra: `∧` pasa a `∨`, y `∨` pasa a `∧`.
3. Negar cada operando.

Con tres operandos funciona igual, porque la ley se aplica repetidamente.

```python
print(equivalentes(
    lambda a, b, c: not (a and b and c),
    lambda a, b, c: (not a) or (not b) or (not c),
))
print(equivalentes(
    lambda a, b, c: not (a or b or c),
    lambda a, b, c: (not a) and (not b) and (not c),
))
```

```salida
True
True
```

# La forma general: `any` y `all`

`all` es la conjunción de una lista entera y `any` su disyunción, así que De
Morgan se enuncia sobre ellas directamente:

```
¬ all(x) = any(¬x)          ¬ any(x) = all(¬x)
```

```python
from itertools import product

for caso in product([False, True], repeat=3):
    print(
        (not all(caso)) == any(not v for v in caso),
        (not any(caso)) == all(not v for v in caso),
    )
```

```salida
True True
True True
True True
True True
True True
True True
True True
True True
```

> Doc: [all()](https://docs.python.org/3/library/functions.html#all)
> Doc: [any()](https://docs.python.org/3/library/functions.html#any)

Los paréntesis alrededor de `not all(caso)` no son decorativos: `not` se agrupa
más fuerte que `==`, así que sin ellos la expresión significa
`not (all(caso) == any(...))`, que es otra cosa. Lo incómodo del caso es que
aquí las dos agrupaciones dan el mismo resultado en las ocho filas.

```python
from itertools import product

for caso in product([False, True], repeat=3):
    con_parentesis = (not all(caso)) == any(not v for v in caso)
    sin_parentesis = not all(caso) == any(not v for v in caso)
    print(int(con_parentesis), int(sin_parentesis))
```

```salida
1 1
1 1
1 1
1 1
1 1
1 1
1 1
1 1
```

> Nota: que las dos columnas coincidan no significa que las dos expresiones
> sean la misma. Coinciden porque `all(caso)` y `any(¬caso)` son opuestos por
> la propia ley, de modo que su comparación con `==` es falsa siempre y negarla
> da verdadero siempre. La consecuencia práctica es que una prueba no puede
> validar esta agrupación: los paréntesis se escriben porque fijan el
> significado, no porque un caso vaya a delatar su ausencia.

# Reescribir condiciones

El uso corriente de De Morgan es quitar una negación que envuelve una condición
compuesta, porque la versión negada se lee peor.

```python
def hay_que_reintentar(respondio, dentro_de_plazo):
    return not (respondio and dentro_de_plazo)

def hay_que_reintentar_demorgan(respondio, dentro_de_plazo):
    return (not respondio) or (not dentro_de_plazo)

print(equivalentes(hay_que_reintentar, hay_que_reintentar_demorgan))
```

```salida
True
```

Al negar comparaciones, el complemento de cada una se escribe con el operador
contrario: el de `>` es `<=`, el de `==` es `!=`, y el de `in` es `not in`.

| Comparación | Su negación |
|---|---|
| `x > 0` | `x <= 0` |
| `x >= 0` | `x < 0` |
| `x == 0` | `x != 0` |
| `x in datos` | `x not in datos` |
| `x is None` | `x is not None` |

```python
print(equivalentes(
    lambda a, b: not (a > 0 and b == 3),
    lambda a, b: a <= 0 or b != 3,
))
```

```salida
True
```

> Doc: [Comparaciones](https://docs.python.org/3/library/stdtypes.html#comparisons)

> Nota: esa tabla de negaciones presupone que los valores son comparables entre
> sí, y con números de punto flotante hay una excepción. `float("nan")` no es
> mayor, ni menor, ni igual a nada, ni siquiera a sí mismo, así que `not (x >
> 0)` y `x <= 0` dejan de coincidir. De Morgan sigue siendo válida —opera sobre
> valores de verdad, no sobre números—; lo que falla es el paso de sustituir
> `not (x > 0)` por `x <= 0`.

```python
x = float("nan")
print(x > 0, x <= 0)
print(not (x > 0), x <= 0)
```

```salida
False False
True False
```

```ejercicio
# Enunciado
Completa la comparación que niega x >= 10.

# Plantilla
valores = [3, 10, 25]
print([(not (x >= 10)) == (x ___ 10) for x in valores])

# Esperado
[True, True, True]

# Pista
Un solo carácter: el operador «menor que».
```

# Lo que queda cubierto

Están demostradas las dos leyes de De Morgan sobre su tabla completa, con su
lectura en diagramas de conjuntos, su forma general sobre `any` y `all`, y su
uso para quitar una negación de delante de una condición compuesta. Queda
señalado el límite de la reescritura de comparaciones cuando aparece `nan`, y
repetido el fallo de precedencia que produce una comprobación que parece
correcta y no lo es.

Con esto está completo el juego de leyes del álgebra. La sesión 6 usa las
tablas para decidir preguntas sobre una expresión cualquiera: si dos son
equivalentes, si una es siempre verdadera, si es siempre falsa, y si existe
algún caso que la haga verdadera.
