---
numero: 21
titulo: "Diagnóstico con --verbose, páginas y tráfico"
---

# -v y --verbose

`-v` es la forma corta de `--verbose`. Imprime información de depuración sobre la ejecución.

> Doc: [Verbosity and Simulation Options — --verbose](https://github.com/yt-dlp/yt-dlp#verbosity-and-simulation-options)

```ejercicio
# Enunciado
Completa la forma corta de --verbose.

# Plantilla
print("yt-dlp " + "___")

# Esperado
yt-dlp -v

# Pista
Usa la inicial de verbose.
```

# --dump-pages

`--dump-pages` imprime páginas descargadas codificadas en base64 para depuración. El README la describe como muy verbosa.

```ejercicio
# Enunciado
Completa la opción que imprime páginas codificadas en base64.

# Plantilla
print("___")

# Esperado
--dump-pages

# Pista
Combina `dump` y `pages`.
```

# --write-pages

`--write-pages` escribe páginas intermedias descargadas en archivos del directorio actual.

```ejercicio
# Enunciado
Completa la opción que guarda páginas intermedias.

# Plantilla
print("___")

# Esperado
--write-pages

# Pista
Combina `write` y `pages`.
```

# --print-traffic

`--print-traffic` muestra tráfico HTTP enviado y recibido.

```ejercicio
# Enunciado
Completa la opción que muestra tráfico HTTP.

# Plantilla
print("___")

# Esperado
--print-traffic

# Pista
El nombre termina en `traffic`.
```

# Datos de depuración

Páginas y tráfico pueden contener información sensible, incluidas cabeceras, parámetros o respuestas del servicio. Deben revisarse antes de compartirse.

# Cierre

La depuración puede ampliar mucho la cantidad y sensibilidad de la salida. La sesión siguiente fuerza la codificación de texto.
