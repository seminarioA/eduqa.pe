---
numero: 9
titulo: "Conexiones residuales y normalización"
---

# Conservar una ruta directa

La salida de cada subcapa se suma a su entrada: `x + Sublayer(x)`. Esa conexión residual ofrece una ruta directa para que la señal y el gradiente atraviesen muchas capas.

```python
entrada = np.array([[1.0, 2.0], [3.0, 4.0]])
subcapa = np.array([[0.5, 1.0], [1.5, 2.0]])
print(entrada + subcapa)
```

```salida
[[1.5 3. ]
 [4.5 6. ]]
```

> Doc: [Attention Is All You Need, sección 3.1](https://arxiv.org/abs/1706.03762)

# Normalizar cada representación

La normalización de capa calcula media y desviación dentro de la dimensión de características de cada posición. Después aplica parámetros aprendidos `gamma` y `beta`.

```python
def normalizar_capa(x, epsilon=1e-5):
    media = x.mean(axis=-1, keepdims=True)
    varianza = ((x - media) ** 2).mean(axis=-1, keepdims=True)
    return (x - media) / np.sqrt(varianza + epsilon)

x = np.array([[1.0, 2.0, 3.0]])
y = normalizar_capa(x)
print(np.round(y.mean(axis=-1), 4))
print(np.round(y.var(axis=-1), 4))
```

```salida
[0.]
[1.]
```

> Nota: `epsilon` evita dividir por cero cuando una posición tiene todos sus componentes iguales. No cambia el objetivo de centrar y escalar la representación.

# Aplicar la forma del artículo

El artículo describe `LayerNorm(x + Sublayer(x))`. La suma ocurre antes de la normalización, de modo que la salida conserva información de la entrada pero queda en una escala controlada.

```python
x = np.array([[1.0, 2.0, 3.0]])
subcapa = np.array([[1.0, 1.0, 1.0]])
salida = normalizar_capa(x + subcapa)
print(np.round(salida, 4))
```

```salida
[[-1.2247  0.      1.2247]]
```

```ejercicio
# Enunciado
Completa la reducción que calcula la media por posición.

# Plantilla

x = np.array([[1.0, 2.0, 3.0]])
print(x.___(axis=-1, keepdims=True))

# Esperado
[[2.]]

# Pista
Tres letras: media aritmética en inglés.
```

# Cierre

La ruta residual conserva la señal y la normalización controla su escala. La sesión siguiente completa el bloque de cada capa con una red feed-forward aplicada de forma independiente a cada posición.
