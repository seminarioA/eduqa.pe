---
numero: 39
titulo: "Configurar HLS y secciones desde Python"
---

# Construir la descarga de una sección temporal desde Python

Las opciones de descarga pueden componerse como una lista y entregarse después a `ejecutar_yt_dlp()`. Los valores que contienen espacios o separadores permanecen en un solo elemento, por lo que Python no necesita escapar una cadena para un shell.

```python
argumentos = ["--download-sections", "*00:01:00-00:02:00", "https://media.example/video"]
print(" ".join(comando_yt_dlp(*argumentos)[3:]))
```

```salida
--download-sections *00:01:00-00:02:00 https://media.example/video
```

> Doc: [yt-dlp — Download Options](https://github.com/yt-dlp/yt-dlp#download-options)

```ejercicio
# Enunciado
Completa la opción principal de esta configuración de descarga.

# Plantilla
argumentos = ["___", "*00:01:00-00:02:00", "https://media.example/video"]
print(" ".join(comando_yt_dlp(*argumentos)[3:]))

# Esperado
--download-sections *00:01:00-00:02:00 https://media.example/video

# Pista
La opción aparece entre las Download Options de yt-dlp.
```


# --hls-use-mpegts

`--hls-use-mpegts` utiliza el contenedor MPEG-TS para vídeos HLS. El README
indica dos consecuencias: algunos reproductores pueden reproducir el archivo
mientras se descarga y disminuye la posibilidad de corrupción si la descarga se
interrumpe.

La opción está habilitada por defecto para streams en directo.

> Doc: [Download Options — --hls-use-mpegts](https://github.com/yt-dlp/yt-dlp#download-options)

```ejercicio
# Enunciado
Completa la opción que usa el contenedor MPEG-TS para HLS.

# Plantilla
print("yt-dlp " + "___")

# Esperado
yt-dlp --hls-use-mpegts

# Pista
El nombre contiene `hls` y `mpegts`.
```

# --no-hls-use-mpegts

`--no-hls-use-mpegts` evita el contenedor MPEG-TS. Es el comportamiento
predeterminado cuando no se descarga un livestream.

```ejercicio
# Enunciado
Completa la opción que desactiva MPEG-TS para HLS.

# Plantilla
opcion = "___"
print(opcion)

# Esperado
--no-hls-use-mpegts

# Pista
Niega la opción anterior con `--no-`.
```

# --download-sections

`--download-sections REGEX` descarga únicamente capítulos cuyo nombre coincide
con la expresión regular indicada.

La opción puede repetirse para descargar varias secciones.

> Doc: [Download Options — --download-sections](https://github.com/yt-dlp/yt-dlp#download-options)

```ejercicio
# Enunciado
Completa la opción que selecciona capítulos cuyo nombre coincide con `intro`.

# Plantilla
print("yt-dlp " + "___" + " intro")

# Esperado
yt-dlp --download-sections intro

# Pista
El nombre contiene `download` y `sections`.
```

# El prefijo * cambia a un rango temporal

Cuando el argumento comienza con asterisco (`*`), el valor describe un rango
temporal en lugar de una expresión regular de capítulo.

El ejemplo oficial `*10:15-inf` expresa una selección temporal. Los
timestamps negativos se calculan desde el final.

```python
rango = "*10:15-inf"
print(rango.startswith("*"))
```

```salida
True
```

```ejercicio
# Enunciado
Completa el prefijo que convierte el argumento en un rango temporal.

# Plantilla
print("___10:15-inf")

# Esperado
*10:15-inf

# Pista
Es un asterisco.
```

# *from-url

El valor `*from-url` utiliza los campos `start_time` y `end_time`
extraídos de la propia URL para determinar el rango.

```ejercicio
# Enunciado
Completa el valor especial que toma el rango temporal de la URL.

# Plantilla
print("*___")

# Esperado
*from-url

# Pista
La parte que falta indica «desde la URL».
```

# FFmpeg es necesario

El README indica que `--download-sections` necesita FFmpeg. La selección
temporal no debe presentarse como una operación independiente del entorno
instalado.

# Cierre con Python

Python dejó la descarga de una sección temporal expresada como una configuración de descarga explícita y reutilizable.


HLS puede usar MPEG-TS durante la descarga y su valor predeterminado cambia para
directos. `--download-sections` selecciona capítulos o rangos temporales y
requiere FFmpeg.

La sesión siguiente delega la transferencia a descargadores externos.
