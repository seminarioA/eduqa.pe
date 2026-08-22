---
numero: 5
titulo: "Producto cartesiano"
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

# Todas las parejas posibles

El producto cartesiano de dos conjuntos es el conjunto de todas las parejas
formadas por un elemento del primero y uno del segundo. No es una operación de
solapamiento como las anteriores: **combina**.

Si A tiene 4 elementos y B tiene 3, el producto tiene 12. Ese crecimiento es lo
que hay que tener presente.

# En Python

`itertools.product` recorre todas las combinaciones.

```python
from itertools import product

a = ["Ana", "Luis"]
b = ["mañana", "tarde"]
for pareja in product(a, b):
    print(pareja)
print(len(list(product(a, b))))
```

```salida
('Ana', 'mañana')
('Ana', 'tarde')
('Luis', 'mañana')
('Luis', 'tarde')
4
```

```ejercicio
# Enunciado
Completa la función de itertools que genera todas las parejas posibles.

# Plantilla
from itertools import product
print(len(list(___(["a", "b"], [1, 2, 3]))))

# Esperado
6

# Pista
Siete letras: «producto» en inglés.
```

# En SQL

`CROSS JOIN` —o simplemente dos tablas separadas por coma— produce el producto
cartesiano.

```python
consulta("select count(*) from python cross join sql")
consulta("select count(*) from python, sql")
```

```salida
12
12
```

> Nota: Cuatro por tres son doce. Las dos formas hacen lo mismo; la primera lo
> dice en voz alta y la segunda no, y por eso conviene escribir `CROSS JOIN`
> cuando el producto es intencionado: quien lea la consulta sabrá que no es un
> descuido.

```ejercicio
# Enunciado
Completa la palabra que declara un producto cartesiano de forma explícita.

# Plantilla
consulta("select count(*) from python ___ join sql")

# Esperado
12

# Pista
Cinco letras: «cruzado» en inglés.
```

# Un JOIN es un producto filtrado

Aquí está la idea que ordena todo lo demás: un `INNER JOIN` es el producto
cartesiano al que se le aplica una condición. La base de datos no lo calcula
así —sería absurdamente lento—, pero el resultado es exactamente ese.

```python
print("producto entero:")
consulta("select count(*) from python p, sql s")
print("producto filtrado por la condición:")
consulta("select count(*) from python p, sql s where p.alumno = s.alumno")
print("el join equivalente:")
consulta("select count(*) from python p join sql s on p.alumno = s.alumno")
```

```salida
producto entero:
12
producto filtrado por la condición:
2
el join equivalente:
2
```

> Nota: Las dos últimas dan el mismo número. Entender que el `ON` es un filtro
> sobre el producto explica de una vez por qué un `JOIN` sin condición devuelve
> una barbaridad de filas: no es que falle, es que no se filtró nada.

```ejercicio
# Enunciado
Completa la condición que convierte el producto en la intersección por nombre.

# Plantilla
consulta("select count(*) from python p, sql s where p.alumno ___ s.alumno")

# Esperado
2

# Pista
Un solo carácter: el signo de igualdad de SQL.
```

# Por qué un JOIN sin ON explota

Olvidar la condición no da error: da el producto entero. Con tablas pequeñas
pasa desapercibido; con tablas grandes es la consulta que tumba el servidor.

```python
consulta("select count(*) from python, sql")
consulta("select count(*) * 1 from python")
consulta("select count(*) * 1 from sql")
```

```salida
12
4
3
```

```ejercicio
# Enunciado
Completa el número de filas del producto cartesiano de una tabla de 4 y otra de 3.

# Plantilla
print(4 * 3 == ___)

# Esperado
True

# Pista
Cuatro por tres.
```

# El producto crece multiplicando

Dos tablas de mil filas dan un millón. Tres, mil millones. Es la misma
diferencia entre sumar y multiplicar de cualquier crecimiento exponencial.

```python
for filas in [10, 100, 1000]:
    print(filas, "x", filas, "=", filas * filas)
```

```salida
10 x 10 = 100
100 x 100 = 10000
1000 x 1000 = 1000000
```

```ejercicio
# Enunciado
Completa el operador que da el tamaño del producto cartesiano a partir de los dos tamaños.

# Plantilla
print(1000 ___ 1000)

# Esperado
1000000

# Pista
Un asterisco.
```

# Cuando el producto sí se quiere

Hay casos en que combinarlo todo es la respuesta: generar un calendario de
todas las parejas alumno–sesión, o todas las combinaciones de talla y color.

```python
consulta("""
select p.alumno, s.alumno
from python p cross join sql s
where p.alumno = 'Ana'
order by s.alumno
""")
```

```salida
Ana Julio
Ana Luis
Ana Marta
```

```ejercicio
# Enunciado
Completa el alumno de la izquierda para quedarte con sus tres parejas.

# Plantilla
consulta("""
select count(*) from python p cross join sql s where p.alumno = '___'
""")

# Esperado
3

# Pista
La alumna que abre la lista por orden alfabético.
```

# El producto con el conjunto vacío

Multiplicar por nada da nada: si una de las dos tablas está vacía, el producto
también lo está.

```python
con.execute("create table vacia (alumno text)")
consulta("select count(*) from python cross join vacia")
```

```salida
0
```

> Nota: Es el equivalente a multiplicar por cero, y explica un caso confuso: un
> informe que de pronto no devuelve filas puede no tener nada roto, sino una tabla
> intermedia que se quedó vacía.

```ejercicio
# Enunciado
Completa el número de filas que devuelve un producto con una tabla vacía.

# Plantilla
print(4 * 0 == ___)

# Esperado
True

# Pista
Cero.
```

# Cierre

El producto cartesiano combina, y el `JOIN` es ese producto con una condición
encima. Con eso, el comportamiento de cualquier `JOIN` deja de ser una regla
que memorizar.

La sesión siguiente vuelve a la pregunta más básica de todas: si algo pertenece
o no.
