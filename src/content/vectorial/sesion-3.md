---
numero: 3
titulo: "Producto vectorial"
paquetes: ["numpy"]
preludio: |
  import numpy as np
---

# Una operación que devuelve un vector

El producto vectorial de dos vectores del espacio tridimensional es un tercer
vector perpendicular a ambos, cuyo módulo es igual al área del paralelogramo que
determinan.

```python
u = np.array([3.0, 4.0, 0.0])
v = np.array([1.0, 0.0, 2.0])
w = np.cross(u, v)
print(w)
```

```salida
[ 8. -6. -4.]
```

> Doc: [numpy.cross](https://numpy.org/doc/stable/reference/generated/numpy.cross.html)

> Nota: A diferencia del producto escalar, el vectorial solo está definido en
> tres dimensiones —y, con otro significado, en siete—. En dos dimensiones NumPy
> admitía la operación devolviendo un escalar, comportamiento que quedó obsoleto
> en NumPy 2.0 en favor de operar con vectores tridimensionales de tercera
> componente nula.

```ejercicio
# Enunciado
Completa la función de NumPy que calcula el producto vectorial.

# Plantilla
u = np.array([1.0, 0.0, 0.0])
v = np.array([0.0, 1.0, 0.0])
print(np.___(u, v))

# Esperado
[0. 0. 1.]

# Pista
Cinco letras: «cruz» en inglés.
```

# Perpendicularidad

El resultado es ortogonal a los dos operandos, lo que se comprueba mediante el
producto escalar.

```python
u = np.array([3.0, 4.0, 0.0])
v = np.array([1.0, 0.0, 2.0])
w = np.cross(u, v)
print(np.isclose(np.dot(w, u), 0.0), np.isclose(np.dot(w, v), 0.0))
```

```salida
True True
```

> Doc: [numpy.isclose](https://numpy.org/doc/stable/reference/generated/numpy.isclose.html)

```ejercicio
# Enunciado
Completa la función que comprueba que el producto escalar es nulo dentro de la tolerancia.

# Plantilla
w = np.array([0.0, 0.0, 1.0])
u = np.array([1.0, 0.0, 0.0])
print(np.___(np.dot(w, u), 0.0))

# Esperado
True

# Pista
Siete letras: «es cercano» en inglés, sin espacio.
```

# El orden altera el resultado

El producto vectorial es anticonmutativo: invertir los operandos invierte el
sentido del resultado.

```python
u = np.array([3.0, 4.0, 0.0])
v = np.array([1.0, 0.0, 2.0])
print(np.cross(u, v))
print(np.cross(v, u))
print(np.allclose(np.cross(u, v), -np.cross(v, u)))
```

```salida
[ 8. -6. -4.]
[-8.  6.  4.]
True
```

> Doc: [numpy.cross](https://numpy.org/doc/stable/reference/generated/numpy.cross.html)

> Nota: Esta propiedad distingue el producto vectorial del escalar, que sí es
> conmutativo. En las aplicaciones donde el resultado determina una orientación
> —la normal de una superficie, el momento de una fuerza— invertir el orden
> invierte el sentido físico del resultado.

```ejercicio
# Enunciado
Completa el signo que relaciona el producto vectorial con el de orden invertido.

# Plantilla
u = np.array([1.0, 0.0, 0.0])
v = np.array([0.0, 1.0, 0.0])
print(np.allclose(np.cross(u, v), ___np.cross(v, u)))

# Esperado
True

# Pista
Un guion, el signo que invierte el sentido.
```

# El módulo mide un área

El módulo del producto vectorial es igual al producto de las normas por el seno
del ángulo comprendido, magnitud que coincide con el área del paralelogramo
determinado por ambos vectores.

```python
u = np.array([3.0, 4.0, 0.0])
v = np.array([1.0, 0.0, 2.0])
area_paralelogramo = np.linalg.norm(np.cross(u, v))
print(round(float(area_paralelogramo), 6))
print(round(float(area_paralelogramo / 2), 6))
```

```salida
10.77033
5.385165
```

> Doc: [numpy.linalg.norm](https://numpy.org/doc/stable/reference/generated/numpy.linalg.norm.html)

> Nota: La mitad corresponde al área del triángulo que determinan los dos
> vectores, dado que el paralelogramo se descompone en dos triángulos
> congruentes. Es el procedimiento habitual para calcular el área de un triángulo
> a partir de las coordenadas de sus vértices.

```ejercicio
# Enunciado
Completa el divisor que convierte el área del paralelogramo en la del triángulo.

# Plantilla
area = 10.0
print(area / ___)

# Esperado
5.0

# Pista
Dos.
```

# Vectores paralelos

Si dos vectores son paralelos, el seno del ángulo comprendido es cero y el
producto vectorial resulta nulo.

```python
u = np.array([3.0, 4.0, 0.0])
paralelo = 2 * u
print(np.cross(u, paralelo))
print(np.allclose(np.cross(u, paralelo), np.zeros(3)))
```

```salida
[0. 0. 0.]
True
```

> Doc: [numpy.zeros](https://numpy.org/doc/stable/reference/generated/numpy.zeros.html)

```ejercicio
# Enunciado
Completa la función que construye un vector nulo de tres componentes.

# Plantilla
print(np.___(3))

# Esperado
[0. 0. 0.]

# Pista
Cinco letras: «ceros» en inglés.
```

# La normal de un plano

Dados tres puntos no alineados, el producto vectorial de dos de los vectores que
los unen proporciona un vector normal al plano que determinan.

```python
p = np.array([0.0, 0.0, 0.0])
q = np.array([1.0, 0.0, 0.0])
r = np.array([0.0, 1.0, 0.0])
normal = np.cross(q - p, r - p)
print(normal)
print(normal / np.linalg.norm(normal))
```

```salida
[0. 0. 1.]
[0. 0. 1.]
```

> Doc: [numpy.cross](https://numpy.org/doc/stable/reference/generated/numpy.cross.html)

```ejercicio
# Enunciado
Completa el punto que se resta para construir los dos vectores del plano.

# Plantilla
p = np.array([0.0, 0.0, 0.0])
q = np.array([2.0, 0.0, 0.0])
r = np.array([0.0, 3.0, 0.0])
print(np.cross(q - ___, r - p))

# Esperado
[0. 0. 6.]

# Pista
El punto que se toma como origen.
```

# El producto mixto y el volumen

El producto escalar de un vector por el producto vectorial de otros dos se
denomina producto mixto. Su valor absoluto es el volumen del paralelepípedo que
determinan los tres.

```python
a = np.array([1.0, 0.0, 0.0])
b = np.array([0.0, 2.0, 0.0])
c = np.array([0.0, 0.0, 3.0])
mixto = np.dot(a, np.cross(b, c))
print(mixto)
print(round(float(np.linalg.det(np.array([a, b, c]))), 6))
```

```salida
6.0
6.0
```

> Doc: [numpy.linalg.det](https://numpy.org/doc/stable/reference/generated/numpy.linalg.det.html)

> Nota: El producto mixto coincide con el determinante de la matriz cuyas filas
> son los tres vectores. Un valor nulo indica que los tres son coplanarios, y el
> signo indica la orientación de la terna: positivo si es dextrógira, negativo si
> es levógira.

```ejercicio
# Enunciado
Completa la función que calcula el determinante de una matriz.

# Plantilla
m = np.array([[1.0, 0.0], [0.0, 2.0]])
print(round(float(np.linalg.___(m)), 6))

# Esperado
2.0

# Pista
Tres letras: «determinante» abreviado.
```

# Cierre

El producto vectorial devuelve un vector perpendicular a los operandos, cuyo
módulo mide el área del paralelogramo que determinan. De él se obtienen la
normal de un plano, el área de un triángulo y, mediante el producto mixto, el
volumen de un paralelepípedo.

La sesión siguiente aplica estas operaciones a vectores que dependen de un
parámetro.
