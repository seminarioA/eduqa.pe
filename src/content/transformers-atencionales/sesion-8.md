---
numero: 8
titulo: "Atención multi-cabeza"
---

# Varias proyecciones aprendidas

Una sola atención mezcla toda la representación en un único espacio. La atención multi-cabeza proyecta `Q`, `K` y `V` varias veces, ejecuta atención en paralelo, concatena los resultados y aplica una proyección final.[1]

![Atención multi-cabeza](/cursos/transformers-atencionales/imagenes/figura-2-atencion-multi-cabeza.png)

> Doc: [Attention Is All You Need, sección 3.2.2](https://arxiv.org/abs/1706.03762)

# Separar la dimensión en cabezas

En el modelo base, `d_model = 512`, `h = 8` y cada cabeza usa `d_k = d_v = 64`. La dimensión total no cambia: `8 × 64 = 512`.

```python
d_model = 512
cabezas = 8
d_cabeza = d_model // cabezas
print(d_cabeza)
print(cabezas * d_cabeza)
```

```salida
64
512
```

# Proyectar cada entrada

Una proyección lineal multiplica cada vector por una matriz de pesos. Para enseñar la forma, usamos tres dimensiones y dos cabezas; una implementación real aprende pesos distintos para cada cabeza.

```python
entrada = np.arange(6, dtype=float).reshape(2, 3)
proyeccion = np.eye(3)
resultado = entrada @ proyeccion
print(resultado.shape)
print(resultado[1])
```

```salida
(2, 3)
[3. 4. 5.]
```

> Nota: La independencia entre cabezas no significa que cada cabeza reciba tokens distintos. Todas observan la secuencia, pero sus matrices pueden seleccionar relaciones distintas.

# Concatenar y volver a proyectar

La concatenación une la dimensión final de las cabezas. La matriz `W^O` devuelve el tamaño `d_model`, para que la salida pueda entrar en una conexión residual.

```python
cabeza_a = np.array([[1.0, 2.0]])
cabeza_b = np.array([[3.0, 4.0]])
concatenada = np.concatenate([cabeza_a, cabeza_b], axis=-1)
print(concatenada)
print(concatenada.shape)
```

```salida
[[1. 2. 3. 4.]]
(1, 4)
```

```ejercicio
# Enunciado
Completa la función que concatena las cabezas en la última dimensión.

# Plantilla

a = np.array([[1.0, 2.0]])
b = np.array([[3.0, 4.0]])
print(np.___([a, b], axis=-1))

# Esperado
[[1. 2. 3. 4.]]

# Pista
Nueve letras: unir arreglos.
```

# Cierre

Multi-cabeza permite atender a distintos subespacios de representación sin aumentar la dimensión final. La próxima sesión incorpora las operaciones que estabilizan el flujo de gradientes: residual y normalización.

[1] En el artículo, el coste total de multi-cabeza es similar al de una sola cabeza con dimensión completa porque cada cabeza trabaja con una dimensión reducida.
