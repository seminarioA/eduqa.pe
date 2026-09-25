---
numero: 11
titulo: "Enumerar y limitar extractores desde Python"
---

# Construir la selección de extractores desde Python

En Python, cada opción y cada valor se mantienen como elementos independientes de una lista. `comando_yt_dlp()` añade el intérprete y el módulo de yt-dlp; de este modo no es necesario concatenar una orden para que después la interprete un shell.

```python
argumentos = ["--list-extractors"]
comando = comando_yt_dlp(*argumentos)
print(" ".join(comando[3:]))
```

```salida
--list-extractors
```

> Doc: [yt-dlp — opción documentada](https://github.com/yt-dlp/yt-dlp#general-options)

```ejercicio
# Enunciado
Completa la primera opción de esta invocación.

# Plantilla
argumentos = ["___"]
print(" ".join(comando_yt_dlp(*argumentos)[3:]))

# Esperado
--list-extractors

# Pista
La opción aparece en el título del punto principal de esta sesión.
```


# --list-extractors

`--list-extractors` imprime los extractores soportados por la instalación y
termina. Es la fuente local para conocer los nombres que después acepta
`--use-extractors`.

```bash !sin-consola
yt-dlp --list-extractors
```

> Doc: [General Options — --list-extractors](https://github.com/yt-dlp/yt-dlp#general-options)

```ejercicio
# Enunciado
Completa la opción que enumera los extractores disponibles.

# Plantilla
print("yt-dlp " + "___")

# Esperado
yt-dlp --list-extractors

# Pista
Empieza con `--list-`.
```

# --extractor-descriptions

`--extractor-descriptions` imprime descripciones de todos los extractores
soportados y termina. La lista de nombres y la lista de descripciones son
consultas diferentes.

> Doc: [General Options — --extractor-descriptions](https://github.com/yt-dlp/yt-dlp#general-options)

```ejercicio
# Enunciado
Completa la opción que solicita descripciones de extractores.

# Plantilla
opcion = "--extractor-___"
print(opcion)

# Esperado
--extractor-descriptions

# Pista
El sustantivo que falta es «descripciones» en inglés.
```

# --use-extractors

`--use-extractors NAMES` limita los extractores que yt-dlp puede utilizar.
`NAMES` admite nombres separados por comas, expresiones regulares y los
valores especiales `all`, `default` y `end`.

La opción también tiene el alias `--ies`.

```bash !sin-consola
yt-dlp --use-extractors "youtube,generic" "URL"
```

> Doc: [General Options — --use-extractors](https://github.com/yt-dlp/yt-dlp#general-options)

```ejercicio
# Enunciado
Completa el separador que permite indicar dos extractores en NAMES.

# Plantilla
nombres = "youtube___generic"
print(nombres)

# Esperado
youtube,generic

# Pista
Los nombres se separan con una coma.
```

# Excluir un extractor

Dentro de `NAMES`, un nombre precedido por guion (`-`) se excluye. El
ejemplo del README `default,-generic` conserva el conjunto predeterminado y
retira el extractor genérico.

```python
seleccion = "default,-generic"
print(seleccion.split(","))
```

```salida
['default', '-generic']
```

```ejercicio
# Enunciado
Completa el prefijo que excluye el extractor generic.

# Plantilla
seleccion = "default,___generic"
print(seleccion)

# Esperado
default,-generic

# Pista
La exclusión usa un solo guion.
```

# end y el final del matching

El valor especial `end` detiene el matching de URLs en el punto donde aparece
dentro de la especificación de extractores. El README lo muestra en una
selección como `holodex.*,end,youtube`.

Este valor forma parte del lenguaje de `--use-extractors`; no es el nombre de
un sitio.

# Cierre con Python

Python dejó la selección de extractores representada como una lista explícita de argumentos que puede reutilizarse, validarse o ejecutarse con `ejecutar_yt_dlp()`.


`--list-extractors` obtiene nombres, `--extractor-descriptions` obtiene
descripciones y `--use-extractors` controla cuáles participan en el matching.
La selección admite listas, regex, conjuntos especiales y exclusiones.

La sesión siguiente define qué hace yt-dlp cuando la entrada no es una URL
calificada.
