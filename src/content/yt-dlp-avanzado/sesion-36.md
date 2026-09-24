---
numero: 36
titulo: "progress_hooks"
---

# Un hook recibe un diccionario de estado

El ejemplo define `my_hook(d)`.

> Doc: [Embedding example — progress hook](https://github.com/yt-dlp/yt-dlp#adding-logger-and-progress-hook)

# d["status"]

El campo status permite reaccionar a estados del proceso.

# finished

El ejemplo detecta `finished` para indicar que termina descarga y empieza postprocesamiento.

```ejercicio
# Enunciado
Completa el estado detectado por el ejemplo.

# Plantilla
estado = "___"
print(estado)

# Esperado
finished

# Pista
Significa terminado.
```

# progress_hooks

La configuración recibe una lista de callables.

```python
def hook(d):
    return d.get("status")

ydl_opts = {"progress_hooks": [hook]}
print(len(ydl_opts["progress_hooks"]))
```

```salida
1
```

```ejercicio
# Enunciado
Completa la clave que recibe hooks.

# Plantilla
ydl_opts = {"___": [hook]}
print(len(ydl_opts["progress_hooks"]))

# Esperado
1

# Pista
Está en plural y usa guion bajo.
```

# Cierre

La sesión siguiente crea un PostProcessor personalizado.
