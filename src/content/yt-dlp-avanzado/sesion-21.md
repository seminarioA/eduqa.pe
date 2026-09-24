---
numero: 21
titulo: "ORF, Bilibili, SonyLIV, Streaks y TVer"
---

# orfon:prefer_segments_playlist

Prefiere una playlist de segmentos del programa en lugar de un único vídeo cuando está disponible.

Para obtener segmentos individuales, el README combina esta opción con `--concat-playlist never`.

```ejercicio
# Enunciado
Completa el argumento de ORF.

# Plantilla
print("orfon:___")

# Esperado
orfon:prefer_segments_playlist

# Pista
Combina prefer, segments y playlist.
```

# bilibili:prefer_multi_flv

Prefiere FLV multiparte frente a MP4 para vídeos antiguos que todavía ofrecen formatos legacy.

# sonylivseries:sort_order

Ordena episodios como `asc` o `desc`; `asc` es el default.

```ejercicio
# Enunciado
Completa el orden predeterminado de SonyLIV.

# Plantilla
print("sonylivseries:sort_order=___")

# Esperado
sonylivseries:sort_order=asc

# Pista
Es ascending.
```

# streaks:api_key

Configura el valor del encabezado `X-Streaks-Api-Key`.

> Nota: Una API key real es una credencial. Los ejemplos del curso no incluyen claves reales.

# tver:backend

Selecciona `streaks`, default, o `brightcove`, deprecado.

```ejercicio
# Enunciado
Completa el backend predeterminado.

# Plantilla
print("tver:backend=___")

# Esperado
tver:backend=streaks

# Pista
Coincide con el extractor anterior.
```

# Cierre

La sesión siguiente cubre Vimeo, ADN y ZAN y cierra extractor args.
