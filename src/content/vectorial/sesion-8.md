---
numero: 8
titulo: "Integrales de línea"
paquetes: ["numpy", "sympy"]
preludio: |
  import numpy as np
  import sympy as sp
  t, x, y = sp.symbols("t x y", real=True)
---

# Integrar a lo largo de una curva

La integral de línea de un campo vectorial mide el trabajo que ese campo realiza
sobre un punto que recorre una curva. Se calcula sustituyendo la parametrización
en el campo y multiplicando por el vector velocidad.

```python
F = sp.Matrix([y, x])
r = sp.Matrix([sp.cos(t), sp.sin(t)])
v = sp.diff(r, t)
integrando = sp.simplify(F.subs({x: r[0], y: r[1]}).dot(v))
print(integrando)
print(sp.integrate(integrando, (t, 0, sp.pi / 2)))
```

```salida
cos(2*t)
0
```

> Doc: [sympy.integrate](https://docs.sympy.org/latest/modules/integrals/integrals.html)

> Nota: El resultado es cero. El integrando corresponde al coseno del doble del
> parámetro, cuya integral sobre un cuarto de circunferencia se anula. Esa
> cancelación no es casual y se explica en el apartado sobre campos
> conservativos.

```ejercicio
# Enunciado
Completa el método que sustituye las variables del campo por la parametrización.

# Plantilla
F = sp.Matrix([y, x])
print(F.___({x: 1, y: 2}).T)

# Esperado
Matrix([[2, 1]])

# Pista
Cuatro letras: la abreviatura inglesa de «sustituir».
```

# Un caso con resultado no nulo

```python
F = sp.Matrix([-y, x])
r = sp.Matrix([sp.cos(t), sp.sin(t)])
v = sp.diff(r, t)
integrando = sp.simplify(F.subs({x: r[0], y: r[1]}).dot(v))
print(integrando)
print(sp.integrate(integrando, (t, 0, 2 * sp.pi)))
```

```salida
1
2*pi
```

> Doc: [sympy.integrate](https://docs.sympy.org/latest/modules/integrals/integrals.html)

> Nota: El integrando es constante e igual a uno, de modo que la integral sobre
> una vuelta completa vale dos pi. Este campo es el mismo de rotación de la
> sesión anterior, cuyo rotacional no era nulo.

```ejercicio
# Enunciado
Completa el límite superior de integración que corresponde a una vuelta completa.

# Plantilla
print(sp.integrate(1, (t, 0, ___ * sp.pi)))

# Esperado
2*pi

# Pista
Dos.
```

# Campos conservativos

Un campo es conservativo cuando procede del gradiente de un campo escalar,
denominado potencial. En un campo de este tipo, la integral de línea depende
únicamente de los extremos y no del camino recorrido.

```python
F = sp.Matrix([y, x])
print(sp.diff(F[0], y) - sp.diff(F[1], x))
G = sp.Matrix([-y, x])
print(sp.diff(G[0], y) - sp.diff(G[1], x))
```

```salida
0
-2
```

> Doc: [sympy.diff](https://docs.sympy.org/latest/modules/core.html#sympy.core.function.diff)

> Nota: La expresión calculada es el rotacional en dos dimensiones. Se anula para
> el primer campo y no para el segundo, lo que confirma que el primero es
> conservativo y el segundo no. En una región simplemente conexa esta condición
> es suficiente; en una región con agujeros solo es necesaria.

```ejercicio
# Enunciado
Completa la resta de derivadas parciales que se anula en un campo conservativo del plano.

# Plantilla
F = sp.Matrix([y, x])
print(sp.diff(F[0], y) ___ sp.diff(F[1], x))

# Esperado
0

# Pista
Un guion, el signo de restar.
```

# Encontrar el potencial

Si el campo es conservativo, integrar su primera componente respecto de la
primera variable proporciona el potencial, salvo una función de las restantes.

```python
F = sp.Matrix([y, x])
potencial = sp.integrate(F[0], x)
print(potencial)
print(sp.simplify(sp.diff(potencial, y) - F[1]))
```

```salida
x*y
0
```

> Doc: [sympy.integrate](https://docs.sympy.org/latest/modules/integrals/integrals.html)

> Nota: La segunda línea comprueba que la derivada del potencial respecto de la
> segunda variable reproduce la segunda componente del campo. Al anularse, la
> función de integración pendiente es constante y el potencial obtenido es
> correcto.

```ejercicio
# Enunciado
Completa la variable respecto de la cual se integra la primera componente.

# Plantilla
F = sp.Matrix([y, x])
print(sp.integrate(F[0], ___))

# Esperado
x*y

# Pista
La primera variable.
```

# La independencia del camino

En un campo conservativo, la integral entre dos puntos coincide con la
diferencia de potencial, cualquiera que sea la curva empleada.

```python
potencial = x * y
inicio, final = {x: 0, y: 0}, {x: 1, y: 1}
print(potencial.subs(final) - potencial.subs(inicio))

recta = sp.Matrix([t, t])
F = sp.Matrix([y, x])
v = sp.diff(recta, t)
integrando = F.subs({x: recta[0], y: recta[1]}).dot(v)
print(sp.integrate(integrando, (t, 0, 1)))
```

```salida
1
1
```

> Doc: [sympy.integrate](https://docs.sympy.org/latest/modules/integrals/integrals.html)

> Nota: Ambos procedimientos producen uno. El primero requiere únicamente
> evaluar el potencial en los extremos; el segundo exige parametrizar e integrar.
> Reconocer que un campo es conservativo evita ese trabajo.

```ejercicio
# Enunciado
Completa el valor del potencial en el punto final menos su valor en el inicial.

# Plantilla
potencial = x * y
print(potencial.subs({x: 1, y: 1}) - potencial.subs({x: 0, y: 0}) == ___)

# Esperado
True

# Pista
Uno.
```

# Aproximación numérica

La integral de línea admite cálculo numérico evaluando el campo en puntos de la
curva y sumando su producto escalar por cada segmento.

```python
valores = np.linspace(0, 2 * np.pi, 20000)
puntos = np.column_stack([np.cos(valores), np.sin(valores)])
campo = np.column_stack([-puntos[:, 1], puntos[:, 0]])
segmentos = np.diff(puntos, axis=0)
trabajo = np.sum(np.sum(campo[:-1] * segmentos, axis=1))
print(round(float(trabajo), 4))
print(round(float(2 * np.pi), 4))
```

```salida
6.2832
6.2832
```

> Doc: [numpy.diff](https://numpy.org/doc/stable/reference/generated/numpy.diff.html)

> Nota: El resultado numérico se aproxima al valor exacto obtenido de forma
> simbólica. La diferencia procede de aproximar la circunferencia mediante una
> poligonal, y disminuye al aumentar el número de puntos.

```ejercicio
# Enunciado
Completa el eje sobre el que se suma para obtener el producto escalar de cada par de vectores.

# Plantilla
a = np.array([[1.0, 2.0], [3.0, 4.0]])
b = np.array([[1.0, 0.0], [0.0, 1.0]])
print(np.sum(a * b, axis=___))

# Esperado
[1. 4.]

# Pista
Uno.
```

# Cierre

La integral de línea mide el trabajo de un campo a lo largo de una curva. Los
campos conservativos proceden de un potencial, tienen rotacional nulo y su
integral depende solo de los extremos.

La última sesión relaciona la integral a lo largo de una curva cerrada con una
integral sobre la región que encierra.
