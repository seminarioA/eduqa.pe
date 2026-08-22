---
numero: 9
titulo: "Un stack completo: nginx, aplicación y base de datos"
---

# Lo que se va a levantar

Tres servicios, que es la forma en que está montada la mayoría de las
aplicaciones web:

- **nginx** recibe las peticiones desde fuera y las reenvía.
- **la aplicación** responde, y no está publicada: solo la alcanza nginx.
- **postgres** guarda los datos, con un volumen para que sobrevivan.

Todo lo de las ocho sesiones anteriores aparece aquí junto y en el orden en que
se usa de verdad.

# Los archivos

```bash
find . -type f | sort
```

```salida
./app/Dockerfile
./app/app.py
./compose.yaml
./nginx/default.conf
```

> Doc: [Cómo se organiza un proyecto con Compose](https://docs.docker.com/compose/gettingstarted/)

> Nota: La aplicación tiene su propio `Dockerfile` porque se construye; nginx y
> postgres no, porque se usan tal cual desde sus imágenes oficiales. Es el
> reparto habitual: se construye lo propio y se reutiliza lo demás.

```ejercicio
# Enunciado
Completa cuántos servicios tiene el stack: el que recibe, el que responde y el que guarda.

# Plantilla
servicios = ["web", "api", "bd"]
print(len(servicios) == ___)

# Esperado
True

# Pista
Tres.
```

# El archivo de Compose

```bash
cat compose.yaml
```

```salida
services:
  web:
    image: nginx:1.27-alpine
    ports:
      - "8080:80"
    volumes:
      - ./nginx/default.conf:/etc/nginx/conf.d/default.conf:ro
    depends_on:
      - api
  api:
    build: ./app
  bd:
    image: postgres:16-alpine
    environment:
      POSTGRES_PASSWORD: secreto
      POSTGRES_DB: tienda
    volumes:
      - datos:/var/lib/postgresql/data

volumes:
  datos:
```

> Doc: [Referencia del archivo Compose](https://docs.docker.com/reference/compose-file/)

Cada pieza es una decisión de las sesiones anteriores:

- **`web` es el único con `ports`.** Una sola puerta al exterior.
- **La configuración de nginx entra con `:ro`**, de *read only*: nginx la lee y
  no puede estropearla.
- **`api` lleva `build` y no `image`**, porque es código propio.
- **`bd` recibe su contraseña por `environment`**, no dentro de la imagen.
- **El volumen `datos` se declara abajo**, en su propia sección, y Compose lo
  crea si no existe.

```ejercicio
# Enunciado
Completa la clave donde se declaran los volúmenes con nombre, fuera de los servicios.

# Plantilla
import yaml
c = yaml.safe_load("services:\n  bd: {}\nvolumes:\n  datos: null\n")
print(list(c["___"].keys()))

# Esperado
['datos']

# Pista
El plural de «volumen» en inglés.
```

# Levantarlo

```bash
docker compose up -d
```

```salida
 Container stack-bd-1 Started
 Container stack-api-1 Started
 Container stack-web-1 Starting
 Container stack-web-1 Started
```

> Doc: [docker compose up](https://docs.docker.com/reference/cli/docker/compose/up/)

> Nota: Los nombres llevan por delante `stack`, que es el del directorio, y por
> detrás un `-1`. Compose antepone el proyecto para que dos stacks distintos en
> la misma máquina no choquen, y añade el número porque un servicio puede tener
> varias réplicas.

```ejercicio
# Enunciado
Completa el prefijo que Compose añade a los contenedores, que procede del nombre del directorio.

# Plantilla
proyecto = "___"
print(f"{proyecto}-api-1")

# Esperado
stack-api-1

# Pista
El nombre del directorio del proyecto.
```

# Comprobar que están los tres

```bash
docker compose ps
```

```salida
SERVICE   IMAGE                STATUS
api       stack-api            Up 3 seconds
bd        postgres:16-alpine   Up 3 seconds
web       nginx:1.27-alpine    Up 3 seconds
```

> Doc: [docker compose ps](https://docs.docker.com/reference/cli/docker/compose/ps/)

> Nota: La imagen de `api` se llama `stack-api` porque Compose la construyó y le
> puso el nombre del proyecto. Las otras dos conservan el nombre de la imagen
> oficial, señal de que se usaron tal cual.

```ejercicio
# Enunciado
Completa el subcomando de Compose que lista los servicios y su estado.

# Plantilla
print("docker compose " + "___")

# Esperado
docker compose ps

# Pista
Dos letras, las mismas que listan procesos en Unix.
```

# La petición entra por nginx

```bash
curl -s localhost:8080
```

```salida
api viva en 9e71a8856080
```

> Doc: [Puertos publicados](https://docs.docker.com/engine/network/#published-ports)

> Nota: La petición fue a nginx, en el 8080, y la respuesta viene de la
> aplicación. En medio hubo un salto por la red interna que Compose creó sola,
> usando `api` como nombre. Ni la aplicación ni la base están publicadas.

```ejercicio
# Enunciado
Completa el puerto por el que se entra al stack desde tu máquina.

# Plantilla
print(f"http://localhost:{___}")

# Esperado
http://localhost:8080

# Pista
El lado de fuera del mapeo de nginx.
```

# La base responde por su nombre

```bash
docker compose exec bd psql -U postgres -d tienda -c "select 1 as vivo;"
```

```salida
 vivo 
------
    1
(1 row)
```

> Doc: [docker compose exec](https://docs.docker.com/reference/cli/docker/compose/exec/)

> Nota: `docker compose exec` toma el nombre del **servicio**, no el del
> contenedor: `bd`, no `stack-bd-1`. Es la ventaja de declararlo todo: los
> nombres del archivo son los que se usan en todos los comandos.

```ejercicio
# Enunciado
Completa el nombre del servicio de la base de datos tal como se declara en el archivo.

# Plantilla
print("docker compose exec " + "___" + " psql -U postgres")

# Esperado
docker compose exec bd psql -U postgres

# Pista
Dos letras, las del servicio que guarda los datos.
```

# Lo que hay que mirar antes de darlo por bueno

Tres comprobaciones que valen para cualquier stack:

```python
comprobaciones = [
    ("¿solo un servicio publica puertos?", True),
    ("¿los datos están en un volumen con nombre?", True),
    ("¿las contraseñas están fuera de la imagen?", True),
]
for pregunta, respuesta in comprobaciones:
    print(("ok  " if respuesta else "MAL "), pregunta)
```

```salida
ok   ¿solo un servicio publica puertos?
ok   ¿los datos están en un volumen con nombre?
ok   ¿las contraseñas están fuera de la imagen?
```

> Nota: La tercera es la que más se incumple. Una contraseña escrita en el
> `compose.yaml` está mejor que dentro de la imagen, pero sigue estando en el
> repositorio; lo que corresponde es sacarla a un archivo de entorno que no se
> versiona. Eso, y el resto de lo que un servidor real exige, es
> el curso intermedio.

```ejercicio
# Enunciado
Completa cuántos de los tres servicios deberían publicar puertos al exterior.

# Plantilla
print(1 == ___)

# Esperado
True

# Pista
Solo el que hace de puerta.
```

# Bajarlo

```bash
docker compose down
```

```salida
 Container stack-api-1 Stopped
 Container stack-api-1 Removing
 Container stack-api-1 Removed
 Network stack_default Removing
 Network stack_default Removed
```

> Doc: [docker compose down](https://docs.docker.com/reference/cli/docker/compose/down/)

> Nota: Los tres contenedores y la red desaparecen; el volumen `datos` no. Al
> volver a levantar el stack, la tienda sigue ahí. Para borrarlo también hace
> falta `docker compose down -v`, y conviene escribirlo despacio.

```ejercicio
# Enunciado
Completa la opción que además borra los volúmenes al bajar el stack.

# Plantilla
print("docker compose down " + "___")

# Esperado
docker compose down -v

# Pista
Un guion y la inicial de «volumen».
```

# Cierre

El curso está completo: de un contenedor suelto a tres servicios que se
encuentran por su nombre, con una sola puerta al exterior y los datos a salvo
en un volumen.

Lo que falta para llevar esto a un servidor —imágenes pequeñas, arrancar sin
privilegios, comprobaciones de salud, secretos fuera del repositorio, límites de
memoria y publicación en un registro— es el curso intermedio.
