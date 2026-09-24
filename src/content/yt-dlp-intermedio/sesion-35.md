---
numero: 35
titulo: "Autenticación con netrc"
---

# -n y --netrc

`-n` es la forma corta de `--netrc`. Activa datos de autenticación desde un archivo netrc.

> Doc: [Authentication Options — --netrc](https://github.com/yt-dlp/yt-dlp#authentication-options)

```ejercicio
# Enunciado
Completa la forma corta de --netrc.

# Plantilla
print("yt-dlp " + "___")

# Esperado
yt-dlp -n

# Pista
Usa una n minúscula.
```

# --netrc-location

`--netrc-location PATH` define el archivo netrc o el directorio que lo contiene. El valor predeterminado es `~/.netrc`.

```ejercicio
# Enunciado
Completa la opción que fija la ubicación del netrc.

# Plantilla
print("___")

# Esperado
--netrc-location

# Pista
Termina en `location`.
```

# --netrc-cmd

`--netrc-cmd NETRC_CMD` ejecuta un comando para obtener credenciales de un extractor.

```ejercicio
# Enunciado
Completa la opción que obtiene credenciales mediante un comando.

# Plantilla
print("___")

# Esperado
--netrc-cmd

# Pista
Termina en `cmd`.
```

# Cierre

netrc separa credenciales de la línea de órdenes. La sesión siguiente cubre Adobe Pass.
