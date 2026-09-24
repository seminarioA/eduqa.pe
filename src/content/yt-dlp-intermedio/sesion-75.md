---
numero: 75
titulo: "Selectores especiales de mejor calidad"
---

# all

`all` selecciona todos los formatos por separado.

# mergeall

`mergeall` selecciona y fusiona todos los formatos. Necesita audio multistreams, video multistreams o ambos.

> Doc: [Format Selection — special names](https://github.com/yt-dlp/yt-dlp#format-selection)

```ejercicio
# Enunciado
Completa el selector que fusiona todos los formatos.

# Plantilla
print("-f " + "___")

# Esperado
-f mergeall

# Pista
Une `merge` y `all`.
```

# b* y best*

Selecciona el mejor formato que contenga vídeo, audio o ambos.

# b y best

Selecciona el mejor formato que contenga vídeo y audio. Equivale a `best*[vcodec!=none][acodec!=none]`.

```ejercicio
# Enunciado
Completa la forma corta del mejor formato combinado.

# Plantilla
print("-f " + "___")

# Esperado
-f b

# Pista
Es una sola letra.
```

# bv y bestvideo

Selecciona el mejor formato solo de vídeo.

# bv* y bestvideo*

Selecciona el mejor formato que contenga vídeo; puede contener también audio.

# ba y bestaudio

Selecciona el mejor formato solo de audio.

# ba* y bestaudio*

Selecciona el mejor formato que contenga audio, aunque también tenga vídeo. El README marca explícitamente esta variante con una advertencia de no usarla.

```ejercicio
# Enunciado
Completa el selector de mejor audio-only.

# Plantilla
print("-f " + "___")

# Esperado
-f ba

# Pista
Usa la abreviatura de bestaudio.
```

# Cierre

La sesión siguiente cubre la familia worst y la selección del n-ésimo formato.
