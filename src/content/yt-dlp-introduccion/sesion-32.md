---
numero: 32
titulo: "El archivo de descargas"
---

# --download-archive

`--download-archive FILE` utiliza un archivo para recordar vídeos descargados.
yt-dlp descarga únicamente los vídeos que no figuran en ese archivo y registra
los identificadores de los que descarga.

El archivo funciona como estado persistente entre ejecuciones.

> Doc: [Video Selection — --download-archive](https://github.com/yt-dlp/yt-dlp#video-selection)

```ejercicio
# Enunciado
Completa la opción que utiliza un archivo de IDs ya descargados.

# Plantilla
print("yt-dlp " + "___" + " archive.txt")

# Esperado
yt-dlp --download-archive archive.txt

# Pista
El nombre contiene `download` y `archive`.
```

# El archivo guarda identificadores

La documentación define el archive en términos de IDs de vídeos, no de nombres
de archivo. El nombre final puede cambiar por una plantilla sin convertir un
vídeo conocido en uno nuevo para el archive.

```python
ids = {"video-a", "video-b"}
print("video-a" in ids)
```

```salida
True
```

```ejercicio
# Enunciado
Completa el operador de pertenencia usado para comprobar si un ID ya está registrado.

# Plantilla
ids = {"video-a", "video-b"}
print("video-a" ___ ids)

# Esperado
True

# Pista
Python usa una palabra de dos letras para la pertenencia.
```

# Persistencia entre ejecuciones

Sin un archive, una segunda ejecución no dispone de este registro explícito.
Con el mismo archivo, yt-dlp puede evitar volver a descargar los IDs ya
anotados.

Este mecanismo es distinto de encontrar un archivo con el mismo nombre en el
filesystem: el archive registra identidad lógica de vídeos.

# --no-download-archive

`--no-download-archive` desactiva el uso del archive y es el comportamiento
predeterminado.

```ejercicio
# Enunciado
Completa la opción que desactiva el archivo de descargas.

# Plantilla
opcion = "___"
print(opcion)

# Esperado
--no-download-archive

# Pista
Niega directamente --download-archive.
```

# Cierre

`--download-archive` persiste IDs descargados y permite omitirlos en
ejecuciones posteriores. `--no-download-archive` deja el procesamiento sin ese
registro.

La sesión siguiente utiliza el archive y otros límites como condiciones de
terminación.