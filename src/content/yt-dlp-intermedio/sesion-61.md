---
numero: 61
titulo: "Alternativas, reemplazos y valores predeterminados"
---

# Alternativas con coma

Una coma (`,`) separa campos alternativos.

`%(release_date>%Y,upload_date>%Y|Unknown)s` intenta primero release y luego upload.

> Doc: [Output Template — alternatives](https://github.com/yt-dlp/yt-dlp#output-template)

```ejercicio
# Enunciado
Completa el separador de alternativas.

# Plantilla
print("%(release_year___upload_date)s")

# Esperado
%(release_year,upload_date)s

# Pista
Usa coma.
```

# Replacement con &

El ampersand (`&`) define un valor de reemplazo que se usa cuando el campo no está vacío.

```ejercicio
# Enunciado
Completa el separador de replacement.

# Plantilla
print("%(chapters___has chapters|no chapters)s")

# Esperado
%(chapters&has chapters|no chapters)s

# Pista
Usa ampersand.
```

# Default con |

La barra vertical (`|`) define un literal predeterminado cuando el campo está vacío.

```ejercicio
# Enunciado
Completa el separador del default.

# Plantilla
print("%(uploader___Unknown)s")

# Esperado
%(uploader|Unknown)s

# Pista
Usa barra vertical.
```

# Precedencia

Primero se resuelven alternativas; después replacement; el default se usa cuando no queda valor.

# Cierre

La sesión siguiente estudia conversiones adicionales.
