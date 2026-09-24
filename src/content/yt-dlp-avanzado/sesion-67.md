---
numero: 67
titulo: "Cuentas de prueba y límites de soporte de sitios"
---

# Cuentas necesarias para reproducir

Un mantenedor puede necesitar acceso a una cuenta del servicio para reproducir un problema.

La decisión de compartirla corresponde al usuario y el proyecto advierte que compartir credenciales implica riesgos.

> Doc: [Are you willing to share account details if needed?](https://github.com/yt-dlp/yt-dlp/blob/master/CONTRIBUTING.md#are-you-willing-to-share-account-details-if-needed)

# Prácticas recomendadas por la guía

La documentación recomienda comprobar que la persona tenga etiqueta `Member` o `Contributor`, usar una contraseña aleatoria antes de compartir y cambiarla después.

> Nota: Este curso no solicita ni utiliza credenciales reales. Las recomendaciones se explican porque forman parte de la guía oficial.

# Si no puede compartirse acceso

El issue puede quedar sin solución hasta que exista un desarrollador que tenga una cuenta adecuada y pueda trabajar en el problema.

# Sitios dedicados principalmente a infracción de copyright

yt-dlp sigue la política de youtube-dl de no añadir soporte a servicios usados principalmente para infringir copyright.

# Sitios de fakes pornográficos

La guía indica que tampoco se añaden sitios pornográficos especializados en contenido falso.

# Contenido únicamente protegido por DRM

El proyecto no puede dar soporte a servicios que sirven únicamente contenido protegido mediante DRM.

DRM significa *digital rights management*.

```opcion-multiple
# Enunciado
¿Qué servicio queda fuera del alcance declarado de soporte?

# Opciones
- Un servicio que solo entrega contenido protegido por DRM
- Un sitio público con vídeos sin DRM
- Un servicio con subtítulos
- Una playlist pública

# Correcta
1

# Explicación
La guía excluye servicios cuyo contenido es únicamente DRM.

# Pista
DRM impide el flujo normal de extracción admitido por el proyecto.
```

# Cierre

La sesión siguiente prepara el entorno oficial de desarrollo con Hatch.
