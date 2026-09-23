---
numero: 1
titulo: "Del modelo de referencia al servicio"
---

# Qué es un modelo de referencia

Un **modelo de referencia** es un marco abstracto para comprender las entidades relevantes de un dominio y las relaciones entre ellas. No prescribe una solución concreta. Su función es proporcionar un vocabulario y un conjunto mínimo de conceptos que puedan utilizarse de forma consistente al describir arquitecturas diferentes.

OASIS separa deliberadamente este nivel conceptual de los estándares, tecnologías, implementaciones y demás decisiones concretas. Por eso el modelo de referencia de SOA sigue siendo aplicable aunque cambien los protocolos, productos o plataformas utilizados para implementar una solución.

> Nota: Un modelo de referencia no es una plantilla de infraestructura ni una lista de productos. Si una descripción exige una tecnología concreta para poder aplicarse, ya está introduciendo decisiones que pertenecen a un nivel menos abstracto.

> Doc: [OASIS SOA-RM 1.0 — §1.1 What is a reference model](https://docs.oasis-open.org/soa-rm/v1.0/soa-rm.pdf#page=4)

```opcion-multiple
# Enunciado
¿Cuál de estas afirmaciones describe un modelo de referencia según OASIS?

# Opciones
- Define los productos que deben instalarse para construir el sistema
- Define conceptos y relaciones comunes sin depender de una implementación concreta
- Especifica la topología de despliegue de una solución
- Sustituye los requisitos particulares de cada sistema

# Correcta
2

# Explicación
El modelo de referencia proporciona conceptos, axiomas y relaciones comunes. Las tecnologías, productos, topologías y requisitos concretos pertenecen a niveles posteriores de diseño.

# Pista
Busca la opción que permanezca válida aunque cambie toda la tecnología utilizada.
```

# Una arquitectura de referencia añade una solución abstracta

Una **arquitectura de referencia** toma los conceptos del modelo de referencia y organiza mecanismos y relaciones que permiten satisfacer una clase de requisitos. Continúa siendo abstracta: describe una forma general de realizar el modelo, pero no determina todavía todos los componentes de una solución particular.

OASIS utiliza el ejemplo de la vivienda para separar ambos niveles. El concepto de «zona para comer» puede pertenecer al modelo de referencia; una cocina es una posible realización de ese concepto dentro de una arquitectura de referencia. La arquitectura de referencia introduce estructura de solución sin convertirse todavía en el plano de una vivienda específica.

> Doc: [OASIS SOA-RM 1.0 — §1.1 What is a reference model](https://docs.oasis-open.org/soa-rm/v1.0/soa-rm.pdf#page=4)
> Doc: [OASIS SOA-RM 1.0 — Glossary: Reference Architecture](https://docs.oasis-open.org/soa-rm/v1.0/soa-rm.pdf#page=29)

```verdadero-falso
# Enunciado
Una arquitectura de referencia debe especificar productos, servidores y protocolos concretos para que pueda considerarse una arquitectura.

# Respuesta
falso

# Explicación
Una arquitectura de referencia sigue siendo abstracta. Indica cómo un conjunto de mecanismos y relaciones puede realizar ciertos requisitos, sin tener que fijar una solución tecnológica concreta.

# Pista
Distingue una clase de soluciones de una solución particular.
```

# Una arquitectura concreta incorpora decisiones específicas

Una **arquitectura concreta** aplica modelos, arquitecturas de referencia, patrones y requisitos a un problema particular. En este nivel aparecen decisiones específicas del entorno: tecnologías, protocolos, componentes, restricciones operativas y otras condiciones que sí determinan cómo se construirá una solución.

La relación entre estos niveles no es intercambiable. El modelo de referencia aporta conceptos; la arquitectura de referencia organiza una realización abstracta; la arquitectura concreta selecciona una solución para un contexto determinado.

![Relación entre el modelo de referencia y otros elementos arquitectónicos](https://docs.oasis-open.org/soa-rm/v1.0/soa-rm_files/image004.jpg)

*Figura 1 de OASIS SOA-RM 1.0: relación del modelo de referencia con arquitecturas, patrones, requisitos, tecnologías e implementaciones.*

> Doc: [OASIS SOA-RM 1.0 — §1.2 A Reference Model for Service Oriented Architectures](https://docs.oasis-open.org/soa-rm/v1.0/soa-rm.pdf#page=4)

```ordenar
# Enunciado
Ordena los niveles desde el más abstracto hasta el que contiene las decisiones particulares de una solución.

# Elementos
- Arquitectura concreta
- Modelo de referencia
- Arquitectura de referencia

# Orden
2, 3, 1

# Explicación
El modelo de referencia define los conceptos comunes. La arquitectura de referencia organiza una realización abstracta de esos conceptos. La arquitectura concreta incorpora los requisitos y decisiones particulares de una solución.

# Pista
Empieza por el nivel que no depende de ninguna tecnología específica.
```

# Los mapas de conceptos representan relaciones

El documento de OASIS utiliza **mapas de conceptos** para mostrar relaciones entre conceptos. Una línea indica que existe una relación; una flecha indica una relación asimétrica y apunta hacia el concepto que depende, de alguna manera, del concepto desde el que parte la línea.

El gráfico no contiene por sí solo toda la semántica de la relación. OASIS especifica que el texto que acompaña cada figura determina la naturaleza concreta de esa relación. Por tanto, una flecha no debe interpretarse como flujo de datos, llamada de red o dependencia de código salvo que el texto lo establezca.

![Mapa de conceptos básico utilizado por OASIS](https://docs.oasis-open.org/soa-rm/v1.0/soa-rm_files/image006.jpg)

*Figura 2 de OASIS SOA-RM 1.0: notación básica de los mapas de conceptos.*

> Doc: [OASIS SOA-RM 1.0 — §1.5.1 How to interpret concept maps](https://docs.oasis-open.org/soa-rm/v1.0/soa-rm.pdf#page=6)

```verdadero-falso
# Enunciado
En los mapas de conceptos del SOA-RM, toda flecha representa necesariamente una llamada de red entre dos componentes.

# Respuesta
falso

# Explicación
La flecha solo indica una relación asimétrica. La semántica concreta de esa relación se obtiene del texto que acompaña a la figura.

# Pista
El mapa representa conceptos, no necesariamente componentes ejecutables.
```

# SOA organiza capacidades distribuidas

**Service Oriented Architecture (SOA)** es definida por OASIS como un paradigma para organizar y utilizar capacidades distribuidas que pueden estar bajo el control de distintos dominios de propiedad.

La palabra **paradigma** importa: SOA establece una forma de organizar soluciones y de relacionar necesidades con capacidades. No define por sí misma un lenguaje de programación, un protocolo de transporte, un formato de mensaje ni un producto de integración.

> Nota: Que una implementación SOA use HTTP, SOAP, mensajería, procesos manuales u otra tecnología no altera la definición del paradigma. Las tecnologías concretas se estudian después de establecer los conceptos que deben realizar.

> Doc: [OASIS SOA-RM 1.0 — §2.1 What is Service Oriented Architecture?](https://docs.oasis-open.org/soa-rm/v1.0/soa-rm.pdf#page=8)

```opcion-multiple
# Enunciado
¿Qué elemento define OASIS como el objeto que SOA organiza y utiliza?

# Opciones
- Capacidades distribuidas
- Bases de datos relacionales
- Objetos instanciados
- Mensajes SOAP

# Correcta
1

# Explicación
La definición de SOA se construye alrededor de capacidades distribuidas. Bases de datos, objetos o mensajes pueden aparecer en implementaciones concretas, pero no forman parte de la definición general.

# Pista
La respuesta debe seguir siendo válida aunque la implementación no use SOAP ni una base de datos relacional.
```

# Una necesidad expresa lo que debe lograrse

Una **necesidad** existe del lado de quien requiere un resultado. En el modelo de OASIS, las entidades tienen necesidades y otras entidades pueden disponer de capacidades capaces de satisfacerlas.

Por ejemplo, «confirmar que un pago fue autorizado» describe una necesidad desde la perspectiva de quien requiere esa confirmación. La necesidad no especifica todavía quién proporcionará la capacidad ni cómo se implementará el acceso a ella.

OASIS no exige una correspondencia uno a uno entre necesidades y capacidades: una necesidad puede requerir varias capacidades y una misma capacidad puede contribuir a satisfacer necesidades diferentes.

> Doc: [OASIS SOA-RM 1.0 — §2.1 What is Service Oriented Architecture?](https://docs.oasis-open.org/soa-rm/v1.0/soa-rm.pdf#page=8)

```opcion-multiple
# Enunciado
¿Cuál de estas frases está formulada como una necesidad y no como una implementación?

# Opciones
- Ejecutar un contenedor llamado pagos
- Confirmar que un pago fue autorizado
- Enviar un POST a /payments
- Guardar una fila en PostgreSQL

# Correcta
2

# Explicación
La necesidad expresa el resultado requerido. El contenedor, el endpoint HTTP y la base de datos son decisiones sobre cómo podría implementarse una solución.

# Pista
Busca el resultado que se necesita, no el mecanismo que podría producirlo.
```

# Una capacidad representa un efecto que puede proporcionarse

Una **capacidad** representa aquello que un proveedor puede aportar para producir un efecto relevante. En el glosario del SOA-RM, OASIS la define en términos del efecto del mundo real que un proveedor puede proporcionar a un consumidor.

La capacidad existe conceptualmente antes de decidir cómo se hará accesible. Una organización puede tener la capacidad de autorizar pagos aunque todavía no haya publicado un servicio para que otros sistemas utilicen esa capacidad.

> Doc: [OASIS SOA-RM 1.0 — Glossary: Capability](https://docs.oasis-open.org/soa-rm/v1.0/soa-rm.pdf#page=28)
> Doc: [OASIS SOA-RM 1.0 — §2.1 What is Service Oriented Architecture?](https://docs.oasis-open.org/soa-rm/v1.0/soa-rm.pdf#page=8)

```verdadero-falso
# Enunciado
Si una organización posee una capacidad, esa capacidad ya constituye necesariamente un servicio SOA.

# Respuesta
falso

# Explicación
OASIS distingue la capacidad de su mecanismo de acceso. El servicio es el mecanismo mediante el que una capacidad se pone a disposición para satisfacer necesidades.

# Pista
Una capacidad puede existir aunque todavía no haya un mecanismo de acceso publicado.
```

# Necesidades y capacidades no forman pares uno a uno

La relación entre **necesidad** y **capacidad** puede tener distintas granularidades. Una necesidad compleja puede requerir combinar varias capacidades. A la inversa, una capacidad puede utilizarse para responder a más de una necesidad.

Esta propiedad impide modelar SOA como una tabla rígida donde cada necesidad tiene exactamente una capacidad asociada. Parte del valor del paradigma está en poder combinar y reutilizar capacidades para resolver necesidades diferentes.

> Doc: [OASIS SOA-RM 1.0 — §2.1 What is Service Oriented Architecture?](https://docs.oasis-open.org/soa-rm/v1.0/soa-rm.pdf#page=8)

```verdadero-falso
# Enunciado
En SOA, cada necesidad debe corresponder exactamente a una única capacidad y cada capacidad debe satisfacer una única necesidad.

# Respuesta
falso

# Explicación
OASIS indica expresamente que no existe necesariamente una correspondencia uno a uno. Una necesidad puede combinar varias capacidades y una capacidad puede responder a distintas necesidades.

# Pista
Piensa en una capacidad reutilizable por consumidores con objetivos diferentes.
```

# Un dominio de propiedad delimita quién controla una capacidad

Un **dominio de propiedad** delimita el control sobre capacidades y recursos. La definición de SOA destaca que las capacidades distribuidas pueden encontrarse bajo dominios de propiedad diferentes.

La separación de propiedad importa porque reduce las suposiciones que un participante puede hacer sobre otro. Un consumidor puede necesitar utilizar una capacidad que controla otra organización, otro departamento o cualquier entidad con autoridad independiente sobre esa capacidad.

No todas las interacciones SOA tienen que cruzar una frontera organizacional. El concepto establece que SOA puede operar cuando esas fronteras existen y que la arquitectura debe poder representar esa independencia.

> Doc: [OASIS SOA-RM 1.0 — §2.1 What is Service Oriented Architecture?](https://docs.oasis-open.org/soa-rm/v1.0/soa-rm.pdf#page=8)

```opcion-multiple
# Enunciado
¿Qué expresa un dominio de propiedad en la definición de SOA?

# Opciones
- El protocolo usado para intercambiar mensajes
- La entidad que controla una capacidad o recurso
- El lenguaje con el que se implementa un servicio
- La cantidad de consumidores permitidos

# Correcta
2

# Explicación
El dominio de propiedad describe control y autoridad. SOA contempla capacidades distribuidas que pueden estar controladas por dominios distintos.

# Pista
La palabra clave es control, no tecnología.
```

# Un servicio proporciona acceso a capacidades

Un **servicio** es el mecanismo que permite acceder a una o más capacidades. OASIS especifica que ese acceso se proporciona mediante una interfaz prescrita y se ejerce de acuerdo con las restricciones y políticas descritas para el servicio.

Esta definición mantiene separados tres elementos:

1. la **necesidad** que se intenta satisfacer;
2. la **capacidad** que puede producir el efecto requerido;
3. el **servicio** que proporciona el mecanismo de acceso a esa capacidad.

El servicio no tiene por qué revelar cómo se implementa la capacidad subyacente. La implementación puede incluir procesos automáticos, procesos manuales u otros servicios.

> Doc: [OASIS SOA-RM 1.0 — §3.1 Service](https://docs.oasis-open.org/soa-rm/v1.0/soa-rm.pdf#page=12)
> Doc: [OASIS SOA-RM 1.0 — Glossary: Service](https://docs.oasis-open.org/soa-rm/v1.0/soa-rm.pdf#page=29)

```opcion-multiple
# Enunciado
Una empresa puede autorizar pagos y permite que otros sistemas soliciten esa autorización mediante una interfaz prescrita. ¿Qué elemento es el servicio?

# Opciones
- La necesidad de saber si el pago fue autorizado
- La capacidad empresarial de autorizar pagos
- El mecanismo prescrito mediante el que se accede a esa capacidad
- La implementación interna que calcula el riesgo

# Correcta
3

# Explicación
El servicio es el mecanismo de acceso a la capacidad. La necesidad pertenece al consumidor, la capacidad pertenece al lado que puede producir el efecto y la implementación interna no define por sí sola el servicio.

# Pista
Busca el punto de acceso entre quien necesita el resultado y quien puede producirlo.
```

# El proveedor ofrece capacidades mediante un servicio

Un **service provider** o **proveedor de servicio** es la entidad que ofrece el uso de capacidades por medio de un servicio. La entidad puede ser una persona u organización; el concepto no exige una tecnología ni una forma particular de implementación.

El proveedor del servicio tampoco tiene que ser necesariamente la misma entidad que desarrolló o mantiene la capacidad subyacente. OASIS distingue ambos papeles porque el conocimiento del dominio y la responsabilidad de proporcionar acceso pueden pertenecer a entidades diferentes.

> Doc: [OASIS SOA-RM 1.0 — §2.1 What is Service Oriented Architecture?](https://docs.oasis-open.org/soa-rm/v1.0/soa-rm.pdf#page=8)
> Doc: [OASIS SOA-RM 1.0 — Glossary: Service Provider](https://docs.oasis-open.org/soa-rm/v1.0/soa-rm.pdf#page=29)

```verdadero-falso
# Enunciado
El proveedor del servicio debe ser siempre la misma entidad que implementó originalmente la capacidad subyacente.

# Respuesta
falso

# Explicación
OASIS permite separar la entidad que posee o desarrolla una capacidad de la entidad que finalmente proporciona el servicio mediante el que se accede a ella.

# Pista
Distingue quién posee la capacidad de quién proporciona su acceso.
```

# El consumidor utiliza servicios para satisfacer necesidades

Un **service consumer** o **consumidor de servicio** es una entidad que busca satisfacer una necesidad utilizando capacidades ofrecidas por medio de un servicio.

El término describe un papel dentro de una interacción, no una clase fija de sistema. Una misma organización puede actuar como consumidora en una interacción y como proveedora en otra.

La descripción del servicio permite que un consumidor potencial determine si el servicio puede satisfacer su necesidad y bajo qué condiciones puede utilizarlo.

> Doc: [OASIS SOA-RM 1.0 — §2.1 What is Service Oriented Architecture?](https://docs.oasis-open.org/soa-rm/v1.0/soa-rm.pdf#page=8)
> Doc: [OASIS SOA-RM 1.0 — Glossary: Service Consumer](https://docs.oasis-open.org/soa-rm/v1.0/soa-rm.pdf#page=29)

```opcion-multiple
# Enunciado
¿Qué convierte a una entidad en consumidor de servicio dentro de una interacción?

# Opciones
- Que haya desarrollado el sistema
- Que busque satisfacer una necesidad utilizando una capacidad ofrecida mediante un servicio
- Que sea propietaria de la infraestructura
- Que utilice obligatoriamente una interfaz web

# Correcta
2

# Explicación
El papel de consumidor se determina por la relación con la necesidad y el uso del servicio, no por la propiedad de la infraestructura ni por una tecnología específica.

# Pista
La definición se centra en la necesidad que la entidad intenta satisfacer.
```

# Proveedor y consumidor son participantes del servicio

OASIS utiliza **service participants** como término conjunto para los proveedores y consumidores que intervienen en el entorno de servicios. El término permite describir propiedades que afectan a ambos papeles sin repetir cada definición.

Distinguir los papeles sigue siendo necesario: el proveedor ofrece capacidades mediante un servicio y el consumidor utiliza el servicio para satisfacer una necesidad.

![Conceptos principales del modelo de referencia de SOA](https://docs.oasis-open.org/soa-rm/v1.0/soa-rm_files/image008.png)

*Figura 3 de OASIS SOA-RM 1.0: conceptos principales definidos por el modelo de referencia.*

> Doc: [OASIS SOA-RM 1.0 — §2.1 What is Service Oriented Architecture?](https://docs.oasis-open.org/soa-rm/v1.0/soa-rm.pdf#page=8)
> Doc: [OASIS SOA-RM 1.0 — §3 The Reference Model](https://docs.oasis-open.org/soa-rm/v1.0/soa-rm.pdf#page=12)

```relacionar
# Enunciado
Relaciona cada elemento con el papel que cumple dentro del modelo.

# Pares
- Necesidad => resultado que una entidad requiere
- Capacidad => efecto que un proveedor puede proporcionar
- Servicio => mecanismo que proporciona acceso a una capacidad
- Proveedor => entidad que ofrece capacidades mediante un servicio
- Consumidor => entidad que utiliza un servicio para satisfacer una necesidad

# Explicación
El modelo mantiene separados el resultado requerido, la capacidad para producirlo, el mecanismo de acceso y los dos papeles principales de la interacción.

# Pista
Distingue qué se necesita, qué puede hacerse, cómo se accede y quién ocupa cada papel.
```

# Cierre

La sesión separó los niveles de abstracción antes de definir SOA: modelo de referencia, arquitectura de referencia y arquitectura concreta. Después estableció las piezas mínimas con las que OASIS describe el paradigma: necesidades, capacidades, dominios de propiedad, servicios, proveedores y consumidores.

La sesión siguiente desarrolla la primera condición para que un consumidor pueda utilizar un servicio: la **visibilidad**, formada por awareness, willingness y reachability.
