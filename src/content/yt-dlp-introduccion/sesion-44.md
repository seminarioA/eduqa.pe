---
numero: 44
titulo: "Sanear y recortar nombres desde Python"
---

# Componer políticas de nombres

Python puede activar varias reglas de filesystem en una misma lista de argumentos. Cada regla sigue siendo independiente y puede añadirse o retirarse según el destino.

```python
argumentos = ["--restrict-filenames", "--trim-filenames", "100"]
print(" ".join(comando_yt_dlp(*argumentos)[3:]))
```

```salida
--restrict-filenames --trim-filenames 100
```

> Doc: [Filesystem Options](https://github.com/yt-dlp/yt-dlp#filesystem-options)

```ejercicio
# Enunciado
Completa la opción que limita la longitud del nombre.

# Plantilla
argumentos = ["--restrict-filenames", "___", "100"]
print(" ".join(argumentos))

# Esperado
--restrict-filenames --trim-filenames 100

# Pista
La opción contiene trim y filenames.
```


# --restrict-filenames

`--restrict-filenames` limita los nombres a caracteres ASCII y evita
ampersand (`&`) y espacios.

ASCII significa *American Standard Code for Information Interchange*. En este
contexto, la opción busca un conjunto de caracteres más restringido para el
nombre final.

> Doc: [Filesystem Options — --restrict-filenames](https://github.com/yt-dlp/yt-dlp#filesystem-options)

```ejercicio
# Enunciado
Completa la opción que restringe los nombres de archivo.

# Plantilla
print("yt-dlp " + "___")

# Esperado
yt-dlp --restrict-filenames

# Pista
El nombre contiene `restrict` y `filenames`.
```

# --no-restrict-filenames

`--no-restrict-filenames` permite Unicode, ampersand y espacios y es el
comportamiento predeterminado.

```ejercicio
# Enunciado
Completa la opción predeterminada que permite Unicode y espacios.

# Plantilla
print("___")

# Esperado
--no-restrict-filenames

# Pista
Niega la restricción anterior.
```

# --windows-filenames

`--windows-filenames` fuerza nombres compatibles con Windows incluso cuando
yt-dlp se ejecuta en otro sistema.

La compatibilidad de nombres y el directorio de destino son decisiones
separadas.

> Doc: [Filesystem Options — --windows-filenames](https://github.com/yt-dlp/yt-dlp#filesystem-options)

```ejercicio
# Enunciado
Completa la opción que fuerza nombres compatibles con Windows.

# Plantilla
opcion = "--___-filenames"
print(opcion)

# Esperado
--windows-filenames

# Pista
La palabra que falta es el nombre del sistema.
```

# --no-windows-filenames

`--no-windows-filenames` aplica únicamente el saneamiento mínimo en lugar de
forzar las restricciones de Windows.

```ejercicio
# Enunciado
Completa la opción que desactiva la compatibilidad forzada con nombres de Windows.

# Plantilla
print("___")

# Esperado
--no-windows-filenames

# Pista
Niega directamente --windows-filenames.
```

# --trim-filenames

`--trim-filenames LENGTH` limita la longitud del nombre sin contar la
extensión.

Si se indica `100`, el límite se aplica a la parte del nombre previa a la
extensión.

```bash !sin-consola
yt-dlp --trim-filenames 100 "URL"
```

> Doc: [Filesystem Options — --trim-filenames](https://github.com/yt-dlp/yt-dlp#filesystem-options)

```ejercicio
# Enunciado
Completa la opción que limita el nombre a 100 caracteres sin contar la extensión.

# Plantilla
print("yt-dlp " + "___" + " 100")

# Esperado
yt-dlp --trim-filenames 100

# Pista
La opción usa el verbo `trim`.
```

# Cierre con Python

Python puede componer restricciones de nombres y longitud como políticas independientes antes de ejecutar yt-dlp.


yt-dlp puede restringir el alfabeto del nombre, aplicar reglas de compatibilidad
con Windows y recortar la longitud previa a la extensión. Son tres controles
independientes.

La última sesión de **Introducción a yt-dlp con Python** cubre sobrescritura,
reanudación, archivos `.part` y tiempos de modificación.
