---
numero: 76
titulo: "Selectores worst y n-ésimo mejor formato"
---

# w* y worst*

Selecciona el peor formato que contenga vídeo, audio o ambos.

# w y worst

Selecciona el peor formato que contenga vídeo y audio.

# wv y worstvideo

Selecciona el peor formato solo de vídeo.

# wv* y worstvideo*

Selecciona el peor formato que contenga vídeo.

# wa y worstaudio

Selecciona el peor formato solo de audio.

# wa* y worstaudio*

Selecciona el peor formato que contenga audio.

> Doc: [Format Selection — special names](https://github.com/yt-dlp/yt-dlp#format-selection)

```ejercicio
# Enunciado
Completa el selector del peor vídeo-only.

# Plantilla
print("-f " + "___")

# Esperado
-f wv

# Pista
Combina worst y video en su forma corta.
```

# Por qué worst suele ser una mala aproximación a «pequeño»

`worst` elige el peor formato según todos los criterios de ordenamiento. El README recomienda usar criterios de tamaño cuando el objetivo real es minimizar filesize.

Por ejemplo: `-S +size` o, de forma más estricta, `-S +size,+br,+res,+fps`.

# .n

Un punto seguido de número selecciona el n-ésimo mejor formato de un tipo.

`best.2` selecciona el segundo mejor combinado; `bv*.3` el tercer mejor que contiene vídeo.

```ejercicio
# Enunciado
Completa el selector del tercer mejor formato con vídeo.

# Plantilla
print("bv*.___")

# Esperado
bv*.3

# Pista
El ordinal se escribe después de un punto.
```

# Cierre

La sesión siguiente combina fallback, múltiples resultados y merge.
