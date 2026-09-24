---
numero: 5
titulo: "YouTube: webpage_client y player_params"
---

# webpage_client

Selecciona el cliente usado para la petición de la webpage.

Los valores documentados son `web`, predeterminado, y `web_safari`.

> Doc: [Extractor Arguments — youtube](https://github.com/yt-dlp/yt-dlp#extractor-arguments)

```ejercicio
# Enunciado
Completa el cliente predeterminado.

# Plantilla
print("youtube:webpage_client=___")

# Esperado
youtube:webpage_client=web

# Pista
Tiene tres letras.
```

# player_params

`player_params` sustituye los parámetros de player utilizados en las peticiones.

La documentación especifica que los valores proporcionados sobrescriben los defaults establecidos por yt-dlp.

```ejercicio
# Enunciado
Completa el nombre del argumento.

# Plantilla
print("youtube:___=VALUE")

# Esperado
youtube:player_params=VALUE

# Pista
Combina player y params.
```

# Sustitución, no adición garantizada

Como el README usa el verbo overwrite, una configuración explícita puede reemplazar parámetros predeterminados en lugar de agregarlos.

# Cierre

La sesión siguiente fija variante y versión del JavaScript player.
