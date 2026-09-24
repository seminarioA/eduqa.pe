---
numero: 82
titulo: "Longitud de líneas, comillas y valores inline"
---

# Límite blando de 100 caracteres

La guía propone mantener líneas por debajo de 100 caracteres cuando eso mejora legibilidad.

No es un límite rígido: algunas líneas de hasta 120 pueden ser razonables y otras de 80 pueden requerir separación.

> Doc: [Long lines policy](https://github.com/yt-dlp/yt-dlp/blob/master/CONTRIBUTING.md#long-lines-policy)

# No partir URLs largas

Una URL u otra cadena que se copia habitualmente no debe dividirse solo para cumplir una longitud.

```opcion-multiple
# Enunciado
¿Debe partirse una URL literal solo para mantener menos de 100 caracteres?

# Opciones
- No
- Sí, siempre
- Solo si usa HTTPS
- Solo en tests

# Correcta
1

# Explicación
La política prioriza legibilidad y facilidad de copia sobre un límite mecánico.

# Pista
El límite es blando.
```

# No sobredividir líneas cortas

Si eliminar un salto mantiene la línea por debajo de unos 80 caracteres, la guía normalmente prefiere una sola línea.

# Comillas

Se usan comillas simples para strings y comillas dobles para docstrings.

Las triples comillas simples se reservan para strings multilínea según la convención documentada.

# Excepción por legibilidad

Una cadena con varias comillas simples puede usar comillas dobles si escapar todas las simples perjudica significativamente la lectura.

# Valores inline

Crear variables está justificado cuando reduce duplicación o mejora legibilidad de una expresión compleja.

No se recomienda extraer a una variable un valor usado una sola vez si eso separa artificialmente la definición del lugar donde se utiliza.

```ejercicio
# Enunciado
Completa el tipo de comillas preferido para strings normales según la convención.

# Plantilla
tipo = "___"
print(tipo)

# Esperado
simples

# Pista
No son las reservadas para docstrings.
```

# Cierre

La sesión siguiente colapsa fallbacks y aplica la convención de paréntesis finales.
