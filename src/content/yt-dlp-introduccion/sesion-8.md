---
numero: 8
titulo: "Verificar dependencias opcionales con Python"
---

# Inventariar dependencias opcionales

Una automatización puede inspeccionar qué módulos opcionales están disponibles y adaptar su flujo. Esta comprobación no sustituye la documentación: únicamente describe el entorno donde se ejecuta el programa.

```python
import importlib.util

modulos = ["mutagen", "Cryptodome", "secretstorage"]
estado = {nombre: importlib.util.find_spec(nombre) is not None for nombre in modulos}
print(list(estado))
```

```salida
['mutagen', 'Cryptodome', 'secretstorage']
```

> Doc: [Dependencies](https://github.com/yt-dlp/yt-dlp#dependencies)

```ejercicio
# Enunciado
Completa el módulo usado por pycryptodomex.

# Plantilla
import importlib.util
modulo = "___"
print(modulo)

# Esperado
Cryptodome

# Pista
pycryptodomex expone el namespace Cryptodome.
```


# mutagen

`mutagen` participa en la incorporación de miniaturas dentro de determinados
formatos. El README la relaciona específicamente con `--embed-thumbnail`.

No todas las dependencias opcionales intervienen en toda descarga: se cargan o
utilizan cuando una operación necesita la capacidad que proporcionan.

> Doc: [Dependencies — Metadata](https://github.com/yt-dlp/yt-dlp#metadata)

```ejercicio
# Enunciado
Completa el paquete asociado a --embed-thumbnail para determinados formatos.

# Plantilla
paquete = "___"
print(paquete)

# Esperado
mutagen

# Pista
Empieza por `muta`.
```

# AtomicParsley

`AtomicParsley` puede utilizarse para insertar miniaturas en archivos
`mp4` y `m4a` cuando `mutagen` o FFmpeg no pueden realizar la operación.

La condición importa: no es una sustitución general de FFmpeg, sino una
herramienta asociada a ese trabajo de metadatos en formatos concretos.

> Doc: [Dependencies — Metadata](https://github.com/yt-dlp/yt-dlp#metadata)

```ejercicio
# Enunciado
Completa el nombre de la herramienta que el README asocia a miniaturas en mp4/m4a como alternativa cuando otros mecanismos no pueden hacerlo.

# Plantilla
herramienta = "___"
print(herramienta)

# Esperado
AtomicParsley

# Pista
El nombre contiene dos palabras unidas y empieza con mayúscula.
```

# xattr, pyxattr y setfattr

En macOS y BSD, yt-dlp puede apoyarse en `xattr`, `pyxattr` o
`setfattr` para escribir metadatos de atributos extendidos cuando se utiliza
`--xattrs`.

Los **extended attributes** son metadatos asociados al archivo por el sistema
de archivos y no forman parte del contenido multimedia del archivo.

> Doc: [Dependencies — Metadata](https://github.com/yt-dlp/yt-dlp#metadata)

```ejercicio
# Enunciado
Completa la opción de yt-dlp asociada a la escritura de atributos extendidos.

# Plantilla
opcion = "--___"
print(opcion)

# Esperado
--xattrs

# Pista
El nombre usa la abreviatura habitual de extended attributes.
```

# pycryptodomex

`pycryptodomex` habilita, entre otras operaciones, el descifrado de streams
HLS protegidos con AES-128.

HLS significa *HTTP Live Streaming* y AES significa *Advanced Encryption
Standard*. El uso de esta dependencia está vinculado a streams que requieran
esa operación criptográfica.

> Doc: [Dependencies — Misc](https://github.com/yt-dlp/yt-dlp#misc)

```ejercicio
# Enunciado
Completa el nombre de la dependencia documentada para descifrado AES-128 de HLS.

# Plantilla
paquete = "___"
print(paquete)

# Esperado
pycryptodomex

# Pista
Termina en `domex`.
```

# secretstorage

En Linux, `secretstorage` puede ser necesario para que
`--cookies-from-browser` acceda al keyring de GNOME al descifrar cookies de
navegadores basados en Chromium.

La dependencia está ligada al acceso al almacén de secretos del escritorio, no
a la descarga de cookies desde Internet.

> Doc: [Dependencies — Misc](https://github.com/yt-dlp/yt-dlp#misc)

```ejercicio
# Enunciado
Completa el paquete asociado al keyring de GNOME para cookies de Chromium en Linux.

# Plantilla
paquete = "___"
print(paquete)

# Esperado
secretstorage

# Pista
Su nombre une «secreto» y «almacenamiento» en inglés.
```

# Descargadores externos

El README permite usar descargadores externos mediante `--downloader`. La
herramienta externa elegida pasa a ser otra dependencia del flujo configurado.

```python
configuracion = {
    "opcion": "--downloader",
    "programa": "ffmpeg",
}
print(configuracion["opcion"])
```

```salida
--downloader
```

> Doc: [Dependencies — Misc](https://github.com/yt-dlp/yt-dlp#misc)

```ejercicio
# Enunciado
Completa la opción que selecciona un descargador externo.

# Plantilla
print("yt-dlp " + "___" + " ffmpeg")

# Esperado
yt-dlp --downloader ffmpeg

# Pista
La opción se llama igual que «descargador» en inglés.
```

# rtmpdump está deprecado

El README mantiene `rtmpdump` en una subsección de dependencias deprecadas y
señala que FFmpeg puede utilizarse en su lugar con `--downloader ffmpeg`.

Que una herramienta figure en la documentación no significa que deba elegirse
para una configuración nueva; la categoría «Deprecated» forma parte de la
información técnica.

> Doc: [Dependencies — Deprecated](https://github.com/yt-dlp/yt-dlp#deprecated)

# Las licencias también aplican a las dependencias

Cada dependencia conserva sus propios términos de licencia. El README advierte
que para usar o redistribuir dependencias deben respetarse esas condiciones.

Esta consideración es separada de la licencia del repositorio de yt-dlp.

# Cierre con Python

Las dependencias opcionales quedaron tratadas como capacidades detectables desde Python, no como supuestos del entorno.


Las dependencias opcionales habilitan operaciones específicas: miniaturas,
atributos extendidos, descifrado, acceso a keyrings y descargadores externos.
La ausencia de una dependencia no significa necesariamente que yt-dlp no pueda
ejecutarse; significa que determinadas capacidades pueden no estar disponibles.

La sesión siguiente abandona la instalación y empieza la CLI con las opciones de
ayuda, versión y control básico del proceso.
