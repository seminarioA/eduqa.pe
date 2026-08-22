---
numero: 4
titulo: "Curvas parametrizadas"
paquetes: ["numpy", "sympy"]
preludio: |
  import numpy as np
  import sympy as sp
  t = sp.Symbol("t", real=True)
---

# Un vector que depende de un parámetro

Una curva en el espacio se describe mediante una función que asigna a cada valor
de un parámetro un punto, es decir, un vector de posición. El parámetro suele
interpretarse como tiempo.

```python
r = sp.Matrix([sp.cos(t), sp.sin(t), t])
print(r.T)
print(r.subs(t, 0).T)
print(sp.simplify(r.subs(t, sp.pi / 2)).T)
```

```salida
Matrix([[cos(t), sin(t), t]])
Matrix([[1, 0, 0]])
Matrix([[0, 1, pi/2]])
```

> Doc: [Matrices en SymPy](https://docs.sympy.org/latest/modules/matrices/matrices.html)

> Nota: La curva descrita corresponde a una hélice circular: las dos primeras
> componentes recorren una circunferencia y la tercera crece de forma lineal. Se
> emplea `.T` únicamente para imprimirla en una fila y no en una columna.

```ejercicio
# Enunciado
Completa el método que sustituye el parámetro por un valor concreto.

# Plantilla
r = sp.Matrix([sp.cos(t), sp.sin(t)])
print(r.___(t, 0).T)

# Esperado
Matrix([[1, 0]])

# Pista
Cuatro letras: la abreviatura inglesa de «sustituir».
```

# La velocidad es la derivada

Derivando cada componente respecto del parámetro se obtiene el vector velocidad,
tangente a la curva en cada punto.

```python
r = sp.Matrix([sp.cos(t), sp.sin(t), t])
v = sp.diff(r, t)
print(v.T)
print(v.subs(t, 0).T)
```

```salida
Matrix([[-sin(t), cos(t), 1]])
Matrix([[0, 1, 1]])
```

> Doc: [sympy.diff](https://docs.sympy.org/latest/modules/core.html#sympy.core.function.diff)

```ejercicio
# Enunciado
Completa la función de SymPy que deriva respecto del parámetro.

# Plantilla
r = sp.Matrix([t**2, t])
print(sp.___(r, t).T)

# Esperado
Matrix([[2*t, 1]])

# Pista
Cuatro letras: «derivar» abreviado en inglés.
```

# La rapidez es la norma de la velocidad

La velocidad es un vector; su norma es un escalar denominado rapidez.

```python
r = sp.Matrix([sp.cos(t), sp.sin(t), t])
v = sp.diff(r, t)
rapidez = sp.simplify(sp.sqrt(v.dot(v)))
print(rapidez)
```

```salida
sqrt(2)
```

> Doc: [sympy.simplify](https://docs.sympy.org/latest/modules/simplify/simplify.html)

> Nota: El resultado es constante e igual a la raíz de dos, lo que indica que la
> hélice se recorre a rapidez uniforme aunque la dirección cambie en cada
> instante. Rapidez y velocidad no son sinónimos: la primera es un escalar y la
> segunda un vector, y una puede permanecer constante mientras la otra varía.

```ejercicio
# Enunciado
Completa el método que calcula el producto escalar de un vector consigo mismo.

# Plantilla
v = sp.Matrix([3, 4])
print(sp.sqrt(v.___(v)))

# Esperado
5

# Pista
Tres letras: «punto» en inglés.
```

# La aceleración es la segunda derivada

```python
r = sp.Matrix([sp.cos(t), sp.sin(t), t])
a = sp.diff(r, t, 2)
print(a.T)
print(sp.simplify(a.dot(sp.diff(r, t))))
```

```salida
Matrix([[-cos(t), -sin(t), 0]])
0
```

> Doc: [sympy.diff](https://docs.sympy.org/latest/modules/core.html#sympy.core.function.diff)

> Nota: El producto escalar de la aceleración por la velocidad resulta nulo, lo
> que indica que ambas son ortogonales en toda la curva. Esa condición equivale a
> que la rapidez sea constante: la aceleración modifica únicamente la dirección
> del movimiento, no su magnitud.

```ejercicio
# Enunciado
Completa el orden de derivación que produce la aceleración.

# Plantilla
r = sp.Matrix([t**3, t])
print(sp.diff(r, t, ___).T)

# Esperado
Matrix([[6*t, 0]])

# Pista
Dos.
```

# El versor tangente

Dividiendo la velocidad entre la rapidez se obtiene un vector unitario tangente
a la curva.

```python
r = sp.Matrix([sp.cos(t), sp.sin(t), t])
v = sp.diff(r, t)
T = sp.simplify(v / sp.sqrt(v.dot(v)))
print(T.T)
print(sp.simplify(T.dot(T)))
```

```salida
Matrix([[-sqrt(2)*sin(t)/2, sqrt(2)*cos(t)/2, sqrt(2)/2]])
1
```

> Doc: [Matrices en SymPy](https://docs.sympy.org/latest/modules/matrices/matrices.html)

```ejercicio
# Enunciado
Completa el valor del producto escalar de un versor consigo mismo.

# Plantilla
T = sp.Matrix([1, 0])
print(T.dot(T) == ___)

# Esperado
True

# Pista
Uno.
```

# Evaluación numérica de la curva

Para trabajar con valores concretos, `lambdify` convierte una expresión
simbólica en una función que opera sobre arreglos de NumPy.

```python
r = sp.Matrix([sp.cos(t), sp.sin(t), t])
posicion = sp.lambdify(t, r, "numpy")
valores = np.linspace(0, 2 * np.pi, 5)
for valor in valores[:3]:
    print(np.round(np.array(posicion(valor)).flatten(), 4))
```

```salida
[1. 0. 0.]
[0.     1.     1.5708]
[-1.      0.      3.1416]
```

> Doc: [sympy.lambdify](https://docs.sympy.org/latest/modules/utilities/lambdify.html)

> Doc: [numpy.linspace](https://numpy.org/doc/stable/reference/generated/numpy.linspace.html)

> Nota: `lambdify` traduce la expresión a código de Python que emplea las
> funciones de NumPy, por lo que resulta considerablemente más rápida que
> sustituir el símbolo en cada punto. Es el procedimiento habitual para pasar del
> cálculo simbólico al numérico.

```ejercicio
# Enunciado
Completa la función de SymPy que convierte una expresión en una función evaluable.

# Plantilla
f = sp.___(t, t**2, "numpy")
print(f(3))

# Esperado
9

# Pista
Ocho letras: «lambda» seguido de dos letras más.
```

# Cierre

Una curva parametrizada asigna un vector de posición a cada valor del parámetro.
Su primera derivada es la velocidad, su norma la rapidez y su segunda derivada
la aceleración; el cociente de la velocidad entre la rapidez proporciona el
versor tangente.

La sesión siguiente emplea la rapidez para medir la longitud recorrida.
