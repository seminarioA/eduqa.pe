---
numero: 24
titulo: "Cabeceras HTTP personalizadas"
---

# --add-headers

`--add-headers FIELD:VALUE` añade una cabecera HTTP personalizada y su valor.

Los dos puntos (`:`) separan nombre y valor.

> Doc: [Workarounds — --add-headers](https://github.com/yt-dlp/yt-dlp#workarounds)

```ejercicio
# Enunciado
Completa la opción que añade una cabecera.

# Plantilla
print("yt-dlp " + "___")

# Esperado
yt-dlp --add-headers

# Pista
El nombre combina `add` y `headers`.
```

# FIELD:VALUE

```python
campo = "Referer"
valor = "https://example.com/"
print(f"{campo}:{valor}")
```

```salida
Referer:https://example.com/
```

```ejercicio
# Enunciado
Completa el separador entre nombre y valor.

# Plantilla
print("Referer___https://example.com/")

# Esperado
Referer:https://example.com/

# Pista
Se usa un carácter de dos puntos.
```

# Repetir la opción

`--add-headers` puede repetirse para añadir varias cabeceras.

```python
cabeceras = [("Referer", "https://example.com/"), ("X-Test", "1")]
print(len(cabeceras))
```

```salida
2
```

# Cabeceras sensibles

Authorization, cookies u otros valores pueden contener credenciales. No deben incrustarse en material público ni logs sin revisión.

# Cierre

Las cabeceras personalizadas modifican peticiones HTTP de manera explícita. La sesión siguiente cubre terminales sin soporte bidireccional.
