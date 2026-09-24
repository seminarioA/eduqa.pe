---
numero: 83
titulo: "Colapsar fallbacks y cerrar estructuras multilínea"
---

# Fallbacks en una lista de patrones

Cuando varios fallbacks llaman al mismo helper, la guía prefiere una sola llamada con una lista de patrones.

> Doc: [Collapse fallbacks](https://github.com/yt-dlp/yt-dlp/blob/master/CONTRIBUTING.md#collapse-fallbacks)

```python
campos = ["og:description", "description", "twitter:description"]
print(len(campos))
```

```salida
3
```

```ejercicio
# Enunciado
Completa el tercer fallback de descripción.

# Plantilla
campos = ["og:description", "description", "___"]
print(campos[-1])

# Esperado
twitter:description

# Pista
Es la metadata description de Twitter.
```

# Helpers que aceptan listas de patrones

La guía enumera `_search_regex`, `_html_search_regex`, `_og_search_property` y `_html_search_meta`.

# Paréntesis de llamadas

Para llamadas o agrupación multilínea, el paréntesis de cierre se coloca después del último argumento, no aislado en una línea posterior.

# Literales multilínea

Listas, tuplas, diccionarios y sets literales multilínea sí cierran en una línea nueva.

# Comprehensions

Generadores y comprehensions pueden usar cualquiera de las dos disposiciones mostradas, según legibilidad.

```opcion-multiple
# Enunciado
¿Cómo debe cerrarse normalmente una llamada multilínea?

# Opciones
- El paréntesis final queda junto al último argumento
- Siempre en una línea aislada
- Nunca usa paréntesis
- Depende del sistema operativo

# Correcta
1

# Explicación
La convención distingue llamadas multilínea de literales de colección.

# Pista
La sección se llama Trailing parentheses.
```

# Cierre

La sesión siguiente utiliza helpers de conversión y parsing seguros de yt-dlp.
