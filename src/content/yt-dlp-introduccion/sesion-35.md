---
numero: 35
titulo: "Reintentos y espera entre reintentos"
---

# -R y --retries

`-R` es la forma corta de `--retries`. Define cuántos reintentos realiza la
descarga general. El valor predeterminado documentado es `10` y también se
acepta `infinite`.

> Doc: [Download Options — --retries](https://github.com/yt-dlp/yt-dlp#download-options)

```ejercicio
# Enunciado
Completa la forma corta que configura diez reintentos.

# Plantilla
print("yt-dlp " + "___" + " 10")

# Esperado
yt-dlp -R 10

# Pista
La opción corta usa una R mayúscula.
```

# --file-access-retries

`--file-access-retries RETRIES` controla reintentos ante errores de acceso a
archivos. Su valor predeterminado actual es `3` y acepta también
`infinite`.

Es una política distinta de los reintentos de red generales.

```ejercicio
# Enunciado
Completa la opción específica para errores de acceso a archivos.

# Plantilla
opcion = "--file-access-___"
print(opcion)

# Esperado
--file-access-retries

# Pista
La última palabra es el plural de retry.
```

# --fragment-retries

`--fragment-retries RETRIES` controla reintentos de fragmentos para DASH, HLS
nativo e ISM. El valor predeterminado documentado es `10`.

```ejercicio
# Enunciado
Completa la opción específica de reintentos de fragmentos.

# Plantilla
print("___")

# Esperado
--fragment-retries

# Pista
Empieza con `--fragment-`.
```

# --retry-sleep

`--retry-sleep [TYPE:]EXPR` define el tiempo de espera entre reintentos.
`TYPE` puede ser `http`, `fragment`, `file_access` o `extractor`.
`http` es el tipo predeterminado cuando se omite.

Los dos puntos separan el tipo de la expresión.

> Doc: [Download Options — --retry-sleep](https://github.com/yt-dlp/yt-dlp#download-options)

```ejercicio
# Enunciado
Completa el tipo que aplica una espera específicamente a reintentos de fragmentos.

# Plantilla
print("___:exp=1:20")

# Esperado
fragment:exp=1:20

# Pista
El tipo coincide con el recurso que se reintenta.
```

# Espera fija

Cuando `EXPR` es un número, la espera tiene ese número de segundos.

```python
segundos = 5
print(f"--retry-sleep {segundos}")
```

```salida
--retry-sleep 5
```

# Crecimiento lineal

La forma `linear=START[:END[:STEP=1]]` produce una progresión lineal. El paso
predeterminado es uno cuando no se especifica.

```python
inicio = 1
paso = 2
print(f"linear={inicio}::{paso}")
```

```salida
linear=1::2
```

```ejercicio
# Enunciado
Completa el nombre de la estrategia lineal.

# Plantilla
print("___=1::2")

# Esperado
linear=1::2

# Pista
La estrategia se llama «lineal» en inglés.
```

# Crecimiento exponencial

La forma `exp=START[:END[:BASE=2]]` utiliza crecimiento exponencial y una base
predeterminada de dos.

El ejemplo oficial combina
`--retry-sleep linear=1::2` con
`--retry-sleep fragment:exp=1:20` para asignar políticas diferentes.

```ejercicio
# Enunciado
Completa la abreviatura de la estrategia exponencial.

# Plantilla
print("___=1:20")

# Esperado
exp=1:20

# Pista
Son las tres primeras letras de exponential.
```

# Cierre

yt-dlp separa reintentos generales, de filesystem y de fragmentos.
`--retry-sleep` añade una política temporal fija, lineal o exponencial y puede
diferenciar el tipo de reintento.

La sesión siguiente decide qué hacer cuando falta un fragmento.