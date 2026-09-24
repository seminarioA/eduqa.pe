---
numero: 13
titulo: "Simulación y omisión de descarga"
---

# -s y --simulate

`-s` es la forma corta de `--simulate`. No descarga el vídeo y no escribe nada en disco.

> Doc: [Verbosity and Simulation Options — --simulate](https://github.com/yt-dlp/yt-dlp#verbosity-and-simulation-options)

```ejercicio
# Enunciado
Completa la forma corta de --simulate.

# Plantilla
print("yt-dlp " + "___")

# Esperado
yt-dlp -s

# Pista
Usa la inicial de simulate.
```

# --no-simulate

`--no-simulate` fuerza una descarga real incluso cuando se usan opciones que normalmente implican simulación, como algunas operaciones de impresión o listado.

```ejercicio
# Enunciado
Completa la opción que desactiva simulación.

# Plantilla
print("___")

# Esperado
--no-simulate

# Pista
Niega --simulate.
```

# --skip-download

`--skip-download` omite el archivo de vídeo, pero sí permite escribir archivos relacionados solicitados. Su alias es `--no-download`.

```ejercicio
# Enunciado
Completa la opción que omite el vídeo pero conserva salidas relacionadas.

# Plantilla
print("___")

# Esperado
--skip-download

# Pista
Combina `skip` y `download`.
```

# --ignore-no-formats-error

`--ignore-no-formats-error` permite continuar cuando no hay formatos descargables y el objetivo es, por ejemplo, extraer metadatos. El README la marca como experimental.

```ejercicio
# Enunciado
Completa la opción que ignora la ausencia de formatos descargables.

# Plantilla
print("___")

# Esperado
--ignore-no-formats-error

# Pista
El nombre contiene `no-formats`.
```

# --no-ignore-no-formats-error

`--no-ignore-no-formats-error` restaura el error cuando no existen formatos descargables y es el comportamiento predeterminado.

# Cierre

Simular, omitir el vídeo y tolerar ausencia de formatos son decisiones distintas. La sesión siguiente imprime campos y templates directamente en stdout.
