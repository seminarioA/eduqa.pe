---
numero: 4
titulo: "Letras en lugar de números"
paquetes: ["sympy"]
preludio: |
  import sympy as sp
  x, y = sp.symbols("x y")
---

# Para qué sirve una letra

Una letra representa un número que todavía no se conoce, o cualquier número.
Con eso se pueden escribir reglas en vez de casos: `2 * x + 6` no es una cuenta,
es la instrucción de duplicar algo y sumarle seis, valga lo que valga.

Esta sesión usa SymPy, una biblioteca que opera con esas letras igual que a mano
en un papel: expande, factoriza y simplifica sin asignarles ningún valor.

# Declarar los símbolos

Antes de usar una letra hay que decir que es una letra y no una variable de
Python con un valor dentro.

```python
a = sp.Symbol("a")
print(a)
print(a + a)
print(a * a)
```

```salida
a
2*a
a**2
```

> Nota: `a + a` devuelve `2*a` y `a * a` devuelve `a**2`. No ha calculado nada:
> ha reescrito la expresión de la forma más corta, que es exactamente lo que se
> hace en un cuaderno.

```ejercicio
# Enunciado
Completa el resultado de sumar un símbolo consigo mismo.

# Plantilla
a = sp.Symbol("a")
print(a + a == 2 * ___)

# Esperado
True

# Pista
El mismo símbolo.
```

# Sustituir

`subs` reemplaza la letra por un número y entonces sí calcula. Es el puente
entre la regla y el caso concreto.

```python
expresion = 2 * x + 6
print(expresion)
print(expresion.subs(x, 5))
print(expresion.subs(x, -3))
```

```salida
2*x + 6
16
0
```

```ejercicio
# Enunciado
Completa el método que sustituye la letra por un valor.

# Plantilla
expresion = 2 * x + 6
print(expresion.___(x, 10))

# Esperado
26

# Pista
Cuatro letras: la abreviatura inglesa de «sustituir».
```

# Quitar los paréntesis

`expand` desarrolla el producto, multiplicando cada término por cada término.

```python
print(sp.expand((x + 3) * (x + 2)))
print(sp.expand((x + 3) ** 2))
print(sp.expand((x + 3) * (x - 3)))
```

```salida
x**2 + 5*x + 6
x**2 + 6*x + 9
x**2 - 9
```

> Nota: La última da `x**2 - 9`: los términos en `x` se cancelan. Es el producto
> notable que conviene reconocer de inmediato, porque aparece constantemente al
> factorizar.

```ejercicio
# Enunciado
Completa la función que desarrolla un producto quitando los paréntesis.

# Plantilla
print(sp.___((x + 1) * (x + 2)))

# Esperado
x**2 + 3*x + 2

# Pista
Seis letras: «expandir» en inglés.
```

# El camino inverso

`factor` hace lo contrario: encuentra el producto que da esa expresión.

```python
print(sp.factor(x ** 2 + 5 * x + 6))
print(sp.factor(x ** 2 - 9))
print(sp.factor(x ** 2 + 2 * x + 1))
```

```salida
(x + 2)*(x + 3)
(x - 3)*(x + 3)
(x + 1)**2
```

```ejercicio
# Enunciado
Completa la función que escribe una expresión como producto de factores.

# Plantilla
print(sp.___(x ** 2 - 9))

# Esperado
(x - 3)*(x + 3)

# Pista
Seis letras: «factorizar» en inglés, sin la terminación.
```

# El cuadrado de una suma

El error algebraico más repetido es pensar que `(x + 3) ** 2` es
`x ** 2 + 9`. No lo es, y se comprueba en dos líneas.

```python
print(sp.expand((x + 3) ** 2))
print(sp.expand((x + 3) ** 2) == x ** 2 + 9)
print(((x + 3) ** 2).subs(x, 1), (x ** 2 + 9).subs(x, 1))
```

```salida
x**2 + 6*x + 9
False
16 10
```

> Nota: Sobra el `6*x`. Sustituyendo `x = 1` se ve sin álgebra: uno da 16 y el
> otro 10. Cuando dos expresiones se creen iguales, probar un número cualquiera
> descarta la mayoría de los errores en un segundo.

```ejercicio
# Enunciado
Completa el término que falta en el desarrollo del cuadrado de la suma.

# Plantilla
print(sp.expand((x + 3) ** 2) == x ** 2 + ___ * x + 9)

# Esperado
True

# Pista
El doble del tres.
```

# Simplificar

`simplify` busca la forma más corta de escribir lo mismo, incluso cuando hay
fracciones de por medio.

```python
print(sp.simplify((x ** 2 - 9) / (x - 3)))
print(sp.simplify(x + x + x))
print(sp.simplify((2 * x + 4) / 2))
```

```salida
x + 3
3*x
x + 2
```

> Nota: La primera se queda en `x + 3` porque el factor `(x - 3)` se cancela
> arriba y abajo. Conviene recordar que esa simplificación no vale cuando `x`
> es 3: ahí la expresión original divide entre cero y no existe.

```ejercicio
# Enunciado
Completa la función que reduce una expresión a su forma más simple.

# Plantilla
print(sp.___((2 * x + 4) / 2))

# Esperado
x + 2

# Pista
Ocho letras: «simplificar» en inglés, sin la terminación.
```

# Dos letras

Nada cambia con más de una incógnita: las reglas son las mismas y SymPy las
aplica igual.

```python
print(sp.expand((x + y) ** 2))
print(sp.factor(x ** 2 - y ** 2))
print((x + y).subs({x: 2, y: 3}))
```

```salida
x**2 + 2*x*y + y**2
(x - y)*(x + y)
5
```

```ejercicio
# Enunciado
Completa el término central del desarrollo del cuadrado de una suma de dos letras.

# Plantilla
print(sp.expand((x + y) ** 2) == x ** 2 + ___ * x * y + y ** 2)

# Esperado
True

# Pista
Dos.
```

# Comprobar una identidad

Para saber si dos expresiones son la misma, se resta una de la otra y se
simplifica. Si el resultado es cero, son iguales para cualquier valor.

```python
izquierda = (x + 1) ** 2
derecha = x ** 2 + 2 * x + 1
print(sp.simplify(izquierda - derecha))
print(sp.simplify(izquierda - derecha) == 0)
```

```salida
0
True
```

> Nota: Comparar con `==` directamente no sirve: SymPy compara la forma escrita,
> no el valor. `(x+1)**2 == x**2+2*x+1` devuelve `False` aunque sean lo mismo.
> Restar y simplificar es la forma correcta de preguntarlo.

```ejercicio
# Enunciado
Completa el valor con el que se compara la resta simplificada de dos expresiones iguales.

# Plantilla
print(sp.simplify((x + 1) ** 2 - (x ** 2 + 2 * x + 1)) == ___)

# Esperado
True

# Pista
Cero.
```

# Cierre

Una letra es un número cualquiera, y con SymPy se opera con ella como en el
cuaderno: expandir, factorizar, simplificar y comprobar.

Con eso ya se puede plantear la pregunta central del álgebra: qué valor hace que
una igualdad se cumpla. Eso es resolver una ecuación, y es la sesión siguiente.
