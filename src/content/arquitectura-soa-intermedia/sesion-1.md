---
numero: 1
titulo: "De capacidades a límites de servicio"
---

# El diseño parte de capacidades, no de tablas

En SOA, una **capability** representa un efecto que un proveedor puede proporcionar. Para diseñar servicios, conviene comenzar por las capacidades que el negocio necesita exponer o combinar, no por las tablas de una base de datos ni por las clases existentes en una aplicación.

Este enfoque evita que la arquitectura copie accidentalmente la estructura interna del sistema actual. Una tabla `clientes` no demuestra por sí sola que deba existir un servicio `Clientes`; primero debe identificarse qué capacidades necesita ofrecer la organización alrededor de clientes.

> Doc: [OASIS SOA-RAF 1.0 — §3.2.1 Needs, Requirements and Capabilities](https://docs.oasis-open.org/soa-rm/soa-ra/v1.0/soa-ra.html#_Toc367360769)
> Doc: [OASIS SOA-RM 1.0 — §2.1 What is Service Oriented Architecture?](https://docs.oasis-open.org/soa-rm/v1.0/soa-rm.html#_Toc163542872)

```opcion-multiple
# Enunciado
¿Qué punto de partida es más coherente con el diseño orientado a servicios?

# Opciones
- Crear un servicio por cada tabla existente
- Identificar capacidades que deben ponerse a disposición de consumidores
- Crear un servicio por cada clase del sistema
- Separar servicios según el número de archivos fuente

# Correcta
2

# Explicación
SOA organiza el acceso a capacidades. La estructura de tablas o clases pertenece a la implementación y no determina por sí sola los límites de servicio.

# Pista
Empieza por lo que la organización puede hacer, no por cómo lo almacena.
```

# Un service candidate representa una propuesta de acceso

Antes de existir como servicio publicado, una capacidad puede originar un **candidato a servicio**. El candidato es una decisión de diseño: propone qué capacidad o conjunto coherente de capacidades debe ofrecerse mediante una interfaz prescrita.

No toda capacidad necesita convertirse en un servicio independiente. Algunas capacidades pueden permanecer internas; otras pueden agruparse cuando tienen objetivos, políticas y ciclos de cambio estrechamente relacionados.

> Doc: [OASIS SOA-RAF 1.0 — §3.2.2 Services Reflecting Business](https://docs.oasis-open.org/soa-rm/soa-ra/v1.0/soa-ra.html#_Toc367360770)

```verdadero-falso
# Enunciado
Toda capacidad identificada en una organización debe publicarse necesariamente como un servicio independiente.

# Respuesta
falso

# Explicación
Una capacidad puede permanecer interna o formar parte de un servicio junto con capacidades relacionadas. El servicio es una decisión de acceso y exposición.

# Pista
Capability y service no son sinónimos.
```

# La frontera del servicio define responsabilidad visible

La **frontera de un servicio** determina qué comportamiento y qué información se presentan como una unidad coherente frente a los consumidores. La frontera debe permitir describir con claridad qué responsabilidad asume el servicio y qué aspectos permanecen fuera de ella.

Una frontera útil reduce la necesidad de que el consumidor conozca detalles privados del proveedor. Si para completar una operación el consumidor debe coordinar manualmente numerosos detalles internos, la frontera probablemente está exponiendo una descomposición demasiado cercana a la implementación.

> Doc: [OASIS SOA-RM 1.0 — §3.1 Service](https://docs.oasis-open.org/soa-rm/v1.0/soa-rm.html#_Toc163542881)
> Doc: [OASIS SOA-RAF 1.0 — §4.1.1 Description](https://docs.oasis-open.org/soa-rm/soa-ra/v1.0/soa-ra.html#_Toc367360788)

```opcion-multiple
# Enunciado
¿Qué evidencia sugiere una frontera de servicio deficiente?

# Opciones
- El consumidor puede describir la responsabilidad del servicio con claridad
- El consumidor debe conocer varios pasos internos del proveedor para completar una sola responsabilidad
- La implementación interna puede cambiar sin alterar la interfaz
- La descripción distingue claramente comportamiento público y privado

# Correcta
2

# Explicación
Cuando el consumidor necesita coordinar detalles internos para conseguir una sola responsabilidad, la frontera expone demasiado de la implementación.

# Pista
Una buena frontera oculta cómo se realiza internamente la capacidad.
```

# La cohesión agrupa capacidades que cambian por razones relacionadas

Una frontera puede considerarse más **cohesiva** cuando las capacidades agrupadas responden a una responsabilidad relacionada y tienden a cambiar por motivos semejantes.

Por ejemplo, autorizar un pago y consultar el estado de esa autorización pueden compartir políticas, semántica y ownership. En cambio, autorizar pagos y gestionar el catálogo de productos suelen obedecer a responsabilidades distintas aunque aparezcan dentro del mismo proceso de compra.

> Doc: [OASIS SOA-RAF 1.0 — §3.2.2 Services Reflecting Business](https://docs.oasis-open.org/soa-rm/soa-ra/v1.0/soa-ra.html#_Toc367360770)

```relacionar
# Enunciado
Relaciona cada capacidad con la agrupación más coherente.

# Pares
- Autorizar pago => Servicio de pagos
- Consultar estado de autorización => Servicio de pagos
- Consultar disponibilidad de producto => Servicio de inventario
- Reservar unidades disponibles => Servicio de inventario

# Explicación
Las capacidades se agrupan por responsabilidad relacionada, no porque participen en el mismo proceso de negocio.

# Pista
Distingue responsabilidad de pagos de responsabilidad sobre disponibilidad física.
```

# La granularidad es un trade-off, no una regla universal

OASIS evita convertir expresiones como **coarse-grained** en una definición normativa de SOA. La granularidad depende del problema que se intenta resolver y no puede decidirse universalmente contando operaciones, mensajes o componentes.

Un servicio excesivamente pequeño puede obligar a los consumidores a coordinar numerosos intercambios. Un servicio demasiado amplio puede acumular responsabilidades con políticas, ownership y ciclos de cambio diferentes.

> Doc: [OASIS SOA-RM 1.0 — §2.1 What is Service Oriented Architecture?](https://docs.oasis-open.org/soa-rm/v1.0/soa-rm.html#_Toc163542872)

```verdadero-falso
# Enunciado
Un servicio es arquitectónicamente mejor cuanto menos operaciones tenga.

# Respuesta
falso

# Explicación
OASIS no define una métrica universal de granularidad. La frontera debe evaluarse respecto de responsabilidades, consumidores, políticas y efectos.

# Pista
Contar operaciones no revela por sí solo si el límite es correcto.
```

# Chatty interaction puede revelar una frontera demasiado fina

Una interacción es **chatty** cuando el consumidor necesita muchas llamadas pequeñas para completar una responsabilidad que conceptualmente percibe como una sola operación.

No toda secuencia de llamadas es un problema: algunos procesos son legítimamente multi-step. La señal de alerta aparece cuando los intercambios adicionales existen únicamente porque el proveedor expuso detalles internos que podrían permanecer dentro de su frontera.

> Doc: [OASIS SOA-RAF 1.0 — §4.3.5 Architectural Implications of Interacting with Services](https://docs.oasis-open.org/soa-rm/soa-ra/v1.0/soa-ra.html#_Toc367360823)

```opcion-multiple
# Enunciado
¿Cuál es la mejor señal de una interacción innecesariamente chatty?

# Opciones
- El proceso empresarial requiere legítimamente varios estados observables
- El consumidor realiza numerosas llamadas para reconstruir una sola responsabilidad interna del proveedor
- El servicio tiene más de un consumidor
- La operación devuelve un error de negocio

# Correcta
2

# Explicación
La conversación excesiva es problemática cuando el consumidor compensa una frontera que expone detalles internos en lugar de una capacidad coherente.

# Pista
Pregunta si las múltiples llamadas representan negocio real o implementación filtrada.
```

# Ownership ayuda a separar responsabilidades

Las **ownership boundaries** son una señal importante para el diseño. Cuando dos capacidades están controladas por dominios distintos, sus políticas, datos, ciclos de evolución y decisiones pueden divergir.

Eso no obliga a crear siempre un servicio por organización, pero sí exige reconocer que una frontera que atraviesa ownership diferentes introduce coordinación adicional.

> Doc: [OASIS SOA-RM 1.0 — §2.1 What is Service Oriented Architecture?](https://docs.oasis-open.org/soa-rm/v1.0/soa-rm.html#_Toc163542872)
> Doc: [OASIS SOA-RAF 1.0 — §3.1.3 Resource and Ownership](https://docs.oasis-open.org/soa-rm/soa-ra/v1.0/soa-ra.html#_Toc367360763)

```opcion-multiple
# Enunciado
Dos capacidades tienen reglas, responsables y ciclos de cambio administrados por áreas independientes. ¿Qué conclusión es razonable?

# Opciones
- Deben compartir obligatoriamente la misma frontera
- La diferencia de ownership es una señal para evaluar fronteras separadas
- Deben usar la misma base de datos
- Deben convertirse en una única operación

# Correcta
2

# Explicación
Ownership independiente aumenta la probabilidad de políticas y evolución distintas, por lo que conviene evaluar si las capacidades deben permanecer separadas.

# Pista
No es una regla automática, pero sí una señal arquitectónica.
```

# Un servicio no debe copiar una entidad CRUD por defecto

Diseñar un servicio como una colección de operaciones **Create, Read, Update y Delete (CRUD)** sobre una entidad puede ser válido cuando esas operaciones representan realmente la capacidad expuesta. El problema aparece cuando CRUD se utiliza automáticamente como criterio de frontera.

Una interfaz `crearCliente / leerCliente / actualizarCliente / borrarCliente` puede revelar la estructura de persistencia sin expresar capacidades como verificar identidad, registrar consentimiento o habilitar una relación comercial.

> Doc: [OASIS SOA-RM 1.0 — §3.3.1.2 Service Functionality](https://docs.oasis-open.org/soa-rm/v1.0/soa-rm.html#_Toc163542892)

```verdadero-falso
# Enunciado
Toda entidad persistida debe exponerse como un servicio CRUD independiente.

# Respuesta
falso

# Explicación
La persistencia es un detalle de implementación. Las fronteras SOA deben partir de funcionalidad y capacidades que resulten significativas para los consumidores.

# Pista
Una tabla no es automáticamente una capacidad.
```

# El inventario inicial debe registrar responsabilidad, consumidores y dependencias

Antes de definir protocolos, conviene registrar para cada candidato al menos: responsabilidad, capacidades expuestas, posibles consumidores, ownership, policies relevantes y dependencias externas.

Este inventario no es todavía un service registry operacional. Es una herramienta de diseño para comparar candidatos y detectar solapamientos, vacíos y dependencias innecesarias.

> Doc: [OASIS SOA-RAF 1.0 — §4.1.1 Description](https://docs.oasis-open.org/soa-rm/soa-ra/v1.0/soa-ra.html#_Toc367360788)
> Doc: [OASIS SOA-RAF 1.0 — §4.2.2 Visibility](https://docs.oasis-open.org/soa-rm/soa-ra/v1.0/soa-ra.html#_Toc367360795)

```relacionar
# Enunciado
Relaciona cada dato del inventario con la pregunta que responde.

# Pares
- Responsabilidad => ¿qué resultado coherente ofrece este candidato?
- Consumidores => ¿quién necesita utilizarlo?
- Ownership => ¿quién controla su evolución?
- Policies => ¿bajo qué condiciones puede utilizarse?
- Dependencias => ¿qué capacidades externas necesita para cumplir su responsabilidad?

# Explicación
El inventario permite evaluar candidatos antes de fijar tecnología y contratos.

# Pista
Cada dato describe una dimensión distinta del límite propuesto.
```

# Cierre

La identificación de servicios parte de **capacidades, responsabilidades, consumidores y ownership**. La granularidad se decide como trade-off y no contando endpoints, tablas o clases.

La siguiente sesión transforma un candidato a servicio síncrono en un contrato verificable mediante **contract-first design** y OpenAPI.
