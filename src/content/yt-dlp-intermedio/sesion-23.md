---
numero: 23
titulo: "Workarounds de TLS y conexiones inseguras"
---

# --legacy-server-connect

`--legacy-server-connect` permite explícitamente conexiones HTTPS con servidores que no soportan la renegociación segura definida por RFC 5746.

> Doc: [Workarounds — --legacy-server-connect](https://github.com/yt-dlp/yt-dlp#workarounds)

```ejercicio
# Enunciado
Completa la opción para servidores HTTPS legacy.

# Plantilla
print("___")

# Esperado
--legacy-server-connect

# Pista
El nombre contiene `legacy` y `server`.
```

# --no-check-certificates

`--no-check-certificates` desactiva la validación de certificados HTTPS.

```ejercicio
# Enunciado
Completa la opción que desactiva validación de certificados.

# Plantilla
print("___")

# Esperado
--no-check-certificates

# Pista
El nombre contiene `certificates`.
```

# Consecuencia de desactivar validación

Sin validación de certificados, el cliente pierde una comprobación fundamental de identidad del servidor TLS.

> Nota: Esta opción existe como workaround. No debe convertirse en configuración predeterminada para resolver errores de certificados sin investigar su causa.

```opcion-multiple
# Enunciado
¿Qué se pierde al usar --no-check-certificates?

# Opciones
- La validación de certificados HTTPS
- El soporte de playlists
- El formato JSON
- La selección de subtítulos

# Correcta
1

# Explicación
La opción suprime exactamente esa verificación.

# Pista
Lee literalmente el nombre.
```

# --prefer-insecure

`--prefer-insecure` solicita una conexión no cifrada para recuperar información del vídeo cuando el extractor puede hacerlo.

```ejercicio
# Enunciado
Completa la opción que prefiere una conexión no cifrada.

# Plantilla
print("___")

# Esperado
--prefer-insecure

# Pista
Termina en `insecure`.
```

# Cierre

Estas opciones reducen garantías de transporte para compatibilidad con entornos concretos. La sesión siguiente añade cabeceras HTTP personalizadas.
