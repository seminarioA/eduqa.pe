---
numero: 18
titulo: "Rokfin, Twitter, Stacommu, WrestleUniverse y Twitch"
---

# rokfinchannel:tab

Selecciona una de `new`, `top`, `videos`, `podcasts`, `streams` o `stacks`.

# twitter:api

Selecciona `graphql`, `legacy` o `syndication`. El default es `graphql` y no tiene efecto cuando hay sesión autenticada.

```ejercicio
# Enunciado
Completa la API predeterminada de Twitter.

# Plantilla
print("twitter:api=___")

# Esperado
twitter:api=graphql

# Pista
Es la API moderna predeterminada.
```

# stacommu:device_id

Recibe el UUID asignado por el sitio para aplicar límites de dispositivos.

# wrestleuniverse:device_id

Comparte la misma operación y semántica.

# twitch:client_id

Configura el Client ID enviado en peticiones GraphQL.

```ejercicio
# Enunciado
Completa el nombre del argumento de Twitch.

# Plantilla
print("twitch:___=CLIENT_ID")

# Esperado
twitch:client_id=CLIENT_ID

# Pista
Combina client e id.
```

# Cierre

La sesión siguiente cubre NHK, NFL+ y JioCinema.
