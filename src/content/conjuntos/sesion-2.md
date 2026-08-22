---
numero: 2
titulo: "Unión"
preludio: |
  import sqlite3
  con = sqlite3.connect(":memory:")
  con.executescript("""
  create table python (alumno text);
  create table sql (alumno text);
  insert into python values ('Ana'),('Luis'),('Marta'),('Rosa');
  insert into sql    values ('Luis'),('Marta'),('Julio');
  """)

  def consulta(texto):
      """Ejecuta y muestra el resultado, una fila por línea."""
      for fila in con.execute(texto):
          print(*fila)
---

# Juntarlo todo

La unión de dos conjuntos es el conjunto de los elementos que están en uno, en
el otro o en los dos. Nada se repite: quien está en ambos aparece una vez.

```venn
izquierda: python
derecha: sql
resalta: union
pie: "La unión son todos los alumnos de cualquiera de los dos cursos"
```

# En Python

El operador `|` calcula la unión de dos conjuntos.

```python
a = {"Ana", "Luis", "Marta", "Rosa"}
b = {"Luis", "Marta", "Julio"}
print(sorted(a | b))
print(len(a | b))
```

```salida
['Ana', 'Julio', 'Luis', 'Marta', 'Rosa']
5
```

> Nota: Cuatro más tres son siete, pero la unión tiene cinco elementos. Luis y
> Marta están en los dos conjuntos y en la unión aparecen una sola vez. Sumar
> los tamaños de dos conjuntos que se solapan es el error de conteo más común.

```ejercicio
# Enunciado
Completa el operador que calcula la unión de dos conjuntos en Python.

# Plantilla
print(len({"a", "b"} ___ {"b", "c"}))

# Esperado
3

# Pista
Una barra vertical.
```

# En SQL

`UNION` hace lo mismo: junta los resultados de dos consultas y **elimina los
repetidos**.

```python
consulta("""
select alumno from python
union
select alumno from sql
order by alumno
""")
```

```salida
Ana
Julio
Luis
Marta
Rosa
```

```ejercicio
# Enunciado
Completa el operador de SQL que junta dos consultas sin repetir filas.

# Plantilla
consulta("select count(*) from (select alumno from python ___ select alumno from sql)")

# Esperado
5

# Pista
Cinco letras: la misma palabra que en matemáticas.
```

# La versión que no quita repetidos

`UNION ALL` junta sin comparar nada. Es la unión de bolsas, no de conjuntos.

```python
consulta("""
select alumno from python
union all
select alumno from sql
order by alumno
""")
```

```salida
Ana
Julio
Luis
Luis
Marta
Marta
Rosa
```

> Nota: Aquí sí se devuelven siete filas, con Luis y Marta dos veces. `UNION` tiene
> que ordenar y comparar todo para descartar duplicados; `UNION ALL` solo
> concatena. Cuando se sabe que no puede haber solapamiento, `UNION ALL` es
> bastante más barato, y esa es la razón real por la que existe.

```ejercicio
# Enunciado
Completa la palabra que conserva las filas repetidas al unir.

# Plantilla
consulta("select count(*) from (select alumno from python union ___ select alumno from sql)")

# Esperado
7

# Pista
Tres letras: «todo» en inglés.
```

# La unión exige columnas compatibles

Las dos consultas tienen que devolver el mismo número de columnas y de tipos
compatibles. No es un capricho: la unión se hace entre conjuntos de lo mismo.

```python
try:
    consulta("select alumno from python union select alumno, alumno from sql")
except Exception as e:
    print("error:", e)
```

```salida
error: SELECTs to the left and right of UNION do not have the same number of result columns
```

```ejercicio
# Enunciado
Completa el atributo que devuelve el nombre de la clase del error.

# Plantilla
try:
    consulta("select alumno from python union select alumno, alumno from sql")
except Exception as e:
    print(type(e).___)

# Esperado
OperationalError

# Pista
Dos guiones bajos a cada lado de la palabra «name».
```

# La unión no ordena por sí sola

Que el resultado salga ordenado es un efecto de cómo se calculó, no una
promesa. Si el orden importa, se pide.

```python
consulta("""
select alumno from python
union
select alumno from sql
order by alumno desc
""")
```

```salida
Rosa
Marta
Luis
Julio
Ana
```

```ejercicio
# Enunciado
Completa la cláusula que fija el orden del resultado de una unión.

# Plantilla
consulta("""
select alumno from python union select alumno from sql
___ alumno limit 1
""")

# Esperado
Ana

# Pista
Dos palabras: «ordenar por» en inglés.
```

# Unir un conjunto consigo mismo

La unión de un conjunto consigo mismo es él mismo. Es una propiedad que sirve
para comprobar que se entendió la operación.

```python
consulta("select count(*) from (select alumno from python union select alumno from python)")
consulta("select count(distinct alumno) from python")
```

```salida
4
4
```

> Nota: Los dos números coinciden porque `UNION` deduplica. Con `UNION ALL`
> saldría el doble, que es justo la diferencia entre unir conjuntos y apilar
> bolsas.

```ejercicio
# Enunciado
Completa la tabla para unirla consigo misma.

# Plantilla
consulta("select count(*) from (select alumno from sql union select alumno from ___)")

# Esperado
3

# Pista
La misma tabla que ya aparece en la consulta.
```

# Cierre

La unión junta y no repite; `UNION ALL` junta y conserva. Elegir mal entre las
dos cambia cualquier recuento posterior.

La sesión siguiente va a lo contrario: quedarse solo con lo que está en ambos.
