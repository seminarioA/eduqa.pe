---
numero: 12
titulo: "Configurar búsquedas y URLs no calificadas desde Python"
---

# Construir la política de búsqueda predeterminada desde Python

En Python, cada opción y cada valor se mantienen como elementos independientes de una lista. `comando_yt_dlp()` añade el intérprete y el módulo de yt-dlp; de este modo no es necesario concatenar una orden para que después la interprete un shell.

```python
argumentos = ["--default-search", "ytsearch"]
comando = comando_yt_dlp(*argumentos)
print(" ".join(comando[3:]))
```

```salida
--default-search ytsearch
```

> Doc: [yt-dlp — opción documentada](https://github.com/yt-dlp/yt-dlp#general-options)

```ejercicio
# Enunciado
Completa la primera opción de esta invocación.

# Plantilla
argumentos = ["___", "ytsearch"]
print(" ".join(comando_yt_dlp(*argumentos)[3:]))

# Esperado
--default-search ytsearch

# Pista
La opción aparece en el título del punto principal de esta sesión.
```


# --default-search

`--default-search PREFIX` define qué prefijo utiliza yt-dlp cuando una entrada
no es una URL calificada.

El README usa `gvsearch2:python` como ejemplo de un prefijo de búsqueda:
solicita dos resultados de Google Videos para el término `python`.

> Doc: [General Options — --default-search](https://github.com/yt-dlp/yt-dlp#general-options)

```ejercicio
# Enunciado
Completa la opción que configura el prefijo para entradas que no son URLs calificadas.

# Plantilla
opcion = "--default-___"
print(opcion)

# Esperado
--default-search

# Pista
La palabra que falta es «búsqueda» en inglés.
```

# El prefijo forma parte de la interpretación

Un prefijo como `gvsearch2:` indica tanto un mecanismo de búsqueda como una
cantidad asociada a ese prefijo. El texto posterior es el término de búsqueda.

```python
prefijo = "gvsearch2:"
termino = "python"
print(prefijo + termino)
```

```salida
gvsearch2:python
```

```ejercicio
# Enunciado
Completa el número de resultados codificado en el prefijo del ejemplo oficial.

# Plantilla
prefijo = "gvsearch___:"
print(prefijo + "python")

# Esperado
gvsearch2:python

# Pista
El README indica que descarga dos vídeos.
```

# auto

El valor `auto` permite que yt-dlp intente inferir cómo interpretar la entrada.
`auto_warning` realiza esa inferencia y además emite una advertencia.

Son dos políticas distintas porque una añade una señal visible al proceso de
adivinación.

```ejercicio
# Enunciado
Completa el valor que intenta inferir la búsqueda y emite una advertencia.

# Plantilla
valor = "auto___"
print(valor)

# Esperado
auto_warning

# Pista
Añade un guion bajo seguido de «advertencia» en inglés.
```

# error

El valor `error` hace que una entrada no calificada produzca un error en lugar
de iniciar una búsqueda.

Esto resulta útil cuando el programa que llama a yt-dlp exige URLs explícitas y
no quiere convertir por accidente una cadena incompleta en una consulta.

```ejercicio
# Enunciado
Completa el valor que rechaza una entrada no calificada.

# Plantilla
print("--default-search " + "___")

# Esperado
--default-search error

# Pista
El valor tiene el mismo nombre que el resultado que provoca.
```

# fixup_error es el valor predeterminado

El valor predeterminado documentado es `fixup_error`. Intenta reparar URLs
rotas y, si no puede hacerlo, emite un error en lugar de buscar.

El guion bajo (`_`) forma parte del valor y separa las dos palabras.

> Doc: [General Options — --default-search](https://github.com/yt-dlp/yt-dlp#general-options)

```ejercicio
# Enunciado
Completa el valor predeterminado documentado para --default-search.

# Plantilla
valor = "fixup___error"
print(valor)

# Esperado
fixup_error

# Pista
Entre las dos palabras hay un guion bajo.
```

# Cierre con Python

Python dejó la política de búsqueda predeterminada representada como una lista explícita de argumentos que puede reutilizarse, validarse o ejecutarse con `ejecutar_yt_dlp()`.


`--default-search` decide cómo interpretar entradas que no son URLs
calificadas. Puede aplicar un prefijo, inferir, inferir con advertencia, rechazar
o intentar reparar según el valor configurado.

La sesión siguiente estudia qué archivos de configuración carga yt-dlp.
