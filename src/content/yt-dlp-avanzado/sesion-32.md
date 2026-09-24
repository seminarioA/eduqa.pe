---
numero: 32
titulo: "download_with_info_file()"
---

# Un info JSON como entrada

El método `download_with_info_file(INFO_FILE)` inicia la descarga utilizando un archivo info JSON.

> Doc: [Embedding example — Download using an info-json](https://github.com/yt-dlp/yt-dlp#download-using-an-info-json)

```ejercicio
# Enunciado
Completa el nombre del método.

# Plantilla
print("ydl." + "___")

# Esperado
ydl.download_with_info_file

# Pista
El nombre contiene download, info y file.
```

# Código de error

El ejemplo oficial guarda el retorno en `error_code` y lo usa para distinguir éxito completo de fallos parciales.

```python
error_code = 0
print("All videos successfully downloaded" if not error_code else "Some videos failed to download")
```

```salida
All videos successfully downloaded
```

```ejercicio
# Enunciado
Completa el código convencional de éxito.

# Plantilla
error_code = ___
print(not error_code)

# Esperado
True

# Pista
Cero representa éxito.
```

# Cierre

La sesión siguiente configura extracción de audio desde la API Python.
