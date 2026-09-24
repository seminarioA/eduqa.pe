---
numero: 34
titulo: "match_filter como función Python"
---

# Firma del filtro

El ejemplo oficial define una función con `info` y un keyword-only `incomplete`.

> Doc: [Embedding example — Filter videos](https://github.com/yt-dlp/yt-dlp#filter-videos)

```python
def longer_than_a_minute(info, *, incomplete):
    duration = info.get("duration")
    if duration and duration < 60:
        return "The video is too short"
```

# info.get("duration")

La duración desconocida produce un valor falsy y el ejemplo no rechaza ese vídeo.

# Retornar una cadena rechaza

La cadena describe la razón de rechazo.

# No retornar mantiene el vídeo

Si la función termina sin retornar una razón, el vídeo no es rechazado por ese filtro.

```ejercicio
# Enunciado
Completa el umbral de un minuto.

# Plantilla
duration = 59
print(duration < ___)

# Esperado
True

# Pista
Un minuto tiene sesenta segundos.
```

# match_filter

El callable se asigna a la clave `match_filter` de ydl_opts.

```ejercicio
# Enunciado
Completa la clave de configuración.

# Plantilla
ydl_opts = {"___": longer_than_a_minute}
print(list(ydl_opts))

# Esperado
['match_filter']

# Pista
Usa guion bajo.
```

# Cierre

La sesión siguiente integra un logger propio.
