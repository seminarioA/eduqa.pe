---
numero: 1
titulo: "La dosis y su cálculo"
---

# Lo que la farmacología cuenta

La farmacología estudia qué le hace el organismo a un fármaco y qué le hace el
fármaco al organismo. Lo primero se llama farmacocinética; lo segundo,
farmacodinamia.

Las dos son cuantitativas. Cuánto fármaco hay en sangre a las tres horas, cuánto
queda tras una semivida, qué fracción de receptores está ocupada a una
concentración dada: todo eso son números que se calculan, y calcularlos a mano
en cada caso es lento y propenso a error.

Este curso usa Python para esos cálculos. Da por sabido lo básico del lenguaje
—variables, funciones, listas y bucles—; si eso todavía no está, conviene hacer
antes el curso de introducción a Python.

> Nota: Nada de lo que aparece en este curso sirve para decidir la medicación de
> nadie. Los valores son de ejemplo, redondeados y sacados de rangos típicos de
> libro de texto: los reales varían con la edad, la función renal y hepática, el
> peso, otros fármacos y la fuente que se consulte. Calcular una dosis en un
> paciente es un acto clínico, lo hace un profesional habilitado y se apoya en
> fuentes validadas, no en un curso de programación.

# La dosis se expresa por kilogramo

Una dosis rara vez es una cantidad fija. Se expresa en miligramos de fármaco por
kilogramo de peso, porque un mismo miligramo no produce el mismo efecto en un
adulto de ochenta kilos que en un niño de doce.

La dosis total es el producto de esa cantidad por el peso.

```python
dosis_por_kg = 15
peso = 12
dosis_total = dosis_por_kg * peso
print(dosis_total)
```

```salida
180
```

> Nota: La unidad se escribe con el número o se pierde. Un `180` suelto en una
> variable no dice si son miligramos, microgramos o mililitros, y las tres cosas
> aparecen en la misma receta. El nombre de la variable es el único sitio donde
> queda constancia, y por eso conviene que lo lleve: `dosis_total_mg`.

```ejercicio
# Enunciado
Calcula la dosis total para un paciente de 70 kg con una pauta de 10 mg por kilogramo.

# Plantilla
dosis_por_kg = 10
peso = ___
print(dosis_por_kg * peso)

# Esperado
700

# Pista
Es el peso en kilogramos que da el enunciado.
```

# La concentración de la presentación

El fármaco no viene en miligramos sueltos: viene disuelto. Un jarabe de 120
miligramos por cada 5 mililitros tiene una concentración de 24 miligramos por
mililitro.

La concentración es la masa dividida entre el volumen.

```python
masa_mg = 120
volumen_ml = 5
concentracion = masa_mg / volumen_ml
print(concentracion)
```

```salida
24.0
```

> Nota: La división devuelve un `float` aunque el resultado sea exacto, y por eso
> imprime `24.0` y no `24`. En una etiqueta ese decimal sobra, y ahí es donde se
> usa el formato: `f"{concentracion:.0f}"`.

```ejercicio
# Enunciado
Completa el operador que calcula la concentración a partir de la masa y el volumen.

# Plantilla
masa_mg = 250
volumen_ml = 5
print(masa_mg ___ volumen_ml)

# Esperado
50.0

# Pista
La concentración es una masa repartida en un volumen.
```

# El volumen que se administra

Con la dosis y la concentración ya se sabe cuánto líquido hay que dar: la dosis
dividida entre la concentración.

Este es el cálculo que se hace a pie de cama y donde un error de un factor diez
es un error de un factor diez en el paciente.

```python
dosis_mg = 180
concentracion_mg_ml = 24
volumen_ml = dosis_mg / concentracion_mg_ml
print(round(volumen_ml, 2))
```

```salida
7.5
```

```ejercicio
# Enunciado
Completa el cálculo del volumen a administrar para una dosis de 500 mg con una concentración de 50 mg/mL.

# Plantilla
dosis_mg = 500
concentracion_mg_ml = 50
print(dosis_mg ___ concentracion_mg_ml)

# Esperado
10.0

# Pista
El volumen es la dosis repartida a la concentración disponible.
```

# Redondear a lo que se puede medir

Una jeringa no mide 7.4833 mililitros. Mide décimas, y a veces solo medios
mililitros.

El resultado del cálculo se ajusta a lo que el material permite medir, y ese
ajuste se hace al final, nunca en medio de la cadena de operaciones.

```python
volumen_exacto = 179.5 / 24
print(volumen_exacto)
print(round(volumen_exacto, 1))
```

```salida
7.479166666666667
7.5
```

> Nota: `round()` aplica redondeo bancario: los empates van al par más cercano,
> de modo que `round(0.25, 1)` da `0.2` y no `0.3`. Cuando el criterio de
> redondeo forma parte de un protocolo, se fija de forma explícita con el módulo
> `decimal` en lugar de confiar en el comportamiento por defecto.

```ejercicio
# Enunciado
Completa la cantidad de decimales para ajustar el volumen a las décimas de mililitro.

# Plantilla
print(round(179.5 / 24, ___))

# Esperado
7.5

# Pista
Una décima es un decimal.
```

# Comprobar que la dosis cae en el rango

Una pauta tiene un rango: por debajo no hace efecto y por encima es tóxica. Antes
de administrar nada se comprueba que el número calculado cae dentro.

En Python las comparaciones se encadenan, de modo que la condición se escribe
igual que en matemáticas.

```python
dosis_por_kg = 15
print(10 <= dosis_por_kg <= 20)
```

```salida
True
```

```ejercicio
# Enunciado
Completa el operador que exige que se cumplan las dos condiciones a la vez.

# Plantilla
dosis = 15
print(dosis >= 10 ___ dosis <= 20)

# Esperado
True

# Pista
Tres letras: la conjunción copulativa en inglés.
```

# El cálculo, encapsulado

Un cálculo que se repite se escribe una vez y se le pone nombre. Así se corrige
en un solo sitio y se puede comprobar por separado.

```python
def volumen_a_administrar(peso_kg, dosis_por_kg, concentracion_mg_ml):
    dosis_mg = peso_kg * dosis_por_kg
    return dosis_mg / concentracion_mg_ml

print(round(volumen_a_administrar(12, 15, 24), 2))
print(round(volumen_a_administrar(70, 10, 50), 2))
```

```salida
7.5
14.0
```

> Nota: La función devuelve el volumen sin redondear y quien la llama decide con
> cuántos decimales lo presenta. Redondear dentro obligaría a todos los usos al
> mismo criterio, y el material con el que se mide no siempre es el mismo.

```ejercicio
# Enunciado
Completa la palabra clave que hace que la función entregue el resultado a quien la llamó.

# Plantilla
def volumen(peso, dosis_kg, concentracion):
    ___ peso * dosis_kg / concentracion

print(round(volumen(12, 15, 24), 2))

# Esperado
7.5

# Pista
Seis letras: el verbo devolver en inglés.
```

# Rechazar lo imposible

Un peso de cero o negativo no es un dato raro: es un dato imposible. Si entra en
el cálculo, se obtiene un número con aspecto de dosis.

La sentencia `raise` interrumpe la función y señala el problema en lugar de
devolver una cifra sin sentido.

```python
def volumen_a_administrar(peso_kg, dosis_por_kg, concentracion_mg_ml):
    if peso_kg <= 0:
        raise ValueError("El peso debe ser mayor que cero")
    if concentracion_mg_ml <= 0:
        raise ValueError("La concentración debe ser mayor que cero")
    return peso_kg * dosis_por_kg / concentracion_mg_ml

print(round(volumen_a_administrar(12, 15, 24), 2))
```

```salida
7.5
```

> Nota: Comprobar antes de calcular se llama validación de entrada. En cualquier
> sistema que toque datos de personas es obligatoria, y no por pulcritud: un valor
> imposible que pasa sin avisar no desaparece, reaparece más adelante convertido
> en un resultado plausible y falso.

```ejercicio
# Enunciado
Completa la sentencia que interrumpe la función y señala el error.

# Plantilla
def volumen(peso, dosis_kg, concentracion):
    if peso <= 0:
        ___ ValueError("peso no válido")
    return peso * dosis_kg / concentracion

print(round(volumen(12, 15, 24), 2))

# Esperado
7.5

# Pista
Cinco letras: el verbo lanzar o levantar en inglés.
```

# Presentar el resultado

El número calculado acaba en una etiqueta o en una pantalla, y ahí importa cómo
se escribe. Un literal de cadena formateado interpola el valor y fija los
decimales.

```python
volumen = 7.479166666666667
print(f"Administrar {volumen:.1f} mL")
```

```salida
Administrar 7.5 mL
```

```ejercicio
# Enunciado
Completa el especificador que fija un decimal en el volumen.

# Plantilla
volumen = 7.479166666666667
print(f"Administrar {volumen:___} mL")

# Esperado
Administrar 7.5 mL

# Pista
Un punto, la cantidad de decimales y la letra del formato de coma fija.
```

# Cierre

Con esto ya se calcula una dosis, se convierte en volumen, se comprueba contra un
rango y se rechaza lo imposible. Es la parte aritmética de la farmacología, y la
que más se usa.

La sesión siguiente introduce el tiempo: qué pasa con el fármaco desde que entra
hasta que desaparece.
