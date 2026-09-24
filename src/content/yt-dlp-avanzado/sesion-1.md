---
numero: 1
titulo: "Sintaxis de --extractor-args"
---

# KEY:ARGS

`--extractor-args KEY:ARGS` envía argumentos adicionales a un extractor.

> Doc: [Extractor Arguments](https://github.com/yt-dlp/yt-dlp#extractor-arguments)

```ejercicio
# Enunciado
Completa el separador entre extractor y argumentos.

# Plantilla
print("youtube___lang=en")

# Esperado
youtube:lang=en

# Pista
Se usa dos puntos.
```

# ARG=VAL1,VAL2

Dentro de ARGS, un nombre y sus valores se separan con `=`; varios valores se separan con coma.

```ejercicio
# Enunciado
Completa el separador entre nombre y valores.

# Plantilla
print("player_client___tv,mweb")

# Esperado
player_client=tv,mweb

# Pista
Usa equals.
```

# ; separa argumentos

Varios argumentos del mismo extractor se separan con punto y coma.

```ejercicio
# Enunciado
Completa el separador entre dos argumentos.

# Plantilla
print("player_client=tv___formats=incomplete")

# Esperado
player_client=tv;formats=incomplete

# Pista
Usa punto y coma.
```

# Guion en CLI y guion bajo interno

En la CLI, el nombre de ARG puede escribirse con guion en lugar de guion bajo; por ejemplo `player-client` corresponde a `player_client`.

# Repetir --extractor-args

La opción puede repetirse para extractores distintos.

# Estabilidad

El README advierte que estos argumentos pueden cambiar o desaparecer sin garantía de compatibilidad hacia atrás.

# Cierre

La sesión siguiente empieza los argumentos de YouTube con idioma y skips.
