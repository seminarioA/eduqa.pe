---
numero: 20
titulo: "Aplicar aliases y presets desde Python"
---

# Construir un preset incorporado desde Python

En Python, cada opción y cada valor se mantienen como elementos independientes de una lista. `comando_yt_dlp()` añade el intérprete y el módulo de yt-dlp; de este modo no es necesario concatenar una orden para que después la interprete un shell.

```python
argumentos = ["-t", "mp3", "https://media.example/video"]
comando = comando_yt_dlp(*argumentos)
print(" ".join(comando[3:]))
```

```salida
-t mp3 https://media.example/video
```

> Doc: [yt-dlp — opción documentada](https://github.com/yt-dlp/yt-dlp#preset-aliases)

```ejercicio
# Enunciado
Completa la primera opción de esta invocación.

# Plantilla
argumentos = ["___", "mp3", "https://media.example/video"]
print(" ".join(comando_yt_dlp(*argumentos)[3:]))

# Esperado
-t mp3 https://media.example/video

# Pista
La opción aparece en el título del punto principal de esta sesión.
```


# --alias

`--alias ALIASES OPTIONS` crea nombres nuevos que se expanden a una cadena de
opciones. Si un alias no empieza con guion, yt-dlp le antepone `--`.

Un alias no introduce una capacidad nueva: reutiliza opciones que ya existen
bajo otro nombre.

> Doc: [General Options — --alias](https://github.com/yt-dlp/yt-dlp#general-options)

```ejercicio
# Enunciado
Completa la opción que define aliases.

# Plantilla
print("yt-dlp " + "___")

# Esperado
yt-dlp --alias

# Pista
La opción usa la misma palabra `alias`.
```

# Varios nombres para el mismo alias

El argumento `ALIASES` puede contener varios nombres. El ejemplo oficial crea
`--get-audio` y `-X` para la misma expansión.

La coma separa nombres dentro del argumento de aliases.

```python
aliases = "get-audio,-X"
print(aliases.split(","))
```

```salida
['get-audio', '-X']
```

```ejercicio
# Enunciado
Completa el separador entre dos nombres de alias.

# Plantilla
print("get-audio___-X")

# Esperado
get-audio,-X

# Pista
Los nombres se separan con coma.
```

# Argumentos con formato de Python

Los argumentos de alias se interpretan con el mini-lenguaje de formato de
cadenas de Python. El ejemplo del README utiliza `{0}` para insertar el primer
argumento recibido por el alias en distintos puntos de su expansión.

```python
plantilla = "-x --audio-format {0}"
print(plantilla.format("m4a"))
```

```salida
-x --audio-format m4a
```

> Doc: [General Options — --alias](https://github.com/yt-dlp/yt-dlp#general-options)

```ejercicio
# Enunciado
Completa el índice del primer argumento en una plantilla de formato de Python.

# Plantilla
plantilla = "-x --audio-format {___}"
print(plantilla.format("m4a"))

# Esperado
-x --audio-format m4a

# Pista
Los índices posicionales empiezan en cero.
```

# Evitar aliases recursivos

Un alias puede activar otros aliases. El README advierte que deben evitarse
definiciones recursivas y establece como medida de seguridad un máximo de 100
activaciones para cada alias.

Ese límite no convierte una definición recursiva en una buena configuración;
solo acota el daño de la expansión.

# -t y --preset-alias

`-t` es la forma corta de `--preset-alias`. Aplica un conjunto de opciones
predefinido por yt-dlp.

Los presets documentados actualmente son `mp3`, `aac`, `mp4`, `mkv` y
`sleep`.

```bash !sin-consola
yt-dlp -t mp3 "URL"
```

> Doc: [Preset Aliases](https://github.com/yt-dlp/yt-dlp#preset-aliases)

```ejercicio
# Enunciado
Completa la forma corta que aplica el preset mp3.

# Plantilla
print("yt-dlp " + "___" + " mp3")

# Esperado
yt-dlp -t mp3

# Pista
La opción corta tiene una sola letra.
```

# Preset y alias personalizado no son lo mismo

`--alias` define una expansión nueva durante la configuración. `--preset-alias`
aplica una expansión que ya viene definida por yt-dlp.

`--compat-options` también aparece entre las opciones generales, pero no es un
alias: restaura comportamientos históricos. Se estudia en el nivel avanzado
junto con las diferencias frente a youtube-dl y youtube-dlc.

# Cierre con Python

Python dejó un preset incorporado representada como una lista explícita de argumentos que puede reutilizarse, validarse o ejecutarse con `ejecutar_yt_dlp()`.


Los aliases crean nombres nuevos para cadenas de opciones y pueden recibir
argumentos; los presets aplican conjuntos predefinidos. Ninguno añade una
operación que no exista ya en las opciones expandidas.

La sesión siguiente comienza las opciones de red con proxy y timeout.
