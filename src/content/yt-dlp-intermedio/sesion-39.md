---
numero: 39
titulo: "Remux y recodificación"
---

# --remux-video

`--remux-video FORMAT` cambia el contenedor sin recodificar los streams cuando el contenedor destino es compatible con los codecs.

> Doc: [Post-Processing Options — --remux-video](https://github.com/yt-dlp/yt-dlp#post-processing-options)

```ejercicio
# Enunciado
Completa la opción que remuxa a mkv.

# Plantilla
print("yt-dlp " + "___" + " mkv")

# Esperado
yt-dlp --remux-video mkv

# Pista
Empieza con `remux`.
```

# Reglas múltiples

La sintaxis admite reglas como `aac>m4a/mov>mp4/mkv`.

```ejercicio
# Enunciado
Completa el separador entre origen y destino.

# Plantilla
print("aac___m4a")

# Esperado
aac>m4a

# Pista
Se usa el signo mayor que.
```

# --recode-video

`--recode-video FORMAT` recodifica el vídeo cuando hace falta y usa la misma sintaxis de reglas que `--remux-video`.

```ejercicio
# Enunciado
Completa la opción de recodificación.

# Plantilla
print("___")

# Esperado
--recode-video

# Pista
Empieza con `recode`.
```

# Cierre

Remux cambia contenedor; recode puede cambiar codecs mediante recodificación. La sesión siguiente pasa argumentos a postprocesadores.
