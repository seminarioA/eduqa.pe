---
numero: 41
titulo: "Devscripts de build y lazy extractors"
---

# install_deps.py

`devscripts/install_deps.py` instala dependencias de yt-dlp.

> Doc: [Compile — Related scripts](https://github.com/yt-dlp/yt-dlp#related-scripts)

# update-version.py

Actualiza el número de versión a partir de la fecha actual.

```ejercicio
# Enunciado
Completa el script que actualiza la versión.

# Plantilla
print("devscripts/" + "___")

# Esperado
devscripts/update-version.py

# Pista
El nombre contiene update y version.
```

# set-variant.py

Configura la variante del ejecutable.

```ejercicio
# Enunciado
Completa el script que selecciona la variante.

# Plantilla
print("devscripts/" + "___")

# Esperado
devscripts/set-variant.py

# Pista
Combina set y variant.
```

# make_changelog.py

Genera un changelog Markdown a partir de mensajes cortos de commits y actualiza `CONTRIBUTORS`.

```ejercicio
# Enunciado
Completa el script que genera el changelog.

# Plantilla
print("devscripts/" + "___")

# Esperado
devscripts/make_changelog.py

# Pista
Combina make y changelog.
```

# make_lazy_extractors.py

Genera lazy extractors. Ejecutarlo antes de construir binarios mejora el tiempo de arranque.

# YTDLP_NO_LAZY_EXTRACTORS

Una variable de entorno no vacía desactiva forzosamente la carga perezosa de extractores.

```ejercicio
# Enunciado
Completa el nombre de la variable.

# Plantilla
print("YTDLP_NO_LAZY_" + "___")

# Esperado
YTDLP_NO_LAZY_EXTRACTORS

# Pista
Termina en plural.
```

# --help de cada script

El README remite al `--help` individual para detalles de parámetros.

# Cierre

La sesión siguiente usa los workflows de un fork para builds y releases.
