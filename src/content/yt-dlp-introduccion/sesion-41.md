---
numero: 41
titulo: "Crear batch files con Python"
---

# Crear el archivo de URLs con pathlib

`Path.write_text()` permite generar desde Python el archivo que después consume `--batch-file`. Cada URL ocupa una línea y el archivo puede versionarse o producirse dinámicamente.

```python
from pathlib import Path

contenido = "https://media.example/a\nhttps://media.example/b\n"
ruta = Path("urls.txt")
print(contenido.count("\n"))
```

```salida
2
```

> Doc: [Filesystem Options — --batch-file](https://github.com/yt-dlp/yt-dlp#filesystem-options)
> Doc: [Path.write_text()](https://docs.python.org/3/library/pathlib.html#pathlib.Path.write_text)

```ejercicio
# Enunciado
Completa el nombre del archivo que recibirá las URLs.

# Plantilla
from pathlib import Path
ruta = Path("___")
print(ruta.name)

# Esperado
urls.txt

# Pista
Usa un archivo de texto llamado urls.txt.
```


# -a y --batch-file

`-a` es la forma corta de `--batch-file`. La opción recibe un archivo que
contiene URLs, una por línea.

Esto permite separar la lista de entradas de la línea de órdenes.

> Doc: [Filesystem Options — --batch-file](https://github.com/yt-dlp/yt-dlp#filesystem-options)

```ejercicio
# Enunciado
Completa la forma corta que lee URLs desde urls.txt.

# Plantilla
print("yt-dlp " + "___" + " urls.txt")

# Esperado
yt-dlp -a urls.txt

# Pista
La forma corta es una a minúscula.
```

# Una URL por línea

Cada línea útil representa una entrada independiente.

```python
contenido = """https://media.example/a
https://media.example/b"""
urls = contenido.splitlines()
print(len(urls))
```

```salida
2
```

```ejercicio
# Enunciado
Completa el método que separa un texto en líneas.

# Plantilla
texto = "a\nb"
print(texto.___())

# Esperado
['a', 'b']

# Pista
El método termina en `lines`.
```

# Líneas de comentario

El README considera comentarios las líneas que empiezan con `#`, `;` o
`]`. Esas líneas se ignoran y no se interpretan como URLs.

```python
lineas = ["# comentario", "; otro", "] metadata", "https://media.example/a"]
urls = [linea for linea in lineas if not linea.startswith(("#", ";", "]"))]
print(urls)
```

```salida
['https://media.example/a']
```

> Doc: [Filesystem Options — --batch-file](https://github.com/yt-dlp/yt-dlp#filesystem-options)

```ejercicio
# Enunciado
Completa el tercer prefijo de comentario documentado.

# Plantilla
prefijos = ("#", ";", "___")
print(prefijos)

# Esperado
('#', ';', ']')

# Pista
Es un corchete de cierre.
```

# El valor - usa stdin

Como argumento de `--batch-file`, el valor `-` lee las URLs desde la entrada
estándar.

```ejercicio
# Enunciado
Completa el valor especial que hace que --batch-file lea desde stdin.

# Plantilla
print("--batch-file " + "___")

# Esperado
--batch-file -

# Pista
Es un único guion.
```

# --no-batch-file

`--no-batch-file` desactiva la lectura desde un batch file y es el
comportamiento predeterminado.

```ejercicio
# Enunciado
Completa la opción predeterminada que no lee URLs desde un archivo por lotes.

# Plantilla
print("___")

# Esperado
--no-batch-file

# Pista
Niega directamente --batch-file.
```

# Cierre con Python

Python ya puede producir el archivo de entrada de --batch-file antes de construir la invocación de yt-dlp.


`--batch-file` mueve las entradas a un archivo o a stdin. Cada URL ocupa una
línea y los prefijos `#`, `;` y `]` identifican comentarios.

La sesión siguiente decide en qué directorios se guardan archivos finales e
intermedios.
