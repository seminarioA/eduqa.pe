---
numero: 7
titulo: "Dependencias de red e impersonación"
---

# certifi

`certifi` proporciona el conjunto de certificados raíz de Mozilla. yt-dlp
puede utilizarlo al validar conexiones TLS.

El asterisco que acompaña a algunas dependencias en el README indica que esas
dependencias se incluyen en los release binaries autónomos.

> Doc: [Dependencies — Networking](https://github.com/yt-dlp/yt-dlp#networking)

```ejercicio
# Enunciado
Completa el nombre del paquete que proporciona el conjunto de certificados raíz de Mozilla.

# Plantilla
paquete = "___"
print(paquete)

# Esperado
certifi

# Pista
Su nombre empieza por `cert`.
```

# brotli y brotlicffi

`brotli` o `brotlicffi` habilitan soporte para contenido HTTP codificado con
Brotli. Son alternativas para la misma capacidad documentada; no representan
dos etapas sucesivas del procesamiento.

```python
alternativas = {"brotli", "brotlicffi"}
print("brotli" in alternativas)
```

```salida
True
```

> Doc: [Dependencies — Networking](https://github.com/yt-dlp/yt-dlp#networking)

```ejercicio
# Enunciado
Completa una de las dos dependencias documentadas para contenido Brotli.

# Plantilla
alternativa = "___"
print(alternativa)

# Esperado
brotli

# Pista
Es la alternativa cuyo nombre coincide exactamente con el algoritmo.
```

# websockets

La dependencia `websockets` habilita descargas sobre WebSocket. El nombre del
paquete describe el protocolo que soporta dentro de yt-dlp.

> Doc: [Dependencies — Networking](https://github.com/yt-dlp/yt-dlp#networking)

```ejercicio
# Enunciado
Completa el paquete usado para descargas sobre WebSocket.

# Plantilla
paquete = "___"
print(paquete)

# Esperado
websockets

# Pista
Es el plural en inglés del nombre del protocolo.
```

# requests

El README documenta `requests` como biblioteca HTTP para soporte de proxy HTTPS
y conexiones persistentes.

Una conexión persistente permite reutilizar una conexión en lugar de abrir una
nueva para cada petición cuando el protocolo y el servidor lo permiten.

> Doc: [Dependencies — Networking](https://github.com/yt-dlp/yt-dlp#networking)

```ejercicio
# Enunciado
Completa el nombre de la biblioteca HTTP documentada para proxy HTTPS y conexiones persistentes.

# Plantilla
biblioteca = "___"
print(biblioteca)

# Esperado
requests

# Pista
Su nombre coincide con «peticiones» en inglés.
```

# Qué significa impersonar

Algunos sitios observan características de la conexión TLS y de las peticiones
para distinguir clientes. El README denomina **impersonation** a la capacidad de
hacer que las peticiones adopten características de navegadores soportados.

Esta capacidad puede ser necesaria en sitios que utilizan *TLS fingerprinting*,
es decir, identificación basada en rasgos de la negociación TLS.

> Doc: [Dependencies — Impersonation](https://github.com/yt-dlp/yt-dlp#impersonation)

# curl_cffi

El proyecto recomienda `curl_cffi` para impersonación. Es un binding de Python
para `curl-impersonate` y proporciona targets de Chrome, Edge y Safari según
la documentación actual.

El extra se puede solicitar junto con las dependencias predeterminadas:

```bash !sin-consola
python -m pip install "yt-dlp[default,curl-cffi]"
```

> Doc: [Dependencies — Impersonation](https://github.com/yt-dlp/yt-dlp#impersonation)

```ejercicio
# Enunciado
Completa el extra que añade soporte de impersonación mediante curl_cffi.

# Plantilla
extra = "yt-dlp[default,___]"
print(extra)

# Esperado
yt-dlp[default,curl-cffi]

# Pista
El nombre del extra usa un guion donde el paquete Python usa un guion bajo.
```

# No todos los binarios incluyen curl_cffi

El README actual indica que `curl_cffi` se incluye en la mayoría de builds,
con excepciones como el ejecutable Unix `yt-dlp` basado en zipimport y la build
Windows x86 de 32 bits.

Por eso la presencia de yt-dlp no demuestra por sí sola que exista soporte de
impersonación en esa instalación concreta.

# Cierre

`certifi`, Brotli, WebSockets y `requests` amplían capacidades de red.
`curl_cffi` habilita impersonación de navegadores y no está presente en todos
los artefactos.

La sesión siguiente completa el mapa de dependencias opcionales con metadatos,
cifrado, keyrings y descargadores externos.
