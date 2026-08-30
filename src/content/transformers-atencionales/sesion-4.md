---
numero: 4
titulo: "Codificación posicional sinusoidal"
---

# La atención necesita posición

La autoatención no impone un orden por sí sola: si se permutan las filas de entrada y se aplican las mismas operaciones, la relación entre filas se permuta de forma equivalente. Para que el modelo distinga posiciones, el Transformer suma una codificación posicional al embedding.[1]

# Seno y coseno por dimensión

La codificación original alterna senos y cosenos de distintas frecuencias. `pos` identifica la posición y `i` la pareja de dimensiones. La división usa una progresión geométrica basada en `10000`.

```python
def codificacion_posicional(longitud, d_model):
    posiciones = np.arange(longitud)[:, None]
    indices = np.arange(d_model)[None, :]
    frecuencias = 10000 ** (2 * (indices // 2) / d_model)
    angulos = posiciones / frecuencias
    codificacion = np.empty((longitud, d_model))
    codificacion[:, 0::2] = np.sin(angulos[:, 0::2])
    codificacion[:, 1::2] = np.cos(angulos[:, 1::2])
    return codificacion

posiciones = codificacion_posicional(3, 4)
print(posiciones.shape)
print(np.round(posiciones[0], 4))
```

```salida
(3, 4)
[0. 1. 0. 1.]
```

> Doc: [Attention Is All You Need, sección 3.5](https://arxiv.org/abs/1706.03762)

# Sumar dos señales compatibles

El embedding y la codificación posicional tienen la misma forma. La suma conserva una sola matriz de representaciones, pero cada fila contiene información del token y de su posición.

```python
embeddings = np.ones((2, 4))
posiciones = codificacion_posicional(2, 4)
entrada = embeddings + posiciones
print(entrada.shape)
print(np.round(entrada[0], 2))
```

```salida
(2, 4)
[1. 2. 1. 2.]
```

> Nota: La codificación se suma, no se concatena. Concatenarla duplicaría la dimensión y exigiría cambiar todas las matrices de proyección.

```ejercicio
# Enunciado
Completa la operación que integra embeddings y posición sin cambiar la dimensión.

# Plantilla

embeddings = np.zeros((2, 4))
posiciones = np.ones((2, 4))
print((embeddings ___ posiciones).shape)

# Esperado
(2, 4)

# Pista
El operador que combina dos matrices componente a componente.
```

# Cierre

La señal sinusoidal hace explícita la posición sin recurrencia. La sesión siguiente usa esas representaciones para calcular qué posiciones consultan a cuáles.

[1] El artículo también experimentó con embeddings posicionales aprendidos; ambos enfoques produjeron resultados casi idénticos en sus pruebas.
