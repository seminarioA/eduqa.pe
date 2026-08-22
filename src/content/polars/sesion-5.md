---
numero: 5
titulo: "Unir tablas"
---

# Los datos viven repartidos

Una tabla de ventas guarda el identificador del vendedor, no su nombre ni su
región. El nombre está en otra tabla. Juntarlas es unir, y es la operación que
convierte identificadores en información legible.

```python
ventas = pl.DataFrame({
    "vendedor_id": [1, 2, 1, 3],
    "monto": [1200.0, 850.0, 430.0, 1600.0],
})
vendedores = pl.DataFrame({
    "vendedor_id": [1, 2, 4],
    "nombre": ["Ana", "Luis", "Rosa"],
})
print(ventas.join(vendedores, on="vendedor_id", how="inner").sort("monto").to_dicts())
```

```salida
[{'vendedor_id': 1, 'monto': 430.0, 'nombre': 'Ana'}, {'vendedor_id': 2, 'monto': 850.0, 'nombre': 'Luis'}, {'vendedor_id': 1, 'monto': 1200.0, 'nombre': 'Ana'}]
```

> Nota: El vendedor 3 tiene una venta pero no está en la tabla de vendedores, y
> la Rosa del identificador 4 está pero no vendió nada. Ninguno de los dos
> aparece en el resultado. Esa desaparición silenciosa es el motivo por el que
> conviene mirar el número de filas antes y después de cada unión.

```ejercicio
# Enunciado
Completa el método que combina dos tablas por una columna común.

# Plantilla
a = pl.DataFrame({"k": [1], "x": ["p"]})
b = pl.DataFrame({"k": [1], "y": ["q"]})
print(a.___(b, on="k", how="inner").to_dicts())

# Esperado
[{'k': 1, 'x': 'p', 'y': 'q'}]

# Pista
Cuatro letras: la palabra inglesa para «unir», la misma que en SQL.
```

# Conservar todas las filas de la izquierda

`left` mantiene todas las filas de la primera tabla y rellena con nulos lo que
no encuentra en la segunda.

```python
completo = ventas.join(vendedores, on="vendedor_id", how="left").sort("monto")
print(completo.to_dicts())
print("nulos en nombre:", completo["nombre"].null_count())
```

```salida
[{'vendedor_id': 1, 'monto': 430.0, 'nombre': 'Ana'}, {'vendedor_id': 2, 'monto': 850.0, 'nombre': 'Luis'}, {'vendedor_id': 1, 'monto': 1200.0, 'nombre': 'Ana'}, {'vendedor_id': 3, 'monto': 1600.0, 'nombre': None}]
nulos en nombre: 1
```

```ejercicio
# Enunciado
Completa el tipo de unión que conserva todas las filas de la tabla izquierda.

# Plantilla
a = pl.DataFrame({"k": [1, 2], "x": ["p", "q"]})
b = pl.DataFrame({"k": [1], "y": ["z"]})
print(a.join(b, on="k", how="___").sort("k")["y"].to_list())

# Esperado
['z', None]

# Pista
Cuatro letras: «izquierda» en inglés.
```

# Contar cuántas filas se pierden

Comparar la altura antes y después es la comprobación más barata que existe, y
detecta tanto las filas que se pierden como las que se multiplican.

```python
print("ventas originales:", ventas.height)
print("tras inner join: ", ventas.join(vendedores, on="vendedor_id", how="inner").height)
print("tras left join:  ", ventas.join(vendedores, on="vendedor_id", how="left").height)
```

```salida
ventas originales: 4
tras inner join:  3
tras left join:   4
```

```ejercicio
# Enunciado
Completa el atributo que devuelve el número de filas de una tabla.

# Plantilla
t = pl.DataFrame({"a": [1, 2, 3]})
print(t.___)

# Esperado
3

# Pista
Seis letras: «altura» en inglés.
```

# Saber qué coincide sin traer columnas

`semi` se queda con las filas de la izquierda que **tienen** correspondencia,
sin añadir ninguna columna. `anti` se queda con las que **no** la tienen.

```python
print("con vendedor conocido:", ventas.join(vendedores, on="vendedor_id", how="semi").to_dicts())
print("huérfanas:           ", ventas.join(vendedores, on="vendedor_id", how="anti").to_dicts())
```

```salida
con vendedor conocido: [{'vendedor_id': 1, 'monto': 1200.0}, {'vendedor_id': 2, 'monto': 850.0}, {'vendedor_id': 1, 'monto': 430.0}]
huérfanas:            [{'vendedor_id': 3, 'monto': 1600.0}]
```

> Nota: `anti` es la herramienta de diagnóstico. Antes de cargar datos en
> ningún sitio, responde a «qué referencias apuntan a algo que no existe», que
> es justo lo que una clave foránea rechazaría más tarde y con peor mensaje.

```ejercicio
# Enunciado
Completa el tipo de unión que devuelve las filas sin correspondencia.

# Plantilla
a = pl.DataFrame({"k": [1, 9]})
b = pl.DataFrame({"k": [1]})
print(a.join(b, on="k", how="___").to_series().to_list())

# Esperado
[9]

# Pista
Cuatro letras: el prefijo que significa «contra» u «opuesto».
```

# Cuando las columnas se llaman distinto

Si la clave tiene otro nombre en cada tabla, `left_on` y `right_on` lo indican
sin necesidad de renombrar antes.

```python
otra = pl.DataFrame({"id_persona": [1, 2], "ciudad": ["Piura", "Lima"]})
print(ventas.join(otra, left_on="vendedor_id", right_on="id_persona", how="inner")
      .sort("monto").to_dicts())
```

```salida
[{'vendedor_id': 1, 'monto': 430.0, 'ciudad': 'Piura'}, {'vendedor_id': 2, 'monto': 850.0, 'ciudad': 'Lima'}, {'vendedor_id': 1, 'monto': 1200.0, 'ciudad': 'Piura'}]
```

```ejercicio
# Enunciado
Completa el argumento que nombra la columna clave de la tabla derecha.

# Plantilla
a = pl.DataFrame({"ka": [1], "v": [10]})
b = pl.DataFrame({"kb": [1], "w": [20]})
print(a.join(b, left_on="ka", ___="kb", how="inner").to_dicts())

# Esperado
[{'ka': 1, 'v': 10, 'w': 20}]

# Pista
Dos palabras unidas por guion bajo: «derecha» y la preposición «sobre».
```

# Apilar tablas

Unir no siempre es por columnas. Cuando dos tablas tienen la misma estructura y
lo que se quiere es juntar sus filas, se usa `concat`.

```python
enero = pl.DataFrame({"mes": ["enero"], "monto": [500.0]})
febrero = pl.DataFrame({"mes": ["febrero"], "monto": [700.0]})
print(pl.concat([enero, febrero]).to_dicts())
```

```salida
[{'mes': 'enero', 'monto': 500.0}, {'mes': 'febrero', 'monto': 700.0}]
```

```ejercicio
# Enunciado
Completa la función que apila varias tablas una debajo de otra.

# Plantilla
a = pl.DataFrame({"n": [1]})
b = pl.DataFrame({"n": [2]})
print(pl.___([a, b]).to_series().to_list())

# Esperado
[1, 2]

# Pista
Seis letras: la abreviatura inglesa de «concatenar».
```

# La unión que multiplica

Si la clave se repite en la tabla derecha, cada fila de la izquierda se
empareja con todas las coincidencias y el resultado crece.

```python
precios = pl.DataFrame({
    "producto": ["cable", "cable"],
    "precio": [15.0, 18.0],
})
compras = pl.DataFrame({"producto": ["cable"], "cantidad": [3]})
resultado = compras.join(precios, on="producto", how="inner")
print("filas de entrada:", compras.height)
print("filas de salida: ", resultado.height)
print(resultado.to_dicts())
```

```salida
filas de entrada: 1
filas de salida:  2
[{'producto': 'cable', 'cantidad': 3, 'precio': 15.0}, {'producto': 'cable', 'cantidad': 3, 'precio': 18.0}]
```

> Nota: Una fila entró y salieron dos, porque el precio del cable está
> duplicado. Si después se suma el importe, el total resulta el doble. Es el error
> silencioso más caro de una unión, y se detecta comprobando que la clave de la
> derecha sea única antes de unir.

> Doc: [Uniones](https://docs.pola.rs/user-guide/transformations/joins/)

```ejercicio
# Enunciado
Completa el método que cuenta los valores distintos, para comprobar si la clave se repite.

# Plantilla
t = pl.DataFrame({"k": ["a", "a"]})
print(t["k"].___() == t.height)

# Esperado
False

# Pista
Dos palabras unidas por guion bajo: la letra n y «único», en inglés.
```

# Cierre

Ya se combinan tablas por clave y se apilan por filas, y se sabe comprobar lo
que una unión se lleva o duplica.

Antes de automatizar nada queda el trabajo sucio: los datos reales llegan con
huecos y con tipos equivocados. Esa es la sesión siguiente.
