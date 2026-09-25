---
numero: 25
titulo: "Configurar X-Forwarded-For desde Python"
---

# Construir la política geográfica X-Forwarded-For desde Python

Python mantiene cada opción y cada valor como elementos independientes. `comando_yt_dlp()` añade el intérprete y el módulo, por lo que la automatización no necesita formar una cadena de shell.

```python
argumentos = ["--xff", "PE", "https://media.example/video"]
print(" ".join(comando_yt_dlp(*argumentos)[3:]))
```

```salida
--xff PE https://media.example/video
```

> Doc: [yt-dlp — opción documentada](https://github.com/yt-dlp/yt-dlp#geo-restriction)

```ejercicio
# Enunciado
Completa la primera opción de esta invocación.

# Plantilla
argumentos = ["___", "PE", "https://media.example/video"]
print(" ".join(comando_yt_dlp(*argumentos)[3:]))

# Esperado
--xff PE https://media.example/video

# Pista
La opción corresponde al mecanismo principal de esta sesión.
```


# --geo-verification-proxy

`--geo-verification-proxy URL` configura un proxy utilizado para verificar la
dirección IP en determinados sitios con restricciones geográficas.

El README distingue este proxy del proxy de descarga: la descarga real utiliza
el proxy indicado por `--proxy` o conexión directa si no existe esa opción.

> Doc: [Geo-restriction — --geo-verification-proxy](https://github.com/yt-dlp/yt-dlp#geo-restriction)

```ejercicio
# Enunciado
Completa la opción que configura el proxy utilizado para verificación geográfica.

# Plantilla
opcion = "--geo-verification-___"
print(opcion)

# Esperado
--geo-verification-proxy

# Pista
La última palabra es `proxy`.
```

# Proxy de verificación y proxy de descarga

La separación permite que la fase de verificación use una ruta de red y la
descarga use otra.

```python
proxies = {
    "verificacion": "--geo-verification-proxy",
    "descarga": "--proxy",
}
print(proxies["descarga"])
```

```salida
--proxy
```

```ejercicio
# Enunciado
Completa la opción que sigue gobernando el proxy de la descarga real.

# Plantilla
opcion = "___"
print(opcion)

# Esperado
--proxy

# Pista
Es la opción de red estudiada anteriormente.
```

# --xff

`--xff VALUE` controla cómo yt-dlp construye el encabezado HTTP
`X-Forwarded-For` para intentar superar determinadas restricciones
geográficas.

El encabezado es una señal enviada en una petición HTTP; no cambia por sí mismo
la dirección IP real de la conexión.

> Doc: [Geo-restriction — --xff](https://github.com/yt-dlp/yt-dlp#geo-restriction)

```ejercicio
# Enunciado
Completa la opción abreviada que controla X-Forwarded-For.

# Plantilla
print("yt-dlp " + "___" + " never")

# Esperado
yt-dlp --xff never

# Pista
El nombre son las iniciales del encabezado.
```

# default y never

El valor `default` usa X-Forwarded-For únicamente cuando yt-dlp conoce un caso
en el que resulta útil. El valor `never` impide utilizar ese mecanismo.

```ejercicio
# Enunciado
Completa el valor que desactiva el uso de X-Forwarded-For.

# Plantilla
valor = "___"
print(valor)

# Esperado
never

# Pista
Significa «nunca» en inglés.
```

# Bloques CIDR y códigos de país

`--xff` también acepta un bloque IP en notación CIDR o un código de país de
dos letras según la documentación actual.

CIDR significa *Classless Inter-Domain Routing*. Su notación combina una
dirección y una longitud de prefijo, por ejemplo `192.0.2.0/24`.

```python
bloque = "192.0.2.0/24"
print(bloque.split("/")[1])
```

```salida
24
```

# Cierre con Python

Python dejó la política geográfica X-Forwarded-For representada como datos que pueden validarse y ejecutarse mediante `ejecutar_yt_dlp()`.


`--geo-verification-proxy` separa el proxy de verificación del proxy de
descarga. `--xff` controla el encabezado X-Forwarded-For mediante políticas,
bloques CIDR o códigos de país.

La sesión siguiente empieza la selección de vídeos por posiciones dentro de
playlists.
