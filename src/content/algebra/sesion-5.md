---
numero: 5
titulo: "Ecuaciones de primer grado"
paquetes: ["sympy"]
preludio: |
  import sympy as sp
  x, y = sp.symbols("x y")
---

# Dos igualdades distintas

En Python, `x = 5` es una orden: guarda un cinco. En álgebra, `2x + 6 = 0` es
una pregunta: qué valor de `x` hace cierta esa igualdad.

Son cosas distintas y por eso se escriben distinto. SymPy usa `Eq` para la
igualdad matemática y deja el `=` para la asignación.

```python
ecuacion = sp.Eq(2 * x + 6, 0)
print(ecuacion)
print(type(ecuacion).__name__)
```

```salida
Eq(2*x + 6, 0)
Equality
```

```ejercicio
# Enunciado
Completa la clase que representa una igualdad matemática.

# Plantilla
print(sp.___(2 * x + 6, 0))

# Esperado
Eq(2*x + 6, 0)

# Pista
Dos letras: la abreviatura inglesa de «ecuación».
```

# Resolver

`solve` devuelve la lista de valores que cumplen la igualdad.

```python
print(sp.solve(sp.Eq(2 * x + 6, 0), x))
print(sp.solve(sp.Eq(3 * x, 12), x))
print(sp.solve(sp.Eq(x + 5, x + 5), x))
```

```salida
[-3]
[4]
[]
```

> Nota: La última devuelve `True` en vez de una lista: la igualdad se cumple
> para cualquier `x`, así que no hay una solución sino todas. Es una respuesta
> distinta de la lista vacía, que significaría que no hay ninguna.

```ejercicio
# Enunciado
Completa la función que resuelve una ecuación.

# Plantilla
print(sp.___(sp.Eq(3 * x, 12), x))

# Esperado
[4]

# Pista
Cinco letras: «resolver» en inglés.
```

# Qué significa despejar

Resolver a mano es aplicar la misma operación a los dos lados hasta dejar la
letra sola. Cada paso conserva la igualdad.

```python
# 2x + 6 = 0
print(sp.Eq(2 * x + 6 - 6, 0 - 6))      # restar 6 a los dos lados
print(sp.Eq((2 * x) / 2, (-6) / 2))     # dividir entre 2 los dos lados
print(sp.solve(sp.Eq(2 * x + 6, 0), x))
```

```salida
Eq(2*x, -6)
Eq(x, -3.0)
[-3]
```

```ejercicio
# Enunciado
Completa el número que hay que restar a ambos lados para dejar sola la x.

# Plantilla
print(sp.Eq(2 * x + 6 - ___, 0 - 6))

# Esperado
Eq(2*x, -6)

# Pista
El mismo seis que acompaña a la x.
```

# Comprobar siempre

Una solución se comprueba sustituyéndola en la ecuación original. Es el paso que
más se salta y el que más errores atrapa.

```python
ecuacion = sp.Eq(5 * x - 3, 2 * x + 9)
solucion = sp.solve(ecuacion, x)[0]
print(solucion)
print(ecuacion.subs(x, solucion))
print(ecuacion.lhs.subs(x, solucion), ecuacion.rhs.subs(x, solucion))
```

```salida
4
True
17 17
```

> Nota: `ecuacion.subs(...)` devuelve `True`, que es la comprobación. `lhs` y
> `rhs` son los dos lados de la igualdad —izquierdo y derecho— y sirven para ver
> que ambos dan el mismo número.

```ejercicio
# Enunciado
Completa el atributo que devuelve el lado izquierdo de la ecuación.

# Plantilla
e = sp.Eq(2 * x, 10)
print(e.___)

# Esperado
2*x

# Pista
Tres letras: las iniciales inglesas de «lado izquierdo».
```

# Cuando no hay solución

Si al despejar desaparece la incógnita y queda una igualdad falsa, la ecuación
no tiene solución. `solve` devuelve una lista vacía.

```python
print(sp.solve(sp.Eq(x + 1, x + 2), x))
print(sp.solve(sp.Eq(2 * x, 2 * x), x))
```

```salida
[]
[]
```

> Nota: Lista vacía y `True` son las dos respuestas que no son un número, y
> significan lo contrario: ninguna solución y todas. Confundirlas al programar
> es fácil, porque una lista vacía también es «falsa» en Python.

```ejercicio
# Enunciado
Completa la función que devuelve la cantidad de soluciones encontradas.

# Plantilla
print(___(sp.solve(sp.Eq(x + 1, x + 2), x)))

# Esperado
0

# Pista
Tres letras: la función de Python que mide la longitud.
```

# Ecuaciones con paréntesis y fracciones

No hay caso especial: se expande, se quitan los denominadores y se resuelve.

```python
ecuacion = sp.Eq(3 * (x - 2), (x + 4) / 2)
print(sp.expand(ecuacion.lhs), "=", ecuacion.rhs)
print(sp.solve(ecuacion, x))
```

```salida
3*x - 6 = x/2 + 2
[16/5]
```

```ejercicio
# Enunciado
Completa la función que desarrolla el lado izquierdo antes de resolver.

# Plantilla
e = sp.Eq(3 * (x - 2), 0)
print(sp.___(e.lhs))

# Esperado
3*x - 6

# Pista
Seis letras: «expandir» en inglés.
```

# Despejar una letra de una fórmula

`solve` también sirve para reescribir una fórmula en función de otra letra. Es
lo que se hace cuando se conoce el resultado y falta un dato.

```python
# Área de un rectángulo: A = b * h. Despejar h.
A, b, h = sp.symbols("A b h")
print(sp.solve(sp.Eq(A, b * h), h))
# Celsius a Fahrenheit: F = C * 9/5 + 32. Despejar C.
C, F = sp.symbols("C F")
print(sp.solve(sp.Eq(F, C * sp.Rational(9, 5) + 32), C))
```

```salida
[A/b]
[5*F/9 - 160/9]
```

> Nota: `sp.Rational(9, 5)` escribe la fracción exacta. Si se escribiera `9/5`,
> Python calcularía `1.8` antes de que SymPy lo viera y el resultado saldría con
> decimales en lugar de en fracciones.

```ejercicio
# Enunciado
Completa la letra que se quiere despejar de la fórmula del área.

# Plantilla
A, b, h = sp.symbols("A b h")
print(sp.solve(sp.Eq(A, b * h), ___))

# Esperado
[A/b]

# Pista
La altura.
```

# Un problema contado con palabras

Traducir el enunciado a una ecuación es la parte difícil; resolverla, la fácil.

```python
# Un pantalón y una camisa cuestan 180 soles.
# El pantalón cuesta el doble que la camisa. ¿Cuánto vale cada uno?
camisa = sp.Symbol("camisa")
ecuacion = sp.Eq(camisa + 2 * camisa, 180)
valor = sp.solve(ecuacion, camisa)[0]
print("camisa:", valor)
print("pantalón:", 2 * valor)
```

```salida
camisa: 60
pantalón: 120
```

```ejercicio
# Enunciado
Completa el total al que suman las dos prendas.

# Plantilla
c = sp.Symbol("c")
print(sp.solve(sp.Eq(c + 2 * c, ___), c))

# Esperado
[60]

# Pista
Ciento ochenta.
```

# Cierre

Una ecuación es una pregunta, resolverla es despejar, y la respuesta se
comprueba sustituyendo. También se puede despejar cualquier letra de una
fórmula, que es como se reutiliza una misma relación en los dos sentidos.

Con una incógnita ya está. La sesión siguiente añade otra.
