---
numero: 26
titulo: "Descubrimiento de clases IE y PP"
---

# Clases terminadas en IE

Las clases públicas cuyo nombre termina en `IE` se importan como extractores.

> Doc: [Developing Plugins](https://github.com/yt-dlp/yt-dlp#developing-plugins)

```python
nombres = ["MiExtractorIE", "Auxiliar", "_BaseIE"]
print([n for n in nombres if n.endswith("IE")])
```

```salida
['MiExtractorIE', '_BaseIE']
```

```ejercicio
# Enunciado
Completa el sufijo de clases extractor.

# Plantilla
print("MiExtractor" + "___")

# Esperado
MiExtractorIE

# Pista
Son dos letras mayúsculas.
```

# Clases terminadas en PP

Las clases públicas terminadas en `PP` se importan como postprocesadores.

```ejercicio
# Enunciado
Completa el sufijo de postprocesadores.

# Plantilla
print("MiPostprocessor" + "___")

# Esperado
MiPostprocessorPP

# Pista
Son dos P mayúsculas.
```

# Prefijo _

Una clase con nombre iniciado por guion bajo se considera privada y no se exporta automáticamente.

# __all__

El módulo puede controlar qué nombres públicos se exportan mediante `__all__`.

# Módulos privados

Un archivo como `_myplugin.py` queda excluido por su prefijo.

# Cierre

La sesión siguiente reemplaza un extractor incorporado mediante plugin_name.
