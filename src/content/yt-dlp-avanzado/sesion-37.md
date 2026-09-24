---
numero: 37
titulo: "PostProcessor personalizado"
---

# Heredar de PostProcessor

El ejemplo hereda de `yt_dlp.postprocessor.PostProcessor`.

> Doc: [Embedding example — custom PostProcessor](https://github.com/yt-dlp/yt-dlp#add-a-custom-postprocessor)

```ejercicio
# Enunciado
Completa el nombre de la clase base.

# Plantilla
print("yt_dlp.postprocessor." + "___")

# Esperado
yt_dlp.postprocessor.PostProcessor

# Pista
El nombre termina en Processor.
```

# run(self, info)

El postprocesador implementa `run` y recibe info.

# self.to_screen()

El ejemplo utiliza `to_screen` para emitir un mensaje.

# Retorno (files_to_delete, info)

El ejemplo devuelve `[], info`: lista de archivos a eliminar y la información actualizada.

```python
def resultado(info):
    return [], info

print(resultado({"id": "abc"}))
```

```salida
([], {'id': 'abc'})
```

```ejercicio
# Enunciado
Completa la lista de archivos a eliminar cuando no hay ninguno.

# Plantilla
info = {"id": "abc"}
print((___, info))

# Esperado
([], {'id': 'abc'})

# Pista
Usa una lista vacía.
```

# add_post_processor()

El objeto YoutubeDL registra el PP mediante `add_post_processor`.

# when

El ejemplo utiliza `pre_process`; se admiten los valores de `POSTPROCESS_WHEN`.

# Cierre

La sesión siguiente reemplaza el selector de formato por un callable Python.
