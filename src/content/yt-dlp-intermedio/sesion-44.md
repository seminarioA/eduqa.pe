---
numero: 44
titulo: "Analizar metadatos con --parse-metadata"
---

# --parse-metadata

`--parse-metadata [WHEN:]FROM:TO` extrae metadatos adicionales a partir de otros campos.

> Doc: [Post-Processing Options — --parse-metadata](https://github.com/yt-dlp/yt-dlp#post-processing-options)

```ejercicio
# Enunciado
Completa la opción que analiza metadatos.

# Plantilla
print("___")

# Esperado
--parse-metadata

# Pista
Combina `parse` y `metadata`.
```

# FROM:TO

Los dos puntos separan la fuente del destino.

```ejercicio
# Enunciado
Completa el separador entre fuente y destino.

# Plantilla
print("title___artist")

# Esperado
title:artist

# Pista
Se usa un carácter de dos puntos.
```

# WHEN

La etapa puede anteponerse antes de la fuente. Los valores de `WHEN` son los mismos que en `--use-postprocessor`; el valor predeterminado es `pre_process`.

```ejercicio
# Enunciado
Completa la etapa predeterminada.

# Plantilla
print("___")

# Esperado
pre_process

# Pista
Ocurre antes del procesamiento principal.
```

# Sintaxis completa más adelante

La sección MODIFYING METADATA define la sintaxis detallada de parsing. Esta sesión presenta la operación y su etapa; las expresiones completas se desarrollan después.

# Cierre

La sesión siguiente reemplaza texto dentro de campos existentes.
