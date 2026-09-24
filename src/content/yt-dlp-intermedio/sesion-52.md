---
numero: 52
titulo: "SponsorBlock: marcar y eliminar segmentos"
---

# --sponsorblock-mark

`--sponsorblock-mark CATS` crea capítulos para categorías de SponsorBlock separadas por comas.

> Doc: [SponsorBlock Options — --sponsorblock-mark](https://github.com/yt-dlp/yt-dlp#sponsorblock-options)

```ejercicio
# Enunciado
Completa la opción que marca categorías.

# Plantilla
print("___")

# Esperado
--sponsorblock-mark

# Pista
Termina en `mark`.
```

# Categorías y exclusión

Las categorías documentadas incluyen `sponsor`, `intro`, `outro`, `selfpromo`, `preview`, `filler`, `interaction`, `music_offtopic`, `hook`, `poi_highlight`, `chapter`, `all` y `default`.

Un guion delante de una categoría la excluye.

```ejercicio
# Enunciado
Completa la exclusión de preview.

# Plantilla
print("all,___preview")

# Esperado
all,-preview

# Pista
Usa un guion.
```

# --sponsorblock-remove

`--sponsorblock-remove CATS` elimina del archivo los segmentos de las categorías seleccionadas.

Si una categoría aparece tanto en mark como en remove, remove tiene precedencia.

```ejercicio
# Enunciado
Completa la opción que elimina segmentos.

# Plantilla
print("___")

# Esperado
--sponsorblock-remove

# Pista
Termina en `remove`.
```

# default no significa lo mismo en mark y remove

En mark, `default` equivale a `all`. En remove equivale a `all,-filler`, y `poi_highlight` y `chapter` no están disponibles para eliminación.

# --sponsorblock-chapter-title

`--sponsorblock-chapter-title TEMPLATE` define el título de capítulos creados por mark. Los campos disponibles se limitan a `start_time`, `end_time`, `category`, `categories`, `name` y `category_names`.

```ejercicio
# Enunciado
Completa la opción que personaliza el título de capítulo.

# Plantilla
print("___")

# Esperado
--sponsorblock-chapter-title

# Pista
Termina en `chapter-title`.
```

# --no-sponsorblock

`--no-sponsorblock` desactiva mark y remove.

# --sponsorblock-api

`--sponsorblock-api URL` cambia la ubicación de la API; el valor predeterminado documentado es `https://sponsor.ajay.app`.

# Cierre

La sesión siguiente controla reintentos y comportamiento de extractores.
