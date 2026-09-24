---
numero: 14
titulo: "Directorios de plugins"
---

# --plugin-dirs

`--plugin-dirs DIR` añade un directorio a los lugares donde yt-dlp busca
plugins. La opción puede repetirse para añadir varios directorios.

La carga y el desarrollo de plugins se estudian en el nivel avanzado; aquí se
define únicamente cómo se modifica la lista de búsqueda desde la CLI.

> Doc: [General Options — --plugin-dirs](https://github.com/yt-dlp/yt-dlp#general-options)

```ejercicio
# Enunciado
Completa la opción que añade un directorio adicional de plugins.

# Plantilla
print("yt-dlp " + "___" + " ./plugins")

# Esperado
yt-dlp --plugin-dirs ./plugins

# Pista
La opción usa el plural de directorio abreviado como `dirs`.
```

# Repetir la opción

Como `--plugin-dirs` es repetible, cada aparición añade otra ubicación.

```python
directorios = ["./plugins-equipo", "./plugins-locales"]
comando = ["yt-dlp"]
for directorio in directorios:
    comando.extend(["--plugin-dirs", directorio])
print(comando.count("--plugin-dirs"))
```

```salida
2
```

```ejercicio
# Enunciado
Completa el método de lista que añade dos elementos al comando en cada iteración.

# Plantilla
comando = ["yt-dlp"]
comando.___(["--plugin-dirs", "./plugins"])
print(comando)

# Esperado
['yt-dlp', '--plugin-dirs', './plugins']

# Pista
El método incorpora todos los elementos de otra secuencia.
```

# default

El valor especial `default` solicita la búsqueda en los directorios de plugins
predeterminados. Según el README, ese comportamiento está activo de forma
predeterminada.

```ejercicio
# Enunciado
Completa el valor especial que representa los directorios de plugins predeterminados.

# Plantilla
valor = "___"
print(valor)

# Esperado
default

# Pista
Es «predeterminado» en inglés.
```

# --no-plugin-dirs

`--no-plugin-dirs` vacía la lista de directorios donde buscar plugins. El
README especifica que elimina tanto los directorios predeterminados como los
añadidos por `--plugin-dirs` anteriormente.

Por tanto, el orden importa cuando ambas opciones aparecen en una misma
invocación.

> Doc: [General Options — --no-plugin-dirs](https://github.com/yt-dlp/yt-dlp#general-options)

```ejercicio
# Enunciado
Completa la opción que limpia todos los directorios de búsqueda de plugins.

# Plantilla
print("yt-dlp " + "___")

# Esperado
yt-dlp --no-plugin-dirs

# Pista
Anteponer `--no-` niega la lista de directorios.
```

# Cierre

`--plugin-dirs` añade ubicaciones, `default` representa las ubicaciones
predeterminadas y `--no-plugin-dirs` limpia toda la lista activa.

La sesión siguiente aplica la misma idea de habilitar y limpiar, pero a los
runtimes JavaScript.
