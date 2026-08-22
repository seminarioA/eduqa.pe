---
numero: 7
titulo: "El modo perezoso"
---

# Describir antes de ejecutar

Hasta aquí cada operación se ha ejecutado en cuanto se escribía. Eso se llama
modo inmediato y tiene un coste: si se filtran mil filas después de haber
calculado veinte columnas, esas columnas se calcularon para filas que se van a
descartar.

El modo perezoso invierte el orden. Primero se describe el trabajo entero, y
solo al pedir el resultado Polars mira el plan completo, lo reorganiza y lo
ejecuta.

# Un plan en lugar de una tabla

`lazy()` convierte una tabla en un `LazyFrame`. Las operaciones sobre él no
calculan nada: acumulan pasos.

```python
ventas = pl.DataFrame({
    "region": ["Norte", "Sur", "Norte", "Sur"],
    "vendedor": ["Ana", "Luis", "Marta", "Luis"],
    "monto": [1200.0, 850.0, 430.0, 1600.0],
})
plan = ventas.lazy().filter(pl.col("monto") > 500).select("region", "monto")
print(type(plan).__name__)
```

```salida
LazyFrame
```

```ejercicio
# Enunciado
Completa el método que convierte una tabla en un plan sin ejecutar nada.

# Plantilla
t = pl.DataFrame({"a": [1]})
print(type(t.___()).__name__)

# Esperado
LazyFrame

# Pista
Cuatro letras: «perezoso» en inglés.
```

# Pedir el resultado

`collect()` es la orden de ejecutar. Hasta que se llama, no se ha tocado ni un
dato.

```python
print(plan.collect().to_dicts())
```

```salida
[{'region': 'Norte', 'monto': 1200.0}, {'region': 'Sur', 'monto': 850.0}, {'region': 'Sur', 'monto': 1600.0}]
```

> Nota: Todo el trabajo ocurre en esa única llamada. Por eso, si un cálculo
> perezoso parece instantáneo, casi siempre es que falta el `collect` y lo que
> se está midiendo es el tiempo de construir la descripción.

```ejercicio
# Enunciado
Completa el método que ejecuta el plan y devuelve la tabla.

# Plantilla
t = pl.DataFrame({"a": [1, 2]})
print(t.lazy().filter(pl.col("a") > 1).___().to_dicts())

# Esperado
[{'a': 2}]

# Pista
Siete letras: el verbo inglés «recolectar».
```

# Ver el plan

`explain()` muestra lo que Polars va a hacer realmente, que no tiene por qué
coincidir con el orden en que se escribió.

```python
consulta = (
    ventas.lazy()
    .with_columns((pl.col("monto") * 1.18).alias("con_igv"))
    .filter(pl.col("region") == "Norte")
    .select("vendedor", "con_igv")
)
print(consulta.explain())
```

```salida
simple π 2/2 ["vendedor", "con_igv"]
   WITH_COLUMNS:
   [[(col("monto")) * (1.18)].alias("con_igv")] 
    FILTER [(col("region")) == ("Norte")]
    FROM
      DF ["region", "vendedor", "monto"]; PROJECT["vendedor", "region", "monto"] 3/3 COLUMNS
```

> Nota: El plan se lee de abajo arriba. Lo que interesa comprobar es dónde
> quedó el filtro: si aparece por debajo del cálculo de la columna, Polars lo
> adelantó y solo calculará `con_igv` para las filas del Norte.

```ejercicio
# Enunciado
Completa el método que muestra el plan de ejecución.

# Plantilla
t = pl.DataFrame({"a": [1]})
print(type(t.lazy().___()).__name__)

# Esperado
str

# Pista
Siete letras: el verbo inglés «explicar».
```

# El filtro que se adelanta

Esta reorganización tiene nombre: empuje de predicados. La condición viaja
hacia el origen de los datos para que lo descartado no llegue a calcularse.

```python
plan_texto = (
    ventas.lazy()
    .with_columns((pl.col("monto") * 2).alias("doble"))
    .filter(pl.col("region") == "Sur")
    .explain()
)
# La posición relativa dice si el filtro se adelantó al cálculo.
print("el filtro aparece antes que el cálculo:",
      plan_texto.index("FILTER") > plan_texto.index("doble"))
```

```salida
el filtro aparece antes que el cálculo: True
```

```ejercicio
# Enunciado
Completa el método de texto que localiza la posición de una palabra en la cadena.

# Plantilla
plan = "SELECT luego FILTER"
print(plan.___("FILTER"))

# Esperado
13

# Pista
Cinco letras: el verbo inglés «indexar», que devuelve la posición.
```

# Solo las columnas que se usan

La otra optimización es la proyección: si el plan termina en tres columnas,
Polars no lee las otras veinte.

```python
ancha = pl.DataFrame({f"c{i}": [i, i + 1] for i in range(6)})
plan_estrecho = ancha.lazy().select("c0", "c5")
print(plan_estrecho.collect().columns)
print("columnas en el origen:", len(ancha.columns))
```

```salida
['c0', 'c5']
columnas en el origen: 6
```

> Nota: Con una tabla en memoria el ahorro es pequeño. Con `scan_csv` o
> `scan_parquet` sobre un archivo grande, es la diferencia entre leer el archivo
> entero y leer dos columnas.

```ejercicio
# Enunciado
Completa el contexto que reduce el plan a un subconjunto de columnas.

# Plantilla
t = pl.DataFrame({"a": [1], "b": [2], "c": [3]})
print(t.lazy().___("b").collect().columns)

# Esperado
['b']

# Pista
El mismo contexto que evalúa expresiones y se queda solo con lo pedido.
```

# Leer sin cargar

`scan_csv` devuelve un plan en lugar de una tabla: no lee el archivo hasta que
se llama a `collect`, y para entonces ya sabe qué columnas y qué filas hacen
falta.

```python
import io

csv = "ciudad,ventas,devoluciones\nPiura,100,2\nLima,300,9\nPiura,150,1\n"
plan_csv = pl.scan_csv(io.StringIO(csv)).filter(pl.col("ciudad") == "Piura").select("ventas")
print(type(plan_csv).__name__)
print(plan_csv.explain())
```

```salida
LazyFrame
simple π 1/1 ["ventas"]
  Csv SCAN [62 in-mem bytes]
  PROJECT 2/3 COLUMNS
  SELECTION: [(col("ciudad")) == ("Piura")]
```

> Nota: En el plan aparece `PROJECT 1/3 COLUMNS`: de las tres columnas del
> archivo va a leer una sola, y el filtro por ciudad viaja hasta el propio
> `SCAN`. Eso es lo que ahorra el modo perezoso frente a cargar el CSV entero y
> descartar después.

La ejecución de ese plan es la línea que falta. No se puede lanzar desde aquí:
la compilación de Polars que corre en el navegador no incluye el motor de
lectura por lotes, y al pedir el resultado de un `scan_csv` aborta.

```python !sin-consola
# Fuera del navegador, esta es la línea que ejecuta el plan.
print(plan_csv.collect().to_series().to_list())
# [100, 150]
```

> Nota: Es una limitación de esta compilación, no de Polars. En un Python de
> escritorio `scan_csv(...).collect()` funciona y es la forma recomendada de
> leer archivos grandes. Aquí se enseña el plan, que es la parte que hay que
> saber leer; el resto de la sesión usa `.lazy()` sobre tablas en memoria, que
> sí se ejecuta.

```ejercicio
# Enunciado
Completa la función que abre un CSV en modo perezoso, sin leerlo todavía.

# Plantilla
import io
print(type(pl.___(io.StringIO("a\n1\n"))).__name__)

# Esperado
LazyFrame

# Pista
Dos palabras unidas por guion bajo: «escanear» y el nombre del formato.
```

# Cuándo no usarlo

El modo perezoso no siempre gana. Para una tabla pequeña que se explora paso a
paso, el modo inmediato es más cómodo porque cada línea devuelve algo que se
puede mirar.

La regla práctica es: perezoso para lo que se ejecuta muchas veces o sobre
datos grandes, inmediato para explorar.

```python
inmediato = ventas.filter(pl.col("monto") > 500).height
perezoso = ventas.lazy().filter(pl.col("monto") > 500).collect().height
print("mismo resultado:", inmediato == perezoso)
```

```salida
mismo resultado: True
```

> Doc: [API perezosa](https://docs.pola.rs/user-guide/lazy/)

```ejercicio
# Enunciado
Completa el operador que comprueba que los dos caminos dan el mismo resultado.

# Plantilla
a = pl.DataFrame({"n": [1, 2]}).filter(pl.col("n") > 1).height
b = pl.DataFrame({"n": [1, 2]}).lazy().filter(pl.col("n") > 1).collect().height
print(a ___ b)

# Esperado
True

# Pista
Dos caracteres: la comparación de igualdad.
```

# Cierre

El modo perezoso separa la descripción del cálculo, y esa separación es la que
permite adelantar filtros y saltarse columnas.

La última sesión junta todo en un pipeline completo: leer, limpiar, unir,
agrupar y comprobar que el resultado es el que se esperaba.
