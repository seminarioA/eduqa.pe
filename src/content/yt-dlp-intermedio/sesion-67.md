---
numero: 67
titulo: "Métricas, directos y disponibilidad"
---

# view_count y concurrent_view_count

`view_count` representa visualizaciones acumuladas; `concurrent_view_count` espectadores concurrentes actuales.

# like_count y dislike_count

Contadores de valoración positiva y negativa cuando el sitio los expone.

# repost_count

Cantidad de reposts.

# average_rating

Valoración media según la escala del sitio.

# comment_count

Cantidad de comentarios. El README advierte que algunos extractores solo conocen este valor al final.

# save_count

Cantidad de guardados o marcadores.

# age_limit

Restricción de edad en años.

# live_status

Puede ser `not_live`, `is_live`, `is_upcoming`, `was_live` o `post_live`.

# is_live y was_live

Booleanos para directo actual y contenido que originalmente fue directo.

# playable_in_embed

Indica si puede reproducirse en players embebidos.

# availability

Puede describir estados como `private`, `premium_only`, `subscriber_only`, `needs_auth`, `unlisted` o `public`.

# media_type

Clasificación del sitio, por ejemplo episode, clip o trailer.

# start_time y end_time

Segundos de inicio y fin indicados por la URL.

> Doc: [Output Template — available fields](https://github.com/yt-dlp/yt-dlp#output-template)

```ejercicio
# Enunciado
Completa el campo que distingue un directo actual.

# Plantilla
print("%(___)s")

# Esperado
%(is_live)s

# Pista
Es booleano.
```

```ejercicio
# Enunciado
Completa el campo de guardados.

# Plantilla
print("%(___)s")

# Esperado
%(save_count)s

# Pista
Termina en count.
```

# Cierre

La sesión siguiente cubre extractor, URLs y clasificación.
