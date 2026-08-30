---
numero: 2
titulo: "Tokens, subpalabras y vocabularios"
---

# Un modelo no recibe palabras

Un modelo neuronal recibe números. Un token es una unidad discreta del texto: puede ser una palabra, un signo o una subpalabra. El tokenizador asigna a cada unidad un entero del vocabulario, y una tabla de embeddings transforma después ese entero en un vector.

El artículo usa byte-pair encoding (BPE), una técnica que comparte un vocabulario de subpalabras entre entrada y salida.[1] En este curso usaremos un tokenizador mínimo para separar el problema de la representación del problema de la atención.

> Doc: [Attention Is All You Need, sección 5.1](https://arxiv.org/abs/1706.03762)

# Asignar ids de forma determinista

Un diccionario de vocabulario debe producir el mismo id cada vez. Los tokens especiales reservan funciones: `<pad>` rellena lotes, `<bos>` inicia la salida y `<eos>` la termina.

```python
vocabulario = {"<pad>": 0, "<bos>": 1, "<eos>": 2, "el": 3, "modelo": 4}
tokens = ["<bos>", "el", "modelo", "<eos>"]
ids = [vocabulario[token] for token in tokens]
print(ids)
```

```salida
[1, 3, 4, 2]
```

> Doc: [Comprensiones de listas](https://docs.python.org/3/tutorial/datastructures.html#list-comprehensions)

# Rellenar una longitud común

Los ejemplos de un lote pueden tener longitudes distintas. El relleno agrega el id de `<pad>` hasta alcanzar la longitud máxima. La máscara posterior debe distinguir ese relleno de los tokens reales.

```python
secuencias = [[1, 3, 2], [1, 4, 5, 2]]
longitud_maxima = max(len(ids) for ids in secuencias)
lote = [ids + [0] * (longitud_maxima - len(ids)) for ids in secuencias]
print(lote)
```

```salida
[[1, 3, 2, 0], [1, 4, 5, 2]]
```

> Nota: El relleno no representa información lingüística. Si recibe peso de atención, el modelo puede aprender relaciones con posiciones artificiales.

```ejercicio
# Enunciado
Completa la función que devuelve la longitud de la secuencia más larga.

# Plantilla
secuencias = [[1, 3, 2], [1, 4, 5, 2]]
print(___(len(ids) for ids in secuencias))

# Esperado
4

# Pista
Tres letras: máximo en inglés.
```

# Cierre

Los tokens se convierten en ids y los lotes se igualan con `<pad>`. La sesión siguiente reemplaza esos ids por vectores aprendibles: los embeddings.

[1] El artículo menciona un vocabulario compartido de aproximadamente 37 000 tokens para inglés-alemán y word pieces para inglés-francés.
