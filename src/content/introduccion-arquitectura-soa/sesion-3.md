---
numero: 3
titulo: "Interacción: información y comportamiento"
---

# Interactuar es realizar acciones contra el servicio

Una **interacción con un servicio** consiste en realizar acciones contra ese servicio. El intercambio de mensajes es la forma más habitual de describirlo, pero OASIS no limita la interacción a mensajes explícitos: también puede existir, por ejemplo, mediante modificaciones de un recurso compartido.

El modelo de referencia usa el intercambio de mensajes como forma principal de explicación porque permite razonar con claridad sobre la información y las acciones implicadas, no porque SOA exija un protocolo de mensajería particular.

> Doc: [OASIS SOA-RM 1.0 — §3.2.2 Interacting with services](https://docs.oasis-open.org/soa-rm/v1.0/soa-rm.pdf#page=15)
> Doc: [OASIS SOA-RM 1.0 — Glossary: Interaction](https://docs.oasis-open.org/soa-rm/v1.0/soa-rm.pdf#page=29)

```verdadero-falso
# Enunciado
Toda interacción SOA debe consistir obligatoriamente en enviar y recibir mensajes explícitos.

# Respuesta
falso

# Explicación
OASIS usa el intercambio de mensajes como modo principal de explicación, pero reconoce otros modos de interacción, como modificar el estado de un recurso compartido.

# Pista
El modelo describe el concepto de interacción, no impone un transporte concreto.
```

# La descripción conecta el modelo de información y el modelo de comportamiento

Para interactuar correctamente no basta con saber que un servicio existe. La **service description** proporciona información que permite comprender qué información se intercambia y qué comportamiento observable debe respetarse.

OASIS organiza estos aspectos mediante dos modelos complementarios: el **information model**, asociado a la información intercambiada, y el **behavior model**, asociado a acciones, respuestas y dependencias temporales.

![Conceptos de interacción con servicios](https://docs.oasis-open.org/soa-rm/v1.0/soa-rm_files/image013.jpg)

*Figura 6 de OASIS SOA-RM 1.0: la interacción se apoya en la descripción del servicio, su information model y su behavior model.*

> Doc: [OASIS SOA-RM 1.0 — §3.2.2 Interacting with services](https://docs.oasis-open.org/soa-rm/v1.0/soa-rm.pdf#page=15)

```relacionar
# Enunciado
Relaciona cada modelo con la pregunta principal que ayuda a responder.

# Pares
- Information model => ¿qué información puede intercambiarse y cómo se interpreta?
- Behavior model => ¿qué acciones pueden realizarse y qué relaciones temporales existen entre ellas?

# Explicación
El information model caracteriza la información asociada al uso del servicio; el behavior model caracteriza acciones, respuestas y dependencias temporales.

# Pista
Uno trata datos e interpretación; el otro trata acciones y secuencias.
```

# El information model caracteriza la información intercambiable

El **information model** caracteriza la información asociada al uso de un servicio. En general incluye solamente información y datos que potencialmente pueden intercambiarse con el servicio.

Su alcance incluye el formato de la información, las relaciones estructurales dentro de ella y las definiciones de los términos utilizados. Por tanto, no es únicamente una lista de campos: también debe permitir que las partes sepan qué representa lo intercambiado.

> Doc: [OASIS SOA-RM 1.0 — §3.2.2.1 Information model](https://docs.oasis-open.org/soa-rm/v1.0/soa-rm.pdf#page=15)
> Doc: [OASIS SOA-RM 1.0 — Glossary: Information model](https://docs.oasis-open.org/soa-rm/v1.0/soa-rm.pdf#page=29)

```opcion-multiple
# Enunciado
¿Cuál pertenece directamente al information model de un servicio?

# Opciones
- La estructura y significado de la información que puede intercambiarse
- La marca del servidor físico que ejecuta la implementación
- El lenguaje usado internamente por el proveedor
- El organigrama del equipo que mantiene el servicio

# Correcta
1

# Explicación
El information model caracteriza la información asociada al uso del servicio: formato, estructura y términos relevantes para interpretarla.

# Pista
Busca aquello que un participante necesita comprender sobre la información intercambiada.
```

# Semantic engagement determina cómo un sistema interpreta la información

OASIS denomina **semantic engagement** a la relación entre un sistema y la información que puede encontrar. Dos servicios pueden recibir exactamente la misma secuencia de bytes y darle interpretaciones completamente distintas.

Un servicio de cifrado puede interpretar una entrada simplemente como bytes que debe transformar, mientras que un servicio de base de datos puede interpretar esos mismos bytes como una consulta o una solicitud de actualización. El significado no está determinado únicamente por la representación física.

> Doc: [OASIS SOA-RM 1.0 — §3.2.2.1 Information model](https://docs.oasis-open.org/soa-rm/v1.0/soa-rm.pdf#page=15)
> Doc: [OASIS SOA-RM 1.0 — Glossary: Semantic Engagement](https://docs.oasis-open.org/soa-rm/v1.0/soa-rm.pdf#page=29)

```verdadero-falso
# Enunciado
Si dos servicios reciben la misma secuencia de bytes, necesariamente interpretan esa información de la misma manera.

# Respuesta
falso

# Explicación
La interpretación depende del semantic engagement del sistema. El mismo contenido físico puede representar cosas distintas para servicios con propósitos diferentes.

# Pista
Representación e interpretación no son equivalentes.
```

# Structure describe representación, formato y relaciones estructurales

La **estructura** cubre la representación y forma de la información necesaria para interactuar. OASIS incluye aquí aspectos como codificación de caracteres, formato de los datos y tipos estructurales asociados a los elementos.

Conocer la estructura permite determinar si la información puede procesarse sintácticamente. Sin embargo, esa compatibilidad estructural todavía no garantiza que ambos participantes atribuyan el mismo significado a los datos.

> Doc: [OASIS SOA-RM 1.0 — §3.2.2.1.1 Structure](https://docs.oasis-open.org/soa-rm/v1.0/soa-rm.pdf#page=16)

```opcion-multiple
# Enunciado
¿Cuál es principalmente una cuestión de estructura y no de semántica?

# Opciones
- Determinar que un campo se codifica como una cadena de caracteres
- Determinar que la cadena representa una ciudad y no una calle
- Determinar la intención empresarial de una orden de compra
- Determinar qué compromiso adquiere una parte al aceptar una operación

# Correcta
1

# Explicación
La representación como cadena pertenece a la estructura. Saber qué significa esa cadena dentro del dominio exige semántica.

# Pista
La estructura responde a cómo está representado el dato.
```

# La estructura por sí sola no determina el significado

Dos elementos pueden compartir exactamente el mismo tipo estructural y representar conceptos diferentes. OASIS utiliza el ejemplo de una dirección: el nombre de una ciudad y el nombre de una calle pueden representarse ambos como cadenas, pero no son conceptos intercambiables.

Por eso comprobar tipos y formatos es necesario pero insuficiente. Una interacción puede ser sintácticamente válida y, aun así, estar semánticamente equivocada.

> Doc: [OASIS SOA-RM 1.0 — §3.2.2.1.1 Structure](https://docs.oasis-open.org/soa-rm/v1.0/soa-rm.pdf#page=16)

```verdadero-falso
# Enunciado
Si dos campos tienen el mismo tipo de dato, entonces necesariamente tienen el mismo significado dentro de una interacción.

# Respuesta
falso

# Explicación
La igualdad estructural no implica igualdad semántica. Dos cadenas pueden representar conceptos distintos, como una ciudad y una calle.

# Pista
El tipo indica forma; el dominio determina significado.
```

# Semantics establece el significado compartido

La **semántica** trata el significado implícito de la información dentro de un contexto de uso. Para que una interacción sea fiable, proveedor y consumidor deben interpretar de manera consistente los términos que intercambian.

OASIS subraya que la consistencia semántica es más fuerte que la consistencia de tipos. Un mismo concepto puede tener varias representaciones y, a la inversa, una misma representación estructural puede referirse a conceptos diferentes.

Las descripciones formales de términos y relaciones, como ontologías u otros vocabularios de dominio, pueden proporcionar una base común para esa interpretación.

> Doc: [OASIS SOA-RM 1.0 — §3.2.2.1.2 Semantics](https://docs.oasis-open.org/soa-rm/v1.0/soa-rm.pdf#page=16)
> Doc: [OASIS SOA-RM 1.0 — Glossary: Semantics](https://docs.oasis-open.org/soa-rm/v1.0/soa-rm.pdf#page=29)

```opcion-multiple
# Enunciado
Proveedor y consumidor aceptan que un campo es una cadena, pero uno interpreta «PE» como país y el otro como provincia. ¿Qué tipo de compatibilidad falta?

# Opciones
- Reachability
- Compatibilidad semántica
- Willingness
- Compatibilidad de codificación únicamente

# Correcta
2

# Explicación
Ambas partes pueden aceptar la estructura del dato y aun así atribuirle significados distintos. El problema es semántico.

# Pista
El formato coincide; lo que diverge es la interpretación.
```

# El behavior model caracteriza acciones, respuestas y dependencias temporales

El **behavior model** caracteriza las acciones que pueden invocarse contra el servicio, las respuestas asociadas y las dependencias temporales entre esas acciones.

Esto significa que conocer únicamente el formato de los mensajes tampoco basta. Un consumidor necesita saber qué acciones existen, qué puede ocurrir como respuesta y en qué orden o bajo qué condiciones pueden ejecutarse.

> Doc: [OASIS SOA-RM 1.0 — §3.2.2.2 Behavior model](https://docs.oasis-open.org/soa-rm/v1.0/soa-rm.pdf#page=17)
> Doc: [OASIS SOA-RM 1.0 — Glossary: Behavior Model](https://docs.oasis-open.org/soa-rm/v1.0/soa-rm.pdf#page=28)

```relacionar
# Enunciado
Relaciona cada aspecto de una interacción con el modelo al que pertenece principalmente.

# Pares
- Formato de la información => Information model — Structure
- Significado de los términos => Information model — Semantics
- Acciones permitidas => Behavior model — Action model
- Orden temporal de las acciones => Behavior model — Process model

# Explicación
Cada aspecto pertenece a una rama distinta del modelo: estructura y semántica dentro del information model; acciones y relaciones temporales dentro del behavior model.

# Pista
Separa «qué información significa qué» de «qué puede hacerse y cuándo».
```

# El action model define las acciones que pueden invocarse

El **action model** caracteriza las acciones que pueden invocarse contra un servicio. Una acción observable no es únicamente un nombre de operación: su uso puede implicar efectos, restricciones y dependencias relevantes para el consumidor.

En un servicio que administra una cuenta, por ejemplo, conocer la forma de una solicitud no basta para comprender que una retirada puede afectar al saldo o que su validez puede depender de una condición previa. La acción tiene significado operativo dentro del servicio.

> Doc: [OASIS SOA-RM 1.0 — §3.2.2.2.1 Action model](https://docs.oasis-open.org/soa-rm/v1.0/soa-rm.pdf#page=17)
> Doc: [OASIS SOA-RM 1.0 — Glossary: Action Model](https://docs.oasis-open.org/soa-rm/v1.0/soa-rm.pdf#page=28)

```opcion-multiple
# Enunciado
¿Qué caracteriza principalmente el action model?

# Opciones
- Las acciones que pueden invocarse contra el servicio
- El formato físico de todos los datos internos del proveedor
- La lista de máquinas donde se despliega el servicio
- La estrategia comercial de la organización

# Correcta
1

# Explicación
El action model describe las acciones invocables contra el servicio y forma parte del comportamiento observable que un consumidor necesita comprender.

# Pista
Su nombre alude directamente a lo que caracteriza.
```

# El comportamiento público no revela todo el comportamiento privado

Una parte importante del comportamiento producido por una acción puede ser **privada** para el proveedor. El consumidor necesita comprender la vista pública relevante —acciones disponibles, respuestas esperadas y efectos implicados—, pero no necesita conocer cada procedimiento interno que produce ese comportamiento.

Esta separación conserva una frontera entre contrato observable e implementación. Cambiar una operación interna no debería obligar al consumidor a conocer ese cambio mientras se mantenga el comportamiento externo comprometido.

> Doc: [OASIS SOA-RM 1.0 — §3.2.2.2.1 Action model](https://docs.oasis-open.org/soa-rm/v1.0/soa-rm.pdf#page=17)

```verdadero-falso
# Enunciado
Para utilizar correctamente un servicio, el consumidor debe conocer todas las acciones internas que el proveedor ejecuta para implementar cada operación.

# Respuesta
falso

# Explicación
El consumidor necesita el comportamiento público relevante. Gran parte del comportamiento resultante de una acción puede permanecer privado para el proveedor.

# Pista
SOA separa propiedades externamente relevantes de implementación interna.
```

# El process model caracteriza relaciones temporales

El **process model** caracteriza las relaciones temporales y propiedades temporales de las acciones y eventos asociados a la interacción con el servicio.

Una interacción puede requerir un orden: una acción solo puede ser válida después de otra, una respuesta puede habilitar el siguiente paso o una condición temporal puede limitar cuándo ejecutar una acción. Esas relaciones forman parte del conocimiento necesario para usar el servicio correctamente.

> Doc: [OASIS SOA-RM 1.0 — §3.2.2.2.2 Process Model](https://docs.oasis-open.org/soa-rm/v1.0/soa-rm.pdf#page=18)
> Doc: [OASIS SOA-RM 1.0 — Glossary: Process Model](https://docs.oasis-open.org/soa-rm/v1.0/soa-rm.pdf#page=29)

```ordenar
# Enunciado
Un servicio exige autenticarse antes de permitir una actualización. Ordena la interacción respetando esa dependencia temporal.

# Elementos
- Solicitar la actualización
- Presentar credenciales
- Recibir validación de credenciales

# Orden
2, 3, 1

# Explicación
El process model representa dependencias temporales entre acciones: primero se presentan credenciales, después se validan y solo entonces se permite solicitar la actualización.

# Pista
La actualización no puede preceder a la autenticación aceptada.
```

# Orquestación y coreografía quedan fuera del alcance del Reference Model

OASIS aclara una frontera importante: un process model puede llegar a incluir aspectos de orquestación o coreografía, pero el **SOA Reference Model no modela la orquestación de múltiples servicios**.

El mínimo exigido por el modelo es cubrir las interacciones con el servicio mismo. La coordinación de varios servicios pertenece a un nivel de diseño posterior y se estudiará en Arquitectura SOA Intermedia.

> Nota: Que un tema sea relevante para sistemas SOA no significa que deba formar parte del modelo conceptual mínimo de SOA.

> Doc: [OASIS SOA-RM 1.0 — §3.2.2.2.2 Process Model](https://docs.oasis-open.org/soa-rm/v1.0/soa-rm.pdf#page=18)

```opcion-multiple
# Enunciado
¿Qué exige como mínimo el SOA Reference Model al process model?

# Opciones
- Modelar obligatoriamente toda la orquestación empresarial
- Cubrir las interacciones con el servicio mismo
- Utilizar BPMN
- Coordinar al menos tres servicios

# Correcta
2

# Explicación
OASIS deja la orquestación y la coreografía de múltiples servicios fuera del alcance del Reference Model. El mínimo es caracterizar las interacciones con el propio servicio.

# Pista
Distingue el modelo conceptual mínimo de técnicas posteriores de composición.
```

# Cierre

Una interacción SOA no se reduce a «mandar un mensaje». Para utilizar un servicio correctamente hay que comprender la **información** intercambiada —estructura y semántica— y su **comportamiento** —acciones y relaciones temporales—.

La sesión siguiente completa la dinámica del servicio: qué ocurre después de interactuar y cómo OASIS distingue la capacidad ofrecida del **Real World Effect** que efectivamente se obtiene.
