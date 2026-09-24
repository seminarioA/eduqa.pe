---
numero: 84
titulo: "Helpers seguros de conversión y parsing"
---

# int_or_none()

Los datos numéricos extraídos deben pasar por helpers seguros en lugar de convertirlos suponiendo que siempre son válidos.

> Doc: [Use convenience conversion and parsing functions](https://github.com/yt-dlp/yt-dlp/blob/master/CONTRIBUTING.md#use-convenience-conversion-and-parsing-functions)

# float_or_none()

Convierte valores a float cuando es posible y permite escalado, por ejemplo milisegundos a segundos.

```ejercicio
# Enunciado
Completa el helper seguro para floats.

# Plantilla
print("___")

# Esperado
float_or_none

# Pista
Combina float, or y none.
```

# url_or_none()

Valida/procesa URLs antes de incorporarlas al info dict.

# traverse_obj()

Extrae estructuras anidadas con expectativas de tipo y fallbacks.

# try_call()

Sustituye patrones antiguos basados en `try_get` para llamadas que pueden fallar.

# unified_strdate()

Normaliza fechas destinadas a campos YYYYMMDD como `upload_date`.

# unified_timestamp()

Normaliza timestamps.

# parse_filesize()

Convierte representaciones de tamaño.

# parse_count()

Convierte contadores.

# parse_resolution()

Interpreta resoluciones.

# parse_duration()

Interpreta duraciones.

# parse_age_limit()

Interpreta límites de edad.

```ejercicio
# Enunciado
Completa el helper que interpreta una duración.

# Plantilla
print("___")

# Esperado
parse_duration

# Pista
Combina parse y duration.
```

# Ejemplo combinado

La guía muestra `traverse_obj` para summary, thumbnails y vídeo; después aplica `float_or_none` e `int_or_none` a duración y views.

# Cierre

La sesión siguiente explica pending-fixes, documentación viva y cierra la ruta.
