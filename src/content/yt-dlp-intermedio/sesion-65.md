---
numero: 65
titulo: "Campos de identidad, título y autoría"
---

# id

`id` es el identificador del vídeo.

# title

`title` es el título.

# fulltitle

`fulltitle` conserva el título sin timestamp de directo ni título genérico.

# ext

`ext` es la extensión del archivo.

# alt_title

`alt_title` representa un título secundario.

# description

`description` contiene la descripción.

# display_id

`display_id` es un identificador alternativo de presentación.

# uploader

`uploader` contiene el nombre completo de quien subió el vídeo.

# uploader_id

`uploader_id` contiene nickname o identificador.

# uploader_url

`uploader_url` apunta al perfil del uploader.

# license

`license` contiene el nombre de la licencia del vídeo.

# creators y creator

`creators` es una lista; `creator` es la misma información unida por comas.

> Doc: [Output Template — available fields](https://github.com/yt-dlp/yt-dlp#output-template)

```python
campos = ["id","title","fulltitle","ext","alt_title","description","display_id","uploader","uploader_id","uploader_url","license","creators","creator"]
print(len(campos))
```

```salida
13
```

```ejercicio
# Enunciado
Completa el campo que contiene una lista de creadores.

# Plantilla
print("%(___)s")

# Esperado
%(creators)s

# Pista
Está en plural.
```

# Cierre

La sesión siguiente cubre tiempo, canal, ubicación y duración.
