---
numero: 18
titulo: "Implementar un bloque Transformer mínimo"
---

# Encapsular la atención

Una implementación mantenible separa softmax, atención y bloque de transformación. La función siguiente acepta matrices con una fila por posición y devuelve una salida con la misma forma que `V`.

```python
def softmax(filas):
    estable = filas - filas.max(axis=-1, keepdims=True)
    exp = np.exp(estable)
    return exp / exp.sum(axis=-1, keepdims=True)

def atencion(q, k, v):
    puntuaciones = q @ k.T / np.sqrt(k.shape[-1])
    pesos = softmax(puntuaciones)
    return pesos @ v

q = np.array([[1.0, 0.0]])
k = np.array([[1.0, 0.0], [0.0, 1.0]])
v = np.array([[2.0, 0.0], [0.0, 4.0]])
print(np.round(atencion(q, k, v), 4))
```

```salida
[[1.3395 1.321 ]]
```

> Doc: [Attention Is All You Need, ecuación 1](https://arxiv.org/abs/1706.03762)

# Añadir una transformación por posición

Un bloque mínimo puede aplicar atención y luego una red feed-forward. Aquí usamos matrices identidad para observar las formas antes de entrenar parámetros.

```python
x = np.eye(3)
contexto = atencion(x, x, x)
print(contexto.shape)
print(np.round(contexto.sum(axis=-1), 4))
```

```salida
(3, 3)
[1. 1. 1.]
```

> Nota: La suma de cada fila de `contexto` vale uno porque cada fila de `x` es una combinación convexa de los valores y las filas de `x` suman uno en este caso.

# Verificar invariantes

Antes de entrenar, conviene comprobar invariantes de forma y normalización. Una prueba pequeña detecta transpuestas equivocadas y máscaras aplicadas en el eje incorrecto.

```python
pesos = softmax(np.array([[1.0, 2.0], [3.0, 4.0]]))
print(pesos.shape)
print(np.round(pesos.sum(axis=-1), 4))
```

```salida
(2, 2)
[1. 1.]
```

```ejercicio
# Enunciado
Completa la división que escala las puntuaciones por la dimensión de la clave.

# Plantilla

puntuaciones = np.array([[2.0, 4.0]])
d_k = 4
print(puntuaciones / np.___(d_k))

# Esperado
[[1. 2.]]

# Pista
La raíz cuadrada reduce la escala según la ecuación de atención.
```

# Cierre

El bloque mínimo conserva formas, normaliza pesos y mezcla valores. La sesión siguiente usa el mismo patrón para construir visualizaciones de atención y leerlas con cautela.
