---
numero: 29
titulo: "YoutubeDL y download()"
---

# Importar YoutubeDL

```python !sin-consola
from yt_dlp import YoutubeDL
```

> Doc: [Embedding yt-dlp](https://github.com/yt-dlp/yt-dlp#embedding-yt-dlp)

# Context manager

El ejemplo oficial usa `with YoutubeDL() as ydl` para administrar el ciclo de vida del objeto.

```ejercicio
# Enunciado
Completa el nombre de la clase.

# Plantilla
clase = "___"
print(clase)

# Esperado
YoutubeDL

# Pista
Une Youtube y DL.
```

# download()

`ydl.download(URLS)` recibe una colección de URLs e inicia el flujo de descarga.

```python !sin-consola
from yt_dlp import YoutubeDL

URLS = ["https://example.invalid/video"]
with YoutubeDL() as ydl:
    ydl.download(URLS)
```

# ydl_opts

`YoutubeDL(ydl_opts)` recibe un diccionario de opciones API.

```python
ydl_opts = {"format": "best"}
print(ydl_opts["format"])
```

```salida
best
```

```ejercicio
# Enunciado
Completa la clave equivalente a -f.

# Plantilla
ydl_opts = {"___": "best"}
print(ydl_opts["format"])

# Esperado
best

# Pista
La clave se llama format.
```

# help(YoutubeDL)

El README remite a `help(yt_dlp.YoutubeDL)` y a `YoutubeDL.py` para la lista de opciones y funciones públicas.

# cli_to_api.py

El script de desarrollo traduce switches CLI a parámetros de YoutubeDL.

# Cierre

La sesión siguiente extrae información sin descargar.
