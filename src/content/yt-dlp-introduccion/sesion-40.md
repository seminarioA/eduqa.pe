---
numero: 40
titulo: "Descargadores externos"
---

# --downloader

`--downloader [PROTO:]NAME` selecciona un descargador externo o el downloader
nativo. El nombre puede ir precedido por uno o varios protocolos para limitar
cuándo se usa.

El README enumera actualmente `native`, `aria2c`, `axel`, `curl`,
`ffmpeg`, `httpie` y `wget`.

> Doc: [Download Options — --downloader](https://github.com/yt-dlp/yt-dlp#download-options)

```ejercicio
# Enunciado
Completa la opción que selecciona aria2c como descargador.

# Plantilla
print("yt-dlp " + "___" + " aria2c")

# Esperado
yt-dlp --downloader aria2c

# Pista
La opción se llama igual que «descargador» en inglés.
```

# El prefijo PROTO:

Un prefijo de protocolo restringe el descargador a ese protocolo. Los dos puntos
(`:`) separan la lista de protocolos del nombre del descargador.

```python
protocolos = "dash,m3u8"
descargador = "native"
print(f"{protocolos}:{descargador}")
```

```salida
dash,m3u8:native
```

```ejercicio
# Enunciado
Completa el separador entre la lista de protocolos y el descargador.

# Plantilla
print("dash,m3u8___native")

# Esperado
dash,m3u8:native

# Pista
Se utilizan dos puntos.
```

# La opción puede repetirse

El README permite repetir `--downloader` para asignar descargadores distintos
a protocolos diferentes.

Su ejemplo usa `aria2c` para HTTP/FTP y `native` para DASH/m3u8.

```bash !sin-consola
yt-dlp --downloader aria2c --downloader "dash,m3u8:native" "URL"
```

> Doc: [Download Options — --downloader](https://github.com/yt-dlp/yt-dlp#download-options)

# --external-downloader es un alias

`--external-downloader` es el alias documentado de `--downloader`. El curso
usa el nombre principal para evitar duplicar una misma operación como si fueran
dos capacidades.

```ejercicio
# Enunciado
Completa el alias histórico documentado para --downloader.

# Plantilla
print("--external-___")

# Esperado
--external-downloader

# Pista
La parte que falta coincide con el nombre de la opción principal.
```

# --downloader-args

`--downloader-args NAME:ARGS` pasa argumentos al descargador externo. El
nombre y los argumentos se separan con dos puntos.

La opción puede repetirse para configurar varios descargadores.

```bash !sin-consola
yt-dlp --downloader-args "aria2c:-x 8" "URL"
```

> Doc: [Download Options — --downloader-args](https://github.com/yt-dlp/yt-dlp#download-options)

```ejercicio
# Enunciado
Completa la opción que pasa argumentos a un descargador externo.

# Plantilla
print("yt-dlp " + "___" + " aria2c:-x")

# Esperado
yt-dlp --downloader-args aria2c:-x

# Pista
Añade el sufijo `-args` al nombre de la opción principal.
```

# Argumentos de FFmpeg

Para FFmpeg, la documentación permite dirigir argumentos a posiciones
específicas usando la misma sintaxis que `--postprocessor-args`. Esa sintaxis
se desarrolla en el nivel intermedio junto con postprocesamiento.

# Cierre

`--downloader` elige el programa que realiza la transferencia y puede
restringirse por protocolo. `--downloader-args` configura ese programa sin
confundir sus argumentos con opciones propias de yt-dlp.

La sesión siguiente introduce archivos con lotes de URLs.
