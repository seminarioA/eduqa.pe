---
numero: 30
titulo: "Detener el proceso con --break-match-filters"
---

# --break-match-filters

`--break-match-filters FILTER` utiliza la misma sintaxis de filtros que
`--match-filters`, pero cambia la consecuencia del rechazo: detiene el proceso
de descarga cuando un vídeo no cumple el filtro.

> Doc: [Video Selection — --break-match-filters](https://github.com/yt-dlp/yt-dlp#video-selection)

```ejercicio
# Enunciado
Completa la opción que detiene el proceso cuando un vídeo es rechazado por el filtro.

# Plantilla
opcion = "--break-___"
print(opcion)

# Esperado
--break-match-filters

# Pista
Añade `break-` delante del nombre de los filtros normales.
```

# Rechazar y detener son efectos diferentes

Con un filtro normal, un elemento puede descartarse y el procesamiento continuar
con los siguientes. Con `--break-match-filters`, el rechazo se convierte en
una condición de terminación.

```opcion-multiple
# Enunciado
¿Qué diferencia principal introduce --break-match-filters?

# Opciones
- Cambia los campos disponibles
- Convierte el rechazo del filtro en una detención del proceso
- Descarga todos los formatos
- Desactiva las playlists

# Correcta
2

# Explicación
La sintaxis del filtro es la misma; cambia la consecuencia cuando un vídeo no coincide.

# Pista
La palabra `break` describe el cambio.
```

# --no-break-match-filters

`--no-break-match-filters` elimina estas condiciones de detención y es el
comportamiento predeterminado.

```ejercicio
# Enunciado
Completa la opción que desactiva los filtros de ruptura.

# Plantilla
print("___")

# Esperado
--no-break-match-filters

# Pista
Niega la opción anterior con `--no-`.
```

# El mismo lenguaje de FILTER

Como la opción usa el mismo lenguaje que `--match-filters`, los campos y
operadores se reutilizan. No existe un segundo lenguaje de expresiones para
`--break-match-filters`.

```python
filtro = "!is_live"
normal = ["--match-filters", filtro]
ruptura = ["--break-match-filters", filtro]
print(normal[1] == ruptura[1])
```

```salida
True
```

# Cierre

`--match-filters` decide si un elemento se acepta; `--break-match-filters`
puede convertir un rechazo en la terminación del proceso. Ambos comparten la
misma sintaxis de filtros.

La sesión siguiente decide si una URL ambigua debe tratarse como vídeo individual
o como playlist y añade el límite de edad.
