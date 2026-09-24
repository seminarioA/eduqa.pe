---
numero: 80
titulo: "Filtros de texto y negación"
---

# Operadores de texto

Los operadores son `=`, `^=` para «empieza por», `$=` para «termina en», `*=` para «contiene» y `~=` para regex.

> Doc: [Filtering Formats](https://github.com/yt-dlp/yt-dlp#filtering-formats)

```ejercicio
# Enunciado
Completa el operador «empieza por».

# Plantilla
print("protocol___http")

# Esperado
protocol^=http

# Pista
Usa caret y equals.
```

# url

URL del formato.

# ext

Extensión.

# acodec y vcodec

Codecs de audio y vídeo.

# container

Contenedor.

# protocol

Protocolo efectivo de descarga.

# language

Código de idioma.

# dynamic_range

Rango dinámico.

# format_id

Identificador corto.

# format

Descripción legible.

# format_note

Información adicional.

# resolution

Descripción textual de dimensiones.

# Negación !

Una comparación string puede anteponer `!`. `!*=` significa «no contiene».

```ejercicio
# Enunciado
Completa el operador «no contiene».

# Plantilla
print("protocol___dash")

# Esperado
protocol!*=dash

# Pista
Antepon ! al operador contains.
```

# Comillas

Si el comparando contiene espacios o caracteres especiales fuera de `._-`, debe entrecomillarse.

# Campos adicionales

Los extractores pueden exponer otros campos utilizables como filtros; la disponibilidad depende del metadata real del sitio.

# Cierre

La sesión siguiente trata valores desconocidos, filtros combinados y agrupación.
