---
numero: 62
titulo: "Conversiones adicionales de templates"
---

# B: bytes

La conversión `B` representa bytes.

> Doc: [Output Template — conversions](https://github.com/yt-dlp/yt-dlp#output-template)

```ejercicio
# Enunciado
Completa la conversión de bytes.

# Plantilla
print("%(filesize)___")

# Esperado
%(filesize)B

# Pista
Usa B mayúscula.
```

# j: JSON

`j` convierte a JSON. El flag `#` activa pretty-print y `+` conserva Unicode.

```ejercicio
# Enunciado
Completa la conversión JSON.

# Plantilla
print("%(tags)___")

# Esperado
%(tags)j

# Pista
Usa j minúscula.
```

# h: HTML escaping

`h` aplica escape HTML.

# l: lista

`l` produce lista separada por comas; con `#`, separa por nuevas líneas.

# q: shell quoting

`q` produce una cadena quoted para terminal; con `#` puede dividir una lista en argumentos independientes.

```ejercicio
# Enunciado
Completa la conversión para terminal.

# Plantilla
print("%(filepath)___")

# Esperado
%(filepath)q

# Pista
Usa q.
```

# D: sufijos decimales

`D` añade sufijos como `10M`; con `#` usa 1024 como factor.

# S: sanitización de filename

`S` sanitiza como nombre de archivo; `#` activa la variante restringida.

# Cierre

La sesión siguiente cubre normalización Unicode y la sintaxis general.
