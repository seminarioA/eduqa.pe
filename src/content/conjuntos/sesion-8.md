---
numero: 8
titulo: "Seleccionar, proyectar y cerrar"
preludio: |
  import sqlite3
  con = sqlite3.connect(":memory:")
  con.executescript("""
  create table python (alumno text);
  create table sql (alumno text);
  insert into python values ('Ana'),('Luis'),('Marta'),('Rosa');
  insert into sql    values ('Luis'),('Marta'),('Julio');
  create table notas (alumno text, curso text, nota integer);
  insert into notas values ('Ana','python',18),('Ana','sql',15),('Luis','python',12);
  """)

  def consulta(texto):
      """Ejecuta y muestra el resultado, una fila por línea."""
      for fila in con.execute(texto):
          print(*fila)
---

# Las dos operaciones que faltan

El álgebra relacional tiene dos operaciones que no vienen de la teoría de
conjuntos clásica y que son las que más se usan: quedarse con algunas **filas**
y quedarse con algunas **columnas**.

La primera se llama selección y en SQL es el `WHERE`. La segunda es la
proyección, y es la lista de columnas del `SELECT`.

```python
consulta("select alumno from python where alumno like 'M%'")
```

```salida
Marta
```

```ejercicio
# Enunciado
Completa la cláusula que se queda con algunas filas.

# Plantilla
consulta("select count(*) from python ___ alumno like 'A%'")

# Esperado
1

# Pista
Cinco letras: «donde» en inglés.
```

# La proyección puede reducir el conjunto

Quedarse con menos columnas puede convertir filas distintas en filas iguales, y
entonces el resultado tiene menos elementos que el original.

```python
consulta("select count(*) from notas")
consulta("select count(*) from (select distinct alumno from notas)")
```

```salida
3
2
```

> Nota: Tres filas, dos alumnos. Al proyectar sobre una sola columna se pierde
> lo que distinguía dos filas de Ana, y las dos se vuelven la misma. Es la razón
> por la que un `DISTINCT` cambia un recuento sin que se haya filtrado nada.

```ejercicio
# Enunciado
Completa la columna sobre la que se proyecta para obtener dos elementos.

# Plantilla
consulta("select count(*) from (select distinct ___ from notas)")

# Esperado
2

# Pista
Quien recibe la nota.
```

# Componer

Todo lo del curso se combina. Una consulta cualquiera es una cadena de estas
operaciones aplicadas una tras otra.

```python
consulta("""
select alumno
from python
where alumno in (select alumno from sql)
   or alumno like 'R%'
order by alumno
""")
```

```salida
Luis
Marta
Rosa
```

```ejercicio
# Enunciado
Completa el operador lógico que hace que baste con cumplir una de las dos condiciones.

# Plantilla
consulta("select count(*) from python where alumno = 'Ana' ___ alumno = 'Rosa'")

# Esperado
2

# Pista
Dos letras: «o» en inglés.
```

# El resumen en un diagrama

Cada operación de conjuntos tiene su consulta, y cada consulta responde a una
pregunta distinta sobre las mismas dos tablas.

```venn
izquierda: python
derecha: sql
resalta: union
pie: "UNION — quienes están en cualquiera de los dos"
```

```venn
izquierda: python
derecha: sql
resalta: interseccion
pie: "INTERSECT — quienes están en los dos"
```

```venn
izquierda: python
derecha: sql
resalta: solo-izquierda
pie: "EXCEPT — quienes están en el primero y no en el segundo"
```

```python
for nombre, sentencia in [
    ("union    ", "select alumno from python union select alumno from sql"),
    ("intersect", "select alumno from python intersect select alumno from sql"),
    ("except   ", "select alumno from python except select alumno from sql"),
]:
    filas = con.execute(f"select count(*) from ({sentencia})").fetchone()[0]
    print(nombre, filas)
```

```salida
union     5
intersect 2
except    2
```

```ejercicio
# Enunciado
Completa el método que devuelve una sola fila del resultado.

# Plantilla
print(con.execute("select count(*) from python").___()[0])

# Esperado
4

# Pista
Siete letras: «traer uno» en inglés, con guion bajo.
```

# Comprobar una identidad

Las propiedades de conjuntos se pueden verificar con datos, igual que en la
sesión de álgebra se comprobaba una identidad sustituyendo.

```python
izquierda = con.execute("""
select count(*) from (
  select alumno from python union select alumno from sql
)
""").fetchone()[0]

derecha = con.execute("""
select count(*) from (
  select alumno from python
  union
  select alumno from sql except select alumno from python
)
""").fetchone()[0]

print(izquierda, derecha, izquierda == derecha)
```

```salida
5 1 False
```

> Nota: La unión de A con B es lo mismo que A unido con lo que B tiene de más.
> Comprobarlo con datos no demuestra la propiedad, pero descarta que se haya
> entendido al revés, que es de lo que se trata al escribir una consulta.

```ejercicio
# Enunciado
Completa el operador que compara los dos recuentos.

# Plantilla
a = con.execute("select count(*) from python").fetchone()[0]
b = con.execute("select count(distinct alumno) from python").fetchone()[0]
print(a ___ b)

# Esperado
True

# Pista
Dos caracteres: la comparación de igualdad.
```

# Lo que queda fuera

Este curso trató conjuntos de dos tablas. Lo que sigue en la práctica son las
mismas ideas con más piezas: uniones de tres o más tablas, subconsultas
correlacionadas y funciones de ventana, que operan sobre particiones sin
colapsarlas.

```python
consulta("""
select alumno, count(*) over () as total_de_filas
from python
order by alumno
limit 2
""")
```

```salida
Ana 4
Luis 4
```

> Doc: [SQL de SQLite](https://www.sqlite.org/lang.html)

```ejercicio
# Enunciado
Completa la cláusula que limita cuántas filas se devuelven.

# Plantilla
consulta("select count(*) from (select alumno from python ___ 2)")

# Esperado
2

# Pista
Cinco letras: «limitar» en inglés.
```

# Cierre

El recorrido está completo: pertenencia, unión, intersección, diferencia,
producto cartesiano, cardinalidad, selección y proyección. Cada una con su
consulta.

Con esto, un `JOIN` que devuelve de más deja de ser un misterio y pasa a ser una
pregunta contestable: qué conjunto pedí en realidad.
