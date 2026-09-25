---
numero: 27
titulo: "Aplicar límites de tamaño desde Python"
---

# Construir los límites de tamaño de archivo desde Python

Las opciones de selección pueden componerse en Python antes de iniciar una descarga. Mantener el filtro, rango o límite como elemento de la lista evita que operadores como `&`, `:` o `<` dependan del quoting de un shell.

```python
argumentos = ["--min-filesize", "10M", "--max-filesize", "500M", "https://media.example/video"]
print(" ".join(comando_yt_dlp(*argumentos)[3:]))
```

```salida
--min-filesize 10M --max-filesize 500M https://media.example/video
```

> Doc: [yt-dlp — Video Selection](https://github.com/yt-dlp/yt-dlp#video-selection)

```ejercicio
# Enunciado
Completa la opción principal de esta selección.

# Plantilla
argumentos = ["___", "10M", "--max-filesize", "500M", "https://media.example/video"]
print(" ".join(comando_yt_dlp(*argumentos)[3:]))

# Esperado
--min-filesize 10M --max-filesize 500M https://media.example/video

# Pista
La opción corresponde al criterio desarrollado en esta sesión.
```


# --min-filesize

`--min-filesize SIZE` aborta la descarga cuando el tamaño del archivo es menor
que el límite indicado.

El README muestra valores como `50k` y `44.6M`, de modo que `SIZE` no está
restringido a enteros sin unidad.

> Doc: [Video Selection — --min-filesize](https://github.com/yt-dlp/yt-dlp#video-selection)

```ejercicio
# Enunciado
Completa la opción que exige un tamaño mínimo.

# Plantilla
print("yt-dlp " + "___" + " 50k")

# Esperado
yt-dlp --min-filesize 50k

# Pista
La opción comienza con `--min-`.
```

# --max-filesize

`--max-filesize SIZE` aborta la descarga cuando el tamaño supera el límite.

```bash !sin-consola
yt-dlp --max-filesize 100M "URL"
```

> Doc: [Video Selection — --max-filesize](https://github.com/yt-dlp/yt-dlp#video-selection)

```ejercicio
# Enunciado
Completa la opción que establece un tamaño máximo.

# Plantilla
opcion = "--___-filesize"
print(opcion)

# Esperado
--max-filesize

# Pista
La palabra que falta significa «máximo».
```

# El límite decide si continúa la descarga

Estas opciones no recodifican el archivo para hacerlo caber. Comparan el tamaño
con la condición indicada y abortan cuando la condición no se cumple.

```opcion-multiple
# Enunciado
¿Qué hace --max-filesize según el README?

# Opciones
- Reduce automáticamente la resolución
- Comprime el archivo hasta el límite
- Aborta si el archivo es mayor que SIZE
- Divide el archivo en partes

# Correcta
3

# Explicación
La opción impone una condición de tamaño; no transforma el contenido para reducirlo.

# Pista
El verbo usado por la documentación es «Abort».
```

# Mínimo y máximo pueden expresar una ventana

Cuando ambas condiciones se usan en una misma invocación, el archivo debe
respetar los dos límites para que la selección continúe.

```python
minimo = "10M"
maximo = "100M"
opciones = ["--min-filesize", minimo, "--max-filesize", maximo]
print(" ".join(opciones))
```

```salida
--min-filesize 10M --max-filesize 100M
```

# Cierre con Python

Python dejó los límites de tamaño de archivo encapsulada en una lista de argumentos reutilizable y sin interpolación de shell.


`--min-filesize` rechaza archivos demasiado pequeños y `--max-filesize`
rechaza archivos demasiado grandes. Ninguna de las dos opciones cambia el
contenido para modificar su tamaño.

La sesión siguiente filtra por fecha de publicación.
