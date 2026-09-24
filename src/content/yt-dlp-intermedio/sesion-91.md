---
numero: 91
titulo: "Ejemplos completos de modificación de metadatos"
---

# Interpretar "Artist - Title"

El README usa `--parse-metadata "title:%(artist)s - %(title)s"` para interpretar el título como dos campos.

> Doc: [Modifying metadata examples](https://github.com/yt-dlp/yt-dlp#modifying-metadata-examples)

# Extraer artist con regex

`description:Artist - (?P<artist>.+)` crea artist desde la descripción.

# Copiar episode a title

`episode:title` copia un campo directamente.

# Construir S01E05

Una output template puede combinar series, season_number y episode_number antes de asignar title.

# Priorizar uploader como artist embebido

El ejemplo crea `meta_artist` desde uploader y después usa `--embed-metadata`.

# comment desde description

Una regex con flag DOTALL permite usar una descripción multilínea como comentario embebido.

# Vaciar synopsis

Un grupo con nombre vacío de contenido puede asignar un valor vacío a `meta_synopsis`.

# Eliminar formats del info JSON

El ejemplo crea un grupo vacío `formats` para borrar ese campo antes de escribir info JSON.

# Reemplazar espacios y guiones bajos

`--replace-in-metadata "title,uploader" "[ _]" "-"` normaliza ambos campos reemplazando espacios y `_` por guiones.

```python
import re
print(re.sub(r"[ _]", "-", "curso_yt dlp"))
```

```salida
curso-yt-dlp
```

```ejercicio
# Enunciado
Completa el patrón que coincide con espacio o guion bajo.

# Plantilla
import re
print(re.sub(r"___", "-", "a_b c"))

# Esperado
a-b-c

# Pista
Usa una clase de caracteres con espacio y _.
```

# Cierre del nivel intermedio

El nivel intermedio cubrió filesystem auxiliar, cookies, caché, salida estructurada, workarounds, formatos, subtítulos, autenticación, postprocesamiento, SponsorBlock, configuración, output templates, selección/filtrado/ordenamiento y modificación de metadatos.

**yt-dlp avanzado** continúa con argumentos específicos de extractores, plugins, embedding mediante Python, cambios respecto de youtube-dl, compatibilidad, deprecaciones y contribución al proyecto.
