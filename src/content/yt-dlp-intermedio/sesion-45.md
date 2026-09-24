---
numero: 45
titulo: "Reemplazar texto en metadatos"
---

# --replace-in-metadata

`--replace-in-metadata [WHEN:]FIELDS REGEX REPLACE` sustituye texto en campos de metadatos mediante una expresión regular.

> Doc: [Post-Processing Options — --replace-in-metadata](https://github.com/yt-dlp/yt-dlp#post-processing-options)

```ejercicio
# Enunciado
Completa la opción de reemplazo.

# Plantilla
print("___")

# Esperado
--replace-in-metadata

# Pista
El nombre contiene `replace` y `metadata`.
```

# FIELDS

`FIELDS` determina qué campos reciben el reemplazo.

# REGEX

`REGEX` define el patrón de texto a localizar.

```python
import re
print(re.sub(r"\s+", "-", "curso yt dlp"))
```

```salida
curso-yt-dlp
```

```ejercicio
# Enunciado
Completa la función de re que sustituye coincidencias.

# Plantilla
import re
print(re.___(r"\s+", "-", "a b"))

# Esperado
a-b

# Pista
La función abrevia substitute.
```

# REPLACE

`REPLACE` define el texto de sustitución. La opción puede repetirse.

# WHEN

Usa las mismas etapas que `--use-postprocessor`; el valor predeterminado es `pre_process`.

# Cierre

Parsing crea o deriva campos; replacement transforma texto dentro de campos. La sesión siguiente escribe xattrs y concatena playlists.
