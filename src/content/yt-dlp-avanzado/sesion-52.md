---
numero: 52
titulo: "Aliases de --compat-options"
---

# all

`--compat-options all` habilita todas las compat options.

El README añade explícitamente **Do NOT use this** porque agrupa comportamientos heterogéneos, incluidos cambios que no deberían restaurarse indiscriminadamente.

> Doc: [Differences in default behavior — compat aliases](https://github.com/yt-dlp/yt-dlp#differences-in-default-behavior)

# youtube-dl

El alias `youtube-dl` parte de `all` pero excluye multistreams, playlist-match-filter, manifest-filesize-approx y opciones inseguras, entre otras diferencias documentadas.

# youtube-dlc

Tiene otra combinación de exclusiones adaptada a defaults históricos de youtube-dlc.

# 2021

Expande hacia el alias 2022 más `no-certifi` y `filename-sanitization`.

# 2022

Expande hacia 2023 e incorpora varios comportamientos históricos como playlist-match-filter y manifest-filesize-approx.

# 2023

Expande hacia 2024 y añade `prefer-vp9-sort`.

# 2024

Expande hacia 2025 y añade `mtime-by-default`.

# 2025

Actualmente no cambia ningún comportamiento y existe para activar futuras compat options añadidas después de ese punto.

```ejercicio
# Enunciado
Completa el alias anual que actualmente no hace nada y reserva futuros cambios.

# Plantilla
print("--compat-options " + "___")

# Esperado
--compat-options 2025

# Pista
Es el último alias anual documentado actualmente.
```

# Qué significa fijar un año

Un alias anual fija los defaults al estado del **final** de ese año calendario.

# Cierre

La sesión siguiente trata dos compat options que restauran comportamiento vulnerable y no deben usarse como solución general.
