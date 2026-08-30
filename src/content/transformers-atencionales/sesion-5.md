---
numero: 5
titulo: "La arquitectura encoder-decoder"
---

# El mapa completo

El Transformer original conserva la estructura encoder-decoder de los modelos de traducción. El encoder transforma la entrada en representaciones contextualizadas; el decoder genera la salida de izquierda a derecha. La arquitectura del artículo aparece abajo.[1]

![Arquitectura encoder-decoder del Transformer](/cursos/transformers-atencionales/imagenes/figura-1-arquitectura-transformer.png)

> Doc: [Attention Is All You Need, figura 1 y sección 3](https://arxiv.org/abs/1706.03762)

# El encoder apila dos subcapas

Cada una de las seis capas del encoder contiene autoatención multi-cabeza y una red feed-forward aplicada por posición. Cada subcapa se rodea de conexión residual y normalización de capa.

```python
entrada = np.arange(12, dtype=float).reshape(4, 3)
salida_subcapa = entrada * 0.5
residual = entrada + salida_subcapa
print(residual.shape)
print(residual[0])
```

```salida
(4, 3)
[0.  1.5 3. ]
```

> Nota: Una conexión residual suma la entrada de una subcapa con su salida. No es una copia silenciosa: exige que ambas formas coincidan.

# El decoder añade dos restricciones

El decoder tiene una autoatención con máscara causal y una atención encoder-decoder. La primera impide consultar tokens futuros; la segunda permite consultar las representaciones producidas por el encoder. La salida pasa después por la red feed-forward.

```python
entrada = ["<bos>", "el", "modelo"]
for posicion, token in enumerate(entrada):
    visibles = entrada[:posicion + 1]
    print(token, "->", visibles)
```

```salida
<bos> -> ['<bos>']
el -> ['<bos>', 'el']
modelo -> ['<bos>', 'el', 'modelo']
```

```ejercicio
# Enunciado
Completa el operador que suma la ruta residual.

# Plantilla

entrada = np.array([2.0, 4.0])
subcapa = np.array([0.5, 1.0])
print(entrada ___ subcapa)

# Esperado
[2.5 5. ]

# Pista
La conexión residual conserva la entrada y añade la transformación.
```

# Cierre

La figura separa encoder, decoder, embeddings, posiciones, subcapas y salida. Las siguientes sesiones descomponen la operación central que conecta esos componentes: la atención escalada.

[1] El modelo base usa `N = 6` capas de encoder y `N = 6` capas de decoder.
