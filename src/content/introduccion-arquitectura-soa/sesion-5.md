---
numero: 5
titulo: "Descripción del servicio"
---

# Los conceptos «acerca del servicio» sostienen su uso

Después de estudiar la dinámica de un servicio —visibilidad, interacción y Real World Effect— OASIS introduce un segundo grupo de conceptos que describen **aspectos acerca del servicio mismo**. Entre ellos están la **service description**, las políticas y contratos relacionados con el servicio y el execution context.

La descripción no reemplaza al servicio ni a su implementación. Su función es exponer la información que otros participantes necesitan para considerar el servicio, decidir si les resulta adecuado y utilizarlo correctamente.

![Conceptos acerca de los servicios](https://docs.oasis-open.org/soa-rm/v1.0/soa-rm_files/image017.png)

*Figura 8 de OASIS SOA-RM 1.0: service description, policies and contracts y execution context como conceptos acerca de los servicios.*

> Doc: [OASIS SOA-RM 1.0 — §3.3 About services](https://docs.oasis-open.org/soa-rm/v1.0/soa-rm.pdf#page=19)

```relacionar
# Enunciado
Relaciona cada concepto «acerca del servicio» con lo que describe principalmente.

# Pares
- Service description => información necesaria para considerar o utilizar el servicio
- Policies and contracts => condiciones, restricciones y acuerdos relacionados con su uso
- Execution context => elementos técnicos y de negocio que forman el camino de una interacción concreta

# Explicación
OASIS separa estos conceptos porque describir un servicio, establecer sus condiciones y materializar una interacción concreta son responsabilidades distintas.

# Pista
Piensa en información, condiciones y contexto de ejecución.
```

# La service description contiene la información necesaria para usar o considerar un servicio

La **service description** es la información necesaria para **utilizar o considerar utilizar** un servicio. No es solamente documentación para desarrolladores ni una descripción comercial: reúne información relevante para que un posible consumidor pueda evaluar la relación entre su necesidad y la capacidad ofrecida.

OASIS señala que SOA suele estar acompañada por una cantidad importante de documentación y descripción porque los participantes pueden pertenecer a dominios de propiedad diferentes y no compartir conocimiento interno.

> Doc: [OASIS SOA-RM 1.0 — §3.3.1 Service description](https://docs.oasis-open.org/soa-rm/v1.0/soa-rm.pdf#page=20)
> Doc: [OASIS SOA-RM 1.0 — Glossary: Service description](https://docs.oasis-open.org/soa-rm/v1.0/soa-rm.pdf#page=30)

```opcion-multiple
# Enunciado
¿Cuál describe mejor una service description según OASIS?

# Opciones
- El código fuente completo con el que se implementa el servicio
- La información necesaria para utilizar o considerar utilizar el servicio
- Un registro obligatorio de todas las acciones privadas del proveedor
- Una lista fija de tecnologías permitidas en SOA

# Correcta
2

# Explicación
La service description reúne la información necesaria para evaluar y utilizar el servicio sin exigir conocimiento de su implementación privada.

# Pista
La descripción debe ayudar al consumidor a decidir y a interactuar.
```

# No existe una única descripción correcta para todos los contextos

OASIS advierte que normalmente no existe una única **«descripción correcta»** de un servicio. Los elementos necesarios dependen del contexto y de las necesidades de quienes utilizan la entidad descrita.

Algunos elementos, especialmente el information model, suelen ser relevantes de forma general. Otros, como determinadas funciones, políticas o detalles operativos, pueden variar según el consumidor, el dominio o el propósito de la descripción.

Esto permite que una misma capacidad tenga descripciones apropiadas para públicos distintos sin asumir que toda información concebible debe incorporarse en un documento monolítico.

> Doc: [OASIS SOA-RM 1.0 — §3.3.1 Service description](https://docs.oasis-open.org/soa-rm/v1.0/soa-rm.pdf#page=20)

```verdadero-falso
# Enunciado
OASIS exige que todo servicio tenga una única descripción universal con exactamente los mismos elementos para cualquier consumidor y contexto.

# Respuesta
falso

# Explicación
Los elementos necesarios de la descripción dependen del contexto y de las necesidades de las partes. No existe necesariamente una única descripción correcta para todos los usos.

# Pista
La información útil para un consumidor puede no ser idéntica a la que necesita otro.
```

# La descripción facilita visibilidad e interacción

El propósito central de la descripción es facilitar **visibilidad** e **interacción**, especialmente cuando los participantes están bajo dominios de propiedad diferentes.

Una descripción permite que posibles consumidores comparen alternativas, determinen si una capacidad satisface sus necesidades, conozcan cómo acceder al servicio y comprendan suficiente información para construir sistemas compatibles con él.

La descripción también puede apoyar tareas de gestión desde la perspectiva tanto del proveedor como del consumidor.

![Elementos de la descripción de un servicio](https://docs.oasis-open.org/soa-rm/v1.0/soa-rm_files/image018.png)

*Figura 9 de OASIS SOA-RM 1.0: elementos asociados a la service description.*

> Doc: [OASIS SOA-RM 1.0 — §3.3.1 Service description](https://docs.oasis-open.org/soa-rm/v1.0/soa-rm.pdf#page=20)

```opcion-multiple
# Enunciado
Dos proveedores ofrecen capacidades similares. ¿Qué papel cumple la descripción para un consumidor potencial?

# Opciones
- Revelar obligatoriamente la implementación interna de ambos proveedores
- Permitir comparar opciones y determinar cuál servicio puede satisfacer su necesidad
- Eliminar la necesidad de cualquier interacción
- Convertir ambos servicios en una única implementación

# Correcta
2

# Explicación
La descripción permite discriminar entre posibles servicios, conocer sus capacidades, condiciones y mecanismos de acceso y decidir cuál resulta apropiado.

# Pista
La descripción ayuda a elegir antes de interactuar.
```

# Un formato estándar y referenciable favorece el procesamiento común

OASIS recomienda que la service description se represente mediante un formato **estándar y referenciable**. La razón no es imponer una tecnología concreta, sino facilitar herramientas comunes que puedan procesar descripciones, por ejemplo mecanismos de descubrimiento.

«Referenciable» también permite que partes de la descripción vivan en recursos externos reutilizables. Una política, definición semántica o especificación común puede ser referenciada en vez de duplicarse dentro de cada descripción.

> Nota: El Reference Model no prescribe WSDL, OpenAPI ni otro formato concreto en esta sección. Esos formatos pueden ser realizaciones particulares del principio.

> Doc: [OASIS SOA-RM 1.0 — §3.3.1 Service description](https://docs.oasis-open.org/soa-rm/v1.0/soa-rm.pdf#page=20)

```verdadero-falso
# Enunciado
Cuando OASIS recomienda un formato estándar y referenciable para la descripción, está exigiendo específicamente utilizar WSDL.

# Respuesta
falso

# Explicación
El Reference Model recomienda propiedades del formato, pero no prescribe aquí una tecnología de descripción concreta.

# Pista
Distingue una propiedad deseable de una implementación específica.
```

# La descripción debe permitir saber que el servicio existe y es alcanzable

Un consumidor necesita saber **que el servicio existe y que puede alcanzarlo**. La service description debería contener datos suficientes para que proveedor y consumidor puedan establecer una interacción.

OASIS indica que esa información puede incluir metadatos como la localización del servicio y los protocolos de información soportados o requeridos. También puede contener información dinámica, como si el servicio está actualmente disponible.

Reachability continúa siendo una relación entre participantes. Una ubicación publicada por sí sola no garantiza que cualquier consumidor pueda alcanzar el servicio.

> Doc: [OASIS SOA-RM 1.0 — §3.3.1 Service description](https://docs.oasis-open.org/soa-rm/v1.0/soa-rm.pdf#page=20)
> Doc: [OASIS SOA-RM 1.0 — §3.3.1.1 Service Reachability](https://docs.oasis-open.org/soa-rm/v1.0/soa-rm.pdf#page=20)

```opcion-multiple
# Enunciado
¿Cuál sería información pertinente para describir la reachability de un servicio?

# Opciones
- La localización mediante la que puede accederse al servicio y los protocolos que soporta
- El nombre de cada variable privada utilizada internamente
- El historial profesional del equipo desarrollador
- El código fuente del algoritmo subyacente

# Correcta
1

# Explicación
La descripción de reachability puede incluir localización, protocolos soportados o requeridos e incluso información dinámica de disponibilidad.

# Pista
Busca información que permita establecer efectivamente una interacción.
```

# La descripción debe expresar inequívocamente la funcionalidad

La service description debería expresar de forma **no ambigua** qué función o funciones proporciona el servicio y qué Real World Effects resultan de su invocación.

La funcionalidad puede describirse mediante texto comprensible para personas, identificadores, palabras clave o referencias a definiciones procesables por máquinas. La forma concreta puede variar, pero el consumidor debe poder determinar qué consigue utilizando el servicio.

> Doc: [OASIS SOA-RM 1.0 — §3.3.1.2 Service Functionality](https://docs.oasis-open.org/soa-rm/v1.0/soa-rm.pdf#page=20)

```relacionar
# Enunciado
Relaciona cada pregunta con el elemento de la descripción que debe responderla.

# Pares
- ¿Qué hace el servicio? => Functionality
- ¿Qué resultado efectivo se espera al utilizarlo? => Real World Effect
- ¿Cómo puede alcanzarse? => Reachability

# Explicación
Una descripción útil debe permitir saber qué función se ofrece, qué efecto produce y cómo puede establecerse una interacción.

# Pista
Separa propósito, resultado y acceso.
```

# Las suposiciones técnicas pueden limitar la funcionalidad expuesta

La descripción de funcionalidad puede incluir **suposiciones técnicas** que delimitan la capacidad tal como se expone mediante un servicio.

OASIS utiliza un cajero automático como ejemplo. La institución financiera posee capacidades más amplias, pero la interfaz del ATM impone límites coherentes con el usuario previsto: cantidades de retiro determinadas, límites de transacciones y otras restricciones. Esos límites pertenecen al servicio expuesto, no necesariamente a la capacidad subyacente completa.

Si las suposiciones sobre el consumidor no se cumplen, puede ser necesario utilizar otro servicio para acceder a la misma capacidad.

> Doc: [OASIS SOA-RM 1.0 — §3.3.1.2 Service Functionality](https://docs.oasis-open.org/soa-rm/v1.0/soa-rm.pdf#page=20)

```opcion-multiple
# Enunciado
Una institución puede transferir cantidades muy grandes, pero su servicio para usuarios individuales limita cada operación a S/ 2 000. ¿Qué representa mejor ese límite?

# Opciones
- Una prueba de que la institución carece de una capacidad mayor
- Una suposición o límite de la funcionalidad expuesta por ese servicio
- Una obligación de que toda SOA tenga operaciones pequeñas
- Una propiedad del Reference Model que fija montos máximos

# Correcta
2

# Explicación
La capacidad subyacente puede ser más amplia que la funcionalidad expuesta. El servicio puede imponer límites coherentes con sus usuarios y su interfaz.

# Pista
Distingue la capacidad total del proveedor de la parte que expone un servicio particular.
```

# La descripción puede asociar políticas al servicio

Una service description puede incluir o referenciar **políticas** para que un posible consumidor evalúe si el servicio actuará de forma compatible con sus propias restricciones.

En esta sesión interesa el papel descriptivo: la descripción hace visibles condiciones relevantes. La semántica completa de policy assertion, policy owner y enforcement se desarrolla en la siguiente sesión.

> Doc: [OASIS SOA-RM 1.0 — §3.3.1.3 Policies Related to a Service](https://docs.oasis-open.org/soa-rm/v1.0/soa-rm.pdf#page=21)

```verdadero-falso
# Enunciado
Una service description puede referenciar políticas para que un consumidor valore si las condiciones del servicio son compatibles con sus necesidades.

# Respuesta
verdadero

# Explicación
OASIS contempla explícitamente asociar políticas a la descripción para que consumidores potenciales puedan evaluar las condiciones aplicables.

# Pista
La descripción no solo explica función y acceso; también puede exponer condiciones.
```

# La service interface es el medio para interactuar con el servicio

La **service interface** es el medio mediante el cual se interactúa con un servicio. Incluye protocolos, comandos e intercambios de información mediante los que se inician acciones que producen los efectos descritos por la funcionalidad del servicio.

La interfaz prescribe qué información debe proporcionar el consumidor para acceder a las capacidades y cómo interpretar las respuestas. Esa información se relaciona directamente con el information model estudiado en la sesión 3.

> Doc: [OASIS SOA-RM 1.0 — §3.3.1.4 Service Interface](https://docs.oasis-open.org/soa-rm/v1.0/soa-rm.pdf#page=21)
> Doc: [OASIS SOA-RM 1.0 — Glossary: Service Interface](https://docs.oasis-open.org/soa-rm/v1.0/soa-rm.pdf#page=30)

```opcion-multiple
# Enunciado
¿Qué describe mejor una service interface?

# Opciones
- El medio mediante el que se accede a las capacidades del servicio y se interactúa con él
- Todos los detalles de la implementación privada del proveedor
- La estructura organizacional de la empresa
- Únicamente el nombre comercial del servicio

# Correcta
1

# Explicación
La interfaz contiene los medios prescritos para iniciar acciones e intercambiar la información necesaria con el servicio.

# Pista
La interfaz es la frontera de interacción, no la implementación interna.
```

# Una interfaz accesible es fundamental, pero su tecnología queda fuera del modelo

OASIS considera fundamentales para SOA la **existencia de interfaces** y la disponibilidad de descripciones accesibles de esas interfaces.

Sin embargo, el Reference Model no fija el formato concreto de la interfaz ni determina cómo el consumidor obtiene su definición o cómo accede físicamente al servicio. Para que el servicio sea utilizable, la representación de la interfaz debe poder ser interpretada por sus consumidores.

> Doc: [OASIS SOA-RM 1.0 — §3.3.1.4 Service Interface](https://docs.oasis-open.org/soa-rm/v1.0/soa-rm.pdf#page=21)

```verdadero-falso
# Enunciado
El SOA Reference Model prescribe una sintaxis concreta y única para todas las service interfaces.

# Respuesta
falso

# Explicación
OASIS exige que la interfaz pueda interpretarse y considera fundamental su descripción accesible, pero deja los detalles del formato fuera del alcance del Reference Model.

# Pista
El modelo define requisitos conceptuales, no una sintaxis tecnológica universal.
```

# Los detalles de la descripción pueden vivir en referencias externas

Los elementos importantes de la descripción deberían estar representados, pero OASIS no exige que todos sus detalles estén escritos explícitamente dentro de un único artefacto.

La descripción puede **referenciar fuentes externas**. Esto permite reutilizar definiciones estándar de funcionalidad, políticas, vocabularios u otros elementos sin duplicarlos en cada servicio.

La composición mediante referencias también hace posible que distintas partes de una descripción evolucionen bajo responsabilidades diferentes.

> Doc: [OASIS SOA-RM 1.0 — §3.3.1 Service description](https://docs.oasis-open.org/soa-rm/v1.0/soa-rm.pdf#page=20)

```verdadero-falso
# Enunciado
Todos los detalles sobre un servicio deben estar incorporados literalmente dentro de un único documento para que su descripción sea válida.

# Respuesta
falso

# Explicación
OASIS permite incluir detalles mediante referencias a fuentes externas y así reutilizar definiciones estándar de funcionalidad, políticas u otros elementos.

# Pista
Una descripción puede componerse mediante enlaces a definiciones compartidas.
```

# Ninguna descripción puede capturar toda la semántica

OASIS reconoce límites teóricos en la capacidad de describir un servicio de manera completa y absolutamente inequívoca. Siempre existen **suposiciones no expresadas** que el autor y el lector deben compartir implícitamente.

Este límite existe tanto en descripciones para personas como en formatos procesables por máquinas. La meta práctica no es capturar toda información concebible, sino alcanzar suficiente alcance y precisión para soportar el uso previsto.

> Doc: [OASIS SOA-RM 1.0 — §3.3.1.5 The Limits of Description](https://docs.oasis-open.org/soa-rm/v1.0/soa-rm.pdf#page=21)

```opcion-multiple
# Enunciado
¿Qué exige OASIS frente a los límites inevitables de una descripción?

# Opciones
- Precisión absoluta sobre cada posible significado y consecuencia
- Suficiente alcance y precisión para soportar el uso previsto
- Eliminar por completo todas las suposiciones implícitas
- Describir toda la implementación privada

# Correcta
2

# Explicación
OASIS reconoce que una descripción completa y absolutamente inequívoca es imposible. Lo requerido es suficiente precisión para el uso previsto.

# Pista
La meta es utilidad adecuada, no omnisciencia descriptiva.
```

# Buscar descripciones no garantiza una única respuesta

Incluso con buenas descripciones y consultas detalladas, una búsqueda puede devolver **cero, una o varias respuestas**. Esa incertidumbre es inherente al acto de buscar.

Cuando existen varias coincidencias, convertirlas en una única elección es una decisión privada del consumidor de la información. El Reference Model no prescribe una función universal de ranking ni declara que toda búsqueda deba producir exactamente un servicio.

> Doc: [OASIS SOA-RM 1.0 — §3.3.1.5 The Limits of Description](https://docs.oasis-open.org/soa-rm/v1.0/soa-rm.pdf#page=21)

```opcion-multiple
# Enunciado
Una búsqueda encuentra tres servicios cuyas descripciones satisfacen los criterios del consumidor. Según OASIS, ¿quién debe convertir ese conjunto en una elección concreta?

# Opciones
- El Reference Model mediante un ranking obligatorio
- El consumidor de la información mediante una elección privada
- El primer proveedor que responda
- El protocolo de transporte de forma automática

# Correcta
2

# Explicación
La búsqueda puede devolver varias coincidencias. Elegir una de ellas es una decisión privada del consumidor de la información.

# Pista
El Reference Model no impone una estrategia universal de selección.
```

# Cierre

Una **service description** hace posible considerar y utilizar un servicio sin exigir acceso a su implementación privada. Debe aportar suficiente información sobre existencia y reachability, funcionalidad y Real World Effects, condiciones y políticas, y la interfaz mediante la que se interactúa.

La descripción puede estar distribuida mediante referencias y puede ser procesable por herramientas, pero nunca captura toda la semántica posible. La siguiente sesión profundiza en dos conceptos que la descripción puede referenciar pero que no son equivalentes: **policies** y **contracts**.
