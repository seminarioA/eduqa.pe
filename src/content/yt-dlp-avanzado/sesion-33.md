---
numero: 33
titulo: "Postprocesamiento de audio desde Python"
---

# format

El ejemplo oficial selecciona `m4a/bestaudio/best`.

```python
ydl_opts = {"format": "m4a/bestaudio/best"}
print(ydl_opts["format"])
```

```salida
m4a/bestaudio/best
```

# postprocessors

La clave `postprocessors` recibe una lista de configuraciones.

> Doc: [Embedding example — Extract audio](https://github.com/yt-dlp/yt-dlp#extract-audio)

```ejercicio
# Enunciado
Completa la clave que contiene la lista de postprocesadores.

# Plantilla
ydl_opts = {"___": []}
print(list(ydl_opts))

# Esperado
['postprocessors']

# Pista
Está en plural.
```

# FFmpegExtractAudio

El campo `key` selecciona `FFmpegExtractAudio`.

```ejercicio
# Enunciado
Completa el key del postprocesador.

# Plantilla
pp = {"key": "___"}
print(pp["key"])

# Esperado
FFmpegExtractAudio

# Pista
Une FFmpeg, Extract y Audio.
```

# preferredcodec

El ejemplo usa `preferredcodec: m4a`.

```python
pp = {"key": "FFmpegExtractAudio", "preferredcodec": "m4a"}
print(pp["preferredcodec"])
```

```salida
m4a
```

# Cierre

La sesión siguiente implementa filtros Python mediante match_filter.
