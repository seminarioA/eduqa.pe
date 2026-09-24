---
numero: 10
titulo: "Políticas de error"
---

# -i y --ignore-errors

`-i` es la forma corta de `--ignore-errors`. La opción ignora errores de
descarga y postprocesamiento. El README añade una consecuencia importante: una
descarga se considera exitosa incluso si falla el postprocesamiento.

Por eso «ignorar» no significa únicamente «continuar con el siguiente
elemento»; también modifica cómo se considera el resultado.

> Doc: [General Options — --ignore-errors](https://github.com/yt-dlp/yt-dlp#general-options)

```ejercicio
# Enunciado
Completa la forma corta de --ignore-errors.

# Plantilla
print("yt-dlp " + "___")

# Esperado
yt-dlp -i

# Pista
Es la inicial de ignore precedida por un guion.
```

# --no-abort-on-error

`--no-abort-on-error` continúa con el siguiente vídeo cuando ocurre un error
de descarga. Es el comportamiento predeterminado documentado y resulta útil,
por ejemplo, cuando una playlist contiene un elemento no disponible.

```python
politica = "--no-abort-on-error"
print(politica.startswith("--no-"))
```

```salida
True
```

> Doc: [General Options — --no-abort-on-error](https://github.com/yt-dlp/yt-dlp#general-options)

```ejercicio
# Enunciado
Completa la opción predeterminada que continúa con el siguiente vídeo después de un error de descarga.

# Plantilla
opcion = "___"
print(opcion)

# Esperado
--no-abort-on-error

# Pista
Empieza con el prefijo negativo `--no-`.
```

# --abort-on-error

`--abort-on-error` detiene las descargas posteriores cuando ocurre un error.
El README también la documenta como alias de `--no-ignore-errors`.

```bash !sin-consola
yt-dlp --abort-on-error "URL"
```

> Doc: [General Options — --abort-on-error](https://github.com/yt-dlp/yt-dlp#general-options)

```ejercicio
# Enunciado
Completa la opción que interrumpe las descargas posteriores cuando ocurre un error.

# Plantilla
print("yt-dlp " + "___")

# Esperado
yt-dlp --abort-on-error

# Pista
La opción afirma explícitamente que debe abortarse ante un error.
```

# Continuar no equivale a ignorar

`--no-abort-on-error` se ocupa de continuar con otros vídeos después de un
error de descarga. `--ignore-errors` tiene un alcance distinto porque también
ignora errores de postprocesamiento y altera la consideración de éxito indicada
por el README.

Las dos opciones no deben tratarse como sinónimos.

```ejercicio
# Enunciado
Completa la política que también cubre errores de postprocesamiento.

# Plantilla
politica = "___"
print(politica)

# Esperado
--ignore-errors

# Pista
El README menciona explícitamente download and postprocessing errors.
```

# Cierre

yt-dlp diferencia ignorar errores, continuar después de errores de descarga y
abortar ante el primer error. Elegir una política determina tanto el flujo como,
en el caso de `--ignore-errors`, la consideración del resultado.

La sesión siguiente inspecciona y limita los extractores disponibles.
