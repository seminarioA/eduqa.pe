---
numero: 6
titulo: "Campos escalares y gradiente"
paquetes: ["numpy", "sympy"]
preludio: |
  import numpy as np
  import sympy as sp
  x, y, z = sp.symbols("x y z", real=True)
---

# Una magnitud en cada punto

Un campo escalar asigna un número a cada punto de una región. La temperatura de
una habitación, la presión de un fluido o la altitud de un terreno constituyen
ejemplos.

```python
f = x**2 + y**2
print(f)
print(f.subs({x: 3, y: 4}))
```

```salida
x**2 + y**2
25
```

> Doc: [sympy.symbols](https://docs.sympy.org/latest/modules/core.html#sympy.core.symbol.symbols)

```ejercicio
# Enunciado
Completa el método que evalúa el campo en un punto mediante un diccionario.

# Plantilla
f = x**2 + y**2
print(f.___({x: 1, y: 2}))

# Esperado
5

# Pista
Cuatro letras: la abreviatura inglesa de «sustituir».
```

# Las derivadas parciales

La derivada parcial respecto de una variable mide la variación del campo cuando
solo esa variable se modifica y las restantes permanecen constantes.

```python
f = x**2 * y + z
print(sp.diff(f, x))
print(sp.diff(f, y))
print(sp.diff(f, z))
```

```salida
2*x*y
x**2
1
```

> Doc: [sympy.diff](https://docs.sympy.org/latest/modules/core.html#sympy.core.function.diff)

```ejercicio
# Enunciado
Completa la variable respecto de la cual se deriva para obtener el término independiente de z.

# Plantilla
f = x**2 * y + z
print(sp.diff(f, ___))

# Esperado
1

# Pista
La tercera variable.
```

# El gradiente

El gradiente reúne las tres derivadas parciales en un vector. Su dirección
indica hacia dónde el campo crece con mayor rapidez, y su norma cuánto.

```python
f = x**2 * y + z
gradiente = sp.Matrix([sp.diff(f, v) for v in (x, y, z)])
print(gradiente.T)
print(gradiente.subs({x: 1, y: 2, z: 0}).T)
```

```salida
Matrix([[2*x*y, x**2, 1]])
Matrix([[4, 1, 1]])
```

> Doc: [Campos en SymPy](https://docs.sympy.org/latest/modules/vector/fields.html)

> Nota: El gradiente de un campo escalar es un campo vectorial: a cada punto le
> corresponde un vector distinto. La afirmación de que señala la dirección de
> máximo crecimiento se demuestra en el apartado siguiente mediante la derivada
> direccional.

```ejercicio
# Enunciado
Completa la clase de SymPy con la que se construye el vector gradiente.

# Plantilla
g = sp.___([1, 2, 3])
print(g.T)

# Esperado
Matrix([[1, 2, 3]])

# Pista
Seis letras: «matriz» en inglés, con mayúscula inicial.
```

# La derivada direccional

La derivada direccional mide la variación del campo en una dirección
determinada. Es igual al producto escalar del gradiente por el versor de esa
dirección.

```python
f = x**2 * y + z
gradiente = sp.Matrix([sp.diff(f, v) for v in (x, y, z)])
g0 = gradiente.subs({x: 1, y: 2, z: 0})
direccion = sp.Matrix([1, 0, 0])
versor = direccion / direccion.norm()
print(g0.dot(versor))
print(g0.norm())
```

```salida
4
3*sqrt(2)
```

> Doc: [Matrices en SymPy](https://docs.sympy.org/latest/modules/matrices/matrices.html)

> Nota: Compárense los dos números. La derivada en la dirección del primer eje
> vale cuatro; la norma del gradiente vale la raíz de dieciocho, que es mayor.
> Esa desigualdad se cumple siempre, dado que el producto escalar por un versor
> alcanza su máximo cuando ambos vectores son paralelos, y ese máximo es
> precisamente la norma del gradiente.

```ejercicio
# Enunciado
Completa el método que calcula la norma de un vector de SymPy.

# Plantilla
g = sp.Matrix([3, 4])
print(g.___())

# Esperado
5

# Pista
Cuatro letras: «norma» en inglés.
```

# Ortogonalidad respecto de las curvas de nivel

Una curva de nivel reúne los puntos donde el campo toma el mismo valor. El
gradiente es ortogonal a ella en cada punto.

```python
f = x**2 + y**2
gradiente = sp.Matrix([sp.diff(f, v) for v in (x, y)])
punto = {x: 1, y: 1}
g = gradiente.subs(punto)
tangente = sp.Matrix([-1, 1])
print(g.T)
print(g.dot(tangente))
```

```salida
Matrix([[2, 2]])
0
```

> Doc: [sympy.diff](https://docs.sympy.org/latest/modules/core.html#sympy.core.function.diff)

> Nota: La curva de nivel de este campo por el punto considerado es una
> circunferencia, cuya tangente en ese punto tiene la dirección indicada. El
> producto escalar resulta nulo, lo que confirma la ortogonalidad. De esta
> propiedad procede la interpretación del gradiente en un mapa topográfico: señala
> la línea de máxima pendiente, perpendicular a las curvas de nivel.

```ejercicio
# Enunciado
Completa el valor del producto escalar entre el gradiente y la tangente a la curva de nivel.

# Plantilla
g = sp.Matrix([2, 2])
tangente = sp.Matrix([-1, 1])
print(g.dot(tangente) == ___)

# Esperado
True

# Pista
Cero.
```

# Gradiente numérico

Cuando el campo se conoce mediante valores tabulados y no mediante una
expresión, `numpy.gradient` lo aproxima por diferencias finitas.

```python
malla_x, malla_y = np.meshgrid(np.linspace(-2, 2, 5), np.linspace(-2, 2, 5), indexing="ij")
campo = malla_x**2 + malla_y**2
gy, gx = np.gradient(campo, 1.0, 1.0)
print(np.round(gx[2], 4))
print(np.round(gy[:, 2], 4))
```

```salida
[-3. -2.  0.  2.  3.]
[-3. -2.  0.  2.  3.]
```

> Doc: [numpy.gradient](https://numpy.org/doc/stable/reference/generated/numpy.gradient.html)

> Doc: [numpy.meshgrid](https://numpy.org/doc/stable/reference/generated/numpy.meshgrid.html)

> Nota: `np.gradient` devuelve una componente por cada eje del arreglo, en el
> orden de sus dimensiones. El argumento `indexing="ij"` de `meshgrid` hace que
> el primer índice corresponda a la primera variable; con el valor por omisión,
> `"xy"`, los dos primeros ejes aparecen intercambiados, lo que constituye una
> fuente frecuente de confusión.

```ejercicio
# Enunciado
Completa el valor de indexing que hace corresponder el primer índice con la primera variable.

# Plantilla
a, b = np.meshgrid([0, 1], [0, 1], indexing="___")
print(a.shape)

# Esperado
(2, 2)

# Pista
Dos letras: i y j.
```

# Cierre

Un campo escalar asigna un número a cada punto; sus derivadas parciales miden la
variación respecto de cada variable y el gradiente las reúne en un vector que
señala la dirección de máximo crecimiento y resulta ortogonal a las curvas de
nivel.

La sesión siguiente trata los campos que asignan un vector a cada punto.
