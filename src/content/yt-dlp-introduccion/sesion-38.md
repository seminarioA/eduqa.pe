---
numero: 38
titulo: "Orden aleatorio y playlists perezosas"
---

# --playlist-random

`--playlist-random` descarga los vídeos de una playlist en orden aleatorio.

La opción modifica el orden de procesamiento; no selecciona una muestra ni
reduce la cantidad por sí sola.

> Doc: [Download Options — --playlist-random](https://github.com/yt-dlp/yt-dlp#download-options)

```ejercicio
# Enunciado
Completa la opción que procesa una playlist en orden aleatorio.

# Plantilla
print("yt-dlp " + "___")

# Esperado
yt-dlp --playlist-random

# Pista
La última palabra es `random`.
```

# --lazy-playlist

`--lazy-playlist` procesa entradas conforme se reciben, sin esperar a que toda
la playlist haya sido analizada.

El adjetivo **lazy** describe evaluación diferida: una entrada se consume cuando
está disponible en lugar de materializar previamente la colección completa.

> Doc: [Download Options — --lazy-playlist](https://github.com/yt-dlp/yt-dlp#download-options)

```ejercicio
# Enunciado
Completa la opción que procesa entradas a medida que se reciben.

# Plantilla
opcion = "--___-playlist"
print(opcion)

# Esperado
--lazy-playlist

# Pista
La palabra que falta es `lazy`.
```

# Consecuencias de lazy

El README especifica que `--lazy-playlist` desactiva `n_entries`,
`--playlist-random` y `--playlist-reverse`.

La razón operacional es que esas capacidades necesitan conocer propiedades o el
orden del conjunto completo antes de procesarlo.

```opcion-multiple
# Enunciado
¿Qué opción queda desactivada por --lazy-playlist según el README?

# Opciones
- --proxy
- --playlist-random
- --write-subs
- --format

# Correcta
2

# Explicación
El modo lazy procesa entradas conforme llegan y desactiva operaciones que requieren el conjunto completo, incluida --playlist-random.

# Pista
Busca otra opción que opera sobre el orden completo de la playlist.
```

# --no-lazy-playlist

`--no-lazy-playlist` espera a que la playlist completa sea analizada antes de
procesar sus vídeos. Es el comportamiento predeterminado.

```ejercicio
# Enunciado
Completa la opción predeterminada de procesamiento no perezoso.

# Plantilla
print("___")

# Esperado
--no-lazy-playlist

# Pista
Niega --lazy-playlist.
```

# Cierre

`--playlist-random` cambia el orden. `--lazy-playlist` cambia cuándo se
empiezan a procesar las entradas y, por esa razón, desactiva operaciones que
requieren la playlist completa.

La sesión siguiente cubre el contenedor HLS durante descarga y la selección de
secciones.