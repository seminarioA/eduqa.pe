---
numero: 60
titulo: "Opciones ya no soportadas"
---

# avconv

`--prefer-avconv` ya no tiene soporte oficial. `--prefer-ffmpeg` representa el default.

> Doc: [Deprecated options — No longer supported](https://github.com/yt-dlp/yt-dlp#no-longer-supported)

# call-home

`--call-home` no está implementado; `--no-call-home` es el default.

# Ads

`--include-ads` ya no está soportado; `--no-include-ads` es el default.

# Annotations

`--write-annotations` dejó de tener utilidad porque ningún sitio soportado ofrece annotations actualmente.

# Aliases removidos

`--avconv-location`, `--cn-verification-proxy`, `--dump-headers` y `--dump-intermediate-pages` eran aliases de opciones modernas y fueron retirados.

```ejercicio
# Enunciado
Completa la opción moderna equivalente al antiguo --dump-headers.

# Plantilla
print("___")

# Esperado
--print-traffic

# Pista
Muestra tráfico HTTP.
```

# Manifests de YouTube

`--youtube-skip-dash-manifest` y `--youtube-skip-hls-manifest` fueron sustituidos por extractor args `youtube:skip=dash` y `youtube:skip=hls`.

# Include manifests

Las antiguas opciones include representan ahora el comportamiento predeterminado.

# Testing y utilidades retiradas

`--youtube-print-sig-code`, `--dump-user-agent` y `--xattr-set-filesize` ya no están soportadas.

# Compat options obsoletas

`seperate-video-versions` ya no se necesita y `no-youtube-prefer-utc-upload-date` ya no está soportada.

# Cierre

La sesión siguiente cubre las opciones eliminadas completamente del parser.
