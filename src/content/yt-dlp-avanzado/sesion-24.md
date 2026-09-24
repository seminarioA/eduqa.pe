---
numero: 24
titulo: "Instalar plugins en directorios de configuración"
---

# Estructura del paquete

Un paquete contiene el namespace `yt_dlp_plugins`, seguido de `extractor` o `postprocessor`.

```text
yt_dlp_plugins/
    extractor/
        myplugin.py
```

> Doc: [Installing Plugins](https://github.com/yt-dlp/yt-dlp#installing-plugins)

# User plugins en XDG

La ubicación recomendada en Linux/macOS usa XDG_CONFIG_HOME bajo `yt-dlp/plugins/<package>/yt_dlp_plugins/`.

# Variante yt-dlp-plugins

También existe la forma XDG bajo `yt-dlp-plugins/<package>/yt_dlp_plugins/`.

# APPDATA en Windows

La ubicación recomendada usa APPDATA bajo `yt-dlp/plugins/<package>/yt_dlp_plugins/`.

# Directorios home alternativos

Se buscan también `~/.yt-dlp/plugins/... ` y `~/yt-dlp-plugins/...`.

# System plugins

Los directorios de sistema documentados son `/etc/yt-dlp/plugins/...` y `/etc/yt-dlp-plugins/...`.

```ejercicio
# Enunciado
Completa el namespace que debe existir dentro del paquete.

# Plantilla
print("___")

# Esperado
yt_dlp_plugins

# Pista
Usa guiones bajos, no guiones.
```

# Cierre

La sesión siguiente instala plugins junto al ejecutable, mediante pip y mediante archives.
