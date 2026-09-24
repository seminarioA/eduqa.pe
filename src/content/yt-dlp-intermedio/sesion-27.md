---
numero: 27
titulo: "Seleccionar y listar formatos"
---

# -f y --format

`-f` es la forma corta de `--format`. Recibe una expresión FORMAT que selecciona el formato o combinación de formatos.

> Doc: [Video Format Options — --format](https://github.com/yt-dlp/yt-dlp#video-format-options)

```ejercicio
# Enunciado
Completa la forma corta de --format.

# Plantilla
print("yt-dlp " + "___" + " best")

# Esperado
yt-dlp -f best

# Pista
Usa la inicial de format.
```

# FORMAT es un lenguaje

Valores como `best` son solo una parte del lenguaje. FORMAT también admite combinaciones, fallbacks y filtros, que se desarrollan en las sesiones específicas de FORMAT SELECTION.

```ejercicio
# Enunciado
Completa un selector básico documentado.

# Plantilla
selector = "___"
print(selector)

# Esperado
best

# Pista
Selecciona el mejor formato combinado.
```

# -F y --list-formats

`-F` es la forma corta de `--list-formats`. Enumera los formatos disponibles de cada vídeo.

La operación simula salvo que se fuerce `--no-simulate`.

```ejercicio
# Enunciado
Completa la forma corta para listar formatos.

# Plantilla
print("yt-dlp " + "___")

# Esperado
yt-dlp -F

# Pista
Usa una F mayúscula.
```

# Inspeccionar antes de seleccionar

Listar formatos permite observar IDs, codecs, resoluciones y otros campos antes de construir una expresión `-f`.

# Cierre

`-F` inspecciona formatos y `-f` selecciona. La sesión siguiente controla el orden de preferencia.
