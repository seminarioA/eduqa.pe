---
numero: 81
titulo: "Valores desconocidos, filtros combinados y agrupación"
---

# Valor desconocido y ?

Un formato se excluye si el campo filtrado no se conoce. Añadir signo de interrogación (`?`) después del operador permite conservar valores desconocidos.

`height<=?720` acepta alturas hasta 720 y también formatos sin altura conocida.

> Doc: [Filtering Formats](https://github.com/yt-dlp/yt-dlp#filtering-formats)

```ejercicio
# Enunciado
Completa el modificador que acepta altura desconocida.

# Plantilla
print("height<=___720")

# Esperado
height<=?720

# Pista
Usa signo de interrogación.
```

# Filtros encadenados

Varios pares de corchetes se aplican conjuntamente.

`bv[height<=?720][tbr>500]` exige bitrate superior a 500 y permite altura desconocida o no mayor de 720.

```ejercicio
# Enunciado
Completa el segundo filtro.

# Plantilla
print("bv[height<=?720]___")

# Esperado
bv[height<=?720][tbr>500]

# Pista
Añade otra condición entre corchetes.
```

# all con filtros

`all[vcodec=none]` selecciona todos los formatos audio-only que satisfacen el filtro.

# Agrupación con paréntesis

Los paréntesis agrupan selectores antes de aplicar un filtro.

`(mp4,webm)[height<480]` selecciona los mejores MP4 y WebM premezclados por debajo de 480.

```ejercicio
# Enunciado
Completa la agrupación de mp4 y webm.

# Plantilla
print("___[height<480]")

# Esperado
(mp4,webm)[height<480]

# Pista
Encierra ambos selectores entre paréntesis.
```

# Cierre

La sesión siguiente entra en los campos disponibles para Sorting Formats.
