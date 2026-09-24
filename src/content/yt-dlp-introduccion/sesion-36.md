---
numero: 36
titulo: "Fragmentos no disponibles y conservación"
---

# --skip-unavailable-fragments

`--skip-unavailable-fragments` omite fragmentos que no están disponibles en
descargas DASH, HLS nativo e ISM. Es el comportamiento predeterminado.

El alias documentado es `--no-abort-on-unavailable-fragments`.

> Doc: [Download Options — --skip-unavailable-fragments](https://github.com/yt-dlp/yt-dlp#download-options)

```ejercicio
# Enunciado
Completa la opción predeterminada que omite fragmentos no disponibles.

# Plantilla
print("___")

# Esperado
--skip-unavailable-fragments

# Pista
El nombre empieza con `--skip-`.
```

# --abort-on-unavailable-fragments

`--abort-on-unavailable-fragments` detiene la descarga cuando un fragmento no
está disponible.

Su alias es `--no-skip-unavailable-fragments`.

```ejercicio
# Enunciado
Completa la opción que aborta cuando falta un fragmento.

# Plantilla
opcion = "--abort-on-___-fragments"
print(opcion)

# Esperado
--abort-on-unavailable-fragments

# Pista
La palabra que falta significa «no disponible».
```

# Omitir y abortar son políticas opuestas

Ambas opciones gobiernan el mismo evento: un fragmento requerido no está
disponible. Una continúa sin ese fragmento y la otra detiene la descarga.

```opcion-multiple
# Enunciado
¿Cuál es la política predeterminada?

# Opciones
- Abortar ante cualquier fragmento no disponible
- Omitir los fragmentos no disponibles
- Reintentar infinitamente
- Convertir los fragmentos a MP4

# Correcta
2

# Explicación
El README marca --skip-unavailable-fragments como valor predeterminado.

# Pista
Busca la opción que lleva la indicación `default`.
```

# --keep-fragments

`--keep-fragments` conserva en disco los fragmentos descargados después de
terminar la descarga.

```ejercicio
# Enunciado
Completa la opción que conserva los fragmentos.

# Plantilla
print("yt-dlp " + "___")

# Esperado
yt-dlp --keep-fragments

# Pista
La opción usa el verbo `keep`.
```

# --no-keep-fragments

`--no-keep-fragments` elimina los fragmentos descargados después de terminar y
es el comportamiento predeterminado.

```ejercicio
# Enunciado
Completa la opción predeterminada que no conserva los fragmentos intermedios.

# Plantilla
print("___")

# Esperado
--no-keep-fragments

# Pista
Niega --keep-fragments.
```

# Cierre

Una política decide si un fragmento ausente se omite o aborta el proceso; otra
decide si los fragmentos ya descargados se conservan después del resultado
final.

La sesión siguiente controla el buffer y el tamaño de chunks HTTP.