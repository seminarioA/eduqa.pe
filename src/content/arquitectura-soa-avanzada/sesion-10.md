---
numero: 10
titulo: "Evaluación y evolución de una arquitectura SOA"
---

# Una evaluación avanzada empieza por capacidades y ownership

Antes de revisar productos o diagramas, se identifica qué capacidades existen, quién las controla y qué participantes dependen de ellas. Esa vista permite detectar límites artificiales y responsabilidades sin owner.

Una arquitectura con muchos endpoints puede seguir careciendo de una organización coherente de capacidades.

> Doc: [OASIS SOA-RM 1.0 — §2.1 What is Service Oriented Architecture?](https://docs.oasis-open.org/soa-rm/v1.0/soa-rm.pdf#page=8)

```opcion-multiple
# Enunciado
¿Qué pregunta debe abrir una revisión de arquitectura SOA?

# Opciones
- ¿Cuántos endpoints existen?
- ¿Qué capacidades ofrece el ecosistema y quién controla cada una?
- ¿Qué framework es más popular?
- ¿Cuántas tablas tiene cada base?

# Correcta
2

# Explicación
SOA organiza capacidades distribuidas; el inventario técnico viene después del mapa de responsabilidad.

# Pista
Empieza por qué se puede hacer y quién lo controla.
```

# La matriz de dependencias revela acoplamiento organizativo y técnico

Para cada servicio conviene registrar consumidores, servicios requeridos, contratos, datos compartidos y dependencias operacionales. Una concentración de dependencias puede indicar un cuello de botella o un dominio con demasiada responsabilidad.

La matriz también permite priorizar cambios por impacto real.

> Doc: [OASIS SOA-RAF 1.0 — Service inventory and governance](https://docs.oasis-open.org/soa-rm/soa-ra/v1.0/cs01/soa-ra-v1.0-cs01.html)

```verdadero-falso
# Enunciado
Un servicio con muchas dependencias entrantes y salientes merece analizarse aunque su código sea pequeño.

# Respuesta
verdadero

# Explicación
El riesgo arquitectónico depende de relaciones y criticidad, no solo del tamaño del repositorio.

# Pista
Una pieza pequeña puede ser un punto central del ecosistema.
```

# La evaluación de contrato incluye semántica, policy y ciclo de vida

Revisar solo el schema deja fuera significado, policies, versiones soportadas, deprecation y ownership. Un contrato avanzado debe responder qué promete, bajo qué condiciones y cómo evoluciona.

Los mecanismos de prueba deben producir evidencia sobre esas expectativas.

> Doc: [OASIS SOA-RM 1.0 — §3.3 About services](https://docs.oasis-open.org/soa-rm/v1.0/soa-rm.pdf#page=19)

```relacionar
# Enunciado
Relaciona cada dimensión del contrato con su pregunta.

# Pares
- Semántica => ¿qué significa la interacción?
- Policy => ¿bajo qué condiciones puede ocurrir?
- Versioning => ¿cómo cambia sin romper consumidores?
- Ownership => ¿quién responde por el contrato?

# Explicación
Un contrato operativo combina significado, condiciones, evolución y responsabilidad.

# Pista
Cada dimensión resuelve una clase de riesgo diferente.
```

# La evaluación de reliability sigue el efecto extremo a extremo

Hay que revisar timeout, retry, idempotencia, duplicados, ordering, compensación y observabilidad desde el consumidor hasta el recurso que produce el efecto.

Una garantía local del broker o del protocolo no demuestra la propiedad empresarial completa.

> Doc: [OASIS WS-ReliableMessaging 1.2](https://docs.oasis-open.org/ws-rx/wsrm/200702/wsrm-1.2-spec-cd-01.html)
> Doc: [OASIS WS-BusinessActivity 1.1](https://docs.oasis-open.org/ws-tx/wstx-wsba-1.1-spec-os/wstx-wsba-1.1-spec-os.html)

```opcion-multiple
# Enunciado
¿Qué revisión es más completa para una operación de pago asíncrona?

# Opciones
- Verificar solo que el broker esté encendido
- Seguir entrega, deduplicación, efecto de cobro, compensación y evidencia observacional
- Revisar solo el tamaño del JSON
- Contar commits del repositorio

# Correcta
2

# Explicación
La reliability relevante es la de la operación completa y su efecto, no la de un único componente.

# Pista
Sigue el recorrido hasta el resultado empresarial.
```

# La modernización puede encapsular antes de reemplazar

Un sistema legacy puede incorporarse a un ecosistema SOA mediante una fachada o capa de servicio que estabilice contrato y ownership antes de reescribir la implementación.

La migración incremental reduce el cambio simultáneo y permite medir comportamiento del nuevo límite.

> Doc: [OASIS SOA-RAF 1.0 — Composability and opacity](https://docs.oasis-open.org/soa-rm/soa-ra/v1.0/cs01/soa-ra-v1.0-cs01.html)

```ordenar
# Enunciado
Ordena una modernización incremental.

# Elementos
- Reemplazar internamente partes del legacy
- Definir una frontera y contrato estable
- Medir consumidores y comportamiento
- Redirigir gradualmente interacciones al nuevo límite

# Orden
2, 3, 4, 1

# Explicación
Primero se estabiliza la interfaz, después se observa y migra tráfico; la implementación puede reemplazarse por etapas detrás del mismo límite.

# Pista
No empieces por una reescritura total.
```

# Una arquitectura avanzada debe poder explicar sus trade-offs

No existe una topología universalmente correcta. El arquitecto debe poder justificar por qué eligió sincronía o eventos, atomicidad o compensación, control central o coreografía, policy local o federada.

La decisión madura incluye contexto, alternativas descartadas, consecuencias y evidencia operativa.

> Doc: [OASIS SOA-RAF 1.0 — Architectural Goals and Principles](https://docs.oasis-open.org/soa-rm/soa-ra/v1.0/cs01/soa-ra-v1.0-cs01.html)

```opcion-multiple
# Enunciado
¿Qué caracteriza mejor una decisión arquitectónica avanzada?

# Opciones
- “Es la tecnología que usa todo el mundo”
- “Elegimos esta opción por estas restricciones, aceptamos estas consecuencias y mediremos estos indicadores”
- “Siempre se ha hecho así”
- “Tiene más estrellas en GitHub”

# Correcta
2

# Explicación
Una decisión arquitectónica se justifica mediante contexto, restricciones, trade-offs y evidencia verificable.

# Pista
Busca una decisión falsable y contextual.
```

# Cierre

La ruta avanzada termina con una arquitectura que puede ser **explicada, gobernada, observada y evolucionada**. El objetivo no es acumular estándares, sino poder seleccionar mecanismos coherentes con capabilities, ownership, contracts, policies y Real World Effects del ecosistema.
