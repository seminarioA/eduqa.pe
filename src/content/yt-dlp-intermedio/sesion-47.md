---
numero: 47
titulo: "Políticas de fixup y ubicación de FFmpeg"
---

# --fixup

`--fixup POLICY` decide cómo corregir fallos conocidos del archivo.

> Doc: [Post-Processing Options — --fixup](https://github.com/yt-dlp/yt-dlp#post-processing-options)

# never

`never` no corrige.

```ejercicio
# Enunciado
Completa la política que no realiza fixup.

# Plantilla
print("___")

# Esperado
never

# Pista
Significa «nunca».
```

# warn

`warn` solo emite una advertencia.

# detect_or_warn

`detect_or_warn` intenta corregir y, si no puede, advierte. Es la política predeterminada.

```ejercicio
# Enunciado
Completa la política predeterminada.

# Plantilla
print("___")

# Esperado
detect_or_warn

# Pista
Une tres componentes con guiones bajos.
```

# force

`force` intenta corregir incluso si el archivo ya existe.

# --ffmpeg-location

`--ffmpeg-location PATH` indica el binario FFmpeg o el directorio que lo contiene.

```ejercicio
# Enunciado
Completa la opción que configura la ubicación de FFmpeg.

# Plantilla
print("___")

# Esperado
--ffmpeg-location

# Pista
Termina en `location`.
```

# Cierre

Fixup controla la política de corrección y ffmpeg-location resuelve dónde está la herramienta externa. La sesión siguiente ejecuta comandos en etapas del pipeline.
