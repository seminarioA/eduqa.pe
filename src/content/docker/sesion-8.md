---
numero: 8
titulo: "Varios servicios con Compose"
---

# El problema de la línea de órdenes

Una aplicación real tiene más de un contenedor: la aplicación, la base de
datos, quizá una caché. Arrancarlos a mano significa recordar cada opción, en
orden y sin equivocarse, cada vez.

Compose lo declara en un archivo.

# El archivo

```bash
cat compose.yaml
```

```salida
services:
  web:
    build: .
    ports:
      - "8090:8000"
    environment:
      NOMBRE: compose
  cache:
    image: redis:7-alpine
```

> Doc: [Referencia del archivo Compose](https://docs.docker.com/reference/compose-file/)

Cada clave bajo `services` es un contenedor. `build` construye desde un
Dockerfile; `image` usa una ya hecha.

```ejercicio
# Enunciado
Completa la clave bajo la que se declaran los contenedores.

# Plantilla
import yaml
texto = "___:\n  web:\n    image: nginx\n"
print(list(yaml.safe_load(texto).keys()))

# Esperado
['services']

# Pista
Ocho letras: «servicios» en inglés.
```

# Levantar todo

```bash
docker compose up -d
docker compose ps
```

```salida
SERVICE   IMAGE            STATUS
cache     redis:7-alpine   Up 2 seconds
web       saludo-web   Up 2 seconds
```

> Doc: [docker compose up](https://docs.docker.com/reference/cli/docker/compose/up/)

> Doc: [docker compose ps](https://docs.docker.com/reference/cli/docker/compose/ps/)

```bash
curl -s localhost:8090
```

```salida
hola, compose
```

> Doc: [Puertos publicados](https://docs.docker.com/engine/network/#published-ports)

> Nota: `-d` es la misma de *detach* de la primera sesión: sin ella, `docker
> compose up` deja la terminal enganchada mostrando los registros de todos los
> servicios a la vez.
>
> La variable `NOMBRE` llegó desde el archivo, no desde la línea de
> órdenes. Todo lo que antes eran opciones sueltas queda escrito, versionado
> junto al código y reproducible por cualquiera que clone el repositorio.

```ejercicio
# Enunciado
Completa la opción que deja los servicios corriendo en segundo plano.

# Plantilla
print("docker compose up " + "___")

# Esperado
docker compose up -d

# Pista
Un guion y una letra: la inicial de «desacoplado» en inglés.
```

# Leer el archivo con Python

Es YAML, así que se puede comprobar antes de levantarlo.

```python
import yaml

texto = """
services:
  web:
    build: .
    ports:
      - "8090:8000"
    environment:
      NOMBRE: compose
  cache:
    image: redis:7-alpine
"""

config = yaml.safe_load(texto)
for nombre, servicio in config["services"].items():
    origen = servicio.get("image") or f"construido desde {servicio['build']}"
    puertos = servicio.get("ports", [])
    print(f"{nombre:7} {origen:24} puertos: {puertos or 'ninguno'}")
```

```salida
web     construido desde .       puertos: ['8090:8000']
cache   redis:7-alpine           puertos: ninguno
```

```ejercicio
# Enunciado
Completa la función de yaml que lee texto sin ejecutar nada de lo que traiga.

# Plantilla
import yaml
print(yaml.___("a: 1")["a"])

# Esperado
1

# Pista
Dos palabras unidas por guion bajo: «seguro» y «cargar», en inglés.
```

# Se encuentran por el nombre del servicio

Compose crea una red para el proyecto, y dentro cada servicio responde a su
nombre. La aplicación llama a `cache`, no a una dirección.

```python
config = {"services": {"web": {}, "cache": {}}}
for servicio in config["services"]:
    print(f"desde web: http://{servicio}:6379" if servicio == "cache" else "")
```

```salida

desde web: http://cache:6379
```

> Nota: Es el mismo mecanismo de la sesión anterior, pero sin tener que crear la
> red a mano. Y vuelve a aplicar la misma advertencia: dentro se usa el puerto
> interno, no el publicado.

```ejercicio
# Enunciado
Completa el nombre del servicio al que llamaría la aplicación web.

# Plantilla
print("redis://" + "___" + ":6379")

# Esperado
redis://cache:6379

# Pista
El otro servicio del archivo.
```

# Orden de arranque

`depends_on` fija el orden en que arrancan, pero **no espera a que el servicio
esté listo**: solo a que el contenedor exista.

```python
compose = {
    "services": {
        "web": {"depends_on": ["db"]},
        "db": {"image": "postgres:16-alpine"},
    }
}
web = compose["services"]["web"]
print("web arranca después de:", web["depends_on"])
print("¿espera a que la base acepte conexiones?", False)
```

```salida
web arranca después de: ['db']
¿espera a que la base acepte conexiones? False
```

> Nota: Es una fuente clásica de arranques fallidos: la aplicación intenta
> conectarse y la base todavía está inicializando. La solución es una
> comprobación de salud, o que la propia aplicación reintente, que es lo que
> tiene que hacer de todas formas.

```ejercicio
# Enunciado
Completa la clave que declara de qué otro servicio depende este.

# Plantilla
import yaml
c = yaml.safe_load("web:\n  depends_on:\n    - db\n")
print(c["web"]["___"])

# Esperado
['db']

# Pista
Dos palabras unidas por guion bajo: «depende de», en inglés.
```

# Bajar

```bash
docker compose down
```

```salida
 Container saludo-web-1    Removed
 Network saludo_default    Removing
 Network saludo_default    Removed
```

> Doc: [docker compose down](https://docs.docker.com/reference/cli/docker/compose/down/)

> Nota: `down` borra contenedores y red, pero **no los volúmenes**, que es lo
> correcto: bajar la aplicación no debería borrar la base de datos. Para eso
> se requiere `-v`, y conviene escribirlo despacio.

```ejercicio
# Enunciado
Completa el subcomando que detiene y elimina lo que levantó Compose.

# Plantilla
print("docker compose " + "___")

# Esperado
docker compose down

# Pista
Cuatro letras: lo contrario de «up».
```

> Doc: [Compose](https://docs.docker.com/compose/)

> Doc: [Referencia de services](https://docs.docker.com/reference/compose-file/services/)

# Cierre

Compose declara en un archivo lo que antes eran comandos largos: qué servicios
hay, cómo se construyen, qué puertos publican y en qué orden arrancan. Se
encuentran por el nombre del servicio, y `down` no elimina los volúmenes.

La última sesión junta las tres piezas de una aplicación real: nginx delante,
la aplicación detrás y postgres guardando.
