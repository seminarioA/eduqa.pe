---
numero: 63
titulo: "Abrir un issue reproducible con -vU"
---

# Canal correcto

Los bugs y sugerencias se reportan mediante GitHub Issues. El proyecto reserva Discord para discusiones y desaconseja enviar bug reports por correo personal salvo circunstancias excepcionales.

> Doc: [Opening an Issue](https://github.com/yt-dlp/yt-dlp/blob/master/CONTRIBUTING.md#opening-an-issue)

# -vU

El proyecto exige incluir la salida completa de yt-dlp ejecutado con `-vU`.

La opción combina `-v`, verbose, y `-U`, actualización/comprobación de versión.

```ejercicio
# Enunciado
Completa las opciones que el proyecto solicita añadir al comando al reportar un bug.

# Plantilla
print("yt-dlp " + "___" + " URL")

# Esperado
yt-dlp -vU URL

# Pista
Combina verbose y update sin espacio entre sus letras.
```

# La salida completa importa

Las primeras líneas incluyen versión de yt-dlp, Python, sistema operativo, FFmpeg, bibliotecas opcionales, proxy, request handlers y cantidad de extractores cargados.

Omitirlas dificulta reproducir el fallo.

# Texto, no screenshots

`CONTRIBUTING.md` solicita logs como texto plano dentro de una valla de código y rechaza screenshots como sustituto.

```opcion-multiple
# Enunciado
¿Cómo debe adjuntarse el verbose log?

# Opciones
- Como texto completo
- Solo como screenshot
- Solo la última línea del error
- No debe adjuntarse

# Correcta
1

# Explicación
El proyecto necesita buscar, copiar y analizar el log completo.

# Pista
La documentación dice plain text.
```

# Templates del issue

Las plantillas proporcionadas por GitHub deben completarse y no eliminarse.

# Issues incompletos

La documentación advierte que issues sin la salida completa suelen no ser reproducibles y pueden cerrarse como `incomplete`.

# Cierre

La sesión siguiente define qué debe contener la descripción y cuándo adjuntar páginas volcadas.
