---
numero: 9
titulo: "YouTube: incomplete data, Data Sync ID y Visitor Data"
---

# raise_incomplete_data

Hace que `Incomplete Data Received` produzca un error en lugar de una advertencia.

> Doc: [Extractor Arguments — youtube](https://github.com/yt-dlp/yt-dlp#extractor-arguments)

```ejercicio
# Enunciado
Completa el argumento que eleva incomplete data a error.

# Plantilla
print("youtube:___")

# Esperado
youtube:raise_incomplete_data

# Pista
Empieza con raise.
```

# data_sync_id

Sustituye el Data Sync ID de la cuenta usado en peticiones Innertube.

El README indica un caso donde puede ser necesario si se combinan determinados `player_skip`.

# visitor_data

Sustituye Visitor Data.

La documentación recomienda usarlo con `player_skip=webpage,configs` y sin cookies.

# Cookies para una sesión de navegador

Si lo que se necesita es una sesión de navegador, el README recomienda cookies en lugar de establecer manualmente Visitor Data, porque las cookies contienen Visitor ID.

```opcion-multiple
# Enunciado
¿Qué recomienda el README para reproducir una sesión de navegador?

# Opciones
- Pasar cookies
- Inventar Visitor Data
- Desactivar TLS
- Usar worst format

# Correcta
1

# Explicación
Las cookies contienen el Visitor ID de la sesión.

# Pista
La documentación contrasta visitor_data con cookies.
```

# Cierre

La sesión siguiente introduce Proof of Origin Tokens y sus contextos.
