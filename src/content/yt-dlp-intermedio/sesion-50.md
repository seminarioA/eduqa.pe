---
numero: 50
titulo: "Dividir y eliminar capítulos"
---

# --split-chapters

`--split-chapters` divide un vídeo en varios archivos según sus capítulos internos.

El prefijo `chapter:` puede usarse con `--paths` y `--output` para los archivos resultantes.

> Doc: [Post-Processing Options — --split-chapters](https://github.com/yt-dlp/yt-dlp#post-processing-options)

```ejercicio
# Enunciado
Completa la opción que divide por capítulos.

# Plantilla
print("___")

# Esperado
--split-chapters

# Pista
Combina `split` y `chapters`.
```

# --no-split-chapters

`--no-split-chapters` evita la división y es el comportamiento predeterminado.

# --remove-chapters

`--remove-chapters REGEX` elimina capítulos cuyo título coincide con la expresión regular. Puede repetirse.

```ejercicio
# Enunciado
Completa la opción que elimina capítulos.

# Plantilla
print("___")

# Esperado
--remove-chapters

# Pista
Combina `remove` y `chapters`.
```

# --no-remove-chapters

`--no-remove-chapters` no elimina capítulos y es el valor predeterminado.

# --force-keyframes-at-cuts

`--force-keyframes-at-cuts` fuerza keyframes en cortes. El README advierte que es lento porque requiere recodificación, pero puede reducir artefactos alrededor del corte.

```ejercicio
# Enunciado
Completa la opción que fuerza keyframes en los cortes.

# Plantilla
print("___")

# Esperado
--force-keyframes-at-cuts

# Pista
Termina en `at-cuts`.
```

# --no-force-keyframes-at-cuts

`--no-force-keyframes-at-cuts` evita esa recodificación adicional y es el valor predeterminado.

# Cierre

La sesión siguiente habilita postprocesadores por nombre y define cuándo se ejecutan.
