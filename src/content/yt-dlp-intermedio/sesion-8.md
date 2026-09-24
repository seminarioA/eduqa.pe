---
numero: 8
titulo: "Cookies desde el navegador"
---

# --cookies-from-browser

`--cookies-from-browser BROWSER[+KEYRING][:PROFILE][::CONTAINER]` carga cookies desde un navegador soportado.

> Doc: [Filesystem Options — --cookies-from-browser](https://github.com/yt-dlp/yt-dlp#filesystem-options)

```ejercicio
# Enunciado
Completa la opción que carga cookies desde Firefox.

# Plantilla
print("yt-dlp " + "___" + " firefox")

# Esperado
yt-dlp --cookies-from-browser firefox

# Pista
Termina en `from-browser`.
```

# BROWSER

El README actual enumera Brave, Chrome, Chromium, Edge, Firefox, Opera, Safari, Vivaldi y Whale.

```ejercicio
# Enunciado
Completa un navegador soportado.

# Plantilla
navegador = "___"
print(navegador)

# Esperado
firefox

# Pista
Es el navegador de Mozilla.
```

# +KEYRING

En Chromium sobre Linux, el signo más (`+`) introduce el keyring.

```ejercicio
# Enunciado
Completa el separador del keyring.

# Plantilla
print("chrome___gnomekeyring")

# Esperado
chrome+gnomekeyring

# Pista
Es el signo más.
```

# :PROFILE

Un solo carácter de dos puntos (`:`) introduce el perfil.

```ejercicio
# Enunciado
Completa el separador de perfil.

# Plantilla
print("firefox___default-release")

# Esperado
firefox:default-release

# Pista
Usa un carácter de dos puntos.
```

# ::CONTAINER

Dos caracteres de dos puntos (`::`) introducen el contenedor de Firefox.

```ejercicio
# Enunciado
Completa el separador de contenedor.

# Plantilla
print("firefox___personal")

# Esperado
firefox::personal

# Pista
Usa dos caracteres de dos puntos.
```

# --no-cookies-from-browser

`--no-cookies-from-browser` evita cargar cookies desde el navegador y es el comportamiento predeterminado.

# Cierre

La sesión siguiente administra la caché persistente.
