---
numero: 19
titulo: "NHK, NFL+ y JioCinema"
---

# nhkradirulive:area

Selecciona la variación regional. Los valores documentados son `sapporo`, `sendai`, `tokyo`, `nagoya`, `osaka`, `hiroshima`, `matsuyama` y `fukuoka`.

El default es `tokyo`.

```ejercicio
# Enunciado
Completa el área predeterminada.

# Plantilla
print("nhkradirulive:area=___")

# Esperado
nhkradirulive:area=tokyo

# Pista
Es la capital japonesa.
```

# nflplusreplay:type

Selecciona `full_game`, `full_game_spanish`, `condensed_game`, `all_22` o `all`.

`all` es el default.

```ejercicio
# Enunciado
Completa el valor predeterminado.

# Plantilla
print("nflplusreplay:type=___")

# Esperado
nflplusreplay:type=all

# Pista
Solicita todos los tipos.
```

# jiocinema:refresh_token

Permite proporcionar el refresh token del almacenamiento local para extender una sesión cuando se autentica mediante token.

> Nota: Los tokens reales son secretos de sesión. El curso solo cubre el nombre y la semántica del argumento; no utiliza credenciales reales.

# Cierre

La sesión siguiente cubre JioSaavn, AfreecaTV y SoundCloud.
