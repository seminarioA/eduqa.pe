---
numero: 15
titulo: "Adam y warmup de la tasa de aprendizaje"
---

# Actualizar parámetros con Adam

El artículo entrena con Adam, usando `beta1 = 0.9`, `beta2 = 0.98` y `epsilon = 10^-9`.[1] Adam mantiene momentos del gradiente y del gradiente al cuadrado para adaptar la actualización de cada parámetro.

```python
beta1 = 0.9
beta2 = 0.98
epsilon = 1e-9
print(beta1, beta2, epsilon)
```

```salida
0.9 0.98 1e-09
```

> Doc: [Attention Is All You Need, sección 5.3](https://arxiv.org/abs/1706.03762)

# Aumentar la tasa durante warmup

El calendario del artículo aumenta linealmente la tasa durante los primeros `warmup_steps`. Ese tramo evita aplicar actualizaciones grandes antes de que los momentos acumulados sean informativos.

```python
def tasa_transformer(step, d_model=512, warmup_steps=4000):
    return d_model ** -0.5 * min(step ** -0.5, step * warmup_steps ** -1.5)

for step in [1, 4000, 8000]:
    print(step, round(tasa_transformer(step), 8))
```

```salida
1 1.7e-07
4000 0.00069877
8000 0.00049411
```

> Nota: La fórmula combina un crecimiento proporcional a `step` con una caída proporcional a `step^-0.5`; `min` selecciona el régimen activo.

# Inspeccionar el régimen de entrenamiento

```python
pasos = np.array([1, 1000, 4000, 8000])
tasas = np.array([tasa_transformer(int(paso)) for paso in pasos])
print(tasas.shape)
print(int(np.argmax(tasas)))
```

```salida
(4,)
2
```

```ejercicio
# Enunciado
Completa la función que selecciona el menor valor de dos candidatos en el calendario.

# Plantilla

print(___(3, 5))

# Esperado
3

# Pista
Tres letras: mínimo en inglés.
```

# Cierre

Adam actualiza los pesos con momentos y el calendario usa warmup seguido de decaimiento. La sesión siguiente cubre dropout, regularización y los detalles del régimen de entrenamiento.

[1] Los hiperparámetros y `warmup_steps = 4000` corresponden al entrenamiento descrito para el modelo base del artículo.
