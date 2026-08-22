---
numero: 1
titulo: "El álgebra de dos valores"
---

# Un álgebra con dos elementos

El álgebra elemental opera sobre los números reales, un conjunto infinito. El
álgebra booleana opera sobre un conjunto de dos elementos, que se escriben `0`
y `1`, y debe su nombre a George Boole.

Esa restricción tiene una consecuencia que gobierna el curso entero: como las
variables solo admiten dos valores, una expresión de `n` variables tiene
exactamente `2**n` casos posibles. Cualquier afirmación sobre ella se puede
demostrar comprobando todos, uno por uno. En el álgebra de los reales eso es
imposible; aquí es el método normal de trabajo.

Los dos elementos reciben nombres distintos según el contexto en el que se
aplique el álgebra, y los tres juegos de nombres significan lo mismo:

| Contexto | Falso | Verdadero |
|---|---|---|
| Lógica proposicional | falso | verdadero |
| Álgebra de conmutación | 0 | 1 |
| Python | `False` | `True` |

Este curso no presupone matemáticas más allá de la aritmética elemental, ni más
Python que las variables, la función `print` y las funciones definidas con
`def`.

# Los dos valores en Python

Python tiene un tipo dedicado, `bool`, con exactamente dos instancias.

```python
print(True, False)
print(type(True))
print(type(True) is type(False))
```

```salida
True False
<class 'bool'>
True
```

> Doc: [Tipo booleano — bool](https://docs.python.org/3/library/stdtypes.html#boolean-type-bool)

# `bool` es una subclase de `int`

`True` y `False` no son solo dos constantes: son enteros. `True` vale 1 y
`False` vale 0, y participan en la aritmética como tales.

```python
print(isinstance(True, int))
print(True + True + False)
print(int(True), int(False))
```

```salida
True
2
1 0
```

> Nota: esta herencia no es un detalle de implementación que convenga ignorar,
> sino el puente entre las dos notaciones del álgebra booleana. Cuando más
> adelante se escriba `a * b` para la conjunción y `a + b - a*b` para la
> disyunción, funcionará sobre valores de Python sin ninguna conversión.

> Doc: [bool()](https://docs.python.org/3/library/functions.html#bool)

```ejercicio
# Enunciado
Completa la función que comprueba si un valor pertenece al tipo booleano.

# Plantilla
print(___(True, bool))

# Esperado
True

# Pista
Diez letras: la función que comprueba si un objeto es instancia de un tipo.
```

# La negación

La negación es la única operación unaria del álgebra: recibe un valor y
devuelve el otro. Se escribe `¬a` en lógica, `a'` o `ā` en álgebra de
conmutación, y `not a` en Python.

```python
print(not True)
print(not False)
```

```salida
False
True
```

> Doc: [Operaciones booleanas — and, or, not](https://docs.python.org/3/library/stdtypes.html#boolean-operations-and-or-not)

# La conjunción

La conjunción devuelve verdadero cuando **ambos** operandos son verdaderos, y
falso en los otros tres casos. Se escribe `a ∧ b` en lógica, `a · b` o `ab` en
álgebra de conmutación, y `a and b` en Python.

```python
print(True and True)
print(True and False)
print(False and True)
print(False and False)
```

```salida
True
False
False
False
```

```venn
izquierda: a
derecha: b
resalta: interseccion
pie: La conjunción a ∧ b corresponde a la intersección: los elementos que están en los dos conjuntos a la vez
```

> Nota: el nombre `∧` procede de la notación de conjuntos para la
> intersección, `∩`. La correspondencia no es una analogía suelta: los
> conjuntos con unión, intersección y complemento forman un álgebra booleana
> con las mismas leyes que se demuestran en la sesión 3.

# La disyunción

La disyunción devuelve verdadero cuando **al menos uno** de los operandos lo
es. Se escribe `a ∨ b` en lógica, `a + b` en álgebra de conmutación, y
`a or b` en Python.

```python
print(True or True)
print(True or False)
print(False or True)
print(False or False)
```

```salida
True
True
True
False
```

```venn
izquierda: a
derecha: b
resalta: union
pie: La disyunción a ∨ b corresponde a la unión: los elementos que están en alguno de los dos conjuntos
```

> Nota: es la disyunción **inclusiva**: `True or True` da `True`. La
> disyunción exclusiva, que excluye ese caso, es una operación distinta y se
> trata en la sesión 7.

```ejercicio
# Enunciado
Completa el operador que devuelve verdadero solo si ambos operandos lo son.

# Plantilla
print(True ___ False)

# Esperado
False

# Pista
Tres letras, en inglés: la conjunción.
```

# `and` y `or` no devuelven booleanos

Aquí Python se aparta del álgebra. `and` y `or` no devuelven `True` o `False`:
devuelven **uno de los dos operandos**, sin convertirlo.

```python
print(3 and 5)
print(0 and 5)
print(3 or 5)
print(0 or 5)
```

```salida
5
0
3
5
```

La regla es la de la evaluación en cortocircuito: `a and b` evalúa `a`, y si su
valor de verdad es falso lo devuelve tal cual sin llegar a evaluar `b`; si es
verdadero, devuelve `b`. `a or b` hace lo simétrico.

> Nota: sobre operandos que ya son `bool` el resultado coincide con el del
> álgebra, así que la diferencia no se nota hasta que aparecen otros tipos. La
> consecuencia práctica es que `x or "sin nombre"` es una forma corriente de
> dar un valor por defecto, y que comparar con `== True` puede fallar donde
> `if` acierta.

> Doc: [Operaciones booleanas](https://docs.python.org/3/reference/expressions.html#boolean-operations)

# Qué cuenta como falso

`and`, `or`, `not` y `if` no exigen un `bool`: aplican a cualquier objeto la
prueba de valor de verdad. Son falsos las constantes `None` y `False`, el cero
de cualquier tipo numérico y toda colección vacía. Todo lo demás es verdadero.

```python
for valor in [None, False, 0, 0.0, "", [], {}, "0", [0], 0.1]:
    print(repr(valor), bool(valor))
```

```salida
None False
False False
0 False
0.0 False
'' False
[] False
{} False
'0' True
[0] True
0.1 True
```

> Nota: `"0"` y `[0]` son verdaderos. La cadena tiene un carácter y la lista
> tiene un elemento, y lo que se evalúa es si están vacías, no qué contienen.

> Doc: [Prueba de valor de verdad](https://docs.python.org/3/library/stdtypes.html#truth-value-testing)

# Los operadores bit a bit aplicados a booleanos

Python tiene un segundo juego de operadores lógicos: `&` (conjunción bit a
bit), `|` (disyunción bit a bit), `^` (disyunción exclusiva) y `~` (negación
bit a bit). Sobre dos `bool` los tres primeros devuelven un `bool` con el
resultado del álgebra.

```python
print(True & False, True | False, True ^ True)
print(type(True & False))
```

```salida
False True False
<class 'bool'>
```

Se diferencian de `and` y `or` en dos puntos, y ambos importan:

1. **No cortocircuitan.** `a & b` evalúa siempre los dos operandos.
2. **No aplican la prueba de valor de verdad**: operan sobre la
   representación binaria del entero.

```python
print(2 and 4)
print(2 & 4)
```

```salida
4
0
```

`2 and 4` devuelve `4` porque `2` es verdadero. `2 & 4` devuelve `0` porque los
bits de `2` (`10`) y los de `4` (`100`) no coinciden en ninguna posición. Sobre
enteros distintos de 0 y 1 los dos operadores responden preguntas distintas.

> Nota: el operador `~` no tiene el comportamiento que sugiere su nombre sobre
> booleanos. `~True` no devuelve `False`, sino `-2`, porque convierte a entero
> y aplica la fórmula del complemento a dos, `~x == -x - 1`. Para negar un
> valor de verdad, `not`. La aritmética de `~` se trata en la sesión 10.

```python
print(~True, ~False)
print(not True, not False)
```

```salida
-2 -1
False True
```

> Doc: [Operaciones bit a bit sobre enteros](https://docs.python.org/3/library/stdtypes.html#bitwise-operations-on-integer-types)

```ejercicio
# Enunciado
Completa el operador bit a bit que devuelve un bool sin cortocircuitar.

# Plantilla
print(True ___ True)

# Esperado
True

# Pista
Un solo carácter: el ampersand.
```

# La precedencia decide dónde van los paréntesis

Sin paréntesis, el orden de aplicación lo fija la tabla de precedencia del
lenguaje. Entre los operadores lógicos, de mayor a menor: `not`, `and`, `or`.

```python
print(not False and False)
print(not (False and False))
```

```salida
False
True
```

La primera línea aplica `not` solo a `False`, lo que da `True`, y después
`True and False`, que da `False`. La segunda niega el paréntesis entero.

Los operadores bit a bit se agrupan **más fuerte que las comparaciones**, al
revés que `and` y `or`. De ahí procede un error que no avisa:

```python
edad = 20
print(edad > 18 and edad < 65)
print((edad > 18) & (edad < 65))
```

```salida
True
True
```

```python !sin-consola
edad = 20
print(edad > 18 & edad < 65)
```

Esa última línea no compara lo que aparenta: `18 & edad` se evalúa primero y da
`16`, y lo que queda es la comparación encadenada `edad > 16 < 65`. Con `&` y
`|`, los paréntesis alrededor de cada comparación no son opcionales.

> Doc: [Precedencia de operadores](https://docs.python.org/3/reference/expressions.html#operator-precedence)

# Lo que queda cubierto

Están los dos valores del álgebra, las tres operaciones que la definen
—negación, conjunción y disyunción—, sus dos formas en Python y las dos
diferencias que separan `and`/`or` de `&`/`|`: el cortocircuito y la prueba de
valor de verdad.

La sesión 2 construye la herramienta con la que se demuestra todo lo demás: la
tabla de verdad, que enumera los `2**n` casos de una expresión.
