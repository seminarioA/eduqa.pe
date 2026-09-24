---
numero: 40
titulo: "Opciones PyInstaller y binario Unix"
---

# Argumentos de PyInstaller

`python -m bundle.pyinstaller` acepta argumentos válidos de PyInstaller.

> Doc: [Compile — Standalone PyInstaller Builds](https://github.com/yt-dlp/yt-dlp#standalone-pyinstaller-builds)

# --onefile y -F

`--onefile` o `-F` producen la variante de archivo único.

```ejercicio
# Enunciado
Completa la forma corta de --onefile.

# Plantilla
print("___")

# Esperado
-F

# Pista
Usa una F mayúscula.
```

# --onedir y -D

`--onedir` o `-D` producen una distribución en directorio.

```ejercicio
# Enunciado
Completa la forma corta de --onedir.

# Plantilla
print("___")

# Esperado
-D

# Pista
Usa una D mayúscula.
```

# PyInstaller anterior a 4.4

El README señala que versiones anteriores a 4.4 no soportan Python instalado desde Microsoft Store sin usar un entorno virtual.

# Herramientas para el binario Unix

El binario independiente de plataforma requiere Python 3.10+, `zip`, GNU `make`, `pandoc` y `pytest`.

Los dos últimos están marcados como opcionales cuando solo se construye el binario.

# make

`make` construye el conjunto normal de artefactos previsto por el Makefile.

```bash !sin-consola
make
```

# make yt-dlp

`make yt-dlp` construye únicamente el binario y no actualiza archivos adicionales. Para este objetivo no hacen falta las herramientas marcadas con asterisco.

```ejercicio
# Enunciado
Completa el target que construye solo el binario.

# Plantilla
print("make " + "___")

# Esperado
make yt-dlp

# Pista
El target coincide con el nombre del programa.
```

# Cierre

La sesión siguiente recorre cada devscript relacionado con builds y releases.
