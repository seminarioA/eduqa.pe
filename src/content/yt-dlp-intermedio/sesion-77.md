---
numero: 77
titulo: "Fallback, selección múltiple y merge"
---

# /: fallback

La barra (`/`) expresa orden de preferencia. El selector de la izquierda se intenta antes.

`22/17/18` intenta 22, después 17 y finalmente 18.

> Doc: [Format Selection](https://github.com/yt-dlp/yt-dlp#format-selection)

```ejercicio
# Enunciado
Completa el separador de fallback.

# Plantilla
print("22___17")

# Esperado
22/17

# Pista
Usa barra.
```

# ,: varios formatos separados

La coma selecciona varios formatos del mismo vídeo como resultados separados.

`22,17,18` solicita los tres si están disponibles.

```ejercicio
# Enunciado
Completa el separador que solicita dos formatos separados.

# Plantilla
print("22___17")

# Esperado
22,17

# Pista
Usa coma.
```

# +: merge

El signo más selecciona formatos que deben fusionarse en un archivo.

`bestvideo+bestaudio` descarga vídeo-only y audio-only y los muxea con FFmpeg.

```ejercicio
# Enunciado
Completa el operador de merge.

# Plantilla
print("bestvideo___bestaudio")

# Esperado
bestvideo+bestaudio

# Pista
Usa el signo más.
```

# Precedencia combinada

Las operaciones pueden combinarse, por ejemplo `136/137/mp4/bestvideo,140/m4a/bestaudio`.

Cada operador mantiene su significado: barra para alternativa, coma para resultados separados y más para streams que se fusionan.

# Cierre

La sesión siguiente estudia cómo los flags multistream afectan al operador +.
