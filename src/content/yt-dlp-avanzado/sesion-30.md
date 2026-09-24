---
numero: 30
titulo: "extract_info() sin descarga"
---

# extract_info()

`YoutubeDL.extract_info` extrae información de una URL.

> Doc: [Embedding example — Extracting information](https://github.com/yt-dlp/yt-dlp#extracting-information)

```python !sin-consola
import yt_dlp

with yt_dlp.YoutubeDL({}) as ydl:
    info = ydl.extract_info("https://example.invalid/video", download=False)
```

# download=False

El argumento evita la descarga multimedia durante la extracción de información.

```ejercicio
# Enunciado
Completa el valor que desactiva descarga.

# Plantilla
valor = ___
print(valor)

# Esperado
False

# Pista
Usa el booleano falso de Python.
```

# El retorno no está garantizado como dict JSON-serializable

El README advierte que puede ser dictionary-like sin ser literalmente un diccionario ni serializable directamente.

```opcion-multiple
# Enunciado
¿Qué garantiza yt-dlp sobre el retorno de extract_info?

# Opciones
- No garantiza que sea dict ni JSON-serializable
- Siempre es un dict JSON puro
- Siempre es una cadena
- Siempre es una lista

# Correcta
1

# Explicación
La documentación recomienda sanitize_info cuando se necesita serialización.

# Pista
La advertencia aparece en Embedding yt-dlp.
```

# Cierre

La sesión siguiente transforma la información en una estructura serializable.
