---
numero: 48
titulo: "Ejecutar comandos con --exec"
---

# --exec

`--exec [WHEN:]CMD` ejecuta un comando en una etapa del procesamiento.

> Doc: [Post-Processing Options — --exec](https://github.com/yt-dlp/yt-dlp#post-processing-options)

```ejercicio
# Enunciado
Completa la opción que ejecuta un comando.

# Plantilla
print("___")

# Esperado
--exec

# Pista
Es la abreviatura habitual de execute.
```

# WHEN

La etapa predeterminada es `after_move`. Las etapas válidas son las mismas que en `--use-postprocessor`.

```ejercicio
# Enunciado
Completa la etapa predeterminada.

# Plantilla
print("___")

# Esperado
after_move

# Pista
Ocurre después de mover el archivo.
```

# Campos en CMD

El comando puede utilizar la sintaxis de output templates para insertar campos.

Por seguridad, las conversiones permitidas se limitan a `i`/`d`, `f` y `q`; `q` aplica quoting adecuado para shell.

```ejercicio
# Enunciado
Completa la conversión destinada a shell quoting.

# Plantilla
print("%(filepath)___")

# Esperado
%(filepath)q

# Pista
Usa una q.
```

# Argumento automático

Si CMD no contiene campos, yt-dlp añade `%(filepath,_filename|)q` al final.

# --no-exec

`--no-exec` elimina definiciones previas de `--exec`.

```ejercicio
# Enunciado
Completa la opción que elimina comandos exec previos.

# Plantilla
print("___")

# Esperado
--no-exec

# Pista
Niega --exec.
```

# Cierre

--exec integra comandos externos en etapas concretas y restringe las conversiones por seguridad. La sesión siguiente convierte subtítulos y miniaturas.
