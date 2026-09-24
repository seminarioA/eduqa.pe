---
numero: 77
titulo: "Campos obligatorios y opcionales del info dict"
---

# id

El identificador del medio es obligatorio.

> Doc: [Mandatory and optional metafields](https://github.com/yt-dlp/yt-dlp/blob/master/CONTRIBUTING.md#mandatory-and-optional-metafields)

# url o formats

La extracción debe proporcionar una URL de descarga o una colección de formatos.

```opcion-multiple
# Enunciado
¿Qué conjunto mínimo describe la guía para una extracción normal?

# Opciones
- id y url o formats
- title y description
- uploader y tags
- thumbnail y comment_count

# Correcta
1

# Explicación
Sin ID y una fuente descargable la extracción no cumple su función principal.

# Pista
Los demás campos se consideran metadata opcional.
```

# age_limit en sitios pornográficos

Para esos sitios, la guía exige además un `age_limit` apropiado.

# Excepción con --ignore-no-formats-error

En casos especiales puede devolverse un info dict sin URL ni formatos cuando aun así existe información útil, por ejemplo un directo que todavía no comenzó.

# Todo lo demás es opcional

Los demás campos deben extraerse de forma tolerante y no convertir la desaparición de metadata secundaria en un fallo fatal del extractor.

```ejercicio
# Enunciado
Completa el valor Python que representa ausencia de metadata opcional.

# Plantilla
valor = ___
print(valor is None)

# Esperado
True

# Pista
Python usa None.
```

# Cierre

La sesión siguiente implementa extracción opcional segura con get, traverse_obj y búsquedas no fatales.
