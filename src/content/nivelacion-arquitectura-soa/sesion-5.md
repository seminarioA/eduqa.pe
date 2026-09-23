---
numero: 5
titulo: "Interacción síncrona, asíncrona y correlación"
---

# Síncrono describe una dependencia temporal de respuesta

En una interacción síncrona, el consumidor mantiene una dependencia temporal con la operación solicitada y espera una respuesta para continuar ese tramo de ejecución.

Esto no implica que toda la implementación interna sea síncrona; describe la relación observable del intercambio.

> Doc: [W3C Web Services Architecture — §3.3 Using Web Services](https://www.w3.org/TR/ws-arch/)

```opcion-multiple
# Enunciado
¿Qué caracteriza principalmente a una interacción síncrona desde el consumidor?

# Opciones
- El consumidor necesita una respuesta para continuar ese tramo
- El proveedor nunca usa colas internamente
- Los dos procesos deben estar en la misma máquina
- El mensaje tiene que ser XML

# Correcta
1

# Explicación
La sincronía describe la dependencia temporal del intercambio, no la tecnología interna ni el formato del mensaje.

# Pista
Piensa en cuándo puede continuar el consumidor.
```

# Asíncrono desacopla el momento de envío del momento de resultado

En una interacción asíncrona, enviar un mensaje no exige recibir inmediatamente el resultado final de la operación. El procesamiento puede ocurrir después y la respuesta puede llegar mediante otro mensaje, consulta o notificación.

El desacoplamiento temporal introduce nuevas responsabilidades: correlación, persistencia, reintentos y tratamiento de mensajes duplicados.

> Doc: [W3C Web Services Architecture — §2.3.1 Message Oriented Model](https://www.w3.org/TR/ws-arch/)

```verdadero-falso
# Enunciado
Asíncrono significa que nunca existe una respuesta relacionada con la solicitud original.

# Respuesta
falso

# Explicación
Puede existir un resultado posterior; la diferencia es que no tiene que llegar como respuesta inmediata del mismo intercambio temporal.

# Pista
Tiempo de respuesta y existencia de resultado son conceptos diferentes.
```

# Una secuencia de mensajes representa una conversación

W3C denomina **message sequence** al conjunto ordenado de mensajes intercambiados durante una interacción. Un patrón de intercambio puede incluir más de una petición y más de una respuesta.

Pensar en secuencias evita reducir toda interacción a una única llamada.

> Doc: [W3C Web Services Architecture — §2.3.1.12 Message Sequence](https://www.w3.org/TR/ws-arch/)

```ordenar
# Enunciado
Ordena una conversación asíncrona simple.

# Elementos
- Notificar el resultado
- Aceptar el trabajo
- Enviar la solicitud

# Orden
3, 2, 1

# Explicación
Primero se envía la solicitud, luego el proveedor confirma que la aceptó y más tarde notifica el resultado.

# Pista
La aceptación no puede ocurrir antes de la solicitud.
```

# La correlación asocia un mensaje con su contexto

Cuando existen varias solicitudes simultáneas, el receptor de una respuesta necesita determinar a qué conversación pertenece. W3C define **message correlation** como la asociación de un mensaje con un contexto.

Un identificador de correlación es una forma habitual de mantener esa relación.

> Doc: [W3C Web Services Architecture — §2.3.1.5 Message Correlation](https://www.w3.org/TR/ws-arch/)

```opcion-multiple
# Enunciado
Un consumidor tiene veinte operaciones asíncronas pendientes. ¿Qué mecanismo permite asociar cada respuesta con la solicitud correcta?

# Opciones
- Correlación
- Compresión
- Cifrado simétrico
- DNS

# Correcta
1

# Explicación
La correlación preserva el contexto entre mensajes de una misma conversación.

# Pista
Necesitas identificar a qué operación pertenece cada mensaje.
```

# Un broker puede mediar mensajes sin convertirse en dueño del dominio

Un intermediario puede transportar, enrutar o transformar mensajes. La infraestructura de mensajería no debería apropiarse automáticamente de las reglas empresariales de todos los servicios que conecta.

Centralizar transporte y centralizar ownership son decisiones distintas.

> Doc: [W3C Web Services Architecture — §2.3.2.13 Service Intermediary](https://www.w3.org/TR/ws-arch/)

```verdadero-falso
# Enunciado
Usar un intermediario de mensajes obliga a concentrar en él toda la lógica empresarial de los servicios.

# Respuesta
falso

# Explicación
La mediación de mensajes puede mantenerse separada del ownership de las capacidades de negocio.

# Pista
Transportar o transformar no equivale a poseer la responsabilidad.
```

# Elegir síncrono o asíncrono es una decisión arquitectónica

La elección modifica latencia percibida, manejo de fallos, consistencia, observabilidad y experiencia del consumidor. No existe una opción universalmente superior.

La decisión debe responder al tipo de interacción y a los efectos esperados.

> Doc: [OASIS SOA-RAF 1.0 — §4.3 Interaction with Services](https://docs.oasis-open.org/soa-rm/soa-ra/v1.0/soa-ra.html)

```opcion-multiple
# Enunciado
Una operación tarda minutos y el consumidor no necesita bloquear su flujo mientras se procesa. ¿Qué estilo merece evaluarse primero?

# Opciones
- Interacción asíncrona con seguimiento del resultado
- Bucle de espera ocupado durante minutos
- Acoplar ambos procesos en el mismo ejecutable
- Eliminar la operación

# Correcta
1

# Explicación
El procesamiento prolongado suele beneficiarse de desacoplar aceptación y finalización, siempre que se diseñe correlación y seguimiento.

# Pista
El consumidor no necesita permanecer esperando.
```

# Cierre

Ya puedes distinguir sincronía, asincronía, secuencia, correlación e intermediación. La siguiente sesión estudia estado, efectos, reintentos e idempotencia.
