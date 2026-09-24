---
numero: 57
titulo: "Variables de entorno y rutas de configuración"
---

# Sintaxis de variables

En Unix las variables suelen escribirse como `$VARIABLE` o con llaves; en Windows como `%VARIABLE%`. La documentación de yt-dlp usa la forma con llaves de manera uniforme.

> Doc: [Configuration — environment variables](https://github.com/yt-dlp/yt-dlp#notes-about-environment-variables)

```ejercicio
# Enunciado
Completa el nombre de la variable de configuración XDG.

# Plantilla
print("XDG_" + "___")

# Esperado
XDG_CONFIG_HOME

# Pista
La parte que falta termina en HOME.
```

# Variables estilo Unix en Windows

yt-dlp acepta variables estilo Unix en Windows para opciones de ruta como `--output` y `--config-locations`.

# XDG_CONFIG_HOME

Si no está definida, XDG_CONFIG_HOME usa `~/.config`.

```ejercicio
# Enunciado
Completa el valor por omisión.

# Plantilla
print("~/" + "___")

# Esperado
~/.config

# Pista
El directorio comienza con punto.
```

# XDG_CACHE_HOME

Si no está definida, XDG_CACHE_HOME usa `~/.cache`.

# ~ en Windows

En Windows, `~` apunta a HOME si existe; de lo contrario usa USERPROFILE o la combinación HOMEDRIVE y HOMEPATH.

# USERPROFILE y APPDATA

El README indica que USERPROFILE suele apuntar al directorio del usuario y APPDATA al subdirectorio roaming correspondiente.

# Cierre

Con la configuración persistente cubierta, la sesión siguiente empieza el lenguaje de output templates.
