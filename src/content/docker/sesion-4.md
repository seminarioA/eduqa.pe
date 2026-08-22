---
numero: 4
titulo: "El Dockerfile"
---

# La receta

Hasta aquí se usaron imágenes de otros. Una imagen propia se describe en un
archivo de texto llamado `Dockerfile`: una instrucción por línea, y cada una
produce una capa.

```bash
cat Dockerfile
```

```salida
FROM python:3.13-slim
WORKDIR /app
COPY app.py .
CMD ["python", "app.py"]
```

> Doc: [Referencia del Dockerfile](https://docs.docker.com/reference/dockerfile/)

Cuatro líneas: de qué se parte, en qué directorio se trabaja, qué se copia
dentro y qué se ejecuta al arrancar.

```ejercicio
# Enunciado
Completa la instrucción que declara la imagen de partida.

# Plantilla
receta = ["___ python:3.13-slim", "WORKDIR /app"]
print(receta[0])

# Esperado
FROM python:3.13-slim

# Pista
Cuatro letras: «desde» en inglés.
```

# Construir

`docker build` lee la receta y produce la imagen. El punto final es el
**contexto**: el directorio cuyo contenido se le entrega al constructor.

```bash
docker build -t saludo:1 .
```

```salida
#7 [3/3] COPY app.py .
#7 DONE 0.0s

#8 exporting to image
#8 exporting layers 0.0s done
#8 naming to docker.io/library/saludo:1 done
#8 DONE 0.1s
```

> Doc: [docker build](https://docs.docker.com/reference/cli/docker/buildx/build/)

> Nota: `-t` es de *tag*, «etiqueta»: le da nombre y versión a lo construido. Sin
> ella la imagen se crea igual, pero sin nombre, y solo se la puede referenciar
> por su identificador.
>
> Ese punto final no es decorativo. Todo lo que haya en ese directorio se envía
> al demonio antes de construir, así que un `.git` de 400 MB o una carpeta de
> dependencias hacen lenta la construcción aunque el Dockerfile no los copie.

```ejercicio
# Enunciado
Completa la opción que le pone nombre y etiqueta a la imagen construida.

# Plantilla
print("docker build " + "___" + " saludo:1 .")

# Esperado
docker build -t saludo:1 .

# Pista
Un guion y una letra: la inicial de «etiqueta» en inglés.
```

# Cada instrucción es una capa

```bash
docker history saludo:1 --format "{{.Size}}\t{{.CreatedBy}}"
```

```salida
0B        CMD ["python" "app.py"]
12.3kB    COPY app.py . # buildkit
8.19kB    WORKDIR /app
0B        CMD ["python3"]
16.4kB    RUN /bin/sh -c set -eux;  for src in idle3 pip3 pydoc3 …
```

> Doc: [docker history](https://docs.docker.com/reference/cli/docker/image/history/)

> Nota: Las tres primeras son las del Dockerfile, en orden inverso; las de abajo
> vienen de la imagen base. `CMD` y `WORKDIR` pesan casi nada porque no añaden
> archivos: solo metadatos.

```ejercicio
# Enunciado
Completa la instrucción que fija el directorio de trabajo dentro de la imagen.

# Plantilla
lineas = ["FROM python:3.13-slim", "___ /app", "COPY app.py ."]
print(lineas[1])

# Esperado
WORKDIR /app

# Pista
Dos palabras juntas en mayúsculas: «directorio de trabajo» en inglés.
```

# Leer un Dockerfile con Python

Un Dockerfile es texto, así que se puede analizar. Esto sirve para comprobar
recetas antes de construir.

```python
receta = """
FROM python:3.13-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
CMD ["python", "app.py"]
"""

def instrucciones(texto):
    for linea in texto.strip().splitlines():
        linea = linea.strip()
        if linea and not linea.startswith("#"):
            yield linea.split(maxsplit=1)[0]

print(list(instrucciones(receta)))
```

```salida
['FROM', 'WORKDIR', 'COPY', 'RUN', 'COPY', 'CMD']
```

```ejercicio
# Enunciado
Completa el método que separa la línea y devuelve la instrucción, que es la primera palabra.

# Plantilla
linea = "COPY app.py ."
print(linea.___(maxsplit=1)[0])

# Esperado
COPY

# Pista
Cinco letras: «partir» en inglés.
```

# CMD y ENTRYPOINT

`CMD` es de *command*, «orden»: dice qué ejecutar al arrancar, y se puede
sustituir escribiendo otra cosa en la línea de órdenes. `ENTRYPOINT`, «punto de
entrada», fija el ejecutable y lo que se pase se le añade como argumentos en
lugar de reemplazarlo.

La diferencia es quién manda: con `CMD`, quien ejecuta; con `ENTRYPOINT`, la
imagen.

```bash
docker run --rm saludo:1 python -c "print(2 + 2)"
```

```salida
4
```

> Doc: [docker run](https://docs.docker.com/reference/cli/docker/container/run/)

> Nota: El `CMD` de la imagen decía arrancar el servidor y aquí se ejecutó otra
> cosa: lo que va después del nombre de la imagen lo reemplaza. Si el programa
> tiene que ejecutarse siempre pase lo que pase, eso es `ENTRYPOINT`.

```ejercicio
# Enunciado
Completa la instrucción que se puede sustituir escribiendo otro comando al ejecutar.

# Plantilla
print("___ [\"python\", \"app.py\"]")

# Esperado
CMD ["python", "app.py"]

# Pista
Tres letras: la abreviatura inglesa de «comando».
```

# La forma con corchetes importa

`CMD ["python", "app.py"]` ejecuta el programa directamente. `CMD python
app.py` lo envuelve en un intérprete de shell, y entonces las señales de parada
llegan al shell y no al programa.

```python
import shlex

def es_forma_exec(instruccion):
    resto = instruccion.split(maxsplit=1)[1].strip()
    return resto.startswith("[")

for c in ['CMD ["python", "app.py"]', "CMD python app.py"]:
    print(c, "->", "exec" if es_forma_exec(c) else "shell")
```

```salida
CMD ["python", "app.py"] -> exec
CMD python app.py -> shell
```

> Nota: Aquí está el origen del código de salida 137 de la sesión anterior. En
> la forma de shell el proceso principal es `/bin/sh`, que no reenvía la señal
> de parada, así que la aplicación nunca se entera y hay que matarla.

```ejercicio
# Enunciado
Completa el carácter con el que empieza la forma que ejecuta el programa directamente.

# Plantilla
resto = '["python", "app.py"]'
print(resto.startswith("___"))

# Esperado
True

# Pista
Un corchete que abre.
```

# Reconstruir

Cambiar el código y volver a construir produce una imagen nueva. La etiqueta
antigua se queda sin nombre si se reutiliza.

```bash
docker build -t saludo:2 .
docker images saludo --format "{{.Tag}}  {{.Size}}"
```

```salida
estable  201MB
2        201MB
1        201MB
```

> Doc: [docker build](https://docs.docker.com/reference/cli/docker/buildx/build/)

> Doc: [docker images](https://docs.docker.com/reference/cli/docker/image/ls/)

```ejercicio
# Enunciado
Completa la etiqueta nueva para no pisar la anterior.

# Plantilla
version = ___
print(f"docker build -t saludo:{version} .")

# Esperado
docker build -t saludo:2 .

# Pista
Dos.
```

> Doc: [Referencia del Dockerfile](https://docs.docker.com/reference/dockerfile/)

# Cierre

Un Dockerfile es una lista de instrucciones y cada una añade una capa. `FROM`
elige la base, `COPY` mete archivos, `CMD` dice qué arrancar, y los corchetes
deciden si las señales llegan al programa.

La sesión siguiente explica por qué el orden de esas líneas cambia el tiempo de
cada construcción.
