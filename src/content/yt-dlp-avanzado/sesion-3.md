---
numero: 3
titulo: "YouTube: player_client"
---

# player_client

`player_client` selecciona los clientes desde los que yt-dlp intenta extraer datos del vídeo.

> Doc: [Extractor Arguments — youtube player_client](https://github.com/yt-dlp/yt-dlp#extractor-arguments)

# Clientes documentados

El README actual enumera `web`, `web_safari`, `web_embedded`, `web_music`, `web_creator`, `mweb`, `ios`, `visionos`, `android`, `android_vr`, `tv`, `tv_downgraded` y `tv_simply`.

# Default sin condiciones especiales

El default actual usa `visionos,web`; si no hay runtime JavaScript disponible, `web` se omite.

```ejercicio
# Enunciado
Completa el primer cliente del default actual.

# Plantilla
print("___,web")

# Esperado
visionos,web

# Pista
Es el cliente de Vision Pro.
```

# Cookies de cuenta free

Con cookies autenticadas de cuenta gratuita, el README documenta `web_embedded,tv_downgraded,web`.

# Cookies premium

Con cuenta premium: `web_creator,tv_downgraded,web`.

# music.youtube.com

`web_music` se añade con cookies autenticadas para URLs de YouTube Music.

# Vídeos con restricción de edad

`web_embedded` puede añadirse en determinados casos; `web_creator` puede añadirse cuando se necesita verificación de edad de cuenta.

# PO Token y autenticación

Algunos clientes, como `web_creator` y `web_music`, necesitan PO Token para que sus formatos sean descargables; algunos clientes también requieren autenticación.

# default y all

`default` representa clientes predeterminados; `all` solicita todos y el README no recomienda esta última opción.

# Excluir un cliente

Un guion delante del cliente lo excluye: `default,-web`.

```ejercicio
# Enunciado
Completa la exclusión del cliente web.

# Plantilla
print("default,___web")

# Esperado
default,-web

# Pista
Usa un guion.
```

# Cierre

La sesión siguiente reduce peticiones con player_skip y controla datos de webpage.
