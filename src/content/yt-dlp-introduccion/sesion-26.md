---
numero: 26
titulo: "Seleccionar elementos de playlist desde Python"
---

# Construir la selección de elementos de playlist desde Python

Las opciones de selección pueden componerse en Python antes de iniciar una descarga. Mantener el filtro, rango o límite como elemento de la lista evita que operadores como `&`, `:` o `<` dependan del quoting de un shell.

```python
argumentos = ["--playlist-items", "1:10:2", "https://media.example/playlist"]
print(" ".join(comando_yt_dlp(*argumentos)[3:]))
```

```salida
--playlist-items 1:10:2 https://media.example/playlist
```

> Doc: [yt-dlp — Video Selection](https://github.com/yt-dlp/yt-dlp#video-selection)

```ejercicio
# Enunciado
Completa la opción principal de esta selección.

# Plantilla
argumentos = ["___", "1:10:2", "https://media.example/playlist"]
print(" ".join(comando_yt_dlp(*argumentos)[3:]))

# Esperado
--playlist-items 1:10:2 https://media.example/playlist

# Pista
La opción corresponde al criterio desarrollado en esta sesión.
```


# -I y --playlist-items

`-I` es la forma corta de `--playlist-items`. El argumento
`ITEM_SPEC` selecciona índices de la playlist separados por comas.

```bash !sin-consola
yt-dlp -I "1,3,7" "PLAYLIST_URL"
```

> Doc: [Video Selection — --playlist-items](https://github.com/yt-dlp/yt-dlp#video-selection)

```ejercicio
# Enunciado
Completa la forma corta de --playlist-items.

# Plantilla
print("yt-dlp " + "___" + " 1,3,7")

# Esperado
yt-dlp -I 1,3,7

# Pista
Es una I mayúscula.
```

# Los índices individuales se separan con coma

Cada número separado por coma representa una posición seleccionada.

```python
especificacion = "1,3,7"
print(especificacion.split(","))
```

```salida
['1', '3', '7']
```

```ejercicio
# Enunciado
Completa el separador de tres posiciones individuales.

# Plantilla
print("1___3,7")

# Esperado
1,3,7

# Pista
Los índices individuales se separan con coma.
```

# Rangos START:STOP

La forma `START:STOP` expresa un rango. El README también conserva
`START-STOP` por compatibilidad hacia atrás, pero la sintaxis con dos puntos
es la forma general que además admite un paso.

```python
inicio = 1
fin = 3
print(f"{inicio}:{fin}")
```

```salida
1:3
```

```ejercicio
# Enunciado
Completa el separador de un rango START:STOP.

# Plantilla
print("1___3")

# Esperado
1:3

# Pista
La sintaxis usa dos puntos.
```

# Rangos START:STOP:STEP

El tercer componente `STEP` controla el salto entre posiciones.
`1:9:2`, por ejemplo, expresa un recorrido con paso dos dentro del rango.

Los corchetes de `[START]:[STOP][:STEP]` describen componentes opcionales en
la documentación; no se escriben literalmente.

```ejercicio
# Enunciado
Completa el paso de dos en una especificación START:STOP:STEP.

# Plantilla
print("1:9:___")

# Esperado
1:9:2

# Pista
El tercer componente es STEP.
```

# Índices negativos y pasos negativos

Los índices negativos cuentan desde la derecha. Un `STEP` negativo permite
recorrer posiciones en orden inverso.

El ejemplo oficial `1:3,7,-5::2` combina un rango, un índice individual y un
índice negativo con paso.

> Doc: [Video Selection — --playlist-items](https://github.com/yt-dlp/yt-dlp#video-selection)

# Cierre con Python

Python dejó la selección de elementos de playlist encapsulada en una lista de argumentos reutilizable y sin interpolación de shell.


`--playlist-items` acepta posiciones individuales, rangos, pasos e índices
negativos. La coma combina selecciones y los dos puntos estructuran un rango.

La sesión siguiente limita la selección por tamaño de archivo.
