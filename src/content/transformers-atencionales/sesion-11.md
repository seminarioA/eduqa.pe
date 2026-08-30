---
numero: 11
titulo: "Construir una capa de encoder"
---

# La secuencia entra completa

El encoder recibe todas las representaciones de entrada al mismo tiempo. Cada capa aplica autoatención multi-cabeza y después la red feed-forward, con residual y normalización alrededor de cada subcapa.

```python
def normalizar_capa(x, epsilon=1e-5):
    media = x.mean(axis=-1, keepdims=True)
    varianza = ((x - media) ** 2).mean(axis=-1, keepdims=True)
    return (x - media) / np.sqrt(varianza + epsilon)

def capa_residual(x, transformacion):
    return normalizar_capa(x + transformacion(x))

entrada = np.array([[1.0, 2.0], [3.0, 4.0]])
salida = capa_residual(entrada, lambda matriz: matriz * 0.1)
print(salida.shape)
```

```salida
(2, 2)
```

> Doc: [Attention Is All You Need, sección 3.1](https://arxiv.org/abs/1706.03762)

# Autoatención: Q, K y V vienen del mismo sitio

En la autoatención del encoder, las consultas, claves y valores se calculan a partir de la misma salida de la capa anterior. Cada posición puede incorporar información de cualquier otra posición de la entrada.

```python
entrada = np.array([[1.0, 0.0], [0.0, 1.0]])
wq = wk = wv = np.eye(2)
q = entrada @ wq
k = entrada @ wk
v = entrada @ wv
print(np.allclose(q, k), np.allclose(k, v))
```

```salida
True True
```

> Nota: Que Q, K y V se originen en la misma matriz no obliga a que sus proyecciones sean iguales; cada una usa parámetros aprendidos distintos.

# Apilar capas

La salida de una capa tiene la misma forma que su entrada, por lo que puede alimentar la siguiente. El modelo base apila seis capas idénticas en el encoder.

```python
representacion = np.array([[1.0, 2.0, 3.0]])
for _ in range(3):
    representacion = normalizar_capa(representacion + 0.1 * representacion)
print(representacion.shape)
```

```salida
(1, 3)
```

```ejercicio
# Enunciado
Completa la comparación que verifica que dos matrices tienen la misma forma.

# Plantilla

a = np.zeros((2, 3))
b = np.ones((2, 3))
print(np.___(a.shape, b.shape))

# Esperado
True

# Pista
Ocho letras: todos cercanos no; aquí compara exactamente dos valores.
```

# Cierre

El encoder contextualiza toda la entrada con capas repetibles. La siguiente sesión construye el decoder, que añade generación autoregresiva y atención sobre la salida del encoder.
