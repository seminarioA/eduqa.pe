---
numero: 18
titulo: "Directos y emisiones programadas"
---

# --live-from-start

`--live-from-start` intenta descargar un livestream desde su comienzo. El
README la marca actualmente como experimental y limita el soporte a YouTube,
Twitch, TVer y mellow-fan.

Una opción experimental puede cambiar de comportamiento y no debe presentarse
como equivalente a una capacidad estable en todos los extractores.

> Doc: [General Options — --live-from-start](https://github.com/yt-dlp/yt-dlp#general-options)

```ejercicio
# Enunciado
Completa la opción que solicita descargar un directo desde su inicio.

# Plantilla
print("yt-dlp " + "___")

# Esperado
yt-dlp --live-from-start

# Pista
El nombre contiene `live` y `start`.
```

# --no-live-from-start

`--no-live-from-start` descarga el livestream desde el momento actual y es el
comportamiento predeterminado documentado.

```ejercicio
# Enunciado
Completa la opción predeterminada que comienza en el momento actual del directo.

# Plantilla
opcion = "___"
print(opcion)

# Esperado
--no-live-from-start

# Pista
Es la negación explícita de la opción anterior.
```

# --wait-for-video

`--wait-for-video MIN[-MAX]` espera a que una emisión programada quede
disponible. El argumento puede ser un mínimo de segundos o un rango entre mínimo
y máximo para separar los reintentos.

Los corchetes del nombre `MIN[-MAX]` en la ayuda describen que la parte
`-MAX` es opcional; no se escriben literalmente.

```python
minimo = 30
maximo = 90
valor = f"{minimo}-{maximo}"
print(valor)
```

```salida
30-90
```

> Doc: [General Options — --wait-for-video](https://github.com/yt-dlp/yt-dlp#general-options)

```ejercicio
# Enunciado
Completa el separador de un rango de espera de 30 a 90 segundos.

# Plantilla
print("30___90")

# Esperado
30-90

# Pista
Los extremos se separan con un guion.
```

# --no-wait-for-video

`--no-wait-for-video` evita esperar emisiones programadas y es el valor
predeterminado.

```ejercicio
# Enunciado
Completa la opción que desactiva la espera de una emisión programada.

# Plantilla
print("yt-dlp " + "___")

# Esperado
yt-dlp --no-wait-for-video

# Pista
Empieza por `--no-`.
```

# Cierre

El punto temporal de un directo y la espera de una emisión futura son controles
distintos. `--live-from-start` cambia dónde comienza un directo;
`--wait-for-video` cambia si yt-dlp reintenta una emisión todavía no
disponible.

La sesión siguiente cubre el marcado de vistos y la política de color de la
salida.
