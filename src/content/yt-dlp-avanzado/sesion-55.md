---
numero: 55
titulo: "Opciones redundantes y sus equivalentes modernos"
---

# Opciones get-*

Las opciones `--get-description`, `--get-duration`, `--get-filename`, `--get-format`, `--get-id`, `--get-thumbnail`, `--get-title` y `--get-url` tienen equivalentes directos mediante `--print`.

> Doc: [Deprecated options — Redundant options](https://github.com/yt-dlp/yt-dlp#redundant-options)

# --get-title

Su equivalente es `--print title`.

```ejercicio
# Enunciado
Completa el campo equivalente a --get-title.

# Plantilla
print("--print " + "___")

# Esperado
--print title

# Pista
El campo tiene el mismo sustantivo.
```

# --get-url

Su equivalente es `--print urls`.

# --match-title

Se expresa mediante `--match-filters "title ~= (?i)REGEX"`.

# --reject-title

Se expresa mediante negación regex en match filters.

# --min-views

Equivale a una comparación `view_count >=? COUNT`.

# --max-views

Equivale a `view_count <=? COUNT`.

```ejercicio
# Enunciado
Completa el campo usado para límites de visualizaciones.

# Plantilla
print("___ >=? 1000")

# Esperado
view_count >=? 1000

# Pista
Combina view y count.
```

# --break-on-reject

Se reemplaza por `--break-match-filters`.

# --user-agent

Se expresa con `--add-headers "User-Agent:UA"`.

# --referer

Se expresa con `--add-headers "Referer:URL"`.

# --playlist-start

Equivale a `-I NUMBER:`.

# --playlist-end

Equivale a `-I :NUMBER`.

# --playlist-reverse

Equivale a `-I ::-1`.

# --no-playlist-reverse

No requiere equivalente porque ese es el comportamiento predeterminado.

# --no-colors

Equivale a `--color no_color`.

# Cierre

La sesión siguiente cubre opciones que todavía funcionan, pero cuyo uso ya no se recomienda.
