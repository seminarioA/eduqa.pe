---
numero: 1
titulo: "Vectores en el espacio"
paquetes: ["numpy"]
preludio: |
  import numpy as np
---

# Magnitudes que requieren dirección

Una temperatura queda determinada por un número. Una velocidad, no: son
necesarios además una dirección y un sentido. Las magnitudes del segundo tipo se
representan mediante vectores, y el cálculo vectorial es el conjunto de
herramientas que permite operar con ellas y derivarlas.

Este curso presupone el álgebra y el cálculo de una variable. Cada resultado se
obtiene por dos caminos: numérico con NumPy y simbólico con SymPy.

# Un vector es una lista ordenada de componentes

En el espacio de tres dimensiones, un vector queda determinado por tres números:
sus proyecciones sobre los ejes.

```python
u = np.array([3.0, 4.0, 0.0])
v = np.array([1.0, 0.0, 2.0])
print(u)
print(u.shape, u.dtype)
```

```salida
[3. 4. 0.]
(3,) float64
```

> Doc: [numpy.array](https://numpy.org/doc/stable/reference/generated/numpy.array.html)

> Nota: `shape` devuelve `(3,)` y no `(3, 1)` ni `(1, 3)`. NumPy distingue un
> arreglo unidimensional de una matriz columna o fila, y esa distinción se
> vuelve relevante al multiplicar por matrices, donde una de las tres formas
> produce un resultado distinto de las otras dos.

```ejercicio
# Enunciado
Completa el atributo que devuelve las dimensiones del arreglo.

# Plantilla
u = np.array([3.0, 4.0, 0.0])
print(u.___)

# Esperado
(3,)

# Pista
Cinco letras: «forma» en inglés.
```

# Suma y producto por un escalar

Las dos operaciones que definen un espacio vectorial se aplican componente a
componente.

```python
u = np.array([3.0, 4.0, 0.0])
v = np.array([1.0, 0.0, 2.0])
print(u + v)
print(2 * u)
print(u - v)
```

```salida
[4. 4. 2.]
[6. 8. 0.]
[ 2.  4. -2.]
```

> Doc: [Operaciones sobre arreglos](https://numpy.org/doc/stable/user/basics.broadcasting.html)

```ejercicio
# Enunciado
Completa el operador que multiplica un vector por un escalar componente a componente.

# Plantilla
u = np.array([1.0, 2.0])
print(3 ___ u)

# Esperado
[3. 6.]

# Pista
Un asterisco.
```

# La norma

La norma euclídea de un vector es la raíz cuadrada de la suma de los cuadrados
de sus componentes, y corresponde a su longitud.

```python
u = np.array([3.0, 4.0, 0.0])
print(np.linalg.norm(u))
print(np.sqrt(np.sum(u**2)))
```

```salida
5.0
5.0
```

> Doc: [numpy.linalg.norm](https://numpy.org/doc/stable/reference/generated/numpy.linalg.norm.html)

> Nota: Las dos expresiones coinciden porque la segunda es la definición y la
> primera su implementación. `np.linalg.norm` es preferible: admite otras normas
> mediante el argumento `ord` y evita el desbordamiento que se produce al elevar
> al cuadrado componentes muy grandes antes de sumarlas.

```ejercicio
# Enunciado
Completa la función que calcula la norma de un vector.

# Plantilla
u = np.array([3.0, 4.0])
print(np.linalg.___(u))

# Esperado
5.0

# Pista
Cuatro letras: «norma» en inglés.
```

# El versor asociado

Dividir un vector entre su norma produce otro de longitud unitaria y la misma
dirección. Se denomina versor o vector unitario.

```python
u = np.array([3.0, 4.0, 0.0])
versor = u / np.linalg.norm(u)
print(versor)
print(np.linalg.norm(versor))
```

```salida
[0.6 0.8 0. ]
1.0
```

> Doc: [numpy.linalg.norm](https://numpy.org/doc/stable/reference/generated/numpy.linalg.norm.html)

> Nota: La operación no está definida para el vector nulo, cuya norma es cero.
> NumPy no interrumpe la ejecución: devuelve `nan` y emite una advertencia, de
> modo que un versor mal calculado se propaga silenciosamente por el resto del
> cálculo hasta que alguien inspecciona el resultado.

```ejercicio
# Enunciado
Completa el operador que divide el vector entre su norma.

# Plantilla
u = np.array([0.0, 5.0])
print(u ___ np.linalg.norm(u))

# Esperado
[0. 1.]

# Pista
Una barra inclinada.
```

# La base canónica

Los tres versores dirigidos según los ejes constituyen la base canónica. Todo
vector se expresa como combinación lineal de ellos.

```python
i = np.array([1.0, 0.0, 0.0])
j = np.array([0.0, 1.0, 0.0])
k = np.array([0.0, 0.0, 1.0])
u = 3 * i + 4 * j + 0 * k
print(u)
print(np.allclose(u, np.array([3.0, 4.0, 0.0])))
```

```salida
[3. 4. 0.]
True
```

> Doc: [numpy.allclose](https://numpy.org/doc/stable/reference/generated/numpy.allclose.html)

> Nota: La comparación se realiza con `np.allclose` y no con el operador de
> igualdad. Los números de coma flotante acumulan error de representación, de
> modo que dos cálculos matemáticamente equivalentes pueden diferir en el último
> dígito. `allclose` admite esa diferencia dentro de una tolerancia.

```ejercicio
# Enunciado
Completa la función que compara dos arreglos admitiendo una tolerancia numérica.

# Plantilla
a = np.array([0.1 + 0.2])
b = np.array([0.3])
print(np.___(a, b))

# Esperado
True

# Pista
Ocho letras: «todos cercanos» en inglés, sin espacio.
```

# Distancia entre dos puntos

La distancia entre dos puntos es la norma del vector que los une.

```python
p = np.array([1.0, 2.0, 3.0])
q = np.array([4.0, 6.0, 3.0])
print(np.linalg.norm(q - p))
```

```salida
5.0
```

> Doc: [numpy.linalg.norm](https://numpy.org/doc/stable/reference/generated/numpy.linalg.norm.html)

```ejercicio
# Enunciado
Completa la resta que produce el vector que va del primer punto al segundo.

# Plantilla
p = np.array([1.0, 1.0])
q = np.array([4.0, 5.0])
print(np.linalg.norm(___ - p))

# Esperado
5.0

# Pista
El punto de llegada.
```

# Vectores en varias dimensiones a la vez

Un arreglo bidimensional representa un conjunto de vectores. El argumento `axis`
determina la dirección a lo largo de la cual se aplica la operación.

```python
vectores = np.array([[3.0, 4.0], [1.0, 0.0], [0.0, 2.0]])
print(np.linalg.norm(vectores, axis=1))
print(vectores.shape)
```

```salida
[5. 1. 2.]
(3, 2)
```

> Doc: [numpy.linalg.norm](https://numpy.org/doc/stable/reference/generated/numpy.linalg.norm.html)

> Nota: Con `axis=1` la norma se calcula por filas y el resultado tiene tres
> elementos; con `axis=0` se calcularía por columnas y tendría dos. Omitir el
> argumento produce un único número, la norma de Frobenius de la matriz
> completa, que no corresponde a ninguna de las dos interpretaciones anteriores.

```ejercicio
# Enunciado
Completa el eje a lo largo del cual se calcula la norma de cada fila.

# Plantilla
v = np.array([[3.0, 4.0], [6.0, 8.0]])
print(np.linalg.norm(v, axis=___))

# Esperado
[ 5. 10.]

# Pista
Uno.
```

# Cierre

Un vector se representa mediante sus componentes; la suma y el producto por un
escalar operan componente a componente; la norma proporciona su longitud y la
división entre ella produce el versor asociado.

La sesión siguiente introduce la primera operación entre dos vectores que
devuelve un escalar.
