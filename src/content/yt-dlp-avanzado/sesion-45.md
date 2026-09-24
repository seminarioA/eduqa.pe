---
numero: 45
titulo: "Mejoras de extractores, salida, plugins y distribución"
---

# Extractores nuevos y corregidos

El README remite al changelog y a la lista de sitios soportados para el inventario completo de extractores nuevos y corregidos.

> Doc: [Changes from youtube-dl — New features](https://github.com/yt-dlp/yt-dlp#new-features)

# Nuevos MSO

Se añadieron múltiples proveedores de autenticación MSO.

# Subtítulos desde manifests

yt-dlp incorporó extracción de subtítulos desde manifests de streaming.

# Múltiples rutas y templates

`--paths` y las plantillas por tipo permiten separar ubicaciones y nombres de distintos artefactos, incluida una ruta temporal.

# Configuración portable

La búsqueda de configuraciones incluye ubicaciones portable, home y otras rutas documentadas.

# Mejoras de output templates

Se añadieron formato fecha-hora, offsets numéricos, traversal y operaciones avanzadas junto con `--parse-metadata` y `--replace-in-metadata`.

# Nuevas opciones

La lista histórica destaca, entre otras, `--alias`, `--print`, `--concat-playlist`, `--wait-for-video`, `--retry-sleep`, `--sleep-requests`, `--convert-thumbnails`, `--force-download-archive`, `--force-overwrites` y `--break-match-filters`.

# Mejoras de operaciones existentes

Se añadieron regex y operadores en format/match filters, múltiples postprocessor/downloader args, archive checking más rápido, multistream, múltiples config locations y `--exec` por etapas.

# Plugins

yt-dlp añadió carga externa de extractores y PostProcessors.

# Self updater

`-U` actualiza releases y `--update-to` permite cambiar versión/canal.

# Builds automatizados

Los canales nightly y master forman parte del sistema de builds automatizados.

```ejercicio
# Enunciado
Completa la opción que permite cambiar a otro canal o release.

# Plantilla
print("___")

# Esperado
--update-to

# Pista
Combina update y to.
```

# Cierre

A partir de la siguiente sesión se comparan defaults actuales con youtube-dl y youtube-dlc.
