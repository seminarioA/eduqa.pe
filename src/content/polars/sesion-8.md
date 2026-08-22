---
numero: 8
titulo: "Un pipeline de principio a fin"
---

# Lo que se va a construir

Un pipeline que parte de dos archivos CSV con datos sucios y termina en una
tabla de resultados por región, comprobando en cada paso que no se pierde ni se
duplica nada.

Todo lo de las sesiones anteriores aparece aquí en el orden en que se usa de
verdad.

# Los datos de partida

Se escriben como texto para que el curso sea reproducible. En un caso real
serían archivos en disco y `scan_csv` en lugar de `read_csv`.

```python
import io

csv_ventas = """vendedor_id,ciudad,monto,fecha
1, Piura ,1200.50,2026-01-05
2,LIMA,850.00,2026-01-07
1,piura,,2026-01-09
3,Lima,1600.75,2026-01-11
2,Lima,no disponible,2026-01-12
"""

csv_vendedores = """vendedor_id,nombre,equipo
1,Ana,Norte
2,Luis,Centro
4,Rosa,Sur
"""

ventas = pl.read_csv(io.StringIO(csv_ventas))
vendedores = pl.read_csv(io.StringIO(csv_vendedores))
print(ventas.dtypes)
print("filas de partida:", ventas.height)
```

```salida
[Int64, String, String, String]
filas de partida: 5
```

> Nota: `monto` llegó como texto, no como número, porque una de sus celdas dice
> «no disponible». Basta un valor así en toda la columna para que el tipo caiga
> a texto, y con él cualquier suma.

```ejercicio
# Enunciado
Completa el tipo al que Polars degrada una columna numérica que trae texto.

# Plantilla
import io
t = pl.read_csv(io.StringIO("n\n1\nhola\n"))
print(t.dtypes == [pl.___])

# Esperado
True

# Pista
Seis letras: el tipo de las cadenas de caracteres.
```

# Paso 1 — Normalizar el texto

Piura aparece con espacios, en minúsculas y en mayúsculas. Son la misma ciudad
y hay que dejarlas iguales antes de agrupar.

```python
limpio = ventas.with_columns(
    pl.col("ciudad").str.strip_chars().str.to_lowercase()
)
print(limpio["ciudad"].unique().sort().to_list())
```

```salida
['lima', 'piura']
```

```ejercicio
# Enunciado
Completa el método que elimina los espacios sobrantes a ambos lados del texto.

# Plantilla
t = pl.DataFrame({"c": ["  lima  "]})
print(t.with_columns(pl.col("c").str.___()).to_series().to_list())

# Esperado
['lima']

# Pista
Dos palabras unidas por guion bajo: «recortar» y «caracteres», en inglés.
```

# Paso 2 — Convertir los tipos

El importe pasa a número. Lo que no se pueda convertir se queda en nulo, pero
se cuenta: un dato descartado en silencio es un dato perdido.

```python
convertido = limpio.with_columns(
    pl.col("monto").cast(pl.Float64, strict=False)
)
print("no convertidos:", convertido["monto"].null_count())
print(convertido["monto"].to_list())
```

```salida
no convertidos: 2
[1200.5, 850.0, None, 1600.75, None]
```

> Nota: Son dos nulos, no uno: el «no disponible» y la celda que ya venía
> vacía. Distinguirlos importa, porque el primero es un error de captura y el
> segundo puede ser una venta anulada.

```ejercicio
# Enunciado
Completa el tipo decimal al que se convierte el importe.

# Plantilla
t = pl.DataFrame({"m": ["1.5"]})
print(t.with_columns(pl.col("m").cast(pl.___)).to_series().to_list())

# Esperado
[1.5]

# Pista
Siete caracteres: «flotante» en inglés y el número de bits.
```

# Paso 3 — Decidir qué hacer con lo que falta

Aquí se descartan las filas sin importe, porque una venta sin monto no puede
sumarse. Es una decisión explícita, y queda registrada en el recuento.

```python
antes = convertido.height
con_monto = convertido.drop_nulls(subset="monto")
print(f"{antes} filas -> {con_monto.height} filas ({antes - con_monto.height} descartadas)")
```

```salida
5 filas -> 3 filas (2 descartadas)
```

```ejercicio
# Enunciado
Completa el argumento que limita el descarte a una sola columna.

# Plantilla
t = pl.DataFrame({"a": [1, None], "b": [None, 2]})
print(t.drop_nulls(___="a").to_dicts())

# Esperado
[{'a': 1, 'b': None}]

# Pista
Seis letras: «subconjunto» en inglés.
```

# Paso 4 — Comprobar antes de unir

Antes de cruzar con la tabla de vendedores, se mira qué identificadores no
existen allí. Con `anti` la respuesta es inmediata.

```python
huerfanas = con_monto.join(vendedores, on="vendedor_id", how="anti")
print("ventas sin vendedor conocido:", huerfanas.height)
print(huerfanas.select("vendedor_id", "monto").to_dicts())
```

```salida
ventas sin vendedor conocido: 1
[{'vendedor_id': 3, 'monto': 1600.75}]
```

> Nota: Ese vendedor 3 no es un fallo del código: es un dato que alguien tiene
> que arreglar en el origen. Detectarlo aquí y decirlo es parte del trabajo; lo
> que no vale es dejar que un `inner join` lo haga desaparecer sin que nadie se
> entere.

```ejercicio
# Enunciado
Completa el tipo de unión que devuelve solo las filas sin correspondencia.

# Plantilla
a = pl.DataFrame({"k": [1, 7]})
b = pl.DataFrame({"k": [1]})
print(a.join(b, on="k", how="___").height)

# Esperado
1

# Pista
Cuatro letras: el prefijo que significa «opuesto».
```

# Paso 5 — Unir conservando el detalle

Se usa `left` para no perder ninguna venta, y el equipo desconocido se rellena
con una etiqueta explícita en lugar de dejar un nulo que después sumaría mal.

```python
unido = (
    con_monto.join(vendedores, on="vendedor_id", how="left")
    .with_columns(pl.col("equipo").fill_null("sin asignar"))
)
print("filas tras unir:", unido.height, "(antes:", con_monto.height, ")")
print(unido.select("vendedor_id", "equipo", "monto").to_dicts())
```

```salida
filas tras unir: 3 (antes: 3 )
[{'vendedor_id': 1, 'equipo': 'Norte', 'monto': 1200.5}, {'vendedor_id': 2, 'equipo': 'Centro', 'monto': 850.0}, {'vendedor_id': 3, 'equipo': 'sin asignar', 'monto': 1600.75}]
```

```ejercicio
# Enunciado
Completa el método que sustituye los ausentes por una etiqueta.

# Plantilla
t = pl.DataFrame({"e": ["Norte", None]})
print(t.with_columns(pl.col("e").___("sin asignar")).to_series().to_list())

# Esperado
['Norte', 'sin asignar']

# Pista
Dos palabras unidas por guion bajo: «rellenar» y «nulo», en inglés.
```

# Paso 6 — El resultado

Con los datos ya limpios y completos, la agregación es la parte corta. Siempre
ordenada, para que la salida no dependa del azar.

```python
resumen = (
    unido.group_by("ciudad")
    .agg(
        pl.col("monto").sum().round(2).alias("total"),
        pl.len().alias("operaciones"),
    )
    .sort("total", descending=True)
)
print(resumen.to_dicts())
```

```salida
[{'ciudad': 'lima', 'total': 2450.75, 'operaciones': 2}, {'ciudad': 'piura', 'total': 1200.5, 'operaciones': 1}]
```

```ejercicio
# Enunciado
Completa el método que ordena el resumen por el total de mayor a menor.

# Plantilla
t = pl.DataFrame({"c": ["a", "b"], "v": [10, 90]})
print(t.___("v", descending=True).to_dicts())

# Esperado
[{'c': 'b', 'v': 90}, {'c': 'a', 'v': 10}]

# Pista
Cuatro letras: el verbo inglés «ordenar».
```

# Paso 7 — Comprobar el total

La última comprobación es la que más veces salva: que la suma del resumen
coincida con la suma de los datos que entraron.

```python
total_detalle = unido["monto"].sum()
total_resumen = resumen["total"].sum()
print("detalle:", round(total_detalle, 2))
print("resumen:", round(total_resumen, 2))
print("cuadra:", round(total_detalle, 2) == round(total_resumen, 2))
```

```salida
detalle: 3651.25
resumen: 3651.25
cuadra: True
```

> Nota: Cuadrar aquí no significa que los datos sean correctos: significa que
> la agregación no perdió ni duplicó nada. Que las dos ventas descartadas
> debieran estar es una pregunta distinta, y se responde con quien produjo el
> archivo.

```ejercicio
# Enunciado
Completa la función que redondea los dos totales antes de compararlos.

# Plantilla
a, b = 10.004, 10.001
redondear = ___
print(redondear(a, 2) == redondear(b, 2))

# Esperado
True

# Pista
Cinco letras: la función incorporada de Python que redondea.
```

# El pipeline entero, perezoso

Escrito de corrido y en modo perezoso, el proceso completo es una sola
descripción que se ejecuta una vez.

```python
resultado = (
    pl.read_csv(io.StringIO(csv_ventas)).lazy()
    .with_columns(pl.col("ciudad").str.strip_chars().str.to_lowercase())
    .with_columns(pl.col("monto").cast(pl.Float64, strict=False))
    .drop_nulls(subset="monto")
    .join(vendedores.lazy(), on="vendedor_id", how="left")
    .with_columns(pl.col("equipo").fill_null("sin asignar"))
    .group_by("ciudad")
    .agg(pl.col("monto").sum().round(2).alias("total"), pl.len().alias("operaciones"))
    .sort("total", descending=True)
    .collect()
)
print(resultado.to_dicts())
print("coincide con el paso a paso:", resultado.to_dicts() == resumen.to_dicts())
```

```salida
[{'ciudad': 'lima', 'total': 2450.75, 'operaciones': 2}, {'ciudad': 'piura', 'total': 1200.5, 'operaciones': 1}]
coincide con el paso a paso: True
```

```ejercicio
# Enunciado
Completa el método que ejecuta el plan perezoso al final de la cadena.

# Plantilla
import io
print(pl.read_csv(io.StringIO("a\n1\n")).lazy().___().to_dicts())

# Esperado
[{'a': 1}]

# Pista
Siete letras: el verbo inglés «recolectar».
```

# Cierre

El recorrido está completo: tablas y tipos, expresiones, filtros, agrupaciones,
uniones, limpieza y evaluación perezosa, terminando en un proceso que comprueba
su propio resultado.

El paso siguiente natural es sacar los datos de la memoria: leer y escribir
Parquet, particionar por fecha y consultar archivos sin cargarlos enteros, que
es donde el modo perezoso deja de ser una comodidad y pasa a ser la única forma
de trabajar.
