---
numero: 42
titulo: "Builds y releases desde un fork"
---

# Build workflow

En un fork de GitHub, el workflow de build puede construir automáticamente las versiones seleccionadas como artifacts.

> Doc: [Compile — Forking the project](https://github.com/yt-dlp/yt-dlp#forking-the-project)

```text
.github/workflows/build.yml
```

```ejercicio
# Enunciado
Completa el nombre del workflow de build.

# Plantilla
print(".github/workflows/" + "___")

# Esperado
.github/workflows/build.yml

# Pista
El archivo se llama build.yml.
```

# Release workflow

El workflow `release.yml` crea releases completas según la configuración del fork.

```ejercicio
# Enunciado
Completa el archivo de release.

# Plantilla
print(".github/workflows/" + "___")

# Esperado
.github/workflows/release.yml

# Pista
El nombre es release.yml.
```

# Nightly workflow

`release-nightly.yml` permite crear prereleases/nightly releases.

```ejercicio
# Enunciado
Completa el workflow nightly.

# Plantilla
print(".github/workflows/" + "___")

# Esperado
.github/workflows/release-nightly.yml

# Pista
Une release y nightly con un guion.
```

# Artifacts y releases no son lo mismo

El workflow de build produce artifacts de workflow; los workflows de release crean publicaciones de release.

# Cierre

Con compilación y distribución cubiertas, la sesión siguiente comienza las diferencias históricas y funcionales respecto de youtube-dl.
