---
numero: 68
titulo: "Extractor, URLs y clasificación del contenido"
---

# extractor

Nombre del extractor.

# extractor_key

Clave interna del extractor.

# epoch

Epoch UNIX de finalización de extracción.

# webpage_url

URL que, si se vuelve a proporcionar a yt-dlp, debería producir el mismo recurso lógico.

# webpage_url_basename

Basename de la URL de página.

# webpage_url_domain

Dominio de la URL.

# original_url

URL originalmente proporcionada por el usuario.

> Doc: [Output Template — available fields](https://github.com/yt-dlp/yt-dlp#output-template)

```ejercicio
# Enunciado
Completa el campo que conserva la URL original del usuario.

# Plantilla
print("%(___)s")

# Esperado
%(original_url)s

# Pista
Empieza con original_.
```

# categories

Lista de categorías.

# tags

Lista de etiquetas asociadas al contenido.

> Doc: [Output Template — available fields](https://github.com/yt-dlp/yt-dlp#output-template)

```ejercicio
# Enunciado
Completa el campo que contiene una lista de etiquetas.

# Plantilla
print("%(___)s")

# Esperado
%(tags)s

# Pista
Tiene cuatro letras.
```

# cast

Lista de miembros del reparto cuando el extractor la proporciona.

# Cierre

Los campos del extractor identifican qué componente produjo la información; las distintas URLs conservan el origen y la página reproducible, mientras categories, tags y cast clasifican el contenido.

La sesión siguiente cubre autonumeración y playlists.
