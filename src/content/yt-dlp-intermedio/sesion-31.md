---
numero: 31
titulo: "Comprobar formatos y contenedor de fusión"
---

# --check-formats

`--check-formats` comprueba que los formatos seleccionados sean realmente descargables.

> Doc: [Video Format Options — --check-formats](https://github.com/yt-dlp/yt-dlp#video-format-options)

```ejercicio
# Enunciado
Completa la opción que comprueba los formatos seleccionados.

# Plantilla
print("___")

# Esperado
--check-formats

# Pista
Combina `check` y `formats`.
```

# --check-all-formats

`--check-all-formats` comprueba todos los formatos disponibles, no solo los seleccionados.

```ejercicio
# Enunciado
Completa la opción que comprueba todos los formatos.

# Plantilla
print("___")

# Esperado
--check-all-formats

# Pista
Incluye `all`.
```

# --no-check-formats

`--no-check-formats` evita comprobar que los formatos sean descargables.

```ejercicio
# Enunciado
Completa la opción que desactiva la comprobación.

# Plantilla
print("___")

# Esperado
--no-check-formats

# Pista
Niega --check-formats.
```

# --merge-output-format

`--merge-output-format FORMAT` define contenedores que pueden usarse al fusionar formatos. Varios contenedores se separan con barra (`/`).

Los valores soportados actualmente son `avi`, `flv`, `mkv`, `mov`, `mp4` y `webm`.

```ejercicio
# Enunciado
Completa el separador de dos alternativas de contenedor.

# Plantilla
print("mp4___mkv")

# Esperado
mp4/mkv

# Pista
Se usa una barra.
```

# Sin fusión no tiene efecto

El README especifica que `--merge-output-format` se ignora si no hace falta fusionar formatos.

# Cierre

Las opciones de comprobación verifican disponibilidad y el contenedor de fusión solo participa cuando hay streams que unir. La sesión siguiente entra en subtítulos.
