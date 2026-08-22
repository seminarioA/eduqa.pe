---
numero: 2
titulo: "Construcción por etapas"
---

# Lo que sobra en la imagen final

Compilar necesita herramientas que ejecutar no necesita: compiladores,
cabeceras, gestores de paquetes, cachés. Si todo eso ocurre en la misma imagen
que se despliega, viaja al servidor y se queda ahí para siempre.

La construcción por etapas —*multi-stage*— parte el Dockerfile en varias
imágenes y copia a la última solo el resultado.

# Antes: una sola etapa

```bash
cat Dockerfile.una-etapa
```

```salida
FROM python:3.13
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY app.py .
CMD ["python", "app.py"]
```

> Doc: [Referencia del Dockerfile](https://docs.docker.com/reference/dockerfile/)

Funciona, y arrastra el Debian completo con su compilador.

```ejercicio
# Enunciado
Completa la instrucción que ejecuta una orden durante la construcción y deja su resultado en una capa.

# Plantilla
print("___ pip install --no-cache-dir -r requirements.txt")

# Esperado
RUN pip install --no-cache-dir -r requirements.txt

# Pista
Tres letras: «ejecutar» en inglés.
```

# Después: dos etapas

```bash
cat Dockerfile.multi
```

```salida
FROM python:3.13 AS construccion
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir --target=/paquetes -r requirements.txt

FROM python:3.13-slim
WORKDIR /app
COPY --from=construccion /paquetes /paquetes
COPY app.py .
ENV PYTHONPATH=/paquetes
CMD ["python", "app.py"]
```

> Doc: [Construcción por etapas](https://docs.docker.com/build/building/multi-stage/)

Las piezas nuevas:

- **`AS construccion`** le pone nombre a la etapa. `AS` es «como» en inglés, y
  el nombre es lo que permite referirse a ella después.
- **`--target=/paquetes`** es una opción de `pip`, no de Docker: instala en una
  ruta concreta en vez de en el sitio del sistema, para saber exactamente qué
  hay que copiar.
- **`COPY --from=construccion`** copia desde otra etapa en lugar de desde tu
  máquina. Es la línea que hace todo el trabajo.
- **`ENV PYTHONPATH=/paquetes`** le dice a Python dónde buscar, porque los
  paquetes ya no están donde los pone por omisión.

```ejercicio
# Enunciado
Completa la opción de COPY que trae archivos desde otra etapa de la construcción.

# Plantilla
print("COPY " + "___" + "=construccion /paquetes /paquetes")

# Esperado
COPY --from=construccion /paquetes /paquetes

# Pista
Dos guiones y cuatro letras: «desde» en inglés.
```

# La diferencia, medida

```bash
docker images --format "{{.Repository}}  {{.Size}}" | grep -E '^(una-etapa|multi) '
```

```salida
multi  209MB
una-etapa  1.63GB
```

> Doc: [docker images](https://docs.docker.com/reference/cli/docker/image/ls/)

> Nota: Casi ocho veces. Y no es solo espacio: la imagen grande contiene un
> compilador, un gestor de paquetes y las cabeceras del sistema, que son
> herramientas útiles para quien consiga ejecutar algo dentro. Menos cosas
> dentro es también menos superficie de ataque.

```ejercicio
# Enunciado
Completa la división que da cuántas veces cabe la imagen por etapas en la de una sola.

# Plantilla
print(round(1630 ___ 209))

# Esperado
8

# Pista
Un guion inclinado.
```

# Construir solo una etapa

`--target` —esta vez sí de Docker— construye hasta la etapa que se le diga y
para ahí. Sirve para tener una imagen de desarrollo con las herramientas y otra
de producción sin ellas, desde el mismo archivo.

```bash
docker build --target construccion -t solo-construccion -f Dockerfile.multi .
docker images solo-construccion --format "{{.Size}}"
```

```salida
1.63GB
```

> Doc: [docker build](https://docs.docker.com/reference/cli/docker/buildx/build/)

```ejercicio
# Enunciado
Completa la opción de docker build que se detiene en una etapa concreta.

# Plantilla
print("docker build " + "___" + " construccion -f Dockerfile.multi .")

# Esperado
docker build --target construccion -f Dockerfile.multi .

# Pista
Dos guiones y seis letras: «objetivo» en inglés.
```

# Las etapas no se ejecutan si nadie las necesita

Docker construye solo lo que la etapa final necesita. Una etapa que nadie copia
ni referencia se salta entera.

```python
etapas = ["construccion", "pruebas", "final"]
usadas = {"construccion", "final"}   # `final` copia de `construccion`
for e in etapas:
    print(f"{e:14} {'se construye' if e in usadas else 'se salta'}")
```

```salida
construccion   se construye
pruebas        se salta
final          se construye
```

> Nota: Eso permite tener una etapa de pruebas en el mismo archivo sin que
> penalice la imagen de producción: solo se construye cuando se pide con
> `--target pruebas`.

```ejercicio
# Enunciado
Completa el conjunto de etapas que sí se construyen para llegar a la final.

# Plantilla
usadas = {"construccion", "___"}
print(sorted(usadas))

# Esperado
['construccion', 'final']

# Pista
La última etapa del archivo.
```

# Cierre

Una etapa construye y otra ejecuta; entre las dos solo pasa lo que se copia
explícitamente. De 1,63 GB a 209 MB sin cambiar una línea de la aplicación, y
con un compilador menos dentro.

La sesión siguiente quita el otro exceso que traen casi todas las imágenes:
correr como administrador.
