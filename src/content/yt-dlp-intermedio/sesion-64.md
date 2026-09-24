---
numero: 64
titulo: "Templates por tipo de archivo"
---

# TYPE:TEMPLATE

Puede definirse una plantilla distinta para cada tipo de archivo escribiendo el tipo, dos puntos y la plantilla.

> Doc: [Output Template — templates by type](https://github.com/yt-dlp/yt-dlp#output-template)

# subtitle

`subtitle:` configura el nombre de subtítulos.

# thumbnail

`thumbnail:` configura miniaturas.

# description

`description:` configura archivos de descripción.

# annotation

`annotation:` aparece como tipo deprecado.

# infojson

`infojson:` configura info JSON.

# link

`link:` configura shortcuts.

# pl_thumbnail

Configura miniaturas de playlist.

# pl_description

Configura descripción de playlist.

# pl_infojson

Configura info JSON de playlist.

# chapter

Configura archivos producidos por capítulos.

# pl_video

Configura vídeo concatenado de playlist.

```ejercicio
# Enunciado
Completa el tipo para miniaturas.

# Plantilla
print("___:%(title)s.%(ext)s")

# Esperado
thumbnail:%(title)s.%(ext)s

# Pista
Usa el nombre inglés de miniatura.
```

# Template vacío

Si una plantilla de tipo está vacía, ese tipo no se escribe.

```ejercicio
# Enunciado
Completa una plantilla vacía para miniaturas.

# Plantilla
print("thumbnail___")

# Esperado
thumbnail:

# Pista
Después del tipo queda únicamente el separador.
```

# Cierre

La sesión siguiente recorre campos de identidad, título y autoría.
