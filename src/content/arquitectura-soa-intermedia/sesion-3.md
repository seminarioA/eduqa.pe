---
numero: 3
titulo: "Semántica HTTP, errores e idempotencia"
---

# El método HTTP expresa semántica, no solo transporte

HTTP define métodos con una semántica observable. `GET`, `POST`, `PUT`, `PATCH` y `DELETE` no son nombres arbitrarios intercambiables: cada uno comunica expectativas distintas a clientes, intermediarios y servidores.

Diseñar un contrato HTTP exige que la operación de negocio sea compatible con la semántica del método elegido. Usar siempre `POST` porque «funciona» elimina información que HTTP ya proporciona.

> Doc: [RFC 9110 — §9 Methods](https://www.rfc-editor.org/rfc/rfc9110.html#name-methods)

```opcion-multiple
# Enunciado
¿Por qué importa elegir correctamente el método HTTP?

# Opciones
- Porque el método comunica semántica que clientes e intermediarios pueden utilizar
- Porque todos los métodos producen el mismo efecto
- Porque OpenAPI solo admite GET y POST
- Porque el método determina la base de datos usada

# Correcta
1

# Explicación
HTTP asigna propiedades semánticas a sus métodos. Esas propiedades influyen en seguridad, idempotencia, caché y comportamiento de intermediarios.

# Pista
El verbo HTTP forma parte del contrato.
```

# Safe significa que el cliente no solicita cambio de estado

Un método es **safe** cuando su semántica definida es esencialmente de solo lectura: el cliente no solicita un cambio de estado en el servidor como objetivo de la operación.

`GET`, `HEAD`, `OPTIONS` y `TRACE` están definidos como safe. El servidor puede registrar una solicitud o actualizar métricas, pero esos efectos auxiliares no convierten la operación solicitada en una mutación de negocio.

> Doc: [RFC 9110 — §9.2.1 Safe Methods](https://www.rfc-editor.org/rfc/rfc9110.html#name-safe-methods)

```verdadero-falso
# Enunciado
Un GET deja de ser safe si el servidor incrementa internamente un contador de métricas al recibirlo.

# Respuesta
falso

# Explicación
La propiedad safe se refiere a la semántica solicitada por el cliente. Efectos auxiliares como logging o métricas no alteran esa clasificación.

# Pista
Pregunta qué efecto pidió el consumidor.
```

# Idempotent significa mismo efecto intencional al repetir

Un método es **idempotent** cuando múltiples solicitudes idénticas tienen el mismo efecto intencional en el servidor que una sola solicitud.

RFC 9110 define como idempotentes `PUT`, `DELETE` y los métodos safe. La respuesta a dos repeticiones puede ser diferente; lo que se conserva es el efecto intencional solicitado.

> Doc: [RFC 9110 — §9.2.2 Idempotent Methods](https://www.rfc-editor.org/rfc/rfc9110.html#name-idempotent-methods)

```opcion-multiple
# Enunciado
¿Cuál expresa correctamente la idempotencia HTTP?

# Opciones
- Todas las respuestas repetidas deben tener bytes idénticos
- Repetir la misma solicitud produce el mismo efecto intencional que ejecutarla una vez
- El servidor no puede registrar cada repetición
- Solo GET puede ser idempotente

# Correcta
2

# Explicación
La idempotencia se aplica al efecto solicitado. Logging, historial u otros efectos internos pueden variar y la respuesta tampoco tiene que ser idéntica.

# Pista
La propiedad describe efecto, no igualdad de respuestas.
```

# PUT reemplaza o crea el estado del recurso identificado

`PUT` solicita que el estado del recurso objetivo sea creado o reemplazado por la representación suministrada. El cliente conoce la URI objetivo.

Esa semántica explica por qué PUT es idempotente: repetir la misma representación sobre la misma URI busca dejar el mismo estado solicitado.

> Doc: [RFC 9110 — §9.3.4 PUT](https://www.rfc-editor.org/rfc/rfc9110.html#name-put)

```opcion-multiple
# Enunciado
¿Qué propiedad hace que PUT sea naturalmente idempotente?

# Opciones
- El cliente solicita establecer una representación determinada en una URI conocida
- PUT nunca contiene body
- PUT solo puede usarse una vez
- El servidor debe ignorar la segunda solicitud

# Correcta
1

# Explicación
Repetir la misma solicitud PUT pretende dejar el recurso en el mismo estado definido por la representación enviada.

# Pista
Piensa en «establecer este estado» frente a «crear otra acción».
```

# DELETE también es idempotente aunque la respuesta pueda cambiar

`DELETE` solicita eliminar la asociación entre la URI objetivo y su funcionalidad actual. Repetir el mismo DELETE sigue persiguiendo el mismo estado final: que esa asociación ya no exista.

Una primera solicitud puede responder `204` y una repetición `404`; eso no contradice la idempotencia porque el efecto intencional sigue siendo el mismo.

> Doc: [RFC 9110 — §9.3.5 DELETE](https://www.rfc-editor.org/rfc/rfc9110.html#name-delete)
> Doc: [RFC 9110 — §9.2.2 Idempotent Methods](https://www.rfc-editor.org/rfc/rfc9110.html#name-idempotent-methods)

```verdadero-falso
# Enunciado
Si dos DELETE idénticos devuelven status codes diferentes, el método deja automáticamente de ser idempotente.

# Respuesta
falso

# Explicación
Idempotencia se refiere al efecto intencional. El estado observado después de la primera ejecución puede hacer que la respuesta posterior sea distinta.

# Pista
No confundas igualdad de efecto con igualdad de respuesta.
```

# POST no es idempotente por definición

`POST` solicita que el recurso objetivo procese la representación enviada según su propia semántica. Puede crear recursos, iniciar procesos, añadir elementos o realizar otras acciones.

RFC 9110 no clasifica POST como idempotente. Un cliente no debe reintentarlo automáticamente salvo que conozca, por diseño o configuración, que la operación concreta tiene semántica idempotente o que la primera solicitud no se aplicó.

> Doc: [RFC 9110 — §9.3.3 POST](https://www.rfc-editor.org/rfc/rfc9110.html#name-post)
> Doc: [RFC 9110 — §9.2.2 Idempotent Methods](https://www.rfc-editor.org/rfc/rfc9110.html#name-idempotent-methods)

```opcion-multiple
# Enunciado
¿Cuándo es razonable reintentar automáticamente un POST?

# Opciones
- Siempre que exista un timeout
- Cuando el cliente conoce que la operación concreta es idempotente o sabe que la primera no se aplicó
- Nunca bajo ninguna circunstancia
- Cuando el body es JSON

# Correcta
2

# Explicación
RFC 9110 permite repetir una operación no idempotente cuando el cliente tiene conocimiento adicional que hace seguro el reintento.

# Pista
La seguridad del retry depende de la semántica efectiva.
```

# Un error HTTP necesita status y detalle de dominio

Los status codes HTTP expresan una categoría general del resultado, pero no siempre contienen suficiente información para que un consumidor automatizado comprenda el problema concreto.

RFC 9457 define **Problem Details for HTTP APIs**, un formato para transportar detalles legibles por máquinas sin inventar un esquema de error completamente diferente para cada endpoint.

> Doc: [RFC 9457 — §1 Introduction](https://www.rfc-editor.org/rfc/rfc9457.html#name-introduction)
> Doc: [RFC 9110 — §15 Status Codes](https://www.rfc-editor.org/rfc/rfc9110.html#name-status-codes)

```verdadero-falso
# Enunciado
Un status code HTTP siempre contiene por sí solo toda la información de dominio que un consumidor necesita para recuperarse de un error.

# Respuesta
falso

# Explicación
Los status codes expresan semántica general. Problem Details permite añadir información específica del problema en un formato estándar.

# Pista
403 puede tener muchas causas de negocio diferentes.
```

# application/problem+json estandariza la forma del error

RFC 9457 define el media type `application/problem+json`. Un problem detail puede incluir miembros estándar como `type`, `status`, `title`, `detail` e `instance`.

`type` identifica la clase de problema; `detail` explica la ocurrencia concreta. No debe usarse el cuerpo de error para revelar trazas internas, secretos o información que el consumidor no necesita.

```json
{
  "type": "https://api.example.com/problems/insufficient-credit",
  "status": 403,
  "title": "Crédito insuficiente",
  "detail": "La operación supera el crédito disponible."
}
```

> Doc: [RFC 9457 — §3.1 Members of a Problem Details Object](https://www.rfc-editor.org/rfc/rfc9457.html#name-members-of-a-problem-details-)

```relacionar
# Enunciado
Relaciona cada miembro con su función.

# Pares
- type => identifica la clase de problema
- status => refleja el status code HTTP
- title => resume de forma estable la clase de problema
- detail => describe esta ocurrencia concreta
- instance => identifica la ocurrencia específica cuando aplica

# Explicación
RFC 9457 separa la identidad del tipo de problema de los detalles de una ocurrencia concreta.

# Pista
Distingue clase de error de instancia de error.
```

# Los status codes deben conservar su semántica general

Problem Details complementa el status code; no lo reemplaza. Un error de validación, una ausencia de autenticación, una prohibición por autorización y un conflicto de estado no deberían colapsarse indiscriminadamente en `500 Internal Server Error`.

Elegir un status compatible con la semántica HTTP permite que infraestructura y clientes genéricos reaccionen correctamente antes de interpretar detalles específicos del dominio.

> Doc: [RFC 9110 — §15 Status Codes](https://www.rfc-editor.org/rfc/rfc9110.html#name-status-codes)
> Doc: [RFC 9457 — §3.1.2 status](https://www.rfc-editor.org/rfc/rfc9457.html#name-status)

```relacionar
# Enunciado
Relaciona cada condición con la categoría HTTP más apropiada.

# Pares
- Recurso solicitado no existe => 404 Not Found
- Credenciales requeridas ausentes o inválidas => 401 Unauthorized
- Identidad conocida pero operación no permitida => 403 Forbidden
- Estado actual entra en conflicto con la operación => 409 Conflict
- Fallo inesperado del servidor => 500 Internal Server Error

# Explicación
Los códigos representan categorías distintas de resultado y no deben usarse como equivalentes.

# Pista
Separa inexistencia, autenticación, autorización, conflicto y fallo interno.
```

# La idempotencia es un requisito previo para retries seguros

Cuando una llamada falla antes de que el cliente reciba respuesta, puede ser imposible saber si el proveedor aplicó la operación. Esa incertidumbre convierte la idempotencia en una propiedad central para diseñar retries.

AWS recomienda diseñar APIs idempotentes cuando los retries podrían repetir efectos secundarios. La estrategia concreta puede utilizar identificadores de solicitud u otras técnicas, pero el contrato debe definir con claridad qué duplicados reconoce y durante cuánto tiempo.

> Doc: [Amazon Builders' Library — Timeouts, retries, and backoff with jitter](https://aws.amazon.com/builders-library/timeouts-retries-and-backoff-with-jitter/)
> Doc: [RFC 9110 — §9.2.2 Idempotent Methods](https://www.rfc-editor.org/rfc/rfc9110.html#name-idempotent-methods)

```opcion-multiple
# Enunciado
¿Por qué idempotencia y retry deben diseñarse juntos?

# Opciones
- Porque un timeout no demuestra si el proveedor aplicó o no la operación
- Porque todos los retries usan GET
- Porque HTTP prohíbe efectos secundarios
- Porque idempotencia obliga a responder siempre 200

# Correcta
1

# Explicación
Cuando la respuesta se pierde, el cliente puede repetir una operación que ya se aplicó. La idempotencia evita duplicar el efecto intencional.

# Pista
El problema aparece cuando no sabes si la primera ejecución ocurrió.
```

# Cierre

Un contrato HTTP intermedio necesita semántica, no solo schemas. **Safety, idempotency, métodos, status codes y Problem Details** determinan cómo consumidores e infraestructura interpretan la interacción.

La siguiente sesión cambia el modelo de comunicación: en lugar de request/response HTTP, diseñaremos **contratos asíncronos y message-driven** con AsyncAPI.
