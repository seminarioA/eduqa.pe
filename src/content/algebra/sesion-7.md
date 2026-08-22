---
numero: 7
titulo: "Funciones lineales y cuadráticas"
paquetes: ["sympy"]
preludio: |
  import sympy as sp
  x = sp.Symbol("x")
---

# Una regla que transforma números

Una función toma un número y devuelve otro siguiendo una regla fija. En Python
se escribe con `def`, y es la misma idea que en matemáticas.

```python
def f(n):
    return 2 * n + 3

print(f(0))
print(f(5))
print(f(-1))
```

```salida
3
13
1
```

```ejercicio
# Enunciado
Completa la palabra clave que hace que la función entregue el resultado.

# Plantilla
def f(n):
    ___ 2 * n + 3

print(f(4))

# Esperado
11

# Pista
Seis letras: el verbo devolver en inglés.
```

# La función lineal

`y = m*x + b` es una recta. `m` es la pendiente —cuánto sube `y` cuando `x`
avanza uno— y `b` la altura a la que corta el eje vertical.

```python
def recta(x, m, b):
    return m * x + b

print(recta(0, 2, 3))
print(recta(1, 2, 3))
print(recta(2, 2, 3))
```

```salida
3
5
7
```

> Nota: Cada paso de `x` suma exactamente la pendiente. Esa es la propiedad que
> define una recta: el ritmo de cambio no depende de dónde se esté.

```ejercicio
# Enunciado
Completa la pendiente para que al avanzar una unidad en x el valor suba de 3 a 5.

# Plantilla
def recta(x, m, b):
    return m * x + b

print(recta(1, ___, 3))

# Esperado
5

# Pista
Sube dos por cada paso.
```

# Sacar la pendiente de dos puntos

La pendiente es cuánto cambia `y` dividido entre cuánto cambia `x`.

```python
x1, y1 = 1, 4
x2, y2 = 3, 10
pendiente = (y2 - y1) / (x2 - x1)
print(pendiente)
print("altura en x=0:", y1 - pendiente * x1)
```

```salida
3.0
altura en x=0: 1.0
```

```ejercicio
# Enunciado
Completa el denominador de la pendiente, que es cuánto avanzó la x.

# Plantilla
print((10 - 4) / ___)

# Esperado
3.0

# Pista
De uno a tres hay dos.
```

# La cuadrática

Cuando aparece `x` al cuadrado, la gráfica deja de ser una recta y se convierte
en una parábola: baja, llega a un mínimo y vuelve a subir.

```python
def parabola(x):
    return x ** 2 - 5 * x + 6

for n in [0, 1, 2, 3, 4, 5]:
    print(n, parabola(n))
```

```salida
0 6
1 2
2 0
3 0
4 2
5 6
```

> Nota: En `x = 2` y `x = 3` vale cero, y entre medias es negativa. Esos dos
> puntos donde cruza el cero son las raíces, y son lo que se busca al resolver
> una ecuación de segundo grado.

```ejercicio
# Enunciado
Completa el exponente que convierte la recta en una parábola.

# Plantilla
def f(x):
    return x ** ___ - 5 * x + 6

print(f(4))

# Esperado
2

# Pista
Dos: el cuadrado.
```

# Las raíces

`solve` encuentra los valores que anulan la expresión. Una cuadrática tiene como
mucho dos.

```python
print(sp.solve(x ** 2 - 5 * x + 6, x))
print(sp.solve(x ** 2 - 4, x))
print(sp.solve(x ** 2 + 1, x))
```

```salida
[2, 3]
[-2, 2]
[-I, I]
```

> Nota: La última devuelve `[-I, I]`, con la unidad imaginaria: esa parábola
> nunca alcanza el cero en los números reales. Que SymPy responda con números
> complejos no es un error, es la respuesta completa.

```ejercicio
# Enunciado
Completa el término independiente para que las raíces sean 2 y 3.

# Plantilla
print(sp.solve(x ** 2 - 5 * x + ___, x))

# Esperado
[2, 3]

# Pista
Dos por tres.
```

# El discriminante

`b² - 4ac` dice cuántas raíces reales hay antes de calcularlas: dos si es
positivo, una si es cero, ninguna si es negativo.

```python
def discriminante(a, b, c):
    return b ** 2 - 4 * a * c

print(discriminante(1, -5, 6))
print(discriminante(1, -4, 4))
print(discriminante(1, 0, 1))
```

```salida
1
0
-4
```

```ejercicio
# Enunciado
Completa el coeficiente que multiplica al producto de a por c en el discriminante.

# Plantilla
def d(a, b, c):
    return b ** 2 - ___ * a * c

print(d(1, -5, 6))

# Esperado
1

# Pista
Cuatro.
```

# El vértice

El punto más bajo —o más alto— de una parábola está en `x = -b / (2a)`. Es el
valor que responde a «dónde es mínimo» y aparece en cualquier problema de
optimizar.

```python
a, b, c = 1, -5, 6
vertice_x = -b / (2 * a)
print(vertice_x)
print(a * vertice_x ** 2 + b * vertice_x + c)
```

```salida
2.5
-0.25
```

> Nota: Está justo en el punto medio entre las dos raíces, 2 y 3. No es
> casualidad: la parábola es simétrica respecto a su vértice, así que las raíces
> quedan a la misma distancia a cada lado.

```ejercicio
# Enunciado
Completa el denominador de la fórmula del vértice.

# Plantilla
a, b = 1, -5
print(-b / (___ * a))

# Esperado
2.5

# Pista
Dos.
```

# La fórmula general

La solución de `ax² + bx + c = 0` se obtiene de una única fórmula, y se puede
comprobar contra `solve`.

```python
import math

def raices(a, b, c):
    d = b ** 2 - 4 * a * c
    if d < 0:
        return []
    return [(-b + math.sqrt(d)) / (2 * a), (-b - math.sqrt(d)) / (2 * a)]

print(sorted(raices(1, -5, 6)))
print(sp.solve(x ** 2 - 5 * x + 6, x))
```

```salida
[2.0, 3.0]
[2, 3]
```

```ejercicio
# Enunciado
Completa la función que ordena la lista de raíces de menor a mayor.

# Plantilla
print(___([3.0, 2.0]))

# Esperado
[2.0, 3.0]

# Pista
Seis letras: el verbo inglés «ordenar», el que devuelve una lista nueva.
```

# Cierre

Rectas y parábolas: la pendiente, las raíces, el discriminante y el vértice. Con
esto se describe casi todo lo que crece a ritmo constante o tiene un óptimo.

Falta lo que crece cada vez más deprisa, que se comporta de otra manera y es la
última sesión.
