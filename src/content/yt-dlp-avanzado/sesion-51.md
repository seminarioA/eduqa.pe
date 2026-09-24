---
numero: 51
titulo: "Compatibilidad con comportamientos históricos por versión"
---

# Progreso de downloader externo

La documentación mantiene tachada una diferencia no implementada sobre normalización del progreso de descargadores externos.

La compat option asociada es `no-external-downloader-progress`, pero la propia sección indica que el comportamiento no está implementado actualmente.

> Doc: [Differences in default behavior](https://github.com/yt-dlp/yt-dlp#differences-in-default-behavior)

# playlist-match-filter

Las versiones entre 2021.09.01 y 2022.11.11 aplicaron match filters a playlists anidadas por un efecto no intencionado.

`playlist-match-filter` restaura ese comportamiento histórico.

# manifest-filesize-approx

Entre 2021.11.10 y 2023.06.21 se estimó `filesize_approx` para formatos fragmentados/manifests. La función se retiró por posibles errores extremos.

`manifest-filesize-approx` restaura esas estimaciones.

```ejercicio
# Enunciado
Completa la compat option que restaura estimaciones de filesize de manifests.

# Plantilla
print("--compat-options " + "___")

# Esperado
--compat-options manifest-filesize-approx

# Pista
Combina manifest, filesize y approx.
```

# prefer-legacy-http-handler

yt-dlp usa backends HTTP modernos como requests. Esta compat option prefiere el handler legado basado en urllib para HTTP estándar.

# Submódulos removidos

`swfinterp` y `casefold` fueron eliminados.

# Simulación y format selection

`--simulate`, y `extract_info(download=False)`, ya no modifican la selección predeterminada de formato.

# mtime

yt-dlp ya no aplica por defecto la fecha Last-Modified del servidor. `--mtime` o `mtime-by-default` recuperan el comportamiento.

```ejercicio
# Enunciado
Completa la compat option de mtime histórico.

# Plantilla
print("--compat-options " + "___")

# Esperado
--compat-options mtime-by-default

# Pista
El nombre termina en by-default.
```

# Cierre

La sesión siguiente explica aliases globales de compatibilidad y aliases anuales.
