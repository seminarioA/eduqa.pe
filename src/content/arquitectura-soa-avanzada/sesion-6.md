---
numero: 6
titulo: "Composición, orquestación y coreografía"
---

# Composability permite construir capacidades mayores

OASIS define composability como la capacidad de combinar servicios con funcionalidad definida para construir soluciones de negocio más complejas. Una composición puede publicarse a su vez como servicio.

La reutilización útil exige fronteras estables y semántica suficientemente clara.

> Doc: [OASIS SOA-RAF 1.0 — Composability](https://docs.oasis-open.org/soa-rm/soa-ra/v1.0/cs01/soa-ra-v1.0-cs01.html)

```verdadero-falso
# Enunciado
Exponer cualquier función existente como endpoint garantiza que será un buen bloque reutilizable para composiciones.

# Respuesta
falso

# Explicación
La composabilidad depende de responsabilidades, contratos y estabilidad; una interfaz generada sobre código interno puede seguir siendo frágil.

# Pista
Reutilizar exige algo más que poder invocar.
```

# Orchestration concentra control de flujo en un coordinador

En una orquestación, un componente conoce el proceso y decide qué participante invocar, en qué orden y bajo qué condiciones. El coordinador mantiene estado del proceso y reglas de transición.

El beneficio es visibilidad central del flujo; el riesgo es concentrar demasiadas responsabilidades o convertirse en cuello de botella organizativo.

> Doc: [OASIS WS-BPEL 2.0](https://docs.oasis-open.org/wsbpel/2.0/OS/wsbpel-v2.0-OS.html)

```opcion-multiple
# Enunciado
¿Qué caracteriza una orquestación?

# Opciones
- Ningún participante conoce el flujo global
- Un coordinador explícito dirige la secuencia de interacciones
- Todos los mensajes son broadcast
- No existe estado de proceso

# Correcta
2

# Explicación
La orquestación concentra la lógica de coordinación en un proceso o componente que conoce el flujo.

# Pista
Busca quién dirige la secuencia.
```

# Choreography describe compromisos observables entre participantes

Una coreografía describe qué mensajes y comportamientos públicos deben intercambiar participantes sin imponer un único controlador del proceso completo.

BPMN incluye diagramas de choreography para representar estas interacciones desde una perspectiva entre participantes.

> Doc: [OMG BPMN 2.0.2 — Choreography](https://www.omg.org/spec/BPMN/2.0.2/PDF/)

```verdadero-falso
# Enunciado
Una coreografía exige que exista un único componente central que controle todos los pasos.

# Respuesta
falso

# Explicación
La coreografía especifica interacciones públicas entre participantes; el control puede permanecer distribuido.

# Pista
Compara control central con compromisos entre pares.
```

# Collaboration representa participantes y message flows

BPMN distingue pools o participants y message flows para representar comunicación entre procesos separados. Un sequence flow no debe usarse para cruzar participants independientes.

La notación ayuda a mantener visible el límite de ownership.

> Doc: [OMG BPMN 2.0.2 — Collaboration](https://www.omg.org/spec/BPMN/2.0.2/PDF/)

```relacionar
# Enunciado
Relaciona cada elemento BPMN con su función conceptual.

# Pares
- Participant => dominio o actor del proceso
- Message Flow => comunicación entre participants
- Sequence Flow => orden dentro de un proceso
- Choreography Task => interacción pública entre participants

# Explicación
BPMN separa flujo interno de proceso y comunicación entre participantes.

# Pista
Los límites de participant no se cruzan con sequence flow.
```

# Un composite service debe conservar una responsabilidad reconocible

Una composición no debería publicar accidentalmente cada paso interno. El consumidor necesita una responsabilidad coherente y un contrato estable aunque internamente participen varios servicios.

La opacidad del servicio sigue aplicándose a las composiciones.

> Doc: [OASIS SOA-RM 1.0 — §3.1 Service](https://docs.oasis-open.org/soa-rm/v1.0/soa-rm.pdf#page=12)

```opcion-multiple
# Enunciado
Un servicio compuesto usa cinco servicios internos. ¿Qué debería conocer necesariamente el consumidor?

# Opciones
- Los cinco endpoints internos
- La responsabilidad y contrato públicos del servicio compuesto
- Las tablas de cada proveedor
- El orden exacto de cada llamada privada

# Correcta
2

# Explicación
La composición puede ocultar su implementación y exponer una responsabilidad coherente.

# Pista
La opacidad también aplica a servicios compuestos.
```

# Orquestación y coreografía pueden coexistir

Un dominio puede orquestar internamente sus pasos y participar externamente en una coreografía con otros dominios. Los conceptos describen perspectivas distintas y no son mutuamente excluyentes.

El modelo debe indicar claramente dónde existe autoridad de coordinación y dónde solo existen compromisos de interacción.

> Doc: [OMG BPMN 2.0.2](https://www.omg.org/spec/BPMN/2.0.2/PDF/)

```opcion-multiple
# Enunciado
Una empresa coordina internamente pago e inventario, pero con una empresa logística solo acuerda mensajes de despacho. ¿Qué combinación describe mejor el sistema?

# Opciones
- Orquestación interna y coreografía interorganizacional
- Solo una transacción local
- Ninguna coordinación
- Un único monolito

# Correcta
1

# Explicación
La autoridad interna puede dirigir un flujo propio mientras la interacción con otro dominio se expresa como compromiso entre participantes.

# Pista
Observa que cambian los límites de ownership.
```

# Cierre

Composición, orquestación, coreografía y collaboration permiten modelar procesos multi-servicio sin borrar ownership. La siguiente sesión lleva estas ideas a eventos y arquitectura asíncrona.
