---
numero: 87
titulo: "Ejemplos complejos de selección de formatos"
---

# Hasta 720p y preferencia de fps

El ejemplo complejo con `-f` combina alternativas y filtros para obtener vídeo no mayor de 720p, preferir más de 30 fps y mantener fallbacks cuando no existe coincidencia.

> Doc: [Format Selection examples](https://github.com/yt-dlp/yt-dlp#format-selection-examples)

# La forma con sorting

`-S "res:720,fps"` expresa el objetivo de resolución y después prefiere mayor framerate entre formatos equivalentes.

```ejercicio
# Enunciado
Completa el segundo criterio de orden.

# Plantilla
print("res:720,___")

# Esperado
res:720,fps

# Pista
Es el framerate.
```

# Mínimo 480p con dirección invertida

`-S "+res:480,codec,br"` busca la resolución más pequeña no peor que 480p; si no existe, usa la resolución mayor disponible y desempata por codec y bitrate.

```ejercicio
# Enunciado
Completa el primer criterio.

# Plantilla
print("___,codec,br")

# Esperado
+res:480,codec,br

# Pista
La dirección está invertida con +.
```

# Selector versus sorter

Un selector define qué formatos forman el conjunto candidato y cómo se combinan. El sorter cambia el significado de «mejor» dentro del conjunto.

```opcion-multiple
# Enunciado
¿Qué hace principalmente -S?

# Opciones
- Cambia el criterio de orden de los formatos
- Define cookies
- Añade subtítulos
- Cambia la URL

# Correcta
1

# Explicación
-S redefine cómo se ordenan y prefieren los formatos.

# Pista
Su nombre largo es --format-sort.
```

# Cierre

La selección y ordenamiento de formatos queda cubierta. La sesión siguiente formaliza la modificación de metadatos.
