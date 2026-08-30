---
numero: 17
titulo: "Complejidad, paralelismo y dependencias"
---

# Tres criterios de comparación

El artículo compara cada capa por complejidad por capa, operaciones secuenciales mínimas y longitud máxima del camino entre posiciones.[1] No existe una única medida de eficiencia: una capa puede paralelizarse bien y aun así consumir mucha memoria.

| Capa | Complejidad por capa | Operaciones secuenciales | Camino máximo |
|---|---:|---:|---:|
| Autoatención | `O(n² · d)` | `O(1)` | `O(1)` |
| Recurrente | `O(n · d²)` | `O(n)` | `O(n)` |
| Convolucional | `O(k · n · d²)` | `O(1)` | `O(log_k(n))` |

> Doc: [Attention Is All You Need, tabla 1](https://arxiv.org/abs/1706.03762)

# Contar relaciones

La matriz `QK.T` tiene una entrada por par de posiciones. Su tamaño crece como el cuadrado de la longitud.

```python
def relaciones_atencion(longitud):
    return longitud * longitud

for longitud in [2, 4, 8]:
    print(longitud, relaciones_atencion(longitud))
```

```salida
2 4
4 16
8 64
```

# Medir la ventaja del paralelismo

La recurrencia necesita terminar el paso anterior antes de calcular el siguiente. La autoatención calcula una matriz completa con operaciones matriciales, aunque el coste de memoria crece con `n²`.

```python
longitudes = np.array([16, 32, 64])
secuencial = longitudes
atencion = longitudes ** 2
print(secuencial)
print(atencion)
```

```salida
[16 32 64]
[ 256 1024 4096]
```

> Nota: `O(1)` operaciones secuenciales no significa coste constante total. Significa que la profundidad de dependencia no crece con `n` para esa capa.

```ejercicio
# Enunciado
Completa la operación que calcula el número de pares de posiciones.

# Plantilla

longitud = 10
print(longitud ___ 2)

# Esperado
100

# Pista
El número de relaciones de una atención completa es la longitud al cuadrado.
```

# Cierre

La autoatención reduce la longitud del camino entre posiciones y facilita el paralelismo, a cambio de una matriz cuadrática. La sesión siguiente conecta estas piezas en una implementación mínima de atención.

[1] La tabla del artículo usa `n` como longitud de secuencia y `d` como dimensión de representación.
