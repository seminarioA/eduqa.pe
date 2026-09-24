---
numero: 15
titulo: "Viki, YouTube Web Archive, GameJolt y Hotstar"
---

# vikichannel:video_types

Selecciona uno o más de `episodes`, `movies`, `clips` y `trailers`.

```ejercicio
# Enunciado
Completa el argumento de Viki.

# Plantilla
print("vikichannel:___=episodes")

# Esperado
vikichannel:video_types=episodes

# Pista
Combina video y types.
```

# youtubewebarchive:check_all

Solicita comprobaciones adicionales a costa de más peticiones. Los valores son `thumbnails` y `captures`.

# gamejolt:comment_sort

Valores `hot`, `you`, `top` y `new`; `hot` es el default. `you` necesita cookies.

```ejercicio
# Enunciado
Completa el orden predeterminado de GameJolt.

# Plantilla
print("gamejolt:comment_sort=___")

# Esperado
gamejolt:comment_sort=hot

# Pista
Significa «popular/caliente».
```

# hotstar:res

Resoluciones a ignorar: `sd`, `hd`, `fhd`.

# hotstar:vcodec

Codecs a ignorar: `h264`, `h265`, `dvh265`.

# hotstar:dr

Rangos dinámicos a ignorar: `sdr`, `hdr10`, `dv`.

```ejercicio
# Enunciado
Completa el argumento de rango dinámico.

# Plantilla
print("hotstar:___=dv")

# Esperado
hotstar:dr=dv

# Pista
Son dos letras.
```

# Cierre

La sesión siguiente cubre Instagram, NicoNicoChannelPlus y configuración base de TikTok.
