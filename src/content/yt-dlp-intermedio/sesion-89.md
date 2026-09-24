---
numero: 89
titulo: "Parsing de metadatos con FROM:TO"
---

# FROM

FROM puede ser un nombre de campo o una output template que produce el texto de entrada.

# :

Los dos puntos separan origen e interpretación/destino.

# TO con regex

TO puede ser una expresión regular de Python con grupos con nombre.

> Doc: [Modifying Metadata](https://github.com/yt-dlp/yt-dlp#modifying-metadata)

```python
import re
m = re.match(r"Artist - (?P<artist>.+)", "Artist - Ana")
print(m.group("artist"))
```

```salida
Ana
```

```ejercicio
# Enunciado
Completa el nombre del grupo capturado.

# Plantilla
import re
m = re.match(r"Artist - (?P<___>.+)", "Artist - Ana")
print(m.group("artist"))

# Esperado
Ana

# Pista
El grupo representa el artista.
```

# TO como campo

`episode:title` copia el campo episode hacia title.

```ejercicio
# Enunciado
Completa el destino de episode:title.

# Plantilla
print("episode:" + "___")

# Esperado
episode:title

# Pista
El episodio pasa a ser título.
```

# TO como template limitado

TO también admite una sintaxis similar a output template con formato `%(field)s`.

# additional_urls

Crear el campo `additional_urls` hace que yt-dlp descargue URL adicionales derivadas de metadata.

> Nota: Este mecanismo amplía qué URLs procesa una entrada. Una aplicación que use metadata de fuentes no confiables debe controlar ese efecto.

# Cierre

La sesión siguiente controla metadata embebida mediante prefijos meta_.
