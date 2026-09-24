---
numero: 43
titulo: "Incrustar metadatos, capítulos e info JSON"
---

# --embed-metadata

`--embed-metadata` incrusta metadatos en el archivo multimedia. También incorpora capítulos e info JSON cuando están disponibles, salvo que se desactiven de forma explícita.

Su alias es `--add-metadata`.

> Doc: [Post-Processing Options — --embed-metadata](https://github.com/yt-dlp/yt-dlp#post-processing-options)

```ejercicio
# Enunciado
Completa la opción que incrusta metadatos.

# Plantilla
print("___")

# Esperado
--embed-metadata

# Pista
Combina `embed` y `metadata`.
```

# --no-embed-metadata

`--no-embed-metadata` evita añadir metadatos y es el comportamiento predeterminado.

# --embed-chapters

`--embed-chapters` añade marcadores de capítulos. Su alias es `--add-chapters`.

```ejercicio
# Enunciado
Completa la opción que incrusta capítulos.

# Plantilla
print("___")

# Esperado
--embed-chapters

# Pista
Termina en `chapters`.
```

# --no-embed-chapters

`--no-embed-chapters` evita añadir capítulos y es el valor predeterminado.

# --embed-info-json

`--embed-info-json` incorpora el info JSON como attachment dentro de archivos MKV/MKA.

```ejercicio
# Enunciado
Completa la opción que incrusta info JSON.

# Plantilla
print("___")

# Esperado
--embed-info-json

# Pista
Termina en `info-json`.
```

# --no-embed-info-json

`--no-embed-info-json` evita ese attachment.

# Cierre

La sesión siguiente deriva campos de metadatos a partir de otros campos.
