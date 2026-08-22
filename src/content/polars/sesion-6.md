---
numero: 6
titulo: "Nulos, tipos y conversiones"
---

# Lo que llega no es lo que se espera

Un archivo real trae importes escritos como texto, fechas en tres formatos
distintos y celdas vacías. Antes de calcular hay que dejar cada columna con el
tipo que le corresponde y decidir qué se hace con lo que falta.

# Distinguir nulo de vacío

Un nulo es la ausencia de valor. Una cadena vacía es un valor: un texto de
longitud cero. Confundirlos hace que los recuentos no cuadren.

```python
datos = pl.DataFrame({"nombre": ["Ana", "", None, "Luis"]})
print("nulos:  ", datos["nombre"].null_count())
print("vacíos: ", datos.filter(pl.col("nombre") == "").height)
print("con texto:", datos.filter(pl.col("nombre").is_not_null() & (pl.col("nombre") != "")).height)
```

```salida
nulos:   1
vacíos:  1
con texto: 2
```

> Nota: `null_count()` devuelve 1, no 2. Para Polars la cadena vacía es un dato
> presente. Al leer un CSV conviene decidir explícitamente si una celda vacía
> debe convertirse en nulo, porque de eso dependen todos los recuentos
> posteriores.

```ejercicio
# Enunciado
Completa el método que comprueba que el valor no es nulo.

# Plantilla
t = pl.DataFrame({"x": [1, None, 3]})
print(t.filter(pl.col("x").___()).to_series().to_list())

# Esperado
[1, 3]

# Pista
Tres palabras unidas por guiones bajos: ser, no, y nulo, en inglés.
```

# Rellenar lo que falta

`fill_null` sustituye los nulos por un valor. Cuál sea ese valor es una
decisión de negocio, no técnica.

```python
cantidades = pl.DataFrame({"unidades": [10, None, 30, None]})
print(cantidades.with_columns(pl.col("unidades").fill_null(0)).to_series().to_list())
print(cantidades.with_columns(
    pl.col("unidades").fill_null(pl.col("unidades").mean())
).to_series().to_list())
```

```salida
[10, 0, 30, 0]
[10.0, 20.0, 30.0, 20.0]
```

> Nota: Rellenar con cero dice «no hubo unidades»; rellenar con la media dice
> «hubo, pero no se registró». Son afirmaciones distintas sobre la realidad y
> producen informes distintos. Si no se sabe cuál es cierta, lo honesto es
> dejar el nulo y que el cálculo lo excluya.

```ejercicio
# Enunciado
Completa el método que sustituye los valores ausentes por uno dado.

# Plantilla
t = pl.DataFrame({"n": [1, None]})
print(t.with_columns(pl.col("n").___(0)).to_series().to_list())

# Esperado
[1, 0]

# Pista
Dos palabras unidas por guion bajo: «rellenar» y «nulo» en inglés.
```

# Descartar las filas incompletas

`drop_nulls` elimina las filas que tienen algún nulo, o solo las que lo tienen
en las columnas indicadas.

```python
tabla = pl.DataFrame({
    "a": [1, None, 3],
    "b": ["x", "y", None],
})
print("todas las columnas:", tabla.drop_nulls().to_dicts())
print("solo la columna a: ", tabla.drop_nulls(subset="a").to_dicts())
```

```salida
todas las columnas: [{'a': 1, 'b': 'x'}]
solo la columna a:  [{'a': 1, 'b': 'x'}, {'a': 3, 'b': None}]
```

```ejercicio
# Enunciado
Completa el método que descarta las filas con valores ausentes.

# Plantilla
t = pl.DataFrame({"a": [1, None, 3]})
print(t.___().to_series().to_list())

# Esperado
[1, 3]

# Pista
Dos palabras unidas por guion bajo: «descartar» y el plural de nulo, en inglés.
```

# Cambiar el tipo de una columna

`cast` convierte una columna a otro tipo. Es lo primero que hay que hacer con
una columna numérica que llegó como texto.

```python
texto = pl.DataFrame({"importe": ["120", "45", "1300"]})
print(texto.dtypes)
convertido = texto.with_columns(pl.col("importe").cast(pl.Int64))
print(convertido.dtypes)
print(convertido["importe"].sum())
```

```salida
[String]
[Int64]
1465
```

```ejercicio
# Enunciado
Completa el método que convierte una columna a otro tipo.

# Plantilla
t = pl.DataFrame({"n": ["7", "8"]})
print(t.with_columns(pl.col("n").___(pl.Int64))["n"].sum())

# Esperado
15

# Pista
Cuatro letras: el verbo inglés que también significa «moldear».
```

# Cuando la conversión no puede hacerse

Si un valor no se puede convertir, `cast` lanza un error. Con `strict=False`
devuelve nulo en su lugar, que a veces es lo que se quiere y a veces esconde el
problema.

```python
sucio = pl.DataFrame({"importe": ["120", "no disponible", "45"]})
suave = sucio.with_columns(pl.col("importe").cast(pl.Int64, strict=False))
print(suave.to_dicts())
print("no convertidos:", suave["importe"].null_count())
```

```salida
[{'importe': 120}, {'importe': None}, {'importe': 45}]
no convertidos: 1
```

> Nota: `strict=False` no arregla el dato, lo esconde. Es útil cuando después
> se cuenta cuántos quedaron nulos y se decide qué hacer con ellos; es
> peligroso cuando se usa para que el programa deje de quejarse.

```ejercicio
# Enunciado
Completa el argumento que convierte en nulo lo que no se puede transformar.

# Plantilla
t = pl.DataFrame({"n": ["5", "x"]})
print(t.with_columns(pl.col("n").cast(pl.Int64, ___=False)).to_dicts())

# Esperado
[{'n': 5}, {'n': None}]

# Pista
Seis letras: «estricto» en inglés.
```

# Limpiar texto

Las operaciones de texto viven bajo el espacio `str`. Quitar espacios y unificar
mayúsculas suele resolver la mitad de los duplicados aparentes.

```python
nombres = pl.DataFrame({"ciudad": [" Piura", "PIURA ", "lima"]})
limpio = nombres.with_columns(
    pl.col("ciudad").str.strip_chars().str.to_lowercase()
)
print(limpio.to_series().to_list())
print("valores distintos:", limpio["ciudad"].n_unique())
```

```salida
['piura', 'piura', 'lima']
valores distintos: 2
```

```ejercicio
# Enunciado
Completa el método que pasa el texto a minúsculas.

# Plantilla
t = pl.DataFrame({"c": ["LIMA"]})
print(t.with_columns(pl.col("c").str.___()).to_series().to_list())

# Esperado
['lima']

# Pista
Tres palabras unidas por guiones bajos: «a», «minúscula» y «caja», en inglés.
```

# Leer desde un archivo

`read_csv` acepta un flujo de texto, así que un CSV escrito en el propio código
sirve para practicar sin descargar nada.

```python
import io

csv = "producto,precio,stock\ncable,15.5,40\nmonitor,890.0,\nteclado,120.0,8\n"
tabla = pl.read_csv(io.StringIO(csv))
print(tabla.dtypes)
print(tabla.null_count().to_dicts())
```

```salida
[String, Float64, Int64]
[{'producto': 0, 'precio': 0, 'stock': 1}]
```

> Doc: [Valores ausentes](https://docs.pola.rs/user-guide/expressions/missing-data/)

```ejercicio
# Enunciado
Completa la función que lee un CSV y devuelve una tabla.

# Plantilla
import io
print(pl.___(io.StringIO("a,b\n1,2\n")).to_dicts())

# Esperado
[{'a': 1, 'b': 2}]

# Pista
Dos palabras unidas por guion bajo: «leer» y el nombre del formato.
```

# Cierre

Con esto una tabla que llega sucia queda utilizable: los tipos correctos, los
nulos decididos y el texto normalizado.

Todo lo hecho hasta aquí se ejecuta al momento. La sesión siguiente cambia eso:
describir el trabajo entero antes de ejecutar ni una línea.
