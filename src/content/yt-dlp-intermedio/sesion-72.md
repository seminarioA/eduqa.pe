---
numero: 72
titulo: "Campos de secciones, --print y SponsorBlock"
---

# section_title, section_number, section_start y section_end

Estos campos existen al usar `--download-sections` y para el prefijo `chapter:` de `--split-chapters`.

> Doc: [Output Template — section fields](https://github.com/yt-dlp/yt-dlp#output-template)

# urls

Disponible solo en `--print`: URLs de todos los formatos solicitados, una por línea.

# filename

Disponible en `--print`: nombre calculado del archivo, que puede diferir del nombre final.

# formats_table

Tabla equivalente a `--list-formats`.

# thumbnails_table

Tabla equivalente a `--list-thumbnails`.

# subtitles_table

Tabla de subtítulos.

# automatic_captions_table

Tabla de captions automáticos.

# filepath

Disponible después de descarga, en `post_process` o `after_move`: ruta real del vídeo descargado.

# SponsorBlock: start_time y end_time

Inicio y fin del capítulo SponsorBlock.

# SponsorBlock: categories y category

Lista de categorías y categoría mínima.

# SponsorBlock: category_names y name

Nombres amigables de categorías.

# SponsorBlock: type

Tipo de acción SponsorBlock.

```ejercicio
# Enunciado
Completa el campo que contiene la ruta real después de descargar.

# Plantilla
print("%(___)s")

# Esperado
%(filepath)s

# Pista
Está disponible después de la descarga.
```

```ejercicio
# Enunciado
Completa el campo de tabla de formatos para --print.

# Plantilla
print("%(___)s")

# Esperado
%(formats_table)s

# Pista
Combina formats y table.
```

# Cierre

Todos los grupos de campos documentados ya están identificados. La sesión siguiente aplica templates completos del README.
