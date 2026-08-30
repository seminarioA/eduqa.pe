---
numero: 12
titulo: "Construir una capa de decoder"
---

# La entrada desplazada a la derecha

En entrenamiento, el decoder recibe la salida correcta anterior. La secuencia comienza con `<bos>` y se desplaza una posición respecto de los objetivos; así, en la posición `i` se predice el token que sigue.

```python
objetivos = ["el", "modelo", "aprende", "<eos>"]
entrada_decoder = ["<bos>"] + objetivos[:-1]
print(entrada_decoder)
```

```salida
['<bos>', 'el', 'modelo', 'aprende']
```

> Doc: [Attention Is All You Need, sección 3.1](https://arxiv.org/abs/1706.03762)

# Autoatención enmascarada

La autoatención del decoder usa la máscara causal. En una secuencia de longitud cuatro, la posición dos puede consultar las posiciones cero, uno y dos, pero no la tres.

```python
mascara = np.tril(np.ones((4, 4), dtype=bool))
print(mascara[2].astype(int))
```

```salida
[1 1 1 0]
```

# Atención encoder-decoder

La segunda subcapa de atención recibe consultas del decoder y claves y valores del encoder. Esto permite que cada posición que se genera consulte toda la entrada codificada.

```python
salida_decoder = np.zeros((3, 4))
salida_encoder = np.zeros((5, 4))
q = salida_decoder
k = salida_encoder
v = salida_encoder
print(q.shape[0], k.shape[0], v.shape[0])
```

```salida
3 5 5
```

> Nota: Las longitudes pueden ser diferentes: tres posiciones del decoder consultan cinco posiciones del encoder. La dimensión de características debe coincidir después de las proyecciones.

```ejercicio
# Enunciado
Completa la operación que desplaza los objetivos y conserva el inicio de la salida.

# Plantilla

objetivos = ["el", "modelo", "aprende"]
entrada = ["<bos>"] + objetivos[___]
print(entrada)

# Esperado
['<bos>', 'el', 'modelo']

# Pista
La rebanada elimina el último elemento.
```

# Cierre

El decoder combina máscara causal, atención encoder-decoder y feed-forward. La sesión siguiente explica cómo la red convierte sus representaciones en probabilidades de tokens.
