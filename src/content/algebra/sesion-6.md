---
numero: 6
titulo: "Sistemas de dos ecuaciones"
paquetes: ["sympy"]
preludio: |
  import sympy as sp
  x, y = sp.symbols("x y")
---

# Dos incógnitas necesitan dos datos

Con una sola ecuación y dos letras hay infinitas respuestas: `x + y = 10` se
cumple con `1 y 9`, con `2 y 8` y con cualquier otro par que sume diez.

Para fijar una única respuesta se requieren dos condiciones a la vez. Eso es un
sistema.

```python
print(sp.solve(sp.Eq(x + y, 10), [x, y]))
```

```salida
[(10 - y, y)]
```

> Nota: Con una sola ecuación, SymPy no devuelve un par de números sino una
> relación: `x` escrito en función de `y`. Es la forma correcta de decir «hay
> infinitas, y esta es la regla que cumplen todas». La respuesta llega como una
> lista de tuplas cuando se resuelve una sola ecuación y como un diccionario
> cuando son varias, así que conviene mirar la forma antes de indexar.

```ejercicio
# Enunciado
Completa la lista de incógnitas que se le pide resolver.

# Plantilla
print(sp.solve(sp.Eq(x + y, 10), [x, ___]))

# Esperado
[(10 - y, y)]

# Pista
La otra letra.
```

# Resolver el sistema

Con las dos ecuaciones en una lista, `solve` devuelve el valor de cada
incógnita.

```python
sistema = [sp.Eq(2 * x + y, 5), sp.Eq(x - y, 1)]
print(sp.solve(sistema, [x, y]))
```

```salida
{x: 2, y: 1}
```

```ejercicio
# Enunciado
Completa la segunda ecuación del sistema para que la solución sea x=2, y=1.

# Plantilla
print(sp.solve([sp.Eq(2 * x + y, 5), sp.Eq(x - y, ___)], [x, y]))

# Esperado
{x: 2, y: 1}

# Pista
Dos menos uno.
```

# Sustitución, paso a paso

El método a mano consiste en despejar una letra en una ecuación y meterla en la
otra, que así se queda con una sola incógnita.

```python
primera = sp.Eq(x - y, 1)
despejada = sp.solve(primera, x)[0]
print("x =", despejada)

segunda = sp.Eq(2 * x + y, 5)
con_una_sola = segunda.subs(x, despejada)
print(con_una_sola)
print("y =", sp.solve(con_una_sola, y)[0])
```

```salida
x = y + 1
Eq(3*y + 2, 5)
y = 1
```

```ejercicio
# Enunciado
Completa la letra que se despeja de la primera ecuación para sustituirla en la segunda.

# Plantilla
print(sp.solve(sp.Eq(x - y, 1), ___)[0])

# Esperado
y + 1

# Pista
La primera letra del alfabeto de las incógnitas.
```

# Qué significa geométricamente

Cada ecuación de primer grado con dos incógnitas es una recta. Resolver el
sistema es encontrar dónde se cruzan.

```python
recta1 = sp.solve(sp.Eq(2 * x + y, 5), y)[0]
recta2 = sp.solve(sp.Eq(x - y, 1), y)[0]
print("recta 1: y =", recta1)
print("recta 2: y =", recta2)
print("se cruzan en x =", sp.solve(sp.Eq(recta1, recta2), x)[0])
```

```salida
recta 1: y = 5 - 2*x
recta 2: y = x - 1
se cruzan en x = 2
```

> Nota: Igualar las dos expresiones de `y` es exactamente preguntar «en qué `x`
> las dos rectas están a la misma altura». Ese es el punto de corte, y es la
> solución del sistema.

```ejercicio
# Enunciado
Completa la letra que se despeja para escribir cada ecuación como una recta.

# Plantilla
print(sp.solve(sp.Eq(2 * x + y, 5), ___)[0])

# Esperado
5 - 2*x

# Pista
La segunda letra de las incógnitas.
```

# Rectas paralelas: sin solución

Si las dos rectas tienen la misma inclinación pero distinta altura, no se cortan
nunca y el sistema no tiene solución.

```python
paralelas = [sp.Eq(x + y, 2), sp.Eq(x + y, 5)]
print(sp.solve(paralelas, [x, y]))
print(sp.solve(paralelas, [x, y]) == [])
```

```salida
[]
True
```

```ejercicio
# Enunciado
Completa el término independiente que hace que las dos rectas sean paralelas y no se corten.

# Plantilla
print(sp.solve([sp.Eq(x + y, 2), sp.Eq(x + y, ___)], [x, y]) == [])

# Esperado
True

# Pista
Cualquier número distinto de dos; usa el cinco.
```

# La misma recta: infinitas soluciones

Si una ecuación es la otra multiplicada por un número, describen la misma recta
y todos sus puntos son solución.

```python
iguales = [sp.Eq(x + y, 2), sp.Eq(2 * x + 2 * y, 4)]
print(sp.solve(iguales, [x, y]))
```

```salida
{x: 2 - y}
```

> Nota: Las tres respuestas posibles de un sistema de dos rectas son: un punto,
> ninguno o todos. No hay más casos, y saber cuál es cada uno evita buscar una
> solución única donde no la hay.

```ejercicio
# Enunciado
Completa el número por el que hay que multiplicar la primera ecuación para obtener la segunda.

# Plantilla
print(sp.solve([sp.Eq(x + y, 2), sp.Eq(___ * x + 2 * y, 4)], [x, y]))

# Esperado
{x: 2 - y}

# Pista
Dos.
```

# Un problema de mezcla

Los sistemas aparecen cuando hay dos cantidades desconocidas ligadas por dos
condiciones. Poner nombre a cada una es la mitad del trabajo.

```python
# 30 entradas vendidas entre adultos y niños.
# El adulto paga 20 soles y el niño 8. Se recaudaron 480 soles.
adultos, ninos = sp.symbols("adultos ninos")
sistema = [
    sp.Eq(adultos + ninos, 30),
    sp.Eq(20 * adultos + 8 * ninos, 480),
]
print(sp.solve(sistema, [adultos, ninos]))
```

```salida
{adultos: 20, ninos: 10}
```

```ejercicio
# Enunciado
Completa el total recaudado que hace que la solución sea 20 adultos y 10 niños.

# Plantilla
a, n = sp.symbols("a n")
print(sp.solve([sp.Eq(a + n, 30), sp.Eq(20 * a + 8 * n, ___)], [a, n]))

# Esperado
{a: 20, n: 10}

# Pista
Veinte por veinte más ocho por diez.
```

# Comprobar la solución del sistema

Igual que con una ecuación, la respuesta se sustituye en **todas** las
condiciones originales.

```python
sistema = [sp.Eq(2 * x + y, 5), sp.Eq(x - y, 1)]
solucion = sp.solve(sistema, [x, y])
print(solucion)
print([bool(e.subs(solucion)) for e in sistema])
```

```salida
{x: 2, y: 1}
[True, True]
```

> Nota: Comprobar en una sola ecuación no basta: un error de despeje puede dar
> un par que cumpla una condición y falle la otra. La lista de `True` de arriba
> es la comprobación completa.

```ejercicio
# Enunciado
Completa la función que convierte la comprobación en un valor lógico.

# Plantilla
s = sp.solve([sp.Eq(2 * x + y, 5), sp.Eq(x - y, 1)], [x, y])
print(___(sp.Eq(x - y, 1).subs(s)))

# Esperado
True

# Pista
Cuatro letras: el tipo lógico en inglés.
```

# Cierre

Dos incógnitas necesitan dos condiciones; la solución es el cruce de dos rectas,
y solo hay tres desenlaces posibles: un punto, ninguno o todos.

La sesión siguiente deja las rectas y pasa a las curvas.
