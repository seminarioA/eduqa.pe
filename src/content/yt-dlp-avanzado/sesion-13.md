---
numero: 13
titulo: "Generic: fragment_query, variant_query y key_query"
---

# fragment_query

Sin valor explícito, `fragment_query` propaga la query del manifest MPD/M3U8 hacia los fragmentos. Con valor, aplica la query proporcionada.

> Doc: [Extractor Arguments — generic](https://github.com/yt-dlp/yt-dlp#extractor-arguments)

```ejercicio
# Enunciado
Completa el argumento que propaga query a fragments.

# Plantilla
print("generic:___")

# Esperado
generic:fragment_query

# Pista
Combina fragment y query.
```

# HLS AES-128

Si existe una key HLS AES-128, fragment_query también puede propagarse a la URI de la key salvo que `key_query` o `hls_key` indiquen otra cosa.

# variant_query

Propaga la query del master M3U8 a las playlists de variantes o aplica un valor explícito.

```ejercicio
# Enunciado
Completa el argumento de variant playlists.

# Plantilla
print("generic:___")

# Esperado
generic:variant_query

# Pista
Combina variant y query.
```

# key_query

Propaga o establece la query de la URI de la key HLS AES-128.

No tiene efecto cuando la URI de key se proporciona mediante `hls_key` y no aplica al downloader FFmpeg.

```ejercicio
# Enunciado
Completa el argumento de query para la key.

# Plantilla
print("generic:___")

# Esperado
generic:key_query

# Pista
Combina key y query.
```

# Cierre

La sesión siguiente configura key HLS, estado live e impersonación del Generic extractor.
