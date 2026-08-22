---
numero: 7
titulo: "Redes y puertos"
---

# Dos preguntas distintas

Publicar un puerto es dejar que **tu máquina** llegue al contenedor. Poner dos
contenedores en la misma red es dejar que **se hablen entre ellos**. Son cosas
separadas y se confunden a menudo.

# Publicar

```bash
docker run -d --name web -p 8080:8000 saludo:1
curl -s localhost:8080
```

```salida
hola, mundo
```

> Doc: [docker run](https://docs.docker.com/reference/cli/docker/container/run/)

Sin `-p`, el contenedor corre igual pero nadie lo alcanza desde fuera.

```ejercicio
# Enunciado
Completa el lado del mapeo que corresponde al puerto de tu máquina.

# Plantilla
fuera, dentro = "8080", "8000"
print(f"-p {___}:{dentro}")

# Esperado
-p 8080:8000

# Pista
El de fuera va primero.
```

# El caso real: nginx delante de una aplicación

En producción casi nunca se publica la aplicación directamente. Delante va un
servidor web —nginx es el habitual— que recibe las peticiones y las reenvía. Se
llama *reverse proxy*, «proxy inverso», porque hace de intermediario en nombre
del servidor y no del cliente.

Su configuración dice a dónde reenviar, y ahí aparece el nombre del otro
contenedor:

```bash
cat nginx/default.conf
```

```salida
server {
    listen 80;
    location / {
        proxy_pass http://api:8000;
        proxy_set_header Host $host;
    }
}
```

> Doc: [Imagen oficial de nginx](https://hub.docker.com/_/nginx)

```bash
docker network create red-tienda
docker run -d --name api --network red-tienda api:1
docker run -d --name web --network red-tienda -p 8080:80 \
  -v "$PWD/nginx/default.conf":/etc/nginx/conf.d/default.conf:ro nginx:1.27-alpine
curl -s localhost:8080
```

```salida
api viva en 48e86435f948
```

> Nota: Fíjate en qué está publicado y qué no. `web` tiene `-p 8080:80`, así que
> se le llega desde fuera; `api` no tiene ningún `-p`, así que **desde tu
> máquina es inalcanzable**. Solo nginx puede hablar con ella, porque comparten
> red. Esa es la forma normal de montarlo: una única puerta al exterior.
>
> El identificador que responde es el nombre de máquina del contenedor de la
> api, que Docker fija al identificador corto. Sirve para comprobar de un
> vistazo a qué instancia llegó la petición cuando hay varias.

> Doc: [docker network create](https://docs.docker.com/reference/cli/docker/network/create/)

> Doc: [docker run](https://docs.docker.com/reference/cli/docker/container/run/)

# La aplicación no está publicada

```bash
curl -s --max-time 3 localhost:8000
```

```salida

```

> Nota: Sin respuesta. No es que la api esté caída: está viva y contestando a
> nginx en ese mismo instante. Lo que no tiene es una puerta desde tu máquina.

> Doc: [Puertos publicados](https://docs.docker.com/engine/network/#published-ports)

# Cómo se encuentran

Los contenedores de una misma red se encuentran **por su nombre**, sin conocer
ninguna dirección.

```bash
docker network create red-app
docker run -d --name api --network red-app saludo:1
docker run --rm --network red-app python:3.13-slim python -c \
  "import urllib.request; print(urllib.request.urlopen('http://api:8000').read().decode().strip())"
```

```salida
hola, mundo
```

> Doc: [docker network create](https://docs.docker.com/reference/cli/docker/network/create/)

> Doc: [docker run](https://docs.docker.com/reference/cli/docker/container/run/)

> Nota: `--network` conecta el contenedor a una red concreta en vez de a la que
> Docker usa por omisión, que es compartida por todo lo que no diga otra cosa.
>
> `api` no es un nombre de máquina que exista en ninguna parte: lo
> resuelve el DNS interno de esa red, y solo dentro de ella. Ese es el mecanismo
> con el que una aplicación encuentra a su base de datos sin que nadie escriba
> una dirección IP.

```ejercicio
# Enunciado
Completa el nombre por el que un contenedor encuentra a otro en la misma red.

# Plantilla
servicio = "___"
print(f"http://{servicio}:8000")

# Esperado
http://api:8000

# Pista
El nombre que se le dio al contenedor con --name.
```

# Fuera de la red no existe

```bash
docker run --rm python:3.13-slim python -c \
  "import urllib.request; urllib.request.urlopen('http://api:8000', timeout=3)"
```

```salida
URLError
```

> Doc: [docker run](https://docs.docker.com/reference/cli/docker/container/run/)

> Nota: El mismo nombre que funcionaba antes ahora no resuelve, porque este
> contenedor está en otra red. El aislamiento es el comportamiento por omisión:
> nada se ve con nada salvo que se le diga.

```ejercicio
# Enunciado
Completa la opción que conecta un contenedor a una red concreta.

# Plantilla
print("docker run " + "___" + " red-app saludo:1")

# Esperado
docker run --network red-app saludo:1

# Pista
Dos guiones y siete letras: «red» en inglés.
```

# El puerto de dentro no cambia

Publicar hacia fuera no altera el puerto en el que escucha el programa. Entre
contenedores se usa siempre el de dentro.

```python
def como_llamar(desde, servicio, puerto_dentro, puerto_fuera):
    if desde == "mi máquina":
        return f"http://localhost:{puerto_fuera}"
    return f"http://{servicio}:{puerto_dentro}"

for desde in ["mi máquina", "otro contenedor"]:
    print(f"{desde:16} {como_llamar(desde, 'api', 8000, 8080)}")
```

```salida
mi máquina       http://localhost:8080
otro contenedor  http://api:8000
```

> Nota: Este es el error más repetido con Compose: configurar la aplicación para
> que llame a `localhost:8080` porque es lo que funciona en el navegador. Desde
> otro contenedor, `localhost` es él mismo.

```ejercicio
# Enunciado
Completa el puerto que se usa al llamar desde otro contenedor.

# Plantilla
print(f"http://api:{___}")

# Esperado
http://api:8000

# Pista
El puerto de dentro, no el publicado.
```

# Ver las redes

```bash
docker network ls --filter name=web
```

```salida
NETWORK ID     NAME        DRIVER    SCOPE
d0e7ad38c19a   red-app   bridge    local
```

> Doc: [docker network ls](https://docs.docker.com/reference/cli/docker/network/ls/)

```ejercicio
# Enunciado
Completa el subcomando que gestiona las redes.

# Plantilla
print("docker " + "___" + " ls")

# Esperado
docker network ls

# Pista
Siete letras: «red» en inglés.
```

# Publicar solo en local

`-p 8080:8000` escucha en todas las interfaces, incluida la que ve el resto de
la red. Anteponer `127.0.0.1` lo limita a tu máquina.

```bash
docker run -d --name privado -p 127.0.0.1:8083:8000 saludo:1
docker port privado
```

```salida
8000/tcp -> 127.0.0.1:8083
```

> Doc: [docker run](https://docs.docker.com/reference/cli/docker/container/run/)

> Doc: [docker port](https://docs.docker.com/reference/cli/docker/container/port/)

> Nota: `127.0.0.1` es la dirección de bucle local: el tráfico dirigido a ella no
> abandona la máquina. Ponerla delante del puerto limita la publicación a
> conexiones que nazcan en el propio equipo.
>
> En un portátil da igual; en un servidor con IP pública, no. Un `-p` sin
> dirección expone el servicio a internet aunque el cortafuegos del sistema
> diga otra cosa, porque Docker escribe sus propias reglas.

```ejercicio
# Enunciado
Completa la dirección que limita la publicación a la propia máquina.

# Plantilla
print("-p " + "___" + ":8083:8000")

# Esperado
-p 127.0.0.1:8083:8000

# Pista
La dirección de bucle local.
```

> Doc: [Redes](https://docs.docker.com/engine/network/)

# Cierre

`-p` abre el contenedor hacia tu máquina; una red compartida los abre entre
ellos y les da nombres. Desde otro contenedor se usa el puerto de dentro, y
`127.0.0.1` delante evita publicar a todo el mundo sin querer.

La sesión siguiente deja de escribir comandos largos y lo declara todo en un
archivo.
