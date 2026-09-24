---
numero: 70
titulo: "Capítulos, series, temporadas y episodios"
---

# chapter

Título del capítulo lógico al que pertenece el vídeo.

# chapter_number

Número del capítulo.

# chapter_id

Identificador del capítulo.

# series y series_id

Título e identificador de serie o programa.

# season, season_number y season_id

Título, número e identificador de temporada.

# episode, episode_number y episode_id

Título, número e identificador del episodio.

> Doc: [Output Template — chapter and series fields](https://github.com/yt-dlp/yt-dlp#output-template)

```ejercicio
# Enunciado
Completa el campo numérico de episodio.

# Plantilla
print("%(___)s")

# Esperado
%(episode_number)s

# Pista
Combina episode y number.
```

```ejercicio
# Enunciado
Completa el identificador de temporada.

# Plantilla
print("%(___)s")

# Esperado
%(season_id)s

# Pista
Termina en _id.
```

# Cierre

La sesión siguiente cubre pistas, artistas, álbumes y discos.
\n\n```ejercicio
# Enunciado
Completa el campo numérico de episodio.

# Plantilla
print("%(___)s")

# Esperado
%(episode_number)s

# Pista
Combina episode y number.
```\n\n```ejercicio
# Enunciado
Completa el campo numérico de episodio.

# Plantilla
print("%(___)s")

# Esperado
%(episode_number)s

# Pista
Combina episode y number.
```

```ejercicio
# Enunciado
Completa el identificador de temporada.

# Plantilla
print("%(___)s")

# Esperado
%(season_id)s

# Pista
Termina en _id.
```