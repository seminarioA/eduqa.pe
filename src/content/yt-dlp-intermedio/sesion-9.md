---
numero: 9
titulo: "Caché persistente"
---

# --cache-dir

`--cache-dir DIR` define la ubicación donde yt-dlp conserva información descargada reutilizable, como identificadores de cliente y firmas.

> Doc: [Filesystem Options — --cache-dir](https://github.com/yt-dlp/yt-dlp#filesystem-options)

```ejercicio
# Enunciado
Completa la opción que usa ./cache.

# Plantilla
print("yt-dlp " + "___" + " ./cache")

# Esperado
yt-dlp --cache-dir ./cache

# Pista
Combina `cache` y `dir`.
```

# Caché y archive

El archive registra IDs de vídeos descargados; la caché conserva información técnica reutilizable.

```opcion-multiple
# Enunciado
¿Qué conserva la caché?

# Opciones
- Información técnica reutilizable
- Solo IDs de vídeos descargados
- Solo contraseñas
- El ejecutable de FFmpeg

# Correcta
1

# Explicación
El README menciona datos como client ids y signatures.

# Pista
Distingue --cache-dir de --download-archive.
```

# --no-cache-dir

`--no-cache-dir` desactiva la caché del filesystem.

```ejercicio
# Enunciado
Completa la opción que desactiva la caché.

# Plantilla
print("___")

# Esperado
--no-cache-dir

# Pista
Niega el uso del directorio de caché.
```

# --rm-cache-dir

`--rm-cache-dir` elimina todos los archivos de caché existentes.

```ejercicio
# Enunciado
Completa la opción que borra la caché.

# Plantilla
print("___")

# Esperado
--rm-cache-dir

# Pista
`rm` abrevia remove.
```

# Cierre

La sesión siguiente trabaja con miniaturas.
