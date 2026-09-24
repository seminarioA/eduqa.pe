---
numero: 74
titulo: "Registrar y ejecutar tests del extractor"
---

# _extractors.py

Después de crear la clase debe añadirse un import en `yt_dlp/extractor/_extractors.py`.

El nombre de la clase debe terminar en `IE`.

> Doc: [Adding support for a new site](https://github.com/yt-dlp/yt-dlp/blob/master/CONTRIBUTING.md#adding-support-for-a-new-site)

# Coma final en imports parentizados

Cuando se añade un grupo de imports entre paréntesis, el último import debe llevar coma final para conservar el formato esperado por el formatter.

# hatch test YourExtractor

Ejecuta los tests específicos del extractor.

```bash !sin-consola
hatch test YourExtractor
```

```ejercicio
# Enunciado
Completa el subcomando Hatch usado para ejecutar tests.

# Plantilla
print("hatch " + "___" + " YourExtractor")

# Esperado
hatch test YourExtractor

# Pista
El subcomando se llama test.
```

# Numeración de varios tests

Los casos adicionales se denominan `YourExtractor_1`, `YourExtractor_2` y así sucesivamente.

Los casos `only_matching` no cuentan dentro de esa numeración.

# _all

`YourExtractor_all` ejecuta todos los tests del extractor.

```ejercicio
# Enunciado
Completa el sufijo que ejecuta todos los casos.

# Plantilla
print("YourExtractor" + "___")

# Esperado
YourExtractor_all

# Pista
Empieza con guion bajo.
```

# Al menos un test

La guía exige al menos un test. Si el contenido no puede probarse automáticamente, el caso debe existir con `skip` y explicar la razón.

# common.py

La documentación remite a `yt_dlp/extractor/common.py` para helpers y para el contrato detallado del info dict.

# Cierre

La sesión siguiente cubre formato, versiones de Python y publicación del pull request.
