---
numero: 48
titulo: "Defaults de metadata, playlists e índices"
---

# Metafiles de playlist

Cuando se escriben thumbnails, description o info JSON, yt-dlp también escribe información de playlist cuando existe.

`--no-write-playlist-metafiles` o `no-playlist-metafiles` restauran el comportamiento anterior.

> Doc: [Differences in default behavior](https://github.com/yt-dlp/yt-dlp#differences-in-default-behavior)

# info JSON adjunto en MKV

`--add-metadata` puede adjuntar info JSON a MKV cuando se combina con `--write-info-json`.

`--no-embed-info-json` o `no-attach-info-json` evitan ese comportamiento.

# Campos embebidos

yt-dlp mapea metadata de manera distinta: el ejemplo destacado es `comment=webpage_url` y `synopsis=description`.

`embed-metadata` restaura el mapeo histórico.

# playlist_index

Su comportamiento difiere cuando se combina con reverse/items. La compat option es `playlist-index`.

```ejercicio
# Enunciado
Completa la compat option del índice de playlist.

# Plantilla
print("--compat-options " + "___")

# Esperado
--compat-options playlist-index

# Pista
Usa singular con guion.
```

# Salida de -F

yt-dlp usa un formato nuevo para el listado. `list-formats` recupera el formato anterior.

# Cierre

La sesión siguiente compara comportamiento específico de YouTube y directos.
