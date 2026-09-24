---
numero: 45
titulo: "Sobrescritura, reanudación y archivos parciales"
---

# -w y --no-overwrites

`-w` es la forma corta de `--no-overwrites`. Impide sobrescribir cualquier
archivo existente.

> Doc: [Filesystem Options — --no-overwrites](https://github.com/yt-dlp/yt-dlp#filesystem-options)

```ejercicio
# Enunciado
Completa la forma corta que impide sobrescribir archivos.

# Plantilla
print("yt-dlp " + "___")

# Esperado
yt-dlp -w

# Pista
La forma corta es una w minúscula.
```

# --force-overwrites

`--force-overwrites` permite sobrescribir archivos de vídeo y de metadatos.
El README especifica además que incluye `--no-continue`.

Forzar sobrescritura y reanudar un parcial son políticas incompatibles en esa
configuración: la primera incluye explícitamente la desactivación de la segunda.

```ejercicio
# Enunciado
Completa la opción que fuerza la sobrescritura de vídeo y metadatos.

# Plantilla
opcion = "___"
print(opcion)

# Esperado
--force-overwrites

# Pista
Empieza por `--force-`.
```

# --no-force-overwrites

`--no-force-overwrites` no sobrescribe el vídeo, pero sí permite sobrescribir
archivos relacionados. Es el comportamiento predeterminado.

```ejercicio
# Enunciado
Completa la opción predeterminada opuesta a --force-overwrites.

# Plantilla
print("___")

# Esperado
--no-force-overwrites

# Pista
Añade el prefijo `--no-`.
```

# -c y --continue

`-c` es la forma corta de `--continue`. Reanuda archivos o fragmentos
parcialmente descargados y es el comportamiento predeterminado.

```ejercicio
# Enunciado
Completa la forma corta que habilita reanudación.

# Plantilla
print("yt-dlp " + "___")

# Esperado
yt-dlp -c

# Pista
La letra es la inicial de continue.
```

# --no-continue

`--no-continue` evita reanudar fragmentos parciales. Si el archivo no está
fragmentado, la descarga vuelve a empezar desde el principio.

> Doc: [Filesystem Options — --no-continue](https://github.com/yt-dlp/yt-dlp#filesystem-options)

```ejercicio
# Enunciado
Completa la opción que desactiva la reanudación.

# Plantilla
print("___")

# Esperado
--no-continue

# Pista
Niega --continue.
```

# --part

`--part` hace que yt-dlp utilice archivos con extensión `.part` durante la
descarga en lugar de escribir directamente sobre el nombre final. Es el
comportamiento predeterminado.

```ejercicio
# Enunciado
Completa la opción que usa archivos .part.

# Plantilla
opcion = "___"
print(opcion)

# Esperado
--part

# Pista
La opción coincide con la extensión temporal.
```

# --no-part

`--no-part` escribe directamente en el archivo de salida y evita la extensión
temporal `.part`.

```ejercicio
# Enunciado
Completa la opción que escribe directamente en el archivo de salida.

# Plantilla
print("___")

# Esperado
--no-part

# Pista
Niega --part.
```

# --mtime

`--mtime` utiliza el encabezado HTTP `Last-Modified` para establecer el
tiempo de modificación del archivo local.

`mtime` abrevia *modification time*.

```ejercicio
# Enunciado
Completa la opción que aplica Last-Modified al tiempo de modificación local.

# Plantilla
print("yt-dlp " + "___")

# Esperado
yt-dlp --mtime

# Pista
El nombre abrevia modification time.
```

# --no-mtime

`--no-mtime` no copia el valor de `Last-Modified` al archivo y es el
comportamiento predeterminado actual.

```ejercicio
# Enunciado
Completa la opción predeterminada que no aplica Last-Modified.

# Plantilla
print("___")

# Esperado
--no-mtime

# Pista
Niega --mtime.
```

# Cierre del nivel introductorio

El nivel introductorio terminó con el ciclo operativo básico: instalación,
actualización, dependencias, opciones generales, red, georrestricción, selección,
control de descargas y las decisiones fundamentales del filesystem.

El curso intermedio continúa desde aquí con archivos auxiliares de metadatos,
cookies, caché, miniaturas, shortcuts, simulación y salida estructurada,
workarounds, selección avanzada de formatos, subtítulos, autenticación,
postprocesamiento, SponsorBlock, configuración, output templates, filtrado,
ordenamiento y modificación de metadatos.
