---
numero: 23
titulo: "Modelo y seguridad de plugins"
---

# Todos los plugins se importan

El README advierte que **todos** los plugins encontrados se importan aunque no se invoquen explícitamente.

> Doc: [Plugins](https://github.com/yt-dlp/yt-dlp#plugins)

# No existe verificación de código

yt-dlp no comprueba la seguridad del código de plugin. Un plugin ejecuta Python con los permisos del proceso.

> Nota: Instala únicamente plugins cuyo código y procedencia sean de confianza. Un plugin malicioso puede ejecutar código arbitrario con los permisos de yt-dlp.

```opcion-multiple
# Enunciado
¿Qué comprobación de seguridad realiza yt-dlp sobre el código de plugins antes de importarlo?

# Opciones
- Ninguna
- Verifica firma GPG obligatoria
- Ejecuta el plugin en un sandbox
- Solo permite código sin filesystem

# Correcta
1

# Explicación
El README indica expresamente que no se realizan checks sobre plugin code.

# Pista
La advertencia está al inicio de la sección Plugins.
```

# Extractor plugins

Se invocan automáticamente cuando la URL de entrada es adecuada y tienen prioridad sobre extractores incorporados.

# Postprocessor plugins

Se habilitan mediante `--use-postprocessor NAME`.

# Namespaces

Los namespaces son `yt_dlp_plugins.extractor` y `yt_dlp_plugins.postprocessor`.

```ejercicio
# Enunciado
Completa el namespace de extractores.

# Plantilla
print("yt_dlp_plugins.___")

# Esperado
yt_dlp_plugins.extractor

# Pista
Usa el tipo singular.
```

# YTDLP_NO_PLUGINS

Una variable de entorno no vacía con este nombre desactiva completamente la carga de plugins.

```ejercicio
# Enunciado
Completa el nombre de la variable.

# Plantilla
print("YTDLP_NO_" + "___")

# Esperado
YTDLP_NO_PLUGINS

# Pista
Termina en plural.
```

# Cierre

La sesión siguiente instala plugins en directorios de configuración.
