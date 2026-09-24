---
numero: 42
titulo: "Incrustar subtítulos y miniaturas"
---

# --embed-subs

`--embed-subs` incrusta subtítulos en vídeos MP4, WebM o MKV.

> Doc: [Post-Processing Options — --embed-subs](https://github.com/yt-dlp/yt-dlp#post-processing-options)

```ejercicio
# Enunciado
Completa la opción que incrusta subtítulos.

# Plantilla
print("___")

# Esperado
--embed-subs

# Pista
Combina `embed` y `subs`.
```

# --no-embed-subs

`--no-embed-subs` evita incrustarlos y es el comportamiento predeterminado.

```ejercicio
# Enunciado
Completa la opción predeterminada.

# Plantilla
print("___")

# Esperado
--no-embed-subs

# Pista
Niega --embed-subs.
```

# --embed-thumbnail

`--embed-thumbnail` incrusta la miniatura como portada del archivo.

```ejercicio
# Enunciado
Completa la opción que incrusta la miniatura.

# Plantilla
print("___")

# Esperado
--embed-thumbnail

# Pista
Combina `embed` y `thumbnail`.
```

# --no-embed-thumbnail

`--no-embed-thumbnail` evita incrustar portada y es el valor predeterminado.

# Cierre

Embedding modifica el archivo multimedia en lugar de dejar recursos separados. La sesión siguiente incrusta metadatos, capítulos e info JSON.
