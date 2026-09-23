---
numero: 7
titulo: "Eventos y SOA asíncrona"
---

# Un event comunica un hecho ocurrido

Un evento representa un hecho que el productor afirma que ocurrió. A diferencia de un command, no ordena al consumidor ejecutar una acción específica.

Esta distinción reduce conocimiento del productor sobre quién reaccionará al hecho.

> Doc: [CloudEvents 1.0.2 — Primer](https://github.com/cloudevents/spec/blob/v1.0.2/cloudevents/primer.md)

```relacionar
# Enunciado
Relaciona cada mensaje con su intención.

# Pares
- PedidoConfirmado => evento que comunica la confirmación de un pedido
- ReservarInventario => command que solicita reservar inventario
- PagoRechazado => evento que comunica el rechazo de un pago
- CancelarEnvio => command que solicita cancelar un envío

# Explicación
Los nombres muestran si el mensaje afirma un hecho o solicita comportamiento.

# Pista
Pasado para hechos; verbo imperativo para solicitudes.
```

# Event envelope separa metadatos del payload de negocio

CloudEvents estandariza atributos de contexto como id, source, type y time alrededor del dato específico del evento. Esa envoltura facilita routing, observabilidad y compatibilidad entre infraestructuras.

El payload conserva la semántica del dominio.

> Doc: [CloudEvents 1.0.2 — Core specification](https://github.com/cloudevents/spec/blob/v1.0.2/cloudevents/spec.md)

```opcion-multiple
# Enunciado
¿Qué dato pertenece al contexto del evento y no necesariamente al payload de negocio?

# Opciones
- Identificador del evento
- Importe de una factura
- Línea de detalle de un pedido
- Dirección de entrega

# Correcta
1

# Explicación
El identificador es metadato de contexto del evento; los demás ejemplos pertenecen al dominio del mensaje.

# Pista
Busca el dato necesario para gestionar el evento, no para describir el negocio.
```

# Pub/sub desacopla productor de consumidores concretos

En publicación/suscripción, el productor publica sin tener que invocar directamente a cada consumidor. La infraestructura distribuye el evento a suscriptores interesados.

El desacoplamiento aumenta flexibilidad, pero también exige gobernar schemas, retención, orden y efectos duplicados.

> Doc: [W3C Web Services Architecture — Message Transport](https://www.w3.org/TR/ws-arch/)

```verdadero-falso
# Enunciado
Pub/sub elimina toda forma de acoplamiento entre productor y consumidores.

# Respuesta
falso

# Explicación
Sigue existiendo acoplamiento semántico al tipo de evento, schema y significado compartido.

# Pista
No hay llamada directa, pero sí contrato.
```

# Eventual consistency hace visibles estados intermedios

Cuando distintos servicios actualizan sus estados mediante eventos, puede existir un intervalo en el que cada participante observe una versión diferente de la realidad compartida.

La arquitectura debe definir qué estados temporales son aceptables y cómo convergen.

> Doc: [OASIS SOA-RM 1.0 — §3.2.3 Shared state](https://docs.oasis-open.org/soa-rm/v1.0/soa-rm.pdf#page=17)

```opcion-multiple
# Enunciado
Inventario ya reservó una unidad pero el read model aún no recibió el evento. ¿Qué fenómeno describe mejor la diferencia temporal?

# Opciones
- Consistencia eventual
- Compilación incremental
- Cifrado asimétrico
- Resolución DNS

# Correcta
1

# Explicación
Los estados observados pueden divergir temporalmente hasta que la propagación del evento permita convergencia.

# Pista
La diferencia existe durante un intervalo, no necesariamente para siempre.
```

# Event versioning debe preservar significado

Agregar campos puede ser compatible si consumidores antiguos los ignoran. Cambiar el significado de un tipo de evento existente puede romper procesos sin producir errores sintácticos.

Cuando el significado cambia de forma incompatible conviene tratarlo como un contrato diferente.

> Doc: [CloudEvents 1.0.2 — Versioning](https://github.com/cloudevents/spec/blob/v1.0.2/cloudevents/spec.md)

```verdadero-falso
# Enunciado
Conservar el mismo nombre de evento garantiza compatibilidad aunque cambie su significado empresarial.

# Respuesta
falso

# Explicación
La compatibilidad semántica depende del significado, no solo del identificador textual.

# Pista
Un consumidor puede interpretar correctamente la forma y aun así equivocarse en el significado.
```

# Replay exige distinguir procesamiento histórico de nuevos efectos

Reprocesar un log de eventos puede reconstruir proyecciones, pero no debería repetir ciegamente efectos externos como cobros, correos o envíos.

La arquitectura necesita separar handlers reconstructivos de acciones irreversibles.

> Doc: [OASIS SOA-RAF 1.0 — Management and action](https://docs.oasis-open.org/soa-rm/soa-ra/v1.0/cs01/soa-ra-v1.0-cs01.html)

```opcion-multiple
# Enunciado
Se reproduce un histórico para reconstruir una proyección. ¿Qué acción requiere una protección especial?

# Opciones
- Recalcular una vista derivada
- Volver a cobrar cada pago histórico
- Recrear un índice de búsqueda
- Recalcular una estadística

# Correcta
2

# Explicación
Los efectos externos no deben repetirse solo porque se reprocese el historial técnico.

# Pista
Distingue reconstrucción de estado de efectos irreversibles.
```

# Cierre

Eventos, envelopes, pub/sub, consistencia eventual, versioning y replay completan el diseño asíncrono avanzado. La siguiente sesión se concentra en evolución de contratos y compatibilidad.
