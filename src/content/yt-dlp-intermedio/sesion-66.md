---
numero: 66
titulo: "Campos temporales, canal, ubicación y duración"
---

# timestamp y upload_date

`timestamp` es un timestamp UNIX del momento en que el vídeo estuvo disponible; `upload_date` es la fecha UTC en formato YYYYMMDD.

# release_timestamp, release_date y release_year

Representan momento, fecha y año de release.

# modified_timestamp y modified_date

Representan última modificación conocida.

# channel, channel_id y channel_url

Identifican el canal y su URL.

# channel_follower_count

Cantidad de seguidores del canal.

# channel_is_verified

Indica si el canal está verificado.

```ejercicio
# Enunciado
Completa el campo booleano de verificación del canal.

# Plantilla
print("%(___)s")

# Esperado
%(channel_is_verified)s

# Pista
Empieza con channel_.
```

# location

Ubicación física donde se grabó el vídeo cuando está disponible.

# duration

Duración numérica en segundos.

# duration_string

Duración en formato HH:mm:ss.

> Doc: [Output Template — available fields](https://github.com/yt-dlp/yt-dlp#output-template)

```ejercicio
# Enunciado
Completa el campo de duración numérica.

# Plantilla
print("%(___)s")

# Esperado
%(duration)s

# Pista
No uses duration_string.
```

# Cierre

La sesión siguiente cubre métricas, estado de directo y disponibilidad.
