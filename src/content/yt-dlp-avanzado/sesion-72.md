---
numero: 72
titulo: "_VALID_URL y la plantilla de tests del extractor"
---

# _VALID_URL

La clase extractor declara una expresión regular que identifica las URLs que puede procesar.

La plantilla oficial captura el identificador mediante un grupo con nombre `id`.

> Doc: [Adding support for a new site](https://github.com/yt-dlp/yt-dlp/blob/master/CONTRIBUTING.md#adding-support-for-a-new-site)

```python
import re

patron = r'https?://example\.com/watch/(?P<id>[0-9]+)'
m = re.match(patron, 'https://example.com/watch/42')
print(m.group('id'))
```

```salida
42
```

```ejercicio
# Enunciado
Completa el nombre del grupo que captura el identificador.

# Plantilla
patron = r'(?P<___>[0-9]+)'
print(__import__("re").match(patron, "42").group("id"))

# Esperado
42

# Pista
El campo obligatorio se llama id.
```

# _TESTS

La clase declara una lista de casos de prueba.

Cada caso puede contener una URL, un md5 esperado y un `info_dict`.

# id y ext bastan para ejecutar el test inicial

La guía señala que, para vídeos, `id` y `ext` son suficientes para **ejecutar** inicialmente un caso.

```python
info_dict = {
    'id': '42',
    'ext': 'mp4',
}
print(sorted(info_dict))
```

```salida
['ext', 'id']
```

```ejercicio
# Enunciado
Completa el campo de extensión.

# Plantilla
info_dict = {"id": "42", "___": "mp4"}
print(info_dict["ext"])

# Esperado
mp4

# Pista
Tiene tres letras.
```

# Valores esperados flexibles

La guía admite valores literales, checksums `md5:`, regex `re:`, conteos `count:` y tipos de Python como expectativas de tests.

# only_matching

Un test con `only_matching` verifica matching de URL sin formar parte de la numeración normal de casos ejecutables.

# Cierre

La sesión siguiente implementa _real_extract y el info dict devuelto.
