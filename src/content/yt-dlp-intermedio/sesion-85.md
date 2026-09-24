---
numero: 85
titulo: "Ejemplos de selección: merge, fallback y salidas separadas"
---

# bv+ba/b

`bv+ba/b` intenta fusionar mejor vídeo-only y mejor audio-only; si no hay vídeo-only adecuado, cae a mejor formato combinado.

> Doc: [Format Selection examples](https://github.com/yt-dlp/yt-dlp#format-selection-examples)

```ejercicio
# Enunciado
Completa el fallback combinado.

# Plantilla
print("bv+ba/" + "___")

# Esperado
bv+ba/b

# Pista
Usa la forma corta de best combinado.
```

# bv*+ba/b

Permite que la parte de vídeo ya contenga audio; si no lo contiene, se combina con mejor audio-only.

# bv,ba

La coma descarga vídeo-only y audio-only como archivos separados. El README muestra una output template con `format_id` para evitar colisiones de nombre.

```ejercicio
# Enunciado
Completa la selección separada.

# Plantilla
print("bv___ba")

# Esperado
bv,ba

# Pista
Usa coma, no signo más.
```

# bv*+mergeall[vcodec=none]

Con audio multistreams, fusiona el mejor formato con vídeo y todos los formatos sin codec de vídeo.

# bv*+ba+ba.2

Con audio multistreams, combina vídeo y los dos mejores audios.

```ejercicio
# Enunciado
Completa el segundo mejor audio.

# Plantilla
print("ba+ba.___")

# Esperado
ba+ba.2

# Pista
El ordinal se escribe después del punto.
```

# Cierre

La sesión siguiente expresa mínimos de tamaño, resolución, protocolo y codecs mediante sort/filter.
