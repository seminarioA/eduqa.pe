---
numero: 20
titulo: "Templates de progreso y título de consola"
---

# --console-title

`--console-title` muestra información de progreso en la barra de título de la consola.

> Doc: [Verbosity and Simulation Options — --console-title](https://github.com/yt-dlp/yt-dlp#verbosity-and-simulation-options)

```ejercicio
# Enunciado
Completa la opción que usa el título de la consola.

# Plantilla
print("___")

# Esperado
--console-title

# Pista
Combina `console` y `title`.
```

# --progress-template

`--progress-template [TYPES:]TEMPLATE` define la plantilla de las salidas de progreso.

Los tipos documentados son `download`, `download-title`, `postprocess` y `postprocess-title`.

```ejercicio
# Enunciado
Completa el tipo predeterminado de progreso.

# Plantilla
print("___:%(progress.eta)s")

# Esperado
download:%(progress.eta)s

# Pista
Es la etapa de descarga.
```

# info y progress

Los campos del vídeo se consultan bajo `info`; los atributos de progreso se consultan bajo `progress`.

```python
plantilla = "%(info.id)s-%(progress.eta)s"
print(plantilla)
```

```salida
%(info.id)s-%(progress.eta)s
```

```ejercicio
# Enunciado
Completa el espacio de nombres de la ETA.

# Plantilla
print("%(___.eta)s")

# Esperado
%(progress.eta)s

# Pista
La ETA pertenece a los atributos de progreso.
```

# --progress-delta

`--progress-delta SECONDS` fija el intervalo entre salidas de progreso. El valor predeterminado documentado es cero.

```ejercicio
# Enunciado
Completa la opción que fija un segundo entre salidas.

# Plantilla
print("yt-dlp " + "___" + " 1")

# Esperado
yt-dlp --progress-delta 1

# Pista
El nombre termina en `delta`.
```

# Cierre

Los templates de progreso separan datos del vídeo y estado de transferencia. La sesión siguiente abre las herramientas de diagnóstico.
