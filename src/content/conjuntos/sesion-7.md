---
numero: 7
titulo: "Cardinalidad"
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

# Cuántos hay

La cardinalidad de un conjunto es su número de elementos. Se escribe entre
barras verticales y en SQL se calcula con `COUNT`.

```python
consulta("select count(*) from python")
consulta("select count(*) from sql")
```

```salida
4
3
```

```ejercicio
# Enunciado
Completa el asterisco que hace que se cuenten todas las filas.

# Plantilla
consulta("select count(___) from python")

# Esperado
4

# Pista
Un asterisco.
```

# Contar filas no es contar elementos

Como una tabla es una bolsa, contar filas y contar valores distintos son
preguntas diferentes. Ya apareció en la primera sesión y aquí es el centro.

```python
con.execute("insert into python values ('Ana')")
consulta("select count(*), count(distinct alumno) from python")
```

```salida
5 4
```

```ejercicio
# Enunciado
Completa la palabra que hace que se cuenten los valores distintos.

# Plantilla
consulta("select count(___ alumno) from python")

# Esperado
4

# Pista
Ocho letras: «distinto» en inglés.
```

# COUNT de una columna ignora los nulos

`COUNT(*)` cuenta filas; `COUNT(columna)` cuenta valores presentes. La
diferencia entre los dos números es exactamente cuántos nulos hay.

```python
con.execute("insert into python values (NULL)")
consulta("select count(*), count(alumno), count(*) - count(alumno) from python")
```

```salida
6 5 1
```

> Nota: Esa resta es la forma más corta de contar nulos en una columna, y
> también la explicación de un caso que despista: dos recuentos sobre la misma
> tabla que no coinciden sin que falte ninguna fila.

```ejercicio
# Enunciado
Completa la columna cuyo recuento ignora los nulos.

# Plantilla
con.execute("insert into python values (NULL)")
consulta("select count(*) - count(___) from python")

# Esperado
1

# Pista
La única columna de la tabla.
```

# Sumar tamaños no da la unión

Si dos conjuntos comparten elementos, sumar sus cardinalidades cuenta dos veces
lo compartido.

```venn
izquierda: python
derecha: sql
resalta: interseccion
pie: "Lo que se cuenta dos veces al sumar los tamaños"
```

```python
con.executescript("delete from python; insert into python values ('Ana'),('Luis'),('Marta'),('Rosa');")
consulta("select count(*) from python")
consulta("select count(*) from sql")
consulta("select count(*) from (select alumno from python union select alumno from sql)")
```

```salida
4
3
5
```

```ejercicio
# Enunciado
Completa la suma de los tamaños de los dos conjuntos, que no coincide con la unión.

# Plantilla
print(4 + 3 == ___)

# Esperado
True

# Pista
Cuatro más tres.
```

# El principio de inclusión-exclusión

La regla que arregla ese doble conteo: el tamaño de la unión es la suma de los
tamaños menos el tamaño de la intersección.

```python
consulta("""
select
  (select count(*) from (select alumno from python)) +
  (select count(*) from (select alumno from sql)) -
  (select count(*) from (select alumno from python intersect select alumno from sql))
""")
consulta("select count(*) from (select alumno from python union select alumno from sql)")
```

```salida
5
5
```

> Nota: Los dos números coinciden, y esa coincidencia es la comprobación. Es la
> misma regla que se usa para contar sin listar: cuando la unión es cara de
> calcular pero los tamaños y el solapamiento se conocen, la resta basta.

```ejercicio
# Enunciado
Completa el operador que corrige el doble conteo restando la intersección.

# Plantilla
print(4 + 3 ___ 2)

# Esperado
5

# Pista
Un guion, el signo de restar.
```

# Contar por grupos

`GROUP BY` parte la tabla en subconjuntos y cuenta cada uno. Es la cardinalidad
aplicada a cada clase de una partición.

```python
consulta("""
select alumno, count(*) from (
  select alumno from python union all select alumno from sql
)
group by alumno
order by alumno
""")
```

```salida
Ana 1
Julio 1
Luis 2
Marta 2
Rosa 1
```

```ejercicio
# Enunciado
Completa las dos palabras que agrupan las filas antes de contarlas.

# Plantilla
consulta("""
select count(*) from (
  select alumno from (select alumno from python union all select alumno from sql)
  ___ alumno
)
""")

# Esperado
5

# Pista
Dos palabras: «agrupar por» en inglés.
```

# Una partición

Los grupos de un `GROUP BY` forman una partición: cada fila cae en exactamente
uno, y la suma de los tamaños devuelve el total.

```python
consulta("""
select sum(cuantos) from (
  select alumno, count(*) as cuantos
  from (select alumno from python union all select alumno from sql)
  group by alumno
)
""")
consulta("select count(*) from (select alumno from python union all select alumno from sql)")
```

```salida
7
7
```

> Nota: Aquí sí se pueden sumar los tamaños sin corregir nada, y la razón es
> que los grupos no se solapan. Esa es la diferencia entre una partición y dos
> conjuntos cualesquiera.

```ejercicio
# Enunciado
Completa la función que suma los tamaños de los grupos.

# Plantilla
consulta("""
select ___(cuantos) from (
  select alumno, count(*) as cuantos from python group by alumno
)
""")

# Esperado
4

# Pista
Tres letras: «suma» en inglés.
```

# Cierre

Contar filas y contar elementos distintos son preguntas distintas, sumar
tamaños solapados infla el resultado, y la inclusión-exclusión lo corrige. Los
grupos de un `GROUP BY` sí se pueden sumar porque forman una partición.

La última sesión junta las dos operaciones que faltan y cierra el recorrido.
