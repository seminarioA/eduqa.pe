---
numero: 16
titulo: "Instagram, NicoNicoChannelPlus y TikTok básico"
---

# instagram:app_id

Configura el valor del encabezado `X-IG-App-ID`. Puede ser un número real, `ios` o `web`; `web` es el default.

```ejercicio
# Enunciado
Completa el valor predeterminado de Instagram.

# Plantilla
print("instagram:app_id=___")

# Esperado
instagram:app_id=web

# Pista
Es el cliente web.
```

# niconicochannelplus:max_comments

Limita comentarios extraídos. El default documentado es 120.

```ejercicio
# Enunciado
Completa el límite predeterminado.

# Plantilla
print("niconicochannelplus:max_comments=___")

# Esperado
niconicochannelplus:max_comments=120

# Pista
Es un número de tres dígitos.
```

# tiktok:api_hostname

Host usado para llamadas de API móvil.

# tiktok:app_name

Nombre de aplicación móvil, por ejemplo `trill`.

# tiktok:app_version

Versión de aplicación; debe coordinarse con manifest_app_version.

# tiktok:manifest_app_version

Versión numérica de manifest.

# tiktok:aid

App ID usado en llamadas móviles.

```ejercicio
# Enunciado
Completa el argumento que representa App ID.

# Plantilla
print("tiktok:___=1180")

# Esperado
tiktok:aid=1180

# Pista
Tiene tres letras.
```

# Cierre

La sesión siguiente cubre app_info y device_id de TikTok.
