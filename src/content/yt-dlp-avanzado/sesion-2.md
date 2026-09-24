---
numero: 2
titulo: "YouTube: lang y skip"
---

# lang

`youtube:lang=...` prefiere metadata traducida al código de idioma indicado. El código es sensible a mayúsculas y minúsculas.

> Doc: [Extractor Arguments — youtube](https://github.com/yt-dlp/yt-dlp#extractor-arguments)

```ejercicio
# Enunciado
Completa el argumento que prefiere inglés.

# Plantilla
print("youtube:___=en")

# Esperado
youtube:lang=en

# Pista
El argumento se llama lang.
```

# Fallback de idioma

Por defecto se prefiere la metadata del idioma principal del vídeo, con fallback a traducción inglesa cuando corresponde.

# skip=hls

Omite extracción de manifests m3u8.

# skip=dash

Omite manifests DASH.

# skip=translated_subs

Omite subtítulos auto-traducidos.

```ejercicio
# Enunciado
Completa el valor que omite DASH.

# Plantilla
print("youtube:skip=___")

# Esperado
youtube:skip=dash

# Pista
Usa el nombre del tipo de manifest.
```

# Múltiples valores

Los valores pueden combinarse en una misma lista cuando el argumento admite más de uno.

# Cierre

La sesión siguiente selecciona clientes de player de YouTube.
