---
numero: 8
titulo: "YouTube: formats e Innertube"
---

# formats=dashy

Convierte HTTP a DASH dentro de los tipos retornados.

# formats=duplicate

Incluye contenido idéntico con URLs o protocolos diferentes e incluye `dashy`.

# formats=incomplete

Incluye formatos que no pueden descargarse completamente, como determinados directos o post-live adaptativos.

# formats=missing_pot

Incluye formatos que requieren PO Token pero no lo tienen.

> Doc: [Extractor Arguments — youtube formats](https://github.com/yt-dlp/yt-dlp#extractor-arguments)

```ejercicio
# Enunciado
Completa el valor que incluye formatos con PO Token ausente.

# Plantilla
print("youtube:formats=___")

# Esperado
youtube:formats=missing_pot

# Pista
El nombre contiene missing.
```

# innertube_host

Sustituye el host de Innertube usado para las peticiones API.

El README advierte que cookies exportadas de un subdominio no funcionan necesariamente en otro.

```ejercicio
# Enunciado
Completa el argumento de host.

# Plantilla
print("youtube:___=studio.youtube.com")

# Esperado
youtube:innertube_host=studio.youtube.com

# Pista
Combina innertube y host.
```

# innertube_key

Sustituye la API key de Innertube. Por defecto no se usa una API key explícita.

# Cierre

La sesión siguiente cubre incomplete data, Data Sync ID y Visitor Data.
