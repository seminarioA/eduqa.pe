---
numero: 53
titulo: "Opciones generales de extractores"
---

# --extractor-retries

`--extractor-retries RETRIES` configura reintentos para errores conocidos de extractores. El valor predeterminado es tres y también se acepta `infinite`.

> Doc: [Extractor Options — --extractor-retries](https://github.com/yt-dlp/yt-dlp#extractor-options)

```ejercicio
# Enunciado
Completa la opción de reintentos de extractor.

# Plantilla
print("___")

# Esperado
--extractor-retries

# Pista
Combina `extractor` y `retries`.
```

# --allow-dynamic-mpd

`--allow-dynamic-mpd` procesa manifests DASH dinámicos y es el comportamiento predeterminado.

Su alias es `--no-ignore-dynamic-mpd`.

```ejercicio
# Enunciado
Completa la opción que permite MPD dinámico.

# Plantilla
print("___")

# Esperado
--allow-dynamic-mpd

# Pista
Empieza con `--allow-`.
```

# --ignore-dynamic-mpd

`--ignore-dynamic-mpd` evita procesar manifests DASH dinámicos. Su alias es `--no-allow-dynamic-mpd`.

# --hls-split-discontinuity

`--hls-split-discontinuity` separa playlists HLS en formatos diferentes en discontinuidades como cortes publicitarios.

```ejercicio
# Enunciado
Completa la opción que divide HLS en discontinuidades.

# Plantilla
print("___")

# Esperado
--hls-split-discontinuity

# Pista
Termina en `discontinuity`.
```

# --no-hls-split-discontinuity

`--no-hls-split-discontinuity` no divide HLS en discontinuidades y es el comportamiento predeterminado.

# --extractor-args

`--extractor-args IE_KEY:ARGS` pasa argumentos a un extractor. La sintaxis completa y cada extractor se desarrollan después.

```ejercicio
# Enunciado
Completa la opción que pasa argumentos a extractores.

# Plantilla
print("___")

# Esperado
--extractor-args

# Pista
Termina en `args`.
```

# Cierre

La sesión siguiente descompone los presets incorporados.
