---
numero: 17
titulo: "JSON único por entrada con -J"
---

# -J y --dump-single-json

`-J` es la forma corta de `--dump-single-json`. Emite información JSON por cada URL o info JSON recibido.

> Doc: [Verbosity and Simulation Options — --dump-single-json](https://github.com/yt-dlp/yt-dlp#verbosity-and-simulation-options)

```ejercicio
# Enunciado
Completa la forma corta de --dump-single-json.

# Plantilla
print("yt-dlp " + "___")

# Esperado
yt-dlp -J

# Pista
Usa una J mayúscula.
```

# Playlists en una sola línea

Si la URL representa una playlist, `-J` emite la información de toda la playlist en una sola línea JSON.

```opcion-multiple
# Enunciado
¿Qué ocurre con una playlist bajo -J?

# Opciones
- Se emite toda la playlist en una sola línea JSON
- Se elimina la playlist
- Solo se imprime el primer vídeo
- Se convierte la playlist en texto plano

# Correcta
1

# Explicación
La documentación define un único objeto JSON para la URL o infojson recibido.

# Pista
La palabra clave es `single`.
```

# -j frente a -J

`-j` produce JSON por vídeo; `-J` produce una unidad JSON por entrada y puede contener una playlist completa.

```python
formas = {"video": "-j", "entrada": "-J"}
print(formas["entrada"])
```

```salida
-J
```

```ejercicio
# Enunciado
Completa la forma que agrupa la entrada completa.

# Plantilla
forma = "___"
print(forma)

# Esperado
-J

# Pista
Es la variante con J mayúscula.
```

# Cierre

La granularidad del JSON cambia entre vídeo y entrada. La sesión siguiente fuerza escritura del archive incluso durante simulación.
