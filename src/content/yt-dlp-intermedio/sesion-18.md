---
numero: 18
titulo: "Forzar escritura del archive en simulación"
---

# --force-write-archive

`--force-write-archive` fuerza la escritura de entradas en el download archive siempre que no ocurran errores, incluso si se usa `-s` u otra opción de simulación.

> Doc: [Verbosity and Simulation Options — --force-write-archive](https://github.com/yt-dlp/yt-dlp#verbosity-and-simulation-options)

```ejercicio
# Enunciado
Completa la opción que escribe el archive aun en simulación.

# Plantilla
print("___")

# Esperado
--force-write-archive

# Pista
Combina `force`, `write` y `archive`.
```

# --force-download-archive

`--force-download-archive` es un alias de `--force-write-archive`.

```ejercicio
# Enunciado
Completa el alias documentado.

# Plantilla
print("___")

# Esperado
--force-download-archive

# Pista
Sustituye `write` por `download`.
```

# Simulación con efecto persistente

Normalmente la simulación evita efectos sobre disco. Esta opción introduce una excepción específica: el archive puede actualizarse.

```opcion-multiple
# Enunciado
¿Qué efecto persistente permite --force-write-archive durante simulación?

# Opciones
- Escribir entradas en el download archive
- Descargar el vídeo completo
- Modificar cookies del navegador
- Recompilar FFmpeg

# Correcta
1

# Explicación
La excepción se limita a la escritura del archive.

# Pista
El nombre de la opción indica el recurso afectado.
```

# Cierre

La simulación puede mantener un efecto deliberado sobre el archive. La sesión siguiente controla cómo se representa el progreso.
