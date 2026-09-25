---
numero: 43
titulo: "Construir output templates con Python"
---

# Mantener la plantilla como un valor Python

Una output template debe conservarse como una sola cadena. Python puede almacenarla, validarla y reutilizarla sin interpolar sus secuencias `%(...)s`.

```python
plantilla = "%(title)s [%(id)s].%(ext)s"
argumentos = ["--output", plantilla]
print(argumentos[1])
```

```salida
%(title)s [%(id)s].%(ext)s
```

> Doc: [Filesystem Options — --output](https://github.com/yt-dlp/yt-dlp#filesystem-options)

```ejercicio
# Enunciado
Completa el campo de extensión de la output template.

# Plantilla
plantilla = "%(title)s.%(___)s"
print(plantilla)

# Esperado
%(title)s.%(ext)s

# Pista
El campo tiene tres letras.
```


# -o y --output

`-o` es la forma corta de `--output`. La opción recibe una plantilla que
determina el nombre del archivo de salida.

La sintaxis completa de output templates es un lenguaje propio de yt-dlp y se
desarrolla en el curso intermedio. En esta sesión solo se introduce el campo
básico `%(title)s`.

> Doc: [Filesystem Options — --output](https://github.com/yt-dlp/yt-dlp#filesystem-options)
> Doc: [Output Template](https://github.com/yt-dlp/yt-dlp#output-template)

```ejercicio
# Enunciado
Completa la forma corta que configura una plantilla de salida.

# Plantilla
print("yt-dlp " + "___" + " '%(title)s.%(ext)s'")

# Esperado
yt-dlp -o '%(title)s.%(ext)s'

# Pista
La forma corta es una o minúscula.
```

# %(title)s

`%(title)s` inserta el campo `title` como cadena. El signo de porcentaje
(`%`) inicia la conversión; los paréntesis contienen el nombre del campo y
`s` solicita su representación como cadena.

```python
campo = "%(title)s"
print(campo)
```

```salida
%(title)s
```

```ejercicio
# Enunciado
Completa el nombre del campo que representa el título.

# Plantilla
print("%(___)s")

# Esperado
%(title)s

# Pista
El nombre es `title`.
```

# %(ext)s

`%(ext)s` representa la extensión final correspondiente al formato procesado.

Combinar título y extensión produce la forma básica
`%(title)s.%(ext)s`.

```python
plantilla = "%(title)s.%(ext)s"
print(plantilla)
```

```salida
%(title)s.%(ext)s
```

```ejercicio
# Enunciado
Completa el campo de extensión.

# Plantilla
print("%(___)s")

# Esperado
%(ext)s

# Pista
El nombre tiene tres letras.
```

# TYPES:TEMPLATE

Igual que `--paths`, `--output` puede anteponer un tipo seguido por dos
puntos para aplicar una plantilla a un tipo de archivo concreto.

La lista de tipos y los casos avanzados se estudiarán cuando se desarrolle el
lenguaje completo de templates.

# --output-na-placeholder

`--output-na-placeholder TEXT` define qué texto sustituye un campo no
disponible en la plantilla de salida. El valor predeterminado es `NA`.

```ejercicio
# Enunciado
Completa el placeholder predeterminado de campos no disponibles.

# Plantilla
placeholder = "___"
print(placeholder)

# Esperado
NA

# Pista
Son dos letras mayúsculas.
```

# Cierre con Python

La plantilla de salida quedó representada como dato Python y no como una cadena de shell con quoting implícito.


`--output` determina el nombre mediante una plantilla. Los campos básicos
`%(title)s` y `%(ext)s` insertan título y extensión;
`--output-na-placeholder` controla el texto de un campo ausente.

La sesión siguiente restringe y sanea nombres de archivo.
