---
numero: 3
titulo: "Embeddings: de ids a vectores"
---

# Una fila por token

Una matriz de embeddings tiene una fila por token del vocabulario y una columna por componente de la representación. Buscar un token consiste en seleccionar una fila, no en multiplicar todavía por una secuencia completa.

```python
embeddings = np.array([
    [0.0, 0.0, 0.0],
    [1.0, 0.0, 0.0],
    [0.0, 1.0, 0.0],
    [0.0, 0.0, 1.0],
])
ids = np.array([1, 3, 2])
representaciones = embeddings[ids]
print(representaciones.shape)
print(representaciones[1])
```

```salida
(3, 3)
[0. 0. 1.]
```

> Doc: [Indexación de arreglos en NumPy](https://numpy.org/doc/stable/user/basics.indexing.html)

# Escalar la representación inicial

El Transformer original multiplica los embeddings por la raíz cuadrada de `d_model` antes de sumarlos con la codificación posicional.[1] El factor mantiene una escala compatible con la señal posicional y con las proyecciones posteriores.

```python
d_model = 4
embedding = np.array([0.5, -1.0, 0.25, 2.0])
escalado = embedding * np.sqrt(d_model)
print(escalado)
```

```salida
[ 1.  -2.   0.5  4. ]
```

> Nota: `d_model` es la dimensión de representación del modelo, no el tamaño del vocabulario ni la longitud de la secuencia.

# Comparar representaciones con producto escalar

El producto escalar mide una compatibilidad simple entre dos vectores. En una tabla entrenada, tokens que aparecen en contextos parecidos pueden adquirir direcciones relacionadas, aunque el producto escalar no sea por sí mismo una distancia semántica completa.

```python
primero = np.array([1.0, 0.0, 1.0])
segundo = np.array([0.5, 2.0, 0.5])
print(np.dot(primero, segundo))
```

```salida
1.0
```

> Doc: [numpy.dot](https://numpy.org/doc/stable/reference/generated/numpy.dot.html)

```ejercicio
# Enunciado
Completa la función que calcula el producto escalar entre dos embeddings.

# Plantilla
a = np.array([1.0, 2.0])
b = np.array([3.0, 4.0])
print(np.___(a, b))

# Esperado
11.0

# Pista
Tres letras: punto en inglés.
```

# Cierre

El embedding aporta una representación por token, pero todavía no distingue dos apariciones del mismo token en posiciones diferentes. La sesión siguiente añade esa información de posición.

[1] En el modelo base del artículo, `d_model = 512` y los embeddings se multiplican por `sqrt(d_model)`.
