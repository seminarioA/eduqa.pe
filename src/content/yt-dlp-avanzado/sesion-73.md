---
numero: 73
titulo: "_real_extract y el info dict del extractor"
---

# _real_extract(self, url)

Este método implementa la extracción para una URL ya aceptada por `_VALID_URL`.

> Doc: [Adding support for a new site](https://github.com/yt-dlp/yt-dlp/blob/master/CONTRIBUTING.md#adding-support-for-a-new-site)

# _match_id()

La plantilla utiliza `self._match_id(url)` para extraer el ID mediante el patrón de la clase.

```ejercicio
# Enunciado
Completa el helper que obtiene el ID de una URL ya validada.

# Plantilla
print("self." + "___" + "(url)")

# Esperado
self._match_id(url)

# Pista
El método contiene match e id.
```

# _download_webpage()

Descarga la página y recibe el ID como contexto para mensajes y errores.

# _html_search_regex()

La plantilla muestra extracción de un título desde HTML mediante regex.

# Helpers Open Graph

`_og_search_description(webpage)` extrae la descripción Open Graph cuando existe.

# _search_regex(..., fatal=False)

Para metadata opcional, el ejemplo utiliza `fatal=False` para evitar que un campo secundario rompa toda la extracción.

# Diccionario de retorno

El método devuelve un info dict con campos como `id`, `title`, `description` y `uploader`.

```python
info = {
    'id': '42',
    'title': 'Video',
}
print(info['id'])
```

```salida
42
```

```ejercicio
# Enunciado
Completa el campo obligatorio de identificación.

# Plantilla
info = {"___": "42", "title": "Video"}
print(info["id"])

# Esperado
42

# Pista
Tiene dos letras.
```

# Cierre

La sesión siguiente registra la clase y ejecuta sus tests específicos.
