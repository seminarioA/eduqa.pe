---
numero: 16
titulo: "JSON por vídeo con -j"
---

# -j y --dump-json

`-j` es la forma corta de `--dump-json`. Activa salida silenciosa y emite información JSON para cada vídeo.

> Doc: [Verbosity and Simulation Options — --dump-json](https://github.com/yt-dlp/yt-dlp#verbosity-and-simulation-options)

```ejercicio
# Enunciado
Completa la forma corta de --dump-json.

# Plantilla
print("yt-dlp " + "___")

# Esperado
yt-dlp -j

# Pista
Usa una j minúscula.
```

# Una entidad JSON por vídeo

La unidad de salida es cada vídeo. En una secuencia de varios vídeos se obtienen representaciones JSON separadas por vídeo.

```python
videos = [{"id": "a"}, {"id": "b"}]
print(len(videos))
```

```salida
2
```

# Simulación implícita

`--dump-json` simula por defecto. `--no-simulate` puede usarse si se quiere mantener la descarga real.

```ejercicio
# Enunciado
Completa la opción que conserva una descarga real junto con -j.

# Plantilla
print("-j " + "___")

# Esperado
-j --no-simulate

# Pista
Niega la simulación.
```

# Campos disponibles

Las claves JSON corresponden a los campos descritos por OUTPUT TEMPLATE. Esa relación se desarrolla más adelante en este curso.

# Cierre

-j produce JSON por vídeo y activa simulación salvo indicación contraria. La sesión siguiente diferencia esa salida de un JSON único por entrada.
