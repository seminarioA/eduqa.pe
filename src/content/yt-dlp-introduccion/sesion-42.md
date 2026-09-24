---
numero: 42
titulo: "Rutas de descarga con -P"
---

# -P y --paths

`-P` es la forma corta de `--paths`. La opción indica dónde deben guardarse
los archivos.

Su argumento tiene la forma opcional `TYPES:PATH`: un tipo de archivo, dos
puntos y una ruta.

> Doc: [Filesystem Options — --paths](https://github.com/yt-dlp/yt-dlp#filesystem-options)

```ejercicio
# Enunciado
Completa la forma corta que establece el directorio Descargas.

# Plantilla
print("yt-dlp " + "___" + " Descargas")

# Esperado
yt-dlp -P Descargas

# Pista
La opción corta es una P mayúscula.
```

# TYPES:PATH

Los dos puntos separan el tipo de archivo de la ruta. Los mismos tipos que admite
`--output` pueden utilizarse en `--paths`.

```python
tipo = "subtitle"
ruta = "subtitulos"
print(f"{tipo}:{ruta}")
```

```salida
subtitle:subtitulos
```

```ejercicio
# Enunciado
Completa el separador entre TYPE y PATH.

# Plantilla
print("subtitle___subtitulos")

# Esperado
subtitle:subtitulos

# Pista
Se utilizan dos puntos.
```

# home

`home` es el tipo predeterminado de ruta final. Representa el directorio base
al que yt-dlp mueve los archivos finales.

```ejercicio
# Enunciado
Completa el tipo especial que representa la ruta final predeterminada.

# Plantilla
tipo = "___"
print(tipo)

# Esperado
home

# Pista
Es «hogar» en inglés.
```

# temp

`temp` define la ruta temporal donde se descargan primero archivos
intermedios. Cuando termina la descarga, los archivos finales se trasladan a la
ruta `home`.

```bash !sin-consola
yt-dlp -P "home:descargas" -P "temp:temporales" "URL"
```

> Doc: [Filesystem Options — --paths](https://github.com/yt-dlp/yt-dlp#filesystem-options)

```ejercicio
# Enunciado
Completa el tipo reservado para archivos intermedios.

# Plantilla
print("___:temporales")

# Esperado
temp:temporales

# Pista
Es la abreviatura habitual de «temporal».
```

# Una salida absoluta prevalece

El README especifica que `--paths` se ignora cuando `--output` produce una
ruta absoluta.

Una ruta absoluta ya determina directamente dónde se escribe el archivo y, por
eso, no necesita combinarse con la base indicada por `--paths`.

# Cierre

`--paths` controla directorios y puede diferenciarlos por tipo. `home`
recibe el resultado final y `temp` recibe archivos intermedios antes del
traslado.

La sesión siguiente introduce la plantilla del nombre de salida.
