---
numero: 2
titulo: "Producto escalar"
paquetes: ["numpy"]
preludio: |
  import numpy as np
---

# Una operación que devuelve un número

El producto escalar de dos vectores es la suma de los productos de sus
componentes homólogas. El resultado es un escalar, no un vector, y de ahí
procede su nombre.

```python
u = np.array([3.0, 4.0, 0.0])
v = np.array([1.0, 0.0, 2.0])
print(np.dot(u, v))
print(np.sum(u * v))
print(u @ v)
```

```salida
3.0
3.0
3.0
```

> Doc: [numpy.dot](https://numpy.org/doc/stable/reference/generated/numpy.dot.html)

> Nota: Las tres expresiones son equivalentes para vectores unidimensionales. El
> operador `@` está reservado en Python para el producto matricial y resulta
> preferible cuando los operandos pueden ser matrices, porque `np.dot` cambia de
> significado según las dimensiones mientras que `@` mantiene el suyo.

```ejercicio
# Enunciado
Completa la función de NumPy que calcula el producto escalar.

# Plantilla
u = np.array([1.0, 2.0])
v = np.array([3.0, 4.0])
print(np.___(u, v))

# Esperado
11.0

# Pista
Tres letras: «punto» en inglés.
```

# La interpretación geométrica

El producto escalar es igual al producto de las normas por el coseno del ángulo
comprendido. Despejando el coseno se obtiene el ángulo.

```python
u = np.array([3.0, 4.0, 0.0])
v = np.array([1.0, 0.0, 2.0])
coseno = np.dot(u, v) / (np.linalg.norm(u) * np.linalg.norm(v))
print(round(float(coseno), 6))
print(round(float(np.degrees(np.arccos(coseno))), 4))
```

```salida
0.268328
74.4352
```

> Doc: [numpy.arccos](https://numpy.org/doc/stable/reference/generated/numpy.arccos.html)

> Doc: [numpy.degrees](https://numpy.org/doc/stable/reference/generated/numpy.degrees.html)

> Nota: `np.arccos` devuelve radianes y `np.degrees` convierte a grados. El
> error de coma flotante puede producir un coseno ligeramente superior a uno en
> vectores casi paralelos, en cuyo caso `arccos` devuelve `nan`; acotar el valor
> con `np.clip(coseno, -1, 1)` antes de aplicarlo evita ese caso.

```ejercicio
# Enunciado
Completa la función que convierte radianes en grados.

# Plantilla
print(round(float(np.___(np.pi)), 1))

# Esperado
180.0

# Pista
Siete letras: «grados» en inglés.
```

# Ortogonalidad

Dos vectores no nulos son ortogonales cuando su producto escalar es cero, dado
que el coseno de noventa grados es cero.

```python
a = np.array([1.0, 0.0, 0.0])
b = np.array([0.0, 1.0, 0.0])
print(np.dot(a, b))
print(np.isclose(np.dot(a, b), 0.0))
```

```salida
0.0
True
```

> Doc: [numpy.isclose](https://numpy.org/doc/stable/reference/generated/numpy.isclose.html)

> Nota: La comprobación se realiza con `np.isclose` y no con el operador de
> igualdad. En vectores obtenidos por cálculo, el producto escalar de dos
> perpendiculares rara vez resulta exactamente cero: devuelve un valor del orden
> de diez elevado a menos dieciséis.

```ejercicio
# Enunciado
Completa el valor con el que se compara el producto escalar para determinar la ortogonalidad.

# Plantilla
a = np.array([1.0, 0.0])
b = np.array([0.0, 1.0])
print(np.isclose(np.dot(a, b), ___))

# Esperado
True

# Pista
Cero coma cero.
```

# Proyección

La proyección de un vector sobre otro es la componente del primero en la
dirección del segundo. Se obtiene multiplicando el versor del segundo por el
producto escalar de ambos con ese mismo versor.

```python
u = np.array([3.0, 4.0, 0.0])
d = np.array([1.0, 0.0, 0.0])
versor = d / np.linalg.norm(d)
escalar = np.dot(u, versor)
proyeccion = escalar * versor
print(escalar)
print(proyeccion)
```

```salida
3.0
[3. 0. 0.]
```

> Doc: [numpy.dot](https://numpy.org/doc/stable/reference/generated/numpy.dot.html)

> Nota: Conviene distinguir la proyección escalar de la vectorial. La primera es
> un número con signo —negativo cuando el ángulo supera los noventa grados— y la
> segunda es el vector correspondiente. Confundirlas produce resultados con las
> unidades equivocadas en cualquier cálculo de trabajo o de flujo.

```ejercicio
# Enunciado
Completa el producto que convierte la proyección escalar en el vector proyección.

# Plantilla
versor = np.array([1.0, 0.0])
escalar = 3.0
print(escalar ___ versor)

# Esperado
[3. 0.]

# Pista
Un asterisco.
```

# Descomposición en componentes

Todo vector se descompone en la suma de su proyección sobre una dirección y una
componente ortogonal a ella.

```python
u = np.array([3.0, 4.0, 0.0])
d = np.array([1.0, 0.0, 0.0])
versor = d / np.linalg.norm(d)
paralela = np.dot(u, versor) * versor
perpendicular = u - paralela
print(paralela, perpendicular)
print(np.isclose(np.dot(perpendicular, d), 0.0))
print(np.allclose(paralela + perpendicular, u))
```

```salida
[3. 0. 0.] [0. 4. 0.]
True
True
```

> Doc: [numpy.allclose](https://numpy.org/doc/stable/reference/generated/numpy.allclose.html)

> Nota: Las dos últimas líneas comprueban la construcción: la componente
> perpendicular es ortogonal a la dirección, y la suma reconstruye el vector
> original. Verificar una descomposición mediante sus propiedades resulta más
> fiable que inspeccionar las componentes obtenidas.

```ejercicio
# Enunciado
Completa la resta que produce la componente perpendicular a la dirección.

# Plantilla
u = np.array([3.0, 4.0])
paralela = np.array([3.0, 0.0])
print(u ___ paralela)

# Esperado
[0. 4.]

# Pista
Un guion, el signo de restar.
```

# El trabajo de una fuerza constante

El trabajo realizado por una fuerza constante a lo largo de un desplazamiento
rectilíneo es el producto escalar de ambos vectores.

```python
fuerza = np.array([10.0, 0.0, 0.0])
desplazamiento = np.array([3.0, 4.0, 0.0])
print(np.dot(fuerza, desplazamiento))
```

```salida
30.0
```

> Doc: [numpy.dot](https://numpy.org/doc/stable/reference/generated/numpy.dot.html)

> Nota: Solo la componente de la fuerza paralela al desplazamiento contribuye al
> trabajo. Una fuerza perpendicular produce un trabajo nulo por grande que sea su
> módulo, lo que explica que sostener un peso sin desplazarlo no realice trabajo
> en el sentido físico del término.

```ejercicio
# Enunciado
Completa la componente del desplazamiento que contribuye al trabajo de una fuerza dirigida según el primer eje.

# Plantilla
fuerza = np.array([10.0, 0.0])
desplazamiento = np.array([___, 4.0])
print(np.dot(fuerza, desplazamiento))

# Esperado
30.0

# Pista
Tres coma cero.
```

# Cierre

El producto escalar relaciona dos vectores mediante un número que codifica sus
normas y el ángulo comprendido. De ahí se derivan la determinación del ángulo,
la comprobación de ortogonalidad, la proyección y el trabajo de una fuerza.

La sesión siguiente introduce la operación que devuelve un vector perpendicular
a los dos operandos.
