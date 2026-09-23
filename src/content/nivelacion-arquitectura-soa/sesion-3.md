---
numero: 3
titulo: "HTTP como interacción de aplicación"
---

# HTTP intercambia mensajes de petición y respuesta

HTTP es un protocolo de aplicación sin estado que define mensajes de petición y respuesta. Una petición incluye un método y un objetivo; una respuesta comunica el resultado mediante un código de estado y metadatos asociados.

El protocolo define semántica de transporte de aplicación, no la responsabilidad empresarial completa de un servicio.

> Doc: [RFC 9110 — §3.1 Messages](https://www.rfc-editor.org/rfc/rfc9110.html#section-3.1)

```relacionar
# Enunciado
Relaciona cada elemento HTTP con su función.

# Pares
- Método => expresa la semántica solicitada sobre el recurso objetivo
- Target => identifica sobre qué recurso se dirige la petición
- Status code => comunica la categoría del resultado de la respuesta
- Field => transporta metadatos del mensaje

# Explicación
Cada parte del mensaje HTTP describe un aspecto diferente de la interacción.

# Pista
Separa intención, objetivo, resultado y metadatos.
```

# El método forma parte de la semántica

GET, POST, PUT y DELETE no son nombres decorativos. RFC 9110 define propiedades y significados para los métodos, y un servidor debe interpretar la petición de acuerdo con esa semántica.

Una API puede añadir reglas de negocio, pero no debería contradecir deliberadamente la semántica del método que utiliza.

> Doc: [RFC 9110 — §9 Methods](https://www.rfc-editor.org/rfc/rfc9110.html#section-9)

```opcion-multiple
# Enunciado
¿Qué parte de una petición HTTP expresa la semántica general de la operación solicitada?

# Opciones
- El método
- El tamaño de la ventana del navegador
- La dirección MAC
- El color de la interfaz

# Correcta
1

# Explicación
El método HTTP comunica la semántica general de la acción solicitada sobre el recurso objetivo.

# Pista
GET y POST pertenecen a esta categoría.
```

# Safe no significa sin efectos internos

RFC 9110 denomina **safe** a un método cuya semántica solicitada es esencialmente de solo lectura. Un servidor puede registrar auditoría o métricas al atenderlo sin dejar de cumplir esa propiedad.

La seguridad del método se evalúa respecto del efecto solicitado por el cliente, no respecto de cada detalle interno de implementación.

> Doc: [RFC 9110 — §9.2.1 Safe Methods](https://www.rfc-editor.org/rfc/rfc9110.html#section-9.2.1)

```verdadero-falso
# Enunciado
Un GET deja de ser safe si el servidor escribe una línea de auditoría al procesarlo.

# Respuesta
falso

# Explicación
La propiedad safe se refiere a la semántica solicitada por el cliente; efectos internos como logging no cambian necesariamente esa clasificación.

# Pista
Observa qué efecto pidió el cliente.
```

# Idempotent describe el efecto de repetir la misma petición

Un método es idempotente cuando el efecto solicitado de varias peticiones idénticas es el mismo que el de una sola. PUT, DELETE y los métodos safe son idempotentes según RFC 9110.

La propiedad resulta importante ante fallos de comunicación porque permite ciertos reintentos automáticos sin duplicar el efecto solicitado.

> Doc: [RFC 9110 — §9.2.2 Idempotent Methods](https://www.rfc-editor.org/rfc/rfc9110.html#section-9.2.2)

```opcion-multiple
# Enunciado
¿Qué propiedad facilita repetir una petición cuando la conexión se corta antes de recibir la respuesta?

# Opciones
- Idempotencia
- Compresión
- Cifrado
- Renderizado

# Correcta
1

# Explicación
La idempotencia permite repetir la misma petición esperando el mismo efecto solicitado que una sola ejecución.

# Pista
La respuesta puede haberse perdido aunque el servidor sí haya actuado.
```

# Los códigos de estado clasifican el resultado HTTP

Los códigos de estado se agrupan por clases: 1xx información, 2xx éxito, 3xx redirección, 4xx error atribuible a la petición del cliente y 5xx incapacidad del servidor para completar una petición aparentemente válida.

El código no reemplaza el significado del dominio. Un 409 puede informar conflicto de protocolo, mientras el cuerpo explica la condición empresarial concreta.

> Doc: [RFC 9110 — §15 Status Codes](https://www.rfc-editor.org/rfc/rfc9110.html#section-15)

```relacionar
# Enunciado
Relaciona cada clase con su categoría general.

# Pares
- 2xx => éxito
- 3xx => redirección
- 4xx => condición atribuible a la petición del cliente
- 5xx => fallo del servidor al completar una petición válida en apariencia

# Explicación
La primera cifra clasifica el tipo general de respuesta.

# Pista
Empieza por distinguir éxito de errores del cliente y del servidor.
```

# HTTP no define por sí solo un servicio SOA

HTTP puede transportar interacciones de una arquitectura orientada a servicios, pero elegir HTTP no identifica capacidades, policies, contracts, ownership ni Real World Effects.

La arquitectura se analiza en un nivel superior al protocolo.

> Doc: [OASIS SOA-RM 1.0 — §2.1 What is Service Oriented Architecture?](https://docs.oasis-open.org/soa-rm/v1.0/soa-rm.pdf#page=8)

```verdadero-falso
# Enunciado
Una aplicación pasa a ser SOA automáticamente cuando expone endpoints HTTP.

# Respuesta
falso

# Explicación
HTTP es un protocolo. SOA exige razonar sobre servicios, capacidades, interacción, efectos, políticas y otros conceptos arquitectónicos.

# Pista
No confundas protocolo con paradigma.
```

# Cierre

HTTP ya queda ubicado como mecanismo de interacción y no como definición de arquitectura. La siguiente sesión estudia el contenido de los mensajes y los contratos de datos que permiten interpretarlos.
