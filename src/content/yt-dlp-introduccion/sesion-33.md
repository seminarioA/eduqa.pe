---
numero: 33
titulo: "Límites y condiciones de corte"
---

# --max-downloads

`--max-downloads NUMBER` aborta el proceso después de descargar la cantidad de
archivos indicada.

La opción cuenta descargas realizadas; no selecciona índices concretos de una
playlist como `--playlist-items`.

> Doc: [Video Selection — --max-downloads](https://github.com/yt-dlp/yt-dlp#video-selection)

```ejercicio
# Enunciado
Completa la opción que detiene el proceso después de cinco descargas.

# Plantilla
print("yt-dlp " + "___" + " 5")

# Esperado
yt-dlp --max-downloads 5

# Pista
El nombre combina `max` y `downloads`.
```

# --break-on-existing

`--break-on-existing` detiene el proceso cuando encuentra un elemento que ya
figura en el archive indicado con `--download-archive`.

Sin archive no existe el registro que esta condición necesita consultar.

> Doc: [Video Selection — --break-on-existing](https://github.com/yt-dlp/yt-dlp#video-selection)

```ejercicio
# Enunciado
Completa la opción que detiene el proceso al encontrar un elemento existente en el archive.

# Plantilla
opcion = "--break-on-___"
print(opcion)

# Esperado
--break-on-existing

# Pista
La palabra que falta significa «existente».
```

# --no-break-on-existing

`--no-break-on-existing` evita esa detención y es el comportamiento
predeterminado.

```ejercicio
# Enunciado
Completa la opción predeterminada que continúa al encontrar un ID ya archivado.

# Plantilla
print("___")

# Esperado
--no-break-on-existing

# Pista
Niega la opción de ruptura anterior.
```

# --break-per-input

`--break-per-input` hace que `--max-downloads`, `--break-on-existing`,
`--break-match-filters` y `autonumber` reinicien su alcance para cada URL de
entrada.

La palabra **input** se refiere a cada URL suministrada a la invocación.

```ejercicio
# Enunciado
Completa la opción que reinicia las condiciones de corte por cada URL de entrada.

# Plantilla
print("yt-dlp " + "___")

# Esperado
yt-dlp --break-per-input

# Pista
El nombre termina en `per-input`.
```

# --no-break-per-input

`--no-break-per-input` hace que `--break-on-existing` y opciones similares
terminen la cola completa en lugar de limitar su efecto a una sola entrada.

```opcion-multiple
# Enunciado
¿Qué cambia --break-per-input?

# Opciones
- El codec de salida
- El alcance de varias condiciones de corte para que se reinicien por URL de entrada
- El directorio temporal
- La autenticación

# Correcta
2

# Explicación
La opción redefine el alcance de límites y rupturas para cada input URL.

# Pista
La parte `per-input` describe el alcance.
```

# --skip-playlist-after-errors

`--skip-playlist-after-errors N` define cuántos fallos se permiten antes de
saltar el resto de una playlist.

```ejercicio
# Enunciado
Completa la opción que permite tres fallos antes de saltar el resto de la playlist.

# Plantilla
print("yt-dlp " + "___" + " 3")

# Esperado
yt-dlp --skip-playlist-after-errors 3

# Pista
El nombre menciona `playlist` y `errors`.
```

# Cierre

`--max-downloads` limita una cantidad, `--break-on-existing` reacciona al
archive y `--skip-playlist-after-errors` reacciona a fallos. El modificador
`--break-per-input` cambia el alcance de varias condiciones de corte.

La sesión siguiente controla concurrencia y velocidad.