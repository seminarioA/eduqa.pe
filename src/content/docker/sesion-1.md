---
numero: 1
titulo: "Qué resuelve Docker"
---

# El problema

Un programa no se ejecuta solo: necesita una versión concreta del lenguaje,
unas bibliotecas, unas variables de entorno y un sistema operativo debajo. En
la máquina de quien lo escribió está todo eso; en otra, no necesariamente.

De ahí se origina la frase que dio nombre al problema: «en mi máquina
funciona». Docker responde empaquetando el programa **junto con todo lo que
necesita** para arrancar.

> Nota: Este curso ejecuta comandos en tu terminal, no en el navegador. Los
> bloques de shell traen la salida real de haberlos corrido; los de Python sí
> se ejecutan aquí y sirven para razonar sobre los archivos que vas a escribir.
> Para seguirlo necesitas Docker instalado.

# Dos palabras que se confunden

Una **imagen** es el paquete: un sistema de archivos con el programa y sus
dependencias, congelado y de solo lectura. Un **contenedor** es una ejecución
de esa imagen.

La relación es la misma que entre un programa en disco y un proceso corriendo:
de una imagen se crean tantos contenedores como se quieran, y cada uno tiene su
propia vida.

# El primer contenedor

```bash
docker run --rm hello-world
```

```salida
Unable to find image 'hello-world:latest' locally
latest: Pulling from library/hello-world
58dee6a49ef1: Pulling fs layer
58dee6a49ef1: Pull complete
Digest: sha256:5dd0d3e6e255913fc30f90b9f2b1d359cc2cbdb48090cc4b65f1676e203243cc
Status: Downloaded newer image for hello-world:latest

Hello from Docker!
This message shows that your installation appears to be working correctly.
```

> Doc: [docker run](https://docs.docker.com/reference/cli/docker/container/run/)

> Nota: Las dos primeras líneas cuentan que la imagen no estaba y hubo que
> descargarla. La segunda vez que se ejecute ese mismo comando no aparecerán:
> la imagen ya está en el disco.
>
> `--rm` es de *remove*, «eliminar». Sin ella, el contenedor sigue existiendo
> en estado terminado después de que su proceso acabe, y se queda ocupando
> sitio hasta que alguien lo borre a mano. En pruebas se pone siempre; en un
> servicio que deba poder reiniciarse, no, porque `--rm` impide justamente eso.

```ejercicio
# Enunciado
Completa la opción que borra el contenedor en cuanto termina.

# Plantilla
comando = ["docker", "run", "___", "hello-world"]
print(" ".join(comando))

# Esperado
docker run --rm hello-world

# Pista
Dos guiones y dos letras: la abreviatura inglesa de «eliminar».
```

# Qué acaba de pasar

El cliente `docker` habló con un servicio que corre en segundo plano —el
demonio—, este buscó la imagen, no la encontró, la descargó de un registro
público y creó un contenedor con ella.

Ese reparto explica un error muy común al empezar: si el demonio no está
levantado, cualquier comando falla aunque `docker` esté instalado.

```bash
docker info --format '{{.ServerVersion}}'
```

```salida
29.4.1
```

> Doc: [docker info](https://docs.docker.com/reference/cli/docker/system/info/)

```ejercicio
# Enunciado
Completa el subcomando que muestra los datos del servidor y sirve para saber si el demonio responde.

# Plantilla
print("docker " + "___" + " --format '{{.ServerVersion}}'")

# Esperado
docker info --format '{{.ServerVersion}}'

# Pista
Cuatro letras: «información» abreviada.
```

# Un contenedor que se queda

`hello-world` imprime y termina. Un servicio, en cambio, se queda escuchando.

Para eso se emplean tres opciones, y conviene saber de dónde proceden sus letras:

- **`-d` es de *detach*, «desacoplar».** Sin ella, `docker run` conecta tu
  terminal a la salida del contenedor y se queda ahí bloqueada hasta que el
  proceso termine; al cerrar la ventana o pulsar Ctrl+C, el contenedor muere con
  ella. Con `-d`, Docker arranca el proceso, imprime su identificador y te
  devuelve el control: el contenedor queda desacoplado de tu terminal y sigue
  vivo aunque la cierres. Eso es lo que en la práctica se llama «segundo plano».
- **`--name` le pone nombre.** Sin ella Docker inventa uno —`nostalgic_lamport`
  y cosas así— y habría que copiarlo cada vez que se quiera parar o inspeccionar.
- **`-p` es de *publish*, «publicar».** Explicada más abajo.

```bash
docker run -d --name web -p 8080:8000 saludo:1
docker ps --filter name=web
```

```salida
NAMES       IMAGE            STATUS        PORTS
web   saludo:1   Up 1 second   0.0.0.0:8080->8000/tcp
```

> Doc: [docker run](https://docs.docker.com/reference/cli/docker/container/run/)

> Doc: [docker ps](https://docs.docker.com/reference/cli/docker/container/ls/)

> Nota: `-p` es de *publish*. Un contenedor tiene su propia pila de red, así que
> un proceso que escucha en su puerto 8000 no es alcanzable desde tu máquina
> aunque esté corriendo: publicar es lo que abre ese camino.
>
> `-p 8080:8000` conecta el puerto 8080 de tu máquina con el 8000 de dentro. El
> orden es «fuera:dentro». Confundirlo es de los errores que más tiempo hacen
> perder, porque no produce ningún mensaje: el contenedor arranca, el comando
> tiene éxito y la dirección sencillamente no responde.

```ejercicio
# Enunciado
Completa el puerto de dentro del contenedor, sabiendo que la aplicación escucha en el 8000.

# Plantilla
fuera, dentro = 8080, ___
print(f"-p {fuera}:{dentro}")

# Esperado
-p 8080:8000

# Pista
El puerto en el que escucha la aplicación.
```

# Hablar con él

`curl` es la herramienta habitual para hacer una petición desde la terminal, y
`-s` es de *silent*: sin ella imprime también una barra de progreso que aquí
solo estorba.

```bash
curl -s localhost:8080
```

```salida
hola, mundo
```

> Doc: [Puertos publicados](https://docs.docker.com/engine/network/#published-ports)

```ejercicio
# Enunciado
Completa el orden correcto de la publicación de puertos: primero el de fuera, después el de dentro.

# Plantilla
def publicar(fuera, dentro):
    return f"-p {___}:{dentro}"

print(publicar(8080, 8000))

# Esperado
-p 8080:8000

# Pista
El puerto de tu máquina.
```

# Una imagen, varios contenedores

De la misma imagen se crean contenedores independientes. Cada uno puede recibir
una configuración distinta con `-e`.

```bash
docker run -d --name web2 -p 8081:8000 -e NOMBRE=Piura saludo:1
curl -s localhost:8081
```

```salida
hola, Piura
```

> Doc: [docker run](https://docs.docker.com/reference/cli/docker/container/run/)

> Nota: `-e` es de *environment*, «entorno»: define una variable de entorno
> dentro del contenedor. El programa la lee con `os.environ`, igual que leería
> cualquier variable del sistema donde corriera.
>
> La imagen es la misma y el resultado es distinto. Esa es la separación que hay
> que interiorizar: **la imagen trae el programa, el contenedor trae la
> configuración**. Meter la configuración dentro de la imagen obliga a
> reconstruirla para cambiar un dato.

```ejercicio
# Enunciado
Completa la opción que pasa una variable de entorno al contenedor.

# Plantilla
print("docker run " + "___" + " NOMBRE=Piura saludo:1")

# Esperado
docker run -e NOMBRE=Piura saludo:1

# Pista
Un guion y una letra: la inicial de «entorno» en inglés.
```

# Mirar dentro

`docker exec` ejecuta un comando dentro de un contenedor que ya está corriendo
—de ahí el nombre, *execute*—. Es la forma de comprobar qué hay ahí adentro sin
reconstruir ni reiniciar nada.

En el ejemplo aparece `python -c`, que no es una opción de Docker sino de
Python: `-c` es de *command* y le dice al intérprete que ejecute el texto que
viene a continuación en lugar de abrir un archivo.

```bash
docker exec web python -c "import sys; print(sys.version.split()[0])"
docker exec web ls /app
```

```salida
3.13.15
app.py
```

> Doc: [docker exec](https://docs.docker.com/reference/cli/docker/container/exec/)

> Nota: Dentro hay un Python 3.13.15 que probablemente no es el de tu máquina, y
> un directorio `/app` con un solo archivo. Eso es todo el sistema que ve el
> programa: no hay nada más porque no hizo falta nada más.

```ejercicio
# Enunciado
Completa el subcomando que ejecuta una orden dentro de un contenedor en marcha.

# Plantilla
print("docker " + "___" + " web ls /app")

# Esperado
docker exec web ls /app

# Pista
Cuatro letras: la abreviatura inglesa de «ejecutar».
```

> Doc: [Qué es Docker](https://docs.docker.com/get-started/docker-overview/)

> Doc: [docker run](https://docs.docker.com/reference/cli/docker/container/run/)

# Cierre

Una imagen es el paquete y un contenedor es una ejecución suya. `docker run`
crea, `-d` lo deja de fondo, `-p` publica un puerto, `-e` pasa configuración y
`exec` entra a mirar.

La sesión siguiente abre la imagen y explica de qué está hecha.
