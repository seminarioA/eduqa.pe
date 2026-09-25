---
numero: 9
titulo: "Ejecutar ayuda y versión desde Python"
---

# Capturar stdout y returncode

`ejecutar_yt_dlp()` devuelve un `CompletedProcess`. Sus atributos `stdout`, `stderr` y `returncode` permiten que Python inspeccione el resultado sin parsear la presentación de una terminal interactiva.

```python !sin-consola
resultado = ejecutar_yt_dlp("--version")
print(resultado.returncode)
print(resultado.stdout.strip())
```

> Doc: [General Options](https://github.com/yt-dlp/yt-dlp#general-options)
> Doc: [subprocess.run()](https://docs.python.org/3/library/subprocess.html#subprocess.run)

```ejercicio
# Enunciado
Completa la opción que imprime la versión.

# Plantilla
argumentos = ["___"]
print(" ".join(comando_yt_dlp(*argumentos)[3:]))

# Esperado
--version

# Pista
La opción larga contiene la palabra version.
```


# -h y --help

`-h` es la forma corta de `--help`. La opción imprime la ayuda de la
versión instalada y termina el proceso.

La ayuda local es especialmente útil en yt-dlp porque las opciones evolucionan:
consultarla muestra lo que entiende exactamente el ejecutable que se está
utilizando.

```bash !sin-consola
yt-dlp --help
```

> Doc: [General Options — --help](https://github.com/yt-dlp/yt-dlp#general-options)

```ejercicio
# Enunciado
Completa la forma larga de la opción que imprime la ayuda.

# Plantilla
opcion = "--___"
print(opcion)

# Esperado
--help

# Pista
Es «ayuda» en inglés.
```

# La forma corta -h

Una opción corta comienza con un guion (`-`) y, en este caso, una sola letra.
`-h` y `--help` producen la misma operación documentada.

```python
formas = ["-h", "--help"]
print(len(formas))
```

```salida
2
```

```ejercicio
# Enunciado
Completa la forma corta de --help.

# Plantilla
print("yt-dlp " + "___")

# Esperado
yt-dlp -h

# Pista
Usa la inicial de help precedida por un guion.
```

# --version

`--version` imprime la versión del programa y termina. La salida cambia con
cada release, por lo que no se fija una versión literal en el material.

```bash !sin-consola
yt-dlp --version
```

> Doc: [General Options — --version](https://github.com/yt-dlp/yt-dlp#general-options)

```ejercicio
# Enunciado
Completa la opción que imprime la versión instalada.

# Plantilla
print("yt-dlp " + "___")

# Esperado
yt-dlp --version

# Pista
La opción usa la palabra inglesa `version`.
```

# Opciones que terminan el proceso

`--help` y `--version` son consultas sobre el propio programa. No necesitan
una URL porque no solicitan procesar contenido multimedia.

Esta distinción evita añadir argumentos que no participan en la operación que
se quiere realizar.

```python
consultas = {"ayuda": "--help", "version": "--version"}
print(consultas["version"])
```

```salida
--version
```

# Cierre con Python

Python ya puede ejecutar una opción local de yt-dlp y observar su código de salida y su stdout de forma explícita.


`-h` y `--help` consultan la ayuda disponible en la instalación;
`--version` identifica la versión instalada. Ambas operaciones terminan sin
necesitar una URL.

La sesión siguiente define qué ocurre cuando una descarga o un
postprocesamiento falla.
