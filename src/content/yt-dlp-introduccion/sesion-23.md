---
numero: 23
titulo: "Impersonar clientes HTTP"
---

# --impersonate

`--impersonate CLIENT[:OS]` solicita que las peticiones imiten un cliente
soportado. El sistema operativo puede añadirse después de dos puntos.

El README ofrece valores como `chrome`, `chrome-110` y
`chrome:windows-10`.

> Doc: [Network Options — --impersonate](https://github.com/yt-dlp/yt-dlp#network-options)

```ejercicio
# Enunciado
Completa la opción que solicita impersonar Chrome.

# Plantilla
print("yt-dlp " + "___" + " chrome")

# Esperado
yt-dlp --impersonate chrome

# Pista
La opción usa el verbo inglés `impersonate`.
```

# CLIENT:OS

Los dos puntos (`:`) separan el cliente del sistema operativo cuando ambos se
declaran.

```python
cliente = "chrome"
sistema = "windows-10"
print(f"{cliente}:{sistema}")
```

```salida
chrome:windows-10
```

```ejercicio
# Enunciado
Completa el separador entre cliente y sistema operativo.

# Plantilla
print("chrome___windows-10")

# Esperado
chrome:windows-10

# Pista
Se utiliza el carácter de dos puntos.
```

# Una cadena vacía significa cualquier cliente

El README documenta `--impersonate=""` para permitir que yt-dlp impersonifique
cualquier target disponible.

Esta forma no significa «desactivar impersonación»; autoriza una elección sin
fijar un cliente específico.

```ejercicio
# Enunciado
Completa el valor Python equivalente al argumento vacío.

# Plantilla
valor = ___
print(len(valor))

# Esperado
0

# Pista
Una cadena vacía tiene longitud cero.
```

# Forzar impersonación puede perjudicar rendimiento

La documentación advierte que forzar impersonación para todas las peticiones
puede reducir la velocidad y la estabilidad de descarga.

La impersonación se aplica cuando resuelve una necesidad del sitio; no debe
tratarse como una optimización general.

> Nota: Impersonar un cliente no convierte una petición en una sesión
> autenticada. Cookies, credenciales e impersonación resuelven problemas
> distintos.

# --list-impersonate-targets

`--list-impersonate-targets` enumera los clientes que la instalación puede
impersonar.

```bash !sin-consola
yt-dlp --list-impersonate-targets
```

> Doc: [Network Options — --list-impersonate-targets](https://github.com/yt-dlp/yt-dlp#network-options)

```ejercicio
# Enunciado
Completa la opción que enumera targets de impersonación disponibles.

# Plantilla
print("yt-dlp " + "___")

# Esperado
yt-dlp --list-impersonate-targets

# Pista
Empieza con `--list-`.
```

# Cierre

`--impersonate` selecciona un cliente y opcionalmente un sistema operativo;
el valor vacío permite cualquier target. `--list-impersonate-targets`
consulta las capacidades de la instalación.

La sesión siguiente habilita un esquema de URL que yt-dlp desactiva por razones
de seguridad.
