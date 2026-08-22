---
numero: 3
titulo: "Arrancar sin privilegios"
---

# Root por omisión

Un contenedor ejecuta su proceso como administrador salvo que se diga lo
contrario. No es un descuido de nadie: es el valor por omisión, y casi ninguna
imagen oficial lo cambia porque no sabe cómo la vas a usar.

```bash
docker run --rm una-etapa id
```

```salida
uid=0(root) gid=0(root) groups=0(root)
```

> Doc: [docker run](https://docs.docker.com/reference/cli/docker/container/run/)

> Nota: *uid* es *user id*, el número que identifica al usuario, y el 0 es
> siempre el administrador. Root dentro del contenedor no es root de tu máquina
> —hay un aislamiento por medio—, pero sí puede hacer cualquier cosa **dentro**:
> escribir en todo el sistema de archivos, instalar paquetes y modificar la
> aplicación en marcha.

```ejercicio
# Enunciado
Completa el número de identificador que corresponde siempre al administrador.

# Plantilla
print(0 == ___)

# Esperado
True

# Pista
Cero.
```

# Crear un usuario y usarlo

Dos líneas en el Dockerfile:

```bash
cat Dockerfile.seguro
```

```salida
FROM python:3.13-slim
WORKDIR /app
COPY app.py .
RUN useradd --create-home --uid 10001 aplicacion
USER aplicacion
CMD ["python", "app.py"]
```

> Doc: [Referencia del Dockerfile](https://docs.docker.com/reference/dockerfile/)

- **`useradd`** es la herramienta del sistema que crea usuarios;
  `--create-home` le da un directorio propio y `--uid 10001` fija su número.
- **`USER`** cambia el usuario a partir de esa línea, tanto para el resto de la
  construcción como para el contenedor en marcha.

```bash
docker run --rm seguro id
```

```salida
uid=10001(aplicacion) gid=10001(aplicacion) groups=10001(aplicacion)
```

> Doc: [docker run](https://docs.docker.com/reference/cli/docker/container/run/)

```ejercicio
# Enunciado
Completa la instrucción del Dockerfile que cambia el usuario del contenedor.

# Plantilla
print("___ aplicacion")

# Esperado
USER aplicacion

# Pista
Cuatro letras: «usuario» en inglés.
```

# Por qué el número importa

Con volúmenes y bind mounts, el usuario de dentro escribe archivos que se ven
desde fuera. Si su número coincide con el de un usuario real de la máquina, los
permisos cuadran; si no, aparecen archivos que nadie puede tocar.

```python
# En Linux los usuarios normales suelen empezar en 1000.
for uid in [0, 1000, 10001, 65534]:
    quien = {0: "root", 1000: "primer usuario normal",
             10001: "elegido para la aplicación", 65534: "nobody"}[uid]
    print(f"{uid:6}  {quien}")
```

```salida
     0  root
  1000  primer usuario normal
 10001  elegido para la aplicación
 65534  nobody
```

> Nota: Elegir un número alto y fijo —10001 aquí— evita chocar con los usuarios
> del sistema y hace que el mismo contenedor se comporte igual en cualquier
> máquina. Dejar que `useradd` elija implica que dos construcciones puedan dar
> números distintos.

```ejercicio
# Enunciado
Completa el número desde el que suelen empezar los usuarios normales en Linux.

# Plantilla
print(1000 == ___)

# Esperado
True

# Pista
Mil.
```

# Lo que ya no puede hacer

```bash
docker run --rm seguro sh -c "touch /app/x"
```

```salida
touch: cannot touch '/app/x': Permission denied
```

> Doc: [docker run](https://docs.docker.com/reference/cli/docker/container/run/)

> Nota: El directorio de la aplicación lo creó root durante la construcción, así
> que el usuario nuevo puede leerlo y no escribirlo. Eso es exactamente lo que
> se busca: el código no tiene por qué modificarse a sí mismo en marcha, y si un
> fallo permite ejecutar algo, ese algo tampoco podrá.

```ejercicio
# Enunciado
Completa el mensaje que devuelve el sistema cuando faltan permisos.

# Plantilla
print("Permission " + "___")

# Esperado
Permission denied

# Pista
Seis letras: «denegado» en inglés.
```

# Sellar el sistema de archivos entero

`--read-only` monta todo el sistema de archivos del contenedor en solo lectura.
Es un paso más: ni siquiera root podría escribir.

```bash
docker run --rm --read-only seguro sh -c "touch /tmp/x"
```

```salida
touch: cannot touch '/tmp/x': Read-only file system
```

> Doc: [Opciones de almacenamiento en docker run](https://docs.docker.com/engine/storage/tmpfs/)

```ejercicio
# Enunciado
Completa la opción que monta todo el sistema de archivos en solo lectura.

# Plantilla
print("docker run " + "___" + " seguro")

# Esperado
docker run --read-only seguro

# Pista
Dos guiones y dos palabras unidas por otro guion: «solo lectura» en inglés.
```

# Dejar un hueco para lo temporal

Casi ningún programa funciona sin poder escribir en algún sitio. `--tmpfs` monta
un sistema de archivos en memoria, que desaparece con el contenedor.

```bash
docker run --rm --read-only --tmpfs /tmp seguro sh -c "touch /tmp/x && echo escribió en /tmp"
```

```salida
escribió en /tmp
```

> Doc: [tmpfs](https://docs.docker.com/engine/storage/tmpfs/)

> Nota: *tmpfs* es *temporary file system*. Vive en memoria, así que es rápido y
> no deja rastro; también significa que cuenta contra el límite de memoria del
> contenedor, cosa que sorprende cuando alguien escribe un archivo grande ahí.

```ejercicio
# Enunciado
Completa la opción que monta un sistema de archivos temporal en memoria.

# Plantilla
print("docker run --read-only " + "___" + " /tmp seguro")

# Esperado
docker run --read-only --tmpfs /tmp seguro

# Pista
Dos guiones y seis letras: «temporal» abreviado más «fs».
```

# Cierre

Un usuario propio con número fijo, el código que no se puede modificar a sí
mismo, y opcionalmente todo el sistema en solo lectura con un `tmpfs` para lo
que haga falta escribir. Tres líneas y dos opciones.

La sesión siguiente resuelve el otro problema de un despliegue real: que un
servicio arranque antes de que el que necesita esté listo.
