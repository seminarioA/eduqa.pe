---
numero: 27
titulo: "Reemplazar extractores incorporados con plugins"
---

# Subclasificar un extractor

Un plugin puede heredar de un extractor incorporado.

# plugin_name

Para sustituir al extractor padre, la clase declara el keyword de clase `plugin_name`.

> Doc: [Developing Plugins](https://github.com/yt-dlp/yt-dlp#developing-plugins)

```python
class Base:
    pass

class MiExtractor(Base, plugin_name="mi_plugin"):
    pass
```

> Nota: El fragmento muestra la sintaxis de keyword de clase, pero `Base` no implementa la infraestructura real de yt-dlp y no se ejecuta dentro de EDUQA.

```ejercicio
# Enunciado
Completa el nombre del keyword de clase usado para reemplazar el extractor padre.

# Plantilla
print("___")

# Esperado
plugin_name

# Pista
Une plugin y name con guion bajo.
```

# Evitar importación doble

Como la subclase reemplaza al padre, el README indica que debe ocultarse para no importarse también como extractor independiente.

Puede hacerse privada mediante los mecanismos de prefijo o exportación vistos en la sesión anterior.

# Topic yt-dlp-plugins

Los autores pueden añadir el topic `yt-dlp-plugins` al repositorio para mejorar descubribilidad.

# Desarrollo y tests de extractores

El README remite a Developer Instructions para escribir y probar extractores. Ese flujo se cubre al final del nivel avanzado.

# Cierre

La sesión siguiente introduce la integración programática de yt-dlp.
