---
numero: 2
titulo: "Instalar yt-dlp"
---

# Tres vías de instalación

El README documenta tres vías generales para obtener yt-dlp: usar uno de los
binarios publicados por el proyecto, instalar el paquete con `pip` o recurrir
a un gestor de paquetes de terceros. Las dos primeras dependen directamente de
artefactos publicados por yt-dlp; la tercera depende además del ciclo de
actualización del gestor elegido.

No son tres formas de ejecutar lo mismo dentro de Python. El binario expone un
ejecutable listo para invocarse desde la terminal; la instalación con `pip`
instala el paquete de Python y su punto de entrada de línea de órdenes.

> Doc: [Installation](https://github.com/yt-dlp/yt-dlp#installation)

```ejercicio
# Enunciado
Completa el nombre del instalador de paquetes que el README documenta como una de las vías de instalación.

# Plantilla
metodo = "___"
print(metodo)

# Esperado
pip

# Pista
Tiene tres letras y forma parte de Python.
```

# El binario recomendado en Windows

Para Windows x64, el README recomienda `yt-dlp.exe`. Es un ejecutable
autónomo preparado para Windows 8 o posterior según la tabla actual de release
files.

Descargar un archivo no lo añade automáticamente al `PATH`. Si el directorio
que contiene `yt-dlp.exe` no forma parte del `PATH`, la terminal necesita la
ruta al ejecutable.

```python
from pathlib import PureWindowsPath

ejecutable = PureWindowsPath("C:/Tools/yt-dlp/yt-dlp.exe")
print(ejecutable.name)
```

```salida
yt-dlp.exe
```

> Doc: [Release Files — Recommended](https://github.com/yt-dlp/yt-dlp#release-files)

```ejercicio
# Enunciado
Completa el nombre del ejecutable recomendado por el proyecto para Windows x64.

# Plantilla
archivo = "___"
print(archivo)

# Esperado
yt-dlp.exe

# Pista
Es el nombre del proyecto seguido de la extensión de ejecutable de Windows.
```

# El binario recomendado en Linux y BSD

El archivo llamado `yt-dlp`, sin extensión, es un binario `zipimport`
independiente de la plataforma pero necesita una instalación de Python. El
README lo recomienda para Linux y BSD.

Que el archivo sea ejecutable y que Python esté disponible son condiciones
distintas. En sistemas Unix también puede ser necesario conceder permiso de
ejecución al archivo descargado.

```bash !sin-consola
chmod a+rx yt-dlp
./yt-dlp --version
```

> Doc: [Release Files — Recommended](https://github.com/yt-dlp/yt-dlp#release-files)

```ejercicio
# Enunciado
Completa el nombre del archivo recomendado para Linux y BSD.

# Plantilla
archivo = "___"
print(archivo)

# Esperado
yt-dlp

# Pista
No lleva extensión.
```

# El binario recomendado en macOS

El README recomienda `yt-dlp_macos` para macOS. La tabla actual lo describe
como un ejecutable universal para macOS 10.15 o posterior.

La palabra **universal** se refiere al artefacto distribuido por el proyecto; no
significa que cualquier versión histórica del sistema sea compatible.

```ejercicio
# Enunciado
Completa el nombre del archivo recomendado para macOS.

# Plantilla
archivo = "___"
print(archivo)

# Esperado
yt-dlp_macos

# Pista
Añade el nombre del sistema al nombre base mediante un guion bajo.
```

# Instalar el paquete con pip

La instalación mediante Python se realiza con `pip`. El proyecto publica
`yt-dlp` en PyPI.

Usar `python -m pip` vincula explícitamente `pip` con el intérprete de
Python que aparece al principio del comando. Esta forma evita depender de qué
ejecutable llamado `pip` resuelva primero el `PATH`.

```bash !sin-consola
python -m pip install -U "yt-dlp[default]"
```

`-m` indica a Python que ejecute un módulo. `-U` es la forma corta que
`pip` usa para actualizar (*upgrade*) el paquete si ya existe.

> Doc: [Installation wiki — with pip](https://github.com/yt-dlp/yt-dlp/wiki/Installation#with-pip)

```ejercicio
# Enunciado
Completa el módulo que Python ejecuta para instalar el paquete.

# Plantilla
partes = ["python", "-m", "___", "install", "yt-dlp"]
print(" ".join(partes))

# Esperado
python -m pip install yt-dlp

# Pista
Es el gestor de paquetes de Python.
```

# Comprobar qué ejecutable responde

Después de instalar, `--version` permite comprobar que la terminal encuentra
yt-dlp. La versión concreta cambia con las publicaciones, por lo que el curso
no fija una salida literal.

```bash !sin-consola
yt-dlp --version
```

> Doc: [General Options — --version](https://github.com/yt-dlp/yt-dlp#general-options)

# Cierre

yt-dlp puede instalarse mediante binarios oficiales, `pip` o gestores de
terceros. Windows x64, Linux/BSD y macOS tienen artefactos recomendados
diferentes, y la instalación con `pip` queda asociada al intérprete que
ejecuta el módulo.

La sesión siguiente distingue los demás archivos de una release y verifica su
integridad y firma.
