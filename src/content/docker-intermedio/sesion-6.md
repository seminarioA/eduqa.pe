---
numero: 6
titulo: "Secretos que no viajan en la imagen"
---

# Una capa no se borra

Ya salió en el curso de introducción y aquí se demuestra: una imagen es una pila
de capas inmutables, así que **borrar un archivo en una instrucción posterior no
lo quita de la capa donde entró**.

```bash
cat Dockerfile.secreto
```

```salida
FROM alpine:3.21
COPY .env /app/.env
RUN cat /app/.env > /dev/null
RUN rm /app/.env
```

> Doc: [Referencia del Dockerfile](https://docs.docker.com/reference/dockerfile/)

Parece limpio: copia el archivo, lo usa y lo borra.

```ejercicio
# Enunciado
Completa la instrucción que mete un archivo de tu máquina dentro de la imagen.

# Plantilla
print("___ .env /app/.env")

# Esperado
COPY .env /app/.env

# Pista
Cuatro letras: «copiar» en inglés.
```

# El archivo ya no está…

```bash
docker run --rm con-secreto ls /app
```

```salida

```

> Doc: [docker run](https://docs.docker.com/reference/cli/docker/container/run/)

El directorio está vacío. Quien mire dentro del contenedor no encuentra nada.

```ejercicio
# Enunciado
Completa el comando que lista el contenido de un directorio.

# Plantilla
print("docker run --rm con-secreto " + "___" + " /app")

# Esperado
docker run --rm con-secreto ls /app

# Pista
Dos letras: «listar» en Unix.
```

# …pero la capa sí

```bash
docker history con-secreto --format "{{.Size}}  {{.CreatedBy}}"
```

```salida
8.19kB  RUN /bin/sh -c rm /app/.env # buildkit
4.1kB  RUN /bin/sh -c cat /app/.env > /dev/null # b…
12.3kB  COPY .env /app/.env # buildkit
0B  CMD ["/bin/sh"]
```

> Doc: [docker history](https://docs.docker.com/reference/cli/docker/image/history/)

> Nota: Ahí está la capa del `COPY`, con sus 12,3 kB, y ahí sigue el contenido.
> Cualquiera con la imagen puede extraer esa capa y leer el archivo; el `rm` de
> arriba solo añadió una capa que dice «este archivo ya no se ve», no borró
> nada. Es la razón por la que **un secreto que entró en una imagen se considera
> filtrado**, y lo que corresponde es rotarlo, no reconstruir.

```ejercicio
# Enunciado
Completa la instrucción cuya capa conserva el secreto pese al borrado posterior.

# Plantilla
capas = ["RUN rm", "RUN cat", "___ .env"]
print(capas[2])

# Esperado
COPY .env

# Pista
La instrucción que lo metió.
```

# Lo que sí funciona en construcción

BuildKit monta el secreto durante una instrucción y no deja capa. El archivo
existe mientras dura ese `RUN` y desaparece después, sin rastro.

```bash
cat Dockerfile.con-mount
```

```salida
FROM alpine:3.21
RUN --mount=type=secret,id=clave \
    cat /run/secrets/clave > /dev/null
```

> Doc: [Secretos de construcción](https://docs.docker.com/build/building/secrets/)

```bash
docker build --secret id=clave,src=.env -t sin-rastro .
docker history sin-rastro --format "{{.Size}}  {{.CreatedBy}}" | head -2
```

```salida
4.1kB  RUN /bin/sh -c cat /run/secrets/clave > /dev…
0B  CMD ["/bin/sh"]
```

> Doc: [docker build](https://docs.docker.com/reference/cli/docker/buildx/build/)

> Nota: Compara con el historial anterior. Allí había una capa `COPY .env` de
> 12,3 kB con el archivo dentro; aquí no existe ninguna. La capa de 4,1 kB es la
> del propio `RUN` —metadatos y cambios que deja cualquier instrucción—, y el
> secreto no está en ella: estuvo montado en `/run/secrets/clave` solo mientras
> esa orden corría.
>
> `--secret` recibe un identificador y de dónde sacarlo; dentro se monta siempre
> bajo `/run/secrets/`.

```ejercicio
# Enunciado
Completa la opción de docker build que entrega un secreto sin dejarlo en una capa.

# Plantilla
print("docker build " + "___" + " id=clave,src=.env -t sin-rastro .")

# Esperado
docker build --secret id=clave,src=.env -t sin-rastro .

# Pista
Dos guiones y seis letras: «secreto» en inglés.
```

# Y en ejecución, variables

Lo que la aplicación necesita para funcionar —contraseñas de base de datos,
claves de API— no entra en construcción: entra al arrancar.

```python
opciones = {
    "COPY .env dentro de la imagen":      "no — queda en una capa para siempre",
    "ARG en el Dockerfile":               "no — queda en los metadatos de la imagen",
    "--secret en la construcción":        "sí, para lo que solo interviene al construir",
    "-e o env_file al ejecutar":          "sí, para lo que necesita la aplicación viva",
}
for opcion, veredicto in opciones.items():
    print(f"{opcion:36} {veredicto}")
```

```salida
COPY .env dentro de la imagen        no — queda en una capa para siempre
ARG en el Dockerfile                 no — queda en los metadatos de la imagen
--secret en la construcción          sí, para lo que solo interviene al construir
-e o env_file al ejecutar            sí, para lo que necesita la aplicación viva
```

> Nota: `ARG` engaña porque parece temporal, y aparece en `docker history` de la
> imagen construida. Sirve para versiones y rutas, no para credenciales.

```ejercicio
# Enunciado
Completa la instrucción del Dockerfile que no sirve para credenciales porque queda en los metadatos.

# Plantilla
print("___ VERSION=1.0")

# Esperado
ARG VERSION=1.0

# Pista
Tres letras: «argumento» abreviado.
```

# Comprobar antes de publicar

```python
import re

def revisar(dockerfile):
    problemas = []
    for n, linea in enumerate(dockerfile.strip().splitlines(), 1):
        linea = linea.strip()
        if re.match(r"COPY\s+\.env", linea):
            problemas.append(f"línea {n}: copia un archivo de entorno")
        if re.match(r"ARG\s+\w*(PASSWORD|TOKEN|SECRET|KEY)", linea, re.I):
            problemas.append(f"línea {n}: credencial en un ARG")
    return problemas or ["sin hallazgos"]

for p in revisar("""
FROM alpine:3.21
ARG API_TOKEN
COPY .env /app/.env
"""):
    print(p)
```

```salida
línea 2: credencial en un ARG
línea 3: copia un archivo de entorno
```

```ejercicio
# Enunciado
Completa la bandera que hace que la expresión regular ignore mayúsculas y minúsculas.

# Plantilla
import re
print(bool(re.match(r"arg", "ARG TOKEN", re.___)))

# Esperado
True

# Pista
Una letra: la inicial de «ignorecase».
```

# Cierre

Una capa es para siempre, así que un secreto copiado está filtrado y hay que
rotarlo. Para construir, `--secret`, que no deja rastro; para ejecutar,
variables de entorno. `ARG` no vale para credenciales aunque lo parezca.

La sesión siguiente saca la imagen de tu máquina y la deja donde un servidor
pueda descargarla.
