---
numero: 14
titulo: "Imprimir campos con --print"
---

# -O y --print

`-O` es la forma corta de `--print`. La opción imprime un campo o una output template en pantalla.

> Doc: [Verbosity and Simulation Options — --print](https://github.com/yt-dlp/yt-dlp#verbosity-and-simulation-options)

```ejercicio
# Enunciado
Completa la forma corta de --print.

# Plantilla
print("yt-dlp " + "___" + " title")

# Esperado
yt-dlp -O title

# Pista
Usa una O mayúscula.
```

# TEMPLATE

El argumento puede ser directamente un campo, como `title`, o una plantilla de salida.

```python
campo = "title"
print(campo)
```

```salida
title
```

# WHEN:TEMPLATE

La forma `[WHEN:]TEMPLATE` permite anteponer una etapa separada por dos puntos. Los valores de `WHEN` son los mismos que acepta `--use-postprocessor`; el valor predeterminado es `video`.

```ejercicio
# Enunciado
Completa el separador entre WHEN y TEMPLATE.

# Plantilla
print("video___%(title)s")

# Esperado
video:%(title)s

# Pista
Se utiliza el carácter de dos puntos.
```

# Efectos implícitos

`--print` implica `--quiet`. También implica simulación salvo que se use `--no-simulate` o una etapa posterior de `WHEN`.

```opcion-multiple
# Enunciado
¿Qué opción activa implícitamente --print?

# Opciones
- --quiet
- --proxy
- --write-subs
- --force-ipv6

# Correcta
1

# Explicación
La documentación indica que --print implica --quiet.

# Pista
Piensa en evitar salida adicional alrededor del valor impreso.
```

# Repetición

`--print` puede repetirse para emitir varias expresiones.

# Cierre

La impresión estructurada reutiliza campos y templates, puede asociarse a una etapa y modifica la simulación. La sesión siguiente escribe esas expresiones en un archivo.
