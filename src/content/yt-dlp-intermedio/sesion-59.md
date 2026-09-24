---
numero: 59
titulo: "Traversal, índices y slicing en templates"
---

# Traversal con punto

Los diccionarios y listas de metadata pueden recorrerse con un punto (`.`).

`%(tags.0)s` accede al primer elemento de `tags`.

> Doc: [Output Template — object traversal](https://github.com/yt-dlp/yt-dlp#output-template)

```ejercicio
# Enunciado
Completa el índice del primer tag.

# Plantilla
print("%(tags.___)s")

# Esperado
%(tags.0)s

# Pista
Los índices empiezan en cero.
```

# Índices negativos

`%(subtitles.en.-1.ext)s` toma el último subtítulo inglés y después su extensión.

```ejercicio
# Enunciado
Completa el índice del último elemento.

# Plantilla
print("%(subtitles.en.___.ext)s")

# Esperado
%(subtitles.en.-1.ext)s

# Pista
Usa índice negativo uno.
```

# Slicing

Los dos puntos permiten slicing: `%(id.3:7)s` toma un rango y `%(id.6:2:-1)s` añade paso negativo.

```python
identificador = "abcdefghij"
print(identificador[3:7])
```

```salida
defg
```

```ejercicio
# Enunciado
Completa el slice equivalente.

# Plantilla
print("%(id.___)s")

# Esperado
%(id.3:7)s

# Pista
Usa inicio y fin separados por dos puntos.
```

# Recorrer todos los elementos

`%(formats.:.format_id)s` recorre la secuencia de formatos y obtiene `format_id`.

# Construir diccionarios

Las llaves permiten seleccionar claves: `%(formats.:.{format_id,height})#j`.

# El infodict completo

Un nombre de campo vacío `%()s` se refiere al infodict completo.

```ejercicio
# Enunciado
Completa la forma del infodict completo.

# Plantilla
print("%(___)s")

# Esperado
%()s

# Pista
El nombre dentro de los paréntesis queda vacío.
```

# Cierre

La sesión siguiente aplica aritmética y formato temporal.
