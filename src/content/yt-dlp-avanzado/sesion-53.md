---
numero: 53
titulo: "Compat options inseguras y límites de seguridad"
---

# allow-unsafe-ext

Esta compat option permite descargar archivos con cualquier extensión, incluidas extensiones que yt-dlp considera inseguras.

La documentación la vincula a un advisory de seguridad y advierte que puede habilitar ejecución remota de código.

> Doc: [Differences in default behavior — unsafe compat options](https://github.com/yt-dlp/yt-dlp#differences-in-default-behavior)

# Cuándo contempla el README su uso

Solo plantea su uso si una descarga legítima está siendo rechazada porque una extensión válida fue clasificada como poco común. Incluso en ese caso, recomienda considerar reportar el problema.

```opcion-multiple
# Enunciado
¿Qué riesgo documenta allow-unsafe-ext?

# Opciones
- Puede habilitar ejecución remota de código
- Solo reduce la velocidad
- Desactiva miniaturas
- Impide usar playlists

# Correcta
1

# Explicación
La advertencia de seguridad indica explícitamente riesgo de RCE.

# Pista
No es una preferencia de formato; modifica una barrera de seguridad.
```

# allow-unsafe-exec-expansion

`--exec` restringe por seguridad las conversiones de output template permitidas a enteros, float y shell quoting.

Esta compat option elimina esa restricción y reproduce el comportamiento de versiones entre 2021.04.11 y 2026.03.17.

La documentación también advierte que puede habilitar ejecución remota de código.

# %()q

Para valores string dentro de templates de comandos, el README recomienda la conversión `q`, que aplica quoting para shell.

```ejercicio
# Enunciado
Completa la conversión recomendada para strings insertados en comandos exec.

# Plantilla
print("%(filepath)___")

# Esperado
%(filepath)q

# Pista
Usa la letra de shell quoting.
```

# Regla del curso

Estas opciones se documentan porque forman parte del README y explican compatibilidad histórica. No se incorporan a ejemplos operativos normales ni a configuraciones recomendadas.

# Cierre

La sesión siguiente comienza el inventario de opciones deprecadas y sus reemplazos actuales.
