---
numero: 1
titulo: "Los números y el orden de las operaciones"
---

# Por qué un curso de álgebra antes de programar

Programar consiste, casi siempre, en escribir cuentas. Un descuento, un
promedio, un porcentaje de crecimiento, una posición en pantalla: por debajo
hay una expresión aritmética.

Cuando esa expresión es incorrecta, el programa no avisa. Devuelve un número con
buen aspecto y sigue. Por eso conviene tener el álgebra en su sitio antes que
el lenguaje: los errores más difíciles de localizar no son de sintaxis, son de
aritmética.

Este curso no da por sabido nada de programación. Cada idea se comprueba
ejecutando una línea, y esa línea se explica.

# La calculadora que siempre tienes

Python evalúa una expresión y devuelve su valor. Con `print` se muestra.

```python
print(2 + 3)
print(10 - 4)
print(6 * 7)
print(20 / 4)
```

```salida
5
6
42
5.0
```

> Nota: La última devuelve `5.0` y no `5`. La división en Python siempre
> produce un número con decimales, aunque la cuenta sea exacta. Es una
> distinción que reaparece en todo el curso.

```ejercicio
# Enunciado
Completa el operador que multiplica dos números.

# Plantilla
print(6 ___ 7)

# Esperado
42

# Pista
Un solo carácter, el asterisco.
```

# El orden importa

Las operaciones no se resuelven de izquierda a derecha. Primero se hacen las
multiplicaciones y divisiones, y después las sumas y restas.

```python
print(2 + 3 * 4)
print((2 + 3) * 4)
```

```salida
14
20
```

> Nota: La diferencia entre 14 y 20 es todo el margen entre un cálculo correcto
> y uno que parece correcto. Cuando haya la menor duda, los paréntesis son
> gratis y sobran siempre menos que faltan.

```ejercicio
# Enunciado
Completa los paréntesis para que la suma se haga antes que la multiplicación.

# Plantilla
print(___2 + 3) * 4)

# Esperado
20

# Pista
Un solo carácter, el paréntesis que abre.
```

# La jerarquía completa

El orden es: primero las potencias, después multiplicación y división, y al
final suma y resta. Entre operaciones del mismo nivel se va de izquierda a
derecha.

```python
print(2 + 3 * 4 ** 2)
print(100 / 10 / 2)
print(2 ** 3 ** 2)
```

```salida
50
5.0
512
```

> Nota: La última no es 64. Las potencias se agrupan de derecha a izquierda, así
> que `2 ** 3 ** 2` es `2 ** 9`, no `(2 ** 3) ** 2`. Es la única operación
> aritmética que se asocia hacia ese lado.

```ejercicio
# Enunciado
Completa el operador de potencia, que se escribe con dos caracteres iguales.

# Plantilla
print(3 ___ 4)

# Esperado
81

# Pista
Dos asteriscos seguidos.
```

# Dos divisiones distintas

`/` reparte y deja decimales. `//` reparte y se queda con la parte entera: es
la respuesta a «cuántas veces cabe». `%` da lo que sobra.

```python
print(17 / 5)
print(17 // 5)
print(17 % 5)
```

```salida
3.4
3
2
```

```ejercicio
# Enunciado
Completa el operador que devuelve el resto de una división.

# Plantilla
print(17 ___ 5)

# Esperado
2

# Pista
Un solo carácter, el símbolo del porcentaje.
```

# La división entera con negativos

Con números negativos, `//` no corta hacia el cero: baja hacia el número menor.
Es la definición matemática, y sorprende la primera vez.

```python
print(7 // 2)
print(-7 // 2)
print(-7 % 2)
```

```salida
3
-4
1
```

> Nota: `-7 // 2` da `-4` y no `-3`, porque redondea hacia abajo. La regla que
> siempre se cumple es `a == (a // b) * b + a % b`: con `-7` y `2` resulta
> `(-4) * 2 + 1`, que es `-7`. El resto en Python nunca es negativo si el
> divisor es positivo.

```ejercicio
# Enunciado
Completa el operador que devuelve la parte entera de la división, redondeando hacia abajo.

# Plantilla
print(-7 ___ 2)

# Esperado
-4

# Pista
Dos barras inclinadas seguidas.
```

# Los decimales no son exactos

Un ordenador guarda los decimales en binario, y algunos números que en base
diez son exactos allí no lo son. La consecuencia se ve en una línea.

```python
print(0.1 + 0.2)
print(0.1 + 0.2 == 0.3)
```

```salida
0.30000000000000004
False
```

> Nota: No es un fallo de Python: pasa en cualquier lenguaje que use este tipo
> de números. La lección práctica es que **dos cantidades con decimales no se
> comparan con igualdad**. Se comparan redondeadas, o se usan enteros
> —céntimos en vez de soles— cuando el valor tiene que ser exacto.

```ejercicio
# Enunciado
Completa la comparación de desigualdad, que aquí resulta verdadera por el error de los decimales.

# Plantilla
print(0.1 + 0.2 ___ 0.3)

# Esperado
True

# Pista
Dos caracteres: la negación del igual.
```

# Redondear

`round()` ajusta a los decimales que se le pidan, y con un solo argumento
devuelve el entero más cercano.

```python
print(round(0.1 + 0.2, 2))
print(round(0.1 + 0.2, 2) == 0.3)
print(round(3.7))
```

```salida
0.3
True
4
```

```ejercicio
# Enunciado
Completa la cantidad de decimales para que el resultado sea comparable con 0.3.

# Plantilla
print(round(0.1 + 0.2, ___) == 0.3)

# Esperado
True

# Pista
Dos decimales bastan.
```

# Signo y magnitud

`abs()` devuelve la distancia al cero, sin signo. Es lo que se usa para
preguntar «cuánto se aleja», que casi nunca es lo mismo que «cuánto vale».

```python
print(abs(-8))
print(abs(8))
print(abs(-3.5) + abs(2))
```

```salida
8
8
5.5
```

> Nota: La forma correcta de comparar dos números con decimales es preguntar si
> la distancia entre ellos es despreciable: `abs(a - b) < 0.000001`. Eso
> funciona siempre; la igualdad directa, no.

```ejercicio
# Enunciado
Completa la función que devuelve el valor absoluto.

# Plantilla
print(___(0.1 + 0.2 - 0.3) < 0.000001)

# Esperado
True

# Pista
Tres letras: la abreviatura inglesa de «absoluto».
```

# Cierre

Ya está lo básico: el orden de las operaciones, las tres divisiones y el motivo
por el que los decimales engañan.

La sesión siguiente trata las fracciones y los porcentajes, que es donde
aparecen los errores de aritmética más costosos.
