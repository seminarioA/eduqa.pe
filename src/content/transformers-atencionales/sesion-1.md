---
numero: 1
titulo: "El problema de modelar secuencias"
---

# Una secuencia conserva un orden

Una secuencia es una colección de elementos cuyo orden forma parte del dato. En una frase, cambiar la posición de una palabra puede cambiar la interpretación. El objetivo del curso es construir transformaciones que usen ese orden sin procesar necesariamente un elemento después de otro.

El artículo original compara el Transformer con redes recurrentes y convolucionales. La recurrencia procesa un estado por posición; el Transformer calcula relaciones entre posiciones mediante atención.[1]

> Doc: [Attention Is All You Need, sección 1](https://arxiv.org/abs/1706.03762)

# Representar una secuencia como una matriz

Una secuencia de cinco tokens, representados con vectores de tres componentes, se almacena como una matriz de forma `(5, 3)`. La primera dimensión identifica la posición y la segunda el componente de la representación.

```python
secuencia = np.array([
    [1.0, 0.0, 0.0],
    [0.0, 1.0, 0.0],
    [1.0, 1.0, 0.0],
    [0.0, 0.0, 1.0],
    [1.0, 0.0, 1.0],
])
print(secuencia.shape)
print(secuencia[2])
```

```salida
(5, 3)
[1. 1. 0.]
```

> Nota: `shape` se lee como `(longitud, dimensión)`. Confundir esas dimensiones altera las multiplicaciones posteriores y suele producir errores que no aparecen hasta la atención.

# Medir el trabajo de una conexión global

Si cada una de las `n` posiciones puede consultar a todas las demás, la matriz de compatibilidades tiene `n × n` entradas. La atención completa tiene complejidad cuadrática respecto de la longitud, aunque permite calcular todas las posiciones en paralelo.

```python
longitud = 6
compatibilidades = np.zeros((longitud, longitud))
print(compatibilidades.shape)
print(compatibilidades.size)
```

```salida
(6, 6)
36
```

> Doc: [NumPy zeros](https://numpy.org/doc/stable/reference/generated/numpy.zeros.html)

```ejercicio
# Enunciado
Completa la propiedad que indica cuántos elementos contiene la matriz de relaciones.

# Plantilla
relaciones = np.zeros((4, 4))
print(relaciones.___)

# Esperado
16

# Pista
Cinco letras: «tamaño» en inglés.
```

# Cierre

Una secuencia se convierte en una matriz de vectores y la atención construye una relación potencial entre cada par de posiciones. La sesión siguiente prepara los identificadores que ocupan esas posiciones: tokens y subpalabras.

[1] El artículo usa «sequence transduction» para transformaciones de una secuencia de entrada a otra secuencia de salida.
