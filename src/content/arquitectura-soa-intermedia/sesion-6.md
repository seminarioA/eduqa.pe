---
numero: 6
titulo: "Mediación, adapters, ESB y discovery"
---

# Un mediator participa para facilitar interacción

OASIS utiliza **mediator** para describir un participante que facilita interacción o awareness entre otros participantes. Un mediator puede transformar, enrutar, enriquecer o coordinar información sin convertirse necesariamente en el propietario de la capacidad de negocio.

La mediación añade una dependencia arquitectónica. Por eso debe existir una razón concreta para introducirla: incompatibilidad de protocolos, descubrimiento, transformación de modelos o aplicación centralizada de una policy, entre otras.

> Doc: [OASIS SOA-RAF 1.0 — §4.2.2.1.1 Mediated Awareness](https://docs.oasis-open.org/soa-rm/soa-ra/v1.0/soa-ra.html)
> Doc: [OASIS SOA-RAF 1.0 — Mediator](https://docs.oasis-open.org/soa-rm/soa-ra/v1.0/soa-ra.html)

```opcion-multiple
# Enunciado
¿Cuándo está justificado introducir un mediator?

# Opciones
- Siempre, aunque productor y consumidor ya sean directamente compatibles
- Cuando resuelve una incompatibilidad o responsabilidad de mediación explícita
- Solo cuando existe una base de datos compartida
- Para ocultar cualquier error de diseño

# Correcta
2

# Explicación
La mediación tiene costo y dependencia. Debe responder a una necesidad de interacción concreta.

# Pista
No añadas intermediarios sin una responsabilidad verificable.
```

# Routing decide el destino de un mensaje

**Routing** selecciona uno o más destinos utilizando información disponible en el mensaje, el canal, políticas o configuración.

La decisión de routing no cambia necesariamente el contenido. Su función principal es elegir el camino de entrega.

> Doc: [OASIS SOA-RAF 1.0 — §4.3 Message Exchange](https://docs.oasis-open.org/soa-rm/soa-ra/v1.0/soa-ra.html)
> Doc: [RabbitMQ — Exchanges](https://www.rabbitmq.com/docs/exchanges)

```relacionar
# Enunciado
Relaciona cada operación de mediación con su responsabilidad principal.

# Pares
- Routing => seleccionar destino
- Transformation => cambiar representación
- Enrichment => añadir información
- Protocol bridging => conectar protocolos diferentes

# Explicación
Separar responsabilidades evita convertir toda mediación en una caja negra genérica.

# Pista
Cada término responde a una pregunta distinta: dónde, cómo se representa, qué falta y cómo se transporta.
```

# Transformation cambia representación preservando significado

Una **transformación** convierte información entre representaciones distintas. Puede cambiar nombres de campos, estructura, codificación o formato.

Una transformación correcta debe preservar la semántica necesaria para la interacción. Si un campo pierde precisión o cambia de significado, ya no es una transformación neutral: introduce una decisión de dominio.

> Doc: [OASIS SOA-RAF 1.0 — §4.3.5 Architectural Implications of Interacting with Services](https://docs.oasis-open.org/soa-rm/soa-ra/v1.0/soa-ra.html)
> Doc: [OASIS SOA-RM 1.0 — §3.2.2.1 Information Model](https://docs.oasis-open.org/soa-rm/v1.0/soa-rm.html)

```verdadero-falso
# Enunciado
Cambiar `amount: 10.50` por `amount_in_cents: 1050` puede requerir una transformación de representación sin cambiar el significado monetario.

# Respuesta
verdadero

# Explicación
La representación cambia, pero puede conservarse la semántica si unidad, moneda y precisión quedan definidas explícitamente.

# Pista
Transformar no significa reinterpretar arbitrariamente.
```

# Enrichment añade información necesaria para continuar

**Enrichment** incorpora datos adicionales que el mensaje original no contenía pero que el siguiente paso necesita.

El riesgo aparece cuando el mediator comienza a concentrar lógica de negocio de múltiples dominios. El enriquecimiento debe tener una fuente y una responsabilidad claras; si decide reglas centrales del negocio, deja de ser mera infraestructura de mediación.

> Doc: [OASIS SOA-RAF 1.0 — §4.3 Architectural Implications](https://docs.oasis-open.org/soa-rm/soa-ra/v1.0/soa-ra.html)

```opcion-multiple
# Enunciado
¿Qué distingue un enrichment razonable de un mediator convertido en núcleo de negocio?

# Opciones
- El enrichment añade información con una responsabilidad acotada
- El mediator implementa todas las decisiones de todos los dominios
- El enrichment requiere una base compartida por toda la empresa
- No existe diferencia

# Correcta
1

# Explicación
La mediación debe permanecer acotada. Concentrar lógica de negocio heterogénea convierte el intermediario en un punto de acoplamiento.

# Pista
Infraestructura de integración y dominio no deben confundirse.
```

# Protocol bridging conecta mecanismos de transporte distintos

Un **protocol bridge** permite que participantes que no comparten el mismo protocolo puedan interactuar mediante un intermediario.

Por ejemplo, un sistema legado puede emitir mensajes mediante un mecanismo que un servicio moderno no soporta. El bridge adapta el transporte sin exigir que ambos extremos implementen todos los protocolos.

> Doc: [OASIS SOA-RAF 1.0 — §4.3 Message Exchange](https://docs.oasis-open.org/soa-rm/soa-ra/v1.0/soa-ra.html)

```verdadero-falso
# Enunciado
Un protocol bridge implica necesariamente cambiar la semántica de negocio del mensaje.

# Respuesta
falso

# Explicación
El objetivo principal es adaptar el mecanismo de comunicación. Una transformación semántica puede existir, pero no es inherente al bridging.

# Pista
Protocolo y significado son capas diferentes.
```

# Un adapter encapsula una interfaz incompatible

Un **adapter** presenta una interfaz compatible con el modelo esperado mientras encapsula los detalles de un sistema externo o legado.

El adapter reduce la propagación de decisiones ajenas al dominio consumidor. En lugar de enseñar a todos los servicios cómo funciona el sistema legado, se concentra esa incompatibilidad en una frontera explícita.

> Doc: [OASIS SOA-RAF 1.0 — §4 Realization of a SOA Ecosystem](https://docs.oasis-open.org/soa-rm/soa-ra/v1.0/soa-ra.html)

```opcion-multiple
# Enunciado
¿Qué ventaja principal aporta un adapter frente a enseñar a todos los consumidores la interfaz del sistema legado?

# Opciones
- Centraliza la incompatibilidad en una frontera controlada
- Obliga a todos los consumidores a conocer más detalles internos
- Elimina la necesidad de contratos
- Convierte automáticamente el legado en microservicios

# Correcta
1

# Explicación
El adapter encapsula las diferencias y evita replicar conocimiento específico del legado en cada consumidor.

# Pista
Busca reducción de conocimiento distribuido.
```

# ESB es una posible realización, no la definición de SOA

Un **Enterprise Service Bus (ESB)** puede proporcionar mediación, routing, transformación, conectividad y otras funciones de integración. OASIS reconoce que algunas reference architectures utilizan middleware como un ESB como fundamento.

Sin embargo, el SOA-RAF no depende de un ESB. Una arquitectura SOA puede realizar mediación mediante otras topologías y componentes.

> Doc: [OASIS SOA-RAF 1.0 — §1.1.4 Relationship to other Reference Architectures](https://docs.oasis-open.org/soa-rm/soa-ra/v1.0/soa-ra.html)

```verdadero-falso
# Enunciado
Toda arquitectura SOA debe incluir un ESB central.

# Respuesta
falso

# Explicación
Un ESB es una posible tecnología de integración. OASIS mantiene la reference architecture independiente de esa elección.

# Pista
SOA no se define por un producto de middleware.
```

# Un ESB god-object concentra demasiado conocimiento

Cuando todas las transformaciones, reglas, procesos y decisiones de dominio terminan dentro de un bus central, el ESB se convierte en un **punto de acoplamiento**.

El problema no es usar mediación centralizada; el problema es que la evolución de cualquier servicio dependa de modificar el mismo componente compartido. La infraestructura deja de mediar y comienza a poseer responsabilidades de negocio de múltiples servicios.

> Doc: [OASIS SOA-RAF 1.0 — §1.1.4 Relationship to other Reference Architectures](https://docs.oasis-open.org/soa-rm/soa-ra/v1.0/soa-ra.html)
> Doc: [OASIS SOA-RAF 1.0 — §5.1 Governance](https://docs.oasis-open.org/soa-rm/soa-ra/v1.0/soa-ra.html)

```opcion-multiple
# Enunciado
¿Qué señal indica que un ESB está acumulando responsabilidad excesiva?

# Opciones
- Realiza una transformación de formato bien delimitada
- Toda regla de negocio y cambio de servicio requiere modificar el bus central
- Enruta mensajes según configuración
- Expone métricas de integración

# Correcta
2

# Explicación
La concentración de reglas heterogéneas convierte el bus en dependencia común de evolución y aumenta el acoplamiento.

# Pista
Pregunta quién posee realmente la lógica de negocio.
```

# Registry y repository facilitan awareness

Un **registry/repository** puede almacenar descripciones y facilitar descubrimiento. OASIS lo presenta como una forma de **mediated awareness**: consumidores conocen un punto donde buscar servicios en lugar de realizar búsquedas aleatorias.

El registry no garantiza que un servicio sea adecuado ni reachable. Ayuda con awareness; willingness y reachability todavía deben evaluarse.

> Doc: [OASIS SOA-RAF 1.0 — §4.2.2.1 Awareness](https://docs.oasis-open.org/soa-rm/soa-ra/v1.0/soa-ra.html)
> Doc: [OASIS SOA-RAF 1.0 — §4.2.2.1.1 Mediated Awareness](https://docs.oasis-open.org/soa-rm/soa-ra/v1.0/soa-ra.html)

```relacionar
# Enunciado
Relaciona cada mecanismo con la dimensión de visibilidad que ayuda principalmente a resolver.

# Pares
- Service registry => Awareness
- Política de aceptación del proveedor => Willingness
- Dirección y conectividad operativa => Reachability

# Explicación
Discovery ayuda a conocer servicios, pero no reemplaza condiciones de aceptación ni conectividad.

# Pista
Saber, querer y poder siguen siendo dimensiones distintas.
```

# Discovery puede ser búsqueda o notificación

OASIS indica que discovery puede iniciarse mediante una búsqueda o producirse por **notification** cuando aparece o cambia una descripción relevante.

Esto permite modelos más dinámicos que un catálogo consultado manualmente. Un consumidor puede suscribirse a cambios de descripciones y revisar compatibilidad cuando una versión nueva aparece.

> Doc: [OASIS SOA-RAF 1.0 — §4.2.2.1 Awareness](https://docs.oasis-open.org/soa-rm/soa-ra/v1.0/soa-ra.html)

```opcion-multiple
# Enunciado
¿Qué dos formas generales de discovery reconoce OASIS?

# Opciones
- Búsqueda iniciada y notificación
- Solo búsqueda manual
- Solo DNS
- Solo UDDI

# Correcta
1

# Explicación
Awareness puede establecerse consultando descripciones o recibiendo notificaciones sobre descripciones relevantes.

# Pista
Discovery no está ligado a un producto específico.
```

# Cierre

La mediación debe tener una responsabilidad identificable: **routing, transformation, enrichment, protocol bridging, adapters o awareness**. ESB y registry son posibles realizaciones, no requisitos definitorios de SOA.

La siguiente sesión estudia cómo varios servicios pueden participar en una capacidad mayor mediante **composition, orchestration y choreography**, y cómo BPMN representa procesos y colaboraciones.
