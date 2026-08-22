---
numero: 6
titulo: "Datos que sobreviven"
---

# Lo que se pierde

En la sesión 3 quedó claro: lo que se escribe dentro de un contenedor
desaparece con él. Para una base de datos o para los archivos que suben los
usuarios, eso es inaceptable.

La solución es sacar esos datos del contenedor. Hay dos formas y no sirven para
lo mismo.

# El caso que lo explica: una base de datos

Nada enseña esto mejor que postgres. Su imagen guarda todo en
`/var/lib/postgresql/data`, así que sin un volumen ahí, borrar el contenedor
borra la base entera.

```bash
docker volume create datos-postgres
docker run -d --name bd \
  -e POSTGRES_PASSWORD=secreto -e POSTGRES_DB=tienda \
  -v datos-postgres:/var/lib/postgresql/data \
  -p 55432:5432 postgres:16-alpine
docker exec bd pg_isready -U postgres
```

```salida
/var/run/postgresql:5432 - accepting connections
```

> Nota: El puerto de fuera es 55432 y no 5432 a propósito. Si ya tienes un
> postgres instalado en tu máquina, el 5432 está ocupado y `docker run` falla
> con `address already in use`. Cambiar solo el lado de fuera resuelve el choque
> sin tocar nada dentro del contenedor, que sigue escuchando en el 5432 de
> siempre.
>
> `pg_isready` es una herramienta que trae la propia imagen de postgres:
> responde si el servidor ya acepta conexiones. Se necesita porque la base tarda
> un par de segundos en arrancar y durante ese rato el contenedor está «Up» pero
> todavía no atiende.

> Doc: [Imagen oficial de postgres](https://hub.docker.com/_/postgres)

# Escribir datos

```bash
docker exec bd psql -U postgres -d tienda -c "create table productos (nombre text, precio numeric);"
docker exec bd psql -U postgres -d tienda -c "insert into productos values ('teclado', 120), ('monitor', 890);"
docker exec bd psql -U postgres -d tienda -c "select * from productos order by precio;"
```

```salida
CREATE TABLE
INSERT 0 2
 nombre  | precio 
---------+--------
 teclado |    120
 monitor |    890
(2 rows)
```

> Doc: [docker exec](https://docs.docker.com/reference/cli/docker/container/exec/)

# La prueba

Se borra el contenedor entero y se crea otro, apuntando al mismo volumen.

```bash
docker rm -f bd
docker run -d --name bd -e POSTGRES_PASSWORD=secreto \
  -v datos-postgres:/var/lib/postgresql/data -p 55432:5432 postgres:16-alpine
docker exec bd psql -U postgres -d tienda -c "select * from productos order by precio;"
```

```salida
 nombre  | precio 
---------+--------
 teclado |    120
 monitor |    890
(2 rows)
```

> Nota: El contenedor es otro —otro identificador, otra vida— y la tabla sigue
> ahí. Sin el `-v`, ese mismo comando habría arrancado una base vacía y la
> tienda habría desaparecido sin ningún aviso.

> Doc: [docker rm](https://docs.docker.com/reference/cli/docker/container/rm/)

# El mismo mecanismo, en pequeño

```bash
docker run --rm -v datos-app:/datos alpine:3.21 sh -c "echo persistente > /datos/nota.txt"
docker run --rm -v datos-app:/datos alpine:3.21 cat /datos/nota.txt
```

```salida
persistente
```

> Doc: [docker volume create](https://docs.docker.com/reference/cli/docker/volume/create/)

> Doc: [docker run](https://docs.docker.com/reference/cli/docker/container/run/)

> Nota: `-v` es de *volume*. En `docker run` monta un volumen o un directorio;
> conviene tener presente que en otros comandos la misma letra significa *version*, que es un
> ejemplo más de por qué conviene leer la ayuda del subcomando concreto.
>
> El primer contenedor escribió y se borró; el segundo, que es otro, leyó lo que
> dejó. El dato no vive en ninguno de los dos: vive en el volumen.

```ejercicio
# Enunciado
Completa la opción que monta un volumen dentro del contenedor.

# Plantilla
print("docker run " + "___" + " datos-app:/datos alpine:3.21")

# Esperado
docker run -v datos-app:/datos alpine:3.21

# Pista
Un guion y una letra: la inicial de «volumen».
```

# La sintaxis

El formato es `origen:destino`. Si el origen es un nombre, es un volumen; si es
una ruta, es un directorio de tu máquina.

```python
def clasificar(montaje):
    origen, _, destino = montaje.partition(":")
    tipo = "bind mount" if origen.startswith((".", "/", "~")) else "volumen"
    return f"{tipo:11} {origen}  ->  {destino}"

for m in ["datos-app:/datos", "./src:/app", "/etc/hosts:/etc/hosts"]:
    print(clasificar(m))
```

```salida
volumen     datos-app  ->  /datos
bind mount  ./src  ->  /app
bind mount  /etc/hosts  ->  /etc/hosts
```

```ejercicio
# Enunciado
Completa el carácter que separa el origen del destino en un montaje.

# Plantilla
print("datos-app:/datos".partition("___")[2])

# Esperado
/datos

# Pista
Dos puntos.
```

# Bind mounts

Un bind mount conecta un directorio de tu máquina con uno del contenedor. Lo
que se edita fuera se ve dentro al instante, sin reconstruir nada.

```bash
docker run -d --name dev -p 8082:8000 -v "$PWD":/app saludo:1
curl -s localhost:8082
```

```salida
hola, mundo
```

> Doc: [docker run](https://docs.docker.com/reference/cli/docker/container/run/)

> Nota: Es la herramienta del desarrollo: se edita el archivo en el editor y el
> contenedor ve el cambio. Y es justo lo que **no** se hace en producción, donde
> el código tiene que venir dentro de la imagen y no de una carpeta del
> servidor.

```ejercicio
# Enunciado
Completa el tipo de montaje que conecta una carpeta de tu máquina con el contenedor.

# Plantilla
tipo = "bind ___"
print(f"./src:/app es un {tipo}")

# Esperado
./src:/app es un bind mount

# Pista
Cinco letras: «montaje» en inglés.
```

# Cuál usar

| | volumen | bind mount |
|---|---|---|
| dónde vive | lo gestiona Docker | una ruta tuya |
| para qué | datos de producción | desarrollo |
| portable | sí | depende de la máquina |

```python
casos = {
    "base de datos en producción": "volumen",
    "editar código y ver el cambio": "bind mount",
    "archivos que suben los usuarios": "volumen",
    "montar un archivo de configuración local": "bind mount",
}
for caso, recomendado in casos.items():
    print(f"{recomendado:11} {caso}")
```

```salida
volumen     base de datos en producción
bind mount  editar código y ver el cambio
volumen     archivos que suben los usuarios
bind mount  montar un archivo de configuración local
```

```ejercicio
# Enunciado
Completa lo que conviene para los datos de una base de datos en producción.

# Plantilla
print("Para una base de datos en producción: " + "___")

# Esperado
Para una base de datos en producción: volumen

# Pista
Siete letras: lo que gestiona Docker.
```

# Los volúmenes también se acumulan

```bash
docker volume ls --filter name=web
```

```salida
DRIVER    VOLUME NAME
local     datos-app
```

> Doc: [docker volume ls](https://docs.docker.com/reference/cli/docker/volume/ls/)

> Nota: Un volumen no se borra al borrar el contenedor que lo usaba, y eso es
> deliberado: es el punto de tenerlo. La contrapartida es que se quedan ahí
> ocupando espacio, y `docker volume prune` los borra sin preguntar por su
> contenido.

```ejercicio
# Enunciado
Completa el subcomando que lista los volúmenes.

# Plantilla
print("docker volume " + "___")

# Esperado
docker volume ls

# Pista
Dos letras: el comando de Unix que lista.
```

# Solo lectura

Añadir `:ro` monta el directorio sin permiso de escritura. Es lo correcto para
un archivo de configuración: el contenedor lo lee y no puede estropearlo.

```bash
docker run --rm -v datos-app:/datos:ro alpine:3.21 sh -c "echo otro > /datos/x.txt"
```

```salida
sh: can't create /datos/x.txt: Read-only file system
```

> Doc: [docker run](https://docs.docker.com/reference/cli/docker/container/run/)

`ro` son las iniciales de *read only*, «solo lectura». El sufijo va detrás del
destino, separado por otros dos puntos.

```ejercicio
# Enunciado
Completa el sufijo que monta el volumen en solo lectura.

# Plantilla
print("-v datos-app:/datos:" + "___")

# Esperado
-v datos-app:/datos:ro

# Pista
Dos letras: las iniciales de «solo lectura» en inglés.
```

> Doc: [Volúmenes](https://docs.docker.com/engine/storage/volumes/)

# Cierre

Un volumen lo gestiona Docker y sirve para datos que deben durar; un bind mount
conecta una carpeta tuya y sirve para desarrollar. Los dos usan
`origen:destino`, y `:ro` impide escribir.

La sesión siguiente hace que varios contenedores se hablen.
