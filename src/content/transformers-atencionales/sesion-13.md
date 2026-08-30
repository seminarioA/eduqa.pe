---
numero: 13
titulo: "Logits, softmax y predicción"
---

# De la representación al vocabulario

La salida del decoder tiene dimensión `d_model`. Una transformación lineal la proyecta al tamaño del vocabulario; sus valores se llaman logits. Softmax convierte cada fila en una distribución de probabilidades.[1]

```python
representacion = np.array([[2.0, 1.0]])
proyeccion = np.array([[1.0, 0.0, -1.0], [0.0, 1.0, 1.0]])
logits = representacion @ proyeccion
print(logits)
```

```salida
[[2. 1. 0.]]
```

# Convertir logits en probabilidades

```python
def softmax_matriz(logits):
    estable = logits - logits.max(axis=-1, keepdims=True)
    exp = np.exp(estable)
    return exp / exp.sum(axis=-1, keepdims=True)

probabilidades = softmax_matriz(np.array([[2.0, 1.0, 0.0]]))
print(np.round(probabilidades, 4))
```

```salida
[[0.6652 0.2447 0.09  ]]
```

> Doc: [numpy.exp](https://numpy.org/doc/stable/reference/generated/numpy.exp.html)

# Elegir el token más probable

`argmax` devuelve el índice del mayor logit o probabilidad. Es una estrategia codiciosa: no explora secuencias alternativas, pero permite inspeccionar el flujo antes de estudiar métodos de decodificación más complejos.

```python
probabilidades = np.array([[0.2, 0.5, 0.3], [0.7, 0.1, 0.2]])
ids_predichos = np.argmax(probabilidades, axis=-1)
print(ids_predichos)
```

```salida
[1 0]
```

> Doc: [numpy.argmax](https://numpy.org/doc/stable/reference/generated/numpy.argmax.html)

```ejercicio
# Enunciado
Completa el eje que selecciona el token más probable en cada posición.

# Plantilla

probabilidades = np.array([[0.2, 0.5, 0.3], [0.7, 0.1, 0.2]])
print(np.argmax(probabilidades, axis=___))

# Esperado
[1 0]

# Pista
Las columnas representan el vocabulario; se busca en la última dimensión.
```

# Cierre

La proyección final produce un logit por token y softmax produce probabilidades. La sesión siguiente usa el token objetivo para calcular la pérdida de entropía cruzada.

[1] El artículo comparte la matriz de pesos entre los embeddings y la transformación lineal previa a softmax.
