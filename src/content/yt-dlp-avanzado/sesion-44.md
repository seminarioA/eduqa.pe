---
numero: 44
titulo: "Mejoras de YouTube, navegador y descargas parciales"
---

# Búsquedas y superficies de YouTube

La sección de cambios enumera soporte para Clips, Stories, búsquedas con filtros, YouTube Music Search, búsquedas específicas de canal, prefijos de búsqueda, Mixes y feeds.

> Doc: [Changes from youtube-dl — YouTube improvements](https://github.com/yt-dlp/yt-dlp#new-features)

# n-sig throttling

El proyecto incorporó una corrección para throttling basado en n-sig.

# --live-from-start

yt-dlp añadió descarga experimental de directos desde el inicio.

```ejercicio
# Enunciado
Completa la opción que intenta descargar un livestream desde el comienzo.

# Plantilla
print("___")

# Esperado
--live-from-start

# Pista
Combina live, from y start.
```

# URLs de canal

Las URLs de canal descargan todas las subidas, incluidos Shorts y directos.

# Cookies del navegador

`--cookies-from-browser` añadió extracción automática de cookies desde navegadores principales.

# Rangos temporales

`--download-sections` permite descargar por timestamps o capítulos.

# División por capítulos

`--split-chapters` divide un vídeo en varios archivos usando capítulos.

# Fragmentos concurrentes

`--concurrent-fragments` permite descargar varios fragmentos de M3U8/MPD en paralelo.

```ejercicio
# Enunciado
Completa la opción corta de fragmentos concurrentes.

# Plantilla
print("___")

# Esperado
-N

# Pista
Usa una N mayúscula.
```

# Cierre

La sesión siguiente cubre extractores, rutas, templates, plugins, actualización y builds añadidos por yt-dlp.
