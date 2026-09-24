---
numero: 82
titulo: "Campos de ordenamiento: presencia, calidad y protocolo"
---

# hasvid

Prioriza formatos que contienen vídeo.

# hasaud

Prioriza formatos que contienen audio.

# ie_pref

Preferencia de formato definida por el extractor.

# lang

Preferencia de idioma determinada por el extractor.

# quality

Calidad del formato.

# source

Preferencia de la fuente.

# proto

Orden de protocolos. El README documenta una preferencia aproximada desde HTTPS/FTPS hacia HTTP/FTP, HLS nativo/HLS, DASH por segmentos, WebSocket fragmentado y otros protocolos.

> Doc: [Sorting Formats](https://github.com/yt-dlp/yt-dlp#sorting-formats)

```ejercicio
# Enunciado
Completa el campo que ordena por protocolo.

# Plantilla
print("-S " + "___")

# Esperado
-S proto

# Pista
Es la abreviatura de protocol.
```

# vcodec

Preferencia de codec de vídeo. El README documenta el orden actual de familias como AV1, VP9, H.265, H.264 y otras.

# acodec

Preferencia de codec de audio. El orden documentado prioriza codecs lossless antes de varios codecs comprimidos.

# codec

Equivale a `vcodec,acodec`.

```ejercicio
# Enunciado
Completa el campo combinado de codecs.

# Plantilla
print("-S " + "___")

# Esperado
-S codec

# Pista
No especifica audio ni vídeo por separado.
```

# Cierre

La sesión siguiente cubre extensión, tamaño, resolución, HDR y parámetros de audio.
