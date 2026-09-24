---
numero: 71
titulo: "Preparar un extractor para un sitio nuevo"
---

# Comprobar el alcance legal del sitio

Antes de añadir soporte debe comprobarse que el sitio no esté dedicado a infracción de copyright, de acuerdo con la política del proyecto.

> Doc: [Adding support for a new site](https://github.com/yt-dlp/yt-dlp/blob/master/CONTRIBUTING.md#adding-support-for-a-new-site)

# Fork

El primer paso técnico es crear un fork del repositorio.

# Clone

Después se clona el fork del propio contribuidor.

```bash !sin-consola
git clone git@github.com:YOUR_GITHUB_USERNAME/yt-dlp.git
```

# Branch

La guía crea una rama con el nombre del extractor.

```bash !sin-consola
cd yt-dlp
git checkout -b yourextractor
```

```ejercicio
# Enunciado
Completa la opción de git checkout que crea una rama nueva.

# Plantilla
print("git checkout " + "___" + " yourextractor")

# Esperado
git checkout -b yourextractor

# Pista
La opción corta es una b minúscula.
```

# Archivo del extractor

El archivo se crea bajo:

```text
yt_dlp/extractor/yourextractor.py
```

# InfoExtractor

La plantilla oficial importa `InfoExtractor` desde `.common` y define una clase cuyo nombre termina en `IE`.

```ejercicio
# Enunciado
Completa el sufijo obligatorio del nombre de clase.

# Plantilla
print("YourExtractor" + "___")

# Esperado
YourExtractorIE

# Pista
Son las dos letras usadas para extractores.
```

# Cierre

La sesión siguiente descompone _VALID_URL, _TESTS y _real_extract.
