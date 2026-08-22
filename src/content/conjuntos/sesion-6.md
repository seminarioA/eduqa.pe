---
numero: 6
titulo: "Pertenencia, subconjuntos y el problema del nulo"
preludio: |
  import sqlite3
  con = sqlite3.connect(":memory:")
  con.executescript("""
  create table python (alumno text);
  create table sql (alumno text);
  create table becados (alumno text);
  insert into python values ('Ana'),('Luis'),('Marta'),('Rosa');
  insert into sql    values ('Luis'),('Marta'),('Julio');
  insert into becados values ('Luis'),(NULL);
  """)

  def consulta(texto):
      """Ejecuta y muestra el resultado, una fila por línea."""
      for fila in con.execute(texto):
          print(*fila)
---

# La pregunta más simple

Pertenecer es la relación básica de la teoría de conjuntos: un elemento está o
no está. En SQL esa pregunta se hace con `IN`.

```python
consulta("select alumno from python where alumno in ('Luis', 'Julio') order by alumno")
```

```salida
Luis
```

```ejercicio
# Enunciado
Completa el operador que comprueba si un valor está en una lista.

# Plantilla
consulta("select count(*) from python where alumno ___ ('Ana', 'Rosa')")

# Esperado
2

# Pista
Dos letras: «en» en inglés.
```

# La lista puede ser otra consulta

Lo habitual no es escribir los valores a mano, sino compararlos con el
resultado de otra consulta. Eso es preguntar por pertenencia a un conjunto
calculado.

```python
consulta("""
select alumno from python
where alumno in (select alumno from sql)
order by alumno
""")
```

```salida
Luis
Marta
```

```venn
izquierda: python
derecha: sql
resalta: interseccion
pie: "IN contra otra consulta devuelve la intersección"
```

```ejercicio
# Enunciado
Completa la tabla de la subconsulta para quedarte con quienes también llevan SQL.

# Plantilla
consulta("select count(*) from python where alumno in (select alumno from ___)")

# Esperado
2

# Pista
La tabla del otro curso.
```

# Subconjunto

Un conjunto A es subconjunto de B si todos los elementos de A están en B. En
Python se pregunta con `issubset` o con `<=`.

```python
a = {"Luis", "Marta"}
b = {"Ana", "Luis", "Marta", "Rosa"}
print(a <= b)
print(b <= a)
print(a <= a)
```

```salida
True
False
True
```

> Nota: Todo conjunto es subconjunto de sí mismo, y por eso la tercera línea es
> verdadera. La relación de subconjunto no es lo mismo que la de pertenencia:
> `{"Luis"}` es subconjunto de `b`, pero no es un elemento de `b`.

```ejercicio
# Enunciado
Completa el operador que comprueba si el primer conjunto está contenido en el segundo.

# Plantilla
print({"a"} ___ {"a", "b"})

# Esperado
True

# Pista
Dos caracteres: menor o igual.
```

# Subconjunto en SQL

SQL no trae un operador de subconjunto. Se expresa preguntando si sobra algo:
A está contenido en B cuando A menos B está vacío.

```python
consulta("""
select count(*) from (
  select alumno from sql
  except
  select alumno from python
)
""")
print("si eso da 0, sql sería subconjunto de python")
```

```salida
1
si eso da 0, sql sería subconjunto de python
```

```ejercicio
# Enunciado
Completa el operador con el que se comprueba la contención restando un conjunto del otro.

# Plantilla
consulta("""
select count(*) from (select alumno from python ___ select alumno from python)
""")

# Esperado
0

# Pista
La operación de la sesión 4.
```

# Existe al menos uno

`EXISTS` responde otra cosa: si la subconsulta devuelve alguna fila. No compara
valores, comprueba si hay resultado.

```python
consulta("""
select alumno from python p
where exists (select 1 from sql s where s.alumno = p.alumno)
order by alumno
""")
```

```salida
Luis
Marta
```

> Nota: `EXISTS` se detiene en cuanto encuentra una fila, así que con
> subconsultas grandes suele ser más rápido que traer la lista entera para
> compararla. El `select 1` de dentro es una convención: da igual qué se
> seleccione, porque nadie mira el valor.

```ejercicio
# Enunciado
Completa la palabra clave que comprueba si la subconsulta devuelve alguna fila.

# Plantilla
consulta("select count(*) from python p where ___ (select 1 from sql s where s.alumno = p.alumno)")

# Esperado
2

# Pista
Seis letras: «existe» en inglés.
```

# Y aquí llega la trampa

`NOT IN` parece la negación de `IN`, y casi siempre lo es. Deja de serlo cuando
la lista contiene un nulo.

```python
print("quiénes NO están becados, con NOT IN:")
consulta("select alumno from python where alumno not in (select alumno from becados)")
print("(no salió ninguna fila)")
```

```salida
quiénes NO están becados, con NOT IN:
(no salió ninguna fila)
```

> Nota: La tabla de becados tiene un nulo, y eso vacía el resultado entero.
> `NOT IN` pregunta si el valor es distinto de **todos** los de la lista, y
> «distinto de nulo» no es verdadero ni falso: es desconocido. Con un solo
> desconocido, la condición nunca llega a ser verdadera.

```ejercicio
# Enunciado
Completa la palabra que niega la pertenencia y que con nulos deja de comportarse como se espera.

# Plantilla
consulta("select count(*) from python where alumno ___ in (select alumno from becados)")

# Esperado
0

# Pista
Tres letras: «no» en inglés.
```

# Cómo se arregla

Dos formas: quitar los nulos de la subconsulta, o preguntarlo con `NOT EXISTS`,
que no sufre el problema porque no compara valores.

```python
print("filtrando los nulos:")
consulta("""
select alumno from python
where alumno not in (select alumno from becados where alumno is not null)
order by alumno
""")
print("con NOT EXISTS:")
consulta("""
select alumno from python p
where not exists (select 1 from becados b where b.alumno = p.alumno)
order by alumno
""")
```

```salida
filtrando los nulos:
Ana
Marta
Rosa
con NOT EXISTS:
Ana
Marta
Rosa
```

> Nota: `NOT EXISTS` es la opción segura y la que conviene usar por costumbre.
> No es una cuestión de estilo: es que `NOT IN` esconde un fallo que solo
> aparece cuando alguien deja una celda vacía, meses después y sin ningún aviso.

```ejercicio
# Enunciado
Completa la comprobación que descarta los nulos de la subconsulta.

# Plantilla
consulta("""
select count(*) from python
where alumno not in (select alumno from becados where alumno ___)
""")

# Esperado
3

# Pista
Tres palabras: «es no nulo» en inglés.
```

# Cierre

`IN` pregunta pertenencia, `EXISTS` pregunta si hay resultado, y la contención
se expresa restando. `NOT IN` con nulos devuelve el conjunto vacío sin avisar,
y `NOT EXISTS` no.

La sesión siguiente cuenta: cuántos elementos tiene cada conjunto y por qué
sumar los tamaños casi nunca da lo correcto.
