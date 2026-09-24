---
numero: 17
titulo: "TikTok: app_info y device_id"
---

# app_info

Habilita extracción mediante API móvil con una o más cadenas de información de app.

La forma general es:
`<iid>/[app_name]/[app_version]/[manifest_app_version]/[aid]`.

> Doc: [Extractor Arguments — tiktok](https://github.com/yt-dlp/yt-dlp#extractor-arguments)

# iid

Es el único componente obligatorio.

```ejercicio
# Enunciado
Completa el argumento mínimo usando un iid de ejemplo.

# Plantilla
print("tiktok:___=1234567890123456789")

# Esperado
tiktok:app_info=1234567890123456789

# Pista
El argumento se llama app_info.
```

# Separadores /

Los componentes se separan con barras. Los campos opcionales pueden omitirse manteniendo separadores cuando haga falta.

# Varias app_info

Pueden pasarse varias entradas separadas por coma.

# device_id

Habilita llamadas móviles con un device ID genuino.

Si no se proporciona, el README indica un ID aleatorio de 19 dígitos como default del mecanismo.

```ejercicio
# Enunciado
Completa el nombre del argumento de dispositivo.

# Plantilla
print("tiktok:___=DEVICE_ID")

# Esperado
tiktok:device_id=DEVICE_ID

# Pista
Combina device e id.
```

# Cierre

La sesión siguiente cubre Rokfin, Twitter, Stacommu/WrestleUniverse y Twitch.
