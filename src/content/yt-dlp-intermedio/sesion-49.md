---
numero: 49
titulo: "Convertir subtítulos y miniaturas"
---

# --convert-subs

`--convert-subs FORMAT` convierte subtítulos. Los formatos soportados actualmente son `ass`, `lrc`, `srt` y `vtt`.

`none` desactiva la conversión y es el comportamiento predeterminado.

> Doc: [Post-Processing Options — --convert-subs](https://github.com/yt-dlp/yt-dlp#post-processing-options)

```ejercicio
# Enunciado
Completa la opción que convierte subtítulos a srt.

# Plantilla
print("yt-dlp " + "___" + " srt")

# Esperado
yt-dlp --convert-subs srt

# Pista
Combina `convert` y `subs`.
```

# --convert-subtitles

`--convert-subtitles` es un alias de `--convert-subs`.

# --convert-thumbnails

`--convert-thumbnails FORMAT` convierte miniaturas. Los formatos soportados actualmente son `jpg`, `png` y `webp`.

```ejercicio
# Enunciado
Completa la opción que convierte miniaturas a webp.

# Plantilla
print("yt-dlp " + "___" + " webp")

# Esperado
yt-dlp --convert-thumbnails webp

# Pista
Termina en `thumbnails`.
```

# Reglas múltiples

La conversión de miniaturas puede usar reglas con sintaxis similar a `--remux-video`.

# Cierre

La sesión siguiente divide y elimina capítulos y controla keyframes en los cortes.
