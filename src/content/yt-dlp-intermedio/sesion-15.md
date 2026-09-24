---
numero: 15
titulo: "Escribir templates con --print-to-file"
---

# --print-to-file

`--print-to-file [WHEN:]TEMPLATE FILE` añade el resultado de la plantilla al archivo indicado.

> Doc: [Verbosity and Simulation Options — --print-to-file](https://github.com/yt-dlp/yt-dlp#verbosity-and-simulation-options)

```ejercicio
# Enunciado
Completa la opción que escribe una plantilla en archivo.

# Plantilla
print("___")

# Esperado
--print-to-file

# Pista
El nombre termina en `to-file`.
```

# TEMPLATE usa la misma sintaxis que --print

`WHEN` y `TEMPLATE` siguen las mismas reglas que `--print`.

```ejercicio
# Enunciado
Completa el prefijo de etapa para imprimir después del vídeo.

# Plantilla
print("video___%(id)s")

# Esperado
video:%(id)s

# Pista
Separa etapa y template con dos puntos.
```

# FILE también es una output template

El argumento `FILE` usa la sintaxis de output templates. Por tanto, el destino puede construirse con campos de metadatos.

```python
archivo = "%(uploader)s.log"
print(archivo)
```

```salida
%(uploader)s.log
```

# La operación añade contenido

El README usa el verbo **append**: el texto se añade al archivo en lugar de describir una sustitución completa del archivo en cada impresión.

```opcion-multiple
# Enunciado
¿Qué operación describe el README para el archivo?

# Opciones
- Añadir el resultado de la plantilla
- Borrar siempre el archivo
- Renombrar el vídeo
- Cifrar el archivo

# Correcta
1

# Explicación
La opción añade la salida de TEMPLATE a FILE.

# Pista
La palabra usada por la documentación es append.
```

# Cierre

--print-to-file conserva la salida estructurada en un archivo cuyo propio nombre también puede ser una plantilla. La sesión siguiente emite JSON.
