---
numero: 5
titulo: "Un archivo, varios entornos"
---

# El problema

En desarrollo quieres el código montado desde tu carpeta, los puertos abiertos y
un servicio extra para depurar. En producción no quieres nada de eso. Duplicar
el `compose.yaml` funciona hasta que alguien cambia uno y se olvida del otro.

Compose trae tres mecanismos para evitarlo: el archivo de sobreescritura, los
perfiles y la interpolación de variables.

# El archivo de sobreescritura

Si existe un `compose.override.yaml`, Compose lo mezcla con el principal sin que
haya que nombrarlo. Lo que declara gana.

```bash
cat compose.yaml
```

```salida
services:
  api:
    image: alpine:3.21
    command: ["sh", "-c", "echo interpolado=$ENTORNO  del-contenedor=$$ENTORNO"]
    environment:
      ENTORNO: ${ENTORNO:-produccion}
  depurador:
    image: alpine:3.21
    command: ["echo", "solo en desarrollo"]
    profiles: ["desarrollo"]
```

> Doc: [Fusión de archivos Compose](https://docs.docker.com/compose/how-tos/multiple-compose-files/merge/)

```bash
cat compose.override.yaml
```

```salida
services:
  api:
    environment:
      ENTORNO: desarrollo-local
```

> Doc: [Referencia del archivo Compose](https://docs.docker.com/reference/compose-file/)

```ejercicio
# Enunciado
Completa el nombre del archivo que Compose mezcla solo, sin tener que nombrarlo.

# Plantilla
print("compose." + "___" + ".yaml")

# Esperado
compose.override.yaml

# Pista
Ocho letras: «sobreescribir» en inglés.
```

# Dos dólares que no son lo mismo

Aquí hay una trampa que consume horas de diagnóstico. Compose **interpola las variables del YAML
antes de arrancar nada**, leyéndolas de `.env` o del entorno de tu terminal. Un
`$VARIABLE` dentro de un `command` lo sustituye Compose, no el contenedor.

Para que la lea el contenedor hay que escapar el símbolo: `$$VARIABLE`.

```bash
docker compose -f compose.yaml up --abort-on-container-exit
```

```salida
api-1  | interpolado=desde-archivo del-contenedor=desde-archivo
```

> Doc: [Interpolación de variables](https://docs.docker.com/reference/compose-file/interpolation/)

Ahora con el archivo de sobreescritura, que cambia el `environment` del servicio:

```bash
docker compose up --abort-on-container-exit
```

```salida
api-1  | interpolado=desde-archivo del-contenedor=desarrollo-local
```

> Doc: [docker compose up](https://docs.docker.com/reference/cli/docker/compose/up/)

> Nota: Léelo comparando las dos líneas. `interpolado` no cambia: lo resolvió
> Compose desde `.env` cuando leyó el archivo, y el override no puede tocarlo
> porque para entonces ya era texto fijo. `del-contenedor` sí cambia, porque esa
> variable la lee el proceso al ejecutarse y ahí sí manda el `environment`
> fusionado.
>
> Es la causa de un desconcierto muy común: cambiar una variable en el override
> y ver que no surte efecto, porque el sitio donde se usaba llevaba un solo
> dólar.

```ejercicio
# Enunciado
Completa el símbolo escapado que hace que la variable la lea el contenedor y no Compose.

# Plantilla
print("___" + "ENTORNO")

# Esperado
$$ENTORNO

# Pista
Dos veces el símbolo del dólar.
```

# Ver el resultado de la mezcla

`docker compose config` imprime la configuración ya fusionada e interpolada. Es
la forma de comprobar qué va a arrancar antes de arrancarlo.

```bash
docker compose config
```

```salida
    environment:
      ENTORNO: desarrollo-local
    image: alpine:3.21
    networks:
```

> Doc: [docker compose config](https://docs.docker.com/reference/cli/docker/compose/config/)

```ejercicio
# Enunciado
Completa el subcomando que muestra la configuración ya fusionada.

# Plantilla
print("docker compose " + "___")

# Esperado
docker compose config

# Pista
Seis letras: «configuración» abreviado.
```

# Perfiles

Un servicio con `profiles` no arranca salvo que se pida su perfil. Sirve para
las piezas que solo existen en desarrollo.

```bash
docker compose config --services
docker compose --profile desarrollo config --services
```

```salida
api
api
depurador
```

> Doc: [Perfiles en Compose](https://docs.docker.com/compose/how-tos/profiles/)

> Nota: Sin perfil, `depurador` ni siquiera aparece en la lista de servicios: no
> es que esté parado, es que no forma parte de esa composición. Eso permite
> tener herramientas de desarrollo en el mismo archivo que se despliega, sin
> riesgo de que se levanten donde no deben.

```ejercicio
# Enunciado
Completa la clave que hace que un servicio solo arranque si se pide su perfil.

# Plantilla
import yaml
c = yaml.safe_load("depurador:\n  profiles: ['desarrollo']\n")
print(c["depurador"]["___"])

# Esperado
['desarrollo']

# Pista
Ocho letras: «perfiles» en inglés.
```

# El archivo de variables

`.env` se lee solo, desde el directorio del proyecto, y alimenta la
interpolación. **No se versiona**: es donde van las contraseñas.

```python
def leer_env(texto):
    valores = {}
    for linea in texto.strip().splitlines():
        linea = linea.strip()
        if not linea or linea.startswith("#"):
            continue
        clave, _, valor = linea.partition("=")
        valores[clave.strip()] = valor.strip()
    return valores

print(leer_env("""
# entorno local
ENTORNO=desde-archivo
POSTGRES_PASSWORD=secreto
"""))
```

```salida
{'ENTORNO': 'desde-archivo', 'POSTGRES_PASSWORD': 'secreto'}
```

> Nota: `${ENTORNO:-produccion}` significa «usa `ENTORNO`, y si no está, usa
> `produccion`». Ese valor por omisión es lo que hace que el archivo funcione en
> un servidor donde nadie creó un `.env`.

```ejercicio
# Enunciado
Completa el método que separa la línea en clave y valor por el primer signo igual.

# Plantilla
print("CLAVE=valor".___("=")[2])

# Esperado
valor

# Pista
Nueve letras: «particionar» en inglés.
```

# Cierre

Un solo archivo base, un override que se mezcla solo, perfiles para lo que
sobra en producción y `.env` fuera del repositorio. Y la regla más difícil
de interiorizar: un dólar lo resuelve Compose, dos lo resuelve el contenedor.

La sesión siguiente trata lo que nunca debe acabar dentro de una imagen.
