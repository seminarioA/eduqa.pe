---
numero: 46
titulo: "xattrs y concatenación de playlists"
---

# --xattrs

`--xattrs` escribe metadatos en atributos extendidos del archivo usando estándares Dublin Core y XDG.

> Doc: [Post-Processing Options — --xattrs](https://github.com/yt-dlp/yt-dlp#post-processing-options)

```ejercicio
# Enunciado
Completa la opción que escribe atributos extendidos.

# Plantilla
print("___")

# Esperado
--xattrs

# Pista
El nombre abrevia extended attributes.
```

# --concat-playlist

`--concat-playlist POLICY` concatena vídeos de una playlist según una política.

Los valores documentados son `never`, `always` y `multi_video`; este último es el predeterminado y concatena cuando los vídeos forman un único programa.

```ejercicio
# Enunciado
Completa la política predeterminada.

# Plantilla
print("___")

# Esperado
multi_video

# Pista
Une dos palabras con guion bajo.
```

# Requisitos de concatenación

Todos los archivos deben tener los mismos codecs y el mismo número de streams.

```opcion-multiple
# Enunciado
¿Qué condición exige la concatenación?

# Opciones
- Mismos codecs y mismo número de streams
- Mismo título únicamente
- Mismo proxy
- Mismo nombre de archivo

# Correcta
1

# Explicación
La compatibilidad de streams es requisito para concatenar sin una transformación arbitraria.

# Pista
Piensa en compatibilidad técnica del contenido.
```

# pl_video:

El prefijo `pl_video:` puede usarse con `--paths` y `--output` para configurar el archivo concatenado.

# Cierre

La sesión siguiente corrige fallos conocidos y localiza FFmpeg.
