---
numero: 22
titulo: "Forzar la codificación"
---

# --encoding

`--encoding ENCODING` fuerza la codificación de texto especificada. El README marca esta opción como experimental.

> Doc: [Workarounds — --encoding](https://github.com/yt-dlp/yt-dlp#workarounds)

```ejercicio
# Enunciado
Completa la opción que fuerza UTF-8.

# Plantilla
print("yt-dlp " + "___" + " utf-8")

# Esperado
yt-dlp --encoding utf-8

# Pista
La opción usa la palabra `encoding`.
```

# Codificación y contenido

Una codificación define cómo se interpretan bytes como texto. Forzar una codificación incorrecta puede producir caracteres inválidos o texto mal decodificado.

```python
texto = "Piura"
datos = texto.encode("utf-8")
print(datos.decode("utf-8"))
```

```salida
Piura
```

```ejercicio
# Enunciado
Completa el nombre de la codificación usada en el ejemplo.

# Plantilla
texto = "Piura"
print(texto.encode("___").decode("utf-8"))

# Esperado
Piura

# Pista
Es UTF-8.
```

# Workaround, no valor universal

La opción pertenece a Workarounds porque corrige entornos o respuestas con problemas específicos. No debe activarse sin una razón técnica concreta.

# Cierre

Forzar encoding cambia cómo se interpreta texto. La sesión siguiente cubre workarounds de TLS y conexiones inseguras.
