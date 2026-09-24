---
numero: 68
titulo: "Entorno de desarrollo con Hatch"
---

# Hatch

yt-dlp usa Hatch como herramienta de gestión del proyecto.

La guía exige al menos la versión 1.10.0 para evitar funcionalidades incompatibles.

> Doc: [Developer Instructions](https://github.com/yt-dlp/yt-dlp/blob/master/CONTRIBUTING.md#developer-instructions)

# Instalación mediante pipx

La guía propone `pipx install hatch`, aunque también admite pip o el gestor de paquetes del sistema.

# hatch run setup

El primer comando recomendado al preparar una contribución instala el hook de pre-commit.

```bash !sin-consola
hatch run setup
```

```ejercicio
# Enunciado
Completa el comando inicial recomendado.

# Plantilla
print("hatch run " + "___")

# Esperado
hatch run setup

# Pista
El subcomando prepara el entorno.
```

# pre-commit

Antes de cada commit ejecuta checks y fixes requeridos de lint y formato.

Si modifica código, el commit se bloquea; el desarrollador debe revisar los cambios y volver a realizar el commit.

# hatch shell

Activa un entorno virtual con yt-dlp y dependencias de desarrollo.

# hatch fmt

Aplica formato y corrige violaciones que puede reparar.

# hatch test

Ejecuta tests de core o extractores.

```ejercicio
# Enunciado
Completa el comando de tests.

# Plantilla
print("hatch " + "___")

# Esperado
hatch test

# Pista
El subcomando se llama test.
```

# Cierre

La sesión siguiente prepara el entorno manual cuando Hatch no puede utilizarse.
