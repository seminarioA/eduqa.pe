---
numero: 85
titulo: "pending-fixes, Wiki, FAQ y cierre de la ruta"
---

# pending-fixes

La etiqueta `pending-fixes` indica que un pull request tiene cambios solicitados pendientes.

> Doc: [My pull request is labeled pending-fixes](https://github.com/yt-dlp/yt-dlp/blob/master/CONTRIBUTING.md#my-pull-request-is-labeled-pending-fixes)

# Después de aplicar los cambios

La etiqueta debería retirarse cuando se resuelven las observaciones.

Si sigue presente varios días después de completar todos los cambios, la guía permite mencionar al mantenedor que la aplicó para solicitar una nueva revisión.

```opcion-multiple
# Enunciado
¿Qué indica pending-fixes?

# Opciones
- Hay cambios solicitados pendientes en el PR
- El release está publicado
- El extractor fue eliminado
- El vídeo tiene DRM

# Correcta
1

# Explicación
La etiqueta señala que la revisión pidió modificaciones.

# Pista
El nombre significa correcciones pendientes.
```

# Wiki

El README enlaza a la Wiki para documentación complementaria que cambia junto con el proyecto, incluida instalación y temas especializados.

> Doc: [yt-dlp Wiki](https://github.com/yt-dlp/yt-dlp/wiki)

# FAQ

El índice del README enlaza a FAQ dentro de la Wiki para problemas y preguntas recurrentes.

> Doc: [yt-dlp FAQ](https://github.com/yt-dlp/yt-dlp/wiki/FAQ)

# README, Wiki, código y ayuda local

El README describe interfaz y comportamiento general; la Wiki amplía procedimientos; `help(yt_dlp.YoutubeDL)` documenta la API instalada; el código fuente define el contrato efectivo de cada versión.

# Versiones cambian

Opciones, extractor args, clientes de sitios y comportamiento remoto pueden cambiar. Una integración mantenida debe comprobar la documentación correspondiente a la versión que ejecuta.

# Cierre del nivel avanzado

El nivel avanzado cubrió argumentos específicos de extractores, YouTube/EJS/PO Tokens, plugins, API Python embebida, selectores personalizados, compilación, diferencias con youtube-dl, compatibilidad, opciones deprecadas, apertura de issues, desarrollo de extractores y convenciones de contribución.

Con esta sesión termina la ruta **yt-dlp**:

1. **Introducción a yt-dlp**: instalación y operación completa de la CLI fundamental.
2. **yt-dlp intermedio**: filesystem auxiliar, salida estructurada, formatos, postprocesamiento, configuración, templates y metadata.
3. **yt-dlp avanzado**: extractores, extensibilidad, API Python, builds, compatibilidad y desarrollo.

No hay proyecto final: la última sesión cierra el contenido documental y técnico de la ruta.
