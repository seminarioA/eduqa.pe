---
numero: 7
titulo: "Cookies desde un archivo"
---

# --cookies

`--cookies FILE` lee cookies desde un archivo con formato Netscape y utiliza el mismo archivo para volcar el cookie jar resultante.

> Doc: [Filesystem Options — --cookies](https://github.com/yt-dlp/yt-dlp#filesystem-options)

```ejercicio
# Enunciado
Completa la opción que usa cookies.txt.

# Plantilla
print("yt-dlp " + "___" + " cookies.txt")

# Esperado
yt-dlp --cookies cookies.txt

# Pista
La opción usa la palabra `cookies`.
```

# Cookie jar

Un cookie jar es el conjunto de cookies que conserva el cliente durante las peticiones HTTP. El archivo puede representar una sesión autenticada y debe tratarse como información sensible.

```opcion-multiple
# Enunciado
¿Por qué cookies.txt puede ser sensible?

# Opciones
- Porque puede representar una sesión autenticada
- Porque siempre contiene el vídeo
- Porque contiene FFmpeg
- Porque reemplaza el proxy

# Correcta
1

# Explicación
Las cookies pueden contener credenciales de sesión reutilizables.

# Pista
Piensa en autenticación de navegador.
```

# --no-cookies

`--no-cookies` evita leer o volcar cookies mediante archivo y es el comportamiento predeterminado.

```ejercicio
# Enunciado
Completa la opción predeterminada que desactiva cookies por archivo.

# Plantilla
print("___")

# Esperado
--no-cookies

# Pista
Niega --cookies.
```

# Cierre

La sesión siguiente carga cookies directamente desde un navegador.
