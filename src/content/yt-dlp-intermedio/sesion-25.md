---
numero: 25
titulo: "Texto bidireccional en la terminal"
---

# --bidi-workaround

`--bidi-workaround` aplica un workaround para terminales sin soporte de texto bidireccional.

**Bidi** abrevia *bidirectional*: texto que puede combinar direcciones de escritura diferentes.

> Doc: [Workarounds — --bidi-workaround](https://github.com/yt-dlp/yt-dlp#workarounds)

```ejercicio
# Enunciado
Completa la opción de texto bidireccional.

# Plantilla
print("___")

# Esperado
--bidi-workaround

# Pista
Empieza con la abreviatura `bidi`.
```

# Dependencia externa

El README indica que la opción necesita el ejecutable `bidiv` o `fribidi` disponible en PATH.

```python
alternativas = ["bidiv", "fribidi"]
print(alternativas[1])
```

```salida
fribidi
```

```ejercicio
# Enunciado
Completa una de las dependencias admitidas.

# Plantilla
programa = "___"
print(programa)

# Esperado
fribidi

# Pista
Empieza y termina con `bidi`.
```

# PATH

La presencia del paquete en disco no basta si el ejecutable no puede localizarse a través del PATH o una ruta equivalente del entorno.

# Cierre

El workaround bidi corrige presentación de texto y depende de una herramienta externa. La sesión siguiente introduce esperas deliberadas.
