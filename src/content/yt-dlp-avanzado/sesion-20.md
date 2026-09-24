---
numero: 20
titulo: "JioSaavn, AfreecaTV y SoundCloud"
---

# jiosaavn:bitrate

Solicita uno o más bitrates entre `16`, `32`, `64`, `128` y `320`. El default es `128,320`.

```ejercicio
# Enunciado
Completa el default de JioSaavn.

# Plantilla
print("jiosaavn:bitrate=___")

# Esperado
jiosaavn:bitrate=128,320

# Pista
Son dos valores separados por coma.
```

# afreecatvlive:cdn

Selecciona uno o más identificadores CDN para las URLs de stream.

CDN significa *content delivery network*.

# soundcloud:formats

Los valores tienen forma `{protocol}_{codec}`, por ejemplo `hls_opus` o `http_aac`.

```ejercicio
# Enunciado
Completa el separador entre protocolo y codec.

# Plantilla
print("hls___opus")

# Esperado
hls_opus

# Pista
Se usa guion bajo.
```

# Wildcard *

El asterisco puede sustituir el protocolo: `*_mp3`; también puede usarse solo para pedir todos los formatos.

# Protocolos y codecs

Protocolos conocidos: `http`, `hls`, `hls-aes`. Codecs conocidos: `aac`, `opus`, `mp3`.

# Default de SoundCloud

`http_aac,hls_aac,http_opus,hls_opus,http_mp3,hls_mp3`.

Los formatos `download` originales siempre se extraen.

# Cierre

La sesión siguiente cubre ORF, Bilibili, SonyLIV, Streaks y TVer.
