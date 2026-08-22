---
numero: 3
titulo: "Filtrar y ordenar"
---

# Quedarse con una parte

Casi ninguna pregunta se responde sobre la tabla entera. Se responde sobre las
filas de un mes, de una región o de los pedidos que superan cierto importe.

`filter` es el contexto que se queda con las filas donde una expresión resulta
verdadera.

```python
pedidos = pl.DataFrame({
    "cliente": ["Ana", "Luis", "Marta", "Ana", "Luis"],
    "ciudad": ["Piura", "Lima", "Piura", "Lima", "Lima"],
    "monto": [320.0, 1450.0, 90.0, 780.0, 210.0],
})
print(pedidos.filter(pl.col("monto") > 300))
```

```salida
shape: (3, 3)
┌─────────┬────────┬────────┐
│ cliente ┆ ciudad ┆ monto  │
│ ---     ┆ ---    ┆ ---    │
│ str     ┆ str    ┆ f64    │
╞═════════╪════════╪════════╡
│ Ana     ┆ Piura  ┆ 320.0  │
│ Luis    ┆ Lima   ┆ 1450.0 │
│ Ana     ┆ Lima   ┆ 780.0  │
└─────────┴────────┴────────┘
```

```ejercicio
# Enunciado
Completa el contexto que se queda con las filas que cumplen una condición.

# Plantilla
t = pl.DataFrame({"n": [1, 5, 9]})
print(t.___(pl.col("n") > 4).to_series().to_list())

# Esperado
[5, 9]

# Pista
Seis letras: la palabra inglesa para «filtrar».
```

# Combinar condiciones

Dos condiciones se combinan con `&` para exigir ambas y con `|` para admitir
cualquiera. Cada una va entre paréntesis, porque en Python esos operadores
tienen más prioridad que la comparación.

```python
print(pedidos.filter(
    (pl.col("ciudad") == "Lima") & (pl.col("monto") > 300)
).to_dicts())
```

```salida
[{'cliente': 'Luis', 'ciudad': 'Lima', 'monto': 1450.0}, {'cliente': 'Ana', 'ciudad': 'Lima', 'monto': 780.0}]
```

> Nota: Sin los paréntesis, `pl.col("monto") > 300 & pl.col("ciudad") == "Lima"`
> se agrupa como `300 & pl.col("ciudad")` y el error resultante no menciona los
> paréntesis por ninguna parte. Es la equivocación más común al empezar.

```ejercicio
# Enunciado
Completa el operador que exige que se cumplan las dos condiciones a la vez.

# Plantilla
t = pl.DataFrame({"a": [1, 5], "b": ["x", "y"]})
print(t.filter((pl.col("a") > 2) ___ (pl.col("b") == "y")).to_dicts())

# Esperado
[{'a': 5, 'b': 'y'}]

# Pista
Un solo carácter, el que también sirve para la intersección de conjuntos.
```

# Varias condiciones como argumentos

Pasar varias expresiones a `filter` separadas por comas equivale a unirlas con
`&`, y se lee mejor cuando son tres o más.

```python
print(pedidos.filter(
    pl.col("ciudad") == "Lima",
    pl.col("monto") > 200,
    pl.col("cliente") != "Ana",
).to_dicts())
```

```salida
[{'cliente': 'Luis', 'ciudad': 'Lima', 'monto': 1450.0}, {'cliente': 'Luis', 'ciudad': 'Lima', 'monto': 210.0}]
```

```ejercicio
# Enunciado
Completa el operador de desigualdad para excluir una ciudad.

# Plantilla
t = pl.DataFrame({"c": ["Piura", "Lima"], "m": [10, 20]})
print(t.filter(pl.col("c") ___ "Lima").to_dicts())

# Esperado
[{'c': 'Piura', 'm': 10}]

# Pista
Dos caracteres: la negación del igual.
```

# Pertenecer a un conjunto

Cuando la condición es «que esté entre estos valores», `is_in` evita encadenar
varios `|`.

```python
print(pedidos.filter(
    pl.col("cliente").is_in(["Ana", "Marta"])
).select("cliente", "monto").to_dicts())
```

```salida
[{'cliente': 'Ana', 'monto': 320.0}, {'cliente': 'Marta', 'monto': 90.0}, {'cliente': 'Ana', 'monto': 780.0}]
```

```ejercicio
# Enunciado
Completa el método que comprueba si el valor está dentro de una lista.

# Plantilla
t = pl.DataFrame({"c": ["a", "b", "c"]})
print(t.filter(pl.col("c").___(["a", "c"])).to_series().to_list())

# Esperado
['a', 'c']

# Pista
Dos palabras unidas por guion bajo: el verbo ser y la preposición «en».
```

# Ordenar

`sort` reordena las filas por una columna. Por omisión va de menor a mayor;
`descending=True` invierte el sentido.

```python
print(pedidos.sort("monto", descending=True).select("cliente", "monto").to_dicts())
```

```salida
[{'cliente': 'Luis', 'monto': 1450.0}, {'cliente': 'Ana', 'monto': 780.0}, {'cliente': 'Ana', 'monto': 320.0}, {'cliente': 'Luis', 'monto': 210.0}, {'cliente': 'Marta', 'monto': 90.0}]
```

```ejercicio
# Enunciado
Completa el argumento que ordena de mayor a menor.

# Plantilla
t = pl.DataFrame({"n": [2, 9, 5]})
print(t.sort("n", ___=True).to_series().to_list())

# Esperado
[9, 5, 2]

# Pista
Diez letras: el participio inglés de «descender».
```

# Ordenar por varias columnas

Con una lista de columnas se ordena por la primera y, dentro de los empates,
por la siguiente. `descending` acepta una lista para dar un sentido a cada una.

```python
print(pedidos.sort(["ciudad", "monto"], descending=[False, True]).to_dicts())
```

```salida
[{'cliente': 'Luis', 'ciudad': 'Lima', 'monto': 1450.0}, {'cliente': 'Ana', 'ciudad': 'Lima', 'monto': 780.0}, {'cliente': 'Luis', 'ciudad': 'Lima', 'monto': 210.0}, {'cliente': 'Ana', 'ciudad': 'Piura', 'monto': 320.0}, {'cliente': 'Marta', 'ciudad': 'Piura', 'monto': 90.0}]
```

> Nota: Ordenar por una sola columna cuando hay empates deja el resultado a
> merced de detalles internos. Si el orden importa —por ejemplo para quedarse
> con «el primero de cada grupo»— hay que desempatar de forma explícita.

```ejercicio
# Enunciado
Completa el sentido de la segunda columna para que ordene de mayor a menor.

# Plantilla
t = pl.DataFrame({"g": ["a", "a"], "v": [1, 7]})
print(t.sort(["g", "v"], descending=[False, ___]).to_dicts())

# Esperado
[{'g': 'a', 'v': 7}, {'g': 'a', 'v': 1}]

# Pista
El valor lógico verdadero, en Python.
```

# Los primeros y los últimos

`top_k` devuelve las filas con los valores más altos de una columna sin ordenar
la tabla entera, y `bottom_k` las más bajas.

```python
print(pedidos.top_k(2, by="monto").select("cliente", "monto").to_dicts())
print(pedidos.bottom_k(1, by="monto").select("cliente", "monto").to_dicts())
```

```salida
[{'cliente': 'Luis', 'monto': 1450.0}, {'cliente': 'Ana', 'monto': 780.0}]
[{'cliente': 'Marta', 'monto': 90.0}]
```

```ejercicio
# Enunciado
Completa el método que devuelve las filas con los valores más altos.

# Plantilla
t = pl.DataFrame({"n": [3, 8, 1]})
print(t.___(1, by="n").to_series().to_list())

# Esperado
[8]

# Pista
Dos letras y una: «arriba» en inglés, guion bajo y la letra k.
```

# Filas únicas

`unique` elimina duplicados. Sin argumentos mira la fila entera; con `subset`
mira solo las columnas indicadas.

```python
repetidos = pl.DataFrame({"c": ["a", "b", "a", "b"], "v": [1, 2, 1, 3]})
print(repetidos.unique().sort(["c", "v"]).to_dicts())
print(repetidos.unique(subset="c").height)
```

```salida
[{'c': 'a', 'v': 1}, {'c': 'b', 'v': 2}, {'c': 'b', 'v': 3}]
2
```

> Doc: [Filtrar y ordenar](https://docs.pola.rs/user-guide/expressions/)

```ejercicio
# Enunciado
Completa el método que elimina las filas repetidas.

# Plantilla
t = pl.DataFrame({"x": [1, 1, 2]})
print(t.___().sort("x").to_series().to_list())

# Esperado
[1, 2]

# Pista
Seis letras: la palabra inglesa para «único».
```

# Cierre

Ya se puede recortar una tabla a las filas que interesan y ponerlas en el orden
que responde a la pregunta.

Lo que falta para responder preguntas de negocio es resumir: cuánto vendió cada
región, cuántos pedidos hizo cada cliente. Eso es agrupar, y es la sesión
siguiente.
