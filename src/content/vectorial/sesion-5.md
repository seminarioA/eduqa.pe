---
numero: 5
titulo: "Longitud de arco y curvatura"
paquetes: ["numpy", "sympy"]
preludio: |
  import numpy as np
  import sympy as sp
  t = sp.Symbol("t", real=True)
---

# Medir lo recorrido

La longitud de una curva entre dos valores del parámetro es la integral de la
rapidez en ese intervalo. La justificación es la misma que en el movimiento
rectilíneo: la distancia recorrida es la integral de la rapidez respecto del
tiempo.

```python
r = sp.Matrix([sp.cos(t), sp.sin(t), t])
v = sp.diff(r, t)
rapidez = sp.simplify(sp.sqrt(v.dot(v)))
longitud = sp.integrate(rapidez, (t, 0, 2 * sp.pi))
print(rapidez)
print(longitud)
print(round(float(longitud), 6))
```

```salida
sqrt(2)
2*sqrt(2)*pi
8.885766
```

> Doc: [sympy.integrate](https://docs.sympy.org/latest/modules/integrals/integrals.html)

> Nota: Una vuelta completa de esta hélice mide dos pi por raíz de dos. El
> resultado se expresa de forma exacta, sin decimales, porque SymPy opera de
> manera simbólica; `float` produce la aproximación numérica cuando se requiere.

```ejercicio
# Enunciado
Completa la función de SymPy que calcula la integral definida.

# Plantilla
print(sp.___(t, (t, 0, 2)))

# Esperado
2

# Pista
Nueve letras: «integrar» en inglés.
```

# La circunferencia como comprobación

Aplicar la definición a una curva de longitud conocida permite verificar el
procedimiento.

```python
circunferencia = sp.Matrix([3 * sp.cos(t), 3 * sp.sin(t)])
v = sp.diff(circunferencia, t)
rapidez = sp.simplify(sp.sqrt(v.dot(v)))
print(rapidez)
print(sp.integrate(rapidez, (t, 0, 2 * sp.pi)))
```

```salida
3
6*pi
```

> Doc: [sympy.integrate](https://docs.sympy.org/latest/modules/integrals/integrals.html)

> Nota: El resultado es seis pi, que coincide con la fórmula del perímetro de una
> circunferencia de radio tres. Comprobar un método sobre un caso cuyo resultado
> se conoce de antemano constituye la verificación más económica que existe.

```ejercicio
# Enunciado
Completa el radio de la circunferencia cuyo perímetro es seis pi.

# Plantilla
radio = ___
print(2 * radio == 6)

# Esperado
True

# Pista
Tres.
```

# Aproximación numérica

Cuando la integral no admite primitiva elemental, se recurre al cálculo
numérico. La longitud se aproxima sumando las distancias entre puntos
consecutivos.

```python
valores = np.linspace(0, 2 * np.pi, 2000)
puntos = np.column_stack([np.cos(valores), np.sin(valores), valores])
segmentos = np.diff(puntos, axis=0)
longitud = np.sum(np.linalg.norm(segmentos, axis=1))
print(round(float(longitud), 6))
print(round(float(2 * np.pi * np.sqrt(2)), 6))
```

```salida
8.885764
8.885766
```

> Doc: [numpy.diff](https://numpy.org/doc/stable/reference/generated/numpy.diff.html)

> Doc: [numpy.column_stack](https://numpy.org/doc/stable/reference/generated/numpy.column_stack.html)

> Nota: La aproximación por segmentos rectilíneos siempre subestima la longitud
> de una curva, dado que la recta es el camino más corto entre dos puntos.
> Aumentar el número de puntos reduce la diferencia, que aquí aparece en el sexto
> decimal.

```ejercicio
# Enunciado
Completa la función de NumPy que calcula las diferencias entre elementos consecutivos.

# Plantilla
a = np.array([[0.0, 0.0], [3.0, 4.0]])
print(np.___(a, axis=0))

# Esperado
[[3. 4.]]

# Pista
Cuatro letras: «diferencia» abreviado.
```

# La curvatura

La curvatura mide cuánto se aparta una curva de una recta en cada punto. Para
una curva del espacio se calcula mediante el módulo del producto vectorial de la
velocidad por la aceleración, dividido entre el cubo de la rapidez.

```python
r = sp.Matrix([sp.cos(t), sp.sin(t), t])
v = sp.diff(r, t)
a = sp.diff(r, t, 2)
numerador = v.cross(a).norm()
curvatura = sp.simplify(numerador / v.norm()**3)
print(curvatura)
```

```salida
1/2
```

> Doc: [Matrices en SymPy](https://docs.sympy.org/latest/modules/matrices/matrices.html)

> Nota: La curvatura de esta hélice es constante e igual a un medio, lo que
> corresponde a su regularidad: la curva se dobla igual en todos sus puntos. Una
> recta tiene curvatura nula y una circunferencia de radio erre tiene curvatura
> igual a uno partido por erre.

```ejercicio
# Enunciado
Completa el exponente al que se eleva la rapidez en el denominador de la curvatura.

# Plantilla
v_norma = 2
print(v_norma ** ___ == 8)

# Esperado
True

# Pista
Tres.
```

# El radio de curvatura

El inverso de la curvatura es el radio de la circunferencia que mejor se ajusta
a la curva en ese punto.

```python
curvatura = sp.Rational(1, 2)
print(1 / curvatura)
```

```salida
2
```

> Doc: [sympy.Rational](https://docs.sympy.org/latest/modules/core.html#sympy.core.numbers.Rational)

```ejercicio
# Enunciado
Completa la clase de SymPy que representa una fracción exacta.

# Plantilla
print(sp.___(1, 2) + sp.Rational(1, 2))

# Esperado
1

# Pista
Ocho letras: «racional» en inglés, con mayúscula inicial.
```

# Cierre

La longitud de arco es la integral de la rapidez y admite tanto cálculo
simbólico como aproximación numérica por segmentos. La curvatura mide el
apartamiento respecto de una recta y su inverso proporciona el radio de la
circunferencia osculatriz.

La sesión siguiente abandona las curvas y pasa a las funciones definidas sobre
regiones del espacio.
