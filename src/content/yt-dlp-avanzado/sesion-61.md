---
numero: 61
titulo: "Opciones eliminadas completamente"
---

# -A y --auto-number

Estas opciones estaban deprecadas desde 2014 y fueron eliminadas.

El reemplazo actual usa output templates:

```text
-o "%(autonumber)s-%(id)s.%(ext)s"
```

> Doc: [Deprecated options — Removed](https://github.com/yt-dlp/yt-dlp#removed)

```ejercicio
# Enunciado
Completa el campo que sustituye a --auto-number.

# Plantilla
print("%(___)s")

# Esperado
%(autonumber)s

# Pista
El campo se llama autonumber.
```

# -t, -l, --title y --literal

Las antiguas opciones de title/literal fueron eliminadas.

El reemplazo documentado es:

```text
-o "%(title)s-%(id)s.%(ext)s"
```

```ejercicio
# Enunciado
Completa el primer campo de la plantilla de reemplazo.

# Plantilla
print("%(___)s-%(id)s.%(ext)s")

# Esperado
%(title)s-%(id)s.%(ext)s

# Pista
El primer campo es el título.
```

# Eliminada no significa alias oculto

Una opción eliminada no debe conservarse en scripts esperando compatibilidad. Debe migrarse a su equivalente actual.

# Cierre

La compatibilidad histórica del README queda cubierta. La sesión siguiente empieza el proceso oficial de contribución y apertura de issues.
