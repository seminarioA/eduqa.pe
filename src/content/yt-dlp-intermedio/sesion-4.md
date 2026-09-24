---
numero: 4
titulo: "Limpiar campos internos del info JSON"
---

# --clean-info-json

`--clean-info-json` elimina del info JSON determinados metadatos internos,
como nombres de archivos. Es el comportamiento predeterminado.

La operación no elimina el archivo `.info.json`; modifica qué campos internos
se conservan dentro de él.

> Doc: [Filesystem Options — --clean-info-json](https://github.com/yt-dlp/yt-dlp#filesystem-options)

```ejercicio
# Enunciado
Completa la opción predeterminada que elimina algunos campos internos del info JSON.

# Plantilla
print("___")

# Esperado
--clean-info-json

# Pista
El verbo de la opción es `clean`.
```

# Limpiar no significa anonimizar

Eliminar algunos campos internos no garantiza que el JSON quede sin información
personal. La advertencia de privacidad de `--write-info-json` sigue
aplicándose.

```opcion-multiple
# Enunciado
¿Qué garantiza --clean-info-json según el README?

# Opciones
- Que el archivo queda completamente anónimo
- Que se eliminan algunos metadatos internos, como nombres de archivo
- Que todos los campos se cifran
- Que el info JSON no se escribe

# Correcta
2

# Explicación
La opción limpia determinados campos internos; no se documenta como un mecanismo completo de anonimización.

# Pista
Distingue limpieza de campos internos de eliminación de todos los datos sensibles.
```

# --no-clean-info-json

`--no-clean-info-json` conserva todos los campos en el info JSON.

```ejercicio
# Enunciado
Completa la opción que conserva todos los campos del info JSON.

# Plantilla
print("___")

# Esperado
--no-clean-info-json

# Pista
Niega directamente --clean-info-json.
```

# Cierre

El comportamiento predeterminado elimina algunos campos internos del info JSON.
`--no-clean-info-json` conserva más información, pero ninguna de las dos
políticas sustituye una revisión de privacidad.

La sesión siguiente incorpora comentarios a los metadatos.
