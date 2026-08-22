---
numero: 5
titulo: "La caché de construcción"
---

# Por qué la segunda vez es instantánea

Docker guarda el resultado de cada instrucción. Al reconstruir, reutiliza las
capas cuya entrada no cambió y solo rehace desde la primera que sí cambió.

La consecuencia es que **el orden de las líneas decide cuánto tarda cada
construcción**, y en un proyecto real esa diferencia se paga muchas veces al
día.

# Dos recetas que hacen lo mismo

```bash
cat Dockerfile.malo
```

```salida
FROM python:3.13-slim
WORKDIR /app
COPY . .
RUN pip install --no-cache-dir -r requirements.txt
CMD ["python", "app.py"]
```

> Doc: [Referencia del Dockerfile](https://docs.docker.com/reference/dockerfile/)

```bash
cat Dockerfile.bueno
```

```salida
FROM python:3.13-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
CMD ["python", "app.py"]
```

> Doc: [Referencia del Dockerfile](https://docs.docker.com/reference/dockerfile/)

La única diferencia es que la segunda copia primero el archivo de dependencias
y deja el resto del código para el final.

```ejercicio
# Enunciado
Completa el archivo que conviene copiar antes de instalar, para que la caché aguante.

# Plantilla
lineas = ["WORKDIR /app", "COPY ___ .", "RUN pip install -r requirements.txt"]
print(lineas[1])

# Esperado
COPY requirements.txt .

# Pista
El archivo que lista las dependencias.
```

# La diferencia, medida

Se cambia una línea del código y se reconstruyen las dos.

Aparecen dos opciones nuevas: `-f` es de *file*, «archivo», y sirve para
construir con un Dockerfile que no se llama `Dockerfile`; `-q` es de *quiet*,
«silencioso», y suprime el detalle de cada paso para que solo se vea el tiempo.

```bash
echo "# un cambio" >> app.py
time docker build -q -f Dockerfile.malo  -t malo  .
time docker build -q -f Dockerfile.bueno -t bueno .
```

```salida
orden malo : 5077 ms
orden bueno: 361 ms
```

> Doc: [docker build](https://docs.docker.com/reference/cli/docker/buildx/build/)

> Nota: Catorce veces más rápido, y la imagen resultante es idéntica. En el
> orden malo, tocar cualquier archivo invalida el `COPY . .` y con él todo lo
> que viene detrás, incluida la instalación de dependencias, que es lo caro.

```ejercicio
# Enunciado
Completa cuántas veces más rápida fue la construcción con el orden correcto, redondeando.

# Plantilla
print(round(5077 / 361) == ___)

# Esperado
True

# Pista
Catorce.
```

# La regla

Una capa se reutiliza si su instrucción y su entrada son iguales. Y en cuanto
una se invalida, **todas las siguientes también**, aunque no hayan cambiado.

```python
def desde_donde_se_rehace(instrucciones, cambiado):
    for i, (nombre, entrada) in enumerate(instrucciones):
        if entrada in cambiado:
            return i
    return len(instrucciones)

malo = [("FROM", "base"), ("COPY", "todo"), ("RUN", "pip"), ("CMD", "-")]
bueno = [("FROM", "base"), ("COPY", "requirements"), ("RUN", "pip"), ("COPY", "todo"), ("CMD", "-")]

for nombre, receta in [("malo", malo), ("bueno", bueno)]:
    desde = desde_donde_se_rehace(receta, {"todo"})
    print(nombre, "-> se rehacen", len(receta) - desde, "de", len(receta))
```

```salida
malo -> se rehacen 3 de 4
bueno -> se rehacen 2 de 5
```

> Nota: La cuenta explica el resultado anterior sin cronometrar nada: con el
> orden malo se rehacen tres pasos de cuatro, incluida la instalación; con el
> bueno, dos de cinco, y ninguno de ellos es caro.

```ejercicio
# Enunciado
Completa el conjunto con el archivo que cambió, para calcular desde dónde se rehace.

# Plantilla
def desde(receta, cambiado):
    for i, (n, entrada) in enumerate(receta):
        if entrada in cambiado:
            return i
    return len(receta)

receta = [("FROM", "base"), ("COPY", "requirements"), ("RUN", "pip"), ("COPY", "todo")]
print(desde(receta, {"___"}))

# Esperado
3

# Pista
Lo que copia la última instrucción.
```

# Qué se envía al construir

Antes de empezar, Docker manda el contexto entero al demonio. `.dockerignore`
dice qué dejar fuera, con la misma sintaxis que `.gitignore`.

```bash
cat .dockerignore
```

```salida
.git
__pycache__
*.pyc
.venv
node_modules
Dockerfile*
```

> Doc: [Archivos .dockerignore](https://docs.docker.com/build/concepts/context/#dockerignore-files)

> Nota: Excluir `.git` y las carpetas de dependencias no solo acelera: evita que
> acaben dentro de la imagen credenciales o historial que no tenían que salir de
> tu máquina. Un `COPY . .` sin `.dockerignore` copia absolutamente todo.

```ejercicio
# Enunciado
Completa el nombre del archivo que excluye rutas del contexto de construcción.

# Plantilla
print("." + "___")

# Esperado
.dockerignore

# Pista
El nombre de la herramienta seguido de «ignorar» en inglés.
```

# Comprobar qué quedaría fuera

Las reglas se pueden aplicar con Python antes de construir, para no llevarse
sorpresas.

```python
import fnmatch

reglas = [".git", "__pycache__", "*.pyc", ".venv"]
archivos = ["app.py", "requirements.txt", ".git/config", "app.pyc", ".venv/bin/python"]

def excluido(ruta):
    return any(
        fnmatch.fnmatch(ruta, patron) or ruta.startswith(patron + "/")
        for patron in reglas
    )

for a in archivos:
    print(("fuera " if excluido(a) else "dentro"), a)
```

```salida
dentro app.py
dentro requirements.txt
fuera  .git/config
fuera  app.pyc
fuera  .venv/bin/python
```

```ejercicio
# Enunciado
Completa la función del módulo fnmatch que compara una ruta con un patrón.

# Plantilla
import fnmatch
print(fnmatch.___("app.pyc", "*.pyc"))

# Esperado
True

# Pista
El mismo nombre del módulo, repetido.
```

# Cuando conviene romper la caché

A veces se quiere lo contrario: forzar que todo se rehaga, por ejemplo para
recoger parches de seguridad de la imagen base.

```bash
docker build --no-cache -t saludo:1 . | grep -c CACHED
```

```salida
0
```

> Doc: [docker build](https://docs.docker.com/reference/cli/docker/buildx/build/)

> Nota: Cero líneas `CACHED`, que es justo la señal de que se rehízo todo.
> Es la opción a usar cuando una construcción da un resultado que no cuadra: si
> con `--no-cache` funciona, el problema era una capa vieja reutilizada.

`--no-cache` se lee tal cual: «sin caché». No borra nada, simplemente construye
como si no hubiera capas guardadas.

```ejercicio
# Enunciado
Completa la opción que obliga a reconstruir sin reutilizar ninguna capa.

# Plantilla
print("docker build " + "___" + " -t saludo:1 .")

# Esperado
docker build --no-cache -t saludo:1 .

# Pista
Dos guiones, «no» y «caché» en inglés, unidos por otro guion.
```

> Doc: [Caché de construcción](https://docs.docker.com/build/cache/)

> Doc: [El contexto de construcción](https://docs.docker.com/build/concepts/context/)

# Cierre

La caché reutiliza capas hasta la primera que cambia y desde ahí rehace todo.
Copiar las dependencias antes que el código convierte cada reconstrucción de
cinco segundos en tres décimas, y `.dockerignore` decide qué se envía desde tu máquina.

La sesión siguiente trata lo que tiene que sobrevivir al contenedor.
