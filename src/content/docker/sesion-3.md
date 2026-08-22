---
numero: 3
titulo: "El ciclo de vida de un contenedor"
---

# Nace, corre, para y se borra

Un contenedor pasa por estados. `docker run` lo crea y lo arranca; `stop` lo
detiene pero **no lo borra**; `rm` lo elimina. Confundir los dos últimos deja
la máquina llena de contenedores parados.

```bash
docker stop web2
docker ps -a --filter name=web2 --format "{{.Names}}  {{.Status}}"
```

```salida
web2  Exited (137) Less than a second ago
```

> Doc: [docker stop](https://docs.docker.com/reference/cli/docker/container/stop/)

> Doc: [docker ps](https://docs.docker.com/reference/cli/docker/container/ls/)

> Nota: `docker ps` solo lista los que están corriendo; se requiere `-a`, de
> *all*, «todos», para ver también los parados. Es la opción que explica una
> confusión frecuente: un contenedor que «desapareció» casi siempre sigue ahí,
> parado, y solo hacía falta pedirlo.
>
> El nombre `ps` viene del comando de Unix que lista procesos —*process
> status*—, y la analogía es exacta: un contenedor es un proceso. El 137 del final es el código de salida: 128 más 9, es
> decir, terminado por la señal 9. Aparece cuando el proceso no atendió la
> petición de parar y hubo que forzarlo.

```ejercicio
# Enunciado
Completa la opción que hace que se listen también los contenedores parados.

# Plantilla
print("docker ps " + "___")

# Esperado
docker ps -a

# Pista
Un guion y una letra: la inicial de «todos» en inglés.
```

# El código de salida

```python
def explicar(codigo):
    if codigo == 0:
        return "terminó bien"
    if codigo > 128:
        return f"lo mató la señal {codigo - 128}"
    return f"terminó con error {codigo}"

for c in [0, 1, 137, 143]:
    print(c, "->", explicar(c))
```

```salida
0 -> terminó bien
1 -> terminó con error 1
137 -> lo mató la señal 9
143 -> lo mató la señal 15
```

> Nota: El 143 es la señal 15, que es la petición ordenada de parar. Si un
> contenedor termina con 143 se apagó como debía; con 137, no le dio tiempo y lo
> forzaron a los diez segundos. Ver 137 de forma sistemática suele indicar que
> la aplicación no atiende esa señal.

```ejercicio
# Enunciado
Completa el número que hay que restar al código de salida para obtener la señal.

# Plantilla
print(137 - ___)

# Esperado
9

# Pista
Ciento veintiocho.
```

# Los registros

Todo lo que el programa escribe por la salida estándar queda recogido.

```bash
docker logs web
docker logs --tail 5 -f web
```

```salida
192.168.65.1 - - [16/Aug/2026 02:26:54] "GET / HTTP/1.1" 200 -
```

> Doc: [docker logs](https://docs.docker.com/reference/cli/docker/container/logs/)

> Nota: Esa es la razón por la que en un contenedor **no se escribe a un archivo
> de registro**: se escribe a la salida estándar y que Docker se encargue. Un
> archivo dentro del contenedor desaparece con él, y nadie va a ir a buscarlo.

`--tail 5` limita cuántas líneas anteriores se muestran, y `-f` es de *follow*,
«seguir»: en vez de imprimir lo que hay y terminar, deja la conexión abierta y
va escribiendo cada línea nueva según llega. Se corta con Ctrl+C.

```ejercicio
# Enunciado
Completa la opción que deja el registro abierto siguiendo lo que llegue.

# Plantilla
print("docker logs " + "___" + " web")

# Esperado
docker logs -f web

# Pista
Un guion y una letra: la inicial de «seguir» en inglés.
```

# El contenedor es efímero

Lo que se escribe dentro de un contenedor vive mientras vive el contenedor.

```bash
docker exec web sh -c "echo dato > /tmp/prueba.txt && cat /tmp/prueba.txt"
docker rm -f web
docker run -d --name web -p 8080:8000 saludo:1
docker exec web cat /tmp/prueba.txt
```

```salida
dato
cat: /tmp/prueba.txt: No such file or directory
```

> Doc: [docker exec](https://docs.docker.com/reference/cli/docker/container/exec/)

> Doc: [docker rm](https://docs.docker.com/reference/cli/docker/container/rm/)

> Doc: [docker run](https://docs.docker.com/reference/cli/docker/container/run/)

> Nota: No es un fallo: es el diseño. El contenedor nuevo parte otra vez de la
> imagen, que no tiene ese archivo. Todo lo que deba sobrevivir tiene que salir
> del contenedor, y de eso trata la sesión de volúmenes.

Aquí `-f` es de *force*, «forzar», y no de *follow*: `docker rm` se niega a
borrar un contenedor en marcha, y esta opción lo para y lo borra en un paso. La
misma letra significa cosas distintas según el subcomando, y por eso conviene
leer la ayuda de cada uno en lugar de suponer.

```ejercicio
# Enunciado
Completa la opción que fuerza el borrado de un contenedor aunque esté corriendo.

# Plantilla
print("docker rm " + "___" + " web")

# Esperado
docker rm -f web

# Pista
Un guion y una letra: la inicial de «forzar» en inglés.
```

# Interactivo

`-it` son en realidad dos opciones juntas: `-i` de *interactive*, que mantiene
abierta la entrada estándar para poder escribir, y `-t` de *tty*, que asigna un
terminal virtual para que el intérprete de órdenes se comporte como en una
ventana normal —con símbolo del sistema y bordes de línea—.

Sin `-i` no se puede teclear nada; sin `-t` se puede, pero no aparece el
símbolo del sistema y la experiencia es confusa. Por eso casi siempre van
juntas. Sirve para entrar a explorar una imagen que no se conoce.

```bash
docker run --rm -it alpine:3.21 sh
```

```salida
/ # ls
bin    dev    etc    home   lib    media  mnt    opt    proc   root
run    sbin   srv    sys    tmp    usr    var
/ # exit
```

> Doc: [docker run](https://docs.docker.com/reference/cli/docker/container/run/)

```ejercicio
# Enunciado
Completa las dos opciones juntas que dan una terminal interactiva.

# Plantilla
print("docker run --rm " + "___" + " alpine:3.21 sh")

# Esperado
docker run --rm -it alpine:3.21 sh

# Pista
Un guion y dos letras: interactivo y terminal.
```

# Un contenedor corre un proceso

Cuando ese proceso termina, el contenedor termina. No hay nada más que
mantenerlo vivo.

```bash
docker run --rm alpine:3.21 echo hola
docker ps --filter ancestor=alpine:3.21 --format "{{.Names}}"
```

```salida
hola
```

> Doc: [docker run](https://docs.docker.com/reference/cli/docker/container/run/)

> Doc: [docker ps](https://docs.docker.com/reference/cli/docker/container/ls/)

> Nota: La segunda orden no imprime nada porque ya no queda ningún contenedor.
> De ahí viene una confusión frecuente al empezar: arrancar un contenedor con un
> comando que termina enseguida y no entender por qué «no se queda».

`--filter` acota la lista según una condición; `ancestor` es la que pregunta de
qué imagen desciende el contenedor.

```ejercicio
# Enunciado
Completa el filtro que busca contenedores creados a partir de una imagen concreta.

# Plantilla
print("docker ps --filter " + "___" + "=alpine:3.21")

# Esperado
docker ps --filter ancestor=alpine:3.21

# Pista
Ocho letras: «antepasado» en inglés.
```

# Inspeccionar

`docker inspect` devuelve la configuración completa en JSON, que se puede leer
con Python.

```python
import json

# Recorte real de lo que devuelve `docker inspect web`.
datos = json.loads('''
[{"Name": "/web",
  "State": {"Status": "running", "ExitCode": 0},
  "Config": {"Image": "saludo:1", "Env": ["NOMBRE=mundo"]},
  "NetworkSettings": {"Ports": {"8000/tcp": [{"HostPort": "8080"}]}}}]
''')

c = datos[0]
print(c["Name"].lstrip("/"), "->", c["State"]["Status"])
print("imagen:", c["Config"]["Image"])
print("puerto:", c["NetworkSettings"]["Ports"]["8000/tcp"][0]["HostPort"])
```

```salida
web -> running
imagen: saludo:1
puerto: 8080
```

```ejercicio
# Enunciado
Completa la clave que contiene el estado del contenedor.

# Plantilla
import json
c = json.loads('{"State": {"Status": "running"}}')
print(c["___"]["Status"])

# Esperado
running

# Pista
Cinco letras: «estado» en inglés, con mayúscula inicial.
```

> Doc: [Ciclo de vida de un contenedor](https://docs.docker.com/engine/containers/run/)

# Cierre

`stop` para y `rm` borra; los registros van a la salida estándar; lo que se
escribe dentro se pierde, y un contenedor vive lo que viva su proceso.

La sesión siguiente construye una imagen propia.
