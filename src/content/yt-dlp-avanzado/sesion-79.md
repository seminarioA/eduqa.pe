---
numero: 79
titulo: "Fallbacks entre fuentes de metadata"
---

# Una fuente puede desaparecer

Si un campo está disponible en varias fuentes, la guía recomienda intentar más de una.

> Doc: [Provide fallbacks](https://github.com/yt-dlp/yt-dlp/blob/master/CONTRIBUTING.md#provide-fallbacks)

# Primera fuente

Un valor puede obtenerse primero desde JSON estructurado.

# Segunda fuente

Si el JSON deja de contenerlo, puede recuperarse desde metadata HTML u otra fuente estable.

```python
meta = {}
og_title = "Título alternativo"
title = meta.get("title") or og_title
print(title)
```

```salida
Título alternativo
```

```ejercicio
# Enunciado
Completa el operador que usa la segunda fuente cuando la primera no tiene valor.

# Plantilla
meta = {}
fallback = "Título"
title = meta.get("title") ___ fallback
print(title)

# Esperado
Título

# Pista
Python usa un operador lógico de dos letras.
```

# _og_search_title()

El ejemplo oficial usa Open Graph title como fallback de un título obtenido desde JSON.

# Robustez frente a cambios menores

El objetivo no es duplicar código arbitrariamente, sino evitar que una modificación menor en una única fuente rompa metadata importante.

# Cierre

La sesión siguiente aplica reglas de grupos y flexibilidad en expresiones regulares.
