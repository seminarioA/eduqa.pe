---
numero: 10
titulo: "Redes feed-forward por posición"
---

# La misma transformación en cada posición

Además de atención, cada capa aplica a cada posición la misma red totalmente conectada. La red no mezcla posiciones; la atención ya realizó esa mezcla. El artículo define `FFN(x) = max(0, xW1 + b1)W2 + b2`.[1]

```python
def relu(x):
    return np.maximum(0.0, x)

def feed_forward(x, w1, b1, w2, b2):
    oculto = relu(x @ w1 + b1)
    return oculto @ w2 + b2

x = np.array([[1.0, -1.0]])
w1 = np.eye(2)
b1 = np.zeros(2)
w2 = np.eye(2)
b2 = np.zeros(2)
print(feed_forward(x, w1, b1, w2, b2))
```

```salida
[[1. 0.]]
```

> Doc: [Attention Is All You Need, ecuación 2](https://arxiv.org/abs/1706.03762)

# Expandir y reducir la representación

La capa interna suele ser más ancha que `d_model`. En el modelo base, `d_model = 512` y `d_ff = 2048`. La expansión permite que la no linealidad transforme cada posición antes de volver a la dimensión original.

```python
d_model = 4
d_ff = 8
w1 = np.zeros((d_model, d_ff))
w2 = np.zeros((d_ff, d_model))
print(w1.shape, w2.shape)
```

```salida
(4, 8) (8, 4)
```

# La no linealidad ReLU

ReLU conserva valores positivos y reemplaza por cero los negativos. Sin esa operación, dos transformaciones lineales consecutivas equivaldrían a una sola transformación lineal.

```python
valores = np.array([-2.0, 0.0, 3.0])
print(relu(valores))
```

```salida
[0. 0. 3.]
```

> Nota: ReLU no mezcla posiciones ni componentes entre sí; la mezcla de componentes procede de las matrices y la mezcla de posiciones procede de la atención.

```ejercicio
# Enunciado
Completa la función que reemplaza los valores negativos por cero.

# Plantilla

valores = np.array([-2.0, 0.0, 3.0])
print(np.___(0.0, valores))

# Esperado
[0. 0. 3.]

# Pista
Ocho letras: el máximo componente a componente.
```

# Cierre

El bloque feed-forward añade transformación no lineal por posición y mantiene la dimensión de entrada y salida. Las sesiones 11 y 12 ensamblan encoder y decoder con las piezas estudiadas.

[1] El artículo describe estas capas como dos transformaciones lineales con una activación ReLU intermedia.
