---
numero: 78
titulo: "Precedencia de streams en el operador +"
---

# Sin --video-multistreams

Mientras video multistreams esté desactivado, después de seleccionar un stream que contiene vídeo, otros streams de vídeo posteriores del mismo merge se ignoran.

> Doc: [Format Selection — multistream behavior](https://github.com/yt-dlp/yt-dlp#format-selection)

# Sin --audio-multistreams

La misma regla aplica al audio: después del primer stream con audio, los posteriores se ignoran.

# El orden importa

`best+bestaudio --no-audio-multistreams` conserva `best` e ignora `bestaudio`.

`bestaudio+best --no-audio-multistreams` conserva `bestaudio` e ignora `best`.

```opcion-multiple
# Enunciado
¿Por qué cambia el resultado al invertir best y bestaudio sin audio multistreams?

# Opciones
- Porque se conserva el primer stream de audio seleccionado
- Porque / cambia de significado
- Porque FFmpeg deja de existir
- Porque el format_id cambia

# Correcta
1

# Explicación
Sin audio multistreams, los streams posteriores con audio se ignoran.

# Pista
La documentación destaca que el orden importa.
```

# Con ambos multistreams

`bestvideo+best+bestaudio --video-multistreams --audio-multistreams` puede conservar los tres formatos y producir varios streams.

# Advertencia de deprecación

El README avisa que este comportamiento complejo será retirado cuando multistreams quede habilitado por defecto y se introduzca otro operador para limitar streams.

# Cierre

La sesión siguiente empieza filtros numéricos dentro de corchetes.
