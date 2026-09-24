---
numero: 28
titulo: "Integrar yt-dlp sin parsear stdout normal"
---

# CLI desde cualquier lenguaje

yt-dlp intenta comportarse como un programa de línea de órdenes invocable desde otros lenguajes.

> Doc: [Embedding yt-dlp](https://github.com/yt-dlp/yt-dlp#embedding-yt-dlp)

# No parsear stdout normal

El README advierte que la salida normal puede cambiar entre versiones.

Un programa no debe depender de frases o formato humano de stdout como contrato estable.

```opcion-multiple
# Enunciado
¿Qué recomienda el README para integraciones programáticas?

# Opciones
- Evitar parsear stdout normal
- Parsear siempre la barra de progreso
- Depender de warnings textuales
- Extraer datos con expresiones sobre colores ANSI

# Correcta
1

# Explicación
La salida humana puede cambiar en versiones futuras.

# Pista
Se necesitan interfaces reproducibles.
```

# Salidas diseñadas para integración

El README recomienda `-J`, `--print`, `--progress-template`, `--exec` y mecanismos equivalentes para producir salida reproducible.

# Python ofrece una integración más profunda

Desde Python puede importarse `YoutubeDL` y configurar la biblioteca directamente.

# Cierre

La sesión siguiente usa YoutubeDL como context manager y llama download().
