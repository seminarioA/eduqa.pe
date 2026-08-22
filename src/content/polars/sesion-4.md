---
numero: 4
titulo: "Agrupar y agregar"
---

# De muchas filas a una

Agrupar es partir la tabla en grupos según el valor de una columna y calcular
un número por cada grupo. Es la operación que convierte un registro de ventas
en una respuesta.

`group_by` forma los grupos y `agg` dice qué calcular sobre cada uno.

```python
ventas = pl.DataFrame({
    "region": ["Norte", "Sur", "Norte", "Sur", "Norte"],
    "vendedor": ["Ana", "Luis", "Marta", "Luis", "Ana"],
    "monto": [1200.0, 850.0, 430.0, 1600.0, 700.0],
})
print(ventas.group_by("region").agg(pl.col("monto").sum()).sort("region"))
```

```salida
shape: (2, 2)
┌────────┬────────┐
│ region ┆ monto  │
│ ---    ┆ ---    │
│ str    ┆ f64    │
╞════════╪════════╡
│ Norte  ┆ 2330.0 │
│ Sur    ┆ 2450.0 │
└────────┴────────┘
```

> Nota: El `sort` del final no es adorno. `group_by` no promete ningún orden en
> los grupos, así que sin ordenar el resultado puede salir distinto entre
> ejecuciones. Toda salida que se compare tiene que ordenarse.

```ejercicio
# Enunciado
Completa el método que forma los grupos antes de agregar.

# Plantilla
t = pl.DataFrame({"g": ["a", "b", "a"], "v": [1, 2, 3]})
print(t.___("g").agg(pl.col("v").sum()).sort("g").to_dicts())

# Esperado
[{'g': 'a', 'v': 4}, {'g': 'b', 'v': 2}]

# Pista
Dos palabras unidas por guion bajo: «agrupar» y «por» en inglés.
```

# Mantener el orden de llegada

`maintain_order=True` hace que los grupos salgan en el orden en que aparecen
por primera vez. Penaliza el rendimiento y por eso no es lo predeterminado.

```python
print(ventas.group_by("region", maintain_order=True).agg(
    pl.col("monto").sum()
).to_dicts())
```

```salida
[{'region': 'Norte', 'monto': 2330.0}, {'region': 'Sur', 'monto': 2450.0}]
```

```ejercicio
# Enunciado
Completa el argumento que conserva el orden de aparición de los grupos.

# Plantilla
t = pl.DataFrame({"g": ["z", "a", "z"], "v": [1, 2, 3]})
print(t.group_by("g", ___=True).agg(pl.col("v").sum()).to_dicts())

# Esperado
[{'g': 'z', 'v': 4}, {'g': 'a', 'v': 2}]

# Pista
Dos palabras unidas por guion bajo: «mantener» y «orden» en inglés.
```

# Varias medidas a la vez

`agg` acepta varias expresiones, así que un solo recorrido devuelve todas las
medidas del grupo.

```python
print(ventas.group_by("region").agg(
    pl.col("monto").sum().alias("total"),
    pl.col("monto").mean().round(2).alias("promedio"),
    pl.col("monto").max().alias("mayor"),
    pl.len().alias("operaciones"),
).sort("region").to_dicts())
```

```salida
[{'region': 'Norte', 'total': 2330.0, 'promedio': 776.67, 'mayor': 1200.0, 'operaciones': 3}, {'region': 'Sur', 'total': 2450.0, 'promedio': 1225.0, 'mayor': 1600.0, 'operaciones': 2}]
```

> Nota: `pl.len()` cuenta filas del grupo y no necesita columna, porque cuenta
> el grupo entero. Es distinto de `pl.col("monto").count()`, que cuenta solo los
> valores no nulos de esa columna: con datos incompletos los dos números
> difieren, y esa diferencia suele ser la señal de un problema.

```ejercicio
# Enunciado
Completa la función que cuenta cuántas filas tiene cada grupo.

# Plantilla
t = pl.DataFrame({"g": ["a", "a", "b"]})
print(t.group_by("g").agg(pl.___().alias("n")).sort("g").to_dicts())

# Esperado
[{'g': 'a', 'n': 2}, {'g': 'b', 'n': 1}]

# Pista
Tres letras: la abreviatura inglesa de «longitud».
```

# Agrupar por varias columnas

Con más de una columna, los grupos son las combinaciones que existen en los
datos. Las que no aparecen quedan fuera.

```python
print(ventas.group_by("region", "vendedor").agg(
    pl.col("monto").sum().alias("total")
).sort(["region", "vendedor"]).to_dicts())
```

```salida
[{'region': 'Norte', 'vendedor': 'Ana', 'total': 1900.0}, {'region': 'Norte', 'vendedor': 'Marta', 'total': 430.0}, {'region': 'Sur', 'vendedor': 'Luis', 'total': 2450.0}]
```

```ejercicio
# Enunciado
Completa la segunda columna por la que se agrupa.

# Plantilla
t = pl.DataFrame({"a": ["x", "x"], "b": ["p", "q"], "v": [1, 2]})
print(t.group_by("a", "___").agg(pl.col("v").sum()).sort("b").to_dicts())

# Esperado
[{'a': 'x', 'b': 'p', 'v': 1}, {'a': 'x', 'b': 'q', 'v': 2}]

# Pista
Es la otra columna de texto de la tabla.
```

# Filtrar antes o después

Filtrar antes de agrupar reduce las filas que entran al cálculo. Filtrar
después descarta grupos ya calculados. No son lo mismo y dan resultados
distintos.

```python
antes = ventas.filter(pl.col("monto") > 500).group_by("region").agg(
    pl.col("monto").sum().alias("total")
).sort("region")

despues = ventas.group_by("region").agg(
    pl.col("monto").sum().alias("total")
).filter(pl.col("total") > 2000).sort("region")

print("filtrando antes: ", antes.to_dicts())
print("filtrando después:", despues.to_dicts())
```

```salida
filtrando antes:  [{'region': 'Norte', 'total': 1900.0}, {'region': 'Sur', 'total': 2450.0}]
filtrando después: [{'region': 'Norte', 'total': 2330.0}, {'region': 'Sur', 'total': 2450.0}]
```

> Nota: Es la distinción que en SQL separa `WHERE` de `HAVING`. Filtrando antes
> el Norte pierde la venta de 430 y su total baja; filtrando después el total
> del Norte está completo y lo que se descarta es el grupo entero si no llega al
> umbral.

```ejercicio
# Enunciado
Completa el contexto que descarta grupos después de haberlos calculado.

# Plantilla
t = pl.DataFrame({"g": ["a", "b"], "v": [10, 100]})
print(t.group_by("g").agg(pl.col("v").sum()).___(pl.col("v") > 50).to_dicts())

# Esperado
[{'g': 'b', 'v': 100}]

# Pista
El mismo contexto que se usa para quedarse con filas.
```

# Recoger los valores del grupo

Una agregación no tiene por qué devolver un número. Sin función de resumen,
`agg` devuelve la lista de valores de cada grupo.

```python
print(ventas.group_by("region").agg(
    pl.col("vendedor").unique().sort().alias("equipo")
).sort("region").to_dicts())
```

```salida
[{'region': 'Norte', 'equipo': ['Ana', 'Marta']}, {'region': 'Sur', 'equipo': ['Luis']}]
```

```ejercicio
# Enunciado
Completa el método que deja un solo ejemplar de cada valor repetido.

# Plantilla
t = pl.DataFrame({"g": ["a", "a"], "v": ["x", "x"]})
print(t.group_by("g").agg(pl.col("v").___()).to_dicts())

# Esperado
[{'g': 'a', 'v': ['x']}]

# Pista
Seis letras: la palabra inglesa para «único».
```

# Calcular por grupo sin colapsar la tabla

`over` aplica una agregación por grupo pero devuelve un valor por fila, así que
la tabla conserva su tamaño. Sirve para comparar cada fila con su grupo.

```python
print(ventas.with_columns(
    pl.col("monto").sum().over("region").alias("total_region")
).with_columns(
    (pl.col("monto") / pl.col("total_region") * 100).round(1).alias("porcentaje")
).select("region", "vendedor", "porcentaje").to_dicts())
```

```salida
[{'region': 'Norte', 'vendedor': 'Ana', 'porcentaje': 51.5}, {'region': 'Sur', 'vendedor': 'Luis', 'porcentaje': 34.7}, {'region': 'Norte', 'vendedor': 'Marta', 'porcentaje': 18.5}, {'region': 'Sur', 'vendedor': 'Luis', 'porcentaje': 65.3}, {'region': 'Norte', 'vendedor': 'Ana', 'porcentaje': 30.0}]
```

> Doc: [Agregación](https://docs.pola.rs/user-guide/expressions/aggregation/)

```ejercicio
# Enunciado
Completa el método que calcula por grupo sin reducir el número de filas.

# Plantilla
t = pl.DataFrame({"g": ["a", "a", "b"], "v": [1, 3, 5]})
print(t.with_columns(pl.col("v").sum().___("g").alias("t")).to_dicts())

# Esperado
[{'g': 'a', 'v': 1, 't': 4}, {'g': 'a', 'v': 3, 't': 4}, {'g': 'b', 'v': 5, 't': 5}]

# Pista
Cuatro letras: la preposición inglesa «sobre».
```

# Cierre

Con `group_by` y `agg` ya se responden las preguntas que resume un informe, y
con `over` se compara cada fila contra su propio grupo sin perder el detalle.

Falta el otro movimiento habitual: los datos casi nunca están en una sola
tabla. La sesión siguiente trata de unirlas.
