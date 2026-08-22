---
numero: 8
titulo: "Límites de memoria y CPU"
---

# Un contenedor sin límite consume cuanto haya

Por omisión un contenedor puede usar toda la memoria y toda la CPU de la
máquina. Con uno solo no se nota; con varios en el mismo servidor, el que tenga
una fuga se lleva por delante a los demás.

```bash
docker run --rm --memory=64m alpine:3.21 cat /sys/fs/cgroup/memory.max
```

```salida
67108864
```

> Doc: [Límites de recursos](https://docs.docker.com/engine/containers/resource_constraints/)

> Nota: 67108864 son exactamente 64 × 1024 × 1024. El límite lo impone el
> núcleo mediante **cgroups** —*control groups*—, que es el mecanismo de Linux
> para acotar lo que consume un grupo de procesos. El contenedor puede leerlo,
> como acaba de hacer.

```ejercicio
# Enunciado
Completa la multiplicación que convierte 64 MiB en bytes.

# Plantilla
print(64 * 1024 * ___)

# Esperado
67108864

# Pista
Mil veinticuatro.
```

# Reservar no es usar

Aquí hay algo que sorprende. Un programa puede reservar mucha más memoria de la
permitida sin que falle nada:

```bash
docker run --rm --memory=64m python:3.13-alpine python -c "x = bytearray(200*1024*1024); print('reservó 200 MB')"
```

```salida
reservó 200 MB
```

> Doc: [docker run](https://docs.docker.com/reference/cli/docker/container/run/)

> Nota: El sistema concede la reserva porque todavía no se ha usado ni una
> página. Se llama *overcommit*: el núcleo apuesta a que casi nadie usa todo lo
> que pide. El límite no se comprueba al reservar, sino al **tocar** la memoria.

```ejercicio
# Enunciado
Completa el tipo de Python que reserva un bloque de bytes modificable.

# Plantilla
x = ___(10)
print(len(x))

# Esperado
10

# Pista
Nueve letras: «array de bytes» en inglés, todo junto.
```

# Y cuando se escribe en ella

```bash
docker run --name oom --memory=64m python:3.13-alpine python -c "
x = bytearray(200*1024*1024)
for i in range(0, len(x), 4096): x[i] = 1
"
docker inspect oom --format 'OOMKilled={{.State.OOMKilled}} ExitCode={{.State.ExitCode}}'
```

```salida
OOMKilled=true ExitCode=137
```

> Doc: [docker inspect](https://docs.docker.com/reference/cli/docker/inspect/)

> Nota: Ahí está el 137 del curso de introducción, y ahora con su causa: *OOM*
> es *out of memory*, y el núcleo mató el proceso con la señal 9 al pasarse del
> límite. `OOMKilled` es el campo que lo distingue de cualquier otro final
> forzado, y es lo primero que hay que mirar cuando un contenedor se reinicia
> solo sin dejar error en sus registros.
>
> El bucle recorre de 4096 en 4096 porque ese es el tamaño de página: tocar un
> byte de cada página basta para que el núcleo tenga que reservarla de verdad.

```ejercicio
# Enunciado
Completa el tamaño de página en bytes que usa el bucle para tocar toda la memoria.

# Plantilla
print(4096 == ___)

# Esperado
True

# Pista
Dos elevado a doce.
```

# CPU

`--cpus` limita cuánta CPU puede usar, en proporción a un núcleo. `--cpus=0.5`
es medio núcleo; `--cpus=2` son dos.

```python
def reparto(nucleos, contenedores):
    return f"{nucleos} núcleos entre {contenedores} servicios -> --cpus={nucleos / contenedores:.2f} cada uno"

print(reparto(6, 3))
print(reparto(6, 4))
```

```salida
6 núcleos entre 3 servicios -> --cpus=2.00 cada uno
6 núcleos entre 4 servicios -> --cpus=1.50 cada uno
```

> Nota: A diferencia de la memoria, pasarse de CPU no mata nada: simplemente el
> proceso va más lento, porque el núcleo le da menos turnos. Por eso un límite de
> CPU mal puesto se manifiesta como lentitud inexplicable y no como un fallo.

```ejercicio
# Enunciado
Completa el reparto de 6 núcleos entre 3 servicios.

# Plantilla
print(f"--cpus={6 / 3:.2f}" == "--cpus=___")

# Esperado
True

# Pista
Dos coma cero cero.
```

# Ver lo que consumen

```bash
docker stats --no-stream --format "{{.Name}}  {{.MemUsage}}  {{.CPUPerc}}"
```

```salida
medido  520KiB / 3.827GiB  0.00%
```

> Doc: [docker stats](https://docs.docker.com/reference/cli/docker/container/stats/)

> Nota: `--no-stream` toma una única medida y termina; sin ella se queda
> actualizando en pantalla. El segundo número es el límite: si no se puso
> ninguno, aparece toda la memoria de la máquina, que es exactamente la señal de
> que falta acotarlo.

```ejercicio
# Enunciado
Completa la opción que toma una sola medida en vez de quedarse actualizando.

# Plantilla
print("docker stats " + "___")

# Esperado
docker stats --no-stream

# Pista
Dos guiones, «no» y «flujo» en inglés, unidos por otro guion.
```

# Declararlo en Compose

```python
import yaml

texto = """
services:
  api:
    image: api:1.0.0
    deploy:
      resources:
        limits:
          memory: 512M
          cpus: "1.0"
"""
limites = yaml.safe_load(texto)["services"]["api"]["deploy"]["resources"]["limits"]
for recurso, valor in limites.items():
    print(f"{recurso:8} {valor}")
```

```salida
memory   512M
cpus     1.0
```

> Nota: Va bajo `deploy.resources.limits`, y ese `deploy` despista porque nació
> pensado para orquestadores. En Compose moderno los límites se aplican también
> al levantarlo en una sola máquina.

```ejercicio
# Enunciado
Completa la clave que contiene los límites dentro de los recursos.

# Plantilla
import yaml
c = yaml.safe_load("resources:\n  limits:\n    memory: 512M\n")
print(c["resources"]["___"])

# Esperado
{'memory': '512M'}

# Pista
Seis letras: «límites» en inglés.
```

# Cierre

La memoria se acota con `--memory` y pasarse mata el proceso con 137 y
`OOMKilled=true`; la CPU se acota con `--cpus` y pasarse solo ralentiza.
`docker stats` mide, y en Compose se declara bajo `deploy.resources.limits`.

La sesión siguiente trata lo que el contenedor deja escrito mientras corre.
