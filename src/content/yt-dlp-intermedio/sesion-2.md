---
numero: 2
titulo: "Guardar metadatos en info JSON"
---

# --write-info-json

`--write-info-json` escribe los metadatos extraídos en un archivo
`.info.json`. JSON significa *JavaScript Object Notation* y representa datos
estructurados.

```bash !sin-consola
yt-dlp --write-info-json "URL"
```

> Doc: [Filesystem Options — --write-info-json](https://github.com/yt-dlp/yt-dlp#filesystem-options)

```ejercicio
# Enunciado
Completa la opción que escribe un archivo .info.json.

# Plantilla
print("yt-dlp " + "___")

# Esperado
yt-dlp --write-info-json

# Pista
El nombre contiene `write`, `info` y `json`.
```

# El archivo conserva estructura

A diferencia de un archivo de descripción, un `.info.json` conserva campos
que pueden volver a procesarse como datos.

```python
import json

metadata = {"id": "abc123", "title": "Clase"}
print(json.dumps(metadata, sort_keys=True))
```

```salida
{"id": "abc123", "title": "Clase"}
```

> Doc: [json.dumps()](https://docs.python.org/3/library/json.html#json.dumps)

```ejercicio
# Enunciado
Completa la función que serializa un diccionario de Python como JSON.

# Plantilla
import json
print(json.___({"id": "abc123"}, sort_keys=True))

# Esperado
{"id": "abc123"}

# Pista
La función termina en `dumps`.
```

# Puede contener información personal

El README advierte expresamente que un `.info.json` puede contener información
personal. El archivo no debe publicarse sin revisar sus campos.

> Nota: El hecho de que el archivo sea JSON no lo vuelve anónimo. Su contenido
> depende de los metadatos extraídos y del contexto de la sesión.

# --no-write-info-json

`--no-write-info-json` evita escribir el archivo y es el comportamiento
predeterminado.

```ejercicio
# Enunciado
Completa la opción predeterminada que no escribe el info JSON.

# Plantilla
print("___")

# Esperado
--no-write-info-json

# Pista
Niega directamente --write-info-json.
```

# Cierre

`--write-info-json` persiste metadatos estructurados y exige revisar posibles
datos personales antes de compartirlos. Por defecto, yt-dlp no crea el archivo.

La sesión siguiente decide si esas operaciones también generan metadatos de la
playlist.
