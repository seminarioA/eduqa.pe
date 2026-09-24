---
numero: 58
titulo: "Sintaxis básica de OUTPUT TEMPLATE"
---

# -o define la plantilla y -P define la ruta

`-o` controla el nombre mediante una plantilla; `-P` controla las rutas base donde se guardan tipos de archivo.

> Doc: [Output Template](https://github.com/yt-dlp/yt-dlp#output-template)

# Nombre literal

Una plantilla puede ser un nombre literal, aunque el README desaconseja fijar manualmente una extensión porque el postprocesamiento puede producir otra.

```python
plantilla = "video.%(ext)s"
print(plantilla)
```

```salida
video.%(ext)s
```

# %(NAME)s

La secuencia básica tiene un signo de porcentaje, un nombre entre paréntesis y una conversión.

```ejercicio
# Enunciado
Completa el campo title.

# Plantilla
print("%(___)s")

# Esperado
%(title)s

# Pista
El campo contiene el título.
```

# Formato estilo printf de Python

También se admiten operaciones de formato como `%(playlist_index)05d`: ancho cinco, relleno con ceros y conversión decimal.

```python
print("%05d" % 7)
```

```salida
00007
```

```ejercicio
# Enunciado
Completa el ancho para obtener cinco dígitos.

# Plantilla
print(("%0___d" % 7))

# Esperado
00007

# Pista
El ancho total es cinco.
```

# Resultado tras postprocesamiento

El nombre real puede cambiar después de merge o conversiones. `--print after_move:filepath` obtiene la ruta final.

```ejercicio
# Enunciado
Completa la etapa que observa el nombre final.

# Plantilla
print("--print ___:filepath")

# Esperado
--print after_move:filepath

# Pista
La etapa se llama after_move.
```

# Cierre

La sesión siguiente navega estructuras y aplica slicing dentro de los campos.
