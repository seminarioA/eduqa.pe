---
numero: 5
titulo: "Mensajería: colas, entrega y confirmación"
---

# Una cola desacopla disponibilidad temporal

Una **queue** almacena mensajes hasta que puedan ser entregados a consumidores. Esa separación permite que productor y consumidor no tengan que estar disponibles al mismo tiempo.

El desacoplamiento temporal no elimina responsabilidades: hay que decidir durabilidad, exclusividad, expiración, acknowledgements y qué ocurre cuando un mensaje no puede procesarse.

> Doc: [RabbitMQ — Queues](https://www.rabbitmq.com/docs/queues)
> Doc: [OASIS AMQP 1.0 — Part 0: Overview](https://docs.oasis-open.org/amqp/core/v1.0/os/amqp-core-overview-v1.0-os.html)

```opcion-multiple
# Enunciado
¿Qué propiedad aporta principalmente una cola entre productor y consumidor?

# Opciones
- Obliga a que ambos estén conectados simultáneamente
- Permite desacoplar temporalmente producción y consumo
- Elimina la necesidad de contratos de mensaje
- Garantiza procesamiento exactamente una vez

# Correcta
2

# Explicación
La cola puede retener mensajes mientras el consumidor no está disponible. Eso no resuelve por sí solo duplicados ni compatibilidad.

# Pista
Piensa en disponibilidad temporal, no en semántica de negocio.
```

# Producer y consumer ocupan papeles distintos

El **producer** envía mensajes hacia la infraestructura de mensajería; el **consumer** recibe entregas y procesa su contenido.

Estos papeles no determinan quién es service provider o service consumer en todo el sistema. Una aplicación puede producir un evento y, en otra interacción, consumir comandos o eventos de terceros.

> Doc: [RabbitMQ — Consumers](https://www.rabbitmq.com/docs/consumers)
> Doc: [AsyncAPI 3.0.0 — Sender and Receiver](https://www.asyncapi.com/docs/reference/specification/v3.0.0#definitions)

```relacionar
# Enunciado
Relaciona cada papel con su acción principal.

# Pares
- Producer => publica mensajes
- Consumer => recibe y procesa entregas
- Broker => media el transporte y almacenamiento según la configuración

# Explicación
Los papeles de mensajería describen la circulación del mensaje, no toda la responsabilidad arquitectónica del participante.

# Pista
Separa quien envía, quien recibe y quien media.
```

# Acknowledgement confirma procesamiento desde el consumidor

Un **consumer acknowledgement** indica al broker que una entrega puede considerarse procesada y dejar de requerir redelivery.

Confirmar demasiado pronto puede perder trabajo si el consumidor falla después del acknowledgement. Confirmar demasiado tarde puede aumentar redelivery y trabajo duplicado.

> Doc: [RabbitMQ — Consumer Acknowledgements](https://www.rabbitmq.com/docs/confirms#consumer-acks)

```opcion-multiple
# Enunciado
¿Qué riesgo aparece si el consumidor confirma el mensaje antes de completar el trabajo relevante?

# Opciones
- El broker puede considerar terminado un mensaje cuyo procesamiento todavía puede fallar
- El mensaje se vuelve síncrono
- El payload cambia de schema
- El producer recibe automáticamente una excepción

# Correcta
1

# Explicación
El acknowledgement delimita cuándo el broker puede dejar de responsabilizarse por redelivery de esa entrega.

# Pista
Confirma después del punto que realmente quieres considerar completado.
```

# Redelivery implica posibilidad de duplicados

Cuando una entrega no se confirma y la conexión se pierde o el consumidor rechaza/requeuea el mensaje, la infraestructura puede volver a entregarlo.

Por eso un consumidor robusto debe asumir que **un mismo mensaje puede observarse más de una vez**. La idempotencia deja de ser solo un problema HTTP y pasa a ser una propiedad del procesamiento de mensajes.

> Doc: [RabbitMQ — Consumer Acknowledgements and Redelivery](https://www.rabbitmq.com/docs/confirms)
> Doc: [OASIS AMQP 1.0 — Part 3: Messaging](https://docs.oasis-open.org/amqp/core/v1.0/os/amqp-core-messaging-v1.0-os.html)

```verdadero-falso
# Enunciado
Usar acknowledgements garantiza que cada mensaje será procesado exactamente una vez.

# Respuesta
falso

# Explicación
Puede existir redelivery si la confirmación se pierde o el consumidor falla. El procesamiento debe tolerar duplicados cuando corresponda.

# Pista
Entrega y efecto de negocio no son la misma cosa.
```

# Publisher confirm confirma aceptación por la infraestructura

Un **publisher confirm** permite al productor saber que el broker aceptó una publicación según las garantías del mecanismo utilizado.

No equivale a consumer acknowledgement. El primero cubre productor → broker; el segundo cubre broker → consumidor.

> Doc: [RabbitMQ — Publisher Confirms](https://www.rabbitmq.com/docs/confirms#publisher-confirms)

```relacionar
# Enunciado
Relaciona cada confirmación con el tramo que cubre.

# Pares
- Publisher confirm => producer → broker
- Consumer acknowledgement => broker → consumer

# Explicación
Las dos confirmaciones resuelven incertidumbres distintas del recorrido del mensaje.

# Pista
Una ocurre al publicar; la otra al consumir.
```

# Settlement en AMQP expresa el estado de la transferencia

AMQP modela la entrega mediante **delivery state** y mecanismos de **settlement**. Una transferencia puede terminar aceptada, rechazada, liberada o modificada según el resultado de la interacción.

El modelo permite separar transporte de mensaje y estado de procesamiento sin asumir una semántica específica de negocio.

> Doc: [OASIS AMQP 1.0 — Part 3: Messaging, Delivery State](https://docs.oasis-open.org/amqp/core/v1.0/os/amqp-core-messaging-v1.0-os.html)

```relacionar
# Enunciado
Relaciona cada estado AMQP con su interpretación general.

# Pares
- accepted => el receptor acepta la entrega
- rejected => el receptor rechaza la entrega
- released => la entrega se libera sin aceptar su responsabilidad
- modified => la entrega se libera con modificaciones de estado

# Explicación
AMQP diferencia resultados de settlement para que el emisor pueda conocer cómo terminó la transferencia.

# Pista
No todos los finales significan éxito.
```

# Competing consumers distribuyen trabajo

Varios consumidores pueden competir por mensajes de una misma cola. Cada mensaje se entrega a uno de ellos según la estrategia del broker y la configuración aplicable.

Este patrón sirve para repartir trabajo, pero no debe confundirse con publish/subscribe: en una cola de trabajo, no se espera que todos los consumidores reciban una copia del mismo mensaje.

> Doc: [RabbitMQ — Queues](https://www.rabbitmq.com/docs/queues)
> Doc: [RabbitMQ — Consumers](https://www.rabbitmq.com/docs/consumers)

```opcion-multiple
# Enunciado
¿Qué describe mejor competing consumers sobre una misma cola?

# Opciones
- Cada consumidor recibe siempre una copia del mismo mensaje
- Los consumidores compiten por unidades de trabajo y una entrega se asigna a uno de ellos
- Ningún mensaje puede reentregarse
- El productor elige directamente el proceso consumidor

# Correcta
2

# Explicación
El patrón distribuye mensajes de trabajo entre consumidores; no replica cada mensaje a todos.

# Pista
Compiten por trabajo, no se suscriben todos al mismo hecho.
```

# Publish-subscribe distribuye una notificación a múltiples interesados

En **publish/subscribe**, un evento puede ponerse a disposición de varios suscriptores independientes. Cada suscripción mantiene su propia relación con la notificación.

La topología concreta depende del broker. Arquitectónicamente, la diferencia frente a una work queue está en la intención: repartir trabajo entre workers o notificar el mismo hecho a varios interesados.

> Doc: [OASIS SOA-RAF — §4.3 Message Exchange](https://docs.oasis-open.org/soa-rm/soa-ra/v1.0/soa-ra.html)
> Doc: [RabbitMQ — Exchanges](https://www.rabbitmq.com/docs/exchanges)

```relacionar
# Enunciado
Relaciona cada intención con el patrón apropiado.

# Pares
- Repartir 100 trabajos entre 5 workers => Competing consumers
- Notificar PaymentAuthorized a facturación, auditoría y notificaciones => Publish-subscribe

# Explicación
El primer patrón distribuye unidades de trabajo; el segundo propaga un hecho a interesados independientes.

# Pista
Pregunta si el mensaje debe procesarse una vez o ser observado por varios.
```

# Prefetch limita trabajo en vuelo

El **prefetch** limita cuántas entregas no confirmadas puede tener un consumidor. Su propósito es evitar que un consumidor acumule trabajo que todavía no puede procesar y mejorar una distribución más controlada.

Un valor mayor no es automáticamente mejor: incrementa trabajo en vuelo y puede aumentar el costo de recuperación si el consumidor falla.

> Doc: [RabbitMQ — Consumer Prefetch](https://www.rabbitmq.com/docs/consumer-prefetch)

```verdadero-falso
# Enunciado
Aumentar prefetch siempre mejora la resiliencia porque reduce el número de mensajes pendientes.

# Respuesta
falso

# Explicación
Un prefetch alto puede dejar más trabajo no confirmado en un consumidor y aumentar redelivery o desequilibrio ante fallos.

# Pista
Más trabajo asignado no significa más trabajo completado.
```

# Cierre

Mensajería intermedia exige separar **publicación, entrega, acknowledgement, settlement y efecto de negocio**. Una cola desacopla disponibilidad, pero introduce redelivery y obliga a diseñar procesamiento idempotente.

La siguiente sesión incorpora **mediadores, transformaciones, routing y adapters** para conectar servicios que no comparten directamente protocolos o modelos.
