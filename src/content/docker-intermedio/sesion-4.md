---
numero: 4
titulo: "Comprobaciones de salud y arranque ordenado"
---

# Lo que `depends_on` no hace

En el curso de introducción quedó dicho de pasada y aquí es el tema: `depends_on`
fija el **orden de arranque**, no espera a que el servicio esté listo. Docker
arranca la base de datos, ve que su contenedor existe y arranca la aplicación,
que intenta conectarse mientras postgres todavía está inicializando.

El resultado es un fallo que aparece solo a veces, según lo que tarde la
máquina, y que desaparece al reintentar. De los peores de diagnosticar.

# Una comprobación de salud

`healthcheck` define un comando que Docker ejecuta periódicamente dentro del
contenedor. Si devuelve cero, el servicio está sano.

```bash
cat compose-salud.yaml
```

```salida
services:
  bd:
    image: postgres:16-alpine
    environment:
      POSTGRES_PASSWORD: secreto
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 2s
      retries: 10
  api:
    image: alpine:3.21
    command: ["sh", "-c", "echo la base ya acepta conexiones"]
    depends_on:
      bd:
        condition: service_healthy
```

> Doc: [healthcheck en Compose](https://docs.docker.com/reference/compose-file/services/#healthcheck)

Las piezas:

- **`test`** es el comando. `CMD-SHELL` lo pasa por un intérprete de órdenes;
  `CMD` lo ejecuta directamente, sin shell.
- **`interval`** es cada cuánto se repite; **`retries`**, cuántos fallos
  seguidos se requieren para declararlo enfermo.
- **`condition: service_healthy`** es lo que convierte `depends_on` en una
  espera de verdad.

```ejercicio
# Enunciado
Completa la condición que hace que un servicio espere a que el otro esté sano.

# Plantilla
import yaml
c = yaml.safe_load("api:\n  depends_on:\n    bd:\n      condition: service_healthy\n")
print(c["api"]["depends_on"]["bd"]["___"])

# Esperado
service_healthy

# Pista
Nueve letras: «condición» en inglés.
```

# La espera, en marcha

```bash
docker compose -f compose-salud.yaml up --abort-on-container-exit
```

```salida
 Network inter_default Created
 Container inter-bd-1 Created
 Container inter-api-1 Created
 Container inter-bd-1 Started
 Container inter-bd-1 Waiting
 Container inter-bd-1 Healthy
api-1  | la base ya acepta conexiones
 Container inter-api-1 Started
```

> Doc: [docker compose up](https://docs.docker.com/reference/cli/docker/compose/up/)

> Nota: Léelo despacio, porque ahí está todo. La base arranca (`Started`),
> Compose se pone a esperar (`Waiting`), la declara sana (`Healthy`) y **solo
> entonces** arranca la aplicación. Sin la condición, `Started` habría sido
> suficiente y la aplicación habría corrido con la base a medio arrancar.

```ejercicio
# Enunciado
Completa el estado que Compose imprime justo antes de arrancar el servicio dependiente.

# Plantilla
estados = ["Started", "Waiting", "___"]
print(estados[-1])

# Esperado
Healthy

# Pista
Siete letras: «sano» en inglés, con mayúscula.
```

# Consultar el estado

```bash
docker inspect --format '{{.State.Health.Status}}' inter-bd-1
```

```salida
healthy
```

> Doc: [docker inspect](https://docs.docker.com/reference/cli/docker/inspect/)

> Nota: Los estados posibles son `starting`, `healthy` y `unhealthy`. Durante el
> primer intervalo está en `starting`, que no es lo mismo que enfermo: es que
> todavía no se sabe.

```ejercicio
# Enunciado
Completa el estado en el que está un contenedor mientras aún no se ha comprobado.

# Plantilla
estados = ["___", "healthy", "unhealthy"]
print(estados[0])

# Esperado
starting

# Pista
Ocho letras: «arrancando» en inglés.
```

# Elegir bien el comando

Una comprobación mala es peor que ninguna: da confianza sin fundamento.

```python
comprobaciones = {
    "pg_isready -U postgres":            "sí — pregunta al servidor si acepta conexiones",
    "curl -f http://localhost:8000/salud": "sí — recorre la aplicación entera",
    "ps aux | grep python":              "no — el proceso puede estar vivo y colgado",
    "exit 0":                            "no — siempre sano, no comprueba nada",
}
for comando, veredicto in comprobaciones.items():
    print(f"{comando:38} {veredicto}")
```

```salida
pg_isready -U postgres                 sí — pregunta al servidor si acepta conexiones
curl -f http://localhost:8000/salud    sí — recorre la aplicación entera
ps aux | grep python                   no — el proceso puede estar vivo y colgado
exit 0                                 no — siempre sano, no comprueba nada
```

> Nota: La regla es que la comprobación recorra el mismo camino que una petición
> real. Mirar si el proceso existe no sirve: un servidor que agotó su pool de
> conexiones sigue teniendo el proceso vivo y no atiende a nadie.

```ejercicio
# Enunciado
Completa la opción de curl que devuelve error cuando la respuesta no es correcta.

# Plantilla
print("curl " + "___" + " http://localhost:8000/salud")

# Esperado
curl -f http://localhost:8000/salud

# Pista
Un guion y una letra: la inicial de «fail» en inglés.
```

# Reintentar también en la aplicación

La comprobación de salud resuelve el arranque, no la vida entera. Una base de
datos puede reiniciarse a mediodía, y para eso la aplicación tiene que
reintentar por su cuenta.

```python
import time

def conectar(intentos=5, espera=0.1):
    for intento in range(1, intentos + 1):
        if intento == 3:                      # el tercero funciona
            return f"conectado en el intento {intento}"
        time.sleep(espera)
    raise RuntimeError("no se pudo conectar")

print(conectar())
```

```salida
conectado en el intento 3
```

> Nota: En producción la espera se aumenta en cada intento —espera exponencial—
> para no golpear un servicio caído. Lo importante es que el reintento viva en
> la aplicación: `healthcheck` no la protege una vez arrancada.

```ejercicio
# Enunciado
Completa el intento en el que la función logra conectar.

# Plantilla
def conectar(intentos=5):
    for intento in range(1, intentos + 1):
        if intento == 3:
            return intento
print(conectar() == ___)

# Esperado
True

# Pista
Tres.
```

# Cierre

`depends_on` a secas solo ordena; con `condition: service_healthy` espera de
verdad, y el `healthcheck` es lo que da esa señal. La comprobación tiene que
recorrer el camino real, y la aplicación reintentar por su cuenta.

La sesión siguiente separa la configuración de desarrollo de la de producción
sin duplicar el archivo.
