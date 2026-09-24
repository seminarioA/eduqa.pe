---
numero: 81
titulo: "Regex: simplicidad, puntos y cuantificadores"
---

# Tan simple como sea posible

Cada parte de una regex debe tener una razón funcional.

> Doc: [Keep the regular expressions as simple as possible, but no simpler](https://github.com/yt-dlp/yt-dlp/blob/master/CONTRIBUTING.md#keep-the-regular-expressions-as-simple-as-possible-but-no-simpler)

# No escapar caracteres innecesariamente

La guía contrasta una URL regex legible con otra cargada de escapes redundantes.

# El punto coincide con demasiados caracteres

Usar `.` cuando existe una clase más precisa puede hacer que el patrón atraviese estructuras que no deberían coincidir.

# [^>]+ para atributos

Para atributos HTML, una clase que excluye `>` acota el matching al tag.

# [^<]+ para contenido

Una clase que excluye `<` impide atravesar el siguiente tag.

```python
import re

html = '<span class="title">Curso</span>'
m = re.search(r'<span\b[^>]+class="title"[^>]*>([^<]+)', html)
print(m.group(1))
```

```salida
Curso
```

```ejercicio
# Enunciado
Completa el carácter que no debe cruzarse al extraer texto hasta el siguiente tag.

# Plantilla
patron = r'([^___]+)'
print(patron)

# Esperado
([^<]+)

# Pista
El siguiente tag comienza con menor que.
```

# Evitar non-greedy cuando no hace falta

La guía recomienda evitar `.*?` cuando una clase explícita expresa mejor el límite y reduce riesgo de backtracking catastrófico.

# +, * y ?

Los cuantificadores deben representar la cardinalidad real esperada, no usarse por costumbre.

# Cierre

La sesión siguiente cubre longitud de líneas, comillas y variables de un solo uso.
