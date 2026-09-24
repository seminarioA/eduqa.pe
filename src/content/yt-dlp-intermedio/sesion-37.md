---
numero: 37
titulo: "Certificados de cliente"
---

# --client-certificate

`--client-certificate CERTFILE` indica un certificado de cliente en formato PEM. El archivo puede incluir también la clave privada.

> Doc: [Authentication Options — --client-certificate](https://github.com/yt-dlp/yt-dlp#authentication-options)

```ejercicio
# Enunciado
Completa la opción que recibe el certificado del cliente.

# Plantilla
print("___")

# Esperado
--client-certificate

# Pista
Combina `client` y `certificate`.
```

# --client-certificate-key

`--client-certificate-key KEYFILE` indica un archivo separado para la clave privada.

```ejercicio
# Enunciado
Completa la opción que recibe la clave privada.

# Plantilla
print("___")

# Esperado
--client-certificate-key

# Pista
Añade `key` al nombre del certificado.
```

# --client-certificate-password

`--client-certificate-password PASSWORD` recibe la contraseña de una clave privada cifrada. Si se omite, yt-dlp puede solicitarla interactivamente.

```ejercicio
# Enunciado
Completa la opción que recibe la contraseña de la clave.

# Plantilla
print("___")

# Esperado
--client-certificate-password

# Pista
Termina en `password`.
```

# Cierre

La autenticación por certificado separa certificado, clave y contraseña. La sesión siguiente comienza postprocesamiento con extracción de audio.
