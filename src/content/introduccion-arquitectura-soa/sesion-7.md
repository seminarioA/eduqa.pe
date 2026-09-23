---
numero: 7
titulo: "Execution Context"
---

# El execution context materializa una interacción concreta

El **execution context** de una interacción es el conjunto de elementos de infraestructura, entidades de proceso, policy assertions y agreements identificados como parte de una instancia concreta de interacción.

OASIS lo describe como el camino que conecta a quienes tienen necesidades con quienes poseen capacidades. No es solamente una red ni solamente configuración técnica: reúne elementos técnicos y de negocio que permiten que la interacción ocurra bajo condiciones coherentes.

![Execution Context](https://docs.oasis-open.org/soa-rm/v1.0/soa-rm_files/image021.png)

*Figura 11 de OASIS SOA-RM 1.0: el execution context como camino entre consumidor y proveedor.*

> Doc: [OASIS SOA-RM 1.0 — §3.3.3 Execution context](https://docs.oasis-open.org/soa-rm/v1.0/soa-rm.pdf#page=24)

```opcion-multiple
# Enunciado
¿Cuál describe mejor un execution context?

# Opciones
- Solo la dirección de red del proveedor
- El conjunto coherente de infraestructura, procesos, policies y agreements de una interacción concreta
- El código fuente del servicio
- El catálogo completo de servicios de una organización

# Correcta
2

# Explicación
El execution context abarca el camino técnico y de negocio completo que permite una interacción concreta entre participantes.

# Pista
No lo reduzcas a infraestructura de red.
```

# La service description aporta condiciones para formar el execution context

La **service description** puede contener protocolos preferidos, semántica, policies, condiciones y suposiciones sobre cómo puede utilizarse el servicio.

Para que una interacción tenga éxito, consumidor, proveedor y posibles terceros deben llegar a un conjunto **consistente** de acuerdos aplicables. El execution context reúne ese conjunto para la interacción instanciada.

> Doc: [OASIS SOA-RM 1.0 — §3.3.3 Execution context](https://docs.oasis-open.org/soa-rm/v1.0/soa-rm.pdf#page=24)
> Doc: [OASIS SOA-RM 1.0 — §3.3.1 Service description](https://docs.oasis-open.org/soa-rm/v1.0/soa-rm.pdf#page=20)

```relacionar
# Enunciado
Relaciona cada concepto con su función.

# Pares
- Service description => declara condiciones y características relevantes del servicio
- Execution context => reúne las condiciones y elementos concretos de una interacción instanciada

# Explicación
La descripción proporciona información potencial; el execution context representa la combinación concreta aceptada para una interacción.

# Pista
Distingue descripción previa de instancia ejecutada.
```

# Un interaction path puede ser temporal o reutilizable

OASIS utiliza una analogía geográfica: consumidor y proveedor son dos lugares separados y el execution context es el **camino** que se establece entre ellos.

Ese camino puede ser temporal, como un intercambio ad hoc, o estar muy bien definido y reutilizarse en futuras interacciones. La duración o estabilidad del camino no cambia el concepto: ambos son execution contexts mientras describan la instancia efectiva de interacción.

> Doc: [OASIS SOA-RM 1.0 — §3.3.3 Execution context](https://docs.oasis-open.org/soa-rm/v1.0/soa-rm.pdf#page=24)

```verdadero-falso
# Enunciado
Un execution context solo existe cuando la infraestructura y los acuerdos forman una configuración permanente y reutilizable.

# Respuesta
falso

# Explicación
OASIS contempla tanto conexiones temporales y ad hoc como caminos bien definidos y reutilizables.

# Pista
El concepto describe una interacción concreta, no exige permanencia.
```

# El execution context pertenece a toda la interacción

El execution context no pertenece exclusivamente al consumidor ni exclusivamente al proveedor. Incluye la **totalidad de la interacción**: ambas partes y la infraestructura común necesaria para mediarla.

Reducirlo a «el entorno del servidor» pierde precisamente la parte distribuida del concepto. Una interacción puede depender de elementos situados en varios dominios y de acuerdos comunes entre ellos.

> Doc: [OASIS SOA-RM 1.0 — §3.3.3 Execution context](https://docs.oasis-open.org/soa-rm/v1.0/soa-rm.pdf#page=24)

```opcion-multiple
# Enunciado
¿A qué lado de la interacción pertenece el execution context?

# Opciones
- Solo al proveedor
- Solo al consumidor
- A la totalidad de la interacción entre participantes y su infraestructura mediadora
- Solo a terceros reguladores

# Correcta
3

# Explicación
El execution context cubre consumidor, proveedor y la infraestructura común que permite la interacción.

# Pista
Piensa en el camino completo, no en uno de sus extremos.
```

# Terceros pueden imponer condiciones

Una interacción puede estar condicionada por **terceros**, por ejemplo organismos reguladores. Esos terceros pueden establecer requisitos que consumidor y proveedor deben incorporar en el execution context.

Su presencia no cambia la definición. Simplemente añade condiciones, restricciones y posiblemente intercambios de información adicionales que deben coordinarse para que la interacción sea válida.

> Doc: [OASIS SOA-RM 1.0 — §3.3.3 Execution context](https://docs.oasis-open.org/soa-rm/v1.0/soa-rm.pdf#page=24)

```verdadero-falso
# Enunciado
Un requisito impuesto por un regulador externo no puede formar parte del execution context porque el regulador no es consumidor ni proveedor.

# Respuesta
falso

# Explicación
OASIS contempla terceros que establecen condiciones para la interacción. Esas condiciones aumentan lo que debe coordinarse dentro del execution context.

# Pista
El contexto puede incluir condiciones externas a las dos partes principales.
```

# El execution context es un punto de decisión para policies

El execution context es central para el **policy enforcement** porque contiene los datos concretos de una interacción. OASIS lo identifica como un punto donde pueden tomarse decisiones sobre políticas aplicables.

Sin embargo, un **policy decision point** no es necesariamente el mismo lugar que un **enforcement point**. Decidir que una policy se aplica y ejecutar el mecanismo que la hace cumplir son responsabilidades diferentes.

> Doc: [OASIS SOA-RM 1.0 — §3.3.3 Execution context](https://docs.oasis-open.org/soa-rm/v1.0/soa-rm.pdf#page=24)

```relacionar
# Enunciado
Relaciona cada función con su significado.

# Pares
- Policy decision point => determina cómo aplica una policy en el contexto concreto
- Enforcement point => ejecuta un mecanismo para hacer cumplir la policy

# Explicación
La decisión y el enforcement pueden estar separados aunque ambos dependan de la información del execution context.

# Pista
Una función decide; la otra actúa.
```

# El contexto concreto diferencia instancias del mismo servicio

Dos interacciones con el **mismo servicio** pueden tener execution contexts diferentes. Por ejemplo, dos consumidores distintos pueden utilizar el mismo proveedor con identidades, policies, acuerdos, infraestructuras o condiciones diferentes.

OASIS utiliza esta propiedad para distinguir instancias de interacción incluso cuando el servicio lógico es el mismo.

> Doc: [OASIS SOA-RM 1.0 — §3.3.3 Execution context](https://docs.oasis-open.org/soa-rm/v1.0/soa-rm.pdf#page=24)

```verdadero-falso
# Enunciado
Dos consumidores que utilizan el mismo servicio deben compartir exactamente el mismo execution context.

# Respuesta
falso

# Explicación
Las interacciones pueden distinguirse precisamente porque sus execution contexts son diferentes aunque apunten al mismo servicio.

# Pista
El servicio puede ser el mismo; la instancia de interacción no tiene por qué serlo.
```

# La semántica se interpreta dentro de un contexto

El execution context también participa en la interpretación de los datos intercambiados. Una cadena o símbolo adquiere significado dentro de una interacción y un contexto concretos.

Esto conecta el execution context con la **semántica** estudiada anteriormente: la interpretación consistente no existe en el vacío, sino dentro de un conjunto de acuerdos, vocabularios, condiciones y participantes.

> Doc: [OASIS SOA-RM 1.0 — §3.3.3 Execution context](https://docs.oasis-open.org/soa-rm/v1.0/soa-rm.pdf#page=24)
> Doc: [OASIS SOA-RM 1.0 — §3.2.2.1.2 Semantics](https://docs.oasis-open.org/soa-rm/v1.0/soa-rm.pdf#page=16)

```opcion-multiple
# Enunciado
¿Por qué una misma cadena puede tener un significado concreto en una interacción y otro en una interacción diferente?

# Opciones
- Porque el significado depende también del execution context
- Porque toda cadena cambia automáticamente de valor
- Porque SOA prohíbe significados compartidos
- Porque la sintaxis elimina la semántica

# Correcta
1

# Explicación
OASIS sitúa la interpretación de los datos dentro del execution context. El significado depende del contexto de uso y de las definiciones compartidas.

# Pista
Recuerda que semántica significa interpretación dentro de un contexto.
```

# El execution context puede evolucionar durante la interacción

El execution context no tiene que permanecer estático. Los elementos de infraestructura, policies y agreements aplicables pueden **cambiar durante una misma interacción**.

OASIS da el ejemplo de una conversación que comienza sin cifrado y en la que las partes acuerdan que la comunicación posterior debe cifrarse. El contexto cambia para incorporar la infraestructura y condiciones necesarias para continuar bajo esa nueva regla.

> Doc: [OASIS SOA-RM 1.0 — §3.3.3 Execution context](https://docs.oasis-open.org/soa-rm/v1.0/soa-rm.pdf#page=24)

```ordenar
# Enunciado
Ordena la evolución del execution context del ejemplo de OASIS.

# Elementos
- El contexto incorpora infraestructura para cifrado
- La interacción comienza con el contexto inicial
- Las partes acuerdan cifrar las comunicaciones posteriores

# Orden
2, 3, 1

# Explicación
El contexto inicial permite comenzar; un nuevo agreement modifica las condiciones; el execution context evoluciona para incorporar la infraestructura necesaria.

# Pista
El cambio técnico ocurre después del nuevo acuerdo.
```

# Execution context no es sinónimo de deployment environment

Un **deployment environment** puede formar parte del execution context, pero no lo agota. El execution context incluye también acuerdos, policies, semántica, procesos y cualquier infraestructura mediadora relevante para la interacción.

Esta distinción es importante porque dos interacciones desplegadas sobre la misma infraestructura física pueden seguir teniendo execution contexts distintos.

> Doc: [OASIS SOA-RM 1.0 — §3.3.3 Execution context](https://docs.oasis-open.org/soa-rm/v1.0/soa-rm.pdf#page=24)

```verdadero-falso
# Enunciado
Si dos interacciones utilizan los mismos servidores y la misma red, entonces necesariamente tienen el mismo execution context.

# Respuesta
falso

# Explicación
Policies, agreements, participantes, semántica y otros elementos pueden diferir aunque la infraestructura física sea la misma.

# Pista
El contexto contiene más que hardware y red.
```

# El execution context conecta visibility, interaction y effect

Para que una interacción llegue a producir el Real World Effect esperado, el execution context debe reunir condiciones coherentes que hagan posible la comunicación y el comportamiento acordado.

Por eso el execution context conecta conceptos vistos durante todo el curso: **reachability**, **semantics**, **policies**, **contracts**, **service interface** e **interaction** convergen en una instancia efectiva de uso del servicio.

> Doc: [OASIS SOA-RM 1.0 — §2.1 What is Service Oriented Architecture?](https://docs.oasis-open.org/soa-rm/v1.0/soa-rm.pdf#page=8)
> Doc: [OASIS SOA-RM 1.0 — §3.3.3 Execution context](https://docs.oasis-open.org/soa-rm/v1.0/soa-rm.pdf#page=24)

```relacionar
# Enunciado
Relaciona cada concepto con la contribución que hace a una interacción concreta.

# Pares
- Reachability => permite que las partes puedan comunicarse
- Semantics => permite interpretar consistentemente la información
- Policy => impone condiciones desde la perspectiva de un participante
- Contract => expresa acuerdos compartidos
- Execution context => reúne estos elementos en la instancia concreta de interacción

# Explicación
El execution context materializa la combinación de condiciones técnicas y de negocio que hacen posible una interacción específica.

# Pista
Los primeros cuatro aportan condiciones; el último las reúne en la interacción.
```

# Cierre

El **execution context** transforma descripciones, policies, agreements e infraestructura en un camino concreto de interacción. Puede incluir terceros, diferenciar instancias del mismo servicio y evolucionar mientras la interacción está en curso.

Con esto queda cubierto el núcleo completo de la sección 3 del SOA Reference Model. La siguiente sesión vuelve a la sección 2 para responder una confusión frecuente: por qué **SOA no es sinónimo de Web Services**, aunque Web Services puedan utilizarse para implementar arquitecturas orientadas a servicios.
