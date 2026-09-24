---
numero: 19
titulo: "Barra de progreso y nuevas líneas"
---

# --newline

`--newline` imprime la barra de progreso como líneas nuevas en lugar de actualizar una misma línea.

> Doc: [Verbosity and Simulation Options — --newline](https://github.com/yt-dlp/yt-dlp#verbosity-and-simulation-options)

```ejercicio
# Enunciado
Completa la opción que imprime progreso en nuevas líneas.

# Plantilla
print("___")

# Esperado
--newline

# Pista
El nombre significa «nueva línea».
```

# --no-progress

`--no-progress` oculta la barra de progreso.

```ejercicio
# Enunciado
Completa la opción que oculta progreso.

# Plantilla
print("___")

# Esperado
--no-progress

# Pista
Niega la salida de progreso.
```

# --progress

`--progress` muestra la barra incluso cuando el modo quiet está activo.

```ejercicio
# Enunciado
Completa la opción que fuerza mostrar progreso.

# Plantilla
print("___")

# Esperado
--progress

# Pista
Usa directamente la palabra `progress`.
```

# quiet y progress pueden coexistir

`--quiet` reduce otras salidas; `--progress` puede conservar la barra de progreso.

```python
opciones = ["--quiet", "--progress"]
print(" ".join(opciones))
```

```salida
--quiet --progress
```

# Cierre

La salida de progreso puede ocultarse, forzarse o emitirse línea por línea. La sesión siguiente personaliza el contenido del progreso.
