---
numero: 25
titulo: "Plugins portables, pip, PYTHONPATH y archives"
---

# Junto al ejecutable

Para una instalación portable binaria, puede existir `yt-dlp-plugins/<package>/yt_dlp_plugins/` junto a `yt-dlp.exe`.

# Junto al código fuente

Al ejecutar desde fuente, se usa una ubicación equivalente junto a `yt_dlp/__main__.py`.

> Doc: [Installing Plugins](https://github.com/yt-dlp/yt-dlp#installing-plugins)

# pip

Los paquetes de plugins pueden instalarse con pip. El repositorio `yt-dlp-sample-plugins` sirve como ejemplo.

# Filenames únicos

Los archivos de plugins instalados por paquetes pip deben tener nombres únicos entre paquetes.

# PYTHONPATH

Cada ruta de PYTHONPATH se inspecciona buscando el namespace `yt_dlp_plugins`.

Esta regla no aplica a builds PyInstaller.

```ejercicio
# Enunciado
Completa la variable cuyas rutas se inspeccionan.

# Plantilla
print("PYTHON" + "___")

# Esperado
PYTHONPATH

# Pista
La parte que falta es PATH.
```

# ZIP, EGG y WHL

Archives `.zip`, `.egg` y `.whl` son paquetes admitidos si contienen `yt_dlp_plugins` en la raíz.

# --verbose

El README recomienda ejecutar yt-dlp con `--verbose` para comprobar que el plugin se cargó.

# Cierre

La sesión siguiente define cómo se descubren clases públicas de plugins.
