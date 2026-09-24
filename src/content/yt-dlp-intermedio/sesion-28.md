---
numero: 28
titulo: "Ordenar formatos con -S"
---

# -S y --format-sort

`-S` es la forma corta de `--format-sort`. Recibe una secuencia SORTORDER con los campos de ordenamiento.

> Doc: [Video Format Options — --format-sort](https://github.com/yt-dlp/yt-dlp#video-format-options)

```ejercicio
# Enunciado
Completa la forma corta de --format-sort.

# Plantilla
print("yt-dlp " + "___" + " res")

# Esperado
yt-dlp -S res

# Pista
Usa una S mayúscula.
```

# --format-sort-reset

`--format-sort-reset` descarta órdenes de usuario anteriores y vuelve al orden predeterminado.

```ejercicio
# Enunciado
Completa la opción que reinicia el orden.

# Plantilla
print("___")

# Esperado
--format-sort-reset

# Pista
Termina en `reset`.
```

# --format-sort-force

`--format-sort-force` fuerza a que el orden indicado por el usuario tenga precedencia sobre todos los campos. Su alias es `--S-force`.

```ejercicio
# Enunciado
Completa la opción que fuerza precedencia del orden del usuario.

# Plantilla
print("___")

# Esperado
--format-sort-force

# Pista
Termina en `force`.
```

# --no-format-sort-force

`--no-format-sort-force` conserva la precedencia especial de determinados campos y es el comportamiento predeterminado.

# Cierre

-S define preferencias de orden, reset elimina preferencias anteriores y force cambia su precedencia. La sesión siguiente controla múltiples streams.
