---
numero: 1
titulo: "Elegir la imagen base"
---

# La decisión que fija el suelo

Todo lo que pesa una imagen empieza por su base. Se elige una vez, al escribir
la primera línea del Dockerfile, y a partir de ahí no hay optimización que
recupere lo que esa línea metió dentro.

Las tres variantes habituales de la imagen oficial de Python, medidas:

```bash
docker images --format "{{.Repository}}:{{.Tag}}  {{.Size}}" | grep '^python:3.13'
```

```salida
python:3.13  1.62GB
python:3.13-alpine  74.3MB
python:3.13-slim  203MB
```

> Doc: [docker images](https://docs.docker.com/reference/cli/docker/image/ls/)

> Nota: Veintidós veces entre la mayor y la menor. La etiqueta sin sufijo trae
> un Debian completo con compiladores y herramientas de desarrollo; `slim` elimina
> todo lo que no interviene en la ejecución; `alpine` cambia además la
> distribución entera por Alpine Linux, mucho más pequeña.

```ejercicio
# Enunciado
Completa la división que da cuántas veces cabe la imagen alpine en la completa.

# Plantilla
print(round(1620 ___ 74.3))

# Esperado
22

# Pista
Un guion inclinado, el de dividir.
```

# Qué cambia en Alpine

Alpine no usa la biblioteca de C habitual —glibc— sino **musl**, que es otra
implementación. Eso es lo que la hace pequeña y también lo que rompe cosas: un
paquete de Python que traiga código compilado contra glibc no sirve.

```bash
docker run --rm python:3.13-alpine sh -c "ldd --version 2>&1 | head -1"
docker run --rm python:3.13-slim sh -c "ldd --version 2>&1 | head -1"
```

```salida
musl libc (aarch64)
ldd (Debian GLIBC 2.41-12+deb13u3) 2.41
```

> Doc: [Imagen oficial de Python](https://hub.docker.com/_/python)

> Nota: *ldd* es *list dynamic dependencies*: informa de qué biblioteca de C
> usa el sistema. Esa diferencia no se nota hasta que un paquete no instala, y
> entonces el mensaje habla de ruedas incompatibles sin mencionar Alpine por
> ningún lado.

```ejercicio
# Enunciado
Completa el nombre de la biblioteca de C que usa Alpine en lugar de glibc.

# Plantilla
bibliotecas = {"alpine": "___", "debian": "glibc"}
print(bibliotecas["alpine"])

# Esperado
musl

# Pista
Cuatro letras.
```

# Cuándo compensa cada una

```python
casos = {
    "aplicación de Python sin paquetes compilados": "alpine",
    "aplicación con numpy, pandas o psycopg2":      "slim",
    "imagen donde hay que compilar algo":           "completa, y solo como etapa de construcción",
}
for caso, eleccion in casos.items():
    print(f"{caso:46} -> {eleccion}")
```

```salida
aplicación de Python sin paquetes compilados   -> alpine
aplicación con numpy, pandas o psycopg2        -> slim
imagen donde hay que compilar algo             -> completa, y solo como etapa de construcción
```

> Nota: La regla no es «la más pequeña», es **la más pequeña en la que tu
> aplicación funciona sin pelearse**. Ahorrar 130 MB no compensa si cada
> despliegue exige compilar paquetes que en `slim` ya venían resueltos.

```ejercicio
# Enunciado
Completa la base recomendada para una aplicación que usa paquetes compilados.

# Plantilla
print("con numpy o psycopg2 conviene " + "___")

# Esperado
con numpy o psycopg2 conviene slim

# Pista
Cuatro letras: la variante intermedia.
```

# Fijar la versión

Una base sin versión concreta es una imagen distinta cada mes. Fijarla no es
manía: es lo que hace que la construcción de hoy y la de dentro de medio año
produzcan lo mismo.

```python
etiquetas = ["python", "python:3.13", "python:3.13-slim", "python:3.13.5-slim"]
for e in etiquetas:
    partes = e.split(":")
    precision = "ninguna" if len(partes) == 1 else (
        "menor" if partes[1].count(".") >= 2 else "mayor y media"
    )
    print(f"{e:22} precisión: {precision}")
```

```salida
python                 precisión: ninguna
python:3.13            precisión: mayor y media
python:3.13-slim       precisión: mayor y media
python:3.13.5-slim     precisión: menor
```

> Nota: `python:3.13-slim` recibe parches de seguridad sin cambiar de versión de
> Python, que suele ser lo que se quiere. `python:3.13.5-slim` congela hasta el
> último número y deja fuera esos parches, así que hay que actualizarla a mano.
> Ninguna de las dos es la correcta siempre; lo incorrecto es no elegir.

```ejercicio
# Enunciado
Completa el método que cuenta cuántos puntos tiene la versión.

# Plantilla
print("3.13.5".___(".") )

# Esperado
2

# Pista
Cinco letras: «contar» en inglés.
```

# El digest, que no se mueve

Una etiqueta puede reasignarse; un digest no. Es la huella del contenido, y
apuntar a él es la única forma de garantizar que se ejecuta exactamente lo
mismo.

```bash
docker images --digests postgres --format "{{.Tag}}  {{.Digest}}"
```

```salida
16-alpine  sha256:44c4ee9810eff91f7eab4d822642e01115b1a9eccce4bcbdde7604752d68eac6
latest  sha256:7e32e9833a6fb1c92c32552794cb6ed569d51b445a54907d35fc112ef39684db
```

> Doc: [Imágenes y digests](https://docs.docker.com/dhi/core-concepts/digests/)

```ejercicio
# Enunciado
Completa el algoritmo con el que se calcula el digest de una imagen.

# Plantilla
digest = "sha256:44c4ee98"
print(digest.split(":")[0] == "___")

# Esperado
True

# Pista
Seis caracteres: el nombre de la función resumen.
```

# Cierre

La base fija el suelo del tamaño y decide qué paquetes se pueden instalar sin
pelear. `slim` es el punto medio razonable, `alpine` gana espacio a cambio de
compatibilidad, y la versión se fija siempre.

La sesión siguiente saca de la imagen final todo lo que solo hacía falta para
construirla.
