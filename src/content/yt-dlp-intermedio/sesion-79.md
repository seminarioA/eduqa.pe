---
numero: 79
titulo: "Filtros numéricos de formatos"
---

# Condiciones entre corchetes

Un filtro se escribe entre corchetes después del selector.

`best[height=720]` exige altura 720. Si no aparece selector, un filtro como `[filesize>10M]` se interpreta sobre `best`.

> Doc: [Filtering Formats](https://github.com/yt-dlp/yt-dlp#filtering-formats)

```ejercicio
# Enunciado
Completa los corchetes del filtro de altura.

# Plantilla
print("best___")

# Esperado
best[height=720]

# Pista
Incluye la condición completa entre corchetes.
```

# Operadores numéricos

Los operadores documentados son `<`, `<=`, `>`, `>=`, `=` y `!=`.

# filesize

Tamaño exacto en bytes si se conoce.

# filesize_approx

Estimación de tamaño.

# width y height

Dimensiones del vídeo.

# aspect_ratio

Relación de aspecto.

# tbr

Bitrate medio total de audio y vídeo en kbps.

# abr y vbr

Bitrate medio de audio y de vídeo.

# asr

Frecuencia de muestreo de audio en Hertz.

# fps

Frame rate.

# audio_channels

Número de canales de audio.

# stretched_ratio

Relación width:height de píxeles cuando no son cuadrados.

```ejercicio
# Enunciado
Completa el campo de framerate.

# Plantilla
print("best[___>=30]")

# Esperado
best[fps>=30]

# Pista
Son tres letras.
```

# Cierre

La sesión siguiente aplica operadores de texto a campos string.
