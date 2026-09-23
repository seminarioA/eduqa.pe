---
numero: 8
titulo: "SOA no es Web Services"
---

# SOA y Web Services viven en niveles de abstracción diferentes

OASIS indica explícitamente que SOA se implementa con frecuencia mediante **Web Services**, pero también aclara que Web Services son una realización concreta y demasiado específica para formar parte de un modelo de referencia general.

Por tanto, la relación correcta no es «SOA = Web Services», sino que Web Services pueden ser una de las tecnologías utilizadas para realizar una arquitectura orientada a servicios.

> Doc: [OASIS SOA-RM 1.0 — §2.1 What is Service Oriented Architecture?](https://docs.oasis-open.org/soa-rm/v1.0/soa-rm.pdf#page=8)

```verdadero-falso
# Enunciado
Una arquitectura solo puede considerarse SOA si todos sus servicios se implementan como Web Services.

# Respuesta
falso

# Explicación
OASIS señala que SOA puede realizarse mediante estrategias distintas de Web Services. Web Services son una realización tecnológica concreta, no la definición del paradigma.

# Pista
Distingue paradigma arquitectónico de una tecnología de implementación.
```

# Un Web Service es una tecnología de interacción máquina a máquina

La Web Services Architecture de W3C define un **Web service** como un sistema de software diseñado para soportar interacción interoperable máquina a máquina sobre una red.

En esa arquitectura concreta, la interfaz está descrita en un formato procesable por máquinas y los sistemas interactúan siguiendo esa descripción. W3C sitúa aquí tecnologías como WSDL y SOAP.

> Doc: [W3C Web Services Architecture — §1.4 What is a Web service?](https://www.w3.org/TR/ws-arch/#whatis)

```opcion-multiple
# Enunciado
¿Cuál describe mejor un Web Service según la Web Services Architecture de W3C?

# Opciones
- Un paradigma general para organizar capacidades distribuidas
- Un sistema de software diseñado para interacción interoperable máquina a máquina sobre una red
- Una base de datos accesible por cualquier cliente
- Un patrón obligatorio de microservicios

# Correcta
2

# Explicación
W3C define el Web Service como un sistema de software orientado a interoperabilidad máquina a máquina. Esa definición es más concreta que la definición general de SOA.

# Pista
Busca la opción que describe una tecnología/arquitectura concreta de interoperabilidad.
```

# Service y agent tampoco son lo mismo

W3C distingue el **service** de su **agent**. El service representa la funcionalidad abstracta; el agent es la pieza concreta de software o hardware que envía y recibe mensajes para realizar esa funcionalidad.

La implementación puede cambiar sin que necesariamente cambie el servicio. Esta separación es compatible con la idea estudiada en OASIS de que el servicio no debe identificarse con todos los detalles de su implementación interna.

> Doc: [W3C Web Services Architecture — §1.4.1 Agents and Services](https://www.w3.org/TR/ws-arch/#agents)

```relacionar
# Enunciado
Relaciona cada concepto con su función dentro de la Web Services Architecture.

# Pares
- Service => funcionalidad abstracta proporcionada
- Agent => software o hardware concreto que envía y recibe mensajes

# Explicación
El agent realiza el service, pero ambos conceptos no son equivalentes.

# Pista
Uno describe qué se ofrece; el otro qué pieza concreta lo ejecuta.
```

# Requester y provider describen dos lados de la interacción

W3C distingue **requester entity** y **provider entity** como organizaciones o personas, y **requester agent** y **provider agent** como los agentes concretos que intercambian mensajes.

Esta precisión evita mezclar a la organización propietaria con el software que participa directamente en la comunicación.

![Roles básicos de Web Services](https://www.w3.org/TR/ws-arch/images/intro_ws_roles.gif)

*Figura 1-1 de W3C Web Services Architecture: requester, provider, agentes, descripción y mensajes.*

> Doc: [W3C Web Services Architecture — §1.4.2 Requesters and Providers](https://www.w3.org/TR/ws-arch/#requesterprovider)

```relacionar
# Enunciado
Relaciona cada rol con lo que representa.

# Pares
- Provider entity => persona u organización que proporciona el servicio
- Provider agent => implementación concreta que participa en el intercambio
- Requester entity => persona u organización que desea utilizar el servicio
- Requester agent => implementación concreta que interactúa con el provider agent

# Explicación
W3C separa entidades propietarias y agentes de software para evitar una terminología ambigua.

# Pista
Entity identifica al actor organizacional; agent identifica al ejecutor técnico.
```

# WSDL describe la mecánica del Web Service

En la arquitectura de W3C, la **Web Service Description** es una especificación procesable por máquinas escrita en **WSDL**. Describe elementos como formatos de mensajes, tipos de datos, protocolos de transporte, serialización y ubicaciones de red.

Esto pertenece a la arquitectura concreta de Web Services. El SOA Reference Model de OASIS, en cambio, exige conceptualmente una service description pero no obliga a que se exprese mediante WSDL.

> Doc: [W3C Web Services Architecture — §1.4.3 Service Description](https://www.w3.org/TR/ws-arch/#wsdl)
> Doc: [OASIS SOA-RM 1.0 — §3.3.1 Service description](https://docs.oasis-open.org/soa-rm/v1.0/soa-rm.pdf#page=20)

```opcion-multiple
# Enunciado
¿Cuál es la relación correcta entre service description en SOA y WSDL?

# Opciones
- OASIS exige WSDL para toda service description
- WSDL es una realización concreta utilizada por la arquitectura de Web Services para describir interfaces
- WSDL define el paradigma SOA
- Service description solo existe en Web Services

# Correcta
2

# Explicación
OASIS define la necesidad conceptual de describir servicios; W3C utiliza WSDL como tecnología concreta para describir Web Services.

# Pista
Distingue requisito conceptual de formato específico.
```

# SOAP es un mecanismo concreto de mensajería

La definición de Web Service utilizada por W3C describe interacciones mediante **SOAP messages**, normalmente transportados usando HTTP y serializados con XML junto con otros estándares web.

Esto vuelve a mostrar el nivel de concreción de Web Services: SOAP, HTTP y XML son tecnologías identificables. Ninguna de ellas forma parte de la definición abstracta de SOA de OASIS.

> Doc: [W3C Web Services Architecture — §1.4 What is a Web service?](https://www.w3.org/TR/ws-arch/#whatis)
> Doc: [W3C Web Services Architecture — §3.2.2 SOAP](https://www.w3.org/TR/ws-arch/#soap)

```relacionar
# Enunciado
Relaciona cada término con su nivel principal.

# Pares
- SOA => paradigma arquitectónico
- Web Service => sistema de software para interoperabilidad máquina a máquina
- WSDL => descripción procesable de la interfaz de un Web Service
- SOAP => mecanismo concreto de mensajería
- HTTP => transporte usado habitualmente en esta arquitectura

# Explicación
Los términos no son intercambiables: cada uno ocupa una función distinta dentro de distintos niveles de abstracción.

# Pista
Ordena mentalmente desde arquitectura abstracta hasta mecanismos técnicos.
```

# SOAP no es el servicio

Un mensaje SOAP es un artefacto de interacción. No es la capacidad, no es el servicio abstracto y no es la organización proveedora.

Confundir el mensaje con el servicio elimina las distinciones que permiten razonar arquitectónicamente sobre funcionalidad, interfaz, implementación y efecto.

> Doc: [W3C Web Services Architecture — §2.3.1 Message Oriented Model](https://www.w3.org/TR/ws-arch/#message_model)
> Doc: [W3C Web Services Architecture — §2.3.2 The Service Oriented Model](https://www.w3.org/TR/ws-arch/#service_oriented_model)

```verdadero-falso
# Enunciado
Un mensaje SOAP y un servicio representan el mismo concepto arquitectónico.

# Respuesta
falso

# Explicación
El mensaje pertenece al modelo de mensajería; el servicio representa funcionalidad y es realizado por agentes que pueden intercambiar mensajes.

# Pista
Un artefacto intercambiado no equivale a la capacidad ofrecida.
```

# W3C también separa mecánica y semántica

La Web Services Architecture distingue la **mecánica** del intercambio —descrita por la Web Service Description— de la **semántica**, es decir, la expectativa compartida sobre el comportamiento, propósito y consecuencias de la interacción.

Esta distinción coincide con una idea ya estudiada en OASIS: compatibilidad estructural y capacidad de intercambiar mensajes no garantizan por sí solas una interpretación semántica consistente.

> Doc: [W3C Web Services Architecture — §1.4.3 Service Description](https://www.w3.org/TR/ws-arch/#wsdl)
> Doc: [W3C Web Services Architecture — §1.4.4 Semantics](https://www.w3.org/TR/ws-arch/#semantics)

```opcion-multiple
# Enunciado
Dos agentes intercambian mensajes válidos según WSDL, pero interpretan de manera distinta el propósito de una operación. ¿Qué sigue faltando?

# Opciones
- Compatibilidad semántica
- Una segunda dirección IP
- Un nuevo lenguaje de programación
- Una base de datos compartida

# Correcta
1

# Explicación
La mecánica del intercambio puede ser correcta y aun así faltar acuerdo sobre significado y consecuencias.

# Pista
La sintaxis funciona; falla la interpretación.
```

# Utilizar un Web Service implica varias etapas conceptuales

W3C resume el engagement de un Web Service en pasos generales: las partes se conocen, acuerdan la descripción y semántica aplicables, los agentes realizan esas condiciones y finalmente intercambian mensajes para ejecutar una tarea.

Esta secuencia se parece a conceptos ya vistos en OASIS: awareness, agreement, execution context e interaction, aunque ambos documentos utilizan modelos y terminología propios.

> Doc: [W3C Web Services Architecture — §1.4.5 Overview of Engaging a Web Service](https://www.w3.org/TR/ws-arch/#engaging)

```ordenar
# Enunciado
Ordena las etapas generales de engagement descritas por W3C.

# Elementos
- Los agentes intercambian mensajes
- Requester y provider llegan a conocerse
- Los agentes realizan la descripción y semántica acordadas
- Las partes acuerdan la descripción y semántica aplicables

# Orden
2, 4, 3, 1

# Explicación
Primero existe conocimiento entre las partes, luego acuerdo sobre cómo y qué significa la interacción, después los agentes realizan ese acuerdo y finalmente intercambian mensajes.

# Pista
No puede haber intercambio correcto antes de saber con quién se interactúa y bajo qué reglas.
```

# Web Services pueden ser SOA sin definir por sí solos toda la SOA

Una solución que utiliza Web Services puede realizar conceptos SOA: servicios, visibilidad, interacción, descriptions, policies, contracts y efectos. Pero adoptar SOAP y WSDL por sí solo no demuestra que todos esos conceptos estén bien definidos.

La conformidad conceptual con SOA depende de cómo se organiza la arquitectura completa, no de comprobar la presencia de una tecnología específica.

> Doc: [OASIS SOA-RM 1.0 — §2.1 What is Service Oriented Architecture?](https://docs.oasis-open.org/soa-rm/v1.0/soa-rm.pdf#page=8)
> Doc: [OASIS SOA-RM 1.0 — §4 Conformance Guidelines](https://docs.oasis-open.org/soa-rm/v1.0/soa-rm.pdf#page=26)

```verdadero-falso
# Enunciado
Encontrar SOAP y WSDL en un sistema es suficiente por sí solo para demostrar que su arquitectura satisface todos los conceptos del SOA Reference Model.

# Respuesta
falso

# Explicación
SOAP y WSDL son tecnologías. OASIS evalúa SOA mediante conceptos como servicios, visibilidad, interacción, efecto, descriptions, execution context, policies y contracts.

# Pista
La presencia de una tecnología no sustituye el análisis arquitectónico.
```

# Cierre

**SOA** define un paradigma de organización de capacidades y relaciones entre participantes. **Web Services** define una arquitectura concreta de interoperabilidad máquina a máquina con agentes, descripciones procesables y mensajería.

SOAP y WSDL aparecen en la segunda categoría, no en la definición de la primera. La siguiente sesión vuelve a OASIS para estudiar qué diferencia a SOA de otros enfoques y qué beneficios atribuye el propio Reference Model a la orientación a servicios.
