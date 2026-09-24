---
numero: 63
titulo: "Normalización Unicode y sintaxis general del template"
---

# U: normalización NFC

La conversión `U` aplica normalización Unicode NFC.

> Doc: [Output Template — Unicode normalization](https://github.com/yt-dlp/yt-dlp#output-template)

```ejercicio
# Enunciado
Completa la conversión de normalización Unicode.

# Plantilla
print("%(title)___")

# Esperado
%(title)U

# Pista
Usa U mayúscula.
```

# # cambia a NFD

El flag alternativo `#` cambia la normalización a NFD.

# + usa equivalencia de compatibilidad

El flag `+` permite NFKC/NFKD. El ejemplo `%(title)+.100U` aplica NFKC.

```ejercicio
# Enunciado
Completa el flag de compatibilidad.

# Plantilla
print("%(title)___.100U")

# Esperado
%(title)+.100U

# Pista
Usa el signo más.
```

# Sintaxis general

El README resume un campo así:

`%(name[.keys][addition][>strf][,alternate][&replacement][|default])[flags][width][.precision][length]type`

Cada componente corresponde a una operación desarrollada en las sesiones anteriores.

# Cierre

La sesión siguiente aplica templates diferentes según el tipo de archivo.
