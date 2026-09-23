---
numero: 2
titulo: "Visibilidad entre proveedor y consumidor"
---

# La dinámica de un servicio empieza antes de la interacción

Desde una perspectiva dinámica, OASIS separa tres conceptos fundamentales: **visibilidad**, **interacción** y **Real World Effect**. La interacción no aparece de forma aislada. Antes de utilizar un servicio, proveedor y consumidor tienen que encontrarse en una relación que permita que la interacción llegue a ocurrir; después de la interacción aparece un efecto real.

Esta separación evita confundir tres preguntas distintas: si las partes pueden llegar a interactuar, qué hacen durante la interacción y qué resultado produce finalmente el uso del servicio.

![Conceptos alrededor de la dinámica de un servicio](https://docs.oasis-open.org/soa-rm/v1.0/soa-rm_files/image010.png)

*Figura 4 de OASIS SOA-RM 1.0: visibilidad, interacción y Real World Effect como conceptos de la dinámica de servicios.*

> Doc: [OASIS SOA-RM 1.0 — §3.2 Dynamics of Services](https://docs.oasis-open.org/soa-rm/v1.0/soa-rm.pdf#page=13)

```ordenar
# Enunciado
Ordena los tres conceptos dinámicos desde la condición previa hasta el resultado producido por usar el servicio.

# Elementos
- Real World Effect
- Visibilidad
- Interacción

# Orden
2, 3, 1

# Explicación
La visibilidad permite que los participantes estén en condiciones de interactuar; la interacción utiliza el servicio; el Real World Effect es el resultado efectivo de ese uso.

# Pista
Primero debe ser posible encontrarse e interactuar; el efecto aparece después.
```

# Visibilidad significa poder llegar a interactuar

La **visibilidad** es la capacidad de quienes tienen necesidades y quienes tienen capacidades para poder interactuar entre sí. OASIS la trata como una condición esencial porque en SOA los participantes pueden estar distribuidos y bajo dominios de propiedad diferentes.

Que un servicio exista no significa automáticamente que sea visible para un consumidor. Un consumidor puede desconocer su existencia, una de las partes puede no estar dispuesta a interactuar o puede no existir un camino que permita la comunicación.

![Conceptos que componen la visibilidad](https://docs.oasis-open.org/soa-rm/v1.0/soa-rm_files/image011.png)

*Figura 5 de OASIS SOA-RM 1.0: awareness, willingness y reachability como aspectos de la visibilidad.*

> Doc: [OASIS SOA-RM 1.0 — §3.2.1 Visibility](https://docs.oasis-open.org/soa-rm/v1.0/soa-rm.pdf#page=13)
> Doc: [OASIS SOA-RM 1.0 — Glossary: Visibility](https://docs.oasis-open.org/soa-rm/v1.0/soa-rm.pdf#page=30)

```opcion-multiple
# Enunciado
Un servicio está implementado y operativo, pero un consumidor no tiene forma de saber que existe. ¿Qué falta primero desde la perspectiva de visibilidad?

# Opciones
- Real World Effect
- Awareness
- Process model
- Shared state

# Correcta
2

# Explicación
La visibilidad requiere que los participantes dispongan de información que les permita conocer la existencia de la otra parte. Ese aspecto se denomina awareness.

# Pista
El problema no es todavía de comunicación física, sino de conocimiento.
```

# Awareness es conocimiento de la existencia de la otra parte

**Awareness** es el estado en el que una parte tiene conocimiento de la existencia de la otra. Para iniciar una interacción, el iniciador debe disponer de información suficiente para conocer al posible respondedor.

OASIS distingue este conocimiento de las demás condiciones. Saber que un proveedor existe no demuestra que esté dispuesto a interactuar ni que exista un camino de comunicación hasta él.

> Doc: [OASIS SOA-RM 1.0 — §3.2.1.1 Awareness](https://docs.oasis-open.org/soa-rm/v1.0/soa-rm.pdf#page=14)
> Doc: [OASIS SOA-RM 1.0 — Glossary: Awareness](https://docs.oasis-open.org/soa-rm/v1.0/soa-rm.pdf#page=28)

```verdadero-falso
# Enunciado
Si un consumidor conoce la existencia de un proveedor, entonces ya puede afirmarse que el proveedor es alcanzable y está dispuesto a interactuar.

# Respuesta
falso

# Explicación
Awareness solo establece conocimiento de existencia. OASIS indica expresamente que no implica willingness ni reachability.

# Pista
Las tres dimensiones de visibilidad son independientes.
```

# El descubrimiento es una forma de adquirir awareness

OASIS denomina **discovery** al proceso mediante el que una parte obtiene información que conduce al awareness. El mecanismo concreto queda fuera del modelo de referencia: puede ser automatizado, manual, basado en registros, catálogos, documentación u otros medios.

Lo importante en este nivel es el resultado conceptual: el consumidor dispone de información suficiente para conocer que existe un posible proveedor o servicio relevante.

> Nota: Un registro de servicios puede implementar discovery, pero SOA no exige un producto de registry concreto. El mecanismo tecnológico se estudia en niveles posteriores.

> Doc: [OASIS SOA-RM 1.0 — §3.2.1.1 Awareness](https://docs.oasis-open.org/soa-rm/v1.0/soa-rm.pdf#page=14)

```opcion-multiple
# Enunciado
¿Cuál describe correctamente discovery dentro del SOA Reference Model?

# Opciones
- Es obligatoriamente una consulta a un UDDI Registry
- Es el proceso por el que una parte obtiene información que conduce al awareness
- Es el intercambio de mensajes durante la ejecución del servicio
- Es el efecto real que queda después de utilizar el servicio

# Correcta
2

# Explicación
OASIS define discovery por su función: adquirir información que permite awareness. El modelo no obliga a utilizar un mecanismo tecnológico específico.

# Pista
Distingue el objetivo conceptual del producto que podría implementarlo.
```

# Awareness puede existir antes de conocer todos los detalles del servicio

Conocer que un servicio o proveedor existe no significa poseer ya toda la información necesaria para utilizarlo. El awareness puede surgir a partir de información parcial y luego conducir a información adicional sobre el servicio.

Esta separación es importante porque descubrir una opción potencial y estar preparado para invocarla son problemas diferentes. La descripción del servicio, que se estudiará más adelante, aporta información necesaria para considerar o utilizar el servicio.

> Doc: [OASIS SOA-RM 1.0 — §3.2.1.1 Awareness](https://docs.oasis-open.org/soa-rm/v1.0/soa-rm.pdf#page=14)
> Doc: [OASIS SOA-RM 1.0 — §3.3.1 Service description](https://docs.oasis-open.org/soa-rm/v1.0/soa-rm.pdf#page=20)

```verdadero-falso
# Enunciado
Awareness exige que el consumidor conozca de antemano todos los detalles de implementación interna del proveedor.

# Respuesta
falso

# Explicación
Awareness exige conocimiento de la existencia de la otra parte. Los detalles necesarios para considerar o utilizar un servicio pertenecen a su descripción, y la implementación interna no necesita exponerse.

# Pista
Conocer que algo existe no equivale a conocer cómo está construido internamente.
```

# Willingness es la predisposición a interactuar

**Willingness** es la predisposición de proveedores y consumidores a participar en interacciones de servicio. La existencia de awareness no obliga a ninguna de las partes a aceptar una interacción.

La disposición a interactuar puede depender de políticas. Un proveedor puede ofrecer su servicio únicamente a ciertos consumidores, en determinados horarios, bajo determinadas condiciones contractuales o sujeto a otros requisitos.

> Doc: [OASIS SOA-RM 1.0 — §3.2.1.2 Willingness](https://docs.oasis-open.org/soa-rm/v1.0/soa-rm.pdf#page=14)
> Doc: [OASIS SOA-RM 1.0 — Glossary: Willingness](https://docs.oasis-open.org/soa-rm/v1.0/soa-rm.pdf#page=30)

```opcion-multiple
# Enunciado
Un consumidor conoce un servicio y puede comunicarse con él, pero el proveedor solo interactúa con organizaciones previamente autorizadas. ¿Qué aspecto determina si el proveedor participará?

# Opciones
- Awareness
- Willingness
- Real World Effect
- Information model

# Correcta
2

# Explicación
La política de aceptación afecta la predisposición del proveedor a interactuar y, por tanto, su willingness.

# Pista
El problema no es conocer al proveedor ni poder alcanzarlo.
```

# Estar dispuesto a interactuar no obliga a realizar la acción solicitada

OASIS hace una distinción precisa: **willingness to interact** no equivale a voluntad de ejecutar la acción pedida. Un proveedor puede estar completamente dispuesto a recibir, interpretar y responder una solicitud y, aun así, rechazar la operación solicitada.

Por ejemplo, una solicitud puede llegar correctamente al servicio, ser procesada y terminar con una respuesta de rechazo porque no satisface una condición. Hubo interacción; lo que no hubo fue aceptación de la acción solicitada.

> Doc: [OASIS SOA-RM 1.0 — §3.2.1.2 Willingness](https://docs.oasis-open.org/soa-rm/v1.0/soa-rm.pdf#page=14)

```verdadero-falso
# Enunciado
Si un proveedor rechaza una operación solicitada, entonces necesariamente carecía de willingness para interactuar.

# Respuesta
falso

# Explicación
El proveedor puede estar dispuesto a interactuar y responder, pero rechazar legítimamente la acción solicitada por reglas, políticas o condiciones del servicio.

# Pista
Interactuar y conceder lo solicitado son dos decisiones diferentes.
```

# Las políticas pueden condicionar willingness

La predisposición a interactuar puede estar gobernada por **políticas**. OASIS señala que esas políticas pueden estar documentadas en la descripción del servicio.

Una política puede expresar obligaciones, restricciones u otras condiciones de uso. En este punto interesa su relación con visibilidad: incluso cuando existe awareness y reachability, una política puede determinar que una de las partes no esté dispuesta a mantener cierta interacción.

> Doc: [OASIS SOA-RM 1.0 — §3.2.1.2 Willingness](https://docs.oasis-open.org/soa-rm/v1.0/soa-rm.pdf#page=14)
> Doc: [OASIS SOA-RM 1.0 — §3.3.2 Policies and Contracts](https://docs.oasis-open.org/soa-rm/v1.0/soa-rm.pdf#page=22)

```relacionar
# Enunciado
Relaciona cada situación con el concepto que describe mejor el problema.

# Pares
- El consumidor no sabe que el servicio existe => Awareness
- El proveedor no acepta interactuar con ese consumidor => Willingness
- No existe un camino de comunicación entre ambos => Reachability

# Explicación
Los tres problemas afectan la visibilidad, pero cada uno corresponde a una condición diferente: conocimiento, predisposición o posibilidad efectiva de comunicación.

# Pista
Pregunta en cada caso si falta saber, querer o poder comunicarse.
```

# Reachability exige un camino que permita la interacción

**Reachability** es la relación en la que los participantes pueden interactuar, posiblemente mediante intercambio de información. OASIS la considera un prerrequisito esencial: los participantes deben poder comunicarse de alguna forma.

Un consumidor puede conocer al proveedor y querer utilizarlo, pero si no existe un camino de comunicación entre ambos el servicio no es efectivamente visible para ese consumidor.

> Doc: [OASIS SOA-RM 1.0 — §3.2.1.3 Reachability](https://docs.oasis-open.org/soa-rm/v1.0/soa-rm.pdf#page=15)
> Doc: [OASIS SOA-RM 1.0 — Glossary: Reachability](https://docs.oasis-open.org/soa-rm/v1.0/soa-rm.pdf#page=29)

```opcion-multiple
# Enunciado
El consumidor conoce el servicio, el proveedor está dispuesto a interactuar y ambos conocen el formato de la solicitud, pero una interrupción de red elimina todo camino de comunicación. ¿Qué condición falla?

# Opciones
- Awareness
- Willingness
- Reachability
- Semantics

# Correcta
3

# Explicación
La información y la predisposición existen, pero los participantes no pueden comunicarse. Eso es una pérdida de reachability.

# Pista
La condición fallida responde a la pregunta «¿pueden alcanzarse?».
```

# Reachability no prescribe un protocolo concreto

El modelo de referencia exige que exista la posibilidad de interacción, pero no impone que esa posibilidad adopte una tecnología determinada. Un camino puede incluir redes, intermediarios, infraestructura o mecanismos que no son relevantes para la definición abstracta.

Por eso reachability no significa específicamente «tener una URL HTTP», «abrir un puerto TCP» o «usar un bus». Esas son realizaciones tecnológicas posibles de una condición más general.

> Doc: [OASIS SOA-RM 1.0 — §3.2.1.3 Reachability](https://docs.oasis-open.org/soa-rm/v1.0/soa-rm.pdf#page=15)

```verdadero-falso
# Enunciado
Para que exista reachability en SOA, OASIS exige que consumidor y proveedor se comuniquen directamente mediante HTTP.

# Respuesta
falso

# Explicación
El Reference Model exige posibilidad de interacción, no un protocolo ni una topología concreta. La comunicación puede realizarse mediante distintas tecnologías y caminos.

# Pista
Recuerda que el modelo de referencia es independiente de tecnologías específicas.
```

# Visibilidad combina conocimiento, predisposición y alcance

Awareness, willingness y reachability responden a tres preguntas distintas:

| Aspecto | Pregunta |
|---|---|
| Awareness | ¿Las partes conocen la existencia relevante de la otra? |
| Willingness | ¿Están predispuestas a interactuar bajo las condiciones aplicables? |
| Reachability | ¿Existe un camino que permita la interacción? |

Que una condición exista no permite inferir automáticamente las demás. La visibilidad debe analizarse como una relación compuesta, no como un simple «el servicio está encendido».

> Doc: [OASIS SOA-RM 1.0 — §3.2.1 Visibility](https://docs.oasis-open.org/soa-rm/v1.0/soa-rm.pdf#page=13)

```relacionar
# Enunciado
Relaciona cada aspecto de visibilidad con la pregunta que responde.

# Pares
- Awareness => ¿conozco la existencia de la otra parte?
- Willingness => ¿estoy dispuesto a interactuar?
- Reachability => ¿puedo establecer una interacción con la otra parte?

# Explicación
La visibilidad se entiende separando conocimiento, predisposición y capacidad efectiva de interacción.

# Pista
Piensa en saber, querer y poder.
```

# Cierre

La visibilidad no se reduce a que un endpoint esté disponible. OASIS la descompone en **awareness**, **willingness** y **reachability**, tres condiciones que permiten razonar por separado sobre conocimiento, predisposición y posibilidad efectiva de comunicación.

La sesión siguiente parte de esa visibilidad ya establecida y estudia qué ocurre cuando los participantes **interactúan con el servicio**: información intercambiada, estructura, semántica, acciones y dependencias temporales.
