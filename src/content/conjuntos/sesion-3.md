---
numero: 3
titulo: "Intersección"
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

# Lo que está en los dos

La intersección de dos conjuntos son los elementos que pertenecen a ambos. Si
no comparten ninguno, la intersección es el conjunto vacío y se dice que son
disjuntos.

```venn
izquierda: python
derecha: sql
resalta: interseccion
pie: "La intersección son los alumnos que están en los dos cursos"
```

# En Python

El operador `&` calcula la intersección.

```python
a = {"Ana", "Luis", "Marta", "Rosa"}
b = {"Luis", "Marta", "Julio"}
print(sorted(a & b))
print(sorted({"Ana"} & {"Julio"}))
```

```salida
['Luis', 'Marta']
[]
```

```ejercicio
# Enunciado
Completa el operador que calcula la intersección de dos conjuntos.

# Plantilla
print(sorted({"a", "b"} ___ {"b", "c"}))

# Esperado
['b']

# Pista
Un ampersand.
```

# En SQL

`INTERSECT` devuelve las filas que aparecen en las dos consultas, sin
repetidos.

```python
consulta("""
select alumno from python
intersect
select alumno from sql
order by alumno
""")
```

```salida
Luis
Marta
```

```ejercicio
# Enunciado
Completa el operador de SQL que devuelve solo lo que está en ambas consultas.

# Plantilla
consulta("select count(*) from (select alumno from python ___ select alumno from sql)")

# Esperado
2

# Pista
Nueve letras: «intersecar» en inglés.
```

# El INNER JOIN es una intersección, pero no del todo

Un `INNER JOIN` se explica siempre con este mismo dibujo, y por eso se confunde
con `INTERSECT`. Se parecen, pero no hacen lo mismo.

```python
consulta("""
select p.alumno
from python p
join sql s on s.alumno = p.alumno
order by p.alumno
""")
```

```salida
Luis
Marta
```

> Nota: Aquí coinciden porque cada nombre aparece una vez en cada tabla.
> `INTERSECT` compara **filas enteras** y devuelve un conjunto sin repetidos;
> el `JOIN` **empareja** y devuelve una fila por cada pareja que casa. En
> cuanto un valor se repita en alguna de las dos tablas, dejan de coincidir.

```ejercicio
# Enunciado
Completa la cláusula que dice por qué columna se emparejan las dos tablas.

# Plantilla
consulta("select count(*) from python p join sql s ___ s.alumno = p.alumno")

# Esperado
2

# Pista
Dos letras: «sobre» en inglés.
```

# Dónde se separan

Basta con duplicar un nombre para ver la diferencia.

```python
con.execute("insert into sql values ('Luis')")
print("INTERSECT:")
consulta("select alumno from python intersect select alumno from sql order by alumno")
print("JOIN:")
consulta("select p.alumno from python p join sql s on s.alumno = p.alumno order by p.alumno")
```

```salida
INTERSECT:
Luis
Marta
JOIN:
Luis
Luis
Marta
```

> Nota: `INTERSECT` sigue devolviendo dos nombres; el `JOIN` devuelve tres,
> porque Luis casa dos veces. Esta es la causa de la mitad de los informes con
> totales inflados: el `JOIN` no filtró de más, multiplicó.

```ejercicio
# Enunciado
Completa el operador que compara filas enteras y no multiplica las coincidencias.

# Plantilla
consulta("select count(*) from (select alumno from python ___ select alumno from sql)")

# Esperado
2

# Pista
El mismo operador de conjuntos de esta sesión.
```

# Intersección vacía

Dos conjuntos sin elementos comunes son disjuntos, y la consulta no devuelve
nada.

```python
consulta("""
select alumno from python where alumno = 'Ana'
intersect
select alumno from sql
""")
print("sin filas: los conjuntos son disjuntos")
```

```salida
sin filas: los conjuntos son disjuntos
```

```venn
izquierda: solo Ana
derecha: sql
resalta: ninguna
pie: "Conjuntos disjuntos: la intersección es el conjunto vacío"
```

```ejercicio
# Enunciado
Completa el alumno que hace que la intersección quede vacía.

# Plantilla
consulta("""
select count(*) from (
  select alumno from python where alumno = '___'
  intersect
  select alumno from sql
)
""")

# Esperado
0

# Pista
Alguien que está en Python pero no en SQL; empieza por A.
```

# La intersección no depende del orden

Intersecar A con B da lo mismo que intersecar B con A. Es una propiedad que en
un `JOIN` también se cumple, y por eso el orden de las tablas no cambia el
resultado de un `INNER JOIN`.

```python
consulta("select count(*) from (select alumno from python intersect select alumno from sql)")
consulta("select count(*) from (select alumno from sql intersect select alumno from python)")
```

```salida
2
2
```

```ejercicio
# Enunciado
Completa la tabla que va primero para comprobar que el orden no cambia el resultado.

# Plantilla
consulta("select count(*) from (select alumno from ___ intersect select alumno from python)")

# Esperado
2

# Pista
La otra tabla del curso.
```

# Cierre

La intersección es lo compartido. `INTERSECT` la calcula como conjunto; el
`INNER JOIN` empareja y puede multiplicar filas, que es donde se separan.

Falta lo que está en uno y no en el otro, y ahí aparece la operación que más se
usa para encontrar lo que falta.
