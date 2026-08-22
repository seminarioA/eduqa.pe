---
numero: 1
titulo: "Un conjunto y una tabla"
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

# Por qué esto explica SQL

SQL no se inventó desde cero. Se construyó sobre el álgebra relacional, que a
su vez descansa en la teoría de conjuntos. Cuando un `JOIN` devuelve más filas
de las esperadas o un `NOT IN` no devuelve ninguna, casi siempre es porque la
consulta dice, en términos de conjuntos, algo distinto de lo que se pensaba.

Este curso recorre las operaciones de conjuntos y, en cada una, la consulta que
le corresponde. Requiere saber leer un `SELECT` sencillo; si no, conviene hacer
antes el curso de SQL con SQLite.

# Qué es un conjunto

Un conjunto es una colección de elementos donde solo importa **qué está
dentro**. No hay un primero ni un último, y nada aparece dos veces: o pertenece
o no pertenece.

En Python el tipo `set` funciona igual.

```python
a = {"Ana", "Luis", "Marta"}
print(a)
print(len(a))
print({"Ana", "Luis"} == {"Luis", "Ana"})
```

```salida
{'Marta', 'Luis', 'Ana'}
3
True
```

> Nota: Los dos conjuntos de la última línea son iguales aunque estén escritos
> en distinto orden. Esa es la definición: un conjunto no tiene orden, así que
> dos con los mismos elementos son el mismo conjunto.

```ejercicio
# Enunciado
Completa el tipo de Python que representa un conjunto sin repetidos ni orden.

# Plantilla
a = ___(["Ana", "Luis", "Ana"])
print(len(a))

# Esperado
2

# Pista
Tres letras: «conjunto» en inglés.
```

# Pertenecer

La única pregunta que un conjunto responde por sí solo es si algo está dentro.
En matemáticas se escribe con el símbolo de pertenencia; en Python, con `in`.

```python
a = {"Ana", "Luis", "Marta"}
print("Ana" in a)
print("Julio" in a)
```

```salida
True
False
```

```ejercicio
# Enunciado
Completa la palabra clave que pregunta si un elemento pertenece al conjunto.

# Plantilla
a = {"Ana", "Luis"}
print("Luis" ___ a)

# Esperado
True

# Pista
Dos letras: la preposición inglesa «en».
```

# Una tabla se parece a un conjunto

Una tabla de base de datos guarda filas, y una consulta devuelve un conjunto de
filas. Las dos tablas de este curso son las listas de inscritos en dos cursos.

```python
consulta("select alumno from python order by alumno")
```

```salida
Ana
Luis
Marta
Rosa
```

```ejercicio
# Enunciado
Completa el nombre de la tabla con los inscritos en el otro curso.

# Plantilla
consulta("select count(*) from ___")

# Esperado
3

# Pista
El otro curso del ejemplo.
```

# Pero una tabla no es un conjunto

Aquí está la diferencia que causa más sorpresas: una tabla **sí admite
repetidos**. Es lo que en teoría se llama un multiconjunto o bolsa.

```python
con.execute("insert into python values ('Ana')")
consulta("select alumno from python order by alumno")
```

```salida
Ana
Ana
Luis
Marta
Rosa
```

> Nota: Ana aparece dos veces. En un conjunto eso es imposible; en una tabla es
> lo normal, y ninguna consulta avisa. Todo lo que sigue en el curso hay que
> leerlo con esa salvedad: SQL trabaja con bolsas y **solo se comporta como
> conjunto cuando se le pide**.

```ejercicio
# Enunciado
Completa la sentencia que añade una fila a una tabla.

# Plantilla
con.execute("___ into sql values ('Ana')")
consulta("select count(*) from sql")

# Esperado
4

# Pista
Seis letras: el verbo inglés «insertar».
```

# Convertir la bolsa en conjunto

`DISTINCT` elimina los repetidos y devuelve un conjunto de verdad.

```python
consulta("select distinct alumno from python order by alumno")
```

```salida
Ana
Luis
Marta
Rosa
```

```ejercicio
# Enunciado
Completa la palabra que elimina las filas repetidas del resultado.

# Plantilla
consulta("select count(___ alumno) from python")

# Esperado
4

# Pista
Ocho letras: «distinto» en inglés.
```

# Contar no es lo mismo con bolsa que con conjunto

De ahí se deriva una diferencia que aparece en cualquier informe: cuántas filas hay
y cuántos elementos distintos hay son dos preguntas.

```python
consulta("select count(*), count(distinct alumno) from python")
```

```salida
5 4
```

> Nota: Cinco filas, cuatro alumnos. Cuando un recuento no cuadra con lo que se
> esperaba, la primera comprobación es esta: preguntar si lo que se quería
> contar eran filas o eran elementos distintos.

```ejercicio
# Enunciado
Completa la función que cuenta filas.

# Plantilla
con.execute("insert into python values ('Ana')")
consulta("select ___(*) from python")

# Esperado
5

# Pista
Cinco letras: el verbo inglés «contar».
```

# El orden no forma parte del resultado

Un conjunto no tiene orden y una consulta tampoco lo garantiza. El orden solo
existe si se pide con `ORDER BY`.

```python
consulta("select distinct alumno from python order by alumno desc")
```

```salida
Rosa
Marta
Luis
Ana
```

> Nota: Confiar en el orden en que «suelen» salir las filas es una de las
> fuentes de error más difíciles de reproducir: funciona en una máquina, con
> unos datos y una versión, y deja de funcionar sin que nada visible cambie.

```ejercicio
# Enunciado
Completa la palabra que ordena de mayor a menor.

# Plantilla
consulta("select alumno from sql order by alumno ___ limit 1")

# Esperado
Marta

# Pista
Cuatro letras: la abreviatura inglesa de «descendente».
```

# El conjunto vacío

Un conjunto puede no tener elementos, y una consulta puede no devolver filas.
No es un error: es una respuesta.

```python
consulta("select alumno from python where alumno = 'Nadie'")
print("la consulta anterior no imprimió nada")
```

```salida
la consulta anterior no imprimió nada
```

```ejercicio
# Enunciado
Completa la cláusula que filtra las filas de una consulta.

# Plantilla
consulta("select count(*) from python ___ alumno = 'Ana'")

# Esperado
1

# Pista
Cinco letras: «donde» en inglés.
```

# Cierre

Un conjunto no tiene orden ni repetidos; una tabla tiene ambos. SQL trabaja con
bolsas y solo se comporta como conjunto cuando se le pide, con `DISTINCT` o con
los operadores que vienen a continuación.

La sesión siguiente empieza por la primera operación: juntar dos conjuntos.
