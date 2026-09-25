---
numero: 31
titulo: "Controlar vídeo, playlist y edad desde Python"
---

# Construir la decisión entre vídeo, playlist y límite de edad desde Python

Python puede preparar estas políticas antes de ejecutar yt-dlp y conservarlas como datos. Esto permite combinar límites, condiciones y valores sin formar una cadena que deba reinterpretarse.

```python
argumentos = ["--no-playlist", "--age-limit", "18", "https://media.example/video"]
print(" ".join(comando_yt_dlp(*argumentos)[3:]))
```

```salida
--no-playlist --age-limit 18 https://media.example/video
```

> Doc: [yt-dlp — opción documentada](https://github.com/yt-dlp/yt-dlp#video-selection)

```ejercicio
# Enunciado
Completa la primera opción de la política.

# Plantilla
argumentos = ["___", "--age-limit", "18", "https://media.example/video"]
print(" ".join(comando_yt_dlp(*argumentos)[3:]))

# Esperado
--no-playlist --age-limit 18 https://media.example/video

# Pista
La opción corresponde al control principal de la sesión.
```


# --no-playlist

Una URL puede representar un vídeo que además pertenece a una playlist.
`--no-playlist` indica que, en ese caso, yt-dlp procese únicamente el vídeo.

La opción resuelve una ambigüedad de entrada; no elimina playlists de URLs que
representan únicamente una playlist.

> Doc: [Video Selection — --no-playlist](https://github.com/yt-dlp/yt-dlp#video-selection)

```ejercicio
# Enunciado
Completa la opción que selecciona solo el vídeo cuando la URL también pertenece a una playlist.

# Plantilla
print("yt-dlp " + "___")

# Esperado
yt-dlp --no-playlist

# Pista
Niega explícitamente el procesamiento de la playlist.
```

# --yes-playlist

`--yes-playlist` toma la decisión contraria: cuando una URL puede interpretarse
como vídeo y playlist, solicita procesar la playlist.

```ejercicio
# Enunciado
Completa la opción que prefiere la playlist en una URL ambigua.

# Plantilla
opcion = "___"
print(opcion)

# Esperado
--yes-playlist

# Pista
Empieza con el prefijo afirmativo `--yes-`.
```

# Las dos opciones resuelven la misma ambigüedad

`--no-playlist` y `--yes-playlist` no son dos filtros independientes. Ambas
responden a la misma pregunta: qué debe hacerse cuando la entrada puede
representar tanto un vídeo como una playlist.

```opcion-multiple
# Enunciado
¿Qué decide --yes-playlist?

# Opciones
- El formato del archivo final
- Si se procesa la playlist cuando la URL también representa un vídeo
- La velocidad de descarga
- Si se escriben subtítulos

# Correcta
2

# Explicación
La opción resuelve la interpretación de una URL que puede representar vídeo y playlist.

# Pista
La palabra clave de la opción es `playlist`.
```

# --age-limit

`--age-limit YEARS` acepta únicamente vídeos adecuados para la edad indicada,
según la información y el comportamiento que proporcione el extractor.

El argumento `YEARS` es una cantidad de años.

```bash !sin-consola
yt-dlp --age-limit 18 "URL"
```

> Doc: [Video Selection — --age-limit](https://github.com/yt-dlp/yt-dlp#video-selection)

```ejercicio
# Enunciado
Completa la opción que establece una edad de 18 años.

# Plantilla
print("yt-dlp " + "___" + " 18")

# Esperado
yt-dlp --age-limit 18

# Pista
El nombre combina `age` y `limit`.
```

# Cierre con Python

Python dejó la decisión entre vídeo, playlist y límite de edad disponible como configuración programática reutilizable.


`--no-playlist` y `--yes-playlist` controlan una entrada ambigua entre vídeo
y playlist. `--age-limit` añade una condición de selección basada en la edad
indicada.

La sesión siguiente evita descargar de nuevo elementos ya registrados.