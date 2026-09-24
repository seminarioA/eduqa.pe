---
numero: 78
titulo: "Extraer metadata opcional sin romper el extractor"
---

# dict.get()

Para un campo opcional de primer nivel, la guía prefiere `.get()` frente a indexación obligatoria.

```python
meta = {}
print(meta.get('summary'))
```

```salida
None
```

> Doc: [Mandatory and optional metafields](https://github.com/yt-dlp/yt-dlp/blob/master/CONTRIBUTING.md#mandatory-and-optional-metafields)

```ejercicio
# Enunciado
Completa el método que no lanza KeyError cuando falta la clave.

# Plantilla
meta = {}
print(meta.___("summary"))

# Esperado
None

# Pista
El método tiene tres letras.
```

# traverse_obj()

Para estructuras anidadas se recomienda `traverse_obj`, no cadenas de `.get()` ni el antiguo `try_get`.

```ejercicio
# Enunciado
Completa el helper recomendado para estructuras anidadas.

# Plantilla
print("___")

# Esperado
traverse_obj

# Pista
Combina traverse y obj con guion bajo.
```

# fatal=False

En helpers como `_search_regex` o `_html_search_regex`, un campo opcional debe usar `fatal=False` para que el fallo produzca una advertencia y la extracción continúe.

# default=None

Como alternativa, un default permite continuar silenciosamente con un valor conocido.

# No iterar sobre None

Si una lista opcional puede faltar, debe normalizarse a una secuencia vacía o extraerse de manera segura.

```python
data = {}
thumbnail_data = data.get('thumbnails') or []
print(list(thumbnail_data))
```

```salida
[]
```

```ejercicio
# Enunciado
Completa el fallback que evita iterar sobre None.

# Plantilla
data = {}
thumbnail_data = data.get("thumbnails") or ___
print(thumbnail_data)

# Esperado
[]

# Pista
Usa una lista vacía.
```

# Cierre

La sesión siguiente añade fallbacks entre fuentes independientes de metadata.
