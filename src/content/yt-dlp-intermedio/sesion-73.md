---
numero: 73
titulo: "Selección predeterminada de formatos"
---

# Sin -f

Si no se pasa una opción de formato, yt-dlp intenta descargar la mejor calidad disponible.

La selección general equivale actualmente a `bestvideo*+bestaudio/best`.

> Doc: [Format Selection](https://github.com/yt-dlp/yt-dlp#format-selection)

```ejercicio
# Enunciado
Completa el fallback final de la selección predeterminada general.

# Plantilla
print("bestvideo*+bestaudio/" + "___")

# Esperado
bestvideo*+bestaudio/best

# Pista
Es el mejor formato combinado.
```

# Con --audio-multistreams

Cuando se habilitan múltiples streams de audio, el default cambia a `bestvideo+bestaudio/best`.

La diferencia es que `bestvideo` exige vídeo sin audio, mientras `bestvideo*` puede contener audio.

# Sin FFmpeg

Si FFmpeg no está disponible, el default cambia a `best/bestvideo+bestaudio`.

# Streaming a stdout

Al escribir el contenido multimedia en stdout con `-o -`, el default también es `best/bestvideo+bestaudio`.

# Cambio futuro documentado

El README advierte que el comportamiento de streaming múltiple a stdout puede cambiar en versiones futuras. Quien necesite conservar un selector concreto debe declararlo explícitamente.

```opcion-multiple
# Enunciado
¿Qué evita depender de futuros cambios del selector predeterminado?

# Opciones
- Declarar explícitamente -f
- Ocultar warnings
- Cambiar el proxy
- Usar --quiet

# Correcta
1

# Explicación
Un selector explícito fija la política de selección requerida.

# Pista
El default puede evolucionar.
```

# Cierre

La sesión siguiente selecciona códigos, extensiones y formatos de forma interactiva.
