---
numero: 19
titulo: "Visualizar e interpretar cabezas"
---

# Una matriz de pesos no es una explicación completa

Los pesos de atención muestran qué claves reciben mayor peso para una consulta concreta. No prueban por sí solos que una cabeza haya aprendido una regla lingüística: una interpretación requiere comparar ejemplos, capas y cabezas.

![Dependencias de larga distancia](/cursos/transformers-atencionales/imagenes/figura-3-atencion-larga-distancia.png)

> Doc: [Attention Is All You Need, apéndice: Attention Visualizations](https://arxiv.org/abs/1706.03762)

# Leer una fila de atención

Cada fila de pesos debe sumar uno. La posición del valor máximo indica la clave con mayor peso para esa consulta.

```python
pesos = np.array([[0.1, 0.7, 0.2], [0.6, 0.2, 0.2]])
print(np.argmax(pesos, axis=-1))
print(np.round(pesos.sum(axis=-1), 4))
```

```salida
[1 0]
[1. 1.]
```

> Doc: [numpy.argmax](https://numpy.org/doc/stable/reference/generated/numpy.argmax.html)

# Dependencias de larga distancia

Una cabeza puede concentrar peso en un token distante, por ejemplo para relacionar un verbo con una parte de su complemento. La figura 3 del artículo muestra un caso de este tipo en una capa del encoder.[1]

![Cabezas relacionadas con anáfora](/cursos/transformers-atencionales/imagenes/figura-4-cabezas-anafora.png)

> Nota: La visualización muestra una distribución aprendida en ejemplos concretos. No implica que todas las entradas, capas o cabezas realicen siempre la misma función.

# Comparar cabezas

Dos cabezas pueden producir distribuciones diferentes para la misma secuencia. La diversidad de patrones es precisamente la motivación de multi-cabeza.

```python
cabeza_a = np.array([0.8, 0.1, 0.1])
cabeza_b = np.array([0.1, 0.8, 0.1])
print(np.argmax(cabeza_a), np.argmax(cabeza_b))
```

```salida
0 1
```

![Cabezas con patrones estructurales](/cursos/transformers-atencionales/imagenes/figura-5-cabezas-estructura.png)

```ejercicio
# Enunciado
Completa la función que localiza la clave de mayor peso en cada cabeza.

# Plantilla

pesos = np.array([[0.8, 0.1, 0.1], [0.1, 0.8, 0.1]])
print(np.___(pesos, axis=-1))

# Esperado
[0 1]

# Pista
Selecciona el índice del valor máximo.
```

# Cierre

Las visualizaciones son instrumentos de inspección, no pruebas aisladas de causalidad o comprensión. La sesión final integra el recorrido en un proyecto pequeño y revisa sus límites.

[1] En las figuras 3, 4 y 5, el artículo presenta cabezas del encoder en la capa 5 de 6.
