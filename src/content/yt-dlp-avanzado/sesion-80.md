---
numero: 80
titulo: "Regex: grupos útiles y patrones flexibles"
---

# No capturar grupos que no se usan

Un grupo capturante debe existir porque su valor se utiliza. Si solo agrupa alternativas, debe ser no capturante.

> Doc: [Regular expressions — Don't capture groups you don't use](https://github.com/yt-dlp/yt-dlp/blob/master/CONTRIBUTING.md#dont-capture-groups-you-dont-use)

```python
import re

patron = r'(?:id|ID)=(?P<id>\d+)'
print(re.search(patron, "ID=42").group("id"))
```

```salida
42
```

```ejercicio
# Enunciado
Completa el prefijo que convierte un grupo en no capturante.

# Plantilla
patron = r'(___id|ID)=42'
print(bool(__import__("re").match(patron, "ID=42")))

# Esperado
True

# Pista
Después del paréntesis se usa ?:.
```

# Regex relajadas

Los patrones deben depender de la estructura necesaria para obtener el dato, no de atributos irrelevantes que pueden cambiar.

# Atributos HTML

En vez de fijar un atributo `style` completo, la guía busca el elemento por una propiedad relevante, como una clase.

# Comillas simples y dobles

Un patrón robusto puede aceptar ambas formas de quoting y reutilizar la comilla capturada mediante backreference.

```opcion-multiple
# Enunciado
¿Por qué no conviene fijar un atributo style completo si no participa en el dato buscado?

# Opciones
- Porque un cambio irrelevante de layout rompería el patrón
- Porque regex no admite espacios
- Porque HTML no puede tener style
- Porque yt-dlp elimina CSS

# Correcta
1

# Explicación
El extractor debe minimizar dependencias sobre detalles que el sitio puede cambiar sin alterar el dato objetivo.

# Pista
La meta es tolerar cambios menores.
```

# Cierre

La sesión siguiente simplifica patrones y evita cuantificadores que producen sobrecoincidencia.
