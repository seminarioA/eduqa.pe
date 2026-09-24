---
numero: 75
titulo: "Formato, compatibilidad de Python y pull request"
---

# hatch fmt --check

Antes de enviar cambios debe verificarse que el código cumple las convenciones y el formatter.

> Doc: [Adding support for a new site](https://github.com/yt-dlp/yt-dlp/blob/master/CONTRIBUTING.md#adding-support-for-a-new-site)

```bash !sin-consola
hatch fmt --check
```

```ejercicio
# Enunciado
Completa la opción que comprueba formato sin aplicar cambios.

# Plantilla
print("hatch fmt " + "___")

# Esperado
hatch fmt --check

# Pista
Empieza con dos guiones.
```

# hatch fmt

Sin `--check`, Hatch puede corregir automáticamente problemas de formato y lint.

# No desactivar reglas arbitrariamente

La guía indica que no deben silenciarse reglas con `# noqa` salvo petición de un mantenedor.

La excepción documentada es `# noqa: UP031` para formato printf antiguo dentro de templates GraphQL.

# Versiones de Python

El código debe funcionar en todas las versiones soportadas por yt-dlp: CPython 3.10+ y PyPy 3.11+.

No se exige compatibilidad con versiones anteriores.

# git add

Se añaden el nuevo extractor y el registro en `_extractors.py`.

# Commit

El ejemplo de mensaje sigue la forma:

```text
[yourextractor] Add extractor
```

# Push

La rama se envía al fork remoto.

# Pull request

Finalmente se abre un PR para revisión y merge.

```ejercicio
# Enunciado
Completa el verbo de Git que envía la rama al remoto.

# Plantilla
print("git " + "___" + " origin yourextractor")

# Esperado
git push origin yourextractor

# Pista
Significa empujar.
```

# Cierre

La sesión siguiente configura parámetros locales para tests que requieren autenticación.
