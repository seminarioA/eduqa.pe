---
numero: 14
titulo: "Pérdida y teacher forcing"
---

# Medir la probabilidad del objetivo

Para una posición cuyo token correcto es `y`, la entropía cruzada negativa es `-log(p_y)`. Penaliza asignar poca probabilidad al token correcto y se promedia sobre las posiciones no relleno.

```python
probabilidad_correcta = 0.8
perdida = -np.log(probabilidad_correcta)
print(round(float(perdida), 4))
```

```salida
0.2231
```

> Doc: [numpy.log](https://numpy.org/doc/stable/reference/generated/numpy.log.html)

# Ignorar `<pad>` en la pérdida

El relleno iguala longitudes, pero no es un objetivo lingüístico. Una máscara de tokens válidos permite promediar solo las posiciones reales.

```python
perdidas = np.array([0.2, 0.4, 0.0, 0.0])
validas = np.array([True, True, False, False])
media = perdidas[validas].mean()
print(media)
```

```salida
0.30000000000000004
```

> Nota: El valor exacto de la salida de coma flotante refleja la representación binaria de `0.3`; para presentar resultados redondeados se usa `round`, no se altera el cálculo.

# Teacher forcing

Durante el entrenamiento, el decoder recibe el token real anterior, no el token que predijo en el paso anterior. Esto permite paralelizar las posiciones con la máscara causal; durante inferencia, la entrada se construye con las predicciones generadas.

```python
reales = ["<bos>", "el", "modelo"]
predichos = ["<bos>", "la", "red"]
entrada_entrenamiento = reales[:-1]
entrada_inferencia = predichos[:-1]
print(entrada_entrenamiento)
print(entrada_inferencia)
```

```salida
['<bos>', 'el']
['<bos>', 'la']
```

```ejercicio
# Enunciado
Completa el índice que selecciona únicamente las posiciones reales del lote.

# Plantilla

perdidas = np.array([0.2, 0.4, 0.0])
validas = np.array([True, True, False])
print(perdidas[___].mean())

# Esperado
0.30000000000000004

# Pista
La máscara booleana se coloca entre corchetes para filtrar.
```

# Cierre

La pérdida enseña al modelo a elevar la probabilidad del token objetivo y excluye `<pad>`. La sesión siguiente estudia el optimizador y el calendario de aprendizaje usados en el artículo.
