---
numero: 4
titulo: "Real World Effect y estado compartido"
---

# Toda interacción persigue un resultado

Una interacción con un servicio tiene un **propósito**. El consumidor utiliza el servicio porque intenta obtener algún resultado y el proveedor participa bajo condiciones y expectativas propias.

OASIS denomina **Real World Effect** al resultado efectivo asociado al uso del servicio. Pensar en el efecto obliga a mirar más allá de la invocación: el objetivo no es «enviar una solicitud», sino conseguir un resultado que tenga significado para los participantes.

> Doc: [OASIS SOA-RM 1.0 — §3.2.3 Real World Effect](https://docs.oasis-open.org/soa-rm/v1.0/soa-rm.pdf#page=18)

```opcion-multiple
# Enunciado
¿Cuál expresa mejor el propósito de una interacción desde la perspectiva del Real World Effect?

# Opciones
- Conseguir que se transmita un paquete por la red
- Obtener el resultado efectivo que motivó el uso del servicio
- Ejecutar necesariamente una operación síncrona
- Confirmar que el proveedor usa una tecnología específica

# Correcta
2

# Explicación
El Real World Effect es el resultado efectivo de utilizar el servicio. El transporte, la sincronía y la tecnología concreta son mecanismos posibles, no el propósito arquitectónico.

# Pista
Busca el resultado que justifica haber utilizado el servicio.
```

# Capacidad ofrecida y efecto obtenido no son lo mismo

Una **capacidad** representa un efecto que el proveedor es capaz de proporcionar. El **Real World Effect** es el resultado que efectivamente se obtiene al utilizar el servicio en una interacción concreta.

La diferencia es temporal y conceptual: una capacidad describe lo que puede proporcionarse; el efecto real describe lo que finalmente ocurrió como resultado del uso del servicio.

> Doc: [OASIS SOA-RM 1.0 — Glossary: Capability](https://docs.oasis-open.org/soa-rm/v1.0/soa-rm.pdf#page=28)
> Doc: [OASIS SOA-RM 1.0 — Glossary: Real world effect](https://docs.oasis-open.org/soa-rm/v1.0/soa-rm.pdf#page=29)

```relacionar
# Enunciado
Relaciona cada concepto con su significado.

# Pares
- Capacidad => efecto que un proveedor puede proporcionar
- Real World Effect => resultado efectivo obtenido al utilizar el servicio

# Explicación
La capacidad describe potencial; el Real World Effect describe el resultado efectivo de una interacción concreta.

# Pista
Distingue «puede producir» de «se produjo».
```

# Un efecto puede consistir en obtener información

El Real World Effect no requiere modificar una entidad. OASIS reconoce que el resultado puede ser simplemente una **respuesta informativa**.

Consultar disponibilidad, conocer un precio o recuperar el estado de una solicitud pueden constituir efectos reales cuando esa información es precisamente el resultado que el consumidor buscaba al utilizar el servicio.

> Doc: [OASIS SOA-RM 1.0 — §3.1 Service](https://docs.oasis-open.org/soa-rm/v1.0/soa-rm.pdf#page=12)
> Doc: [OASIS SOA-RM 1.0 — §3.2.3 Real World Effect](https://docs.oasis-open.org/soa-rm/v1.0/soa-rm.pdf#page=18)

```verdadero-falso
# Enunciado
Si una interacción solo devuelve información y no modifica ninguna entidad, entonces no puede producir un Real World Effect.

# Respuesta
falso

# Explicación
OASIS contempla como Real World Effect tanto una respuesta informativa como un cambio en el estado de entidades compartidas por los participantes.

# Pista
El efecto se define por el resultado obtenido, no por exigir una mutación.
```

# Un efecto también puede modificar el estado compartido

Otra forma de Real World Effect es un cambio en el estado de entidades relevantes para los participantes. La interacción puede crear, modificar o eliminar un hecho que las partes reconocen como parte de su relación.

El punto arquitectónico no es qué tabla, objeto o variable cambió internamente, sino qué hecho significativo cambió para los participantes como resultado del servicio.

> Doc: [OASIS SOA-RM 1.0 — §3.2.3 Real World Effect](https://docs.oasis-open.org/soa-rm/v1.0/soa-rm.pdf#page=18)

```opcion-multiple
# Enunciado
¿Cuál describe mejor un cambio de estado relevante como Real World Effect?

# Opciones
- El proveedor reorganiza una función privada sin cambiar nada observable
- Consumidor y proveedor pasan a reconocer que una reserva está confirmada
- El servidor actualiza una caché interna que nadie observa
- Un proceso privado cambia de nombre

# Correcta
2

# Explicación
El efecto arquitectónicamente relevante aparece en el estado compartido por los participantes, no en cambios internos que permanecen privados.

# Pista
Busca el hecho que ambas partes pueden reconocer después de la interacción.
```

# Shared state son hechos y compromisos compartidos

OASIS define **shared state** como el conjunto de hechos y compromisos que se manifiestan a los participantes como resultado de interactuar con un servicio.

No debe interpretarse automáticamente como una estructura de datos compartida. Es un concepto sobre información y compromisos comunes: aquello que las partes pueden considerar verdadero o acordado después de la interacción.

![Real World Effect y shared state](https://docs.oasis-open.org/soa-rm/v1.0/soa-rm_files/image015.jpg)

*Figura 7 de OASIS SOA-RM 1.0: la interacción produce un Real World Effect mediante cambios en el shared state.*

> Doc: [OASIS SOA-RM 1.0 — §3.2.3 Real World Effect](https://docs.oasis-open.org/soa-rm/v1.0/soa-rm.pdf#page=18)
> Doc: [OASIS SOA-RM 1.0 — Glossary: Shared state](https://docs.oasis-open.org/soa-rm/v1.0/soa-rm.pdf#page=30)

```opcion-multiple
# Enunciado
¿Qué describe mejor el shared state?

# Opciones
- Una base de datos que proveedor y consumidor deben compartir físicamente
- El conjunto de hechos y compromisos que se manifiestan a los participantes
- Todas las variables privadas de la implementación del proveedor
- La memoria RAM utilizada durante una solicitud

# Correcta
2

# Explicación
Shared state es una noción conceptual de hechos y compromisos compartidos. No exige una base de datos, memoria ni estructura de almacenamiento común.

# Pista
La definición se refiere a lo que las partes reconocen, no al lugar donde se almacena.
```

# Shared state no significa variables almacenadas en común

OASIS advierte expresamente que **shared state no se refiere necesariamente a variables de estado guardadas físicamente**. Lo compartido es la información acerca de las entidades afectadas.

En una reserva aérea, el hecho «existe un asiento reservado para esta persona en este vuelo» puede formar parte del estado compartido aunque pasajero y aerolínea no accedan a la misma base de datos y aunque cada uno mantenga información privada distinta.

> Doc: [OASIS SOA-RM 1.0 — §3.2.3 Real World Effect](https://docs.oasis-open.org/soa-rm/v1.0/soa-rm.pdf#page=18)

```verdadero-falso
# Enunciado
Para que exista shared state, proveedor y consumidor deben leer y escribir las mismas variables físicas en un almacenamiento común.

# Respuesta
falso

# Explicación
El estado compartido representa hechos y compromisos comunes. Las representaciones físicas y los estados internos de cada participante pueden ser completamente distintos.

# Pista
Distingue una verdad compartida de una implementación de almacenamiento compartido.
```

# Las acciones internas de los participantes son privadas

Las acciones internas que proveedor y consumidor realizan como consecuencia de una interacción son, por definición, **privadas**. OASIS señala que las otras partes no pueden verlas y que, además, no deberían necesitar conocimiento explícito de ellas.

Esta opacidad protege la independencia entre participantes. El consumidor razona sobre el servicio mediante información observable, compromisos y efectos compartidos, no mediante procedimientos internos del proveedor.

> Doc: [OASIS SOA-RM 1.0 — §3.2.3 Real World Effect](https://docs.oasis-open.org/soa-rm/v1.0/soa-rm.pdf#page=19)

```opcion-multiple
# Enunciado
¿Qué conocimiento debería necesitar un consumidor para depender correctamente del resultado de un servicio?

# Opciones
- Los procedimientos internos completos con los que el proveedor registra cada cambio
- Los hechos y compromisos observables que forman el estado compartido
- El esquema privado de todas las tablas del proveedor
- El código fuente de la implementación

# Correcta
2

# Explicación
El consumidor debe poder razonar sobre el estado compartido y el efecto observable. Las acciones internas del proveedor permanecen privadas.

# Pista
SOA busca reducir la dependencia respecto de la implementación interna.
```

# El ejemplo de la reserva separa hecho compartido de estado privado

OASIS utiliza una reserva aérea para mostrar la diferencia. Después de confirmar una reserva, aerolínea y pasajero comparten el hecho de que existe un asiento reservado. Ese hecho pertenece al **shared state**.

Sin embargo, la aerolínea puede mantener internamente inventario, registros contables y asignaciones de asientos; el pasajero puede mantener por su lado saldos, itinerarios o información personal. Esos estados privados no se convierten automáticamente en información compartida.

> Doc: [OASIS SOA-RM 1.0 — §3.2.3 Real World Effect](https://docs.oasis-open.org/soa-rm/v1.0/soa-rm.pdf#page=18)

```relacionar
# Enunciado
Relaciona cada información de una reserva con su categoría.

# Pares
- Existe una reserva confirmada entre pasajero y aerolínea => Shared state
- El mecanismo interno con que la aerolínea persiste la reserva => Estado privado del proveedor
- El saldo personal que el pasajero mantiene fuera de la interacción => Estado privado del consumidor

# Explicación
El hecho de la reserva puede ser común a las partes mientras que sus mecanismos y estados internos continúan siendo privados.

# Pista
Pregunta qué hecho necesita ser reconocido por ambos participantes.
```

# El efecto real acumula cambios en el shared state

Las acciones de los participantes pueden modificar el shared state. OASIS describe el **Real World Effect** de una interacción como la acumulación de los cambios producidos en ese estado compartido.

Esto permite razonar sobre resultados sin exigir conocimiento de cada paso interno. Si la interacción crea el hecho compartido de que una reserva existe, ese cambio forma parte del efecto real aunque cada participante haya realizado procesos privados diferentes.

> Doc: [OASIS SOA-RM 1.0 — §3.2.3 Real World Effect](https://docs.oasis-open.org/soa-rm/v1.0/soa-rm.pdf#page=19)

```ordenar
# Enunciado
Ordena la relación conceptual desde el uso del servicio hasta el resultado observable.

# Elementos
- El shared state refleja nuevos hechos o compromisos
- Los participantes interactúan con el servicio
- Se produce el Real World Effect

# Orden
2, 1, 3

# Explicación
La interacción produce cambios relevantes en los hechos compartidos; la acumulación de esos cambios constituye el Real World Effect.

# Pista
Primero ocurre la interacción, después cambia lo que las partes reconocen como compartido.
```

# Los hechos compartidos permiten inferencias posteriores

Los participantes y terceros interesados pueden realizar inferencias a partir de hechos compartidos. Si existe el hecho común de que una reserva está confirmada, acciones posteriores pueden apoyarse en ese hecho sin conocer cómo fue almacenado internamente.

La utilidad del shared state está precisamente en ofrecer una base observable sobre la que otras decisiones pueden apoyarse. La inferencia depende también del contexto y de otras condiciones aplicables.

> Doc: [OASIS SOA-RM 1.0 — §3.2.3 Real World Effect](https://docs.oasis-open.org/soa-rm/v1.0/soa-rm.pdf#page=19)

```verdadero-falso
# Enunciado
Un participante puede utilizar un hecho compartido como base para decisiones posteriores sin conocer necesariamente los procedimientos internos que lo produjeron.

# Respuesta
verdadero

# Explicación
Los hechos del shared state pueden servir de base para inferencias posteriores. La implementación interna que produjo esos hechos permanece privada.

# Pista
El estado compartido existe precisamente para que las partes puedan reconocer resultados comunes.
```

# El shared state debe poder inferirse de la interacción y su contexto

OASIS establece una relación fuerte entre el estado compartido y las interacciones que conducen a él. Los elementos del shared state deberían poder inferirse a partir de la interacción previa junto con el contexto necesario.

Eso no significa que cada hecho tenga que quedar físicamente registrado. El estándar señala que el registro no es un requisito conceptual, aunque la ausencia de registro puede dificultar una auditoría posterior.

> Doc: [OASIS SOA-RM 1.0 — §3.2.3 Real World Effect](https://docs.oasis-open.org/soa-rm/v1.0/soa-rm.pdf#page=19)

```opcion-multiple
# Enunciado
¿Qué afirma OASIS sobre registrar físicamente cada elemento del shared state?

# Opciones
- Es obligatorio para que el estado pueda considerarse compartido
- No es conceptualmente obligatorio, aunque no registrarlo puede dificultar la auditoría
- Está prohibido porque el estado compartido debe ser solo temporal
- Solo puede registrarse del lado del consumidor

# Correcta
2

# Explicación
El shared state es un concepto de hechos y compromisos. Su registro físico no es requisito del modelo, aunque puede ser necesario para necesidades operativas como auditoría.

# Pista
Distingue existencia conceptual de persistencia técnica.
```

# La dinámica completa une visibilidad, interacción y efecto

Las tres piezas estudiadas en estas sesiones forman una secuencia conceptual coherente:

| Concepto | Pregunta principal |
|---|---|
| Visibilidad | ¿Pueden proveedor y consumidor llegar a interactuar? |
| Interacción | ¿Qué acciones e información participan en el uso del servicio? |
| Real World Effect | ¿Qué resultado efectivo queda como consecuencia? |

Separarlas permite diagnosticar problemas con precisión. Un fallo de awareness no es un problema de semántica; una interpretación semántica incorrecta no es un fallo de reachability; y una interacción técnicamente exitosa no garantiza que se haya obtenido el efecto deseado.

> Doc: [OASIS SOA-RM 1.0 — §3.2 Dynamics of Services](https://docs.oasis-open.org/soa-rm/v1.0/soa-rm.pdf#page=13)
> Doc: [OASIS SOA-RM 1.0 — §3.2.3 Real World Effect](https://docs.oasis-open.org/soa-rm/v1.0/soa-rm.pdf#page=18)

```relacionar
# Enunciado
Relaciona cada pregunta con el concepto dinámico que la responde.

# Pares
- ¿Las partes pueden llegar a interactuar? => Visibilidad
- ¿Qué información y acciones forman el uso del servicio? => Interacción
- ¿Qué resultado efectivo produjo ese uso? => Real World Effect

# Explicación
La dinámica de servicios se entiende separando condición de interacción, interacción misma y resultado efectivo.

# Pista
Piensa en antes, durante y después del uso del servicio.
```

# Cierre

Con el **Real World Effect** queda completa la dinámica básica del servicio en el SOA Reference Model: visibilidad, interacción y efecto. El resultado arquitectónicamente relevante puede ser información o una modificación de hechos y compromisos compartidos, sin obligar al consumidor a conocer la implementación privada que lo produjo.

La siguiente sesión del curso pasa de la dinámica de uso a la información **acerca del servicio**: la service description y los elementos que permiten decidir si un servicio existe, qué hace y cómo puede utilizarse.
