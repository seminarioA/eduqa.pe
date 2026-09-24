---
numero: 65
titulo: "Comprobaciones previas antes de abrir un issue"
---

# Usar la versión más reciente

Antes de reportar un problema, la guía pide actualizar y comprobar que la instalación está al día.

> Doc: [Are you using the latest version?](https://github.com/yt-dlp/yt-dlp/blob/master/CONTRIBUTING.md#are-you-using-the-latest-version)

```ejercicio
# Enunciado
Completa la opción de actualización de release binary.

# Plantilla
print("yt-dlp " + "___")

# Esperado
yt-dlp -U

# Pista
Usa una U mayúscula.
```

# Buscar issues existentes

Debe comprobarse si el problema ya existe en el tracker de yt-dlp. Si existe, la recomendación es suscribirse y comentar solo cuando exista información útil adicional.

# Revisar youtube-dl

También puede ser útil buscar antecedentes en el tracker de youtube-dl y enlazarlos cuando sean relevantes.

# Revisar opciones existentes

Antes de pedir una función nueva debe comprobarse si las opciones actuales ya resuelven el caso.

La solicitud debe explicar por qué las alternativas similares no son suficientes.

# Comprender diferencias con youtube-dl

La guía remite expresamente a defaults diferentes y opciones deprecadas antes de considerar un comportamiento como bug.

```opcion-multiple
# Enunciado
¿Qué debe explicarse al pedir una función que se parece a una opción existente?

# Opciones
- Por qué la opción existente no resuelve el caso
- Solo que la función sería interesante
- Qué editor usa el solicitante
- La velocidad de su CPU

# Correcta
1

# Explicación
La guía exige justificar por qué las opciones existentes no cubren el caso de uso.

# Pista
Una feature request debe mostrar el hueco funcional real.
```

# Cierre

La sesión siguiente define contexto, atomicidad del issue y relevancia del caso de uso.
