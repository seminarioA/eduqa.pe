---
numero: 55
titulo: "Orden de carga de configuraciones"
---

# Las opciones de CLI también son válidas en archivos

Un archivo de configuración contiene las mismas opciones que la línea de órdenes. yt-dlp las carga desde ubicaciones documentadas y en un orden concreto.

> Doc: [Configuration](https://github.com/yt-dlp/yt-dlp#configuration)

# Configuración principal

El archivo indicado mediante `--config-locations` ocupa la categoría de configuración principal.

```ejercicio
# Enunciado
Completa la opción que define la configuración principal.

# Plantilla
print("___")

# Esperado
--config-locations

# Pista
Ya se estudió en Introducción a yt-dlp con Python.
```

# Configuración portable

En una instalación binaria, `yt-dlp.conf` junto al binario actúa como configuración portable. Al ejecutar desde código fuente, se busca en el directorio padre de `yt_dlp`.

# Configuración home

yt-dlp busca `yt-dlp.conf` en el home configurado con `-P`; si no existe `-P`, busca en el directorio actual.

# Configuración de usuario

El README enumera ubicaciones basadas en XDG_CONFIG_HOME, APPDATA, el home del usuario y `.yt-dlp`.

# Configuración del sistema

Las ubicaciones del sistema son `/etc/yt-dlp.conf`, `/etc/yt-dlp/config` y `/etc/yt-dlp/config.txt`.

# --ignore-config dentro de un archivo

Si `--ignore-config` aparece dentro de una configuración, no se cargan configuraciones posteriores. En la configuración portable impide cargar home, user y system.

```opcion-multiple
# Enunciado
¿Qué efecto tiene --ignore-config dentro de la configuración portable?

# Opciones
- Impide cargar configuraciones posteriores como home, user y system
- Solo cambia el nombre de salida
- Activa simulación
- Elimina cookies

# Correcta
1

# Explicación
La opción corta la cadena de carga de configuraciones posteriores.

# Pista
Piensa en precedencia y orden de carga.
```

# Cierre

La sesión siguiente estudia la sintaxis exacta del archivo y cómo se decide su encoding.
