---
numero: 19
titulo: "Marcar vistos y controlar el color"
---

# --mark-watched

`--mark-watched` marca los vídeos como vistos cuando el extractor soporta esa
operación. El README especifica que puede hacerlo incluso junto con
`--simulate`.

La opción modifica estado remoto cuando el servicio y la autenticación lo
permiten; no se reduce a cambiar texto de la terminal.

> Doc: [General Options — --mark-watched](https://github.com/yt-dlp/yt-dlp#general-options)

```ejercicio
# Enunciado
Completa la opción que marca un vídeo como visto.

# Plantilla
opcion = "--mark-___"
print(opcion)

# Esperado
--mark-watched

# Pista
La palabra que falta significa «visto» en inglés.
```

# --no-mark-watched

`--no-mark-watched` impide marcar los vídeos como vistos y es el comportamiento
predeterminado.

```ejercicio
# Enunciado
Completa la opción predeterminada que no marca vídeos como vistos.

# Plantilla
print("___")

# Esperado
--no-mark-watched

# Pista
Niega directamente --mark-watched.
```

# --color

`--color [STREAM:]POLICY` controla si yt-dlp emite secuencias de color. El
stream es opcional y puede ser `stdout` o `stderr`.

`stdout` es la salida estándar; `stderr` es la salida estándar de errores.
Los dos puntos (`:`) separan el stream de la política cuando ambos aparecen.

```python
stream = "stderr"
politica = "never"
print(f"{stream}:{politica}")
```

```salida
stderr:never
```

> Doc: [General Options — --color](https://github.com/yt-dlp/yt-dlp#general-options)

```ejercicio
# Enunciado
Completa el stream destinado a mensajes de error.

# Plantilla
print("___:never")

# Esperado
stderr:never

# Pista
Es la abreviatura de standard error.
```

# always, auto y never

Las políticas principales documentadas son `always`, `auto` y `never`.
`auto` es la predeterminada.

`always` fuerza códigos de color; `never` los evita; `auto` decide según
el contexto que evalúa yt-dlp.

```ejercicio
# Enunciado
Completa la política de color predeterminada.

# Plantilla
politica = "___"
print(politica)

# Esperado
auto

# Pista
Permite que el programa decida automáticamente.
```

# no_color, auto-tty y no_color-tty

`no_color` utiliza secuencias de terminal que no son de color. Las variantes
`auto-tty` y `no_color-tty` basan la decisión únicamente en el soporte de la
terminal, según la ayuda actual.

`--color` puede repetirse, lo que permite asignar políticas distintas a
`stdout` y `stderr`.

# Cierre

`--mark-watched` controla un efecto sobre el estado del vídeo cuando el
extractor lo soporta; `--color` controla secuencias de salida y puede
configurarse por stream.

La sesión siguiente crea aliases y aplica presets sin entrar todavía en
compatibilidad histórica.
