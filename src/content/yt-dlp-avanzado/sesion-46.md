---
numero: 46
titulo: "Defaults de runtime, configuración y nombre de salida"
---

# Versiones de Python

La sección de compatibilidad señala que yt-dlp requiere Python moderno y elimina soporte conforme las versiones llegan a EOL, a diferencia del rango histórico de youtube-dl.

> Doc: [Differences in default behavior](https://github.com/yt-dlp/yt-dlp#differences-in-default-behavior)

# Opciones históricas eliminadas

`--auto-number`/`-A`, `--title`/`-t` y `--literal`/`-l` ya no funcionan. Sus reemplazos se cubren en la sección de opciones removidas.

# avconv

yt-dlp no soporta `avconv` como alternativa oficial a FFmpeg.

# Ubicaciones de configuración

Las rutas de configuración difieren de youtube-dl; deben usarse las ubicaciones documentadas por yt-dlp.

# Template de salida predeterminado

El default de yt-dlp es:

```text
%(title)s [%(id)s].%(ext)s
```

youtube-dl utilizaba una forma con guion entre título e ID.

# compat filename

`--compat-options filename` restaura el comportamiento histórico de filename.

```ejercicio
# Enunciado
Completa la compat option que restaura el filename de youtube-dl.

# Plantilla
print("--compat-options " + "___")

# Esperado
--compat-options filename

# Pista
El valor se llama filename.
```

# Cierre

La sesión siguiente compara sorting, selector, multistreams y política de errores.
