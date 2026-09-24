---
numero: 69
titulo: "Autonumeración y campos de playlist"
---

# autonumber

Contador global incrementado con cada descarga y rellenado a cinco dígitos desde `--autonumber-start`.

# video_autonumber

Contador incrementado con cada vídeo.

# n_entries

Número total de elementos extraídos.

# playlist_id y playlist_title

Identificador y título de playlist.

# playlist

Usa `playlist_title` si existe; en caso contrario, `playlist_id`.

# playlist_count

Número total de elementos; puede no conocerse si la playlist no fue extraída por completo.

# playlist_index

Índice del vídeo dentro de la playlist con padding según el índice final.

> Doc: [Output Template — playlist fields](https://github.com/yt-dlp/yt-dlp#output-template)

```ejercicio
# Enunciado
Completa el campo que representa el índice dentro de la playlist.

# Plantilla
print("%(___)s")

# Esperado
%(playlist_index)s

# Pista
Termina en index.
```

# playlist_autonumber

Posición en la cola de descarga con padding según longitud total.

# playlist_uploader y playlist_uploader_id

Nombre e identificador del uploader de playlist.

# playlist_channel y playlist_channel_id

Nombre e identificador de canal de playlist.

# playlist_webpage_url

URL de la página de playlist.

> Doc: [Output Template — playlist fields](https://github.com/yt-dlp/yt-dlp#output-template)

```ejercicio
# Enunciado
Completa el campo de URL de la playlist.

# Plantilla
print("%(___)s")

# Esperado
%(playlist_webpage_url)s

# Pista
Combina playlist, webpage y url.
```

# Cierre

Los contadores describen posición y cantidad; los campos playlist_* identifican la colección, su autoría y su página de origen.

La sesión siguiente cubre capítulos, series, temporadas y episodios.
