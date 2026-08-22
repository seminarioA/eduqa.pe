---
numero: 4
titulo: "Dosis repetidas y respuesta"
paquetes: ["numpy"]
preludio: |
  import numpy as np
---

# Una dosis no basta

Un tratamiento no es una dosis: es una pauta. Se administra cada ocho horas, cada
doce o cada día, y cada dosis nueva entra cuando la anterior todavía no ha
desaparecido.

Eso hace que la concentración se acumule hasta llegar a un equilibrio. Esta sesión
trata de ese equilibrio y de cómo se traduce la concentración en efecto.

# La acumulación

Si el intervalo entre dosis es menor que el tiempo que tarda el fármaco en
eliminarse, queda un resto que se suma a la dosis siguiente.

Con una semivida de cuatro horas y una dosis cada cuatro horas, cada nueva dosis
entra cuando queda la mitad de la anterior.

```python
concentracion = 0.0
for dosis in range(1, 6):
    concentracion = concentracion + 10.0
    print(dosis, round(concentracion, 3))
    concentracion = concentracion * 0.5
```

```salida
1 10.0
2 15.0
3 17.5
4 18.75
5 19.375
```

> Nota: Los incrementos se van haciendo más pequeños: 5, 2.5, 1.25. La serie
> converge, y ese límite es lo que se llama estado estacionario. Que converja es
> lo que hace posible una pauta indefinida sin que la concentración crezca sin
> techo.

```ejercicio
# Enunciado
Completa la fracción que queda al cabo de una semivida, para simular la acumulación.

# Plantilla
concentracion = 0.0
for dosis in range(3):
    concentracion = concentracion + 10.0
    concentracion = concentracion * ___
print(round(concentracion, 3))

# Esperado
8.75

# Pista
Tras una semivida queda la mitad.
```

# El estado estacionario

El límite de esa serie tiene forma cerrada: es la dosis dividida entre uno menos
la fracción que queda en cada intervalo.

En el estado estacionario, lo que entra en cada intervalo es igual a lo que se
elimina, y la concentración oscila entre dos valores fijos sin seguir subiendo.

```python
dosis = 10.0
fraccion_restante = 0.5
maximo = dosis / (1 - fraccion_restante)
print(round(maximo, 2))
print(round(maximo * fraccion_restante, 2))
```

```salida
20.0
10.0
```

> Nota: Los dos valores son el pico y el valle del estado estacionario. El valle
> es el que se compara con la concentración mínima eficaz y el pico con la
> concentración tóxica; una pauta correcta mantiene la oscilación entre ambos.

```ejercicio
# Enunciado
Completa el denominador que da la concentración máxima en estado estacionario.

# Plantilla
dosis = 10.0
fraccion = 0.5
print(round(dosis / (___ - fraccion), 2))

# Esperado
20.0

# Pista
Es la fracción total antes de restarle la que queda.
```

# Cuánto tarda en alcanzarse

El estado estacionario se alcanza tras **cuatro o cinco semividas**, y esto no
depende de la dosis ni del intervalo: solo de la semivida.

Aumentar la dosis sube el nivel del equilibrio, pero no acorta el tiempo que
tarda en llegar. Por eso, cuando se requiere el efecto desde el principio, se
administra una dosis de carga.

```python
maximo = 20.0
concentracion = 0.0
for semivida in range(1, 6):
    concentracion = maximo - (maximo - concentracion) * 0.5
    print(semivida, f"{concentracion / maximo * 100:.1f}%")
```

```salida
1 50.0%
2 75.0%
3 87.5%
4 93.8%
5 96.9%
```

```ejercicio
# Enunciado
Completa la fracción que hace que la distancia al equilibrio se reduzca a la mitad en cada semivida.

# Plantilla
maximo = 20.0
c = 0.0
for i in range(2):
    c = maximo - (maximo - c) * ___
print(f"{c / maximo * 100:.1f}%")

# Esperado
75.0%

# Pista
En una semivida se recorre la mitad de lo que falta.
```

# La dosis de carga

Una dosis de carga es una primera dosis mayor, calculada para alcanzar de
inmediato la concentración objetivo en lugar de esperar cuatro semividas.

Es el producto de la concentración que se busca por el volumen de distribución.

```python
concentracion_objetivo = 15.0
volumen_l = 50.0
dosis_carga = concentracion_objetivo * volumen_l
print(dosis_carga)
```

```salida
750.0
```

> Nota: La dosis de carga depende del volumen de distribución, y la de
> mantenimiento del aclaramiento. Son parámetros distintos, y por eso dos
> pacientes pueden necesitar la misma carga y mantenimientos muy diferentes: un
> deterioro renal cambia el aclaramiento sin cambiar apenas el volumen.

```ejercicio
# Enunciado
Completa el operador que combina la concentración objetivo con el volumen de distribución.

# Plantilla
print(15.0 ___ 50.0)

# Esperado
750.0

# Pista
La dosis de carga llena todo el volumen hasta la concentración buscada.
```

# La concentración no es el efecto

Hasta aquí todo era farmacocinética: cuánto fármaco hay. La farmacodinamia
pregunta otra cosa: qué efecto produce esa cantidad.

La relación entre las dos no es proporcional. El efecto crece con la
concentración hasta que se satura, porque los receptores sobre los que actúa el
fármaco son finitos y llega un punto en que están todos ocupados.

# El modelo Emax

El modelo más simple que describe esa saturación es el de Emax. El efecto es el
efecto máximo multiplicado por la concentración y dividido entre la suma de la
concentración y una constante.

```python
def efecto(concentracion, emax, ec50):
    return emax * concentracion / (ec50 + concentracion)

for c in [0, 2, 5, 10, 20, 50]:
    print(c, round(efecto(c, 100.0, 5.0), 1))
```

```salida
0 0.0
2 28.6
5 50.0
10 66.7
20 80.0
50 90.9
```

> Nota: Duplicar la concentración de 20 a 40 sube el efecto de 80 a 88.9, poco
> más de ocho puntos, mientras que subirla de 0 a 5 lo sube cincuenta. Esa es la
> razón por la que aumentar la dosis de un fármaco cerca de la saturación añade
> toxicidad sin añadir apenas efecto.

```ejercicio
# Enunciado
Completa el denominador del modelo Emax, que es la suma de la constante y la concentración.

# Plantilla
def efecto(c, emax, ec50):
    return emax * c / (___ + c)

print(round(efecto(5.0, 100.0, 5.0), 1))

# Esperado
50.0

# Pista
Es el otro parámetro de la función, el que da el nombre a la concentración eficaz media.
```

# La EC50

La constante del denominador es la EC50: la concentración que produce la mitad
del efecto máximo. Se comprueba sustituyendo, porque al ser la concentración
igual a la constante el cociente vale exactamente un medio.

Es la magnitud que mide la potencia de un fármaco. Cuanto menor es la EC50, menos
concentración se requiere para el mismo efecto.

```python
def efecto(concentracion, emax, ec50):
    return emax * concentracion / (ec50 + concentracion)

print(round(efecto(5.0, 100.0, 5.0), 2))
print(round(efecto(2.0, 100.0, 2.0), 2))
```

```salida
50.0
50.0
```

> Nota: Potencia y eficacia no son lo mismo y se confunden a menudo. La potencia
> es la EC50 y dice cuánta concentración se requiere; la eficacia es el Emax y dice
> hasta dónde llega el efecto. Un fármaco muy potente puede tener una eficacia
> máxima menor que otro menos potente.

```ejercicio
# Enunciado
Completa la concentración que produce exactamente la mitad del efecto máximo cuando la EC50 vale 8.

# Plantilla
def efecto(c, emax, ec50):
    return emax * c / (ec50 + c)

print(round(efecto(___, 100.0, 8.0), 2))

# Esperado
50.0

# Pista
Es la concentración que iguala a la EC50.
```

# La ecuación de Hill

El modelo Emax supone que cada molécula de fármaco actúa por su cuenta. Cuando la
unión de una favorece la de las siguientes, la curva se vuelve más abrupta y hace
falta un exponente, llamado coeficiente de Hill.

Con el coeficiente igual a uno, la ecuación de Hill es el modelo Emax.

```python
def hill(concentracion, emax, ec50, n):
    return emax * concentracion**n / (ec50**n + concentracion**n)

for c in [2, 5, 10]:
    print(c, round(hill(c, 100.0, 5.0, 1), 1), round(hill(c, 100.0, 5.0, 3), 1))
```

```salida
2 28.6 6.0
5 50.0 50.0
10 66.7 88.9
```

> Nota: En la EC50 las dos curvas coinciden, porque ahí el cociente vale un medio
> sea cual sea el exponente. Lo que cambia el coeficiente es la pendiente
> alrededor de ese punto: con exponente 3 el paso de casi nada de efecto a casi
> todo ocurre en un margen de concentración mucho más estrecho.

```ejercicio
# Enunciado
Completa el operador de potencia que eleva la concentración al coeficiente de Hill.

# Plantilla
def hill(c, emax, ec50, n):
    return emax * c___n / (ec50**n + c**n)

print(round(hill(10.0, 100.0, 5.0, 3), 1))

# Esperado
88.9

# Pista
Son dos veces el mismo símbolo que también sirve para multiplicar.
```

# El margen entre efecto y daño

El índice terapéutico compara la concentración a la que aparece la toxicidad con
la concentración a la que se obtiene el efecto. Cuanto mayor es el cociente, más
margen hay.

Un índice pequeño significa que la dosis eficaz y la tóxica están cerca, y que la
pauta hay que ajustarla midiendo concentraciones en sangre en lugar de calcularla
sobre el peso.

```python
concentracion_toxica = 12.0
concentracion_eficaz = 8.0
indice = concentracion_toxica / concentracion_eficaz
print(round(indice, 2))
print(indice < 2)
```

```salida
1.5
True
```

> Nota: Este cociente es una simplificación. El índice terapéutico se define sobre
> las dosis que producen un efecto en una fracción determinada de la población
> —habitualmente la mitad—, no sobre dos concentraciones sueltas, y su valor
> depende de qué efecto adverso se considere. Aquí sirve para ver la idea, no
> para clasificar ningún fármaco.

```ejercicio
# Enunciado
Completa el operador que compara la concentración tóxica con la eficaz.

# Plantilla
print(round(12.0 ___ 8.0, 2))

# Esperado
1.5

# Pista
El índice es una concentración en relación con la otra.
```

# Cierre

El recorrido está completo: de la dosis al volumen que se administra, de ahí a la
curva en el tiempo, a los parámetros que describen al paciente, a lo que ocurre
cuando la pauta se repite y, por último, a la relación entre concentración y
efecto.

El paso siguiente natural son los modelos de dos compartimentos, que separan la
sangre de los tejidos, y el ajuste de parámetros a concentraciones medidas en un
paciente concreto, que es lo que se hace en monitorización terapéutica.

Y conviene repetirlo una vez más: todo lo de este curso son cálculos sobre
valores de ejemplo. La pauta de un paciente la decide un profesional habilitado
con fuentes validadas, y ninguna cifra de aquí sirve para eso.
