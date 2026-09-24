---
numero: 6
titulo: "Cargar un info JSON existente"
---

# --load-info-json

`--load-info-json FILE` carga información de vídeo desde un archivo JSON creado previamente con `--write-info-json`.

> Doc: [Filesystem Options — --load-info-json](https://github.com/yt-dlp/yt-dlp#filesystem-options)

```ejercicio
# Enunciado
Completa la opción que carga video.info.json.

# Plantilla
print("yt-dlp " + "___" + " video.info.json")

# Esperado
yt-dlp --load-info-json video.info.json

# Pista
Empieza con `--load-`.
```

# Escribir y cargar son operaciones inversas

`--write-info-json` serializa información hacia un archivo; `--load-info-json` reutiliza esa información desde el archivo.

```python
operaciones = {"salida": "--write-info-json", "entrada": "--load-info-json"}
print(operaciones["entrada"])
```

```salida
--load-info-json
```

```ejercicio
# Enunciado
Completa la operación de entrada.

# Plantilla
operacion = "___"
print(operacion)

# Esperado
--load-info-json

# Pista
Usa `load`, no `write`.
```

# Estado serializado y estado remoto

El archivo conserva una captura de información, pero no garantiza que recursos temporales o URLs remotas sigan siendo válidos indefinidamente.

# Cierre

La sesión siguiente persiste cookies en un archivo.
