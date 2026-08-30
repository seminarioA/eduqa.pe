---
numero: 6
titulo: "Atención producto punto escalada"
---

# Consultas, claves y valores

Una función de atención recibe una consulta (`Q`, query), un conjunto de claves (`K`, keys) y valores (`V`, values). La consulta se compara con cada clave; los pesos resultantes mezclan los valores correspondientes.

![Atención producto punto escalada](/cursos/transformers-atencionales/imagenes/figura-2-atencion-escalada.png)

> Doc: [Attention Is All You Need, sección 3.2.1](https://arxiv.org/abs/1706.03762)

# Calcular las compatibilidades

Si `Q` tiene una fila por consulta y `K` una fila por clave, `Q @ K.T` produce una matriz de compatibilidades. La transpuesta convierte cada clave en una columna para que el producto compare cada par.

```python
q = np.array([[1.0, 0.0], [0.0, 1.0]])
k = np.array([[1.0, 0.0], [1.0, 1.0]])
compatibilidades = q @ k.T
print(compatibilidades)
```

```salida
[[1. 1.]
 [0. 1.]]
```

> Nota: `@` es el operador de multiplicación matricial. `*` multiplica componente a componente y no calcula las compatibilidades de atención.

# Normalizar con softmax

Softmax transforma una fila de puntuaciones en pesos no negativos cuya suma es uno. Se resta el máximo antes de aplicar la exponencial para evitar desbordamientos numéricos.

```python
def softmax(fila):
    estable = fila - np.max(fila)
    exp = np.exp(estable)
    return exp / exp.sum()

pesos = softmax(np.array([1.0, 2.0]))
print(np.round(pesos, 4))
print(np.round(pesos.sum(), 4))
```

```salida
[0.2689 0.7311]
1.0
```

> Doc: [numpy.exp](https://numpy.org/doc/stable/reference/generated/numpy.exp.html)

# Mezclar los valores

La multiplicación `softmax(QK.T) @ V` calcula una combinación ponderada de los valores. Cada fila de salida corresponde a una consulta y conserva la dimensión de `V`.

```python
q = np.array([[1.0, 0.0]])
k = np.array([[1.0, 0.0], [0.0, 1.0]])
v = np.array([[10.0, 0.0], [0.0, 20.0]])
pesos = np.vstack([softmax(q[0] @ k.T)])
print(np.round(pesos @ v, 4))
```

```salida
[[7.3106 5.3788]]
```

```ejercicio
# Enunciado
Completa la transpuesta de las claves para comparar cada consulta con cada clave.

# Plantilla

q = np.array([[1.0, 0.0]])
k = np.array([[1.0, 0.0], [0.0, 1.0]])
print((q @ k.___).shape)

# Esperado
(1, 2)

# Pista
Tres letras: transpuesta en inglés.
```

# Cierre

La atención escalada es una composición de producto matricial, escala, softmax y mezcla de valores. La sesión siguiente explica por qué la división por `sqrt(d_k)` es necesaria.
