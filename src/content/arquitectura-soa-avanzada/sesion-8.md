---
numero: 8
titulo: "Evolución de contratos y compatibilidad"
---

# Compatibilidad se evalúa desde el consumidor

Un cambio es compatible si los consumidores que deben seguir funcionando pueden interpretar la nueva interacción sin modificar su comportamiento requerido. El proveedor no puede declarar compatibilidad observando solo su propia implementación.

Por eso la arquitectura necesita inventario de consumidores o contratos de compatibilidad explícitos.

> Doc: [OASIS SOA-RAF 1.0 — Service Description](https://docs.oasis-open.org/soa-rm/soa-ra/v1.0/cs01/soa-ra-v1.0-cs01.html)

```verdadero-falso
# Enunciado
Si el proveedor compila después de un cambio de contrato, el cambio es compatible para todos los consumidores.

# Respuesta
falso

# Explicación
La compatibilidad debe evaluarse desde quienes consumen la interfaz y sus expectativas.

# Pista
Compilar el proveedor no ejecuta contratos ajenos.
```

# Cambios aditivos suelen ser más seguros que cambios semánticos

Añadir una operación o un campo opcional puede permitir convivencia de versiones. Renombrar, eliminar o cambiar el significado de un elemento usado por consumidores tiene mayor riesgo.

La palabra “aditivo” no garantiza compatibilidad si el consumidor rechaza campos desconocidos o aplica validaciones estrictas.

> Doc: [JSON Schema — Object properties](https://json-schema.org/understanding-json-schema/reference/object)

```opcion-multiple
# Enunciado
¿Qué cambio tiene menor riesgo en un contrato diseñado para ignorar campos desconocidos?

# Opciones
- Añadir un campo opcional
- Eliminar un campo obligatorio
- Cambiar unidades de metros a centímetros sin cambiar el nombre
- Cambiar el significado de un código existente

# Correcta
1

# Explicación
Un campo opcional puede ser ignorado por consumidores anteriores si esa conducta forma parte del contrato.

# Pista
Busca el cambio que no invalida expectativas anteriores.
```

# Semantic versioning no sustituye una política de compatibilidad

Un número de versión comunica intención sobre cambios, pero el sistema necesita reglas concretas sobre qué puede cambiar, cuánto tiempo conviven versiones y cómo se retira una anterior.

Sin política de deprecation, las versiones se acumulan indefinidamente.

> Doc: [Semantic Versioning 2.0.0](https://semver.org/spec/v2.0.0.html)

```opcion-multiple
# Enunciado
¿Qué información falta si una organización solo exige “usar SemVer”?

# Opciones
- Política de deprecation, convivencia y retirada
- Un color para cada versión
- Un nuevo lenguaje
- Una base de datos por consumidor

# Correcta
1

# Explicación
La numeración no define por sí sola cuánto tiempo se soporta una versión ni cómo se migra.

# Pista
Versionar no es gobernar el ciclo de vida.
```

# Consumer-driven contract tests aportan evidencia de compatibilidad

Los contratos de consumidores pueden ejecutarse contra una versión candidata del proveedor para detectar cambios incompatibles antes del despliegue.

La prueba no reemplaza el ownership del contrato; convierte expectativas conocidas en evidencia automatizada.

> Doc: [OASIS SOA-RAF 1.0 — Testing challenges](https://docs.oasis-open.org/soa-rm/soa-ra/v1.0/cs01/soa-ra-v1.0-cs01.html)

```verdadero-falso
# Enunciado
Una prueba de contrato puede aportar evidencia de compatibilidad, pero no define por sí sola qué consumidores deben ser soportados.

# Respuesta
verdadero

# Explicación
La selección de consumidores soportados es una decisión de governance; las pruebas verifican expectativas de ese conjunto.

# Pista
Herramienta de prueba y decisión de soporte son responsabilidades distintas.
```

# Parallel change permite migrar sin corte simultáneo

Una estrategia segura puede introducir primero el contrato nuevo manteniendo el anterior, migrar consumidores y retirar lo antiguo solo después de verificar que ya no existe uso requerido.

El orden reduce la necesidad de desplegar todos los participantes al mismo tiempo.

> Doc: [OASIS SOA-RAF 1.0 — Composability and change](https://docs.oasis-open.org/soa-rm/soa-ra/v1.0/cs01/soa-ra-v1.0-cs01.html)

```ordenar
# Enunciado
Ordena una evolución por parallel change.

# Elementos
- Retirar el contrato antiguo
- Añadir soporte al contrato nuevo sin romper el anterior
- Migrar consumidores
- Verificar que el contrato antiguo ya no tiene consumidores requeridos

# Orden
2, 3, 4, 1

# Explicación
Primero se amplía compatibilidad, luego se migran consumidores, se verifica el abandono y finalmente se retira la versión anterior.

# Pista
La retirada es el último paso.
```

# Cambiar el slug o endpoint no debería cambiar la identidad interna del servicio

La identidad estable permite cambiar ubicaciones o nombres públicos sin obligar a redefinir todas las relaciones internas. Las referencias internas deben evitar depender de atributos editables cuando existe una identidad duradera.

El principio se aplica a contratos, catálogos y metadatos de governance.

> Doc: [OASIS SOA-RAF 1.0 — Identity](https://docs.oasis-open.org/soa-rm/soa-ra/v1.0/cs01/soa-ra-v1.0-cs01.html)

```opcion-multiple
# Enunciado
¿Qué dato conviene usar como identidad interna estable cuando el nombre público puede cambiar?

# Opciones
- Un identificador inmutable
- El título visible
- La descripción comercial
- El orden del catálogo

# Correcta
1

# Explicación
Una identidad inmutable evita cascadas de cambios cuando atributos públicos evolucionan.

# Pista
Separa identidad de presentación.
```

# Cierre

Compatibilidad, versioning, pruebas de contrato, deprecation y parallel change convierten evolución en un proceso gobernable. La siguiente sesión conecta esos contratos con observabilidad y management.
