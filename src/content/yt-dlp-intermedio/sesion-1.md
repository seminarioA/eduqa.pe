---
numero: 1
titulo: "Guardar la descripción del vídeo"
---

# --write-description

`--write-description` escribe la descripción del vídeo en un archivo
`.description`. El archivo es un recurso auxiliar: no sustituye al archivo
multimedia ni modifica su contenido.

```bash !sin-consola
yt-dlp --write-description "URL"
```

> Doc: [Filesystem Options — --write-description](https://github.com/yt-dlp/yt-dlp#filesystem-options)

```ejercicio
# Enunciado
Completa la opción que escribe la descripción en un archivo .description.

# Plantilla
print("yt-dlp " + "___")

# Esperado
yt-dlp --write-description

# Pista
El nombre une `write` y `description`.
```

# La extensión .description

La extensión `.description` identifica el archivo auxiliar generado por esta
opción. La descripción procede de los metadatos extraídos para el vídeo.

```python
titulo = "clase-01"
archivo = titulo + ".description"
print(archivo)
```

```salida
clase-01.description
```

```ejercicio
# Enunciado
Completa la extensión del archivo auxiliar de descripción.

# Plantilla
print("clase-01." + "___")

# Esperado
clase-01.description

# Pista
La extensión coincide con el nombre inglés del contenido.
```

# --no-write-description

`--no-write-description` impide escribir ese archivo y es el comportamiento
predeterminado documentado.

```ejercicio
# Enunciado
Completa la opción predeterminada que no escribe la descripción.

# Plantilla
print("___")

# Esperado
--no-write-description

# Pista
Niega directamente --write-description.
```

# Cierre

La descripción puede conservarse como un archivo auxiliar independiente con
`--write-description`; por defecto no se escribe. La sesión siguiente guarda
una representación estructurada mucho más amplia de los metadatos.
