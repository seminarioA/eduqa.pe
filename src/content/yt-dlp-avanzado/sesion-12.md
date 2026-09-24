---
numero: 12
titulo: "youtube-ejs, WebPO y youtubetab"
---

# youtube-ejs:jitless

`jitless` ejecuta runtimes JavaScript soportados sin JIT.

Los runtimes documentados son Deno, Node y Bun. La opción mejora seguridad a costa de rendimiento; el README advierte que Node y Bun siguen considerándose inseguros.

> Doc: [Extractor Arguments — youtube-ejs](https://github.com/yt-dlp/yt-dlp#extractor-arguments)

```ejercicio
# Enunciado
Completa el argumento que activa modo jitless.

# Plantilla
print("youtube-ejs:jitless=___")

# Esperado
youtube-ejs:jitless=true

# Pista
Usa true.
```

# youtubepot-webpo:bind_to_visitor_id

Controla si WebPO usa Visitor ID en lugar de Visitor Data para cachear tokens. El default es `true`.

```ejercicio
# Enunciado
Completa el argumento WebPO.

# Plantilla
print("youtubepot-webpo:___=true")

# Esperado
youtubepot-webpo:bind_to_visitor_id=true

# Pista
El nombre menciona visitor_id.
```

# youtubetab:skip=webpage

Omite la descarga inicial de webpage para playlists, canales y feeds.

# youtubetab:skip=authcheck

Permite descargar playlists que requieren autenticación cuando no se descargó la página inicial. El README advierte que puede causar comportamiento no deseado.

# youtubetab:approximate_date

Extrae `upload_date` y `timestamp` aproximados en flat-playlist. Los filtros por fecha pueden volverse ligeramente inexactos.

```ejercicio
# Enunciado
Completa el argumento de fecha aproximada.

# Plantilla
print("youtubetab:___")

# Esperado
youtubetab:approximate_date

# Pista
Combina approximate y date.
```

# Cierre

La sesión siguiente pasa query strings desde manifests genéricos hacia fragments y variants.
