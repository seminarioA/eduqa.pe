---
numero: 1
titulo: "Ejecutar yt-dlp desde Python"
---

# La primera invocación desde Python

El curso invoca yt-dlp como módulo de Python mediante `sys.executable -m yt_dlp`. Este patrón utiliza el mismo intérprete que ejecuta el programa y evita depender de que un ejecutable llamado `yt-dlp` esté disponible en `PATH`.

`comando_yt_dlp()`, definido en el preludio del curso, recibe cada opción y cada URL como un argumento independiente.

```python
comando = comando_yt_dlp("https://media.example/video")
print(" ".join(comando[1:]))
```

```salida
-m yt_dlp https://media.example/video
```

> Doc: [Embedding yt-dlp](https://github.com/yt-dlp/yt-dlp#embedding-yt-dlp)

```ejercicio
# Enunciado
Completa la URL entregada a comando_yt_dlp().

# Plantilla
comando = comando_yt_dlp("___")
print(" ".join(comando[1:]))

# Esperado
-m yt_dlp https://media.example/video

# Pista
La URL es el único argumento de entrada de esta invocación.
```


# Qué es yt-dlp

yt-dlp es un programa de línea de órdenes para descargar audio y vídeo. El proyecto
lo describe como un descargador con soporte para miles de sitios y lo mantiene como
un fork de `youtube-dl`, basado a su vez en `youtube-dlc`.

La palabra **CLI** significa *command-line interface*, «interfaz de línea de
órdenes». En **Introducción a yt-dlp con Python**, una invocación de yt-dlp es un
proceso iniciado desde una terminal: el programa recibe opciones y una o más
entradas, procesa esas entradas y termina con un código de salida.

Python se utiliza como lenguaje de práctica para representar comandos, listas de
argumentos y pequeñas transformaciones de datos. La CLI sigue siendo el objeto
principal de este nivel; la integración directa mediante la API de Python se
desarrolla en el nivel avanzado.

> Doc: [yt-dlp — README](https://github.com/yt-dlp/yt-dlp#readme)

```ejercicio
# Enunciado
Completa el nombre del ejecutable que inicia yt-dlp desde una terminal.

# Plantilla
programa = "___"
print(programa)

# Esperado
yt-dlp

# Pista
Es el mismo nombre del proyecto y contiene un guion.
```

# La forma mínima de una invocación

El README expresa el uso general como `yt-dlp [OPTIONS] URL [URL...]`.
`OPTIONS` representa opciones de la línea de órdenes; `URL` representa una
entrada; y `[URL...]` indica que la misma invocación puede recibir más de una.

La forma mínima que procesa una sola URL es:

```bash !sin-consola
yt-dlp "https://www.youtube.com/watch?v=BaW_jenozKc"
```

Este bloque no se ejecuta dentro de EDUQA porque requiere acceso a red y porque el
resultado depende del estado actual del servicio remoto.

> Doc: [Usage and Options](https://github.com/yt-dlp/yt-dlp#usage-and-options)

```ejercicio
# Enunciado
Completa la función para construir la invocación mínima con una URL.

# Plantilla
def comando(url):
    return ["___", url]

print(" ".join(comando("https://media.example/video")))
 
# Esperado
yt-dlp https://media.example/video

# Pista
El primer elemento de la lista es el ejecutable.
```

# Más de una URL

El sufijo `[URL...]` de la sintaxis documentada significa que una invocación puede
recibir varias entradas. Cada URL sigue siendo un argumento separado; no se
concatenan varias direcciones dentro de una sola cadena.

```python
urls = [
    "https://media.example/video-1",
    "https://media.example/video-2",
]
comando = ["yt-dlp", *urls]
print(comando)
```

```salida
['yt-dlp', 'https://media.example/video-1', 'https://media.example/video-2']
```

> Doc: [Usage and Options](https://github.com/yt-dlp/yt-dlp#usage-and-options)

```ejercicio
# Enunciado
Completa el desempaquetado que añade cada URL como un argumento independiente.

# Plantilla
urls = ["https://media.example/a", "https://media.example/b"]
comando = ["yt-dlp", ___]
print(len(comando))

# Esperado
3

# Pista
Usa el operador que desempaqueta los elementos de una lista en otra lista.
```

# Opciones y argumentos

Una **opción** modifica el comportamiento del programa. En la documentación,
`--version`, `--help`, `--proxy`, `--format` y `--write-subs` son ejemplos
de opciones. Una URL, en cambio, es una entrada que yt-dlp debe procesar.

Esta distinción importa porque el curso desarrollará cada opción como una operación
separada antes de combinar varias en una misma invocación.

```python
argumentos = [
    "--format",
    "best",
    "https://media.example/video",
]
print(argumentos[0])
print(argumentos[2])
```

```salida
--format
https://media.example/video
```

> Doc: [Usage and Options](https://github.com/yt-dlp/yt-dlp#usage-and-options)

```ejercicio
# Enunciado
Completa la opción que el README usa para seleccionar un formato.

# Plantilla
opcion = "___"
print(opcion)

# Esperado
--format

# Pista
Es la forma larga de la opción abreviada `-f`.
```

# El sitio determina el extractor

yt-dlp incluye extractores para reconocer y obtener información de los sitios
compatibles. La lista exacta cambia con el proyecto, por eso no se memoriza una
cantidad fija: el repositorio mantiene `supportedsites.md` y la propia CLI puede
enumerar los extractores instalados.

Una URL admitida no significa que un sitio permanecerá sin cambios. Los servicios
remotos pueden modificar sus páginas, APIs o mecanismos de entrega; por eso el
estado de un extractor depende también de la versión de yt-dlp utilizada.

> Doc: [Supported sites](https://github.com/yt-dlp/yt-dlp/blob/master/supportedsites.md)
> Doc: [General Options — --list-extractors](https://github.com/yt-dlp/yt-dlp#general-options)

```ejercicio
# Enunciado
Completa la opción que solicita a yt-dlp la lista de extractores disponibles.

# Plantilla
comando = ["yt-dlp", "___"]
print(" ".join(comando))

# Esperado
yt-dlp --list-extractors

# Pista
La opción comienza con `--list-`.
```

# El recorrido del curso

La documentación separa instalación, opciones de uso, configuración, plantillas de
salida, selección de formatos, modificación de metadatos, argumentos de extractores,
plugins, uso desde Python, diferencias con youtube-dl y contribución. La ruta de
EDUQA conserva esa cobertura, pero distribuye cada operación en puntos y sesiones
más pequeños para que cada opción tenga explicación, ejemplo y práctica propios.

**Introducción a yt-dlp con Python** empieza por instalación y operación cotidiana
de la CLI, usando Python en las prácticas para construir y razonar sobre comandos.
El nivel intermedio profundiza en selección, transformación y configuración. El
nivel avanzado cubre extensibilidad, API de Python, plugins, compatibilidad y
desarrollo.

> Doc: [Índice del README de yt-dlp](https://github.com/yt-dlp/yt-dlp#readme)

# Cierre con Python

Python quedó establecido como la capa de automatización de la CLI: cada URL y cada opción se representan como elementos separados de una lista de argumentos.


Una invocación mínima tiene la forma `yt-dlp URL`; la CLI admite varias URLs y
opciones que modifican el procesamiento. Python permite representar esas
invocaciones de forma explícita y verificable durante las prácticas. Los extractores
determinan qué entradas puede interpretar la versión instalada.

La sesión siguiente instala yt-dlp mediante los métodos oficiales y comprueba qué
ejecutable queda disponible en el sistema.
