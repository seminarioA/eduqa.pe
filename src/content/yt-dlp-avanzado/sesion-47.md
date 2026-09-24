---
numero: 47
titulo: "Defaults de formatos, multistreams y errores"
---

# Orden de formatos

yt-dlp prefiere resolución y codecs mejores en lugar de ordenar principalmente por bitrate.

`--compat-options format-sort` restaura el orden de youtube-dl.

> Doc: [Differences in default behavior](https://github.com/yt-dlp/yt-dlp#differences-in-default-behavior)

# prefer-vp9-sort

Versiones anteriores de yt-dlp daban más preferencia a VP9. `prefer-vp9-sort` restaura esa política.

`format-sort` y `prefer-vp9-sort` no pueden utilizarse juntos.

```opcion-multiple
# Enunciado
¿Pueden combinarse format-sort y prefer-vp9-sort?

# Opciones
- No
- Sí, siempre
- Solo sin FFmpeg
- Solo en Windows

# Correcta
1

# Explicación
El README declara explícitamente que las dos compat options son incompatibles.

# Pista
Ambas intentan restaurar órdenes distintos.
```

# Selector predeterminado

yt-dlp usa `bv*+ba/b`. La compat option `format-spec`, o declarar `-f bv+ba/b`, recupera el selector anterior.

# Multistreams

A diferencia de youtube-dlc, yt-dlp no habilita por defecto múltiples streams de audio/vídeo. `multistreams` activa ambos controles.

# Política de errores

`--no-abort-on-error` es default. `--abort-on-error` o la compat option `abort-on-error` restauran aborto ante error.

```ejercicio
# Enunciado
Completa la compat option que restaura aborto ante errores.

# Plantilla
print("--compat-options " + "___")

# Esperado
--compat-options abort-on-error

# Pista
Coincide con la opción sin los guiones iniciales.
```

# Cierre

La sesión siguiente compara metadata, playlists, índices y listado de formatos.
