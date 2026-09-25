---
numero: 13
titulo: "Controlar archivos de configuración desde Python"
---

# Construir la ubicación de configuración desde Python

En Python, cada opción y cada valor se mantienen como elementos independientes de una lista. `comando_yt_dlp()` añade el intérprete y el módulo de yt-dlp; de este modo no es necesario concatenar una orden para que después la interprete un shell.

```python
argumentos = ["--config-locations", "yt-dlp.conf"]
comando = comando_yt_dlp(*argumentos)
print(" ".join(comando[3:]))
```

```salida
--config-locations yt-dlp.conf
```

> Doc: [yt-dlp — opción documentada](https://github.com/yt-dlp/yt-dlp#general-options)

```ejercicio
# Enunciado
Completa la primera opción de esta invocación.

# Plantilla
argumentos = ["___", "yt-dlp.conf"]
print(" ".join(comando_yt_dlp(*argumentos)[3:]))

# Esperado
--config-locations yt-dlp.conf

# Pista
La opción aparece en el título del punto principal de esta sesión.
```


# --ignore-config

`--ignore-config` impide cargar más archivos de configuración, salvo los que
se indiquen mediante `--config-locations`.

El alias documentado es `--no-config`. Si la opción aparece dentro de la
configuración del sistema, existe además una regla de compatibilidad por la que
no se carga la configuración del usuario.

> Doc: [General Options — --ignore-config](https://github.com/yt-dlp/yt-dlp#general-options)

```ejercicio
# Enunciado
Completa la opción que detiene la carga de más archivos de configuración.

# Plantilla
print("yt-dlp " + "___")

# Esperado
yt-dlp --ignore-config

# Pista
La opción comienza con `--ignore-`.
```

# --no-config-locations

`--no-config-locations` desactiva la carga de archivos de configuración
personalizados y es el valor predeterminado para esa categoría.

Cuando aparece dentro de un archivo de configuración, también descarta los
`--config-locations` anteriores definidos en ese mismo archivo.

> Doc: [General Options — --no-config-locations](https://github.com/yt-dlp/yt-dlp#general-options)

```ejercicio
# Enunciado
Completa la opción que elimina ubicaciones de configuración personalizadas.

# Plantilla
opcion = "--no-config-___"
print(opcion)

# Esperado
--no-config-locations

# Pista
La última palabra es el plural inglés de «ubicación».
```

# --config-locations

`--config-locations PATH` añade la ubicación de un archivo de configuración
principal. `PATH` puede apuntar al archivo o al directorio que lo contiene.

La opción puede repetirse, y también puede escribirse dentro de otros archivos
de configuración.

```bash !sin-consola
yt-dlp --config-locations "/etc/yt-dlp.conf" "URL"
```

> Doc: [General Options — --config-locations](https://github.com/yt-dlp/yt-dlp#general-options)

```ejercicio
# Enunciado
Completa la opción que recibe la ruta de un archivo de configuración.

# Plantilla
print("yt-dlp " + "___" + " config.txt")

# Esperado
yt-dlp --config-locations config.txt

# Pista
Usa el plural `locations`.
```

# El guion significa stdin

Para `--config-locations`, el valor `-` significa entrada estándar
(*standard input*, stdin). En ese caso el contenido de configuración se recibe
desde el flujo de entrada del proceso.

```python
ruta = "-"
print(ruta == "-")
```

```salida
True
```

```ejercicio
# Enunciado
Completa el valor especial que hace que la configuración se lea desde stdin.

# Plantilla
valor = "___"
print(valor)

# Esperado
-

# Pista
Es un único guion.
```

# Cierre con Python

Python dejó la ubicación de configuración representada como una lista explícita de argumentos que puede reutilizarse, validarse o ejecutarse con `ejecutar_yt_dlp()`.


`--ignore-config` detiene la carga posterior, `--no-config-locations`
descarta ubicaciones personalizadas y `--config-locations` añade archivos o
directorios concretos. El orden en que aparecen puede cambiar qué
configuraciones siguen activas.

La sesión siguiente controla los directorios donde yt-dlp busca plugins.
