---
numero: 43
titulo: "Origen del fork y nuevas capacidades principales"
---

# Origen de yt-dlp

La sección de cambios documenta que yt-dlp parte de `yt-dlc` y posteriormente incorporó cambios de `youtube-dl`, con excepciones registradas por el proyecto.

> Doc: [Changes from youtube-dl — New features](https://github.com/yt-dlp/yt-dlp#new-features)

# SponsorBlock

yt-dlp incorporó integración con la API de SponsorBlock para marcar o eliminar segmentos. Las opciones concretas ya se desarrollaron en el nivel intermedio.

# Format Sorting

Una diferencia central fue sustituir la idea de «mayor bitrate equivale a mejor» por un ordenamiento que considera resolución y codecs, además de permitir definir el orden con `-S`.

```ejercicio
# Enunciado
Completa la opción corta que define el orden de formatos.

# Plantilla
print("yt-dlp " + "___" + " res,codec")

# Esperado
yt-dlp -S res,codec

# Pista
Es una S mayúscula.
```

# Incorporación de animelover1984/youtube-dl

La documentación señala que yt-dlp incorporó numerosas mejoras de ese fork, entre ellas comentarios, extractores de Bilibili, embedding de miniaturas y metadata de playlists.

# Cierre

La sesión siguiente recorre las mejoras de YouTube y de descarga incorporadas respecto de youtube-dl.
