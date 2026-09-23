---
numero: 4
titulo: "Mensajería fiable y semántica de entrega"
---

# Reliable messaging añade garantías sobre una red que puede fallar

Una red puede perder, duplicar o retrasar mensajes. WS-ReliableMessaging define un protocolo para transferir mensajes de forma fiable entre endpoints aun cuando existan fallos de software, sistema o red.

La fiabilidad se construye mediante secuencias, identificadores y acknowledgements; no aparece por utilizar un broker o SOAP de forma automática.

> Doc: [OASIS WS-ReliableMessaging 1.2](https://docs.oasis-open.org/ws-rx/wsrm/200702/wsrm-1.2-spec-cd-01.html)

```verdadero-falso
# Enunciado
Usar mensajería asíncrona garantiza por sí solo que ningún mensaje se perderá.

# Respuesta
falso

# Explicación
La fiabilidad depende de mecanismos concretos de persistencia, confirmación, reintento y recuperación.

# Pista
Asincronía y fiabilidad son propiedades diferentes.
```

# Un sequence agrupa mensajes bajo una relación de entrega

WS-RM utiliza secuencias para identificar un flujo de mensajes y su progreso. Los mensajes de una secuencia llevan numeración que permite detectar huecos y duplicados.

La secuencia convierte una colección de mensajes independientes en una unidad observable de fiabilidad.

> Doc: [OASIS WS-ReliableMessaging 1.2 — Sequences](https://docs.oasis-open.org/ws-rx/wsrm/200702/wsrm-1.2-spec-cd-01.html)

```ordenar
# Enunciado
Ordena una secuencia de entrega con confirmación.

# Elementos
- El receptor confirma los números recibidos
- El emisor asigna número al mensaje
- El emisor reenvía un número no confirmado

# Orden
2, 1, 3

# Explicación
La numeración permite que el acknowledgement identifique mensajes recibidos y que el emisor determine cuáles requieren reenvío.

# Pista
No puedes reenviar por falta de confirmación antes de haber enviado.
```

# Acknowledgement confirma recepción, no éxito de negocio

Un acknowledgement de transporte demuestra que el mensaje fue recibido según el protocolo. No necesariamente significa que la operación empresarial terminó con éxito.

Confundir ambos niveles puede marcar una orden como completada cuando solo se confirmó su entrega técnica.

> Doc: [OASIS WS-ReliableMessaging 1.2 — Sequence Acknowledgement](https://docs.oasis-open.org/ws-rx/wsrm/200702/wsrm-1.2-spec-cd-01.html)

```opcion-multiple
# Enunciado
¿Qué demuestra un acknowledgement de mensajería?

# Opciones
- Que la operación empresarial fue aprobada
- Que el protocolo reconoce recepción dentro de la secuencia
- Que la base de datos hizo commit
- Que el usuario quedó satisfecho

# Correcta
2

# Explicación
El acknowledgement pertenece a la capa de entrega; el resultado de negocio requiere su propia semántica.

# Pista
Recepción técnica y resultado empresarial no son equivalentes.
```

# At-least-once exige tolerar duplicados

Un sistema que reintenta hasta obtener confirmación puede entregar el mismo mensaje más de una vez si la confirmación se pierde. Por eso una garantía práctica de **at-least-once** debe acompañarse de idempotencia o deduplicación.

Eliminar duplicados después de producir un efecto irreversible llega demasiado tarde.

> Doc: [RFC 9110 — §9.2.2 Idempotent Methods](https://www.rfc-editor.org/rfc/rfc9110.html#section-9.2.2)

```opcion-multiple
# Enunciado
¿Qué diseño complementa mejor una entrega at-least-once?

# Opciones
- Procesamiento idempotente o deduplicación antes del efecto
- Desactivar todos los identificadores
- Ignorar mensajes repetidos sin detectarlos
- Suponer que la red nunca pierde acknowledgements

# Correcta
1

# Explicación
At-least-once puede producir duplicados; el consumidor debe impedir que esos duplicados multipliquen el efecto lógico.

# Pista
Más de una entrega no debería significar más de un efecto.
```

# Ordering es una garantía independiente de entrega

Recibir todos los mensajes no implica recibirlos en el orden en que fueron producidos. Si el dominio depende del orden, la arquitectura debe preservar una clave de secuencia o diseñar operaciones conmutativas.

Exigir orden global puede reducir escalabilidad; conviene limitarlo al ámbito donde la semántica realmente lo necesita.

> Doc: [OASIS WS-ReliableMessaging 1.2](https://docs.oasis-open.org/ws-rx/wsrm/200702/wsrm-1.2-spec-cd-01.html)

```verdadero-falso
# Enunciado
Garantizar que todos los mensajes lleguen implica automáticamente que llegarán en el mismo orden en que fueron enviados.

# Respuesta
falso

# Explicación
Fiabilidad de entrega y orden son garantías diferentes y deben declararse por separado.

# Pista
Completo no significa ordenado.
```

# Exactly-once empresarial no se obtiene solo del transporte

Incluso si una capa de mensajería deduplica entregas, el efecto final puede atravesar bases de datos, servicios externos y reintentos. La propiedad debe analizarse extremo a extremo.

En muchos sistemas es más práctico diseñar efectos idempotentes y evidencia de procesamiento que prometer una ejecución física exactamente una vez.

> Doc: [OASIS SOA-RAF 1.0 — §2.1.2 Trust and reliability](https://docs.oasis-open.org/soa-rm/soa-ra/v1.0/cs01/soa-ra-v1.0-cs01.html)

```opcion-multiple
# Enunciado
¿Por qué una garantía de transporte no basta para prometer exactly-once empresarial?

# Opciones
- Porque el efecto puede atravesar recursos y sistemas fuera de la capa de transporte
- Porque los mensajes no tienen identificadores
- Porque exactly-once significa usar HTTP GET
- Porque toda base de datos duplica operaciones

# Correcta
1

# Explicación
La semántica empresarial depende del procesamiento completo, no solo de cuántas veces el broker entrega un mensaje.

# Pista
Sigue el efecto hasta el recurso final.
```

# Cierre

Secuencias, acknowledgements, duplicados, ordering e idempotencia forman una estrategia de fiabilidad. La siguiente sesión estudia transacciones distribuidas y compensación.
