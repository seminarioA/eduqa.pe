---
numero: 83
titulo: "Campos de ordenamiento: extensión, tamaño y características"
---

# vext y aext

`vext` ordena extensiones de vídeo; `aext` extensiones de audio.

# ext

Equivale a `vext,aext`.

# filesize

Tamaño exacto cuando se conoce.

# fs_approx

Tamaño aproximado.

# size

Usa tamaño exacto si está disponible y, si no, el aproximado.

> Doc: [Sorting Formats](https://github.com/yt-dlp/yt-dlp#sorting-formats)

```ejercicio
# Enunciado
Completa el campo que usa tamaño exacto o aproximado.

# Plantilla
print("-S " + "___")

# Esperado
-S size

# Pista
Es el campo genérico de tamaño.
```

# height y width

Altura y anchura.

# res

Resolución calculada como la dimensión menor. Esta definición hace que el criterio también sea coherente con vídeos verticales.

# fps

Framerate.

# hdr

Rango dinámico. El orden documentado contempla DV, HDR12, HDR10+, HDR10, HLG y SDR.

# channels

Número de canales de audio.

# tbr, vbr y abr

Bitrate total, de vídeo y de audio.

# br

Bitrate medio tomando tbr/vbr/abr.

# asr

Frecuencia de muestreo de audio.

```ejercicio
# Enunciado
Completa el campo de resolución basado en la dimensión menor.

# Plantilla
print("-S " + "___")

# Esperado
-S res

# Pista
Tiene tres letras.
```

# Cierre

La sesión siguiente modifica dirección, objetivos y precedencia del ordenamiento.
