---
numero: 71
titulo: "Pistas, artistas, álbumes y discos"
---

# track, track_number y track_id

Título, número e identificador de pista.

# artists y artist

Lista de artistas y versión separada por comas.

# genres y genre

Lista de géneros y versión separada por comas.

# composers y composer

Lista de compositores y versión separada por comas.

# album

Título del álbum.

# album_type

Tipo de álbum.

# album_artists y album_artist

Lista de artistas del álbum y versión separada por comas.

# disc_number

Número de disco u otro medio físico.

> Doc: [Output Template — music fields](https://github.com/yt-dlp/yt-dlp#output-template)

```ejercicio
# Enunciado
Completa el campo que contiene una lista de artistas.

# Plantilla
print("%(___)s")

# Esperado
%(artists)s

# Pista
Está en plural.
```

```ejercicio
# Enunciado
Completa el campo de número de disco.

# Plantilla
print("%(___)s")

# Esperado
%(disc_number)s

# Pista
Combina disc y number.
```

# Cierre

La sesión siguiente cubre campos condicionales que solo existen en determinadas etapas u opciones.
\n\n```ejercicio
# Enunciado
Completa el campo que contiene una lista de artistas.

# Plantilla
print("%(___)s")

# Esperado
%(artists)s

# Pista
Está en plural.
```\n\n```ejercicio
# Enunciado
Completa el campo que contiene una lista de artistas.

# Plantilla
print("%(___)s")

# Esperado
%(artists)s

# Pista
Está en plural.
```

```ejercicio
# Enunciado
Completa el campo de número de disco.

# Plantilla
print("%(___)s")

# Esperado
%(disc_number)s

# Pista
Combina disc y number.
```