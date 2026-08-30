---
numero: 16
titulo: "Regularización y entrenamiento reproducible"
---

# Dropout en el Transformer

El artículo aplica dropout a la salida de cada subcapa antes de la suma residual y también a la suma de embeddings y posiciones.[1] Durante entrenamiento se anulan activaciones al azar; durante evaluación se usa la red completa con el escalado correspondiente.

```python
rng = np.random.default_rng(7)
activaciones = np.ones(8)
mascara = rng.random(activaciones.shape) >= 0.25
print(int(mascara.sum()))
```

```salida
5
```

> Doc: [Attention Is All You Need, sección 5.4](https://arxiv.org/abs/1706.03762)

# Evitar fugas entre conjuntos

Los datos de entrenamiento, validación y prueba cumplen funciones distintas. El conjunto de prueba se reserva para la evaluación final; consultar repetidamente sus resultados convierte la evaluación en otra forma de ajuste.

```python
conjunto_entrenamiento = {"a", "b", "c"}
conjunto_validacion = {"d"}
conjunto_prueba = {"e"}
print(bool(conjunto_entrenamiento & conjunto_prueba))
print(bool(conjunto_validacion & conjunto_prueba))
```

```salida
False
False
```

> Nota: Que no haya intersección entre conjuntos no garantiza que las distribuciones sean iguales, pero evita la fuga directa de ejemplos.

# Fijar la aleatoriedad

Una semilla permite repetir una secuencia pseudoaleatoria durante la depuración. No convierte el entrenamiento distribuido en completamente determinista, pero facilita aislar cambios en el código.

```python
primera = np.random.default_rng(42).integers(0, 10, size=4)
segunda = np.random.default_rng(42).integers(0, 10, size=4)
print(np.array_equal(primera, segunda))
```

```salida
True
```

```ejercicio
# Enunciado
Completa la función que compara dos arreglos elemento a elemento con tolerancia.

# Plantilla

a = np.array([0.1 + 0.2])
b = np.array([0.3])
print(np.___(a, b))

# Esperado
[ True]

# Pista
Ocho letras: todos cercanos.
```

# Cierre

Dropout reduce sobreajuste y una división limpia de datos permite medir generalización. La sesión siguiente compara atención, recurrencia y convolución en coste y longitud de camino.

[1] Para el modelo base, el artículo usa dropout `P_drop = 0.1`.
