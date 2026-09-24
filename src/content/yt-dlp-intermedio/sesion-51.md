---
numero: 51
titulo: "Habilitar postprocesadores por nombre"
---

# --use-postprocessor

`--use-postprocessor NAME[:ARGS]` habilita un postprocesador de plugin por su nombre, respetando mayúsculas y minúsculas.

> Doc: [Post-Processing Options — --use-postprocessor](https://github.com/yt-dlp/yt-dlp#post-processing-options)

```ejercicio
# Enunciado
Completa la opción que habilita un postprocesador.

# Plantilla
print("___")

# Esperado
--use-postprocessor

# Pista
Combina `use` y `postprocessor`.
```

# NAME:ARGS

Los dos puntos separan el nombre del postprocesador de sus argumentos.

```ejercicio
# Enunciado
Completa el separador.

# Plantilla
print("MiPP___clave=valor")

# Esperado
MiPP:clave=valor

# Pista
Se usa un carácter de dos puntos.
```

# Argumentos separados por ;

ARGS es una lista `NAME=VALUE` separada por punto y coma (`;`).

```ejercicio
# Enunciado
Completa el separador entre dos argumentos.

# Plantilla
print("a=1___b=2")

# Esperado
a=1;b=2

# Pista
Se usa punto y coma.
```

# when

El argumento `when` controla la etapa. Los valores documentados son `pre_process`, `after_filter`, `video`, `before_dl`, `post_process`, `after_move`, `after_video` y `playlist`.

El valor predeterminado es `post_process`.

```ejercicio
# Enunciado
Completa la etapa predeterminada.

# Plantilla
print("___")

# Esperado
post_process

# Pista
Ocurre después de cada descarga.
```

# Repetición

La opción puede repetirse para añadir postprocesadores diferentes.

# Cierre

El nivel intermedio ya puede ubicar operaciones en etapas concretas del pipeline. La sesión siguiente integra SponsorBlock.
