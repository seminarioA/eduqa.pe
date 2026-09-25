---
numero: 15
titulo: "Seleccionar runtimes JavaScript desde Python"
---

# Construir el runtime JavaScript desde Python

En Python, cada opción y cada valor se mantienen como elementos independientes de una lista. `comando_yt_dlp()` añade el intérprete y el módulo de yt-dlp; de este modo no es necesario concatenar una orden para que después la interprete un shell.

```python
argumentos = ["--js-runtimes", "deno"]
comando = comando_yt_dlp(*argumentos)
print(" ".join(comando[3:]))
```

```salida
--js-runtimes deno
```

> Doc: [yt-dlp — opción documentada](https://github.com/yt-dlp/yt-dlp#general-options)

```ejercicio
# Enunciado
Completa la primera opción de esta invocación.

# Plantilla
argumentos = ["___", "deno"]
print(" ".join(comando_yt_dlp(*argumentos)[3:]))

# Esperado
--js-runtimes deno

# Pista
La opción aparece en el título del punto principal de esta sesión.
```


# --js-runtimes

`--js-runtimes RUNTIME[:PATH]` habilita un runtime JavaScript adicional.
Después del nombre puede aparecer, separado por dos puntos (`:`), el ejecutable
o el directorio donde se encuentra.

La opción puede repetirse para habilitar varios runtimes.

> Doc: [General Options — --js-runtimes](https://github.com/yt-dlp/yt-dlp#general-options)

```ejercicio
# Enunciado
Completa la opción que habilita un runtime JavaScript adicional.

# Plantilla
print("yt-dlp " + "___" + " node")

# Esperado
yt-dlp --js-runtimes node

# Pista
El nombre termina en el plural `runtimes`.
```

# Nombre y ruta

La forma `RUNTIME:PATH` asocia un runtime con una ubicación explícita. Los dos
puntos (`:`) son el separador documentado entre ambos componentes.

```python
runtime = "node"
ruta = "/opt/node/bin/node"
print(f"{runtime}:{ruta}")
```

```salida
node:/opt/node/bin/node
```

```ejercicio
# Enunciado
Completa el separador entre el runtime y su PATH explícito.

# Plantilla
runtime = "node"
ruta = "/opt/node/bin/node"
print(runtime + "___" + ruta)

# Esperado
node:/opt/node/bin/node

# Pista
Es el carácter de dos puntos.
```

# Prioridad documentada

El README enumera la prioridad actual de mayor a menor como
`deno`, `node`, `quickjs`, `bun`. El runtime utilizado es el de mayor
prioridad que esté habilitado y disponible.

```python
prioridad = ["deno", "node", "quickjs", "bun"]
print(prioridad[0])
```

```salida
deno
```

```ejercicio
# Enunciado
Completa el runtime con la prioridad más alta según el README actual.

# Plantilla
prioridad = ["___", "node", "quickjs", "bun"]
print(prioridad[0])

# Esperado
deno

# Pista
También es el único habilitado por defecto.
```

# Deno está habilitado por defecto

La documentación actual indica que solo Deno está habilitado por defecto. Para
forzar el uso de un runtime de menor prioridad cuando Deno está disponible,
primero se usa `--no-js-runtimes` y después se habilita el runtime deseado.

```bash !sin-consola
yt-dlp --no-js-runtimes --js-runtimes node "URL"
```

> Doc: [General Options — --js-runtimes](https://github.com/yt-dlp/yt-dlp#general-options)

# --no-js-runtimes

`--no-js-runtimes` limpia los runtimes habilitados, incluidos los
predeterminados y los añadidos previamente en la misma configuración.

```ejercicio
# Enunciado
Completa la opción que limpia todos los runtimes JavaScript habilitados.

# Plantilla
opcion = "___"
print(opcion)

# Esperado
--no-js-runtimes

# Pista
Empieza por el prefijo negativo `--no-`.
```

# Cierre con Python

Python dejó el runtime JavaScript representada como una lista explícita de argumentos que puede reutilizarse, validarse o ejecutarse con `ejecutar_yt_dlp()`.


`--js-runtimes` habilita motores y puede indicar su ruta; la prioridad actual
es Deno, Node, QuickJS y Bun. `--no-js-runtimes` reinicia la lista para poder
construir una selección explícita.

La sesión siguiente controla si yt-dlp puede obtener componentes remotos.
