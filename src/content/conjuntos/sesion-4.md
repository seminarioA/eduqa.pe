---
numero: 4
titulo: "Diferencia"
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

# Lo que está en uno y no en el otro

La diferencia entre A y B son los elementos de A que no están en B. A diferencia
de la unión y la intersección, **el orden importa**: A menos B no es lo mismo
que B menos A.

```venn
izquierda: python
derecha: sql
resalta: solo-izquierda
pie: "python menos sql: quienes llevan Python y no llevan SQL"
```

# En Python

El operador `-` calcula la diferencia.

```python
a = {"Ana", "Luis", "Marta", "Rosa"}
b = {"Luis", "Marta", "Julio"}
print(sorted(a - b))
print(sorted(b - a))
```

```salida
['Ana', 'Rosa']
['Julio']
```

> Nota: Los dos resultados son distintos y ninguno es «el correcto»: responden a
> preguntas distintas. Escribir la resta al revés es el error que más veces
> convierte un informe de «clientes sin pedidos» en «pedidos sin cliente».

```ejercicio
# Enunciado
Completa el operador que calcula la diferencia entre dos conjuntos.

# Plantilla
print(sorted({"a", "b"} ___ {"b"}))

# Esperado
['a']

# Pista
Un guion, el mismo signo de restar.
```

# En SQL

`EXCEPT` devuelve las filas de la primera consulta que no están en la segunda.

```python
consulta("""
select alumno from python
except
select alumno from sql
order by alumno
""")
```

```salida
Ana
Rosa
```

```ejercicio
# Enunciado
Completa el operador de SQL que resta el resultado de una consulta a otra.

# Plantilla
consulta("select count(*) from (select alumno from python ___ select alumno from sql)")

# Esperado
2

# Pista
Seis letras: «excepto» en inglés.
```

# Al revés

Cambiar el orden cambia la pregunta y cambia la respuesta.

```python
consulta("""
select alumno from sql
except
select alumno from python
order by alumno
""")
```

```salida
Julio
```

```venn
izquierda: python
derecha: sql
resalta: solo-derecha
pie: "sql menos python: quienes llevan SQL y no llevan Python"
```

```ejercicio
# Enunciado
Completa la tabla que va primero para obtener quienes solo llevan SQL.

# Plantilla
consulta("select * from (select alumno from ___ except select alumno from python)")

# Esperado
Julio

# Pista
La tabla del otro curso.
```

# La misma pregunta con un JOIN

En la práctica la diferencia se escribe muchas veces como un `LEFT JOIN` que se
queda con lo que no casó. El resultado es el mismo y conviene reconocer las dos
formas.

```python
consulta("""
select p.alumno
from python p
left join sql s on s.alumno = p.alumno
where s.alumno is null
order by p.alumno
""")
```

```salida
Ana
Rosa
```

> Nota: El `LEFT JOIN` trae todas las filas de la izquierda y rellena con nulos
> las que no encontraron pareja. Filtrar por `is null` deja exactamente esas: es
> la resta escrita con otro vocabulario.

```ejercicio
# Enunciado
Completa la comprobación que se queda con las filas que no encontraron pareja.

# Plantilla
consulta("""
select count(*) from python p
left join sql s on s.alumno = p.alumno
where s.alumno ___
""")

# Esperado
2

# Pista
Dos palabras: «es nulo» en inglés.
```

# Lo que está en uno o en otro, pero no en ambos

La diferencia simétrica son los elementos que pertenecen a exactamente uno de
los dos conjuntos. Es la unión menos la intersección.

```venn
izquierda: python
derecha: sql
resalta: diferencia-simetrica
pie: "Quienes llevan un curso pero no el otro"
```

```python
a = {"Ana", "Luis", "Marta", "Rosa"}
b = {"Luis", "Marta", "Julio"}
print(sorted(a ^ b))
print(sorted((a | b) - (a & b)))
```

```salida
['Ana', 'Julio', 'Rosa']
['Ana', 'Julio', 'Rosa']
```

```ejercicio
# Enunciado
Completa el operador que devuelve la diferencia simétrica en Python.

# Plantilla
print(sorted({"a", "b"} ___ {"b", "c"}))

# Esperado
['a', 'c']

# Pista
Un acento circunflejo.
```

# En SQL no hay operador para eso

SQL no trae diferencia simétrica. Se construye con las piezas que sí tiene.

```python
consulta("""
select alumno from (select alumno from python except select alumno from sql)
union
select alumno from (select alumno from sql except select alumno from python)
order by alumno
""")
```

```salida
Ana
Julio
Rosa
```

> Nota: Que un lenguaje no traiga una operación no significa que no se pueda
> expresar. Reconocer que la diferencia simétrica es «unión menos intersección»
> es lo que permite escribirla sin buscar una palabra clave que no existe.

```ejercicio
# Enunciado
Completa el operador que junta las dos restas.

# Plantilla
consulta("""
select count(*) from (
  select alumno from (select alumno from python except select alumno from sql)
  ___
  select alumno from (select alumno from sql except select alumno from python)
)
""")

# Esperado
3

# Pista
La operación de la sesión 2.
```

# Restar algo que no está

Restar un conjunto disjunto no quita nada. Es una comprobación rápida de que la
resta va en el sentido correcto.

```python
consulta("select count(*) from (select alumno from python except select alumno from python where alumno = 'Julio')")
```

```salida
4
```

```ejercicio
# Enunciado
Completa el nombre que no está en la tabla, de modo que la resta no quite nada.

# Plantilla
consulta("""
select count(*) from (
  select alumno from python except select alumno from python where alumno = '___'
)
""")

# Esperado
4

# Pista
El alumno que solo lleva SQL.
```

# Cierre

La diferencia tiene sentido y por eso hay que leerla con cuidado; la simétrica
no existe como operador y se construye. El `LEFT JOIN` con `is null` es la
misma resta escrita de otra manera.

La sesión siguiente trata la operación que está detrás de todo `JOIN`.
