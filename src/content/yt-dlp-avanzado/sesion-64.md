---
numero: 64
titulo: "Descripción, páginas volcadas y URL de ejemplo"
---

# Describir el problema

La descripción debe permitir identificar qué falla, cómo podría corregirse y cómo se vería la solución propuesta.

> Doc: [Is the description of the issue itself sufficient?](https://github.com/yt-dlp/yt-dlp/blob/master/CONTRIBUTING.md#is-the-description-of-the-issue-itself-sufficient)

# Bug report

Además de explicar el fallo, el bug report debe incluir el verbose log completo con `-vU`.

# Unable to extract

Si aparece un error `Unable to extract` que no puede reproducirse desde varios países, la guía pide añadir `--write-pages` y compartir los archivos `.dump` resultantes.

```ejercicio
# Enunciado
Completa la opción que guarda páginas intermedias para depuración.

# Plantilla
print("___")

# Esperado
--write-pages

# Pista
Ya se estudió entre las opciones de diagnóstico.
```

# Site support request

Una solicitud para añadir soporte a un sitio debe incluir una URL de ejemplo que apunte a contenido reproducible.

La portada general del servicio normalmente no es una URL de ejemplo suficiente.

```opcion-multiple
# Enunciado
¿Qué debe contener una solicitud de soporte para un sitio?

# Opciones
- Una URL concreta con contenido
- Solo el dominio principal
- Únicamente una captura de pantalla
- Ninguna URL

# Correcta
1

# Explicación
El mantenedor necesita una entrada concreta con la que probar el extractor.

# Pista
La guía habla de example URL.
```

# Cierre

La sesión siguiente recorre versión, duplicados, opciones existentes y diferencias con youtube-dl antes de abrir un issue.
