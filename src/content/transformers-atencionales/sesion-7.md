---
numero: 7
titulo: "Escala y máscara causal"
---

# Por qué se escala el producto

Si la dimensión de las claves aumenta y sus componentes tienen varianza cercana a uno, el producto punto también aumenta en magnitud. Softmax recibe entonces valores extremos y sus gradientes se vuelven muy pequeños. El artículo divide por `sqrt(d_k)` antes de normalizar.[1]

```python
d_k = 4
puntuaciones = np.array([[2.0, 4.0]])
escaladas = puntuaciones / np.sqrt(d_k)
print(escaladas)
```

```salida
[[1. 2.]]
```

> Doc: [Attention Is All You Need, ecuación 1](https://arxiv.org/abs/1706.03762)

# Construir la máscara causal

Durante el entrenamiento del decoder, la posición `i` solo puede consultar posiciones menores o iguales que `i`. Una matriz booleana triangular inferior expresa las conexiones permitidas.

```python
longitud = 4
mascara = np.tril(np.ones((longitud, longitud), dtype=bool))
print(mascara.astype(int))
```

```salida
[[1 0 0 0]
 [1 1 0 0]
 [1 1 1 0]
 [1 1 1 1]]
```

> Doc: [numpy.tril](https://numpy.org/doc/stable/reference/generated/numpy.tril.html)

# Anular conexiones prohibidas

Antes de softmax, una puntuación prohibida se reemplaza por `-inf`. Su exponencial es cero y no recibe peso. La operación se aplica por fila, de modo que cada posición mantiene solo su prefijo.

```python
puntuaciones = np.array([[1.0, 2.0, 3.0]])
permitidas = np.array([[True, True, False]])
con_mascara = np.where(permitidas, puntuaciones, -np.inf)
print(con_mascara)
```

```salida
[[  1.   2. -inf]]
```

> Nota: La máscara causal no se usa para ocultar información del encoder en la atención encoder-decoder; allí la consulta viene del decoder y las claves y valores vienen del encoder.

```ejercicio
# Enunciado
Completa la función que construye la triangular inferior permitida.

# Plantilla

print(np.___(np.ones((3, 3), dtype=bool)).astype(int))

# Esperado
[[1 0 0]
 [1 1 0]
 [1 1 1]]

# Pista
Cinco letras: triangular inferior en NumPy.
```

# Cierre

La escala conserva gradientes utilizables y la máscara causal conserva la propiedad autoregresiva del decoder. La siguiente sesión distribuye la atención entre varias subespacios: multi-cabeza.

[1] El artículo observa que la varianza del producto punto crece con `d_k` bajo una hipótesis de componentes independientes.
