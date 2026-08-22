---
numero: 10
titulo: "Diagnosticar un contenedor que no arranca"
---

# El síntoma

Se levanta el servicio y a los dos segundos no está. `docker ps` no lo lista,
`docker ps -a` lo muestra como `Exited`, y no hay ningún mensaje evidente.

Esta sesión es el procedimiento, en el orden en que conviene aplicarlo.

# Paso 1 — Qué código de salida dio

```bash
docker inspect fallido --format 'Estado={{.State.Status}} Código={{.State.ExitCode}} Error="{{.State.Error}}"'
```

```salida
Estado=exited Código=2 Error=""
```

> Doc: [docker inspect](https://docs.docker.com/reference/cli/docker/inspect/)

> Nota: El código ya orienta. Un 0 es que terminó bien y el problema es que no
> debía terminar; 125 es que Docker no pudo ni crear el contenedor; 126 y 127
> son que el comando no se pudo ejecutar o no existe; 137 es la señal 9, y con
> `OOMKilled=true` significa que se pasó de memoria. Aquí es 2, que viene del
> programa, no de Docker.

```ejercicio
# Enunciado
Completa el código de salida que indica que el comando no existe dentro de la imagen.

# Plantilla
codigos = {125: "Docker no pudo crear", 126: "no ejecutable", ___: "no encontrado"}
print(codigos[127])

# Esperado
no encontrado

# Pista
Ciento veintisiete.
```

# Paso 2 — Qué dijo antes de morir

```bash
docker logs fallido
```

```salida
python: can't open file '/app/aplicacion.py': [Errno 2] No such file or directory
```

> Doc: [docker logs](https://docs.docker.com/reference/cli/docker/container/logs/)

> Nota: Ahí está. El `CMD` decía `aplicacion.py` y el archivo copiado se llama
> `app.py`. Los registros de un contenedor muerto siguen disponibles mientras el
> contenedor exista, y ese es el motivo para **no arrancar con `--rm` mientras
> se depura**: con `--rm` el contenedor y sus registros desaparecen justo cuando
> hacían falta.

```ejercicio
# Enunciado
Completa el número de error de sistema que corresponde a «archivo no encontrado».

# Plantilla
print("[Errno " + "___" + "] No such file or directory")

# Esperado
[Errno 2] No such file or directory

# Pista
Dos.
```

# Paso 3 — Mirar dentro de la imagen

Si el contenedor muere al instante no da tiempo a entrar. `--entrypoint` cambia
lo que se ejecuta y permite abrir un intérprete en su lugar.

```bash
docker run --rm --entrypoint sh roto -c "ls /app"
```

```salida
app.py
```

> Doc: [docker run](https://docs.docker.com/reference/cli/docker/container/run/)

> Nota: Confirmado desde dentro: el archivo se llama `app.py`. Esta es la
> herramienta clave de la depuración, porque separa dos preguntas que se
> confunden —«¿está el archivo?» y «¿arranca el programa?»— y responde la
> primera sin depender de la segunda.

```ejercicio
# Enunciado
Completa la opción que sustituye el punto de entrada para poder explorar la imagen.

# Plantilla
print("docker run --rm " + "___" + " sh roto -c 'ls /app'")

# Esperado
docker run --rm --entrypoint sh roto -c 'ls /app'

# Pista
Dos guiones y diez letras: «punto de entrada» en inglés, todo junto.
```

# Paso 4 — Qué se construyó de verdad

```bash
docker history roto --format "{{.CreatedBy}}" | head -4
```

```salida
CMD ["python" "aplicacion.py"]
COPY app.py . # buildkit
WORKDIR /app
CMD ["python3"]
```

> Doc: [docker history](https://docs.docker.com/reference/cli/docker/image/history/)

> Nota: El historial muestra el desajuste en dos líneas seguidas: se copió
> `app.py` y se manda ejecutar `aplicacion.py`. Cuando el fallo no está en el
> código sino en el Dockerfile, esto lo enseña sin tener que leerlo entero.

```ejercicio
# Enunciado
Completa el archivo que el CMD intenta ejecutar y que no existe.

# Plantilla
copiado, ejecutado = "app.py", "___"
print(copiado != ejecutado)

# Esperado
True

# Pista
El nombre largo, el del CMD.
```

# Paso 5 — Reconstruir el orden de los hechos

```bash
docker events --since 10m --until 0s --filter container=fallido --format "{{.Status}}"
```

```salida
create
start
die
```

> Doc: [docker events](https://docs.docker.com/reference/cli/docker/system/events/)

```ejercicio
# Enunciado
Completa el suceso que aparece entre el arranque y el final.

# Plantilla
sucesos = ["create", "___", "die"]
print(sucesos[1])

# Esperado
start

# Pista
Cinco letras: «arrancar» en inglés.
```

# El procedimiento, en orden

```python
pasos = [
    ("inspect", "el código de salida acota el tipo de fallo"),
    ("logs", "el mensaje del programa, si llegó a hablar"),
    ("--entrypoint sh", "mirar dentro sin depender de que arranque"),
    ("history", "qué se construyó, cuando el fallo está en el Dockerfile"),
    ("events", "el orden de los hechos, para reinicios en bucle"),
]
for n, (herramienta, para_que) in enumerate(pasos, 1):
    print(f"{n}. {herramienta:16} {para_que}")
```

```salida
1. inspect          el código de salida acota el tipo de fallo
2. logs             el mensaje del programa, si llegó a hablar
3. --entrypoint sh  mirar dentro sin depender de que arranque
4. history          qué se construyó, cuando el fallo está en el Dockerfile
5. events           el orden de los hechos, para reinicios en bucle
```

> Nota: El orden importa porque cada paso es más caro que el anterior. La mayor
> parte de los fallos se resuelven en los dos primeros, y llegar a `events`
> significa casi siempre que el problema no es el contenedor sino algo que lo
> reinicia.

```ejercicio
# Enunciado
Completa el subcomando con el que conviene empezar el diagnóstico.

# Plantilla
pasos = ["___", "logs", "history"]
print(pasos[0])

# Esperado
inspect

# Pista
Siete letras: «inspeccionar» en inglés.
```

# Lo que no hay que hacer

```python
malos = {
    "reconstruir sin leer el error":        "pierdes la única pista que había",
    "arrancar con --rm mientras depuras":   "borra el contenedor y sus registros",
    "añadir sleep infinity al CMD":         "esconde el fallo en vez de mostrarlo",
    "editar dentro del contenedor":         "el arreglo desaparece al recrearlo",
}
for practica, por_que in malos.items():
    print(f"no  {practica:38} {por_que}")
```

```salida
no  reconstruir sin leer el error          pierdes la única pista que había
no  arrancar con --rm mientras depuras     borra el contenedor y sus registros
no  añadir sleep infinity al CMD           esconde el fallo en vez de mostrarlo
no  editar dentro del contenedor           el arreglo desaparece al recrearlo
```

> Nota: El tercero merece un matiz. Poner el contenedor a dormir para poder
> entrar es una técnica válida **como diagnóstico**, siempre que se quite
> después; el problema es dejarlo puesto y creer que el servicio funciona porque
> el contenedor está «Up».

```ejercicio
# Enunciado
Completa la opción que conviene NO usar mientras se depura, porque borra los registros.

# Plantilla
print("mientras depuras, evita " + "___")

# Esperado
mientras depuras, evita --rm

# Pista
Dos guiones y dos letras: la que elimina el contenedor al terminar.
```

# Cierre

El curso está completo. Sabes elegir una base y encogerla, arrancar sin
privilegios, esperar a que las dependencias estén sanas, separar entornos, dejar
los secretos fuera de la imagen, publicarla en un registro, acotar lo que
consume, controlar sus registros y diagnosticar cuando no arranca.

Lo que sigue —qué es un contenedor por dentro, la cadena de suministro de una
imagen, el endurecimiento y el salto a un orquestador— es el curso avanzado.
