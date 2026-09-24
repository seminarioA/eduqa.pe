---
numero: 3
titulo: "Metadatos de playlist"
---

# --write-playlist-metafiles

Cuando se utilizan opciones como `--write-info-json` o
`--write-description`, `--write-playlist-metafiles` hace que yt-dlp escriba
también los metadatos correspondientes a la playlist.

El README marca este comportamiento como predeterminado.

> Doc: [Filesystem Options — --write-playlist-metafiles](https://github.com/yt-dlp/yt-dlp#filesystem-options)

```ejercicio
# Enunciado
Completa la opción que conserva también los metadatos de la playlist.

# Plantilla
print("___")

# Esperado
--write-playlist-metafiles

# Pista
El nombre contiene `playlist` y `metafiles`.
```

# Vídeo y playlist son niveles distintos

Una URL de playlist puede producir información sobre la colección y sobre sus
elementos. Los metadatos de la playlist describen la colección; los de cada
vídeo describen cada entrada.

```python
niveles = ["playlist", "video"]
print(len(niveles))
```

```salida
2
```

```ejercicio
# Enunciado
Completa el nivel que representa la colección completa.

# Plantilla
niveles = ["___", "video"]
print(niveles[0])

# Esperado
playlist

# Pista
Es el mismo sustantivo que aparece en --write-playlist-metafiles.
```

# --no-write-playlist-metafiles

`--no-write-playlist-metafiles` evita escribir metadatos de playlist cuando
se usan opciones como `--write-info-json` o `--write-description`.

```ejercicio
# Enunciado
Completa la opción que evita los metafiles de playlist.

# Plantilla
print("___")

# Esperado
--no-write-playlist-metafiles

# Pista
Niega directamente la opción anterior.
```

# Cierre

La escritura de metadatos puede ocurrir en dos niveles: vídeo y playlist.
yt-dlp escribe los metafiles de playlist por defecto cuando corresponde, y la
opción negativa permite suprimirlos.

La sesión siguiente controla cuántos campos internos permanecen dentro del
info JSON.
