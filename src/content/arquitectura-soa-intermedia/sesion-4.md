---
numero: 4
titulo: "Contratos asíncronos con AsyncAPI"
---

# Una API message-driven necesita contrato igual que una API HTTP

La comunicación asíncrona no elimina la necesidad de un contrato. El consumidor y el productor deben compartir una comprensión verificable de canales, mensajes, operaciones, payloads, headers y mecanismos de correlación.

**AsyncAPI 3.0.0** define una descripción machine-readable y agnóstica al protocolo para APIs orientadas a mensajes. Puede describir sistemas que usan AMQP, MQTT, WebSockets, Kafka, HTTP y otros mecanismos.

> Doc: [AsyncAPI Specification 3.0.0 — Introduction](https://www.asyncapi.com/docs/reference/specification/v3.0.0#introduction)

```verdadero-falso
# Enunciado
AsyncAPI obliga a que una arquitectura asíncrona utilice Kafka.

# Respuesta
falso

# Explicación
AsyncAPI es protocol-agnostic. Los bindings permiten añadir información específica de un protocolo cuando sea necesaria.

# Pista
La especificación enumera múltiples protocolos posibles.
```

# Channel representa un medio direccionable para mensajes

Un **Channel Object** describe un componente de comunicación compartido. Su `address` suele corresponder, según el protocolo, a un topic, routing key, path u otro identificador direccionable.

El canal no debe confundirse con la operación de la aplicación. AsyncAPI 3 separa deliberadamente canales, mensajes y operaciones para permitir reutilizarlos y modelarlos con mayor precisión.

```yaml
channels:
  paymentEvents:
    address: payments.events
    messages:
      paymentAuthorized:
        $ref: "#/components/messages/PaymentAuthorized"
```

> Doc: [AsyncAPI Specification 3.0.0 — Channel Object](https://www.asyncapi.com/docs/reference/specification/v3.0.0#channelObject)

```relacionar
# Enunciado
Relaciona cada concepto con lo que representa.

# Pares
- Channel => medio direccionable por el que circulan mensajes
- Message => unidad de información intercambiada
- Operation => acción send o receive que realiza una aplicación

# Explicación
AsyncAPI 3 desacopla canal, mensaje y operación para describirlos como conceptos distintos.

# Pista
Separa dónde circula, qué circula y qué hace la aplicación.
```

# Message define payload y headers de aplicación

Un **Message Object** describe un mensaje recibido o enviado en un canal. Puede declarar `headers`, `payload`, `correlationId`, ejemplos y otros metadatos.

Los headers definidos por la aplicación no son lo mismo que headers propios del protocolo. AsyncAPI distingue ambos niveles para no mezclar contrato de negocio con detalles de transporte.

```yaml
components:
  messages:
    PaymentAuthorized:
      headers:
        type: object
        properties:
          tenantId:
            type: string
      payload:
        type: object
        required: [paymentId, authorizedAt]
```

> Doc: [AsyncAPI Specification 3.0.0 — Message Object](https://www.asyncapi.com/docs/reference/specification/v3.0.0#messageObject)

```opcion-multiple
# Enunciado
¿Qué parte del Message Object describe los datos principales definidos por la aplicación?

# Opciones
- payload
- servers
- tags
- license

# Correcta
1

# Explicación
payload define los datos del mensaje; headers permite describir metadatos de aplicación separados del payload.

# Pista
Es el cuerpo lógico del mensaje.
```

# Operation expresa si la aplicación envía o recibe

En AsyncAPI 3, una **Operation Object** declara `action: send` o `action: receive` y referencia el canal sobre el que la aplicación realiza esa acción.

La dirección se expresa desde la perspectiva de la aplicación descrita. `receive` significa que esa aplicación espera recibir mensajes; no significa que el broker «reciba» el mensaje.

```yaml
operations:
  receivePaymentAuthorized:
    action: receive
    channel:
      $ref: "#/channels/paymentEvents"
```

> Doc: [AsyncAPI Specification 3.0.0 — Operation Object](https://www.asyncapi.com/docs/reference/specification/v3.0.0#operationObject)

```verdadero-falso
# Enunciado
En AsyncAPI, `action: receive` se interpreta desde la perspectiva de la aplicación descrita.

# Respuesta
verdadero

# Explicación
La Operation Object describe lo que la aplicación implementa sobre el canal: send cuando envía y receive cuando recibe.

# Pista
La especificación describe una aplicación, no el broker en abstracto.
```

# Event, command, request y response son semánticas del mensaje

AsyncAPI no restringe un Message Object a «evento». La especificación reconoce que los mensajes pueden soportar patrones como **event, command, request o response**.

La diferencia es semántica. Un evento comunica que algo ocurrió; un comando solicita que una acción ocurra. Confundir ambos puede producir consumidores que interpretan una notificación histórica como una orden ejecutable.

> Doc: [AsyncAPI Specification 3.0.0 — Message](https://www.asyncapi.com/docs/reference/specification/v3.0.0#message)

```relacionar
# Enunciado
Relaciona cada intención con el tipo semántico más apropiado.

# Pares
- PaymentAuthorized => evento
- AuthorizePayment => comando
- GetPaymentStatus => request
- PaymentStatus => response

# Explicación
El nombre y el contrato deben reflejar si el mensaje informa un hecho, solicita una acción o participa en request-response.

# Pista
Pasado indica hecho ocurrido; imperativo indica acción solicitada.
```

# Correlation ID vincula mensajes relacionados

Un **Correlation ID Object** especifica dónde encontrar el identificador utilizado para relacionar mensajes dentro de una conversación o flujo.

La correlación resulta necesaria cuando la respuesta no llega por la misma conexión síncrona que originó la solicitud, o cuando varios mensajes pertenecen al mismo proceso distribuido.

> Doc: [AsyncAPI Specification 3.0.0 — Correlation ID Object](https://www.asyncapi.com/docs/reference/specification/v3.0.0#correlationIdObject)

```opcion-multiple
# Enunciado
¿Qué problema resuelve principalmente un correlation ID?

# Opciones
- Elegir el lenguaje de programación del consumidor
- Relacionar mensajes que pertenecen a la misma conversación distribuida
- Definir el tamaño máximo de una cola
- Cifrar el payload

# Correcta
2

# Explicación
El correlation ID permite reconocer que mensajes separados pertenecen a una misma interacción o proceso.

# Pista
La palabra clave es relación entre mensajes.
```

# Reply modela request-response sin convertirlo en llamada síncrona

AsyncAPI 3 permite definir un **Operation Reply** para representar patrones request-response sobre infraestructura orientada a mensajes.

Que exista reply no implica que productor y consumidor estén bloqueados en una llamada síncrona. La respuesta puede circular por otro canal y llegar en otro momento, manteniendo la semántica de correlación.

> Doc: [AsyncAPI Specification 3.0.0 — Operation Reply Object](https://www.asyncapi.com/docs/reference/specification/v3.0.0#operationReplyObject)

```verdadero-falso
# Enunciado
Si un contrato AsyncAPI define una reply, la interacción pasa automáticamente a ser síncrona.

# Respuesta
falso

# Explicación
Request-response puede realizarse de forma asíncrona. AsyncAPI modela la relación entre mensajes sin imponer bloqueo temporal.

# Pista
Respuesta y sincronía son dimensiones diferentes.
```

# Bindings añaden información específica del protocolo

Los **protocol bindings** permiten expresar detalles que no pertenecen al modelo agnóstico de AsyncAPI: opciones propias de AMQP, Kafka, MQTT u otros protocolos.

Un binding debe contener información específica del protocolo. No debe utilizarse para esconder semántica de negocio que debería estar en channels, messages u operations.

> Doc: [AsyncAPI Specification 3.0.0 — Bindings](https://www.asyncapi.com/docs/reference/specification/v3.0.0#bindings)

```opcion-multiple
# Enunciado
¿Dónde debería expresarse una propiedad exclusiva de AMQP que no existe en otros protocolos?

# Opciones
- En un protocol binding de AMQP
- En el título del mensaje
- En operationId
- En la descripción del curso

# Correcta
1

# Explicación
Bindings existen precisamente para separar información específica del protocolo del contrato agnóstico.

# Pista
No contamines el modelo común con detalles de un transporte.
```

# El schema del mensaje también necesita compatibilidad

Un mensaje no es estable solo porque conserve el mismo channel address. Cambiar campos requeridos, tipos o significado del payload puede romper consumidores aunque el topic o routing key permanezca igual.

Por eso el contrato asíncrono debe versionar y revisar schemas igual que un contrato HTTP. La compatibilidad se tratará de forma específica en una sesión posterior.

> Doc: [AsyncAPI Specification 3.0.0 — Multi Format Schema Object](https://www.asyncapi.com/docs/reference/specification/v3.0.0#multiFormatSchemaObject)
> Doc: [AsyncAPI Specification 3.0.0 — Schema Object](https://www.asyncapi.com/docs/reference/specification/v3.0.0#schemaObject)

```verdadero-falso
# Enunciado
Mantener el mismo nombre de topic garantiza que una nueva versión del mensaje sea compatible con todos los consumidores anteriores.

# Respuesta
falso

# Explicación
La compatibilidad depende también de estructura y semántica del mensaje. El address por sí solo no protege a los consumidores.

# Pista
Un canal estable puede transportar un payload incompatible.
```

# Cierre

AsyncAPI convierte una integración asíncrona en un contrato explícito mediante **channels, messages, operations, correlation IDs, replies y bindings**.

La siguiente sesión baja un nivel hacia la infraestructura de mensajería: colas, productores, consumidores, acknowledgements, settlement y redelivery.
