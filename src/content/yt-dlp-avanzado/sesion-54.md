---
numero: 54
titulo: "Opciones casi redundantes"
---

# Qué significa «almost redundant»

El README conserva algunas opciones cuya función es casi equivalente a una salida moderna basada en `--print`, aunque todavía existen diferencias suficientes para no llamarlas redundantes.

> Doc: [Deprecated options — Almost redundant](https://github.com/yt-dlp/yt-dlp#almost-redundant-options)

# -j y --dump-json

La alternativa moderna indicada es:

```text
--print "%()j"
```

```ejercicio
# Enunciado
Completa la conversión JSON del infodict completo.

# Plantilla
print("--print "%()___"")

# Esperado
--print "%()j"

# Pista
Usa la conversión JSON.
```

# -F y --list-formats

La alternativa es `--print formats_table`.

# --list-thumbnails

Se reemplaza conceptualmente por imprimir `thumbnails_table` y `playlist:thumbnails_table`.

# --list-subs

La alternativa combina `automatic_captions_table` y `subtitles_table`.

```ejercicio
# Enunciado
Completa el campo de tabla de subtítulos.

# Plantilla
print("--print " + "___")

# Esperado
--print subtitles_table

# Pista
Combina subtitles y table.
```

# Cierre

La sesión siguiente cubre opciones completamente redundantes que aún se mantienen por comodidad.
