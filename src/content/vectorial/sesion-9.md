---
numero: 9
titulo: "El teorema de Green"
paquetes: ["numpy", "sympy"]
preludio: |
  import numpy as np
  import sympy as sp
  x, y, t = sp.symbols("x y t", real=True)
---

# Relacionar el borde con el interior

El teorema de Green establece que la integral de un campo a lo largo de una
curva cerrada del plano es igual a la integral doble del rotacional sobre la
región que dicha curva encierra.

Su interés práctico consiste en que permite sustituir una integral sobre el
borde por otra sobre el interior, o al contrario, según cuál resulte más
sencilla.

# El miembro del interior

```python
P, Q = -y, x
rotacional = sp.diff(Q, x) - sp.diff(P, y)
print(rotacional)
interior = sp.integrate(
    sp.integrate(rotacional, (y, -sp.sqrt(1 - x**2), sp.sqrt(1 - x**2))),
    (x, -1, 1),
)
print(sp.simplify(interior))
```

```salida
2
2*pi
```

> Doc: [sympy.integrate](https://docs.sympy.org/latest/modules/integrals/integrals.html)

> Nota: Los límites de la integral interior describen el disco de radio uno: para
> cada abscisa, la ordenada recorre el intervalo comprendido entre las dos ramas
> de la circunferencia. El resultado es dos pi, que corresponde al doble del área
> del disco, dado que el rotacional es constante e igual a dos.

```ejercicio
# Enunciado
Completa la expresión que define el rotacional en el plano.

# Plantilla
P, Q = -y, x
print(sp.diff(Q, x) ___ sp.diff(P, y))

# Esperado
2

# Pista
Un guion, el signo de restar.
```

# El miembro del borde

```python
P, Q = -y, x
r = sp.Matrix([sp.cos(t), sp.sin(t)])
v = sp.diff(r, t)
F = sp.Matrix([P, Q]).subs({x: r[0], y: r[1]})
borde = sp.integrate(sp.simplify(F.dot(v)), (t, 0, 2 * sp.pi))
print(borde)
```

```salida
2*pi
```

> Doc: [sympy.integrate](https://docs.sympy.org/latest/modules/integrals/integrals.html)

```ejercicio
# Enunciado
Completa el intervalo del parámetro que recorre la circunferencia una vez completa.

# Plantilla
print(sp.integrate(1, (t, 0, 2 * sp.___)))

# Esperado
2*pi

# Pista
Dos letras: la constante que relaciona diámetro y perímetro.
```

# La comprobación

```python
interior = 2 * sp.pi
borde = 2 * sp.pi
print(sp.simplify(interior - borde) == 0)
```

```salida
True
```

> Doc: [sympy.simplify](https://docs.sympy.org/latest/modules/simplify/simplify.html)

> Nota: Ambos miembros coinciden, que es lo que el teorema afirma. El sentido de
> recorrido resulta esencial: el enunciado exige que la curva se recorra dejando
> la región a la izquierda, es decir, en sentido antihorario. Invertirlo cambia
> el signo del miembro del borde y la igualdad deja de cumplirse.

```ejercicio
# Enunciado
Completa el sentido de recorrido que exige el enunciado del teorema.

# Plantilla
print("la curva se recorre en sentido " + "___")

# Esperado
la curva se recorre en sentido antihorario

# Pista
Once letras: contrario al de las agujas del reloj.
```

# El área como caso particular

Eligiendo un campo cuyo rotacional valga uno, la integral sobre el borde produce
directamente el área de la región encerrada.

```python
P, Q = -y / 2, x / 2
print(sp.diff(Q, x) - sp.diff(P, y))

r = sp.Matrix([3 * sp.cos(t), 2 * sp.sin(t)])
v = sp.diff(r, t)
F = sp.Matrix([P, Q]).subs({x: r[0], y: r[1]})
area = sp.integrate(sp.simplify(F.dot(v)), (t, 0, 2 * sp.pi))
print(area)
```

```salida
1
6*pi
```

> Doc: [sympy.integrate](https://docs.sympy.org/latest/modules/integrals/integrals.html)

> Nota: El resultado es seis pi, que coincide con la fórmula del área de una
> elipse de semiejes tres y dos. El procedimiento se emplea en instrumentos que
> miden áreas recorriendo únicamente el contorno de una figura.

```ejercicio
# Enunciado
Completa el producto de los semiejes que determina el área de la elipse.

# Plantilla
print(3 * ___ == 6)

# Esperado
True

# Pista
Dos.
```

# Verificación numérica

El teorema admite comprobación numérica sobre una región cualquiera, lo que
resulta útil cuando las integrales simbólicas no se resuelven.

```python
valores = np.linspace(0, 2 * np.pi, 40000)
puntos = np.column_stack([3 * np.cos(valores), 2 * np.sin(valores)])
campo = np.column_stack([-puntos[:, 1] / 2, puntos[:, 0] / 2])
segmentos = np.diff(puntos, axis=0)
area = np.sum(np.sum(campo[:-1] * segmentos, axis=1))
print(round(float(area), 4))
print(round(float(np.pi * 3 * 2), 4))
```

```salida
18.8496
18.8496
```

> Doc: [numpy.column_stack](https://numpy.org/doc/stable/reference/generated/numpy.column_stack.html)

```ejercicio
# Enunciado
Completa el semieje mayor de la elipse cuya área es seis pi con semieje menor dos.

# Plantilla
print(___ * 2 == 6)

# Esperado
True

# Pista
Tres.
```

# Qué sigue

El teorema de Green es el caso bidimensional de dos resultados más generales: el
teorema de Stokes, que relaciona la integral sobre una curva cerrada del espacio
con el flujo del rotacional a través de una superficie que la tenga por borde, y
el teorema de la divergencia, que relaciona el flujo a través de una superficie
cerrada con la integral de la divergencia en el volumen encerrado.

```python
print("Green:      curva cerrada del plano  <->  región encerrada")
print("Stokes:     curva cerrada del espacio <->  superficie con ese borde")
print("Divergencia: superficie cerrada       <->  volumen encerrado")
```

```salida
Green:      curva cerrada del plano  <->  región encerrada
Stokes:     curva cerrada del espacio <->  superficie con ese borde
Divergencia: superficie cerrada       <->  volumen encerrado
```

> Doc: [Módulo vectorial de SymPy](https://docs.sympy.org/latest/modules/vector/index.html)

```ejercicio
# Enunciado
Completa el nombre del teorema que relaciona una superficie cerrada con el volumen que encierra.

# Plantilla
print("teorema de la " + "___")

# Esperado
teorema de la divergencia

# Pista
Once letras: la operación de la sesión 7 que mide fuentes y sumideros.
```

# Cierre

El curso queda completo: vectores y sus dos productos, curvas parametrizadas con
su velocidad y curvatura, campos escalares con su gradiente, campos vectoriales
con su divergencia y su rotacional, integrales de línea y la relación entre el
borde y el interior que establece el teorema de Green.

Todo se ha calculado por dos vías, la simbólica y la numérica, y cada resultado
se ha comprobado contra la otra.
