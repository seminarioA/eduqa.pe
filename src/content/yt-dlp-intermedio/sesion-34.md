---
numero: 34
titulo: "Usuario, contraseña, 2FA y contraseña del vídeo"
---

# -u y --username

`-u` es la forma corta de `--username`. Recibe el identificador de cuenta.

> Doc: [Authentication Options — --username](https://github.com/yt-dlp/yt-dlp#authentication-options)

```ejercicio
# Enunciado
Completa la forma corta de --username.

# Plantilla
print("yt-dlp " + "___" + " USUARIO")

# Esperado
yt-dlp -u USUARIO

# Pista
Usa la inicial de username.
```

# -p y --password

`-p` es la forma corta de `--password`. Si se omite, yt-dlp puede solicitarla interactivamente.

```ejercicio
# Enunciado
Completa la forma corta de --password.

# Plantilla
print("yt-dlp " + "___" + " PASSWORD")

# Esperado
yt-dlp -p PASSWORD

# Pista
Usa la inicial de password.
```

# -2 y --twofactor

`-2` es la forma corta de `--twofactor` y recibe el código de autenticación de dos factores.

```ejercicio
# Enunciado
Completa la forma corta de --twofactor.

# Plantilla
print("yt-dlp " + "___" + " CODIGO")

# Esperado
yt-dlp -2 CODIGO

# Pista
La opción corta usa el número dos.
```

# --video-password

`--video-password PASSWORD` proporciona una contraseña específica del vídeo.

```ejercicio
# Enunciado
Completa la opción de contraseña del vídeo.

# Plantilla
print("___")

# Esperado
--video-password

# Pista
Combina `video` y `password`.
```

# Credenciales en la línea de órdenes

Escribir secretos directamente en un comando puede exponerlos en historial o listados de procesos. Cuando el extractor lo permite, conviene preferir mecanismos que no incorporen el secreto al texto del comando.

# Cierre

Cuenta, contraseña, 2FA y contraseña del vídeo son credenciales distintas. La sesión siguiente usa netrc.
