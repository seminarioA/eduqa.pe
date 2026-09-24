---
numero: 7
titulo: "YouTube: comment_sort y max_comments"
---

# comment_sort

Los valores documentados son `top` y `new`; `new` es el predeterminado actual.

> Doc: [Extractor Arguments — youtube comments](https://github.com/yt-dlp/yt-dlp#extractor-arguments)

```ejercicio
# Enunciado
Completa el orden predeterminado.

# Plantilla
print("youtube:comment_sort=___")

# Esperado
youtube:comment_sort=new

# Pista
Significa «nuevo».
```

# max_comments

Recibe cinco posiciones separadas por comas:
`max-comments,max-parents,max-replies,max-replies-per-thread,max-depth`.

El default es `all,all,all,all,all`.

```ejercicio
# Enunciado
Completa la cantidad de componentes.

# Plantilla
componentes = "all,all,all,all,all".split(",")
print(___)

# Esperado
5

# Pista
Obtén la longitud de la lista.
```

# max-depth=1

Descarta todas las respuestas, independientemente de otros límites de replies.

# Ejemplo all,all,1000,10,2

Permite hasta 1000 replies totales, 10 por thread y profundidad dos.

# Ejemplo 1000,all,100

Limita comentarios totales a 1000 y replies totales a 100.

# Cierre

La sesión siguiente modifica tipos de formatos devueltos y configuración Innertube.
