---
numero: 2
titulo: "Imágenes, etiquetas y capas"
---

# De dónde proceden las imágenes

Una imagen se descarga de un registro. El público por omisión es Docker Hub, y
`docker pull` la trae sin ejecutar nada.

```bash
docker pull alpine:3.21
```

```salida
3.21: Pulling from library/alpine
47d06d0b4ddf: Download complete
5bcc59937200: Download complete
Digest: sha256:48b0309ca019d89d40f670aa1bc06e426dc0931948452e8491e3d65087abc07d
Status: Downloaded newer image for alpine:3.21
docker.io/library/alpine:3.21
```

> Doc: [docker pull](https://docs.docker.com/reference/cli/docker/image/pull/)

```ejercicio
# Enunciado
Completa el subcomando que descarga una imagen sin ejecutarla.

# Plantilla
print("docker " + "___" + " alpine:3.21")

# Esperado
docker pull alpine:3.21

# Pista
Cuatro letras: «tirar de» en inglés, lo contrario de push.
```

# El nombre tiene partes

`python:3.13-slim` son dos cosas: el repositorio y la etiqueta. Si no se pone
etiqueta, Docker asume `latest`, que es la fuente de la mitad de los despliegues
irreproducibles.

```python
def partes(referencia):
    repositorio, _, etiqueta = referencia.partition(":")
    return repositorio, etiqueta or "latest"

for r in ["python:3.13-slim", "redis:7-alpine", "postgres"]:
    print(partes(r))
```

```salida
('python', '3.13-slim')
('redis', '7-alpine')
('postgres', 'latest')
```

> Nota: `latest` no significa «la más reciente»: es solo la etiqueta que se usa
> cuando no se dice otra. Nada impide que apunte a una versión antigua, y como
> puede reasignarse, la misma orden puede traer imágenes distintas en dos
> momentos. En producción se fija la versión.

```ejercicio
# Enunciado
Completa la etiqueta que Docker asume cuando no se indica ninguna.

# Plantilla
def partes(referencia):
    repositorio, _, etiqueta = referencia.partition(":")
    return repositorio, etiqueta or "___"

print(partes("postgres"))

# Esperado
('postgres', 'latest')

# Pista
Seis letras: «la última» en inglés.
```

# Qué hay en el disco

`--format` acepta una plantilla y evita tener que leer una tabla ancha; sin
ella, `docker images` imprime todas sus columnas.

```bash
docker images python
```

```salida
REPOSITORY   TAG         SIZE
python       3.13-slim   203MB
```

> Doc: [docker images](https://docs.docker.com/reference/cli/docker/image/ls/)

```ejercicio
# Enunciado
Completa el subcomando que lista las imágenes descargadas.

# Plantilla
print("docker " + "___" + " python")

# Esperado
docker images python

# Pista
Siete letras: el plural de «imagen» en inglés.
```

# Una imagen son capas

Una imagen no es un bloque: es una pila de capas, cada una con los cambios que
introdujo un paso de su construcción. Se apilan y el resultado es el sistema de
archivos que ve el contenedor.

```bash
docker history python:3.13-slim --format "{{.Size}}\t{{.CreatedBy}}"
```

```salida
0B        CMD ["python3"]
16.4kB    RUN /bin/sh -c set -eux;  for src in idle3 pip3 pydoc3 python3 …
43.7MB    RUN /bin/sh -c set -eux;   savedAptMark="$(apt-mark showmanual)" …
```

> Doc: [docker history](https://docs.docker.com/reference/cli/docker/image/history/)

> Nota: Las capas son de solo lectura y se comparten entre imágenes. Si dos
> imágenes parten de `python:3.13-slim`, esas capas están una sola vez en el
> disco. Por eso la suma de los tamaños que informa `docker images` es casi
> siempre mayor que el espacio realmente ocupado.

```ejercicio
# Enunciado
Completa el subcomando que muestra las capas de una imagen.

# Plantilla
print("docker " + "___" + " python:3.13-slim")

# Esperado
docker history python:3.13-slim

# Pista
Siete letras: «historial» en inglés.
```

# Las capas se comparten

Se puede calcular cuánto se ahorra: si tres imágenes comparten una base, esa
base se guarda una vez.

```python
base = 203
propio = [12, 40, 5]

print("sumando cada imagen entera:", sum(base + p for p in propio), "MB")
print("con la base compartida:    ", base + sum(propio), "MB")
```

```salida
sumando cada imagen entera: 666 MB
con la base compartida:     260 MB
```

```ejercicio
# Enunciado
Completa la función que suma los tamaños propios de cada imagen sobre una base compartida.

# Plantilla
base = 203
propio = [12, 40, 5]
print(base + ___(propio))

# Esperado
260

# Pista
Tres letras: la función de Python que suma un iterable.
```

# Las etiquetas son alias

Una misma imagen puede tener varios nombres. Etiquetar no copia nada: solo
añade otro rótulo al mismo contenido.

```bash
docker tag saludo:1 saludo:estable
docker images saludo --format "{{.Tag}}  {{.ID}}"
```

```salida
1        9e35bdff0531
estable  9e35bdff0531
```

> Doc: [docker tag](https://docs.docker.com/reference/cli/docker/image/tag/)

> Doc: [docker images](https://docs.docker.com/reference/cli/docker/image/ls/)

> Nota: El identificador es el mismo, así que no ocupa el doble. Ese
> identificador es lo único que designa la imagen sin ambigüedad; las etiquetas
> se mueven, el identificador no.

```ejercicio
# Enunciado
Completa el subcomando que añade otro nombre a una imagen existente.

# Plantilla
print("docker " + "___" + " saludo:1 saludo:estable")

# Esperado
docker tag saludo:1 saludo:estable

# Pista
Tres letras: «etiqueta» en inglés.
```

# Hacer sitio

Las imágenes y las capas sueltas se acumulan. `docker system df` dice cuánto
ocupan y `prune` borra lo que ya no usa nadie.

```bash
docker system df --format "{{.Type}}\t{{.Size}}\t{{.Reclaimable}}"
```

```salida
Images          9.533GB   6.697GB (70%)
Containers      9.744MB   2.748MB (28%)
Local Volumes   89.21MB   48.53MB (54%)
Build Cache     2.38GB    1.708GB
```

> Doc: [docker system df](https://docs.docker.com/reference/cli/docker/system/df/)

> Nota: `df` es el nombre del comando de Unix que informa del espacio en disco
> —*disk free*—, y aquí hace lo mismo para lo que ocupa Docker. La columna
> «Reclaimable» es lo que se recuperaría al limpiar.
>
> `docker system prune -a` borra todas las imágenes que no estén en uso
> por algún contenedor, no solo las huérfanas. En una máquina de trabajo suele
> ser lo que se quiere; en un servidor puede significar volver a descargarlo
> todo en el siguiente despliegue.

```ejercicio
# Enunciado
Completa el subcomando que informa del espacio que ocupa Docker.

# Plantilla
print("docker system " + "___")

# Esperado
docker system df

# Pista
Dos letras: el comando de Unix que informa del espacio en disco.
```

> Doc: [Imágenes y capas](https://docs.docker.com/get-started/docker-concepts/the-basics/what-is-an-image/)

# Cierre

Una imagen se identifica por repositorio y etiqueta, `latest` es solo un nombre
por omisión, y por dentro son capas de solo lectura que se comparten.

La sesión siguiente pasa a los contenedores y a su ciclo de vida.
