---
numero: 49
titulo: "Defaults de YouTube, live chat y disponibilidad"
---

# Live chat como subtítulo

yt-dlp considera el live chat disponible como subtítulo.

Puede excluirse con `--sub-langs all,-live_chat` o deshabilitarse mediante la compat option `no-live-chat`.

> Doc: [Differences in default behavior](https://github.com/yt-dlp/yt-dlp#differences-in-default-behavior)

```ejercicio
# Enunciado
Completa la exclusión de live chat.

# Plantilla
print("--sub-langs all,___live_chat")

# Esperado
--sub-langs all,-live_chat

# Pista
Usa el prefijo de exclusión.
```

# URLs de canal

Las URLs de canal descargan todas las subidas. Para una pestaña concreta debe utilizarse la URL de esa pestaña.

Una URL `/live` sin vídeos en directo produce error en vez de redirigir silenciosamente al canal completo.

`no-youtube-channel-redirect` restaura redirecciones anteriores.

# Vídeos no disponibles

Las playlists de YouTube pueden listar vídeos no disponibles. `no-youtube-unavailable-videos` los elimina.

# Fechas de subida

Las fechas extraídas de YouTube se expresan en UTC.

```ejercicio
# Enunciado
Completa la compat option que elimina vídeos no disponibles de playlists.

# Plantilla
print("--compat-options " + "___")

# Esperado
--compat-options no-youtube-unavailable-videos

# Pista
El nombre contiene youtube y unavailable.
```

# Cierre

La sesión siguiente compara FFmpeg, thumbnails, info JSON, subtítulos y certificados.
