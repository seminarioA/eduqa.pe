---
numero: 40
titulo: "Argumentos de postprocesadores"
---

# --postprocessor-args

`--postprocessor-args NAME:ARGS` pasa argumentos a un postprocesador o ejecutable. Su alias es `--ppa`.

> Doc: [Post-Processing Options — --postprocessor-args](https://github.com/yt-dlp/yt-dlp#post-processing-options)

```ejercicio
# Enunciado
Completa el alias corto de --postprocessor-args.

# Plantilla
print("___")

# Esperado
--ppa

# Pista
Son las iniciales de postprocessor args.
```

# NAME:ARGS

Los dos puntos separan el nombre del receptor y sus argumentos.

```ejercicio
# Enunciado
Completa el separador.

# Plantilla
print("FFmpeg___-loglevel warning")

# Esperado
FFmpeg:-loglevel warning

# Pista
Se usa un carácter de dos puntos.
```

# PP+EXE

La forma `PP+EXE:ARGS` limita los argumentos al ejecutable cuando se usa dentro de un postprocesador concreto.

```ejercicio
# Enunciado
Completa el separador entre postprocesador y ejecutable.

# Plantilla
print("Merger___ffmpeg")

# Esperado
Merger+ffmpeg

# Pista
Se usa el signo más.
```

# _i y _o

Para FFmpeg y ffprobe pueden añadirse sufijos `_i` y `_o`, opcionalmente numerados, para colocar argumentos antes de una entrada o salida concreta.

```ejercicio
# Enunciado
Completa el sufijo usado antes de la primera entrada.

# Plantilla
print("Merger+ffmpeg___1")

# Esperado
Merger+ffmpeg_i1

# Pista
La i representa input.
```

# Cierre

La sesión siguiente controla archivos intermedios y sobrescritura del postprocesado.
