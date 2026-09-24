---
numero: 26
titulo: "Esperas entre peticiones y descargas"
---

# --sleep-requests

`--sleep-requests SECONDS` espera el número indicado de segundos entre peticiones durante la extracción de datos.

> Doc: [Workarounds — --sleep-requests](https://github.com/yt-dlp/yt-dlp#workarounds)

```ejercicio
# Enunciado
Completa la opción que espera dos segundos entre peticiones.

# Plantilla
print("yt-dlp " + "___" + " 2")

# Esperado
yt-dlp --sleep-requests 2

# Pista
Termina en `requests`.
```

# --sleep-interval

`--sleep-interval SECONDS` espera antes de cada descarga. Cuando se usa junto con `--max-sleep-interval`, representa el mínimo.

Su alias es `--min-sleep-interval`.

```ejercicio
# Enunciado
Completa la opción que fija cinco segundos mínimos antes de cada descarga.

# Plantilla
print("yt-dlp " + "___" + " 5")

# Esperado
yt-dlp --sleep-interval 5

# Pista
Combina `sleep` e `interval`.
```

# --max-sleep-interval

`--max-sleep-interval SECONDS` define el máximo y solo puede utilizarse junto con el mínimo.

```ejercicio
# Enunciado
Completa la opción que fija un máximo de diez segundos.

# Plantilla
print("yt-dlp " + "___" + " 10")

# Esperado
yt-dlp --max-sleep-interval 10

# Pista
Empieza con `--max-`.
```

# --sleep-subtitles

`--sleep-subtitles SECONDS` espera antes de cada descarga de subtítulos.

```ejercicio
# Enunciado
Completa la opción que espera tres segundos antes de subtítulos.

# Plantilla
print("yt-dlp " + "___" + " 3")

# Esperado
yt-dlp --sleep-subtitles 3

# Pista
Termina en `subtitles`.
```

# Cierre

yt-dlp separa espera entre peticiones, antes de descargas y antes de subtítulos. La sesión siguiente entra en selección de formatos.
