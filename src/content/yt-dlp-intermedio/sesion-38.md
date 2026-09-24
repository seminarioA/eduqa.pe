---
numero: 38
titulo: "Extraer audio y elegir su formato"
---

# -x y --extract-audio

`-x` es la forma corta de `--extract-audio`. Convierte archivos de vídeo a audio y requiere FFmpeg y ffprobe.

> Doc: [Post-Processing Options — --extract-audio](https://github.com/yt-dlp/yt-dlp#post-processing-options)

```ejercicio
# Enunciado
Completa la forma corta de --extract-audio.

# Plantilla
print("yt-dlp " + "___")

# Esperado
yt-dlp -x

# Pista
Usa una x minúscula.
```

# --audio-format

`--audio-format FORMAT` elige el formato cuando se usa `-x`. Los valores soportados actualmente son `best`, `aac`, `alac`, `flac`, `m4a`, `mp3`, `opus`, `vorbis` y `wav`.

```ejercicio
# Enunciado
Completa la opción que convierte a mp3.

# Plantilla
print("yt-dlp -x " + "___" + " mp3")

# Esperado
yt-dlp -x --audio-format mp3

# Pista
Combina `audio` y `format`.
```

# --audio-quality

`--audio-quality QUALITY` configura la calidad de FFmpeg. Para VBR acepta 0 como mejor y 10 como peor; también acepta bitrate como `128K`. El valor predeterminado es 5.

```ejercicio
# Enunciado
Completa el valor VBR que representa la mejor calidad.

# Plantilla
calidad = ___
print(calidad)

# Esperado
0

# Pista
Cero es el extremo de mejor calidad.
```

# Cierre

La sesión siguiente distingue remux de recodificación.
