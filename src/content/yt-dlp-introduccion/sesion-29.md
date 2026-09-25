---
numero: 29
titulo: "Construir --match-filters con Python"
---

# Construir el filtro compuesto de metadatos desde Python

Las opciones de selección pueden componerse en Python antes de iniciar una descarga. Mantener el filtro, rango o límite como elemento de la lista evita que operadores como `&`, `:` o `<` dependan del quoting de un shell.

```python
argumentos = ["--match-filters", "duration > 60 & filesize < 500M", "https://media.example/video"]
print(" ".join(comando_yt_dlp(*argumentos)[3:]))
```

```salida
--match-filters duration > 60 & filesize < 500M https://media.example/video
```

> Doc: [yt-dlp — Video Selection](https://github.com/yt-dlp/yt-dlp#video-selection)

```ejercicio
# Enunciado
Completa la opción principal de esta selección.

# Plantilla
argumentos = ["___", "duration > 60 & filesize < 500M", "https://media.example/video"]
print(" ".join(comando_yt_dlp(*argumentos)[3:]))

# Esperado
--match-filters duration > 60 & filesize < 500M https://media.example/video

# Pista
La opción corresponde al criterio desarrollado en esta sesión.
```


# --match-filters

`--match-filters FILTER` aplica una condición genérica al vídeo. Los campos
disponibles proceden de los campos de `OUTPUT TEMPLATE` y pueden compararse
con números o cadenas mediante los operadores documentados para filtrado de
formatos.

Esta sesión introduce la estructura; los operadores de comparación se estudian
con detalle en el nivel intermedio junto con el lenguaje de formatos.

> Doc: [Video Selection — --match-filters](https://github.com/yt-dlp/yt-dlp#video-selection)

```ejercicio
# Enunciado
Completa la opción que recibe un filtro genérico.

# Plantilla
print("yt-dlp " + "___" + " !is_live")

# Esperado
yt-dlp --match-filters !is_live

# Pista
El nombre contiene `match` y `filters`.
```

# Comprobar presencia de un campo

Escribir únicamente el nombre de un campo comprueba que el campo esté presente.
Anteponer el signo de exclamación (`!`) comprueba que el campo no esté
presente.

El ejemplo oficial `!is_live` rechaza la condición de presencia de
`is_live`.

```python
campo = "is_live"
ausencia = "!" + campo
print(ausencia)
```

```salida
!is_live
```

```ejercicio
# Enunciado
Completa el operador que comprueba la ausencia de un campo.

# Plantilla
print("___" + "is_live")

# Esperado
!is_live

# Pista
Se usa el signo de exclamación.
```

# & combina condiciones

El ampersand (`&`) combina varias condiciones dentro del mismo filtro.

Como `&` y las comillas pueden tener significado para el shell, el README
explica que pueden escaparse cuando sea necesario.

```python
condiciones = ["like_count>?100", "description~='cats'"]
print(" & ".join(condiciones))
```

```salida
like_count>?100 & description~='cats'
```

```ejercicio
# Enunciado
Completa el operador que combina dos condiciones dentro de un mismo filtro.

# Plantilla
print("like_count>?100 " + "___" + " description~='cats'")

# Esperado
like_count>?100 & description~='cats'

# Pista
Es el ampersand.
```

# Repetir --match-filters crea una alternativa

Cuando `--match-filters` se especifica varias veces, el README indica que el
vídeo coincide si **al menos uno** de los filtros se cumple.

Esto es distinto de usar `&` dentro de un filtro: `&` exige conjuntamente
las condiciones de ese filtro; repetir la opción crea alternativas entre
filtros.

```opcion-multiple
# Enunciado
¿Qué ocurre cuando --match-filters se repite?

# Opciones
- Deben cumplirse todos los filtros repetidos
- Coincide si se cumple al menos uno de los filtros
- Solo se utiliza el último filtro
- Los filtros se convierten en nombres de archivo

# Correcta
2

# Explicación
La documentación define las apariciones repetidas como alternativas: basta con que una coincida.

# Pista
Distingue repetir la opción de unir condiciones con &.
```

# El valor - activa una pregunta interactiva

`--match-filters -` hace que yt-dlp pregunte de forma interactiva si debe
descargar cada vídeo.

El guion es un valor especial de `FILTER`; no significa stdin en esta opción.

```ejercicio
# Enunciado
Completa el valor especial que pregunta interactivamente por cada vídeo.

# Plantilla
print("--match-filters " + "___")

# Esperado
--match-filters -

# Pista
Es un único guion.
```

# --no-match-filters

`--no-match-filters` elimina los filtros de coincidencia y es el comportamiento
predeterminado.

# Cierre con Python

Python dejó el filtro compuesto de metadatos encapsulada en una lista de argumentos reutilizable y sin interpolación de shell.


`--match-filters` filtra mediante campos y expresiones. `!` comprueba
ausencia, `&` combina condiciones y repetir la opción crea alternativas. El
nivel intermedio formalizará los operadores de comparación.

La sesión siguiente distingue un rechazo normal de un filtro que debe detener
todo el proceso.
