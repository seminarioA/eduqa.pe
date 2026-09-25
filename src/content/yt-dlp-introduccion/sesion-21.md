---
numero: 21
titulo: "Configurar proxy y timeout desde Python"
---

# Construir proxy y timeout de socket desde Python

Python mantiene cada opción y cada valor como elementos independientes. `comando_yt_dlp()` añade el intérprete y el módulo, por lo que la automatización no necesita formar una cadena de shell.

```python
argumentos = ["--proxy", "socks5://127.0.0.1:1080", "--socket-timeout", "20", "https://media.example/video"]
print(" ".join(comando_yt_dlp(*argumentos)[3:]))
```

```salida
--proxy socks5://127.0.0.1:1080 --socket-timeout 20 https://media.example/video
```

> Doc: [yt-dlp — opción documentada](https://github.com/yt-dlp/yt-dlp#network-options)

```ejercicio
# Enunciado
Completa la primera opción de esta invocación.

# Plantilla
argumentos = ["___", "socks5://127.0.0.1:1080", "--socket-timeout", "20", "https://media.example/video"]
print(" ".join(comando_yt_dlp(*argumentos)[3:]))

# Esperado
--proxy socks5://127.0.0.1:1080 --socket-timeout 20 https://media.example/video

# Pista
La opción corresponde al mecanismo principal de esta sesión.
```


# --proxy

`--proxy URL` hace que yt-dlp utilice el proxy HTTP, HTTPS o SOCKS indicado
para las conexiones a las que se aplica la configuración.

Un **proxy** es un intermediario de red: el cliente establece la comunicación
con el proxy y este realiza o reenvía la conexión hacia el destino.

> Doc: [Network Options — --proxy](https://github.com/yt-dlp/yt-dlp#network-options)

```ejercicio
# Enunciado
Completa la opción que configura un proxy de red.

# Plantilla
print("yt-dlp " + "___" + " http://127.0.0.1:8080")

# Esperado
yt-dlp --proxy http://127.0.0.1:8080

# Pista
La opción usa directamente la palabra `proxy`.
```

# El esquema identifica el tipo de proxy

Para SOCKS debe utilizarse un esquema adecuado en la URL. El README muestra
como ejemplo una dirección de la forma
`socks5://user:pass@127.0.0.1:1080/`.

El prefijo `socks5://` no es decoración: identifica el protocolo del proxy.

```python
proxy = "socks5://user:pass@127.0.0.1:1080/"
print(proxy.split("://", 1)[0])
```

```salida
socks5
```

```ejercicio
# Enunciado
Completa el esquema del proxy SOCKS5 del ejemplo.

# Plantilla
url = "___://127.0.0.1:1080/"
print(url)

# Esperado
socks5://127.0.0.1:1080/

# Pista
El esquema contiene el nombre del protocolo y su versión.
```

# Una cadena vacía fuerza conexión directa

El README documenta `--proxy ""` para solicitar una conexión directa. En una
shell, las comillas representan un argumento vacío y no forman parte del valor.

```bash !sin-consola
yt-dlp --proxy "" "URL"
```

> Doc: [Network Options — --proxy](https://github.com/yt-dlp/yt-dlp#network-options)

```ejercicio
# Enunciado
Completa el valor Python que representa el argumento vacío usado para conexión directa.

# Plantilla
proxy = ___
print(len(proxy))

# Esperado
0

# Pista
Una cadena vacía se escribe con dos comillas.
```

# --socket-timeout

`--socket-timeout SECONDS` define cuántos segundos espera yt-dlp antes de
abandonar una operación de socket que no responde dentro del tiempo configurado.

El valor se expresa en segundos.

```bash !sin-consola
yt-dlp --socket-timeout 30 "URL"
```

> Doc: [Network Options — --socket-timeout](https://github.com/yt-dlp/yt-dlp#network-options)

```ejercicio
# Enunciado
Completa la opción que fija un timeout de socket de 30 segundos.

# Plantilla
print("yt-dlp " + "___" + " 30")

# Esperado
yt-dlp --socket-timeout 30

# Pista
El nombre contiene `socket` y `timeout`.
```

# Cierre con Python

Python dejó proxy y timeout de socket representada como datos que pueden validarse y ejecutarse mediante `ejecutar_yt_dlp()`.


`--proxy` cambia el intermediario de red y una cadena vacía solicita conexión
directa. `--socket-timeout` controla cuánto espera una operación de socket
antes de abandonarse.

La sesión siguiente controla la dirección local y la versión de IP usada para
las conexiones.
