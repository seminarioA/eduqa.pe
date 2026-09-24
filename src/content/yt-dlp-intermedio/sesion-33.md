---
numero: 33
titulo: "Formato e idiomas de subtítulos"
---

# --sub-format

`--sub-format FORMAT` selecciona formato de subtítulo. Varias preferencias se separan con barra (`/`).

```bash !sin-consola
yt-dlp --sub-format "ass/srt/best" "URL"
```

> Doc: [Subtitle Options — --sub-format](https://github.com/yt-dlp/yt-dlp#subtitle-options)

```ejercicio
# Enunciado
Completa el separador entre dos formatos preferidos.

# Plantilla
print("ass___srt")

# Esperado
ass/srt

# Pista
Se usa una barra.
```

# --sub-langs

`--sub-langs LANGS` selecciona idiomas separados por comas. También acepta regex o el valor `all`.

```ejercicio
# Enunciado
Completa la opción que selecciona inglés y japonés.

# Plantilla
print("yt-dlp " + "___" + " en,ja")

# Esperado
yt-dlp --sub-langs en,ja

# Pista
El nombre termina en `langs`.
```

# Regex de idiomas

El ejemplo `en.*` coincide con `en` seguido de cero o más caracteres.

```python
import re
print(bool(re.fullmatch(r"en.*", "en-US")))
```

```salida
True
```

```ejercicio
# Enunciado
Completa el patrón que acepta variantes de inglés.

# Plantilla
patron = r"___"
print(bool(__import__("re").fullmatch(patron, "en-US")))

# Esperado
True

# Pista
Empieza por `en` y termina con `.*`.
```

# Excluir idiomas

Un código precedido por guion (`-`) se excluye. El README muestra `all,-live_chat`.

```ejercicio
# Enunciado
Completa el prefijo de exclusión.

# Plantilla
print("all,___live_chat")

# Esperado
all,-live_chat

# Pista
Se usa un guion.
```

# Cierre

Los formatos usan una lista de preferencias y los idiomas admiten listas, regex y exclusiones. La sesión siguiente introduce credenciales directas.
