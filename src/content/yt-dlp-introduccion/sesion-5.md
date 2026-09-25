---
numero: 5
titulo: "Verificar Python, FFmpeg y ffprobe desde Python"
---

# Detectar ejecutables externos con shutil

`shutil.which()` busca un ejecutable usando las rutas configuradas en `PATH`. Esta comprobación permite detectar FFmpeg y ffprobe antes de iniciar un flujo que dependa de ellos.

```python
import shutil

herramientas = {
    "ffmpeg": shutil.which("ffmpeg"),
    "ffprobe": shutil.which("ffprobe"),
}
print(set(herramientas))
```

```salida
{'ffmpeg', 'ffprobe'}
```

> Doc: [Dependencies](https://github.com/yt-dlp/yt-dlp#dependencies)
> Doc: [shutil.which()](https://docs.python.org/3/library/shutil.html#shutil.which)

```ejercicio
# Enunciado
Completa la función que busca ffmpeg en PATH.

# Plantilla
import shutil
ruta = shutil.___("ffmpeg")
print(ruta is None or isinstance(ruta, str))

# Esperado
True

# Pista
La función pregunta qué ejecutable resolvería el sistema.
```


# Versiones de Python soportadas

El README actual declara soporte para CPython 3.10 o posterior y PyPy 3.11 o
posterior. Otras versiones o implementaciones pueden funcionar, pero el proyecto
no promete el mismo comportamiento.

Cuando se usa un artefacto que necesita Python o una instalación mediante
`pip`, esta restricción forma parte del entorno de ejecución.

> Doc: [Dependencies](https://github.com/yt-dlp/yt-dlp#dependencies)

```python
import sys

version = sys.version_info
print(version.major >= 3)
```

```salida
True
```

```ejercicio
# Enunciado
Completa la versión mínima de CPython que el README actual declara soportada.

# Plantilla
version_minima = (3, ___)
print(version_minima)

# Esperado
(3, 10)

# Pista
Es la primera versión de CPython indicada en Dependencies.
```

# FFmpeg y ffprobe

El README clasifica `ffmpeg` y `ffprobe` como dependencias fuertemente
recomendadas. yt-dlp necesita FFmpeg para tareas como combinar archivos de vídeo
y audio separados y para distintos postprocesamientos.

`ffprobe` inspecciona información de streams y archivos multimedia. Ambos son
programas externos que yt-dlp puede invocar durante su procesamiento.

> Doc: [Dependencies — Strongly recommended](https://github.com/yt-dlp/yt-dlp#strongly-recommended)

```ejercicio
# Enunciado
Completa el nombre del programa que yt-dlp utiliza para combinar streams y realizar diversos postprocesamientos.

# Plantilla
dependencia = "___"
print(dependencia)

# Esperado
ffmpeg

# Pista
Empieza por dos letras f.
```

# El binario, no el paquete de Python

El README advierte expresamente que yt-dlp necesita el **binario** de FFmpeg, no
el paquete de Python llamado `ffmpeg`.

Instalar un módulo importable y disponer de un ejecutable en el sistema son
operaciones distintas. yt-dlp debe poder localizar el programa que ejecutará.

```python
from shutil import which

ruta = which("ffmpeg")
print(ruta is None or isinstance(ruta, str))
```

```salida
True
```

> Doc: [Dependencies — ffmpeg and ffprobe](https://github.com/yt-dlp/yt-dlp#strongly-recommended)

```ejercicio
# Enunciado
Completa la función estándar de Python que busca un ejecutable siguiendo el PATH.

# Plantilla
from shutil import which

resultado = ___("ffmpeg")
print(resultado is None or isinstance(resultado, str))

# Esperado
True

# Pista
La función importada desde `shutil` se llama `which`.
```

# Comprobar FFmpeg desde la terminal

`ffmpeg -version` y `ffprobe -version` permiten comprobar qué ejecutables
resuelven en el entorno. La salida concreta depende de la build instalada y no
se fija como salida de referencia.

```bash !sin-consola
ffmpeg -version
ffprobe -version
```

> Doc: [FFmpeg](https://ffmpeg.org/)

# Builds mantenidas por yt-dlp

El proyecto publica sus propias builds de FFmpeg en
`yt-dlp/FFmpeg-Builds`. El README señala que en el pasado incorporaban parches
para problemas habituales de yt-dlp y que actualmente son equivalentes al
upstream de FFmpeg.

La existencia de esas builds no cambia la función que cumple FFmpeg: sigue
siendo una dependencia externa ejecutada por yt-dlp.

> Doc: [yt-dlp/FFmpeg-Builds](https://github.com/yt-dlp/FFmpeg-Builds)

# Cierre con Python

Python puede comprobar previamente si FFmpeg y ffprobe están disponibles y decidir si una operación dependiente de ellos puede ejecutarse.


El entorno soportado parte de una versión compatible de Python cuando el
artefacto lo requiere. FFmpeg y ffprobe son ejecutables externos y habilitan
combinación de streams y postprocesamiento; instalar un paquete Python llamado
`ffmpeg` no sustituye esos binarios.

La sesión siguiente cubre la otra dependencia fuertemente recomendada:
`yt-dlp-ejs` y el motor JavaScript que necesita para ejecutarse.
