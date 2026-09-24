---
numero: 35
titulo: "Logger personalizado"
---

# logger

La clave `logger` recibe un objeto con métodos compatibles.

> Doc: [Embedding example — logger and progress hook](https://github.com/yt-dlp/yt-dlp#adding-logger-and-progress-hook)

# debug()

Por compatibilidad con youtube-dl, mensajes debug e info llegan a `debug`. El prefijo `[debug] ` permite distinguir debug real.

```ejercicio
# Enunciado
Completa el prefijo usado para distinguir debug.

# Plantilla
print("___")

# Esperado
[debug] 

# Pista
Incluye corchetes y un espacio final.
```

# info()

Recibe mensajes informativos reenviados por la implementación del ejemplo.

# warning()

Recibe advertencias.

# error()

Recibe errores; el ejemplo los imprime.

```python
class Logger:
    def error(self, msg):
        print(msg)

Logger().error("fallo")
```

```salida
fallo
```

```ejercicio
# Enunciado
Completa el método de error.

# Plantilla
class Logger:
    def ___(self, msg):
        print(msg)

Logger().error("fallo")

# Esperado
fallo

# Pista
El método se llama error.
```

# Cierre

La sesión siguiente observa estados mediante progress_hooks.
