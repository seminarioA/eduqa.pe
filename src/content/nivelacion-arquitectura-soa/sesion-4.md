---
numero: 4
titulo: "Mensajes y contratos de datos"
---

# Un mensaje transporta información entre participantes

W3C define un mensaje como la unidad básica de datos enviada de un agente a otro. El mensaje puede incluir cuerpo, metadatos e información necesaria para su transporte.

La estructura del mensaje debe ser conocida por emisor y receptor con suficiente precisión para interpretar el intercambio.

> Doc: [W3C Web Services Architecture — §2.3.1.3 Message](https://www.w3.org/TR/ws-arch/)

```verdadero-falso
# Enunciado
El significado de un mensaje puede depender de una estructura compartida entre emisor y receptor.

# Respuesta
verdadero

# Explicación
La interoperabilidad exige que las partes puedan interpretar la estructura y la semántica relevante de los datos intercambiados.

# Pista
Recibir bytes no garantiza comprenderlos.
```

# JSON define sintaxis de datos, no semántica empresarial

JSON define una sintaxis para valores estructurados: objetos, arreglos, números, cadenas, booleanos y null. Que un documento sea JSON válido no determina qué significa un campo como `estado` o `monto`.

La semántica pertenece al contrato y al dominio compartido por los participantes.

> Doc: [RFC 8259 — §1 Introduction](https://www.rfc-editor.org/rfc/rfc8259.html#section-1)
> Doc: [RFC 8259 — §3 Values](https://www.rfc-editor.org/rfc/rfc8259.html#section-3)

```opcion-multiple
# Enunciado
Un documento contiene `{"estado":"P"}` y es JSON válido. ¿Qué falta para interoperar correctamente?

# Opciones
- Saber qué significa el valor P en el contrato
- Cambiarlo obligatoriamente a XML
- Añadir un puerto TCP al objeto
- Convertirlo en HTML

# Correcta
1

# Explicación
La sintaxis es válida, pero el significado de P debe formar parte de la semántica acordada.

# Pista
Sintaxis y significado son dimensiones distintas.
```

# Un objeto JSON no garantiza orden de sus miembros

Un objeto JSON es una colección no ordenada de pares nombre/valor. Diseñar una integración suponiendo que dos propiedades llegarán siempre en el mismo orden introduce una dependencia que la especificación no garantiza.

Los arreglos, en cambio, sí representan secuencias ordenadas.

> Doc: [RFC 8259 — §4 Objects](https://www.rfc-editor.org/rfc/rfc8259.html#section-4)
> Doc: [RFC 8259 — §5 Arrays](https://www.rfc-editor.org/rfc/rfc8259.html#section-5)

```relacionar
# Enunciado
Relaciona cada estructura JSON con su propiedad.

# Pares
- Object => colección no ordenada de miembros nombre/valor
- Array => secuencia ordenada de valores
- String => secuencia de caracteres
- Number => representación numérica según la gramática JSON

# Explicación
La elección de estructura comunica propiedades diferentes del contrato.

# Pista
Solo una de estas estructuras representa una secuencia.
```

# El contrato define campos obligatorios y opcionales

Una integración necesita reglas sobre presencia, tipo, dominio de valores y significado de cada dato. Esas reglas permiten validar mensajes y evolucionarlos de forma controlada.

Un campo opcional no equivale a un campo cuyo valor es null: ausencia y null pueden representar estados distintos si el contrato así lo establece.

> Doc: [JSON Schema — Understanding JSON Schema: object](https://json-schema.org/understanding-json-schema/reference/object)

```opcion-multiple
# Enunciado
¿Qué diferencia puede existir entre un campo ausente y uno presente con valor null?

# Opciones
- Ninguna en todos los contratos
- El contrato puede asignarles significados distintos
- null siempre significa cero
- La ausencia convierte el JSON en inválido

# Correcta
2

# Explicación
La sintaxis permite null y también omitir miembros; el contrato decide la semántica de cada caso.

# Pista
La sintaxis no impone el significado del dominio.
```

# Compatibilidad exige pensar en consumidores existentes

Agregar un campo opcional suele ser menos disruptivo que cambiar el significado de un campo existente. La compatibilidad debe evaluarse desde el punto de vista de los consumidores reales y de las reglas de validación que aplican.

Un cambio sintácticamente pequeño puede ser semánticamente incompatible.

> Doc: [JSON Schema — Understanding JSON Schema: required properties](https://json-schema.org/understanding-json-schema/reference/object#required)

```opcion-multiple
# Enunciado
¿Qué cambio tiene mayor riesgo de romper consumidores existentes?

# Opciones
- Añadir un campo opcional que los consumidores puedan ignorar
- Cambiar el significado de un campo existente conservando su nombre
- Añadir documentación
- Reordenar visualmente una página

# Correcta
2

# Explicación
Mantener el nombre mientras cambia la semántica puede hacer que consumidores antiguos interpreten datos nuevos de forma incorrecta.

# Pista
La compatibilidad no es solo sintáctica.
```

# Validar estructura no valida el efecto empresarial

Un esquema puede demostrar que un mensaje tiene forma correcta y aun así la operación solicitada puede ser inválida por reglas del dominio, políticas o estado actual.

La validación estructural es una capa; la validación de negocio es otra.

> Doc: [OASIS SOA-RM 1.0 — §3.3.1 Service Description](https://docs.oasis-open.org/soa-rm/v1.0/soa-rm.pdf#page=19)

```verdadero-falso
# Enunciado
Si un mensaje cumple su JSON Schema, la operación empresarial está garantizada.

# Respuesta
falso

# Explicación
El esquema valida estructura. Policies, reglas de negocio y estado pueden impedir o modificar el resultado de la interacción.

# Pista
Forma correcta no implica acción permitida.
```

# Cierre

La sesión separó sintaxis, estructura, contrato y semántica. La siguiente compara interacción síncrona, asíncrona y correlación de mensajes.
