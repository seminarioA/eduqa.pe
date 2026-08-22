---
numero: 7
titulo: "Divergencia y rotacional"
paquetes: ["sympy"]
preludio: |
  import sympy as sp
  from sympy.vector import CoordSys3D, gradient, divergence, curl
  R = CoordSys3D("R")
---

# Un vector en cada punto

Un campo vectorial asigna un vector a cada punto de una región: la velocidad de
un fluido, la fuerza de un campo eléctrico o el viento sobre una superficie.

SymPy dispone de un módulo específico que introduce un sistema de coordenadas
con sus versores.

```python
F = R.x * R.y * R.i + R.y * R.z * R.j + R.z * R.x * R.k
print(F)
```

```salida
R.x*R.y*R.i + R.y*R.z*R.j + R.x*R.z*R.k
```

> Doc: [Módulo vectorial de SymPy](https://docs.sympy.org/latest/modules/vector/index.html)

> Nota: `R.x`, `R.y` y `R.z` son las coordenadas del sistema, mientras que
> `R.i`, `R.j` y `R.k` son sus versores. La distinción resulta esencial: las
> primeras son funciones escalares de la posición y los segundos son vectores
> constantes.

```ejercicio
# Enunciado
Completa la clase que define un sistema de coordenadas tridimensional.

# Plantilla
from sympy.vector import CoordSys3D
S = ___("S")
print(S.i)

# Esperado
S.i

# Pista
Nueve caracteres: «sistema de coordenadas 3D» abreviado en inglés.
```

# El gradiente como operación del módulo

El gradiente de un campo escalar produce un campo vectorial.

```python
f = R.x**2 * R.y + R.z
print(gradient(f))
```

```salida
2*R.x*R.y*R.i + R.x**2*R.j + R.k
```

> Doc: [Campos en SymPy](https://docs.sympy.org/latest/modules/vector/fields.html)

```ejercicio
# Enunciado
Completa la función del módulo vectorial que calcula el gradiente.

# Plantilla
from sympy.vector import CoordSys3D, gradient
S = CoordSys3D("S")
print(___(S.x**2))

# Esperado
2*S.x*S.i

# Pista
Nueve letras: «gradiente» en inglés.
```

# La divergencia

La divergencia de un campo vectorial es un campo escalar que mide, en cada
punto, cuánto se aleja el campo de ese punto. Se obtiene sumando las derivadas
parciales de cada componente respecto de su propia variable.

```python
F = R.x * R.y * R.i + R.y * R.z * R.j + R.z * R.x * R.k
print(divergence(F))
```

```salida
R.x + R.y + R.z
```

> Doc: [Campos en SymPy](https://docs.sympy.org/latest/modules/vector/fields.html)

> Nota: En la interpretación hidrodinámica, una divergencia positiva en un punto
> indica que allí existe una fuente y una negativa que existe un sumidero. Un
> campo de divergencia nula en toda la región se denomina solenoidal, y describe
> un fluido incompresible.

```ejercicio
# Enunciado
Completa la función que calcula la divergencia de un campo vectorial.

# Plantilla
from sympy.vector import CoordSys3D, divergence
S = CoordSys3D("S")
print(___(S.x * S.i))

# Esperado
1

# Pista
Diez letras: «divergencia» en inglés.
```

# El rotacional

El rotacional es un campo vectorial que mide la tendencia del campo a girar
alrededor de cada punto.

```python
F = R.x * R.y * R.i + R.y * R.z * R.j + R.z * R.x * R.k
print(curl(F))
```

```salida
(-R.y)*R.i + (-R.z)*R.j + (-R.x)*R.k
```

> Doc: [Campos en SymPy](https://docs.sympy.org/latest/modules/vector/fields.html)

```ejercicio
# Enunciado
Completa la función que calcula el rotacional.

# Plantilla
from sympy.vector import CoordSys3D, curl
S = CoordSys3D("S")
print(___(S.y * S.i))

# Esperado
(-1)*S.k

# Pista
Cuatro letras: «rizo» o «rotacional» en inglés.
```

# Dos identidades que conviene conocer

El rotacional de un gradiente es siempre nulo, y la divergencia de un rotacional
también. Ambas se comprueban de forma inmediata.

```python
f = R.x**2 * R.y + R.z
F = R.x * R.y * R.i + R.y * R.z * R.j + R.z * R.x * R.k
print(curl(gradient(f)))
print(sp.simplify(divergence(curl(F))))
```

```salida
0
0
```

> Doc: [Campos en SymPy](https://docs.sympy.org/latest/modules/vector/fields.html)

> Nota: La primera identidad implica que un campo que procede de un gradiente
> tiene rotacional nulo, condición que se emplea en la sesión siguiente para
> reconocer los campos conservativos. La segunda implica que un campo obtenido
> como rotacional no tiene ni fuentes ni sumideros.
>
> Ambas salidas se imprimen como `0`, pero no son el mismo objeto. La primera es
> `Vector.zero`, el vector nulo del módulo; la segunda es el entero cero, porque
> la divergencia devuelve un escalar. Comparar la primera con `0` mediante el
> operador de igualdad produce `False` pese a la apariencia, y esa discrepancia
> entre lo que se imprime y lo que se compara constituye una fuente habitual de
> comprobaciones que fallan sin motivo aparente.

```ejercicio
# Enunciado
Completa el objeto con el que se compara el rotacional de un gradiente, que no es el entero cero.

# Plantilla
from sympy.vector import CoordSys3D, gradient, curl, Vector
S = CoordSys3D("S")
print(curl(gradient(S.x**3)) == ___)

# Esperado
True

# Pista
La clase Vector, un punto, y la palabra «cero» en inglés.
```

# Un campo con rotacional no nulo

```python
G = -R.y * R.i + R.x * R.j
print(divergence(G))
print(curl(G))
```

```salida
0
2*R.k
```

> Doc: [Campos en SymPy](https://docs.sympy.org/latest/modules/vector/fields.html)

> Nota: Este campo describe una rotación alrededor del tercer eje. Su divergencia
> es nula —no hay fuentes ni sumideros— y su rotacional es constante e igual al
> doble del versor de ese eje, lo que corresponde al doble de la velocidad
> angular.

```ejercicio
# Enunciado
Completa la componente del campo que produce un rotacional constante en el eje z.

# Plantilla
from sympy.vector import CoordSys3D, curl
S = CoordSys3D("S")
print(curl(-S.y * S.i + ___ * S.j))

# Esperado
2*S.k

# Pista
La primera coordenada del sistema.
```

# Cierre

Un campo vectorial asigna un vector a cada punto. La divergencia mide sus
fuentes y sumideros; el rotacional, su tendencia a girar. El rotacional de un
gradiente es nulo y la divergencia de un rotacional también.

La sesión siguiente integra un campo vectorial a lo largo de una curva.
