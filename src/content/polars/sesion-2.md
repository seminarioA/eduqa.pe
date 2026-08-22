---
numero: 2
titulo: "Expresiones: decir qué, no cómo"
---

# La idea central

Todo lo que Polars sabe hacer se escribe como una **expresión**: una
descripción de un cálculo que todavía no ha ocurrido.

`pl.col("monto") * 1.18` no multiplica nada. Construye un objeto que dice
«tomar la columna monto y multiplicarla por 1.18». El cálculo se hace cuando esa
expresión se entrega a un contexto, y no antes.

Esa demora es lo que permite mirar todas las expresiones juntas, ver que dos
piden lo mismo y calcularlo una sola vez.

# Una expresión no es un valor

Se ve directamente: al imprimir una expresión no aparece ningún número.

```python
expresion = pl.col("monto") * 1.18
print(type(expresion).__name__)
print(expresion)
```

```salida
Expr
[(col("monto")) * (dyn float: 1.18)]
```

> Nota: Es la diferencia práctica con Pandas. Allí `df["monto"] * 1.18` devuelve
> la columna ya multiplicada; aquí devuelve la receta. Por eso una expresión de
> Polars se puede guardar en una variable, reutilizar en varias tablas y
> componer con otras antes de que exista un solo resultado.

```ejercicio
# Enunciado
Completa la función que se refiere a una columna dentro de una expresión.

# Plantilla
e = pl.___("precio") * 2
print(type(e).__name__)

# Esperado
Expr

# Pista
Tres letras: la abreviatura inglesa de «columna».
```

# El contexto `select`

`select` es el contexto que evalúa expresiones y devuelve una tabla con el
resultado. Lo que no se pide, no aparece.

```python
productos = pl.DataFrame({
    "nombre": ["teclado", "monitor", "cable"],
    "precio": [120.0, 890.0, 15.0],
    "stock": [8, 3, 40],
})
print(productos.select(pl.col("nombre"), pl.col("precio")))
```

```salida
shape: (3, 2)
┌─────────┬────────┐
│ nombre  ┆ precio │
│ ---     ┆ ---    │
│ str     ┆ f64    │
╞═════════╪════════╡
│ teclado ┆ 120.0  │
│ monitor ┆ 890.0  │
│ cable   ┆ 15.0   │
└─────────┴────────┘
```

```ejercicio
# Enunciado
Completa el contexto que evalúa expresiones y devuelve solo las columnas pedidas.

# Plantilla
t = pl.DataFrame({"a": [1], "b": [2], "c": [3]})
print(t.___(pl.col("a"), pl.col("c")).columns)

# Esperado
['a', 'c']

# Pista
Seis letras: el mismo verbo que en SQL abre una consulta.
```

# Ponerle nombre al resultado

Una expresión calculada conserva el nombre de la columna de origen, lo que
provoca choques si se calculan dos cosas sobre la misma columna. `alias()` le
pone nombre al resultado.

```python
print(productos.select(
    pl.col("nombre"),
    (pl.col("precio") * 1.18).alias("precio_con_igv"),
    (pl.col("precio") * pl.col("stock")).alias("valor_inventario"),
))
```

```salida
shape: (3, 3)
┌─────────┬────────────────┬──────────────────┐
│ nombre  ┆ precio_con_igv ┆ valor_inventario │
│ ---     ┆ ---            ┆ ---              │
│ str     ┆ f64            ┆ f64              │
╞═════════╪════════════════╪══════════════════╡
│ teclado ┆ 141.6          ┆ 960.0            │
│ monitor ┆ 1050.2         ┆ 2670.0           │
│ cable   ┆ 17.7           ┆ 600.0            │
└─────────┴────────────────┴──────────────────┘
```

> Nota: Sin `alias`, las dos expresiones se llamarían `precio` y Polars daría un
> error de columna duplicada en lugar de quedarse con la última en silencio.
> Fallar es lo correcto: quedarse con una de las dos sin avisar es la clase de
> error que aparece semanas después en un informe.

```ejercicio
# Enunciado
Completa el método que le pone nombre al resultado de una expresión.

# Plantilla
t = pl.DataFrame({"p": [100.0]})
print(t.select((pl.col("p") * 2).___("doble")).columns)

# Esperado
['doble']

# Pista
Cinco letras: la palabra inglesa para «apodo» o «nombre alternativo».
```

# Añadir sin quitar

`select` se queda solo con lo pedido. `with_columns` conserva la tabla entera y
añade lo nuevo.

```python
ampliada = productos.with_columns(
    (pl.col("precio") * pl.col("stock")).alias("valor")
)
print(ampliada.columns)
print(ampliada.select("valor").to_series().to_list())
```

```salida
['nombre', 'precio', 'stock', 'valor']
[960.0, 2670.0, 600.0]
```

```ejercicio
# Enunciado
Completa el contexto que añade columnas conservando las que ya había.

# Plantilla
t = pl.DataFrame({"a": [2]})
print(t.___((pl.col("a") + 1).alias("b")).columns)

# Esperado
['a', 'b']

# Pista
Dos palabras unidas por guion bajo: «con» y el plural de columna.
```

# Varias columnas de una vez

Una expresión puede apuntar a varias columnas a la vez, y entonces se aplica a
todas ellas. Es la forma de evitar escribir lo mismo cinco veces.

```python
medidas = pl.DataFrame({"largo": [2.0, 4.0], "ancho": [3.0, 5.0]})
print(medidas.select(pl.col("largo", "ancho") * 100))
```

```salida
shape: (2, 2)
┌───────┬───────┐
│ largo ┆ ancho │
│ ---   ┆ ---   │
│ f64   ┆ f64   │
╞═══════╪═══════╡
│ 200.0 ┆ 300.0 │
│ 400.0 ┆ 500.0 │
└───────┴───────┘
```

> Doc: [Expresiones](https://docs.pola.rs/user-guide/concepts/expressions-and-contexts/)

```ejercicio
# Enunciado
Completa el nombre de la segunda columna para que la expresión se aplique a las dos.

# Plantilla
t = pl.DataFrame({"x": [1], "y": [2]})
print(t.select(pl.col("x", "___") * 10).to_dicts())

# Esperado
[{'x': 10, 'y': 20}]

# Pista
Es la otra columna de la tabla.
```

# Decidir por filas

`when().then().otherwise()` es la expresión condicional: evalúa una condición
fila por fila y devuelve un valor u otro.

```python
etiquetado = productos.with_columns(
    pl.when(pl.col("stock") < 5)
      .then(pl.lit("reponer"))
      .otherwise(pl.lit("suficiente"))
      .alias("estado")
)
print(etiquetado.select("nombre", "estado").to_dicts())
```

```salida
[{'nombre': 'teclado', 'estado': 'suficiente'}, {'nombre': 'monitor', 'estado': 'reponer'}, {'nombre': 'cable', 'estado': 'suficiente'}]
```

> Nota: `pl.lit()` envuelve un valor fijo para que Polars lo trate como parte de
> la expresión y no como el nombre de una columna. Sin él, un texto suelto en
> algunos contextos se interpreta como una referencia a una columna que no
> existe.

```ejercicio
# Enunciado
Completa la parte de la condición que da el valor cuando no se cumple.

# Plantilla
t = pl.DataFrame({"n": [1, 9]})
print(t.select(
    pl.when(pl.col("n") > 5).then(pl.lit("alto")).___(pl.lit("bajo")).alias("e")
).to_series().to_list())

# Esperado
['bajo', 'alto']

# Pista
Nueve letras: la palabra inglesa para «en caso contrario».
```

# Encadenar operaciones

Las expresiones se componen: el resultado de una es la entrada de la siguiente,
y se leen de izquierda a derecha en el orden en que ocurren.

```python
print(productos.select(
    pl.col("precio").mul(1.18).round(2).alias("con_igv")
).to_series().to_list())
```

```salida
[141.6, 1050.2, 17.7]
```

```ejercicio
# Enunciado
Completa el método que redondea el resultado a dos decimales.

# Plantilla
t = pl.DataFrame({"p": [10.0]})
print(t.select(pl.col("p").mul(1.185).___(2)).to_series().to_list())

# Esperado
[11.85]

# Pista
Cinco letras: el verbo inglés «redondear».
```

# Cierre

Una expresión describe un cálculo; un contexto lo ejecuta. `select` se queda
con lo pedido, `with_columns` añade sobre lo que ya hay.

Con eso ya se transforma una tabla. La sesión siguiente añade las dos
operaciones que más se usan sobre ella: quedarse con unas filas y ponerlas en
orden.
