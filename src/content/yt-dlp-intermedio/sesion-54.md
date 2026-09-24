---
numero: 54
titulo: "Presets incorporados"
---

# El propósito de -t

`-t` y `--preset-alias` aplican conjuntos de opciones predefinidos. Los nombres existentes no se eliminarán ni cambiarán, aunque su expansión puede ajustarse en versiones futuras.

> Doc: [Preset Aliases](https://github.com/yt-dlp/yt-dlp#preset-aliases)

# mp3

El preset `mp3` selecciona audio con preferencia por MP3 y activa extracción de audio a MP3.

```ejercicio
# Enunciado
Completa el nombre del preset de MP3.

# Plantilla
print("-t " + "___")

# Esperado
-t mp3

# Pista
Coincide con el formato.
```

# aac

El preset `aac` prioriza audio AAC y activa conversión a AAC.

```ejercicio
# Enunciado
Completa el preset de AAC.

# Plantilla
print("-t " + "___")

# Esperado
-t aac

# Pista
Tiene tres letras.
```

# mp4

El preset `mp4` combina merge, remux y ordenamiento para producir una preferencia compatible con MP4.

```ejercicio
# Enunciado
Completa el preset de MP4.

# Plantilla
print("-t " + "___")

# Esperado
-t mp4

# Pista
Coincide con el contenedor.
```

# mkv

El preset `mkv` usa MKV como contenedor de merge y remux.

# sleep

El preset `sleep` combina esperas para subtítulos, peticiones y descargas.

```ejercicio
# Enunciado
Completa el preset de esperas.

# Plantilla
print("-t " + "___")

# Esperado
-t sleep

# Pista
Su nombre significa «dormir».
```

# Preset no es comportamiento fijo eterno

La documentación permite que la expansión cambie en futuras versiones. Un flujo que dependa de opciones exactas debe inspeccionar la versión o expresar esas opciones de manera explícita.

# Cierre

Con esto termina el catálogo de opciones CLI de alto nivel del intermedio. La sesión siguiente estudia cómo se cargan archivos de configuración.
