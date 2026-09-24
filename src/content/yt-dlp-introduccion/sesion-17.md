---
numero: 17
titulo: "Extracción plana de playlists"
---

# --flat-playlist

`--flat-playlist` evita extraer las entradas URL de una playlist de manera
completa. Como consecuencia, algunos metadatos de cada entrada pueden faltar y
la descarga puede omitirse.

La opción modifica la profundidad de extracción, no el orden de una playlist.

> Doc: [General Options — --flat-playlist](https://github.com/yt-dlp/yt-dlp#general-options)

```ejercicio
# Enunciado
Completa la opción que mantiene las entradas de una playlist en extracción plana.

# Plantilla
opcion = "___"
print(opcion)

# Esperado
--flat-playlist

# Pista
La palabra `flat` significa «plano».
```

# Metadatos incompletos

Al no resolver completamente cada entrada, la representación plana puede no
contener campos que solo se conocen al abrir la página o recurso del vídeo.

Por eso un flujo que depende de metadatos completos no debe asumir que
`--flat-playlist` produce la misma información que una extracción completa.

```opcion-multiple
# Enunciado
¿Qué consecuencia documenta el README para --flat-playlist?

# Opciones
- Garantiza todos los metadatos de cada entrada
- Puede dejar metadatos de entrada ausentes
- Convierte cada vídeo a audio
- Ordena la playlist alfabéticamente

# Correcta
2

# Explicación
La extracción plana no resuelve completamente las entradas y algunos metadatos pueden faltar.

# Pista
La opción reduce la profundidad de extracción.
```

# --no-flat-playlist

`--no-flat-playlist` fuerza la extracción completa de los vídeos de una
playlist y es el comportamiento predeterminado documentado.

```ejercicio
# Enunciado
Completa la opción que restaura la extracción completa de los vídeos de una playlist.

# Plantilla
print("yt-dlp " + "___")

# Esperado
yt-dlp --no-flat-playlist

# Pista
Es la negación directa de --flat-playlist.
```

# Cierre

`--flat-playlist` evita resolver completamente cada entrada y puede perder
metadatos; `--no-flat-playlist` realiza la extracción completa y es el valor
predeterminado.

La sesión siguiente trata los directos y las emisiones programadas.
