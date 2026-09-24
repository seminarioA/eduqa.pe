---
numero: 11
titulo: "YouTube: tracing, fetch_pot y playback context"
---

# pot_trace

`pot_trace` habilita logs de depuración para obtención de PO Tokens. Acepta `true` o `false`; el default es `false`.

> Doc: [Extractor Arguments — youtube](https://github.com/yt-dlp/yt-dlp#extractor-arguments)

```ejercicio
# Enunciado
Completa el valor que habilita tracing de PO Tokens.

# Plantilla
print("youtube:pot_trace=___")

# Esperado
youtube:pot_trace=true

# Pista
Usa el booleano verdadero.
```

# fetch_pot=always

Intenta obtener PO Token aun cuando el cliente no lo exija para ese contexto.

# fetch_pot=never

No intenta obtener PO Tokens mediante providers.

# fetch_pot=auto

Es el default: intenta obtenerlos únicamente cuando el cliente los necesita para el contexto.

```ejercicio
# Enunciado
Completa la política predeterminada.

# Plantilla
print("youtube:fetch_pot=___")

# Esperado
youtube:fetch_pot=auto

# Pista
Delega la decisión a yt-dlp.
```

# jsc_trace

Habilita logs para obtención de JavaScript Challenges. Acepta true/false y el default es false.

# use_ad_playback_context

Puede omitir preroll ads y eliminar una espera obligatoria en los clientes `mweb` y `web_music`.

El README advierte expresamente que **no** debe usarse con cookies de una cuenta premium, porque se pierden formatos premium.

```opcion-multiple
# Enunciado
¿Cuándo advierte el README que no se use use_ad_playback_context?

# Opciones
- Con cookies de una cuenta premium
- Sin FFmpeg
- Con formato webm
- Con --quiet

# Correcta
1

# Explicación
La opción puede provocar pérdida de formatos premium.

# Pista
La advertencia menciona cuentas premium.
```

# Cierre

La sesión siguiente cubre EJS, WebPO y argumentos de playlists/canales de YouTube.
