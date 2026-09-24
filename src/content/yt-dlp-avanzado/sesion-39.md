---
numero: 39
titulo: "Construir el ejecutable standalone con PyInstaller"
---

# Arquitectura del ejecutable

El ejecutable standalone se construye para la misma arquitectura de CPU que el Python utilizado durante el build.

> Doc: [Compile — Standalone PyInstaller Builds](https://github.com/yt-dlp/yt-dlp#standalone-pyinstaller-builds)

```opcion-multiple
# Enunciado
¿De qué depende la arquitectura del ejecutable producido?

# Opciones
- De la arquitectura del Python usado para compilar
- Del navegador predeterminado
- Del formato de vídeo
- Del proxy configurado

# Correcta
1

# Explicación
El README indica que el ejecutable se construye para la misma CPU architecture que Python.

# Pista
La arquitectura se decide durante el build.
```

# install_deps.py

El primer comando oficial instala el grupo de dependencias de PyInstaller.

```bash !sin-consola
python devscripts/install_deps.py --include-group pyinstaller
```

```ejercicio
# Enunciado
Completa el nombre del grupo de dependencias.

# Plantilla
print("--include-group " + "___")

# Esperado
--include-group pyinstaller

# Pista
Coincide con el empaquetador usado.
```

# make_lazy_extractors.py

Antes del build, el flujo oficial genera extractores perezosos.

```bash !sin-consola
python devscripts/make_lazy_extractors.py
```

# bundle.pyinstaller

El build soportado se ejecuta como módulo:

```bash !sin-consola
python -m bundle.pyinstaller
```

> Nota: El README advierte que ejecutar `pyinstaller` directamente en lugar de `python -m bundle.pyinstaller` no está soportado oficialmente.

```ejercicio
# Enunciado
Completa el módulo oficial de build.

# Plantilla
print("python -m " + "___")

# Esperado
python -m bundle.pyinstaller

# Pista
El nombre une bundle y pyinstaller con un punto.
```

# py y python3

Según el sistema, el ejecutable del intérprete puede llamarse `py` o `python3` en lugar de `python`.

# Cierre

La sesión siguiente pasa opciones de PyInstaller y construye el binario Unix independiente de plataforma.
