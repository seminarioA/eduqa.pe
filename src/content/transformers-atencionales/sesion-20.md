---
numero: 20
titulo: "Proyecto final: un Transformer pequeño"
---

# Definir el objetivo

El proyecto final consiste en implementar con NumPy un modelo pequeño que transforme secuencias discretas: tokenización mínima, embeddings, codificación posicional, atención causal, feed-forward y proyección al vocabulario. El objetivo no es competir con un modelo de producción; es poder inspeccionar cada matriz y justificar cada operación.

# Reunir el pipeline

El flujo completo conserva estas formas: ids `(longitud,)`, embeddings `(longitud, d_model)`, puntuaciones `(longitud, longitud)`, pesos normalizados `(longitud, longitud)` y logits `(longitud, vocabulario)`.

```python
vocabulario = 6
d_model = 4
longitud = 3
rng = np.random.default_rng(3)
embeddings = rng.normal(size=(vocabulario, d_model))
ids = np.array([1, 2, 3])
representaciones = embeddings[ids]
print(representaciones.shape)
```

```salida
(3, 4)
```

> Doc: [Attention Is All You Need](https://arxiv.org/abs/1706.03762)

# Comprobar una atención causal

La última posición puede consultar tres tokens; la primera solo puede consultar uno. Esta propiedad debe verificarse antes de entrenar, porque una máscara incorrecta filtra información futura y produce una evaluación engañosa.

```python
longitud = 3
mascara = np.tril(np.ones((longitud, longitud), dtype=bool))
visibles = mascara.sum(axis=-1)
print(visibles)
```

```salida
[1 2 3]
```

# Presentar resultados sin inventar métricas

El proyecto debe registrar la configuración, la pérdida calculada por época y una evaluación sobre datos reservados. No se debe copiar una cifra del artículo como si perteneciera a esta implementación: los resultados dependen de datos, vocabulario, inicialización, tamaño, hardware y entrenamiento.

```python
configuracion = {
    "d_model": 4,
    "cabezas": 2,
    "capas": 1,
    "semilla": 3,
}
print(configuracion["d_model"], configuracion["cabezas"])
```

```salida
4 2
```

> Nota: El Transformer base del artículo se entrenó con ocho GPU P100 y un régimen de traducción específico. Un proyecto educativo pequeño no es una reproducción de esos resultados.

```ejercicio
# Enunciado
Completa el atributo que permite recuperar la dimensión de la matriz de embeddings.

# Plantilla

embeddings = np.zeros((6, 4))
print(embeddings.___)

# Esperado
(6, 4)

# Pista
La propiedad que describe las dimensiones de un arreglo.
```

# Cierre del curso

El recorrido partió de secuencias y embeddings, añadió posición, atención escalada, máscara causal, multi-cabeza, residual, normalización, feed-forward, encoder, decoder, pérdida, optimización e interpretación. El producto final es una implementación pequeña que puede inspeccionarse y extenderse sin ocultar sus supuestos.

Como siguiente trabajo, se puede sustituir el tokenizador mínimo, añadir batches, entrenar parámetros con un autograd real y comparar la memoria de atención completa con variantes restringidas.
