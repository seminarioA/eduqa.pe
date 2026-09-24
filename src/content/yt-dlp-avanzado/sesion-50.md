---
numero: 50
titulo: "Defaults de FFmpeg, thumbnails, info JSON y certificados"
---

# Merge directo con FFmpeg

Cuando FFmpeg actúa como downloader, yt-dlp puede descargar y fusionar formatos en un solo paso.

`no-direct-merge` restaura el flujo anterior.

> Doc: [Differences in default behavior](https://github.com/yt-dlp/yt-dlp#differences-in-default-behavior)

# Miniaturas MP4

yt-dlp usa mutagen cuando es posible. `embed-thumbnail-atomicparsley` fuerza AtomicParsley.

```ejercicio
# Enunciado
Completa la compat option que fuerza AtomicParsley.

# Plantilla
print("--compat-options " + "___")

# Esperado
--compat-options embed-thumbnail-atomicparsley

# Pista
El nombre une embed-thumbnail y atomicparsley.
```

# Limpieza de info JSON

Campos internos como filenames se eliminan por defecto.

`--no-clean-infojson` o `no-clean-infojson` recuperan el info JSON sin esa limpieza.

# Embed subs y write subs

Si se usan juntas, yt-dlp escribe subtítulos en disco y también los incrusta.

Usar solo `--embed-subs` permite incrustarlos y eliminar el archivo separado; `no-keep-subs` restaura el comportamiento anterior.

# certifi

Si está instalado, yt-dlp usa certifi para certificados raíz SSL.

`no-certifi` fuerza certificados del sistema.

# Sanitización de filenames

La sanitización de caracteres difiere de youtube-dl. `filename-sanitization` restaura el comportamiento histórico.

# Cierre

La sesión siguiente cubre defaults históricos por ventanas de versiones y backend HTTP.
