---
numero: 2
titulo: "Tablas de verdad"
---

# La herramienta que demuestra todo lo demás

Una tabla de verdad enumera los `2**n` casos posibles de una expresión de `n`
variables y da su valor en cada uno. Como no hay más casos, la tabla no es una
muestra: es la expresión entera, escrita de otra forma.

De ahí se deriva el método del curso. Dos expresiones son iguales si sus tablas
coinciden fila por fila, y una ley del álgebra queda demostrada cuando se
comprueban sus `2**n` filas. No hace falta ningún otro argumento.

# Enumerar los casos con `product`

Las combinaciones de `n` variables booleanas son el producto cartesiano de
`[False, True]` consigo mismo `n` veces. La función `product` de `itertools` lo
genera con el parámetro `repeat`, que indica cuántas veces se repite el
conjunto.

```python
from itertools import product

for caso in product([False, True], repeat=2):
    print(caso)
```

```salida
(False, False)
(False, True)
(True, False)
(True, True)
```

> Doc: [itertools.product](https://docs.python.org/3/library/itertools.html#itertools.product)

> Nota: `product` varía primero la última posición, igual que al contar en
> binario: `00`, `01`, `10`, `11`. Ese es el orden convencional de las tablas
> de verdad, así que las filas coinciden con las de cualquier libro sin
> reordenarlas.

# El número de filas crece como `2**n`

Cada variable que se añade duplica el número de casos.

```python
from itertools import product

for n in range(1, 6):
    filas = len(list(product([False, True], repeat=n)))
    print(f"n = {n} -> {filas} filas")
```

```salida
n = 1 -> 2 filas
n = 2 -> 4 filas
n = 3 -> 8 filas
n = 4 -> 16 filas
n = 5 -> 32 filas
```

> Nota: el crecimiento exponencial es el límite del método. Comprobar las 16
> filas de cuatro variables es inmediato; comprobar las de sesenta variables
> son 2**60 filas, más de un trillón, y ahí la enumeración exhaustiva deja de
> ser viable. Los algoritmos que evitan enumerar se tratan en el curso
> intermedio.

```ejercicio
# Enunciado
Completa el parámetro de product que fija cuántas veces se repite el conjunto.

# Plantilla
from itertools import product
print(len(list(product([False, True], ___=3))))

# Esperado
8

# Pista
Seis letras, en inglés: «repetir».
```

# Una tabla de verdad impresa

Con las filas enumeradas, la tabla es un bucle que evalúa la expresión en cada
caso. Los valores se imprimen como `0` y `1` con `int()`, que es la notación
compacta habitual y funciona porque `bool` hereda de `int`.

```python
from itertools import product

print("a b | a and b")
for a, b in product([False, True], repeat=2):
    print(int(a), int(b), "|", int(a and b))
```

```salida
a b | a and b
0 0 | 0
0 1 | 0
1 0 | 0
1 1 | 1
```

# Una función que tabula cualquier expresión

Escribir el bucle en cada ley sería repetirlo veinte veces. La expresión se
pasa como función y el número de variables se deduce de su firma con
`__code__.co_argcount`, que es el atributo donde Python guarda cuántos
parámetros posicionales acepta.

```python
from itertools import product

def tabla(f, nombre):
    n = f.__code__.co_argcount
    print(" ".join("abcd"[:n]), "|", nombre)
    for caso in product([False, True], repeat=n):
        print(" ".join(str(int(v)) for v in caso), "|", int(f(*caso)))

tabla(lambda a, b: a or b, "a or b")
```

```salida
a b | a or b
0 0 | 0
0 1 | 1
1 0 | 1
1 1 | 1
```

> Nota: `f(*caso)` usa el operador de desempaquetado (`*`), que reparte los
> elementos de la tupla como argumentos posicionales. Sin él, `f(caso)`
> pasaría la tupla entera como un único argumento.

Con tres variables la misma función da ocho filas sin ningún cambio.

```python
from itertools import product

def tabla(f, nombre):
    n = f.__code__.co_argcount
    print(" ".join("abcd"[:n]), "|", nombre)
    for caso in product([False, True], repeat=n):
        print(" ".join(str(int(v)) for v in caso), "|", int(f(*caso)))

tabla(lambda a, b, c: a and (b or c), "a and (b or c)")
```

```salida
a b c | a and (b or c)
0 0 0 | 0
0 0 1 | 0
0 1 0 | 0
0 1 1 | 0
1 0 0 | 0
1 0 1 | 1
1 1 0 | 1
1 1 1 | 1
```

```ejercicio
# Enunciado
Completa el atributo que devuelve cuántos parámetros posicionales acepta una función.

# Plantilla
def f(a, b, c):
    return a
print(f.__code__.___)

# Esperado
3

# Pista
Once caracteres, en inglés: «cuenta de argumentos».
```

# La columna de resultados identifica la función

Una vez fijado el orden de las filas, lo único que distingue una expresión de
otra es su columna de resultados. Dos expresiones con la misma columna son la
misma función booleana, por distinta que sea su escritura.

```python
from itertools import product

def columna(f):
    n = f.__code__.co_argcount
    return tuple(int(f(*caso)) for caso in product([False, True], repeat=n))

print(columna(lambda a, b: a and b))
print(columna(lambda a, b: not (not a or not b)))
print(columna(lambda a, b: a or b))
```

```salida
(0, 0, 0, 1)
(0, 0, 0, 1)
(0, 1, 1, 1)
```

Las dos primeras expresiones se escriben distinto y son la misma función: esa
igualdad es una de las leyes de De Morgan, que se demuestra en la sesión 5. La
tercera es otra función.

# Cuántas funciones booleanas existen

Una función de `n` variables queda determinada por su columna, que tiene `2**n`
casillas, y cada casilla admite dos valores. Por tanto hay `2**(2**n)`
funciones distintas de `n` variables, y no más.

```python
for n in range(0, 5):
    print(f"n = {n} -> {2 ** (2 ** n)} funciones")
```

```salida
n = 0 -> 2 funciones
n = 1 -> 4 funciones
n = 2 -> 16 funciones
n = 3 -> 256 funciones
n = 4 -> 65536 funciones
```

Para dos variables son dieciséis, y se pueden listar todas.

```python
from itertools import product

for columna in product([0, 1], repeat=4):
    print(columna)
```

```salida
(0, 0, 0, 0)
(0, 0, 0, 1)
(0, 0, 1, 0)
(0, 0, 1, 1)
(0, 1, 0, 0)
(0, 1, 0, 1)
(0, 1, 1, 0)
(0, 1, 1, 1)
(1, 0, 0, 0)
(1, 0, 0, 1)
(1, 0, 1, 0)
(1, 0, 1, 1)
(1, 1, 0, 0)
(1, 1, 0, 1)
(1, 1, 1, 0)
(1, 1, 1, 1)
```

Entre esas dieciséis están la conjunción `(0, 0, 0, 1)`, la disyunción
`(0, 1, 1, 1)`, la constante falsa `(0, 0, 0, 0)` y la constante verdadera
`(1, 1, 1, 1)`. Las que aún no tienen nombre en este curso —la implicación, la
disyunción exclusiva, NAND y NOR— se tratan en la sesión 7.

> Nota: el resultado tiene una consecuencia que conviene fijar ahora. Como el
> número de funciones es finito, **toda** expresión booleana, por larga que
> sea, es igual a alguna de esas dieciséis si usa dos variables. Simplificar no
> es una cuestión de destreza: es encontrar la escritura más corta de una de
> las columnas posibles.

# Lo que queda cubierto

Está el instrumento de demostración del curso: enumerar los `2**n` casos con
`product`, tabular cualquier expresión pasándola como función, y reducirla a su
columna de resultados, que es lo que decide si dos expresiones son la misma.

La sesión 3 aplica el instrumento a las primeras leyes del álgebra: las que
relacionan una variable con las constantes `0` y `1` y con su propio
complemento.
