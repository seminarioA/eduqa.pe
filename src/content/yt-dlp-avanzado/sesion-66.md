---
numero: 66
titulo: "Contexto, un problema por issue y relevancia"
---

# Incluir el contexto mayor

Una feature request no debe reducir un problema amplio a una solución técnica prematura. La guía pide describir el escenario de uso completo cuando el contexto no es obvio.

> Doc: [Is there enough context in your bug report?](https://github.com/yt-dlp/yt-dlp/blob/master/CONTRIBUTING.md#is-there-enough-context-in-your-bug-report)

# Un problema por issue

Cada issue debe tratar un problema. Mezclar bugs distintos o combinar bug y feature request dificulta cerrar y revisar el trabajo.

```opcion-multiple
# Enunciado
¿Cuántos problemas debe tratar un issue según la guía?

# Opciones
- Uno
- Todos los problemas del usuario
- Al menos tres
- No existe criterio

# Correcta
1

# Explicación
Un issue atómico puede cerrarse cuando ese problema se resuelve.

# Pista
La sección pregunta “one problem, and one problem only?”.
```

# Site support

Una solicitud de soporte debe concentrarse en un sitio o backend relacionado, no combinar servicios independientes.

# Demanda real

Las solicitudes de funciones deben responder a una necesidad real del solicitante o de una persona con la que pueda comunicarse directamente, no a una idea hipotética que «podría ser útil».

# Preguntas sobre yt-dlp

Si el fallo pertenece a una GUI o aplicación que envuelve yt-dlp, debe reportarse primero al mantenedor de esa aplicación.

Si no puede proporcionarse verbose log, la guía considera que probablemente no corresponde abrir el issue en yt-dlp.

# Cierre

La sesión siguiente cubre cuentas, límites de responsabilidad y tipos de sitios que el proyecto no soporta.
