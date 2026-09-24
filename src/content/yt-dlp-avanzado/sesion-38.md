---
numero: 38
titulo: "Selector de formato personalizado en Python"
---

# format puede recibir un callable

En la API de Python, la clave `format` no tiene que contener únicamente una expresión textual. El ejemplo oficial le asigna una función que recibe el contexto de formatos y produce la selección.

> Doc: [Embedding example — custom format selector](https://github.com/yt-dlp/yt-dlp#use-a-custom-format-selector)

# Los formatos llegan ordenados de peor a mejor

El ejemplo invierte `ctx.get('formats')` con slicing `[::-1]` para recorrer primero los mejores formatos.

```python
formatos = ["peor", "medio", "mejor"]
print(formatos[::-1])
```

```salida
['mejor', 'medio', 'peor']
```

```ejercicio
# Enunciado
Completa el slice que invierte una lista.

# Plantilla
formatos = ["peor", "medio", "mejor"]
print(formatos[___])

# Esperado
['mejor', 'medio', 'peor']

# Pista
Usa un slice con paso negativo uno.
```

# Elegir vídeo sin audio

El ejemplo busca el primer formato cuyo `vcodec` no sea `none` y cuyo `acodec` sea `none`.

```python
formatos = [
    {"vcodec": "h264", "acodec": "aac"},
    {"vcodec": "h264", "acodec": "none"},
]
video = next(f for f in formatos if f["vcodec"] != "none" and f["acodec"] == "none")
print(video["acodec"])
```

```salida
none
```

```ejercicio
# Enunciado
Completa el valor que identifica ausencia de audio.

# Plantilla
acodec = "___"
print(acodec)

# Esperado
none

# Pista
yt-dlp usa una palabra de cuatro letras.
```

# Elegir una extensión de audio compatible

El ejemplo asocia vídeo MP4 con audio M4A y vídeo WebM con audio WebM.

```python
audio_ext = {"mp4": "m4a", "webm": "webm"}
print(audio_ext["mp4"])
```

```salida
m4a
```

```ejercicio
# Enunciado
Completa la extensión de audio asociada a MP4.

# Plantilla
audio_ext = {"mp4": "___", "webm": "webm"}
print(audio_ext["mp4"])

# Esperado
m4a

# Pista
Es el contenedor de audio usado habitualmente junto con MP4.
```

# Elegir audio sin vídeo

Después se busca un formato cuyo `acodec` exista, cuyo `vcodec` sea `none` y cuya extensión coincida con la requerida.

# El selector produce un formato fusionado

El callable usa `yield` para devolver un diccionario que describe el resultado fusionado.

Los campos mínimos mostrados por el ejemplo son `format_id`, `ext`, `requested_formats` y `protocol`.

```ejercicio
# Enunciado
Completa el campo que contiene los dos formatos originales que deben fusionarse.

# Plantilla
campo = "___"
print(campo)

# Esperado
requested_formats

# Pista
Es el plural de los formatos solicitados.
```

# format_id

El identificador resultante concatena los dos format IDs con signo más.

# protocol

Los protocolos también se concatenan con signo más.

```python
video_protocol = "https"
audio_protocol = "https"
print(f"{video_protocol}+{audio_protocol}")
```

```salida
https+https
```

# Asignar el callable

La función se entrega directamente en `ydl_opts["format"]`.

```python !sin-consola
ydl_opts = {
    "format": format_selector,
}
```

# Cierre

La API Python ya cubre descarga, extracción de información, serialización, filtros, logging, hooks, postprocesadores y selección de formatos. La sesión siguiente construye el ejecutable standalone con PyInstaller.
