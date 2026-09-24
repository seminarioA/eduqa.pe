---
numero: 30
titulo: "Preferencia por formatos libres"
---

# --prefer-free-formats

`--prefer-free-formats` da preferencia a contenedores libres frente a no libres cuando la calidad es equivalente.

El README indica que junto con `-S ext` puede usarse para preferir estrictamente contenedores libres con independencia de la calidad.

> Doc: [Video Format Options — --prefer-free-formats](https://github.com/yt-dlp/yt-dlp#video-format-options)

```ejercicio
# Enunciado
Completa la opción que prefiere contenedores libres.

# Plantilla
print("___")

# Esperado
--prefer-free-formats

# Pista
El nombre contiene `free-formats`.
```

# --no-prefer-free-formats

`--no-prefer-free-formats` no concede preferencia especial a contenedores libres y es el comportamiento predeterminado.

```ejercicio
# Enunciado
Completa la opción predeterminada.

# Plantilla
print("___")

# Esperado
--no-prefer-free-formats

# Pista
Niega la opción anterior.
```

# Calidad equivalente y preferencia estricta

Sin `-S ext`, la preferencia se evalúa entre formatos de calidad equivalente. Con el ordenamiento explícito por extensión cambia la prioridad.

# Cierre

La preferencia por contenedores libres interactúa con el ordenamiento de formatos. La sesión siguiente comprueba si los formatos son realmente descargables.
