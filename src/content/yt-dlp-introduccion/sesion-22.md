---
numero: 22
titulo: "Configurar IPv4 e IPv6 desde Python"
---

# Construir la familia de direcciones IP desde Python

Python mantiene cada opción y cada valor como elementos independientes. `comando_yt_dlp()` añade el intérprete y el módulo, por lo que la automatización no necesita formar una cadena de shell.

```python
argumentos = ["--force-ipv4", "https://media.example/video"]
print(" ".join(comando_yt_dlp(*argumentos)[3:]))
```

```salida
--force-ipv4 https://media.example/video
```

> Doc: [yt-dlp — opción documentada](https://github.com/yt-dlp/yt-dlp#network-options)

```ejercicio
# Enunciado
Completa la primera opción de esta invocación.

# Plantilla
argumentos = ["___", "https://media.example/video"]
print(" ".join(comando_yt_dlp(*argumentos)[3:]))

# Esperado
--force-ipv4 https://media.example/video

# Pista
La opción corresponde al mecanismo principal de esta sesión.
```


# --source-address

`--source-address IP` enlaza las conexiones del cliente a la dirección IP
local indicada.

La dirección de origen pertenece al lado cliente de la conexión. No cambia la
dirección del servidor que aparece en la URL.

> Doc: [Network Options — --source-address](https://github.com/yt-dlp/yt-dlp#network-options)

```ejercicio
# Enunciado
Completa la opción que fija la dirección IP local de origen.

# Plantilla
print("yt-dlp " + "___" + " 192.0.2.10")

# Esperado
yt-dlp --source-address 192.0.2.10

# Pista
El nombre une `source` y `address`.
```

# -4 y --force-ipv4

`-4` es la forma corta de `--force-ipv4`. Obliga a que las conexiones se
realicen mediante IPv4.

IPv4 significa *Internet Protocol version 4*.

```bash !sin-consola
yt-dlp -4 "URL"
```

> Doc: [Network Options — --force-ipv4](https://github.com/yt-dlp/yt-dlp#network-options)

```ejercicio
# Enunciado
Completa la forma corta que obliga a usar IPv4.

# Plantilla
print("yt-dlp " + "___")

# Esperado
yt-dlp -4

# Pista
La opción corta es el número de versión precedido por un guion.
```

# -6 y --force-ipv6

`-6` es la forma corta de `--force-ipv6`. Obliga a que las conexiones se
realicen mediante IPv6.

IPv6 significa *Internet Protocol version 6*.

```bash !sin-consola
yt-dlp -6 "URL"
```

> Doc: [Network Options — --force-ipv6](https://github.com/yt-dlp/yt-dlp#network-options)

```ejercicio
# Enunciado
Completa la forma larga equivalente a -6.

# Plantilla
opcion = "--force-___"
print(opcion)

# Esperado
--force-ipv6

# Pista
La opción termina en la versión del protocolo.
```

# Dirección concreta y familia de protocolo

`--source-address` elige una dirección local concreta. `--force-ipv4` y
`--force-ipv6` restringen la familia de IP de las conexiones.

Son controles relacionados pero no equivalentes: uno especifica una dirección y
los otros restringen la versión del protocolo.

```ejercicio
# Enunciado
Completa la opción que expresa una familia de protocolo, no una IP local concreta.

# Plantilla
opcion = "___"
print(opcion)

# Esperado
--force-ipv4

# Pista
La opción contiene la palabra `force`.
```

# Cierre con Python

Python dejó la familia de direcciones IP representada como datos que pueden validarse y ejecutarse mediante `ejecutar_yt_dlp()`.


`--source-address` fija el origen local; `-4` y `-6` fuerzan IPv4 o IPv6.
La elección de familia y la elección de dirección son decisiones de red
separadas.

La sesión siguiente estudia la impersonación de clientes desde la propia CLI.
