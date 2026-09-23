---
numero: 6
titulo: "Estado, efectos e idempotencia"
---

# Una interacción puede cambiar estado observable

Una operación puede consultar información o producir un cambio observable en el mundo del sistema. Para analizarla hay que distinguir el mensaje enviado del efecto que provoca.

OASIS denomina **Real World Effect** al resultado relevante de una interacción con un servicio.

> Doc: [OASIS SOA-RM 1.0 — §3.2.3 Real World Effect](https://docs.oasis-open.org/soa-rm/v1.0/soa-rm.pdf#page=17)

```relacionar
# Enunciado
Relaciona cada elemento con su ejemplo.

# Pares
- Mensaje => solicitud para reservar una unidad
- Efecto => una unidad queda reservada
- Estado => cantidad disponible tras la reserva
- Respuesta => confirmación enviada al consumidor

# Explicación
El mensaje inicia la interacción, el efecto modifica el mundo relevante y la respuesta informa el resultado.

# Pista
No confundas lo enviado con lo que cambió.
```

# Un fallo de comunicación deja incertidumbre sobre el efecto

Si la conexión se corta después de enviar una solicitud, el consumidor puede no saber si el proveedor la procesó. El fallo observable es de comunicación, pero el efecto empresarial puede haberse producido.

Esa incertidumbre explica por qué un reintento no debe diseñarse como una repetición ciega.

> Doc: [RFC 9110 — §9.2.2 Idempotent Methods](https://www.rfc-editor.org/rfc/rfc9110.html#section-9.2.2)

```opcion-multiple
# Enunciado
La conexión se corta después de enviar una orden y antes de recibir la respuesta. ¿Qué sabe con certeza el consumidor?

# Opciones
- Que el proveedor no ejecutó nada
- Que el proveedor ejecutó exactamente una vez
- Solo que no recibió la respuesta; el efecto puede haber ocurrido o no
- Que debe repetir siempre la operación

# Correcta
3

# Explicación
La pérdida de respuesta no revela si el servidor procesó la petición antes del corte.

# Pista
Se perdió observabilidad del resultado, no necesariamente la ejecución.
```

# Idempotencia controla el efecto de repetir

Una operación idempotente está diseñada para que repetir la misma intención no multiplique su efecto observable. En HTTP, la propiedad está definida para ciertos métodos; en el dominio también puede diseñarse mediante identificadores de operación.

La idempotencia no impide registrar cada intento ni garantiza ausencia total de actividad interna.

> Doc: [RFC 9110 — §9.2.2 Idempotent Methods](https://www.rfc-editor.org/rfc/rfc9110.html#section-9.2.2)

```verdadero-falso
# Enunciado
Idempotencia significa que el servidor no puede registrar dos intentos de la misma operación.

# Respuesta
falso

# Explicación
La propiedad se refiere al efecto solicitado. Logging, métricas u otros efectos internos pueden ocurrir en cada intento.

# Pista
Distingue efecto solicitado de detalles internos.
```

# Un identificador de operación permite detectar duplicados

Asignar una clave estable a una intención permite al proveedor reconocer que dos mensajes representan la misma operación lógica. El proveedor puede devolver el resultado ya calculado en lugar de ejecutar el efecto otra vez.

La clave debe representar la intención adecuada; reutilizarla para operaciones distintas crea errores de deduplicación.

> Doc: [OASIS SOA-RAF 1.0 — §3.3.4 Identity](https://docs.oasis-open.org/soa-rm/soa-ra/v1.0/soa-ra.html)

```opcion-multiple
# Enunciado
Dos reintentos llevan la misma clave de operación. ¿Qué uso es coherente?

# Opciones
- Tratar cada intento como una compra distinta
- Reconocer que representan la misma intención lógica y evitar duplicar el efecto
- Cambiar la semántica del mensaje
- Ignorar cualquier validación

# Correcta
2

# Explicación
Una clave estable permite deduplicar intentos de una misma operación lógica.

# Pista
La misma intención debe conservar la misma identidad.
```

# Estado privado y estado compartido son diferentes

Un proveedor puede mantener datos internos que ningún consumidor observa directamente. Otros cambios sí forman parte del estado compartido relevante para varias partes.

La arquitectura debe identificar qué estado es observable mediante interacciones y qué detalles permanecen privados.

> Doc: [OASIS SOA-RM 1.0 — §3.2.3 Real World Effect and shared state](https://docs.oasis-open.org/soa-rm/v1.0/soa-rm.pdf#page=17)

```relacionar
# Enunciado
Clasifica cada ejemplo.

# Pares
- Índice interno de una tabla => estado privado
- Reserva visible para comprador y tienda => estado compartido
- Caché interna regenerable => estado privado
- Estado de una orden consultable por consumidor y proveedor => estado compartido

# Explicación
El criterio es si el estado forma parte de la realidad observable compartida entre participantes.

# Pista
Pregunta quién necesita observar ese estado.
```

# Reintentar exige una política explícita

Un sistema debe decidir qué errores son reintentables, cuántas veces, con qué espera y qué protección existe contra efectos duplicados. Reintentar sin límite puede amplificar una falla y aumentar carga sobre un proveedor degradado.

La política de reintentos pertenece al comportamiento de interacción, no a una excepción improvisada.

> Doc: [OASIS SOA-RAF 1.0 — §3.4.3 Policies and Contracts](https://docs.oasis-open.org/soa-rm/soa-ra/v1.0/cs01/soa-ra-v1.0-cs01.html)

```opcion-multiple
# Enunciado
¿Qué debe acompañar a una estrategia de reintentos?

# Opciones
- Criterios sobre errores reintentables, límites y control de duplicados
- Un bucle infinito
- La eliminación de timeouts
- La suposición de que toda falla es transitoria

# Correcta
1

# Explicación
Los reintentos necesitan condiciones y límites explícitos para no duplicar efectos ni agravar una degradación.

# Pista
Un reintento es una política, no una reacción sin límites.
```

# Cierre

La sesión conectó estado, efecto, incertidumbre, idempotencia y reintentos. La siguiente estudia dependencias, cohesión, acoplamiento y ownership.
