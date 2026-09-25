---
numero: 17
titulo: "Extraer playlists en modo plano desde Python"
---

# Construir la extracción plana de playlists desde Python

En Python, cada opción y cada valor se mantienen como elementos independientes de una lista. `comando_yt_dlp()` añade el intérprete y el módulo de yt-dlp; de este modo no es necesario concatenar una orden para que después la interprete un shell.

```python
argumentos = ["--flat-playlist", "https://media.example/playlist"]
comando = comando_yt_dlp(*argumentos)
print(" ".join(comando[3:]))
```

```salida
--flat-playlist https://media.example/playlist
```

> Doc: [yt-dlp — opción documentada](https://github.com/yt-dlp/yt-dlp#general-options)

```ejercicio
# Enunciado
Completa la primera opción de esta invocación.

# Plantilla
argumentos = ["___", "https://media.example/playlist"]
print(" ".join(comando_yt_dlp(*argumentos)[3:]))

# Esperado
--flat-playlist https://media.example/playlist

# Pista
La opción aparece en el título del punto principal de esta sesión.
```


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

# Cierre con Python

Python dejó la extracción plana de playlists representada como una lista explícita de argumentos que puede reutilizarse, validarse o ejecutarse con `ejecutar_yt_dlp()`.


`--flat-playlist` evita resolver completamente cada entrada y puede perder
metadatos; `--no-flat-playlist` realiza la extracción completa y es el valor
predeterminado.

La sesión siguiente trata los directos y las emisiones programadas.
