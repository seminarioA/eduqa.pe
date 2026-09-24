---
numero: 6
titulo: "YouTube: player_js_variant y player_js_version"
---

# player_js_variant

Selecciona la variante de JavaScript usada para descifrado de n/sig.

> Doc: [Extractor Arguments — youtube](https://github.com/yt-dlp/yt-dlp#extractor-arguments)

# Variantes conocidas

El README actual enumera `main`, `tcc`, `tce`, `es5`, `es6`, `es6_tcc`, `es6_tce`, `tv`, `tv_es6`, `phone` y `house`.

`main` es el default; las otras se orientan principalmente a depuración.

```ejercicio
# Enunciado
Completa la variante predeterminada.

# Plantilla
print("youtube:player_js_variant=___")

# Esperado
youtube:player_js_variant=main

# Pista
Es la variante principal.
```

# actual

El valor `actual` usa la variante prescrita por el sitio.

# player_js_version

Fija la versión del JavaScript player para descifrado n/sig.

La sintaxis es `signature_timestamp@hash`.

```ejercicio
# Enunciado
Completa el separador entre timestamp y hash.

# Plantilla
print("20348___0004de42")

# Esperado
20348@0004de42

# Pista
Usa arroba.
```

# Default actual

El default es usar lo prescrito por el sitio, seleccionable explícitamente mediante `actual`.

# Efecto sobre webpage_skip

Cualquier valor diferente de `actual` implica `webpage_skip=player_response`.

# Cierre

La sesión siguiente controla orden y límites de comentarios de YouTube.
