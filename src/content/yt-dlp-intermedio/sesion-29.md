---
numero: 29
titulo: "Streams múltiples de vídeo y audio"
---

# --video-multistreams

`--video-multistreams` permite combinar varios streams de vídeo en un único archivo.

> Doc: [Video Format Options — --video-multistreams](https://github.com/yt-dlp/yt-dlp#video-format-options)

```ejercicio
# Enunciado
Completa la opción que permite múltiples streams de vídeo.

# Plantilla
print("___")

# Esperado
--video-multistreams

# Pista
Empieza con `--video-`.
```

# --no-video-multistreams

`--no-video-multistreams` limita cada archivo de salida a un stream de vídeo y es el comportamiento predeterminado.

```ejercicio
# Enunciado
Completa la opción predeterminada de vídeo.

# Plantilla
print("___")

# Esperado
--no-video-multistreams

# Pista
Niega la opción anterior.
```

# --audio-multistreams

`--audio-multistreams` permite combinar varios streams de audio en un único archivo.

```ejercicio
# Enunciado
Completa la opción que permite múltiples streams de audio.

# Plantilla
print("___")

# Esperado
--audio-multistreams

# Pista
Empieza con `--audio-`.
```

# --no-audio-multistreams

`--no-audio-multistreams` limita cada archivo a un stream de audio y es el comportamiento predeterminado.

# Cierre

Vídeo y audio tienen controles independientes de multistream. La sesión siguiente decide preferencias y comprobación de disponibilidad.
