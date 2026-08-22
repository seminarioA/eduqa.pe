---
numero: 3
titulo: "Volumen, aclaramiento y exposición"
paquetes: ["numpy"]
preludio: |
  import numpy as np
---

# Dos parámetros describen al paciente

La curva de la sesión anterior tiene una forma fija. Lo que cambia de un paciente
a otro son dos magnitudes: cuánto se diluye el fármaco en el cuerpo y con qué
rapidez lo retira el organismo.

La primera es el volumen de distribución. La segunda, el aclaramiento. Con esas
dos se deriva todo lo demás, incluida la constante de eliminación.

Esta sesión usa NumPy, que opera sobre series enteras sin escribir bucles.

# El volumen de distribución

El volumen de distribución es el volumen en el que **parecería** estar disuelto el
fármaco si estuviera repartido de manera uniforme a la concentración del plasma.

Es un volumen aparente, no anatómico. Un fármaco que se acumula en la grasa o en
el músculo deja poca cantidad en plasma, y el cálculo devuelve un volumen mayor
que el del cuerpo entero. No es un error: es lo que indica que el fármaco no se
queda en la sangre.

Se obtiene dividiendo la dosis entre la concentración inicial.

```python
dosis_mg = 500
concentracion_inicial_mg_l = 10
volumen_l = dosis_mg / concentracion_inicial_mg_l
print(volumen_l)
```

```salida
50.0
```

> Nota: Las unidades tienen que ser coherentes o el número resulta correcto y significa
> otra cosa. Con la dosis en miligramos y la concentración en miligramos por
> litro, el volumen se expresa en litros. Si la concentración viniera en microgramos
> por mililitro habría que convertir antes, aunque las dos unidades sean
> numéricamente equivalentes.

```ejercicio
# Enunciado
Calcula el volumen de distribución para una dosis de 300 mg que alcanza una concentración inicial de 12 mg/L.

# Plantilla
dosis_mg = 300
concentracion = ___
print(dosis_mg / concentracion)

# Esperado
25.0

# Pista
Es la concentración inicial en miligramos por litro que da el enunciado.
```

# El aclaramiento

El aclaramiento es el volumen de plasma que queda libre de fármaco por unidad de
tiempo. Se mide en litros por hora y describe la capacidad de eliminación del
organismo, sobre todo del riñón y del hígado.

Es el producto de la constante de eliminación por el volumen de distribución.

```python
k = 0.1733
volumen_l = 50.0
aclaramiento = k * volumen_l
print(round(aclaramiento, 3))
```

```salida
8.665
```

```ejercicio
# Enunciado
Completa el operador que combina la constante de eliminación con el volumen para dar el aclaramiento.

# Plantilla
print(round(0.1733 ___ 50.0, 3))

# Esperado
8.665

# Pista
El aclaramiento es el volumen que se depura por unidad de tiempo.
```

# La relación entre los tres

Las tres magnitudes están ligadas por una sola ecuación, así que conocidas dos se
obtiene la tercera. La constante de eliminación es el aclaramiento dividido entre
el volumen de distribución.

Esto tiene una consecuencia clínica directa: un paciente con la función renal
disminuida tiene menos aclaramiento y, con el mismo volumen, una constante menor.
Su semivida es más larga y el fármaco se le acumula.

```python
import math

aclaramiento = 8.665
volumen_l = 50.0
k = aclaramiento / volumen_l
print(round(k, 4))
print(round(math.log(2) / k, 2))
```

```salida
0.1733
4.0
```

```ejercicio
# Enunciado
Completa el operador que despeja la constante de eliminación a partir del aclaramiento y el volumen.

# Plantilla
print(round(4.33 ___ 50.0, 4))

# Esperado
0.0866

# Pista
La constante es el aclaramiento repartido en el volumen.
```

# La curva completa con NumPy

Un arreglo de NumPy opera sobre todos sus elementos a la vez. La función
`np.exp()` aplica la exponencial a la serie entera, sin bucle ni comprensión.

```python
tiempo = np.arange(0, 13, 2)
c0 = 10.0
k = 0.1733
curva = c0 * np.exp(-k * tiempo)
print(tiempo)
print(np.round(curva, 2))
```

```salida
[ 0  2  4  6  8 10 12]
[10.    7.07  5.    3.54  2.5   1.77  1.25]
```

> Doc: [numpy.exp](https://numpy.org/doc/stable/reference/generated/numpy.exp.html)

> Doc: [numpy.arange](https://numpy.org/doc/stable/reference/generated/numpy.arange.html)

> Nota: A las cuatro horas la concentración es la mitad y a las ocho la cuarta
> parte, que es exactamente lo que dice una semivida de cuatro horas. Comprobar
> que la curva reproduce el valor conocido es la forma más rápida de detectar un
> signo cambiado o unas unidades mal puestas.

```ejercicio
# Enunciado
Completa la función de NumPy que aplica la exponencial a toda la serie.

# Plantilla
tiempo = np.arange(0, 5, 2)
print(np.round(10.0 * np.___(-0.1733 * tiempo), 2))

# Esperado
[10.    7.07  5.  ]

# Pista
Tres letras, el mismo nombre que la función del módulo math.
```

# La exposición total

El área bajo la curva de concentración frente al tiempo se llama AUC y mide la
exposición total del organismo al fármaco. Es la magnitud que se compara cuando
se quiere saber si dos formulaciones son equivalentes.

La función `np.trapezoid()` la aproxima por el método del trapecio.

```python
tiempo = np.arange(0, 25, 1)
curva = 10.0 * np.exp(-0.1733 * tiempo)
auc = np.trapezoid(curva, tiempo)
print(round(float(auc), 2))
```

```salida
56.94
```

> Doc: [numpy.trapezoid](https://numpy.org/doc/stable/reference/generated/numpy.trapezoid.html)

> Nota: El valor exacto de la integral desde cero hasta infinito es la
> concentración inicial dividida entre la constante, que aquí da 57.70. Faltan
> 0.76 y casi todo viene de cortar a las 24 horas: la cola que queda a partir de
> ahí vale 0.90. En sentido contrario, el trapecio sobreestima una curva convexa,
> y esos 0.14 de más son los que dejan la diferencia en 0.76.

```ejercicio
# Enunciado
Completa la función de NumPy que integra la curva por el método del trapecio.

# Plantilla
tiempo = np.arange(0, 25, 1)
curva = 10.0 * np.exp(-0.1733 * tiempo)
print(round(float(np.___(curva, tiempo)), 2))

# Esperado
56.94

# Pista
Nueve letras: el nombre del método de integración, en inglés.
```

# El máximo y cuándo ocurre

Sobre un arreglo, el método `max()` da el valor mayor y la función `np.argmax()`
da la posición en la que está. Con esa posición se recupera el instante.

```python
tiempo = np.arange(0, 13, 2)
curva = 10.0 * np.exp(-0.1733 * tiempo)
print(round(float(curva.max()), 2))
print(float(tiempo[np.argmax(curva)]))
```

```salida
10.0
0.0
```

> Doc: [numpy.argmax](https://numpy.org/doc/stable/reference/generated/numpy.argmax.html)

> Nota: El máximo está en el instante cero porque este modelo supone que la dosis
> entra de una sola vez en la sangre, como en una inyección intravenosa rápida. Por vía
> oral el fármaco tiene que absorberse primero, la curva sube antes de bajar y el
> máximo se desplaza a un instante posterior.

```ejercicio
# Enunciado
Completa la función que devuelve la posición del valor máximo del arreglo.

# Plantilla
curva = np.array([2.0, 9.0, 4.0])
print(int(np.___(curva)))

# Esperado
1

# Pista
Seis letras: «arg» seguido de las tres del máximo.
```

# Seleccionar por condición

Comparar un arreglo con un número devuelve otro arreglo de booleanos, del mismo
tamaño. Usado como índice, deja pasar solo las posiciones verdaderas.

Sirve para responder desde cuándo la concentración está por debajo de un umbral.

```python
tiempo = np.arange(0, 25, 1)
curva = 10.0 * np.exp(-0.1733 * tiempo)
bajo_umbral = tiempo[curva < 2.0]
print(int(bajo_umbral[0]))
print(int((curva < 2.0).sum()))
```

```salida
10
15
```

> Doc: [Indexado](https://numpy.org/doc/stable/user/basics.indexing.html)

> Nota: El método `sum()` sobre la máscara cuenta cuántos elementos cumplen la
> condición, porque `True` vale uno y `False` vale cero. Es más barato que
> construir el arreglo filtrado cuando solo interesa el recuento.

```ejercicio
# Enunciado
Completa la comparación que selecciona los instantes en los que la concentración está por debajo del umbral.

# Plantilla
tiempo = np.arange(0, 25, 1)
curva = 10.0 * np.exp(-0.1733 * tiempo)
print(int(tiempo[curva ___ 2.0][0]))

# Esperado
10

# Pista
Un solo carácter, el que se abre hacia el número más grande.
```

# Cierre

Con el volumen de distribución y el aclaramiento ya se describe a un paciente
concreto, y de ahí se derivan la constante, la semivida, la curva y la exposición
total.

La última sesión trata lo que ocurre cuando la dosis no es única, y cómo se
relaciona la concentración con el efecto.
