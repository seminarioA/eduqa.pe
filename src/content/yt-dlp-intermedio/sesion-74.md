---
numero: 74
titulo: "Códigos, extensiones y selección interactiva"
---

# Código de formato

`-f 22` selecciona el formato cuyo `format_id` es 22.

Los códigos son específicos del extractor y del recurso; no deben asumirse como universales.

> Doc: [Format Selection](https://github.com/yt-dlp/yt-dlp#format-selection)

```ejercicio
# Enunciado
Completa el selector del formato 22.

# Plantilla
print("-f " + "___")

# Esperado
-f 22

# Pista
El selector puede ser directamente un format code.
```

# Obtener códigos con -F

`-F` o `--list-formats` permite inspeccionar los códigos disponibles antes de seleccionarlos.

# Extensión como selector

Una extensión selecciona el mejor formato servido como archivo único con esa extensión.

Las extensiones documentadas actualmente son `3gp`, `aac`, `flv`, `m4a`, `mp3`, `mp4`, `ogg`, `wav` y `webm`.

```ejercicio
# Enunciado
Completa el selector que pide el mejor archivo webm único.

# Plantilla
print("-f " + "___")

# Esperado
-f webm

# Pista
Usa la extensión sin punto.
```

# -f -

El valor guion (`-`) solicita el selector de manera interactiva para cada vídeo.

```ejercicio
# Enunciado
Completa el valor interactivo.

# Plantilla
print("-f " + "___")

# Esperado
-f -

# Pista
Es un único guion.
```

# Cierre

La sesión siguiente cubre selectores especiales de mejor calidad.
