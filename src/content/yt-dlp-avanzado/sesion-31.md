---
numero: 31
titulo: "sanitize_info() y serialización JSON"
---

# sanitize_info()

`YoutubeDL.sanitize_info` transforma la información a una representación apta para serialización JSON.

> Doc: [Embedding example — Extracting information](https://github.com/yt-dlp/yt-dlp#extracting-information)

```ejercicio
# Enunciado
Completa el nombre del método de saneamiento.

# Plantilla
print("ydl." + "___")

# Esperado
ydl.sanitize_info

# Pista
Combina sanitize e info.
```

# json.dumps()

Después del saneamiento, el ejemplo oficial utiliza `json.dumps`.

```python
import json

info = {"id": "abc", "title": "Clase"}
print(json.dumps(info, sort_keys=True))
```

```salida
{"id": "abc", "title": "Clase"}
```

```ejercicio
# Enunciado
Completa la función que serializa a texto JSON.

# Plantilla
import json
print(json.___({"id": "abc"}, sort_keys=True))

# Esperado
{"id": "abc"}

# Pista
La función termina en dumps.
```

# Saneamiento no es anonimización

El método busca serializabilidad, no eliminación de información personal.

# Cierre

La sesión siguiente descarga desde un info JSON.
