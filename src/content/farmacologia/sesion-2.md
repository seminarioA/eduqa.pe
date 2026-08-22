---
numero: 2
titulo: "El fármaco en el tiempo"
---

# La concentración no es constante

Un fármaco entra, se distribuye, se metaboliza y se elimina. La concentración en
sangre sube, alcanza un máximo y baja.

Casi todas las decisiones de una pauta dependen de esa curva: cada cuánto se
administra, cuánto tarda en hacer efecto y cuánto en dejar de ser peligroso. Y
esa curva se describe con una ecuación que se puede escribir en tres líneas.

# Eliminación de primer orden

La mayoría de los fármacos se eliminan siguiendo una cinética de primer orden:
en cada intervalo de tiempo desaparece **una fracción constante** de lo que hay,
no una cantidad constante.

Esa diferencia lo cambia todo. Si desapareciera una cantidad fija, la curva sería
una recta y el fármaco se agotaría de forma abrupta. Al desaparecer una fracción, la
curva es exponencial y nunca llega a cero del todo.

```python
concentracion = 100.0
for hora in range(1, 5):
    concentracion = concentracion * 0.7
    print(hora, round(concentracion, 2))
```

```salida
1 70.0
2 49.0
3 34.3
4 24.01
```

> Nota: Aquí desaparece el 30 % de lo que hay en cada hora, no 30 unidades. Por
> eso la primera hora se pierden 30 y la cuarta solo 10.3: la fracción es la
> misma, la cantidad no.

```ejercicio
# Enunciado
Completa la fracción que queda tras cada hora si se elimina el 30 % de lo presente.

# Plantilla
concentracion = 100.0
concentracion = concentracion * ___
print(round(concentracion, 2))

# Esperado
70.0

# Pista
Si se va el treinta por ciento, queda el resto expresado en tanto por uno.
```

# La constante de eliminación

La forma cerrada de esa curva es una exponencial. La concentración en el instante
`t` es la concentración inicial multiplicada por `e` elevado a menos `k` por `t`,
donde `k` es la constante de eliminación y se mide en inversa de tiempo.

La función `exp()` del módulo `math` calcula esa exponencial.

```python
import math

c0 = 100.0
k = 0.35
t = 4
concentracion = c0 * math.exp(-k * t)
print(round(concentracion, 3))
```

```salida
24.66
```

> Doc: [math.exp()](https://docs.python.org/3/library/math.html#math.exp)

> Nota: El signo negativo del exponente es lo que hace que la curva baje. Con `k`
> positiva y sin ese signo la concentración crecería sin límite, que es el error
> más frecuente al escribir la fórmula de memoria.

```ejercicio
# Enunciado
Completa el signo del exponente para que la concentración disminuya con el tiempo.

# Plantilla
import math
print(round(100.0 * math.exp(___0.35 * 4), 2))

# Esperado
24.66

# Pista
Un solo carácter, el que convierte un crecimiento en una caída.
```

# La semivida

La semivida es el tiempo que tarda la concentración en reducirse a la mitad. Es
la magnitud que se usa en la práctica, porque se entiende sin pensar en
exponenciales.

Se relaciona con la constante de eliminación a través del logaritmo natural de
dos.

```python
import math

k = 0.35
semivida = math.log(2) / k
print(round(semivida, 2))
```

```salida
1.98
```

> Doc: [math.log()](https://docs.python.org/3/library/math.html#math.log)

> Nota: `math.log()` con un solo argumento es el logaritmo natural, en base `e`,
> no el de base diez. El de base diez es `math.log10()`. Confundirlos da un
> resultado tres veces menor y sin ningún aviso.

```ejercicio
# Enunciado
Completa la función que calcula el logaritmo natural para obtener la semivida.

# Plantilla
import math
print(round(math.___(2) / 0.35, 2))

# Esperado
1.98

# Pista
Tres letras: el logaritmo natural en la biblioteca estándar.
```

# De la semivida a la constante

La relación funciona en los dos sentidos. Un prospecto suele dar la semivida, y
para calcular la curva se requiere la constante.

```python
import math

semivida = 4.0
k = math.log(2) / semivida
print(round(k, 4))
```

```salida
0.1733
```

```ejercicio
# Enunciado
Completa la semivida en horas para obtener una constante de eliminación de 0.3466 por hora.

# Plantilla
import math
print(round(math.log(2) / ___, 4))

# Esperado
0.3466

# Pista
La constante es el doble que la del ejemplo, así que la semivida es la mitad de cuatro.
```

# Cuántas semividas hasta que deja de contar

Tras una semivida queda la mitad, tras dos la cuarta parte, tras tres un octavo.
La regla que se usa en la práctica es que a las **cuatro o cinco semividas** queda
tan poco que el fármaco deja de tener efecto apreciable.

```python
restante = 1.0
for n in range(1, 6):
    restante = restante / 2
    print(n, f"{restante * 100:.2f}%")
```

```salida
1 50.00%
2 25.00%
3 12.50%
4 6.25%
5 3.12%
```

> Nota: Que quede un 3 % no significa que el fármaco haya desaparecido. En un
> fármaco de índice terapéutico estrecho, ese resto puede seguir importando, y
> por eso la regla de las cinco semividas es una orientación y no un criterio de
> seguridad.

```ejercicio
# Enunciado
Completa el divisor que reduce la cantidad restante a la mitad en cada semivida.

# Plantilla
restante = 1.0
for n in range(3):
    restante = restante / ___
print(f"{restante * 100:.2f}%")

# Esperado
12.50%

# Pista
Semivida significa que queda la mitad.
```

# Una serie de concentraciones

Con una comprensión de lista se obtiene la curva entera en una línea, evaluando
la fórmula en cada instante.

```python
import math

c0 = 100.0
k = 0.35
curva = [round(c0 * math.exp(-k * t), 2) for t in range(0, 7)]
print(curva)
```

```salida
[100.0, 70.47, 49.66, 34.99, 24.66, 17.38, 12.25]
```

> Doc: [Listas por comprensión](https://docs.python.org/3/tutorial/datastructures.html#list-comprehensions)

```ejercicio
# Enunciado
Completa la palabra clave que recorre los instantes dentro de la comprensión.

# Plantilla
import math
print([round(100.0 * math.exp(-0.35 * t), 2) ___ t in range(3)])

# Esperado
[100.0, 70.47, 49.66]

# Pista
Tres letras: la misma sentencia que abre un bucle.
```

# Emparejar el instante con la medida

Para leer la curva se necesita saber a qué hora corresponde cada valor. La función
`zip()` recorre las dos series a la vez.

```python
import math

horas = [0, 2, 4, 6]
concentraciones = [round(100.0 * math.exp(-0.35 * t), 1) for t in horas]
for h, c in zip(horas, concentraciones):
    print(f"{h} h: {c} mg/L")
```

```salida
0 h: 100.0 mg/L
2 h: 49.7 mg/L
4 h: 24.7 mg/L
6 h: 12.2 mg/L
```

> Doc: [zip()](https://docs.python.org/3/library/functions.html#zip)

```ejercicio
# Enunciado
Completa la función que recorre las dos listas emparejando sus elementos.

# Plantilla
horas = [0, 2]
valores = [100.0, 49.7]
for h, c in ___(horas, valores):
    print(h, c)

# Esperado
0 100.0
2 49.7

# Pista
Tres letras: la palabra inglesa de la cremallera que une dos lados.
```

# Cuándo se cruza un umbral

Una pregunta habitual es cuánto tarda la concentración en bajar de un valor. Con
un bucle `while` se avanza hasta cumplir la condición, sin saber de antemano
cuántas vueltas harán falta.

```python
import math

c0 = 100.0
k = 0.35
umbral = 20.0
t = 0
while c0 * math.exp(-k * t) > umbral:
    t += 1
print(t)
```

```salida
5
```

> Nota: Este bucle avanza de hora en hora, así que da la primera hora entera en
> la que se cumple la condición, no el instante exacto. El instante exacto se
> despeja de la fórmula: el logaritmo del cociente de concentraciones dividido
> entre `k`, que aquí da 4.6 horas.

```ejercicio
# Enunciado
Completa la sentencia que repite mientras la concentración siga por encima del umbral.

# Plantilla
import math
t = 0
___ 100.0 * math.exp(-0.35 * t) > 20.0:
    t += 1
print(t)

# Esperado
5

# Pista
Cinco letras: la conjunción inglesa «mientras».
```

# Cierre

Ya está la herramienta central de la farmacocinética: una curva que cae de forma
exponencial, descrita por una constante que se traduce a semivida y al revés.

La sesión siguiente pasa a NumPy y añade los dos parámetros que faltan para
describir a un paciente concreto: el volumen de distribución y el aclaramiento.
