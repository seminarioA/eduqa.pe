---
numero: 1
titulo: "El DataFrame y sus tipos"
---

# Otra forma de mirar una tabla

Polars es una biblioteca para trabajar con datos en forma de tabla. Cubre el
mismo terreno que Pandas —cargar, filtrar, agrupar, unir— y llega a resultados
equivalentes por un camino distinto.

La diferencia que importa no es la sintaxis: es que Polars separa **qué se
quiere calcular** de **cuándo se calcula**. Esa separación es la que permite
repartir el trabajo entre varios núcleos y saltarse columnas que nadie pidió.

Esta primera sesión se queda en lo básico: crear una tabla, mirarla y entender
de qué tipo es cada columna.

# Crear un DataFrame

Un `DataFrame` se construye desde un diccionario donde cada clave es el nombre
de una columna y cada valor, la lista de sus datos.

```python
ventas = pl.DataFrame({
    "vendedor": ["Ana", "Luis", "Ana", "Marta"],
    "region": ["Norte", "Sur", "Norte", "Sur"],
    "monto": [1200.0, 850.0, 430.0, 1600.0],
})
print(ventas)
```

```salida
shape: (4, 3)
┌──────────┬────────┬────────┐
│ vendedor ┆ region ┆ monto  │
│ ---      ┆ ---    ┆ ---    │
│ str      ┆ str    ┆ f64    │
╞══════════╪════════╪════════╡
│ Ana      ┆ Norte  ┆ 1200.0 │
│ Luis     ┆ Sur    ┆ 850.0  │
│ Ana      ┆ Norte  ┆ 430.0  │
│ Marta    ┆ Sur    ┆ 1600.0 │
└──────────┴────────┴────────┘
```

> Nota: Lo primero que imprime es `shape: (4, 3)`: cuatro filas y tres columnas.
> Polars lo pone siempre, antes que los datos, porque el tamaño es lo primero
> que hay que mirar cuando un resultado no cuadra.

```ejercicio
# Enunciado
Completa el nombre de la clase que construye una tabla a partir de un diccionario.

# Plantilla
tabla = pl.___({"a": [1, 2], "b": [3, 4]})
print(tabla.shape)

# Esperado
(2, 2)

# Pista
Nueve letras: el mismo nombre que en Pandas, con dos mayúsculas.
```

# La forma y los nombres

Antes de calcular nada conviene saber con qué se trabaja. `shape` da las
dimensiones, `columns` los nombres y `dtypes` el tipo de cada columna.

```python
print(ventas.shape)
print(ventas.columns)
print(ventas.dtypes)
```

```salida
(4, 3)
['vendedor', 'region', 'monto']
[String, String, Float64]
```

```ejercicio
# Enunciado
Completa el atributo que devuelve la lista de nombres de columna.

# Plantilla
t = pl.DataFrame({"x": [1], "y": [2]})
print(t.___)

# Esperado
['x', 'y']

# Pista
Es el plural en inglés de «columna».
```

# Los tipos son estrictos

Cada columna tiene un tipo y Polars lo respeta. Una columna de enteros es
`Int64`, una de decimales `Float64`, una de texto `String`.

Esto no es un detalle: en Pandas una columna de enteros con un valor ausente se
convierte en decimal sin avisar. Polars mantiene el tipo y trata la ausencia
aparte.

```python
mixta = pl.DataFrame({
    "entero": [1, 2, 3],
    "decimal": [1.5, 2.5, 3.5],
    "texto": ["a", "b", "c"],
    "logico": [True, False, True],
})
for nombre, tipo in zip(mixta.columns, mixta.dtypes):
    print(nombre, "->", tipo)
```

```salida
entero -> Int64
decimal -> Float64
texto -> String
logico -> Boolean
```

```ejercicio
# Enunciado
Completa el atributo que devuelve el tipo de cada columna.

# Plantilla
t = pl.DataFrame({"n": [1, 2], "s": ["a", "b"]})
print(t.___)

# Esperado
[Int64, String]

# Pista
Es la abreviatura inglesa de «tipos de dato», en plural.
```

# Los valores ausentes

Un dato que falta se escribe `None` y Polars lo guarda como nulo sin cambiar el
tipo de la columna. `null_count()` los cuenta por columna.

```python
con_huecos = pl.DataFrame({
    "cantidad": [10, None, 30, None],
    "etiqueta": ["a", "b", None, "d"],
})
print(con_huecos.dtypes)
print(con_huecos.null_count())
```

```salida
[Int64, String]
shape: (1, 2)
┌──────────┬──────────┐
│ cantidad ┆ etiqueta │
│ ---      ┆ ---      │
│ u32      ┆ u32      │
╞══════════╪══════════╡
│ 2        ┆ 1        │
└──────────┴──────────┘
```

> Nota: La columna sigue siendo `Int64` con dos nulos dentro. Ese es el
> comportamiento que se busca: la ausencia de un dato es una propiedad de esa
> celda, no una razón para cambiar el tipo de toda la columna.

```ejercicio
# Enunciado
Completa el método que cuenta los valores ausentes de cada columna.

# Plantilla
t = pl.DataFrame({"a": [1, None, 3]})
print(t.___().to_dicts())

# Esperado
[{'a': 1}]

# Pista
Dos palabras en inglés unidas por un guion bajo: nulo y recuento.
```

# Mirar una parte

Con tablas grandes no se imprime todo. `head()` devuelve las primeras filas y
`tail()` las últimas.

```python
numeros = pl.DataFrame({"n": list(range(1, 11))})
print(numeros.head(3).to_series().to_list())
print(numeros.tail(2).to_series().to_list())
```

```salida
[1, 2, 3]
[9, 10]
```

```ejercicio
# Enunciado
Completa el método que devuelve las primeras filas de la tabla.

# Plantilla
t = pl.DataFrame({"n": [1, 2, 3, 4, 5]})
print(t.___(2).to_series().to_list())

# Esperado
[1, 2]

# Pista
Cuatro letras: la palabra inglesa para «cabeza».
```

# Un resumen numérico

`describe()` calcula de una vez el recuento, la media, la desviación y los
cuartiles de las columnas numéricas.

```python
print(ventas.select("monto").describe())
```

```salida
shape: (9, 2)
┌────────────┬────────────┐
│ statistic  ┆ monto      │
│ ---        ┆ ---        │
│ str        ┆ f64        │
╞════════════╪════════════╡
│ count      ┆ 4.0        │
│ null_count ┆ 0.0        │
│ mean       ┆ 1020.0     │
│ std        ┆ 498.598034 │
│ min        ┆ 430.0      │
│ 25%        ┆ 850.0      │
│ 50%        ┆ 1200.0     │
│ 75%        ┆ 1200.0     │
│ max        ┆ 1600.0     │
└────────────┴────────────┘
```

> Nota: Sirve para detectar lo imposible antes de trabajar: un mínimo negativo
> en una columna de precios o un máximo con tres ceros de más se ven aquí en un
> vistazo, y ahorran descubrirlos al final del proceso.

```ejercicio
# Enunciado
Completa el método que devuelve el resumen estadístico de la tabla.

# Plantilla
t = pl.DataFrame({"v": [10.0, 20.0, 30.0]})
resumen = t.___()
print(resumen.filter(pl.col("statistic") == "mean")["v"][0])

# Esperado
20.0

# Pista
Ocho letras: el verbo inglés «describir». Devuelve una tabla con una fila por estadística.
```

# Sacar los datos de la tabla

Para comprobar un resultado suele ser más cómodo convertir la tabla a
estructuras de Python. `to_dicts()` da una lista de diccionarios y `rows()` una
lista de tuplas.

```python
pequena = pl.DataFrame({"k": ["a", "b"], "v": [1, 2]})
print(pequena.to_dicts())
print(pequena.rows())
```

```salida
[{'k': 'a', 'v': 1}, {'k': 'b', 'v': 2}]
[('a', 1), ('b', 2)]
```

```ejercicio
# Enunciado
Completa el método que convierte la tabla en una lista de diccionarios.

# Plantilla
t = pl.DataFrame({"k": ["x"], "v": [9]})
print(t.___())

# Esperado
[{'k': 'x', 'v': 9}]

# Pista
Dos palabras unidas por guion bajo: «a» y el plural abreviado de diccionario.
```

# Una columna suelta

Acceder a una columna por su nombre devuelve una `Series`, que es la columna
con su nombre y su tipo.

```python
columna = ventas["monto"]
print(type(columna).__name__)
print(columna.name, columna.dtype)
print(columna.sum())
```

```salida
Series
monto Float64
4080.0
```

```ejercicio
# Enunciado
Completa el método que suma todos los valores de la columna.

# Plantilla
t = pl.DataFrame({"m": [100.0, 250.0]})
print(t["m"].___())

# Esperado
350.0

# Pista
Tres letras: la palabra inglesa para «suma».
```

# Cierre

Ya está lo mínimo: construir una tabla, saber su forma, sus tipos y sus huecos,
y sacar los datos para comprobarlos.

La sesión siguiente entra en lo que distingue de verdad a Polars: las
expresiones, que son la forma de decir qué se quiere calcular sin calcularlo
todavía.
