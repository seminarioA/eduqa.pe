---
numero: 5
titulo: "Recuperar comentarios"
---

# --write-comments

`--write-comments` recupera comentarios del vídeo para incluirlos dentro del
info JSON.

> Doc: [Filesystem Options — --write-comments](https://github.com/yt-dlp/yt-dlp#filesystem-options)

```ejercicio
# Enunciado
Completa la opción que solicita recuperar comentarios.

# Plantilla
print("yt-dlp " + "___")

# Esperado
yt-dlp --write-comments

# Pista
El nombre contiene `write` y `comments`.
```

# --get-comments

`--get-comments` es un alias de `--write-comments`. Los dos nombres activan
la misma operación.

```ejercicio
# Enunciado
Completa el alias documentado de --write-comments.

# Plantilla
print("--get-" + "___")

# Esperado
--get-comments

# Pista
La palabra que falta es `comments`.
```

# La extracción rápida es una excepción

El README aclara que algunos extractores recuperan comentarios aun sin
`--write-comments` cuando esa extracción se conoce como rápida.

```opcion-multiple
# Enunciado
¿Puede aparecer información de comentarios sin --write-comments?

# Opciones
- Nunca
- Sí, cuando el extractor conoce que obtenerlos es rápido
- Solo si se usa --proxy
- Solo si el vídeo se convierte a audio

# Correcta
2

# Explicación
La documentación contempla extractores donde recuperar comentarios es suficientemente rápido para hacerlo sin la opción explícita.

# Pista
El README describe una excepción basada en el coste de extracción.
```

# --no-write-comments

`--no-write-comments` evita solicitar comentarios salvo la excepción anterior.
Su alias es `--no-get-comments`.

```ejercicio
# Enunciado
Completa la opción principal que desactiva la solicitud explícita de comentarios.

# Plantilla
print("___")

# Esperado
--no-write-comments

# Pista
Niega directamente --write-comments.
```

# Cierre

Los comentarios se incorporan al info JSON. `--write-comments` los solicita
explícitamente, aunque determinados extractores pueden obtenerlos igualmente
cuando la operación es rápida.

La sesión siguiente reutiliza un info JSON ya guardado como entrada.
