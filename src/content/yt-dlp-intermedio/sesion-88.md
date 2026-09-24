---
numero: 88
titulo: "Sintaxis general de modificación de metadatos"
---

# Dos operaciones

yt-dlp modifica metadatos principalmente mediante `--parse-metadata` y `--replace-in-metadata`.

> Doc: [Modifying Metadata](https://github.com/yt-dlp/yt-dlp#modifying-metadata)

# Orden relativo

Las opciones conservan su orden relativo. Un replacement puede operar sobre un campo creado por parsing, y un parsing posterior puede operar sobre resultados de replacement.

```opcion-multiple
# Enunciado
¿Qué propiedad conservan parse y replace cuando aparecen varias veces?

# Opciones
- Su orden relativo
- Solo la última opción
- Orden alfabético
- Orden del extractor

# Correcta
1

# Explicación
La documentación permite encadenar transformaciones en el orden declarado.

# Pista
Una transformación puede depender de la anterior.
```

# Campos creados

Los campos creados mediante parsing pueden usarse después en output templates y afectar metadata embebida.

# Momento de modificación

La modificación ocurre antes de format selection, post-extraction y otros postprocesamientos. Etapas posteriores pueden añadir o reemplazar campos.

# Cierre

La sesión siguiente desarrolla FROM:TO, regex y campos especiales.
