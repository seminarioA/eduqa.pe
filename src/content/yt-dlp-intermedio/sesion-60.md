---
numero: 60
titulo: "Aritmética y fechas en templates"
---

# Suma

Los campos numéricos admiten suma con `+`.

`%(playlist_index+10)03d` suma diez antes de formatear.

> Doc: [Output Template — arithmetic](https://github.com/yt-dlp/yt-dlp#output-template)

```ejercicio
# Enunciado
Completa la suma de diez.

# Plantilla
print("%(playlist_index___10)03d")

# Esperado
%(playlist_index+10)03d

# Pista
Usa el operador de suma.
```

# Resta

`%(n_entries+1-playlist_index)d` combina suma y resta.

```ejercicio
# Enunciado
Completa el operador de resta.

# Plantilla
print("%(n_entries+1___playlist_index)d")

# Esperado
%(n_entries+1-playlist_index)d

# Pista
Usa el signo menos.
```

# Multiplicación

Los campos numéricos también admiten `*`.

# Formato de fecha y hora

El signo mayor que (`>`) separa el campo de una especificación `strftime`.

`%(upload_date>%Y-%m-%d)s` formatea la fecha de subida.

```ejercicio
# Enunciado
Completa el separador de formato temporal.

# Plantilla
print("%(upload_date___%Y-%m-%d)s")

# Esperado
%(upload_date>%Y-%m-%d)s

# Pista
Usa el signo mayor que.
```

# Duración y epoch

`%(duration>%H-%M-%S)s` formatea duración y `%(epoch-3600>%H-%M-%S)s` combina aritmética con formato temporal.

# Cierre

La sesión siguiente añade alternativas, reemplazos y defaults.
