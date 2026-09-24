---
numero: 14
titulo: "Generic: hls_key, is_live e impersonate"
---

# hls_key

`hls_key` acepta una URI o una key hexadecimal y opcionalmente un IV hexadecimal.

La forma general es `(URI|KEY)[,IV]`.

> Doc: [Extractor Arguments — generic](https://github.com/yt-dlp/yt-dlp#extractor-arguments)

```ejercicio
# Enunciado
Completa el separador entre key e IV.

# Plantilla
print("KEY___IV")

# Esperado
KEY,IV

# Pista
Se usa coma.
```

# Downloader nativo forzado

Proporcionar hls_key fuerza el downloader HLS nativo y sustituye valores correspondientes encontrados en el manifest.

# is_live=false

Omite detección HLS live y fija `not_live`.

# is_live con otro valor o sin valor

Fija `is_live`.

```ejercicio
# Enunciado
Completa el valor que fuerza not_live.

# Plantilla
print("generic:is_live=___")

# Esperado
generic:is_live=false

# Pista
Usa el booleano falso.
```

# impersonate

Selecciona targets para impersonar en la petición inicial de webpage.

Sin valor permite cualquier target; `false` desactiva impersonación y es el default.

```ejercicio
# Enunciado
Completa el valor que desactiva impersonación.

# Plantilla
print("generic:impersonate=___")

# Esperado
generic:impersonate=false

# Pista
Usa false.
```

# Cierre

La sesión siguiente cubre Viki, YouTube Web Archive, GameJolt y Hotstar.
