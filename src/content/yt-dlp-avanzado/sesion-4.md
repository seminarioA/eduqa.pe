---
numero: 4
titulo: "YouTube: player_skip y webpage_skip"
---

# player_skip=configs

Omite configuraciones del cliente.

# player_skip=webpage

Omite la página inicial.

# player_skip=js

Omite el player JavaScript.

# player_skip=initial_data

Omite initial data y la petición relacionada.

> Doc: [Extractor Arguments — youtube player_skip](https://github.com/yt-dlp/yt-dlp#extractor-arguments)

```ejercicio
# Enunciado
Completa el valor que omite el player JavaScript.

# Plantilla
print("youtube:player_skip=___")

# Esperado
youtube:player_skip=js

# Pista
Usa la abreviatura de JavaScript.
```

# Consecuencia

El README advierte que estos skips pueden reducir peticiones o rate limiting, pero también provocar formatos o metadata ausentes.

# webpage_skip=player_response

Omite extracción de player response incrustada en la webpage.

# webpage_skip=initial_data

Omite initial data incrustada.

# No omiten peticiones

A diferencia de player_skip, webpage_skip está orientado a testing y no evita peticiones de red.

# Implicación de player_js_version

Usar un `player_js_version` distinto de `actual` implica `webpage_skip=player_response`.

```opcion-multiple
# Enunciado
¿Qué diferencia a webpage_skip de player_skip según el README?

# Opciones
- webpage_skip no evita peticiones de red
- webpage_skip instala FFmpeg
- player_skip solo cambia nombres de archivo
- No existe diferencia

# Correcta
1

# Explicación
webpage_skip evita usar datos embebidos, pero no salta las peticiones.

# Pista
Está descrito como opción de testing.
```

# Cierre

La sesión siguiente controla el cliente de webpage y parámetros del player.
