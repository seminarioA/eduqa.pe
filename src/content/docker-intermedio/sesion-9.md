---
numero: 9
titulo: "Registros y observabilidad"
---

# Dónde acaba lo que imprime

Un contenedor escribe en la salida estándar y Docker lo recoge. Dónde lo guarda
lo decide el **driver de registro**, y el que viene por omisión es `json-file`:
un archivo JSON en el disco de la máquina, uno por contenedor.

```bash
docker inspect logs-json --format '{{.HostConfig.LogConfig.Type}} {{.HostConfig.LogConfig.Config}}'
```

```salida
json-file map[max-size:1k]
```

> Doc: [Drivers de registro](https://docs.docker.com/engine/logging/configure/)

```ejercicio
# Enunciado
Completa el nombre del driver de registro que Docker usa por omisión.

# Plantilla
print("el driver por omisión es " + "___")

# Esperado
el driver por omisión es json-file

# Pista
Dos palabras unidas por guion: el formato y la palabra «archivo» en inglés.
```

# El disco se llena

Sin límite, ese archivo crece hasta que no queda espacio. Es una de las causas
más frecuentes de un servidor que deja de responder sin que nadie haya tocado
nada.

```bash
docker run -d --name logs-json --log-driver json-file --log-opt max-size=1k alpine:3.21 sh -c "for i in 1 2 3; do echo linea \$i; sleep 0.2; done"
```

```salida
c7e91a2f4d3b8e5a0f1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a
```

> Doc: [docker run](https://docs.docker.com/reference/cli/docker/container/run/)

> Nota: `--log-opt max-size=1k` fija el tamaño de cada archivo y `max-file`
> cuántos se conservan al rotar. Con `max-size=10m` y `max-file=3`, un
> contenedor nunca ocupará más de 30 MB de registros, pase lo que pase.
>
> Poner esto **antes** de que haga falta es la diferencia entre una rotación
> configurada y una madrugada borrando archivos a mano.

```ejercicio
# Enunciado
Completa la opción que fija el tamaño máximo de cada archivo de registro.

# Plantilla
print("--log-opt " + "___" + "=10m")

# Esperado
--log-opt max-size=10m

# Pista
Dos palabras unidas por guion: «máximo» y «tamaño» en inglés.
```

# Cuánto ocupa

```python
def espacio(max_size_mb, max_file, contenedores):
    total = max_size_mb * max_file * contenedores
    return f"{contenedores} contenedores x {max_file} archivos x {max_size_mb} MB = {total} MB como máximo"

print(espacio(10, 3, 8))
print(espacio(100, 5, 8))
```

```salida
8 contenedores x 3 archivos x 10 MB = 240 MB como máximo
8 contenedores x 5 archivos x 100 MB = 4000 MB como máximo
```

> Nota: La cuenta hay que hacerla antes. Ocho servicios con la configuración
> generosa de la segunda línea reservan cuatro gigas solo en registros, y eso en
> un servidor pequeño es todo el disco.

```ejercicio
# Enunciado
Completa la multiplicación que da el espacio máximo de registros de 8 contenedores.

# Plantilla
print(10 * 3 * ___)

# Esperado
240

# Pista
Ocho contenedores.
```

# Qué escribir y qué no

```python
lineas = {
    'peticion recibida id=8123 ruta=/pedidos':        "sí — identifica y sitúa",
    'error: no se pudo conectar a la base':           "sí — dice qué falló",
    'usuario=ana@ejemplo.pe tarjeta=4111111111111111': "NO — datos personales y de pago",
    'entrando en la función procesar()':              "no — ruido, no informa de nada",
}
for linea, veredicto in lineas.items():
    print(f"{veredicto:6} {linea}")
```

```salida
sí — identifica y sitúa peticion recibida id=8123 ruta=/pedidos
sí — dice qué falló error: no se pudo conectar a la base
NO — datos personales y de pago usuario=ana@ejemplo.pe tarjeta=4111111111111111
no — ruido, no informa de nada entrando en la función procesar()
```

> Nota: Los registros se guardan, se copian a otros sistemas y los lee gente que
> no debería ver esos datos. Un número de tarjeta en un archivo de registro es
> una filtración aunque nadie entre en el servidor.

```ejercicio
# Enunciado
Completa el dato que nunca debe aparecer en un registro.

# Plantilla
prohibidos = ["contraseñas", "tarjetas", "___"]
print(prohibidos[2])

# Esperado
tokens

# Pista
Seis letras: las credenciales que emite una API.
```

# Medir mientras corre

```bash
docker stats --no-stream --format "table {{.Name}}\t{{.MemUsage}}\t{{.CPUPerc}}"
```

```salida
NAME    MEM USAGE / LIMIT   CPU %
medido  520KiB / 3.827GiB   0.00%
```

> Doc: [docker stats](https://docs.docker.com/reference/cli/docker/container/stats/)

```ejercicio
# Enunciado
Completa el formato que imprime los resultados como una tabla con cabecera.

# Plantilla
print('--format "' + "___" + ' {{.Name}}"')

# Esperado
--format "table {{.Name}}"

# Pista
Cinco letras: «tabla» en inglés.
```

# Los sucesos del demonio

`docker events` emite en tiempo real todo lo que ocurre: contenedores que
arrancan, que mueren, imágenes que se descargan. Es la fuente para entender qué
pasó y en qué orden.

```bash
docker events --since 5m --until 0s --filter type=container --format "{{.Status}} {{.Actor.Attributes.name}}"
```

```salida
create medido
start medido
die medido
destroy medido
```

> Doc: [docker events](https://docs.docker.com/reference/cli/docker/system/events/)

> Nota: `--since` y `--until` acotan la ventana; sin ellas se queda escuchando.
> Ver un `die` seguido de un `start` repetidos es la firma de un contenedor que
> se reinicia en bucle, y ahí es donde `OOMKilled` de la sesión anterior suele
> dar la explicación.

```ejercicio
# Enunciado
Completa el suceso que Docker emite cuando un contenedor termina.

# Plantilla
sucesos = ["create", "start", "___", "destroy"]
print(sucesos[2])

# Esperado
die

# Pista
Tres letras: «morir» en inglés.
```

# Cierre

Los registros van a la salida estándar y el driver decide dónde acaban; sin
rotación llenan el disco. No se escriben datos personales. `docker stats` mide
el consumo y `docker events` cuenta qué ocurrió y cuándo.

La última sesión junta todo esto para diagnosticar un contenedor que no arranca.
